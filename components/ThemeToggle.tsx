"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

function readTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    setTheme(readTheme());
  }, []);

  function setPageTheme(next: Theme) {
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    try {
      localStorage.setItem("zonecheckr-theme", next);
    } catch {
      // Theme switching should still work when storage is unavailable.
    }
    setTheme(next);
  }

  const nextTheme: Theme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      className="theme-switch"
      onClick={() => setPageTheme(nextTheme)}
      aria-label={`Switch to ${nextTheme} mode`}
      title={`Switch to ${nextTheme} mode`}
    >
      <span className={`theme-switch-track ${theme}`} aria-hidden="true">
        <span className="theme-switch-thumb">{theme === "dark" ? "☾" : "☀"}</span>
      </span>
      <span className="theme-switch-text">{theme === "dark" ? "Dark" : "Light"}</span>
    </button>
  );
}
