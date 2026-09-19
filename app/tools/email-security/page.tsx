import type { Metadata } from "next";
import { EmailSecurityChecker } from "@/components/EmailSecurityChecker";

export const metadata: Metadata = {
  title: "SPF, DKIM & DMARC Checker — Email Security | ZoneCheckr",
  description: "Check SPF, DMARC, DKIM and MX records for a domain and inspect common email authentication settings.",
};

export default function Page() {
  return (
    <div className="container tool-page">
      <div className="tool-page-heading">
        <span className="eyebrow">Email security tool</span>
        <h1>SPF, DKIM & DMARC Checker</h1>
        <p>Inspect the DNS records used to authenticate domain email. Check SPF and DMARC automatically, and optionally provide a DKIM selector.</p>
      </div>
      <EmailSecurityChecker />
      <div className="ad-placeholder"><span>Advertisement</span></div>
      <article className="article-card">
        <h2>Why these records matter</h2>
        <p>SPF defines which servers may send mail for a domain, DKIM adds a cryptographic signature to messages, and DMARC tells receiving systems how to handle messages that fail authentication. ZoneCheckr reports what is published; it does not send test emails.</p>
      </article>
    </div>
  );
}
