import { NextRequest, NextResponse } from "next/server";
import { promises as dns } from "node:dns";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedTypes = new Set(["A", "AAAA", "CNAME", "MX", "NS", "TXT", "SOA", "CAA"]);
const domainPattern = /^(?=.{1,253}$)(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}$/;

type NormalizedAnswer = {
  name: string;
  type: number;
  TTL: number | null;
  data: string;
};

const typeNumbers: Record<string, number> = {
  A: 1,
  NS: 2,
  CNAME: 5,
  SOA: 6,
  MX: 15,
  TXT: 16,
  AAAA: 28,
  CAA: 257,
};

async function resolveRecords(name: string, type: string): Promise<NormalizedAnswer[]> {
  const typeNumber = typeNumbers[type] ?? 0;

  switch (type) {
    case "A": {
      const records = await dns.resolve4(name, { ttl: true });
      return records.map((record) => ({ name, type: typeNumber, TTL: record.ttl, data: record.address }));
    }
    case "AAAA": {
      const records = await dns.resolve6(name, { ttl: true });
      return records.map((record) => ({ name, type: typeNumber, TTL: record.ttl, data: record.address }));
    }
    case "CNAME": {
      const records = await dns.resolveCname(name);
      return records.map((record) => ({ name, type: typeNumber, TTL: null, data: record }));
    }
    case "MX": {
      const records = await dns.resolveMx(name);
      return records
        .sort((a, b) => a.priority - b.priority)
        .map((record) => ({ name, type: typeNumber, TTL: null, data: `${record.priority} ${record.exchange}` }));
    }
    case "NS": {
      const records = await dns.resolveNs(name);
      return records.map((record) => ({ name, type: typeNumber, TTL: null, data: record }));
    }
    case "TXT": {
      const records = await dns.resolveTxt(name);
      return records.map((record) => ({ name, type: typeNumber, TTL: null, data: record.join("") }));
    }
    case "SOA": {
      const record = await dns.resolveSoa(name);
      const data = [
        `primary=${record.nsname}`,
        `hostmaster=${record.hostmaster}`,
        `serial=${record.serial}`,
        `refresh=${record.refresh}`,
        `retry=${record.retry}`,
        `expire=${record.expire}`,
        `minttl=${record.minttl}`,
      ].join(" ");
      return [{ name, type: typeNumber, TTL: null, data }];
    }
    case "CAA": {
      const records = await dns.resolveCaa(name);
      return records.map((record) => {
        const caa = record as { critical?: number; issue?: string; issuewild?: string; iodef?: string };
        const directive = caa.issue != null ? "issue" : caa.issuewild != null ? "issuewild" : caa.iodef != null ? "iodef" : "CAA";
        const value = caa.issue ?? caa.issuewild ?? caa.iodef ?? "";
        const tag = caa.critical ? "critical" : "standard";
        return { name, type: typeNumber, TTL: null, data: `${directive} "${value}" (${tag})` };
      });
    }
    default:
      return [];
  }
}

export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get("name")?.trim().toLowerCase();
  const type = request.nextUrl.searchParams.get("type")?.trim().toUpperCase() || "A";

  if (!name || !domainPattern.test(name)) {
    return NextResponse.json({ error: "Please provide a valid domain name." }, { status: 400 });
  }

  if (!allowedTypes.has(type)) {
    return NextResponse.json({ error: "Unsupported DNS record type." }, { status: 400 });
  }

  try {
    const answer = await resolveRecords(name, type);
    return NextResponse.json(
      {
        status: 0,
        question: [{ name, type: typeNumbers[type] ?? 0 }],
        answer,
        provider: "System DNS resolver",
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    const code = typeof error === "object" && error && "code" in error ? String((error as { code?: string }).code ?? "") : "";

    if (["ENODATA", "ENOTFOUND", "ENONAME", "ESERVFAIL", "EREFUSED", "ENOTIMP"].includes(code)) {
      return NextResponse.json(
        {
          status: code === "ENOTFOUND" ? 3 : 0,
          question: [{ name, type: typeNumbers[type] ?? 0 }],
          answer: [],
          provider: "System DNS resolver",
        },
        { headers: { "Cache-Control": "no-store" } },
      );
    }

    console.error("ZoneCheckr DNS lookup failed", { name, type, error });
    return NextResponse.json(
      { error: "Unable to complete the DNS lookup right now. Please try again." },
      { status: 502 },
    );
  }
}
