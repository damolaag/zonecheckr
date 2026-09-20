type AdSlotProps = {
  slotId: string;
  className?: string;
};

/**
 * Responsive GAM-ready ad container.
 *
 * The actual GAM tag will be inserted here once the ad unit/tag is supplied.
 * Keeping the markup centralized means every placement can use the same
 * responsive creative without duplicating ad code across pages.
 */
export function AdSlot({ slotId, className = "" }: AdSlotProps) {
  return (
    <aside
      className={`responsive-ad-slot ${className}`.trim()}
      aria-label="Advertisement"
      data-ad-slot={slotId}
    >
      <span className="ad-label">Advertisement</span>
      <div className="responsive-ad-frame" id={slotId}>
        <div className="ad-placeholder-copy" aria-hidden="true">
          <strong>Ad space</strong>
          <span className="ad-size-desktop">970×90 / 728×90</span>
          <span className="ad-size-mobile">300×250</span>
        </div>
      </div>
    </aside>
  );
}
