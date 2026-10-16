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
    <div className="bb-curved-boundary" aria-hidden="true">
      <svg
        className="bb-curve-svg"
        viewBox="0 0 1000 60"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 0 0
             L 1000 0
             L 1000 24
             C 700 24, 600 60, 500 60
             C 400 60, 300 24, 0 24
             Z"
          className="bb-curve-fill"
          fill="var(--bb-header-bg, #FCEAE3)"
        />
      </svg>
    </div>
  );
}


