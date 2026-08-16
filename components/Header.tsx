import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label={`${siteConfig.name} home`}>
          <span className="brand-mark">Z</span>
          <span>{siteConfig.name}</span>
        </Link>

        <nav className="nav" aria-label="Primary navigation">
          <Link href="/tools">Tools</Link>
          <Link href="/guides/dns-records-explained">Guides</Link>
        </nav>
      </div>
    </header>
  );
}
