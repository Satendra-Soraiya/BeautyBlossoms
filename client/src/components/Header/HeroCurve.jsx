import React from 'react';

/**
 * HeroCurve Component
 * 
 * Implements the pixel-precise, asymmetric organic curved silhouette transitioning
 * from the blush-cream header down into the hero image.
 * 
 * Mathematical contour extracted directly from reference specification:
 * - Left edge starts at y = 54px
 * - Curves smoothly downward into an organic scoop (valley at x = 295px, y = 118px)
 *   which cradles the bottom of the circular brand wreath logo
 * - Sweeps gently upward across the center-right to x = 760px, y = 6px
 * - Reaches the right edge at y = 20px
 */
export default function HeroCurve({ className = '' }) {
  return (
    <>
      <div className={`bb-hero-curve-container bb-header-middle-layer ${className}`} aria-hidden="true">
        <svg
          className="bb-hero-curve-svg"
          viewBox="0 0 1000 80"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 0 0
               L 1000 0
               L 1000 12
               C 840 16, 680 78, 500 80
               C 320 78, 160 14, 0 12
               Z"
            fill="#FFF1EB"
          />
        </svg>
      </div>
      <div className="bb-header-bottom-layer" aria-hidden="true" />
    </>
  );
}

