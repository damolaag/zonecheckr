import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label={`${siteConfig.name} home`}>
          <span className="brand-mark">Z</span>
          <span>{siteConfig.name}</span>
        </Link>

        <div className="header-actions">
          <nav className="nav" aria-label="Primary navigation">
            <Link href="/tools">Tools</Link>
            <Link href="/guides/dns-records-explained">Guides</Link>
            <Link href="/contact">Contact</Link>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
