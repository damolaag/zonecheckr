import { NextRequest, NextResponse } from "next/server";
import { promises as dns } from "node:dns";
import tls from "node:tls";
import net from "node:net";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const domainPattern =
  /^(?=.{1,253}$)(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}$/;

const selectorPattern = /^[a-zA-Z0-9_-]{1,63}$/;

type CheckStatus = "pass" | "warning" | "info" | "fail";

type Check = {
  key: string;
  label: string;
  category: "DNS" | "Email" | "Web" | "Security";
  status: CheckStatus;
  summary: string;
  detail?: string | null;
};

type TlsInfo = {
  authorized: boolean;
  daysRemaining: number;
  issuer: string;
  protocol: string | null;
};

function txtStrings(records: string[][]) {
  return records.map((parts) => parts.join(""));
}

async function safe<T, F>(fn: () => Promise<T>, fallback: F): Promise<T | F> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

function isPrivateIp(ip: string) {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split(".").map(Number);

    return (
      a === 10 ||
      a === 127 ||
      a === 0 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168)
    );
  }

  const value = ip.toLowerCase();

  return (
    value === "::" ||
    value === "::1" ||
    value.startsWith("fc") ||
    value.startsWith("fd") ||
    value.startsWith("fe80:")
  );
}

async function isPublicDomain(host: string) {
  const addresses = await dns.lookup(host, { all: true });

  return (
    addresses.length > 0 &&
    addresses.every((item) => !isPrivateIp(item.address))
  );
}

function parseTags(record: string) {
  return Object.fromEntries(
    record
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const i = part.indexOf("=");

        return i < 0
          ? [part, ""]
          : [part.slice(0, i).trim(), part.slice(i + 1).trim()];
      }),
  );
}

async function inspectTls(host: string): Promise<TlsInfo> {
  return new Promise((resolve, reject) => {
    const socket = tls.connect(
      {
        host,
        port: 443,
        servername: host,
        timeout: 7000,
      },
      () => {
        const cert = socket.getPeerCertificate();
        const authorized = socket.authorized;
        const protocol = socket.getProtocol();

        if (!cert || !cert.valid_to) {
          socket.end();
          reject(new Error("no-cert"));
          return;
        }

        const daysRemaining = Math.ceil(
          (new Date(cert.valid_to).getTime() - Date.now()) / 86400000,
        );

        const issuerValue = cert.issuer?.O || cert.issuer?.CN || "Unknown";

        const issuer = Array.isArray(issuerValue)
          ? issuerValue.join(", ")
          : issuerValue;

        socket.end();

        resolve({
          authorized,
          daysRemaining,
          issuer,
          protocol,
        });
      },
    );

    socket.on("timeout", () => {
      socket.destroy(new Error("timeout"));
    });

    socket.on("error", reject);
  });
}

async function inspectHttps(host: string) {
  const started = performance.now();

  const response = await fetch(`https://${host}`, {
    method: "HEAD",
    redirect: "manual",
    cache: "no-store",
    signal: AbortSignal.timeout(7000),
    headers: {
      "User-Agent": "ZoneCheckr/1.0 domain health checker",
    },
  });

  return {
    status: response.status,
    url: response.url,
    ms: Math.round(performance.now() - started),
  };
}

export async function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams
    .get("domain")
    ?.trim()
    .toLowerCase();

  const selector =
    request.nextUrl.searchParams.get("selector")?.trim().toLowerCase() || "";

  if (!domain || !domainPattern.test(domain)) {
    return NextResponse.json(
      {
        error: "Please provide a valid domain name.",
      },
      {
        status: 400,
      },
    );
  }

  if (selector && !selectorPattern.test(selector)) {
    return NextResponse.json(
      {
        error: "Please provide a valid DKIM selector.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const publicDomain = await isPublicDomain(domain);

    if (!publicDomain) {
      return NextResponse.json(
        {
          error: "Private or local network addresses cannot be checked.",
        },
        {
          status: 400,
        },
      );
    }

    const [a, aaaa, ns, soa, mx, rootTxt, dmarcTxt, caa, tlsInfo, webInfo] =
      await Promise.all([
        safe(() => dns.resolve4(domain), [] as string[]),

        safe(() => dns.resolve6(domain), [] as string[]),

        safe(() => dns.resolveNs(domain), [] as string[]),

        safe(() => dns.resolveSoa(domain), null),

        safe(
          () => dns.resolveMx(domain),
          [] as Array<{
            exchange: string;
            priority: number;
          }>,
        ),

        safe(() => dns.resolveTxt(domain), [] as string[][]),

        safe(() => dns.resolveTxt(`_dmarc.${domain}`), [] as string[][]),

        safe(() => dns.resolveCaa(domain), []),

        safe(() => inspectTls(domain), null),

        safe(() => inspectHttps(domain), null),
      ]);

    const spfRecords = txtStrings(rootTxt).filter((record) =>
      record.toLowerCase().startsWith("v=spf1"),
    );

    const dmarcRecord =
      txtStrings(dmarcTxt).find((record) =>
        record.toLowerCase().startsWith("v=dmarc1"),
      ) || null;

    const dmarcTags = dmarcRecord ? parseTags(dmarcRecord) : {};

    const dkimName = selector ? `${selector}._domainkey.${domain}` : null;

    const dkimTxt = dkimName
      ? txtStrings(await safe(() => dns.resolveTxt(dkimName), [] as string[][]))
      : [];

    const dkimRecord =
      dkimTxt.find(
        (record) =>
          record.toLowerCase().includes("v=dkim1") ||
          /(?:^|;)\s*p=/i.test(record),
      ) || null;

    const checks: Check[] = [
      {
        key: "a",
        label: "A record",
        category: "DNS",
        status: a.length ? "pass" : "fail",
        summary: a.length
          ? `${a.length} IPv4 address${a.length === 1 ? "" : "es"} found.`
          : "No A record found.",
        detail: a.join(", ") || null,
      },

      {
        key: "aaaa",
        label: "AAAA record",
        category: "DNS",
        status: aaaa.length ? "pass" : "info",
        summary: aaaa.length
          ? `${aaaa.length} IPv6 address${aaaa.length === 1 ? "" : "es"} found.`
          : "No IPv6 record found. IPv6 is optional for many sites.",
        detail: aaaa.join(", ") || null,
      },

      {
        key: "ns",
        label: "Nameservers",
        category: "DNS",
        status: ns.length >= 2 ? "pass" : ns.length ? "warning" : "fail",
        summary: ns.length
          ? `${ns.length} authoritative nameserver${
              ns.length === 1 ? "" : "s"
            } found.`
          : "No nameservers found.",
        detail: ns.join(", ") || null,
      },

      {
        key: "soa",
        label: "SOA",
        category: "DNS",
        status: soa ? "pass" : "fail",
        summary: soa
          ? "Start of Authority record found."
          : "No SOA record found.",
        detail: soa ? `${soa.nsname} · serial ${soa.serial}` : null,
      },

      {
        key: "mx",
        label: "MX",
        category: "Email",
        status: mx.length ? "pass" : "info",
        summary: mx.length
          ? `${mx.length} mail exchanger${mx.length === 1 ? "" : "s"} found.`
          : "No MX record found. This is fine if the domain does not receive email.",
        detail:
          mx
            .sort((x, y) => x.priority - y.priority)
            .map((record) => `${record.priority} ${record.exchange}`)
            .join(", ") || null,
      },

      {
        key: "spf",
        label: "SPF",
        category: "Email",
        status:
          spfRecords.length === 1
            ? "pass"
            : spfRecords.length > 1
              ? "warning"
              : "info",
        summary:
          spfRecords.length === 1
            ? "One SPF policy found."
            : spfRecords.length > 1
              ? "Multiple SPF records found; SPF should normally use one policy."
              : "No SPF record found.",
        detail: spfRecords.join(" | ") || null,
      },

      {
        key: "dmarc",
        label: "DMARC",
        category: "Email",
        status: dmarcRecord
          ? String(dmarcTags.p || "").toLowerCase() === "none"
            ? "warning"
            : "pass"
          : "info",
        summary: dmarcRecord
          ? `DMARC policy is ${dmarcTags.p || "not specified"}.`
          : "No DMARC policy found.",
        detail: dmarcRecord,
      },

      {
        key: "dkim",
        label: "DKIM",
        category: "Email",
        status: !selector ? "info" : dkimRecord ? "pass" : "warning",
        summary: !selector
          ? "Not checked — provide a DKIM selector."
          : dkimRecord
            ? `DKIM found for selector ${selector}.`
            : `No DKIM record found for selector ${selector}.`,
        detail: dkimRecord,
      },

      {
        key: "caa",
        label: "CAA",
        category: "Security",
        status: caa.length ? "pass" : "info",
        summary: caa.length
          ? `${caa.length} CAA record${caa.length === 1 ? "" : "s"} found.`
          : "No CAA record found. CAA is optional but can restrict certificate issuance.",
      },

      {
        key: "ssl",
        label: "SSL/TLS",
        category: "Security",
        status:
          tlsInfo?.authorized && tlsInfo.daysRemaining > 14
            ? "pass"
            : tlsInfo
              ? "warning"
              : "fail",
        summary: tlsInfo
          ? `${
              tlsInfo.authorized
                ? "Certificate trusted"
                : "Certificate not fully trusted"
            }; ${tlsInfo.daysRemaining} days remaining.`
          : "Could not establish a TLS connection.",
        detail: tlsInfo
          ? `${tlsInfo.issuer} · ${tlsInfo.protocol || "TLS"}`
          : null,
      },

      {
        key: "https",
        label: "HTTPS response",
        category: "Web",
        status:
          webInfo && webInfo.status < 400
            ? "pass"
            : webInfo && webInfo.status < 500
              ? "warning"
              : "fail",
        summary: webInfo
          ? `HTTP ${webInfo.status} in ${webInfo.ms} ms.`
          : "No HTTPS response received.",
        detail: webInfo?.url || null,
      },
    ];

    const counts = checks.reduce<Record<CheckStatus, number>>(
      (acc, check) => {
        acc[check.status] += 1;
        return acc;
      },
      {
        pass: 0,
        warning: 0,
        info: 0,
        fail: 0,
      },
    );

    return NextResponse.json(
      {
        domain,
        selector: selector || null,
        counts,
        checks,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("ZoneCheckr domain health check failed", {
      domain,
      selector,
      error,
    });

    return NextResponse.json(
      {
        error: "Unable to complete the domain health check right now.",
      },
      {
        status: 502,
      },
    );
  }
}
