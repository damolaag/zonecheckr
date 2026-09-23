import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { ToolCard } from "@/components/ToolCard";
import { siteConfig } from "@/lib/site";
import { getToolHref, tools } from "@/lib/tools";

const liveTools = tools.filter((tool) => tool.status === "live");

const featuredGuides = [
  {
    title: "How Long Does DNS Propagation Take?",
    description:
      "Understand why DNS changes take time, how propagation works, and how to check whether your new records are live.",
    href: "/guides/how-long-does-dns-propagation-take",
  },
  {
    title: "DNS_PROBE_FINISHED_NXDOMAIN: How to Fix It",
    description:
      "Learn what NXDOMAIN means and troubleshoot nameservers, DNS records, caching, and propagation issues.",
    href: "/guides/fix-dns-probe-finished-nxdomain",
  },
  {
    title: "SPF vs DKIM vs DMARC",
    description:
      "Understand the three core email-authentication technologies and how they help protect your domain.",
    href: "/guides/spf-vs-dkim-vs-dmarc",
  },
];

export default function Home() {
  return (
    <>
      {/* ======================================================
          TOP GAM AD SLOT
          Supports:
          Desktop: 970x90, 728x90, 300x250, 300x100
          Mobile: 300x250, 320x50, 300x100
      ====================================================== */}
      <section className="homepage-top-ad-section">
        <div className="container">
          <AdSlot slotId="homepage-top" className="homepage-top-ad" />
        </div>
      </section>

      {/* ======================================================
          HERO
      ====================================================== */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="eyebrow">
              Domain diagnostics & troubleshooting
            </span>

            <h1>
              Check your domain.
              <br />
              Find the problem.
              <br />
              Fix it faster.
            </h1>

            <p className="hero-description">
              Diagnose DNS, SSL, email authentication, domain and website
              connection issues with free tools and clear troubleshooting
              guidance.
            </p>

            <div className="hero-actions">
              <Link
                href="/tools/domain-health"
                className="button button-primary"
              >
                Check Domain Health
              </Link>

              <Link href="/tools" className="button button-secondary">
                Browse all tools
              </Link>
            </div>

            <div
              className="trust-row"
              aria-label="ZoneCheckr product highlights"
            >
              <span>✓ No signup</span>
              <span>✓ Free diagnostics</span>
              <span>✓ Plain-English results</span>
            </div>
          </div>

          {/* ==================================================
              HERO DIAGNOSTIC PREVIEW
          ================================================== */}
          <div
            className="hero-console"
            aria-label="Example ZoneCheckr domain diagnostic"
          >
            <div className="console-bar">
              <span />
              <span />
              <span />
            </div>

            <div className="console-body">
              <p>
                <span className="console-muted">domain</span>
                <span>example.com</span>
              </p>

              <p>
                <span className="console-good">✓</span>
                <span>DNS records detected</span>
              </p>

              <p>
                <span className="console-good">✓</span>
                <span>SSL certificate trusted</span>
              </p>

              <p>
                <span className="console-good">✓</span>
                <span>HTTPS responding</span>
              </p>

              <p>
                <span className="console-muted">email</span>
                <span>SPF · DKIM · DMARC</span>
              </p>

              <p>
                <span className="console-muted">next</span>
                <span>review issues & guidance</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          SECOND HOMEPAGE GAM AD SLOT — BANNER 2
      ====================================================== */}
      <section className="homepage-lower-ad-section">
        <div className="container">
          <AdSlot slotId="homepage-lower" className="homepage-lower-ad" />
        </div>
      </section>

      {/* ======================================================
          TOOLS
      ====================================================== */}
      <section className="section" id="tools">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Domain toolbox</span>

              <h2>Diagnose the problem with the right tool.</h2>
            </div>

            <p>
              Check DNS, email authentication, SSL, domain records, propagation,
              HTTP responses and overall domain health.
            </p>
          </div>

          <div className="tool-grid">
            {tools.map((tool) => (
              <ToolCard
                key={tool.slug}
                title={tool.title}
                description={tool.description}
                href={
                  tool.status === "live" ? getToolHref(tool.slug) : undefined
                }
                status={tool.status}
              />
            ))}
          </div>

          <div className="section-action">
            <Link href="/tools" className="text-link">
              Browse all ZoneCheckr tools →
            </Link>
          </div>
        </div>
      </section>

      {/* ======================================================
          DOMAIN HEALTH FEATURE
      ====================================================== */}
      <section className="section section-soft">
        <div className="container feature-split">
          <div>
            <span className="eyebrow">One domain. Multiple checks.</span>

            <h2>Start with a complete domain health check.</h2>

            <p>
              Not sure which tool you need? ZoneCheckr can inspect the major
              technical components behind your domain in one place.
            </p>

            <div className="feature-check-list">
              <span>✓ DNS records</span>
              <span>✓ Nameservers & SOA</span>
              <span>✓ MX & email configuration</span>
              <span>✓ SPF & DMARC</span>
              <span>✓ SSL/TLS</span>
              <span>✓ HTTPS response</span>
            </div>

            <Link href="/tools/domain-health" className="button button-primary">
              Run Domain Health Check
            </Link>
          </div>

          <div className="health-preview-card">
            <div className="health-preview-heading">
              <div>
                <span className="health-preview-label">DOMAIN HEALTH</span>

                <strong>example.com</strong>
              </div>

              <span className="health-preview-badge">Scan complete</span>
            </div>

            <div className="health-preview-results">
              <div>
                <span>DNS</span>
                <strong className="status-good">PASS</strong>
              </div>

              <div>
                <span>Nameservers</span>
                <strong className="status-good">PASS</strong>
              </div>

              <div>
                <span>SSL / TLS</span>
                <strong className="status-good">PASS</strong>
              </div>

              <div>
                <span>SPF</span>
                <strong className="status-good">PASS</strong>
              </div>

              <div>
                <span>DMARC</span>
                <strong className="status-warning">WARNING</strong>
              </div>

              <div>
                <span>DKIM</span>
                <strong className="status-info">INFO</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          GUIDES
      ====================================================== */}
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Troubleshooting guides</span>

              <h2>Understand what went wrong — and how to fix it.</h2>
            </div>

            <p>
              Practical guides for DNS, domain, email, SSL and website
              connection problems.
            </p>
          </div>

          <div className="guide-grid">
            {featuredGuides.map((guide) => (
              <article className="guide-card" key={guide.href}>
                <span className="guide-card-label">Guide</span>

                <h3>{guide.title}</h3>

                <p>{guide.description}</p>

                <Link href={guide.href} className="text-link">
                  Read guide →
                </Link>
              </article>
            ))}
          </div>

          <div className="section-action">
            <Link href="/guides" className="button button-secondary">
              Browse all guides
            </Link>
          </div>
        </div>
      </section>

      {/* ======================================================
          PLATFORM STATS
      ====================================================== */}
      <section className="section section-soft">
        <div className="container stats-grid">
          <div className="stat-card">
            <strong>{liveTools.length}</strong>
            <span>diagnostic tools</span>
          </div>

          <div className="stat-card">
            <strong>0</strong>
            <span>accounts required</span>
          </div>

          <div className="stat-card">
            <strong>1</strong>
            <span>domain to start diagnosing</span>
          </div>
        </div>
      </section>

      {/* ======================================================
          TECHNICAL SUPPORT / SERVICES
      ====================================================== */}
      <section className="section">
        <div className="container support-cta">
          <div className="support-cta-copy">
            <span className="eyebrow">Technical domain support</span>

            <h2>Found the problem but need help fixing it?</h2>

            <p>
              ZoneCheckr can help with domain and registrar configuration, DNS,
              SSL, email authentication, hosting connections, Cloudflare,
              subdomains, redirects and domain migrations.
            </p>

            <div className="support-tags">
              <span>DNS</span>
              <span>SSL</span>
              <span>SPF / DKIM / DMARC</span>
              <span>Cloudflare</span>
              <span>Hosting</span>
              <span>Domain migration</span>
            </div>
          </div>

          <div className="support-cta-actions">
            <Link href="/services" className="button button-primary">
              Get Technical Help
            </Link>

            <a
              href="mailto:support@zonecheckr.com"
              className="button button-secondary"
            >
              support@zonecheckr.com
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
