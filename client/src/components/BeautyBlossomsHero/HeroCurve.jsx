import React from 'react';

/**
 * HeroCurve Component
 * 
 * Implements:
 * - Layer 2 (Middle layer): Central logo region extending vertically around the logo,
 *   sharing the exact identical solid blush-cream background color (#FFF1EB).
 * - Layer 3 (Bottom layer): The curved, downward-facing U-shaped edge separating
 *   the header from the hero background. Completely transparent with zero fill/overlay,
 *   revealing the hero photograph directly through the curved area.
 */
export default function HeroCurve() {
  return (
    <>
      {/* Middle Layer — Smooth downward U-shape filled with solid #FFF1EB */}
      <div className="bb-header-middle-layer bb-curved-boundary" aria-hidden="true">
        <svg
          className="bb-curve-svg"
          viewBox="0 0 1000 90"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 0 0
               L 1000 0
               L 1000 14
               L 820 14
               C 740 14, 620 90, 500 90
               C 380 90, 260 14, 180 14
               L 0 14
               Z"
            className="bb-curve-fill"
          />
        </svg>
      </div>

      {/* Bottom Layer — Completely transparent U-shaped boundary layer revealing the hero */}
      <div className="bb-header-bottom-layer" aria-hidden="true" />
    </>
  );
}

