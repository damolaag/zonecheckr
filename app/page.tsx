import Link from "next/link";
import { ToolCard } from "@/components/ToolCard";
import { siteConfig } from "@/lib/site";
import { getToolHref, tools } from "@/lib/tools";

const liveTools = tools.filter((tool) => tool.status === "live");

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="eyebrow">Free website diagnostics</span>
            <h1>{siteConfig.tagline}</h1>
            <p>
              Practical DNS, domain, SSL, email and website tools for website owners, developers and support
              teams — with clear explanations when something goes wrong.
            </p>
            <div className="hero-actions">
              <Link href="/tools/dns-lookup" className="button button-primary">
                Run a DNS lookup
              </Link>
              <Link href="/tools" className="button button-secondary">
                Browse all tools
              </Link>
            </div>
            <div className="trust-row" aria-label="Product highlights">
              <span>No signup</span>
              <span>Fast checks</span>
              <span>Plain-English results</span>
            </div>
          </div>

          <div className="hero-console" aria-label="Example DNS diagnostic output">
            <div className="console-bar">
              <span />
              <span />
              <span />
            </div>
            <div className="console-body">
              <p><span className="console-muted">domain</span> example.com</p>
              <p><span className="console-muted">record</span> A</p>
              <p><span className="console-good">✓</span> 93.184.216.34</p>
              <p><span className="console-muted">resolver</span> public DNS</p>
              <p><span className="console-muted">status</span> healthy</p>
            </div>
          </div>
        </div>
      </section>

      <section className="ad-placeholder container" aria-label="Advertisement placeholder">
        <span>Advertisement</span>
      </section>

      <section className="section" id="tools">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Toolbox</span>
              <h2>Start diagnosing</h2>
            </div>
            <p>Fast checks built around the domain and website problems people actually face.</p>
          </div>

          <div className="tool-grid">
            {tools.map((tool) => (
              <ToolCard
                key={tool.slug}
                title={tool.title}
                description={tool.description}
                href={tool.status === "live" ? getToolHref(tool.slug) : undefined}
                status={tool.status}
              />
            ))}
          </div>

          <div className="section-action">
            <Link href="/tools" className="text-link">See all tools →</Link>
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container content-grid">
          <div>
            <span className="eyebrow">Learn while you fix</span>
            <h2>Clear answers, not networking jargon.</h2>
          </div>
          <div>
            <p>
              Every diagnostic tool is paired with guides that explain the result, likely causes,
              and safe next steps. That gives us useful content for search traffic without turning
              the site into a generic tech blog.
            </p>
            <Link href="/guides/dns-records-explained" className="text-link">
              Read: DNS records explained →
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container stats-grid">
          <div className="stat-card"><strong>{liveTools.length}</strong><span>working tools at launch</span></div>
          <div className="stat-card"><strong>0</strong><span>accounts required</span></div>
          <div className="stat-card"><strong>1</strong><span>goal: diagnose faster</span></div>
        </div>
      </section>
    </>
  );
}
