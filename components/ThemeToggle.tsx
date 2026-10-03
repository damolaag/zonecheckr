"use client";

import { useSyncExternalStore } from "react";

type Theme = "dark" | "light";

function readTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", onStoreChange);
  window.addEventListener("zonecheckr-theme-change", onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("zonecheckr-theme-change", onStoreChange);
  };
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, readTheme, () => "light" as Theme);

  function setPageTheme(next: Theme) {
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    try {
      localStorage.setItem("zonecheckr-theme", next);
    } catch {
      // Theme switching still works when storage is unavailable.
    }
    window.dispatchEvent(new Event("zonecheckr-theme-change"));
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
      <span className="theme-half-dot" aria-hidden="true" />
      <span className="theme-switch-text">{theme === "dark" ? "Dark" : "Light"}</span>
    </button>
  );
}
