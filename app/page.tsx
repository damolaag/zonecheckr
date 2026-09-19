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
<<<<<<< HEAD
            <h1>{siteConfig.tagline}</h1>
            <p>
              Practical DNS, domain, SSL, email and website tools for website owners, developers and support
              teams — with clear explanations when something goes wrong.
            </p>
            <div className="hero-actions">
              <Link href="/tools/dns-lookup" className="button button-primary">
                Run a DNS lookup
              </Link>
=======

            <h1>{siteConfig.tagline}</h1>

            <p>
              Practical DNS, domain, SSL, email and website tools for website
              owners, developers and support teams — with clear explanations
              when something goes wrong.
            </p>

            <div className="hero-actions">
              <Link
                href="/tools/dns-lookup"
                className="button button-primary"
              >
                Run a DNS lookup
              </Link>

>>>>>>> d7d9131fad58988783ff8795695b7ef30e962270
              <Link href="/tools" className="button button-secondary">
                Browse all tools
              </Link>
            </div>
<<<<<<< HEAD
=======

>>>>>>> d7d9131fad58988783ff8795695b7ef30e962270
            <div className="trust-row" aria-label="Product highlights">
              <span>No signup</span>
              <span>Fast checks</span>
              <span>Plain-English results</span>
            </div>
          </div>

<<<<<<< HEAD
          <div className="hero-console" aria-label="Example DNS diagnostic output">
=======
          <div
            className="hero-console"
            aria-label="Example DNS diagnostic output"
          >
>>>>>>> d7d9131fad58988783ff8795695b7ef30e962270
            <div className="console-bar">
              <span />
              <span />
              <span />
            </div>
<<<<<<< HEAD
            <div className="console-body">
              <p><span className="console-muted">domain</span> example.com</p>
              <p><span className="console-muted">record</span> A</p>
              <p><span className="console-good">✓</span> 93.184.216.34</p>
              <p><span className="console-muted">resolver</span> public DNS</p>
              <p><span className="console-muted">status</span> healthy</p>
=======

            <div className="console-body">
              <p>
                <span className="console-muted">domain</span> example.com
              </p>

              <p>
                <span className="console-muted">record</span> A
              </p>

              <p>
                <span className="console-good">✓</span> 93.184.216.34
              </p>

              <p>
                <span className="console-muted">resolver</span> public DNS
              </p>

              <p>
                <span className="console-muted">status</span> healthy
              </p>
>>>>>>> d7d9131fad58988783ff8795695b7ef30e962270
            </div>
          </div>
        </div>
      </section>

<<<<<<< HEAD
      <section className="ad-placeholder container" aria-label="Advertisement placeholder">
=======
      <section
        className="ad-placeholder container"
        aria-label="Advertisement placeholder"
      >
>>>>>>> d7d9131fad58988783ff8795695b7ef30e962270
        <span>Advertisement</span>
      </section>

      <section className="section" id="tools">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Toolbox</span>
              <h2>Start diagnosing</h2>
            </div>
<<<<<<< HEAD
            <p>Fast checks built around the domain and website problems people actually face.</p>
=======

            <p>
              Fast checks built around the domain and website problems people
              actually face.
            </p>
>>>>>>> d7d9131fad58988783ff8795695b7ef30e962270
          </div>

          <div className="tool-grid">
            {tools.map((tool) => (
              <ToolCard
                key={tool.slug}
                title={tool.title}
                description={tool.description}
<<<<<<< HEAD
                href={tool.status === "live" ? getToolHref(tool.slug) : undefined}
=======
                href={
                  tool.status === "live"
                    ? getToolHref(tool.slug)
                    : undefined
                }
>>>>>>> d7d9131fad58988783ff8795695b7ef30e962270
                status={tool.status}
              />
            ))}
          </div>

          <div className="section-action">
<<<<<<< HEAD
            <Link href="/tools" className="text-link">See all tools →</Link>
=======
            <Link href="/tools" className="text-link">
              See all tools →
            </Link>
>>>>>>> d7d9131fad58988783ff8795695b7ef30e962270
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container content-grid">
          <div>
            <span className="eyebrow">Learn while you fix</span>
            <h2>Clear answers, not networking jargon.</h2>
          </div>
<<<<<<< HEAD
          <div>
            <p>
              Every diagnostic tool is paired with guides that explain the result, likely causes,
              and safe next steps. That gives us useful content for search traffic without turning
              the site into a generic tech blog.
            </p>
            <Link href="/guides/dns-records-explained" className="text-link">
=======

          <div>
            <p>
              Every diagnostic tool is paired with guides that explain the
              result, likely causes, and safe next steps.
            </p>

            <Link
              href="/guides/dns-records-explained"
              className="text-link"
            >
>>>>>>> d7d9131fad58988783ff8795695b7ef30e962270
              Read: DNS records explained →
            </Link>
          </div>
        </div>
      </section>

<<<<<<< HEAD
=======
      <section className="section">
        <div className="container stats-grid">
          <div className="stat-card">
            <strong>{liveTools.length}</strong>
            <span>working tools at launch</span>
          </div>

          <div className="stat-card">
            <strong>0</strong>
            <span>accounts required</span>
          </div>

          <div className="stat-card">
            <strong>1</strong>
            <span>goal: diagnose faster</span>
          </div>
        </div>
      </section>
>>>>>>> d7d9131fad58988783ff8795695b7ef30e962270

      <section className="section section-soft">
        <div className="container contact-home">
          <div>
            <span className="eyebrow">Need help?</span>
<<<<<<< HEAD
            <h2>Contact ZoneCheckr</h2>
            <p>Found an issue, have feedback, or want to discuss a partnership? Reach our support team directly.</p>
          </div>
          <div className="contact-home-actions">
            <Link href="/contact" className="button button-primary">Contact us</Link>
            <a href="mailto:support@zonecheckr.com" className="button button-secondary">support@zonecheckr.com</a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container stats-grid">
          <div className="stat-card"><strong>{liveTools.length}</strong><span>working tools at launch</span></div>
          <div className="stat-card"><strong>0</strong><span>accounts required</span></div>
          <div className="stat-card"><strong>1</strong><span>goal: diagnose faster</span></div>
=======

            <h2>Contact ZoneCheckr</h2>

            <p>
              Found a problem with one of our tools, have feedback, or want to
              discuss a partnership? We'd like to hear from you.
            </p>
          </div>

          <div className="contact-home-actions">
            <Link href="/contact" className="button button-primary">
              Contact us
            </Link>

            <a
              href="mailto:support@zonecheckr.com"
              className="button button-secondary"
            >
              support@zonecheckr.com
            </a>
          </div>
>>>>>>> d7d9131fad58988783ff8795695b7ef30e962270
        </div>
      </section>
    </>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> d7d9131fad58988783ff8795695b7ef30e962270
