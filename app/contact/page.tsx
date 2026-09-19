import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
<<<<<<< HEAD
  title: "Contact Us",
  description: "Contact ZoneCheckr for support, feedback, partnerships or questions about our DNS, domain and network tools.",
=======
  title: "Contact Us | ZoneCheckr",
  description:
    "Contact ZoneCheckr for support, feedback, partnership enquiries, or questions about our DNS, domain and network tools.",
>>>>>>> d7d9131fad58988783ff8795695b7ef30e962270
};

export default function ContactPage() {
  return (
<<<<<<< HEAD
    <div className="container tool-page">
      <div className="tool-page-heading compact-heading">
        <span className="eyebrow">Contact ZoneCheckr</span>
        <h1>How can we help?</h1>
        <p>Questions, bug reports, feedback or partnership enquiries are welcome.</p>
      </div>

      <div className="contact-grid">
        <section className="contact-card">
          <span className="eyebrow">Support</span>
          <h2>Email us</h2>
          <p>For general enquiries and technical support, contact the ZoneCheckr support mailbox.</p>
          <a href="mailto:support@zonecheckr.com" className="button button-primary">support@zonecheckr.com</a>
          <p className="contact-note">We aim to respond to genuine enquiries as soon as possible.</p>
        </section>

        <section className="contact-card">
          <span className="eyebrow">Self-service</span>
          <h2>Try the toolbox first</h2>
          <p>Our free tools can help diagnose DNS, SSL, domain, email and website response issues immediately.</p>
          <Link href="/tools" className="button button-secondary">Browse ZoneCheckr tools</Link>
        </section>
      </div>
    </div>
  );
}
=======
    <main className="tool-page">
      <div className="container">
        <div className="tool-page-heading compact-heading">
          <span className="eyebrow">Contact ZoneCheckr</span>

          <h1>How can we help?</h1>

          <p>
            Have a question about ZoneCheckr, spotted an issue with one of our
            tools, or want to discuss a partnership? Get in touch with us.
          </p>
        </div>

        <div className="contact-grid">
          <section className="contact-card">
            <span className="eyebrow">Support</span>

            <h2>Email us</h2>

            <p>
              For general enquiries, bug reports, feedback, and technical
              support, contact our support team.
            </p>

            <a
              href="mailto:support@zonecheckr.com"
              className="button button-primary"
            >
              support@zonecheckr.com
            </a>

            <p className="contact-note">
              We aim to respond to genuine enquiries as soon as possible.
            </p>
          </section>

          <section className="contact-card">
            <span className="eyebrow">Before contacting us</span>

            <h2>Try our tools</h2>

            <p>
              If you are troubleshooting a website, domain, DNS, SSL, email, or
              HTTP issue, one of our free diagnostic tools may help you identify
              the problem immediately.
            </p>

            <Link href="/tools" className="button button-secondary">
              Browse ZoneCheckr tools
            </Link>
          </section>
        </div>

        <section className="article-card contact-info">
          <h2>What you can contact us about</h2>

          <div className="contact-topics">
            <div>
              <strong>Technical issues</strong>
              <p>
                Report unexpected results or problems with a ZoneCheckr tool.
              </p>
            </div>

            <div>
              <strong>General feedback</strong>
              <p>
                Suggest new tools, improvements, guides, or features you would
                like us to build.
              </p>
            </div>

            <div>
              <strong>Partnerships</strong>
              <p>
                Contact us regarding advertising, publishing, integrations, or
                business partnerships.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
>>>>>>> d7d9131fad58988783ff8795695b7ef30e962270
