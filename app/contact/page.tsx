import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact ZoneCheckr for support, feedback, partnerships or questions about our DNS, domain and network tools.",
};

export default function ContactPage() {
  return (
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
