import React from 'react';
import './HeroSection.css';
import { BRAND_ASSETS } from '../../config/assets';

/**
 * HeroSection Component
 * 
 * Recreates the editorial haute couture showcase from the mobile reference:
 * - Edge-to-edge photography with romantic floral Indian couture aesthetic
 * - Seamless visual connection with the organic curved header
 * - Exact typography hierarchy: Traditional Elegance eyebrow, cursive italic
 *   Lehenga Collection headline, occasion tagline with heart symbol, and
 *   pill-shaped 'Explore Collection' call-to-action button
 */
export default function HeroSection({ onExploreClick }) {
  return (
    <section className="bb-hero-section" aria-label="Haute Couture Showcase">
      {/* Background Image Container */}
      <div
        className="bb-hero-bg-wrapper"
        style={{ backgroundImage: `url("${BRAND_ASSETS.heroBackground}")` }}
        role="img"
        aria-label="Model showcasing intricate pink embroidered bridal lehenga"
      >
        {/* Soft atmospheric gradient overlay for typography readability */}
        <div className="bb-hero-atmospheric-scrim" />

        {/* Content Container positioned to match reference layout */}
        <div className="bb-hero-content-container">
          <div className="bb-hero-text-block">
            {/* Eyebrow Label */}
            <p className="bb-hero-eyebrow">TRADITIONAL ELEGANCE</p>

            {/* Main Editorial Headline */}
            <h1 className="bb-hero-title">
              <span className="bb-title-line1">Lehenga</span>
              <span className="bb-title-line2">Collection</span>
            </h1>

            {/* Tagline with floral/heart accent */}
            <p className="bb-hero-tagline">
              Every occasion deserves
              <br />
              a Blooming You <span className="bb-heart-symbol" aria-hidden="true">♡</span>
            </p>

            {/* Call To Action Button */}
            <div className="bb-hero-cta-wrapper">
              <button
                type="button"
                className="bb-hero-cta-btn"
                onClick={onExploreClick}
                aria-label="Explore the Lehenga Collection"
              >
                <span>Explore Collection</span>
                <svg
                  className="bb-cta-arrow"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
