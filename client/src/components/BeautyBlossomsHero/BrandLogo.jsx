import React from 'react';

/**
 * BrandLogo Component
 * 
 * Renders the authoritative transparent Beauty Blossoms logo.
 * Maintains native square aspect ratio and is centered horizontally relative
 * to the viewport rather than between adjacent controls.
 */
export default function BrandLogo({ logoSrc = '/logo.svg' }) {
  return (
    <div className="bb-brand-logo-container">
      <a
        href="/"
        className="bb-brand-logo-link"
        aria-label="Beauty Blossoms — Traditional Elegance Homepage"
      >
        <img
          src={logoSrc}
          alt="Beauty Blossoms Logo"
          className="bb-brand-logo-img"
          loading="eager"
          width="96"
          height="96"
        />
      </a>
    </div>
  );
}
