import Link from "next/link";
import { ToolCard } from "@/components/ToolCard";
import { tools } from "@/lib/tools";
import { AdSlot } from "@/components/AdSlot";

const featuredSlugs = ["domain-health", "dns-lookup", "dns-propagation", "email-security", "ssl-checker", "domain-lookup"];
const featuredTools = featuredSlugs.map((slug) => tools.find((tool) => tool.slug === slug)).filter(Boolean) as typeof tools;

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="eyebrow">Domain diagnostics & troubleshooting</span>
            <h1>Check your domain. Find the problem. Fix it faster.</h1>
            <p>Diagnose DNS, SSL, email authentication, domain and website connection issues with free tools and clear troubleshooting guidance.</p>
            <div className="hero-actions">
              <Link href="/tools/domain-health" className="button button-primary">Check Domain Health</Link>
              <Link href="/tools" className="button button-secondary">Browse all tools</Link>
            </div>
            <div className="trust-row" aria-label="Product highlights"><span>No signup</span><span>Free diagnostics</span><span>Plain-English results</span></div>
          </div>
          <div className="hero-console" aria-label="Example domain health diagnostic output">
            <div className="console-bar"><span /><span /><span /></div>
            <div className="console-body">
              <p><span className="console-muted">domain</span> example.com</p>
              <p><span className="console-good">✓</span> DNS records detected</p>
              <p><span className="console-good">✓</span> SSL certificate trusted</p>
              <p><span className="console-good">✓</span> HTTPS responding</p>
              <p><span className="console-muted">email</span> SPF · DKIM · DMARC</p>
              <p><span className="console-muted">next</span> review issues & guidance</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <AdSlot slotId="home-top-leaderboard" />
      </div>

      <section className="section" id="tools"><div className="container">
        <div className="section-heading"><div><span className="eyebrow">Domain toolbox</span><h2>Diagnose the full domain stack</h2></div><p>Start with a complete health check or investigate DNS, email, SSL, HTTP and registration data individually.</p></div>
        <div className="tool-grid">{featuredTools.map((tool) => <ToolCard key={tool.slug} title={tool.title} description={tool.description} href={`/tools/${tool.slug}`} status={tool.status} />)}</div>
        <div className="section-action"><Link href="/tools" className="text-link">See all diagnostic tools →</Link></div>
      </div></section>

      <section className="section section-soft"><div className="container content-grid">
        <div><span className="eyebrow">Learn while you fix</span><h2>Understand what is wrong — and what to do next.</h2></div>
        <div><p>ZoneCheckr guides turn technical results into practical next steps. Learn how DNS propagation, nameservers, SPF, DKIM, DMARC, SSL and domain connections work, then use the relevant tool to verify your setup.</p><Link href="/guides" className="text-link">Browse troubleshooting guides →</Link></div>
      </div></section>

      <section className="section"><div className="container contact-home">
        <div><span className="eyebrow">Technical domain support</span><h2>Found the problem but need help fixing it?</h2><p>Get help with DNS, registrars, SSL, email authentication, hosting connections, Cloudflare, redirects, subdomains and domain migrations.</p></div>
        <div className="contact-home-actions"><Link href="/services" className="button button-primary">Get Technical Help</Link><Link href="/contact" className="button button-secondary">Contact ZoneCheckr</Link></div>
      </div></section>
    </>
  );
}
