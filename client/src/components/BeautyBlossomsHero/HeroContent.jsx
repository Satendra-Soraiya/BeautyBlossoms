import React from 'react';
import CollectionCTA from './CollectionCTA';

/**
 * HeroContent Component
 * 
 * Houses the editorial fashion typography positioned in the lower-left
 * portion of the hero section matching the reference screenshot:
 * - Eyebrow: TRADITIONAL ELEGANCE
 * - Heading: Italic luxury serif "Lehenga Collection"
 * - Tagline: "Every occasion deserves a Blooming You ♡"
 * - Pill-shaped CTA button
 */
export default function HeroContent({ onExploreClick }) {
  return (
    <div className="bb-hero-content-layer">
      <div className="bb-hero-editorial-block">
        {/* Eyebrow Label */}
        <p className="bb-hero-eyebrow" aria-label="Category: Traditional Elegance">
          TRADITIONAL ELEGANCE
        </p>

        {/* Main Editorial Heading */}
        <h1 className="bb-hero-heading">
          <span className="bb-heading-line bb-heading-line1">Lehenga</span>
          <span className="bb-heading-line bb-heading-line2">Collection</span>
        </h1>

        {/* Two-line Description with Heart */}
        <p className="bb-hero-description">
          Every occasion deserves
          <br />
          a Blooming You <span className="bb-heart-glyph" aria-hidden="true">♡</span>
        </p>

        {/* Primary Call-to-Action */}
        <CollectionCTA onClick={onExploreClick} />
      </div>
    </div>
  );
}
