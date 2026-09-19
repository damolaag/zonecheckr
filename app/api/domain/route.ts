import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const domain = (request.nextUrl.searchParams.get("domain") || "").trim().toLowerCase().replace(/^https?:\/\//, "").split("/")[0];
  if (!domain || !domain.includes(".") || domain.length > 253) return NextResponse.json({ error: "Enter a valid domain." }, { status: 400 });
  try {
    const response = await fetch(`https://rdap.org/domain/${encodeURIComponent(domain)}`, { signal: AbortSignal.timeout(8000), headers: { Accept: "application/rdap+json" } });
    if (!response.ok) return NextResponse.json({ error: response.status === 404 ? "No RDAP registration record was found." : "The registry lookup failed." }, { status: response.status === 404 ? 404 : 502 });
    const data = await response.json();
    const events = Object.fromEntries((data.events || []).map((event: { eventAction: string; eventDate: string }) => [event.eventAction, event.eventDate]));
    const registrar = (data.entities || []).find((entity: { roles?: string[] }) => entity.roles?.includes("registrar"));
    const vcard = registrar?.vcardArray?.[1] || [];
    const fn = vcard.find((entry: unknown[]) => entry[0] === "fn")?.[3];
    return NextResponse.json({ domain: data.ldhName || domain, handle: data.handle || null, registrar: fn || registrar?.handle || "Not listed", status: data.status || [], nameservers: (data.nameservers || []).map((ns: { ldhName: string }) => ns.ldhName), registrationDate: events.registration || null, expirationDate: events.expiration || null, lastChanged: events["last changed"] || null, secureDNS: Boolean(data.secureDNS?.delegationSigned) }, { headers: { "Cache-Control": "public, max-age=3600" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Domain lookup failed." }, { status: 502 });
  }
}
