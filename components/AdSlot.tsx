"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { AD_PLACEMENTS, type AdPlacement } from "@/lib/ads";

type AdSlotProps = {
  className?: string;
  label?: boolean;
  slotId: AdPlacement;
};

type Size = [number, number] | "fluid";

type GptSlot = {
  getSlotElementId(): string;
  defineSizeMapping(mapping: unknown): GptSlot;
  addService(service: unknown): GptSlot;
};

type GoogleTag = {
  cmd: Array<() => void>;
  pubads(): { getSlots(): GptSlot[] };
  sizeMapping(): {
    addSize(viewport: [number, number], sizes: Size[]): ReturnType<GoogleTag["sizeMapping"]>;
    build(): unknown;
  };
  defineSlot(path: string, sizes: Size[], divId: string): GptSlot | null;
  destroySlots(slots: GptSlot[]): boolean;
  display(divId: string): void;
};

type AdsWindow = Window & {
  googletag?: GoogleTag;
  zcAds?: {
    register(slot: GptSlot): void;
    unregister(divId: string): void;
  };
};

function PlacedAd({ className = "", label = true, slotId }: AdSlotProps) {
  const config = AD_PLACEMENTS[slotId];

  useEffect(() => {
    const w = window as AdsWindow;
    w.googletag = w.googletag || ({ cmd: [] } as unknown as GoogleTag);

    let slot: GptSlot | null = null;
    let cancelled = false;

    w.googletag.cmd.push(() => {
      const googletag = w.googletag!;
      if (cancelled || !document.getElementById(config.divId)) return;

      // A slot left over from a previous page would block the new request.
      const stale = googletag.pubads().getSlots().filter((s) => s.getSlotElementId() === config.divId);
      if (stale.length) googletag.destroySlots(stale);

      const mapping = googletag.sizeMapping();
      for (const [viewport, sizes] of config.mapping) mapping.addSize(viewport, sizes);

      slot = googletag.defineSlot(config.path, config.sizes, config.divId);
      if (!slot) return;
      slot.defineSizeMapping(mapping.build()).addService(googletag.pubads());
      w.zcAds?.register(slot);
      googletag.display(config.divId);
    });

    return () => {
      cancelled = true;
      w.googletag?.cmd.push(() => {
        if (!slot) return;
        w.zcAds?.unregister(slot.getSlotElementId());
        w.googletag!.destroySlots([slot]);
      });
    };
  }, [config]);

  return (
    <div className={`gam-ad-slot ${className}`} aria-label="Advertisement">
      <div className="gam-ad-inner">
        {label && <span className="gam-ad-label">Advertisement</span>}
        <div id={config.divId} className="gam-ad-placeholder" data-ad-slot={slotId} />
      </div>
    </div>
  );
}

// Keyed on the route so every page view (including the persistent bottom
// anchor) destroys the old slot and requests a fresh ad.
export function AdSlot(props: AdSlotProps) {
  const pathname = usePathname();
  return <PlacedAd key={pathname} {...props} />;
}
