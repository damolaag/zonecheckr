import { NextRequest, NextResponse } from "next/server";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

export const runtime = "nodejs";

function normalizeUrl(raw: string) {
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return new URL(withProtocol);
}

function isPrivateIp(address: string) {
  const ip = address.toLowerCase();
  if (ip.includes(":")) {
    return ip === "::1" || ip.startsWith("fc") || ip.startsWith("fd") || ip.startsWith("fe80:") || ip === "::";
  }

  return (
    ip.startsWith("10.") ||
    ip.startsWith("127.") ||
    ip.startsWith("169.254.") ||
    ip.startsWith("192.168.") ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(ip) ||
    ip === "0.0.0.0"
  );
}

async function assertPublicHost(url: URL) {
  const hostname = url.hostname.toLowerCase();
  if (hostname === "localhost" || hostname.endsWith(".local")) throw new Error("blocked");
  if (isIP(hostname)) {
    if (isPrivateIp(hostname)) throw new Error("blocked");
    return;
  }

  const addresses = await lookup(hostname, { all: true, verbatim: true });
  if (!addresses.length || addresses.some(({ address }) => isPrivateIp(address))) throw new Error("blocked");
}

async function fetchWithSafeRedirects(initialUrl: URL) {
  let current = initialUrl;
  let redirected = false;

  for (let hop = 0; hop <= 5; hop += 1) {
    await assertPublicHost(current);
    const response = await fetch(current, {
      method: "GET",
      redirect: "manual",
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
      headers: { "User-Agent": "ZoneCheckr/1.0 website status checker" },
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) return { response, finalUrl: current.toString(), redirected };
      if (hop === 5) throw new Error("redirect-limit");
      current = new URL(location, current);
      if (!["http:", "https:"].includes(current.protocol)) throw new Error("blocked");
      redirected = true;
      continue;
    }

    return { response, finalUrl: current.toString(), redirected };
  }

  throw new Error("redirect-limit");
}

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("url")?.trim();
  if (!raw) return NextResponse.json({ error: "Please provide a website URL." }, { status: 400 });

  let target: URL;
  try {
    target = normalizeUrl(raw);
  } catch {
    return NextResponse.json({ error: "Please enter a valid website URL." }, { status: 400 });
  }

  if (!["http:", "https:"].includes(target.protocol)) {
    return NextResponse.json({ error: "Only HTTP and HTTPS websites can be checked." }, { status: 400 });
  }

  const started = performance.now();
  try {
    const { response, finalUrl, redirected } = await fetchWithSafeRedirects(target);
    const responseTimeMs = Math.round(performance.now() - started);

    return NextResponse.json({
      requestedUrl: target.toString(),
      finalUrl,
      status: response.status,
      statusText: response.statusText,
      redirected,
      responseTimeMs,
      contentType: response.headers.get("content-type"),
      server: response.headers.get("server"),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "blocked") {
      return NextResponse.json({ error: "Private or local network addresses cannot be checked." }, { status: 400 });
    }
    if (error instanceof Error && error.message === "redirect-limit") {
      return NextResponse.json({ error: "The website redirected too many times." }, { status: 502 });
    }
    return NextResponse.json({ error: "The website did not return a response within the allowed time." }, { status: 502 });
  }
}
