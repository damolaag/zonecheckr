"use client";

import { AdSlot } from "@/components/AdSlot";

export function BottomAnchorAd() {
  return (
    <aside className="bottom-anchor-ad" aria-label="Advertisement">
      <AdSlot slotId="bottom-anchor" className="bottom-anchor-slot" label={false} />
    </aside>
  );
}
