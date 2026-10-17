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
        {/* Localized dreamy blush-white glow layer behind text */}
        <div className="bb-hero-text-haze" aria-hidden="true" />

        {/* Eyebrow Label */}
        <p className="bb-hero-eyebrow" aria-label="Category: Dandiya Nights">
          DANDIYA NIGHTS
        </p>

        {/* Main Editorial Heading */}
        <h1 className="bb-hero-heading">
          <span className="bb-heading-line bb-heading-line1">Navratri</span>
          <span className="bb-heading-line bb-heading-line2">Lehenga</span>
        </h1>

        {/* Subtitle / Description */}
        <p className="bb-hero-description">
          Tradition in Every Twirl <span className="bb-heart-glyph" aria-hidden="true">♡</span>
        </p>

        {/* Rent for Garba Night Slay Callout */}
        <div className="bb-hero-slay-bar" aria-label="Rent for Garba night and slay">
          <div className="bb-hero-slay-title">
            <span className="bb-slay-star" aria-hidden="true">✦</span>
            <span className="bb-slay-text">Rent for Garba night and slay</span>
          </div>
          <div className="bb-hero-slay-sub">
            1-Day Garba Rentals ₹500 to ₹1,000 / day · Rent &amp; Buy
          </div>
        </div>

        {/* Primary Call-to-Action */}
        <CollectionCTA onClick={onExploreClick} label="Explore Collection" />
      </div>
    </div>
  );
}
