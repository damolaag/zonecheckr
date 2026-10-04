import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-brand-block">
          <Link href="/" className="brand brand-logo-link" aria-label={`${siteConfig.name} home`}>
            <img src="/brand/zonecheckr-lockup-light.svg" alt="ZoneCheckr" className="brand-logo brand-logo-light" />
            <img src="/brand/zonecheckr-lockup-dark.svg" alt="ZoneCheckr" className="brand-logo brand-logo-dark" />
          </Link>
          <p>{siteConfig.tagline}</p>
        </div>

        <div className="footer-nav-groups">
          <div>
            <span className="footer-label">Tools</span>
            <Link href="/tools/domain-health">Domain Health</Link>
            <Link href="/tools/dns-lookup">DNS Lookup</Link>
            <Link href="/tools/dns-propagation">DNS Propagation</Link>
            <Link href="/tools/ssl-checker">SSL Checker</Link>
          </div>
          <div>
            <span className="footer-label">Resources</span>
            <Link href="/guides">Guides</Link>
            <Link href="/services">Services</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <div>
            <span className="footer-label">Legal</span>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} ZoneCheckr · free to use, supported by ads</span>
        <span className="footer-status"><i /> all check regions operational</span>
      </div>
    </footer>
  );
}
