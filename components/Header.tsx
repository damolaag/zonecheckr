"use client";

import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/lib/site";
import { ThemeToggle } from "@/components/ThemeToggle";

const links = [
  ["Tools", "/tools"],
  ["Domain Health", "/tools/domain-health"],
  ["Guides", "/guides"],
  ["Services", "/services"],
  ["Contact", "/contact"],
] as const;

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label={`${siteConfig.name} home`} onClick={() => setMenuOpen(false)}>
          <span className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span>{siteConfig.name}</span>
        </Link>

        <div className="header-actions">
          <nav className="nav" aria-label="Primary navigation">
            {links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
          </nav>
          <ThemeToggle />
          <button
            type="button"
            className="mobile-menu-button"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          <div className="container mobile-nav-grid">
            {links.map(([label, href]) => (
              <Link key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
