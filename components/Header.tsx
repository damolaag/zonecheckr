"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link
          href="/"
          className="brand brand-logo-link"
          aria-label="ZoneCheckr home"
          onClick={() => setMenuOpen(false)}
        >
          <img
            src="/brand/zonecheckr-lockup-light.svg"
            alt="ZoneCheckr"
            className="brand-logo brand-logo-light"
          />
          <img
            src="/brand/zonecheckr-lockup-dark.svg"
            alt="ZoneCheckr"
            className="brand-logo brand-logo-dark"
          />
        </Link>

        <div className="header-actions">
          <nav className="nav" aria-label="Primary navigation">
            {links.map(([label, href]) => (
              <Link key={href} href={href}>{label}</Link>
            ))}
          </nav>
          <ThemeToggle />
          <button
            type="button"
            className="mobile-menu-button"
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation-panel"
            onClick={() => setMenuOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="mobile-menu-overlay" id="mobile-navigation-panel" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <div className="mobile-menu-sheet">
            <div className="mobile-menu-topbar">
              <Link href="/" className="mobile-menu-brand" onClick={() => setMenuOpen(false)}>
                <img src="/brand/zonecheckr-lockup-light.svg" alt="ZoneCheckr" className="brand-logo brand-logo-light" />
                <img src="/brand/zonecheckr-lockup-dark.svg" alt="ZoneCheckr" className="brand-logo brand-logo-dark" />
              </Link>
              <button
                type="button"
                className="mobile-menu-close"
                aria-label="Close navigation menu"
                onClick={() => setMenuOpen(false)}
              >
                <span />
                <span />
              </button>
            </div>

            <nav className="mobile-nav" aria-label="Mobile navigation">
              {links.map(([label, href]) => (
                <Link key={href} href={href} onClick={() => setMenuOpen(false)}>
                  <span>{label}</span>
                  <span className="mobile-nav-arrow" aria-hidden="true">›</span>
                </Link>
              ))}
            </nav>

            <div className="mobile-menu-footer">
              <span>Domain diagnostics, DNS, SSL & email tools.</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
