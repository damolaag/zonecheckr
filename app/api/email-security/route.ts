import { NextRequest, NextResponse } from "next/server";
import { promises as dns } from "node:dns";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const domainPattern = /^(?=.{1,253}$)(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}$/;
const selectorPattern = /^[a-zA-Z0-9_-]{1,63}$/;

function flattenTxt(records: string[][]) {
  return records.map((parts) => parts.join(""));
}

async function safeTxt(name: string) {
  try {
    return flattenTxt(await dns.resolveTxt(name));
  } catch (error) {
    const code = typeof error === "object" && error && "code" in error ? String((error as { code?: string }).code ?? "") : "";
    if (["ENODATA", "ENOTFOUND", "ENONAME", "ESERVFAIL", "EREFUSED"].includes(code)) return [];
    throw error;
  }
}

function parseTagRecord(record: string) {
  return Object.fromEntries(
    record
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf("=");
        return index === -1 ? [part, ""] : [part.slice(0, index).trim(), part.slice(index + 1).trim()];
      }),
  );
}

export async function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams.get("domain")?.trim().toLowerCase();
  const selector = request.nextUrl.searchParams.get("selector")?.trim().toLowerCase() || "";

  if (!domain || !domainPattern.test(domain)) {
    return NextResponse.json({ error: "Please provide a valid domain name." }, { status: 400 });
  }

  if (selector && !selectorPattern.test(selector)) {
    return NextResponse.json({ error: "Please provide a valid DKIM selector." }, { status: 400 });
  }

  try {
    const [rootTxt, dmarcTxt, mx] = await Promise.all([
      safeTxt(domain),
      safeTxt(`_dmarc.${domain}`),
      dns.resolveMx(domain).catch(() => []),
    ]);

    const spfRecords = rootTxt.filter((record) => record.toLowerCase().startsWith("v=spf1"));
    const dmarcRecords = dmarcTxt.filter((record) => record.toLowerCase().startsWith("v=dmarc1"));
    const dkimName = selector ? `${selector}._domainkey.${domain}` : null;
    const dkimTxt = dkimName ? await safeTxt(dkimName) : [];
    const dkimRecords = dkimTxt.filter((record) => record.toLowerCase().includes("v=dkim1") || record.toLowerCase().includes("p="));

    const spf = spfRecords[0] || null;
    const dmarc = dmarcRecords[0] || null;
    const dkim = dkimRecords[0] || null;
    const dmarcTags = dmarc ? parseTagRecord(dmarc) : {};
    const dkimTags = dkim ? parseTagRecord(dkim) : {};

    return NextResponse.json({
      domain,
      mx: mx.sort((a, b) => a.priority - b.priority),
      spf: {
        found: Boolean(spf),
        record: spf,
        multiple: spfRecords.length > 1,
      },
      dmarc: {
        found: Boolean(dmarc),
        record: dmarc,
        policy: dmarcTags.p || null,
        subdomainPolicy: dmarcTags.sp || null,
        aggregateReports: dmarcTags.rua || null,
        forensicReports: dmarcTags.ruf || null,
        percentage: dmarcTags.pct || null,
        alignmentDkim: dmarcTags.adkim || null,
        alignmentSpf: dmarcTags.aspf || null,
      },
      dkim: {
        checked: Boolean(selector),
        selector: selector || null,
        name: dkimName,
        found: Boolean(dkim),
        record: dkim,
        keyType: dkimTags.k || (dkim ? "rsa" : null),
        publicKeyPresent: Boolean(dkimTags.p),
      },
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("ZoneCheckr email security check failed", { domain, selector, error });
    return NextResponse.json({ error: "Unable to complete the email security check right now." }, { status: 502 });
  }
}
