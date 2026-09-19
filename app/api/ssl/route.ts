import { NextRequest, NextResponse } from "next/server";
import tls from "node:tls";
import dns from "node:dns/promises";
import net from "node:net";

export const runtime = "nodejs";

function normalizeHost(input: string) {
  return input.trim().toLowerCase().replace(/^https?:\/\//, "").split("/")[0].split(":")[0];
}
function isPrivate(ip: string) {
  if (net.isIPv4(ip)) {
    const [a,b] = ip.split(".").map(Number);
    return a === 10 || a === 127 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || a === 0;
  }
  const value = ip.toLowerCase();
  return value === "::1" || value.startsWith("fc") || value.startsWith("fd") || value.startsWith("fe80:");
}
export async function GET(request: NextRequest) {
  const host = normalizeHost(request.nextUrl.searchParams.get("host") || "");
  if (!host || !host.includes(".") || host.length > 253) return NextResponse.json({ error: "Enter a valid hostname." }, { status: 400 });
  try {
    const addresses = await dns.lookup(host, { all: true });
    if (!addresses.length || addresses.some((item) => isPrivate(item.address))) return NextResponse.json({ error: "Private or local hosts are not supported." }, { status: 400 });
    const result = await new Promise<Record<string, unknown>>((resolve, reject) => {
      const socket = tls.connect({ host, port: 443, servername: host, rejectUnauthorized: false, timeout: 7000 }, () => {
        const cert = socket.getPeerCertificate(true);
        const authorized = socket.authorized;
        const authorizationError = socket.authorizationError;
        const protocol = socket.getProtocol();
        socket.end();
        if (!cert || !cert.valid_to) return reject(new Error("No TLS certificate was returned."));
        const expiresAt = new Date(cert.valid_to);
        const daysRemaining = Math.ceil((expiresAt.getTime() - Date.now()) / 86400000);
        resolve({ host, authorized, authorizationError: authorizationError ? String(authorizationError) : null, protocol, subject: cert.subject?.CN || host, issuer: cert.issuer?.O || cert.issuer?.CN || "Unknown", validFrom: cert.valid_from, validTo: cert.valid_to, daysRemaining, fingerprint256: cert.fingerprint256, serialNumber: cert.serialNumber, altNames: cert.subjectaltname?.split(", ").slice(0, 20) || [] });
      });
      socket.on("timeout", () => socket.destroy(new Error("Connection timed out.")));
      socket.on("error", reject);
    });
    return NextResponse.json(result, { headers: { "Cache-Control": "public, max-age=300" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "SSL check failed." }, { status: 502 });
  }
}
