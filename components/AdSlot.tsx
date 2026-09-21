"use client";

type AdSlotProps = {
  className?: string;
  label?: boolean;
  slotId?: string;
};

export function AdSlot({
  className = "",
  label = true,
  slotId = "zonecheckr-responsive",
}: AdSlotProps) {
  return (
    <div className={`gam-ad-slot ${className}`} aria-label="Advertisement">
      <div className="gam-ad-inner">
        {label && <span className="gam-ad-label">Advertisement</span>}

        {/*
          Google Ad Manager tag will replace the placeholder below.

          Desktop supported sizes:
          970x90
          728x90
          300x250
          300x100

          Mobile supported sizes:
          320x50
          300x250
          300x100

          The partner GAM tag can determine the final creative size.
          Do not force a fixed height on this container.
        */}

        <div id={slotId} className="gam-ad-placeholder" data-ad-slot={slotId}>
          <span>Advertisement</span>
        </div>
      </div>
    </div>
  );
}
