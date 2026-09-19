import Link from "next/link";
import { siteConfig } from "@/lib/site";
<<<<<<< HEAD
import { ThemeToggle } from "@/components/ThemeToggle";
=======
>>>>>>> d7d9131fad58988783ff8795695b7ef30e962270

export function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label={`${siteConfig.name} home`}>
          <span className="brand-mark">Z</span>
          <span>{siteConfig.name}</span>
        </Link>

<<<<<<< HEAD
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
=======
        <nav className="nav" aria-label="Primary navigation">
          <Link href="/tools">Tools</Link>
          <Link href="/guides/dns-records-explained">Guides</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </div>
    </header>
  );
}
>>>>>>> d7d9131fad58988783ff8795695b7ef30e962270
