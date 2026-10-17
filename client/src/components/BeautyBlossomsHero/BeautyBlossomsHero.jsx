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
 * - Instant synchronized paint with modern WebP / JPG / PNG fallback
 */
export default function BeautyBlossomsHero({
  cartCount = 0,
  onMenuClick,
  onCartClick,
  onExploreClick,
  heroImageSrc = '/Pink-Gold Dandiya Celebration.webp',
  onImageLoaded,
}) {
  return (
    <section className="bb-hero-wrapper" aria-label="Beauty Blossoms Haute Couture Hero">
      {/* Background Photography Container - Synchronous Picture Layer */}
      <div
        className="bb-hero-background"
        role="img"
        aria-label="Model dancing with dandiya sticks in pink and gold embroidered lehenga with festive floral arch and palace background"
      >
        <picture className="bb-hero-picture">
          <source srcSet="/Pink-Gold Dandiya Celebration.webp" type="image/webp" />
          <source srcSet="/Pink-Gold Dandiya Celebration.jpg" type="image/jpeg" />
          <img
            src={heroImageSrc}
            alt="Model dancing with dandiya sticks in pink and gold embroidered lehenga with festive floral arch and palace background"
            className="bb-hero-img"
            loading="eager"
            fetchPriority="high"
            decoding="sync"
            onLoad={onImageLoaded}
          />
        </picture>
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
