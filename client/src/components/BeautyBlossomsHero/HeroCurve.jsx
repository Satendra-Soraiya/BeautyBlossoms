import React from 'react';

/**
 * HeroCurve Component
 * 
 * Symmetrical, shallow organic downward scoop matching reference:
 * - Flat sides extending down to baseline
 * - Gentle scoop in center dipping under the logo (depth reduced by ~40%)
 * - Smooth horizontal transitions at edges
 * - Solid #FCEAE3 fill matching header background
 * - Transparent below path revealing the hero photograph
 */
export default function HeroCurve() {
  return (
    <div className="bb-header-bg-container" aria-hidden="true">
      <svg
        className="bb-header-bg-svg"
        viewBox="0 0 1000 100"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 0 0
             L 1000 0
             L 1000 74
             C 740 74, 640 100, 500 100
             C 360 100, 260 74, 0 74
             Z"
          className="bb-curve-fill"
          fill="var(--bb-header-bg, #FCEAE3)"
        />
      </svg>
    </div>
  );
}


