"use client";

import { useEffect, useMemo } from "react";

type AdSlotProps = {
  className?: string;
  label?: boolean;
  slotId?: string;
};

const SLOT_ID_MAP: Record<string, string> = {
  // Banner 1: first homepage ad slot directly below the header
  "home-top-leaderboard": "div-gpt-ad-1790006377572-0",
  "homepage-top": "div-gpt-ad-1790006377572-0",

  // Banner 2: reserved for the second homepage placement
  "home-lower-leaderboard": "div-gpt-ad-1790180731446-0",
  "homepage-lower": "div-gpt-ad-1790180731446-0",
  // Banner 3 inline placement used on individual tool and guide pages.
  // It uses a unique div id so it can coexist with the Banner 3 bottom anchor.
  "tool-mid-content": "div-gpt-ad-1790006153357-inline-0",
  "guide-mid-content": "div-gpt-ad-1790006153357-inline-0",

  // Banner 3 bottom anchor keeps the exact partner-provided div id.
  "bottom-anchor": "div-gpt-ad-1790006153357-0",
};

type GptWindow = Window & {
  googletag?: {
    cmd: Array<() => void>;
    display?: (divId: string) => void;
  };
  gptTrackingEngine?: {
    observeSlot?: (divId: string) => void;
  };
};

export function AdSlot({
  className = "",
  label = true,
  slotId = "tool-mid-content",
}: AdSlotProps) {
  const gptDivId = useMemo(() => {
    if (slotId.startsWith("div-gpt-ad-")) return slotId;
    return SLOT_ID_MAP[slotId] || "div-gpt-ad-1790006153357-0";
  }, [slotId]);

  useEffect(() => {
    const gptWindow = window as GptWindow;

    gptWindow.googletag = gptWindow.googletag || { cmd: [] };

    gptWindow.googletag.cmd.push(() => {
      const element = document.getElementById(gptDivId);

      // Avoid duplicate display() calls during development/React remounts.
      if (element && element.dataset.gptDisplayed !== "true") {
        gptWindow.googletag?.display?.(gptDivId);
        element.dataset.gptDisplayed = "true";
      }

      gptWindow.gptTrackingEngine?.observeSlot?.(gptDivId);
    });
  }, [gptDivId]);

  return (
    <div className={`gam-ad-slot ${className}`} aria-label="Advertisement">
      <div className="gam-ad-inner">
        {label && <span className="gam-ad-label">Advertisement</span>}

        <div
          id={gptDivId}
          className="gam-ad-placeholder"
          data-ad-slot={slotId}
        />
      </div>
    </div>
  );
}
