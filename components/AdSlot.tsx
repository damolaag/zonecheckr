"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { AD_PLACEMENTS, type AdPlacement } from "@/lib/ads";

type AdSlotProps = {
  className?: string;
  label?: boolean;
  slotId: AdPlacement;
  // Stays mounted across pages (the bottom anchor). Refreshed on each route
  // change instead of being destroyed and redefined.
  persistent?: boolean;
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
    register(slot: GptSlot, alwaysInView?: boolean): void;
    unregister(divId: string): void;
    refreshNow(divId: string): void;
  };
};

function PlacedAd({ className = "", label = true, slotId, persistent = false }: AdSlotProps) {
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
      w.zcAds?.register(slot, persistent);
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
  }, [config, persistent]);

  return (
    <div className={`gam-ad-slot ${className}`} aria-label="Advertisement">
      <div className="gam-ad-inner">
        {label && <span className="gam-ad-label">Advertisement</span>}
        <div id={config.divId} className="gam-ad-placeholder" data-ad-slot={slotId} />
      </div>
    </div>
  );
}

// Page placements are keyed on the route, so every page view destroys the old
// slot and requests a fresh ad. The persistent bottom anchor keeps its slot and
// is refreshed on each route change instead: a refresh starts a new page view
// in GAM, which a destroy-and-redefine within the same page view does not, and
// it runs in a layout effect so it happens before the new page's slots load.
export function AdSlot(props: AdSlotProps) {
  const pathname = usePathname();
  const firstPath = useRef(pathname);

  useLayoutEffect(() => {
    if (!props.persistent || pathname === firstPath.current) return;
    firstPath.current = "";
    const w = window as AdsWindow;
    const divId = AD_PLACEMENTS[props.slotId].divId;
    w.googletag?.cmd.push(() => w.zcAds?.refreshNow(divId));
  }, [pathname, props.persistent, props.slotId]);

  if (props.persistent) return <PlacedAd {...props} />;
  return <PlacedAd key={pathname} {...props} />;
}
