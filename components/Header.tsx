"use client";

import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/lib/site";
import { ThemeToggle } from "@/components/ThemeToggle";

const navItems = [
  { href: "/tools", label: "Tools" },
  { href: "/guides", label: "Guides" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link
          href="/"
          className="brand"
          aria-label={`${siteConfig.name} home`}
          onClick={() => setMenuOpen(false)}
        >
          <span className="brand-mark">Z</span>
          <span>{siteConfig.name}</span>
        </Link>

        <div className="header-actions">
          <nav className="nav desktop-nav" aria-label="Primary navigation">
            {navItems.map((item) => (
              <Link href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>

          <ThemeToggle />

          <button
            type="button"
            className={`mobile-menu-toggle ${menuOpen ? "is-open" : ""}`}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <nav
          id="mobile-navigation"
          className={`mobile-nav ${menuOpen ? "is-open" : ""}`}
          aria-label="Mobile navigation"
        >
          {navItems.map((item) => (
            <Link href={item.href} key={item.href} onClick={() => setMenuOpen(false)}>
              {item.label}
              <span aria-hidden="true">→</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
