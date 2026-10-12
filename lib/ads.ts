// Google Ad Manager slot configuration.
//
// Each placement gets its own div id so several placements can share one ad
// unit on the same page. To report on a placement separately, create a new
// ad unit in GAM and change its `path` here; nothing else needs to change.

type Size = [number, number] | "fluid";
type SizeMapping = Array<[[number, number], Size[]]>;

export type AdPlacementConfig = {
  path: string;
  divId: string;
  sizes: Size[];
  mapping: SizeMapping;
};

const NETWORK = "/23043164651";

// Compact leaderboard: protects above-the-fold usability.
const TOP_MAPPING: SizeMapping = [
  [[1024, 0], [[970, 90], [960, 90], [728, 90], [970, 66], [320, 100], [300, 100], [320, 50], [300, 50]]],
  [[768, 0], [[728, 90], [320, 100], [300, 100], [320, 50], [300, 50]]],
  [[0, 0], [[320, 50], [320, 100], [300, 100], [300, 50]]],
];

// In-content placements can take larger display formats.
const BODY_MAPPING: SizeMapping = [
  [[1024, 0], [[970, 90], [728, 90], [300, 250], [300, 100], [320, 100], [320, 50], [300, 50], "fluid"]],
  [[768, 0], [[728, 90], [300, 250], [300, 100], [320, 100], [320, 50], [300, 50], "fluid"]],
  [[0, 0], [[300, 250], [320, 100], [320, 50], [300, 100], [300, 50], "fluid"]],
];

// Guide articles sit in a content card that only fits a 970-wide ad on
// screens 1200px and wider, so 970x90 starts there instead of at 1024px.
// Below 1024px this is identical to BODY_MAPPING.
const GUIDE_BODY_MAPPING: SizeMapping = [
  [[1200, 0], [[970, 90], [728, 90], [300, 250], [300, 100], [320, 100], [320, 50], [300, 50], "fluid"]],
  [[1024, 0], [[728, 90], [300, 250], [300, 100], [320, 100], [320, 50], [300, 50], "fluid"]],
  ...BODY_MAPPING.slice(1),
];

// Second placement near the end of tool and guide pages. Desktop takes every
// format including 970x90 and fluid; tablet and phone sizes are unchanged.
const SECONDARY_DESKTOP: Size[] = [[970, 90], [728, 90], [336, 280], [300, 250], [320, 100], [300, 100], [320, 50], [300, 50], "fluid"];
const SECONDARY_TABLET_AND_PHONE: SizeMapping = [
  [[768, 0], [[728, 90], [300, 250], [336, 280], [320, 100], [300, 100], [320, 50], [300, 50]]],
  [[0, 0], [[300, 250], [320, 100], [300, 100], [320, 50], [300, 50]]],
];
const SECONDARY_MAPPING: SizeMapping = [[[1024, 0], SECONDARY_DESKTOP], ...SECONDARY_TABLET_AND_PHONE];
const GUIDE_SECONDARY_MAPPING: SizeMapping = [
  [[1200, 0], SECONDARY_DESKTOP],
  [[1024, 0], SECONDARY_DESKTOP.filter((size) => size === "fluid" || size[0] !== 970)],
  ...SECONDARY_TABLET_AND_PHONE,
];

// Bottom anchor: compact so it never covers much of the tool UI.
const ANCHOR_MAPPING: SizeMapping = [
  [[768, 0], [[728, 90], [320, 100], [320, 50], [300, 100], [300, 50]]],
  [[0, 0], [[320, 100], [320, 50], [300, 100], [300, 50]]],
];

function sizesOf(mapping: SizeMapping): Size[] {
  const seen = new Set<string>();
  const all: Size[] = [];
  for (const [, sizes] of mapping) {
    for (const size of sizes) {
      const key = JSON.stringify(size);
      if (!seen.has(key)) {
        seen.add(key);
        all.push(size);
      }
    }
  }
  return all;
}

function placement(path: string, divId: string, mapping: SizeMapping): AdPlacementConfig {
  return { path: `${NETWORK}/${path}`, divId, sizes: sizesOf(mapping), mapping };
}

export const AD_PLACEMENTS = {
  // Homepage, directly below the header.
  "homepage-top": placement("zonecheckr_banner1", "div-gpt-ad-1790006377572-0", TOP_MAPPING),
  // Homepage, below the hero.
  "homepage-lower": placement("zonecheckr_banner2", "div-gpt-ad-1790180731446-0", BODY_MAPPING),
  // Homepage, just before "Start with a complete domain health check".
  "homepage-health": placement("zonecheckr_banner2", "div-gpt-ad-1790180731446-1", BODY_MAPPING),
  // Individual tool and guide pages, first in-content placement.
  "tool-mid-content": placement("zonecheckr_banner3", "div-gpt-ad-1790006153357-inline-0", BODY_MAPPING),
  "guide-mid-content": placement("zonecheckr_banner3", "div-gpt-ad-1790006153357-inline-0", GUIDE_BODY_MAPPING),
  // Individual tool and guide pages, second placement near the end of content.
  "tool-end-content": placement("zonecheckr_banner2", "div-gpt-ad-1790180731446-end-0", SECONDARY_MAPPING),
  "guide-end-content": placement("zonecheckr_banner2", "div-gpt-ad-1790180731446-end-0", GUIDE_SECONDARY_MAPPING),
  // Fixed bottom anchor, keeps the partner-provided div id.
  "bottom-anchor": placement("zonecheckr_banner3", "div-gpt-ad-1790006153357-0", ANCHOR_MAPPING),
} satisfies Record<string, AdPlacementConfig>;

export type AdPlacement = keyof typeof AD_PLACEMENTS;
