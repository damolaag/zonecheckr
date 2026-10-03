import type { Metadata } from "next";
import Link from "next/link";
import { DnsLookup } from "@/components/DnsLookup";

import { AdSlot } from "@/components/AdSlot";
export const metadata: Metadata = {
  title: "DNS Lookup — Check A, MX, TXT, NS & CNAME Records",
  description:
    "Run a free DNS lookup for any domain. Check A, AAAA, MX, NS, TXT and CNAME records instantly.",
};

export default function DnsLookupPage() {
  return (
    <div className="container tool-page">
      <div className="tool-page-heading">
        <span className="eyebrow">DNS tool</span>
        <h1>DNS Lookup</h1>
        <p>
          Enter a domain to inspect its public DNS records. Use this when diagnosing website,
          email, nameserver or domain configuration problems.
        </p>
      </div>

      <DnsLookup /><AdSlot slotId="tool-mid-content" className="tool-inline-ad" />

      

      <article className="article-card">
        <h2>What does a DNS lookup show?</h2>
        <p>
          DNS records tell internet services where a domain&apos;s website, email and other services
          live. An A record points to an IPv4 address, MX records identify mail servers, NS records
          identify authoritative nameservers, TXT records often hold verification or email-policy
          data, and CNAME records create aliases between hostnames.
        </p>
        <p>
          If a domain recently changed hosting providers or nameservers, compare the returned
          records with the values supplied by the new provider.
        </p>
        <Link href="/guides/dns-records-explained" className="text-link">
          Learn what each DNS record means →
        </Link>
      </article>
    </div>
  );
}