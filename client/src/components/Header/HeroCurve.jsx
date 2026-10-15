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
    <div className={`bb-hero-curve-container ${className}`} aria-hidden="true">
      <svg
        className="bb-hero-curve-svg"
        viewBox="0 0 941 125"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="bbHeaderCurveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FDF5F2" />
            <stop offset="50%" stopColor="#FAF0EB" />
            <stop offset="100%" stopColor="#F8ECE7" />
          </linearGradient>
        </defs>
        <path
          d="M 0 0
             L 941 0
             L 941 20
             C 890 15, 820 4, 760 6
             C 600 32, 430 115, 295 118
             C 195 114, 100 68, 0 54
             Z"
          fill="url(#bbHeaderCurveGradient)"
        />
      </svg>
    </div>
  );
}
