import type { Metadata } from "next";
import { DomainHealthChecker } from "@/components/DomainHealthChecker";

export const metadata: Metadata = {
  title: "Domain Health Checker — DNS, Email, SSL & HTTPS | ZoneCheckr",
  description: "Run a combined domain health check covering DNS, IPv6, nameservers, SOA, MX, SPF, DMARC, DKIM, CAA, SSL and HTTPS.",
};

export default function Page() {
  return (
    <div className="container tool-page">
      <div className="tool-page-heading">
        <span className="eyebrow">All-in-one diagnostic</span>
        <h1>Domain Health Checker</h1>
        <p>Run DNS, email authentication, certificate and HTTPS checks from one screen. ZoneCheckr separates required failures from optional configuration information.</p>
      </div>
      <DomainHealthChecker />
      <div className="ad-placeholder"><span>Advertisement</span></div>
      <article className="article-card">
        <h2>What does Domain Health check?</h2>
        <p>The checker inspects A, AAAA, NS and SOA records, mail routing, SPF, DMARC and optional DKIM, CAA certificate policy, TLS certificate health, and the domain&apos;s HTTPS response. Results are individual checks rather than an arbitrary overall score.</p>
      </article>
    </div>
  );
}
