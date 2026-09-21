"use client";

type AdSlotProps = {
  className?: string;
  label?: boolean;
};

export function AdSlot({ className = "", label = true }: AdSlotProps) {
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

          Do not force a fixed height because the GAM tag
          can return creatives with different heights.
        */}

        <div
          className="gam-ad-placeholder"
          data-ad-slot="zonecheckr-responsive"
        >
          <span>Advertisement</span>
        </div>
      </div>
    </div>
  );
}
