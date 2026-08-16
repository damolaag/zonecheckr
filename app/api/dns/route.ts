import { NextRequest, NextResponse } from "next/server";

const allowedTypes = new Set(["A", "AAAA", "CNAME", "MX", "NS", "TXT"]);
const domainPattern = /^(?=.{1,253}$)(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}$/;

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
    const endpoint = new URL("https://dns.google/resolve");
    endpoint.searchParams.set("name", name);
    endpoint.searchParams.set("type", type);
    endpoint.searchParams.set("cd", "0");

    const response = await fetch(endpoint, {
      headers: { Accept: "application/dns-json" },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "DNS provider returned an error." }, { status: 502 });
    }

    const data = await response.json();

    return NextResponse.json({
      status: data.Status,
      question: data.Question,
      answer: data.Answer || [],
    });
  } catch {
    return NextResponse.json({ error: "Unable to complete the DNS lookup." }, { status: 500 });
  }
}
