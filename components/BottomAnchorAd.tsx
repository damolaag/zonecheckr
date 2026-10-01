"use client";

import { AdSlot } from "@/components/AdSlot";

export function BottomAnchorAd() {
  return (
    <aside className="bottom-anchor-ad" aria-label="Advertisement">
      <span className="bottom-anchor-label">Advertisement</span>
      <AdSlot slotId="bottom-anchor" className="bottom-anchor-slot" label={false} />
    </aside>
  );
}
