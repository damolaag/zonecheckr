import { NextRequest, NextResponse } from "next/server";

const allowedTypes = new Set(["A", "AAAA", "CNAME", "MX", "NS", "TXT"]);
const domainPattern = /^(?=.{1,253}$)(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}$/;

const resolvers = [
  { name: "Google Public DNS", url: "https://dns.google/resolve" },
  { name: "Cloudflare 1.1.1.1", url: "https://cloudflare-dns.com/dns-query" },
  { name: "Quad9", url: "https://dns.quad9.net:5053/dns-query" },
];

type DnsJson = {
  Status?: number;
  Answer?: Array<{ data: string }>;
};

export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get("name")?.trim().toLowerCase();
  const type = request.nextUrl.searchParams.get("type")?.trim().toUpperCase() || "A";

  if (!name || !domainPattern.test(name)) {
    return NextResponse.json({ error: "Please provide a valid domain name." }, { status: 400 });
  }
  if (!allowedTypes.has(type)) {
    return NextResponse.json({ error: "Unsupported DNS record type." }, { status: 400 });
  }

  const results = await Promise.all(
    resolvers.map(async (resolver) => {
      try {
        const endpoint = new URL(resolver.url);
        endpoint.searchParams.set("name", name);
        endpoint.searchParams.set("type", type);
        const response = await fetch(endpoint, {
          headers: { Accept: "application/dns-json" },
          cache: "no-store",
          signal: AbortSignal.timeout(5000),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = (await response.json()) as DnsJson;
        return {
          resolver: resolver.name,
          status: data.Status ?? null,
          answers: (data.Answer || []).map((answer) => answer.data).sort(),
        };
      } catch {
        return { resolver: resolver.name, status: null, answers: [], error: "Resolver did not respond." };
      }
    }),
  );

  const successful = results.filter((result) => !result.error);
  const fingerprints = successful.map((result) => JSON.stringify(result.answers));
  const consistent = fingerprints.length > 1 && fingerprints.every((value) => value === fingerprints[0]);

  return NextResponse.json({ name, type, consistent, results });
}
