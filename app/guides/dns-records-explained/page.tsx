import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "DNS Records Explained: A, AAAA, CNAME, MX, TXT & NS",
  description:
    "A plain-English guide to the DNS records website owners see most often, including A, AAAA, CNAME, MX, TXT and NS records.",
};

export default function DnsRecordsGuide() {
  return (
    <article className="container guide-page">
      <header className="guide-header">
        <span className="eyebrow">DNS guide</span>
        <h1>DNS records explained without the jargon</h1>
        <p>
          If you manage a domain, DNS records are the instructions that tell the internet where
          your website, email and other services should go.
        </p>
      </header>

      <div className="article-card prose">
        <h2>A record</h2>
        <p>
          An A record connects a hostname to an IPv4 address. When someone visits your domain,
          this is often the record that directs them toward the server hosting the website.
        </p>

        <h2>AAAA record</h2>
        <p>
          An AAAA record serves the same basic purpose as an A record, but points to an IPv6
          address instead of IPv4.
        </p>

        <h2>CNAME record</h2>
        <p>
          A CNAME makes one hostname an alias of another hostname. It is commonly used for
          subdomains such as www, app or blog.
        </p>

        <h2>MX record</h2>
        <p>
          MX records tell sending mail servers which systems should receive email for your domain.
          Incorrect MX records are a common reason a domain can send or receive website traffic
          normally while email fails.
        </p>

        <h2>TXT record</h2>
        <p>
          TXT records store text values used by services for verification and policy. SPF, DKIM
          and DMARC-related configuration frequently relies on TXT records.
        </p>

        <h2>NS record</h2>
        <p>
          NS records identify the authoritative nameservers for a domain. If these point to the
          wrong provider, changes made in a different DNS dashboard may have no effect.
        </p>

        <div className="article-cta">
          <h2>Check your domain now</h2>
          <p>Use the DNS Lookup tool to see the records currently published for your domain.</p>
          <Link href="/tools/dns-lookup" className="button button-primary">
            Open DNS Lookup
          </Link>
        </div>
      </div>
    </article>
  );
}
