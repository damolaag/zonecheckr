import { NextRequest, NextResponse } from "next/server";

<<<<<<< HEAD
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedTypes = new Set(["A", "AAAA", "CNAME", "MX", "NS", "TXT"]);
const domainPattern = /^(?=.{1,253}$)(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}$/;
const GLOBALPING_API = "https://api.globalping.io/v1";

const locations = [
  { country: "US", limit: 1 },
  { country: "CA", limit: 1 },
  { country: "BR", limit: 1 },
  { country: "GB", limit: 1 },
  { country: "DE", limit: 1 },
  { country: "ZA", limit: 1 },
  { country: "IN", limit: 1 },
  { country: "SG", limit: 1 },
  { country: "JP", limit: 1 },
  { country: "AU", limit: 1 },
];

const countryNames: Record<string, string> = {
  US: "United States",
  CA: "Canada",
  BR: "Brazil",
  GB: "United Kingdom",
  DE: "Germany",
  ZA: "South Africa",
  IN: "India",
  SG: "Singapore",
  JP: "Japan",
  AU: "Australia",
};

type DnsAnswer = {
  value?: string;
  data?: string;
  address?: string;
};

type ProbeInfo = {
  id?: string;
  continent?: string;
  region?: string;
  country?: string;
  countryCode?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  network?: string;
  location?: {
    continent?: string;
    region?: string;
    country?: string;
    countryCode?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
    network?: string;
  };
};

type GlobalpingResult = {
  probe?: ProbeInfo;
  result?: {
    status?: string;
    statusCode?: number;
    statusCodeName?: string;
    resolver?: string;
    rawOutput?: string;
    answers?: DnsAnswer[];
    timings?: { total?: number };
  };
};

type Measurement = {
  id?: string;
  status?: string;
  results?: GlobalpingResult[];
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function requestHeaders() {
  const output: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "User-Agent": "ZoneCheckr/1.0 (https://zonecheckr.com)",
  };

  if (process.env.GLOBALPING_TOKEN) {
    output.Authorization = `Bearer ${process.env.GLOBALPING_TOKEN}`;
  }

  return output;
}

function normalizeAnswer(answer: DnsAnswer) {
  return String(answer.value ?? answer.data ?? answer.address ?? "").trim();
}

function fingerprint(values: string[]) {
  return JSON.stringify(
    values
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean)
      .sort(),
  );
}

function normalizeProbe(item: GlobalpingResult, index: number) {
  const probe = item.probe ?? {};
  const nested = probe.location ?? {};

  // Measurement responses currently expose location fields directly on probe,
  // while the probes catalogue uses probe.location. Supporting both keeps the
  // integration resilient to either shape.
  const countryCode = String(probe.countryCode ?? nested.countryCode ?? probe.country ?? nested.country ?? "").toUpperCase();
  const rawCountry = String(probe.country ?? nested.country ?? countryCode ?? "Unknown");
  const country = countryNames[countryCode] ?? countryNames[rawCountry] ?? rawCountry;
  const city = String(probe.city ?? nested.city ?? "Unknown city");
  const latitude = Number(probe.latitude ?? nested.latitude ?? NaN);
  const longitude = Number(probe.longitude ?? nested.longitude ?? NaN);
  const answers = (item.result?.answers ?? []).map(normalizeAnswer).filter(Boolean).sort();

  return {
    id: probe.id ?? `${countryCode || "probe"}-${city}-${index}`,
    city,
    country,
    countryCode,
    continent: String(probe.continent ?? nested.continent ?? ""),
    region: String(probe.region ?? nested.region ?? ""),
    latitude,
    longitude,
    resolver: item.result?.resolver || "Probe resolver",
    network: probe.network ?? nested.network ?? "",
    answers,
    responseTimeMs: item.result?.timings?.total ?? null,
    statusCode: item.result?.statusCode ?? null,
    statusCodeName: item.result?.statusCodeName ?? "",
    probeStatus: item.result?.status ?? "",
  };
}

async function getMeasurement(id: string) {
  const response = await fetch(`${GLOBALPING_API}/measurements/${encodeURIComponent(id)}`, {
    headers: requestHeaders(),
    cache: "no-store",
    signal: AbortSignal.timeout(9000),
  });

  if (!response.ok) return null;
  return (await response.json()) as Measurement;
}

export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get("name")?.trim().toLowerCase();
  const type = request.nextUrl.searchParams.get("type")?.trim().toUpperCase() || "A";
  const expected = request.nextUrl.searchParams.get("expected")?.trim() || "";
=======
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
>>>>>>> d7d9131fad58988783ff8795695b7ef30e962270

  if (!name || !domainPattern.test(name)) {
    return NextResponse.json({ error: "Please provide a valid domain name." }, { status: 400 });
  }
<<<<<<< HEAD

=======
>>>>>>> d7d9131fad58988783ff8795695b7ef30e962270
  if (!allowedTypes.has(type)) {
    return NextResponse.json({ error: "Unsupported DNS record type." }, { status: 400 });
  }

<<<<<<< HEAD
  try {
    const createResponse = await fetch(`${GLOBALPING_API}/measurements`, {
      method: "POST",
      headers: requestHeaders(),
      cache: "no-store",
      body: JSON.stringify({
        target: name,
        type: "dns",
        locations,
        measurementOptions: {
          query: { type },
        },
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!createResponse.ok) {
      const message = await createResponse.text();
      console.error("Globalping create failed", createResponse.status, message);
      return NextResponse.json(
        { error: "The worldwide DNS probe service is temporarily unavailable." },
        { status: 502 },
      );
    }

    const created = (await createResponse.json()) as Measurement;
    if (!created.id) {
      return NextResponse.json({ error: "The probe service did not return a measurement ID." }, { status: 502 });
    }

    let measurement: Measurement = created;

    for (let attempt = 0; attempt < 10; attempt += 1) {
      const hasFinishedResults = !["in-progress", "in_progress"].includes(String(measurement.status ?? "").toLowerCase()) && (measurement.results?.length ?? 0) > 0;
      if (hasFinishedResults) break;

      await sleep(attempt === 0 ? 500 : 750);
      const next = await getMeasurement(created.id);
      if (next) measurement = next;
    }

    const normalized = (measurement.results ?? [])
      .map(normalizeProbe)
      .filter((item) => Number.isFinite(item.latitude) && Number.isFinite(item.longitude));

    if (!normalized.length) {
      return NextResponse.json(
        { error: "The DNS probes did not return usable results yet. Please try again." },
        { status: 504 },
      );
    }

    const fingerprints = normalized
      .filter((item) => item.answers.length > 0)
      .map((item) => fingerprint(item.answers));

    const counts = new Map<string, number>();
    for (const value of fingerprints) {
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }

    const consensusFingerprint = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "[]";
    const consensusAnswers = JSON.parse(consensusFingerprint) as string[];
    const expectedNormalized = expected.toLowerCase();

    const results = normalized.map((item) => {
      const normalizedStatus = item.probeStatus.toLowerCase();
      const isFinished = normalizedStatus === "" || normalizedStatus === "finished" || normalizedStatus === "success";
      const hasAnswer = item.answers.length > 0;
      const answerMatch = expected
        ? item.answers.some((answer) => answer.toLowerCase().includes(expectedNormalized))
        : fingerprint(item.answers) === consensusFingerprint && hasAnswer;

      return {
        ...item,
        status: !isFinished || !hasAnswer ? ("failed" as const) : answerMatch ? ("propagated" as const) : ("different" as const),
      };
    });

    const answeredResults = results.filter((item) => item.status !== "failed");
    const consistent = answeredResults.length > 0 && answeredResults.every((item) => item.status === "propagated");

    return NextResponse.json(
      {
        name,
        type,
        expected: expected || null,
        consistent,
        consensusAnswers,
        measurementId: created.id,
        provider: "Globalping",
        results,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Global propagation lookup failed", error);
    return NextResponse.json(
      { error: "Unable to complete the worldwide DNS propagation check. Please try again." },
      { status: 502 },
    );
  }
=======
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
>>>>>>> d7d9131fad58988783ff8795695b7ef30e962270
}
