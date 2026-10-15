import React from 'react';
import HeroHeader from './HeroHeader';
import HeroContent from './HeroContent';
import './BeautyBlossomsHero.css';

/**
 * BeautyBlossomsHero Component
 * 
 * Master container implementing the authoritative mobile fashion hero section:
 * - Edge-to-edge floral couture photography featuring the model
 * - Pale blush-pink/cream header with viewport-centered logo and curved boundary
 * - Editorial typography with burgundy headline and raspberry CTA pill button
 */
export default function BeautyBlossomsHero({
  cartCount = 0,
  onMenuClick,
  onCartClick,
  onExploreClick,
  heroImageSrc = '/hero bg.png',
}) {
  return (
    <section className="bb-hero-wrapper" aria-label="Beauty Blossoms Haute Couture Hero">
      {/* Background Photography Container */}
      <div
        className="bb-hero-background"
        style={{ backgroundImage: `url("${heroImageSrc}")` }}
        role="img"
        aria-label="Model dressed in delicate pink floral embroidered lehenga seated in romantic floral arch"
      >
        {/* Soft atmospheric gradient to ensure high text contrast while preserving image glow */}
        <div className="bb-hero-atmospheric-overlay" aria-hidden="true" />
      </div>

      {/* Floating Curved Header */}
      <HeroHeader
        cartCount={cartCount}
        onMenuClick={onMenuClick}
        onCartClick={onCartClick}
      />

      {/* Editorial Content Layer positioned in lower-left */}
      <HeroContent onExploreClick={onExploreClick} />
    </section>
  );
}
