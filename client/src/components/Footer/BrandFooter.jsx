import React from 'react';
import { CONTACT_CONFIG } from '../../config/contact';
import './BrandFooter.css';

const CURRENT_YEAR = 2026;

/**
 * BrandFooter Component
 * 
 * Haute Couture Brand Footer inspired by royal Indian luxury design:
 * - Panoramic illuminated palace backdrop with seamless feathered transition
 * - Refined editorial typography with champagne gold and warm ivory accents
 * - 3 structured boutique cards: Studio, Concierge Actions, and Artisan Heritage
 * - Direct one-tap WhatsApp, phone, Instagram, and email links
 * - Elegant ornamental divider and boutique trial disclaimer
 */
export default function BrandFooter({ onAboutClick }) {
  return (
    <footer className="bb-brand-footer" aria-label="Beauty Blossoms Boutique & Studio">
      {/* 1. Panoramic Illuminated Palace Backdrop Banner */}
      <div className="bb-footer-banner-wrapper">
        <img
          src="/brand/palace-banner.jpg"
          alt="Majestic illuminated royal heritage palace courtyard at dusk"
          className="bb-footer-banner-img"
          loading="lazy"
        />
        <div className="bb-footer-banner-overlay" aria-hidden="true" />
        
        {/* Banner Centerpiece Content */}
        <div className="bb-footer-banner-content">
          <div className="bb-banner-eyebrow">HAUTE COUTURE LEHENGAS</div>
          <h3 className="bb-footer-brand-title">BEAUTY BLOSSOMS</h3>
          <div className="bb-footer-flourish" aria-hidden="true">
            <span className="bb-flourish-line" />
            <span className="bb-flourish-glyph">✿</span>
            <span className="bb-flourish-line" />
          </div>
          <p className="bb-footer-tagline">{CONTACT_CONFIG.tagline}</p>
          
          <button
            type="button"
            onClick={onAboutClick}
            className="bb-footer-about-btn"
            aria-label="Explore Dandiya Night Lehengas collection"
          >
            <span>Explore Collection</span>
            <span className="bb-btn-arrow" aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      {/* 2. Structured Luxury Information Grid */}
      <div className="bb-footer-details-container">
        <div className="bb-footer-cards-grid">
          
          {/* Card 1: Boutique Studio */}
          <div className="bb-footer-card">
            <div className="bb-card-header">
              <span className="bb-card-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </span>
              <div>
                <span className="bb-card-eyebrow">BHOPAL, MADHYA PRADESH</span>
                <h4 className="bb-card-title">Boutique Studio</h4>
              </div>
            </div>

            <address className="bb-card-address">
              <p className="bb-address-primary">{CONTACT_CONFIG.studio.addressLine1}, {CONTACT_CONFIG.studio.addressLine2}</p>
              <p className="bb-address-secondary">{CONTACT_CONFIG.studio.city}</p>
            </address>

            <div className="bb-timing-badge">
              <svg className="bb-timing-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>{CONTACT_CONFIG.studio.timings}</span>
            </div>

            <p className="bb-card-note">
              *{CONTACT_CONFIG.studio.note}
            </p>
          </div>

          {/* Card 2: Bespoke Concierge */}
          <div className="bb-footer-card bb-card-highlight">
            <div className="bb-card-header">
              <span className="bb-card-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </span>
              <div>
                <span className="bb-card-eyebrow">INSTANT ASSISTANCE</span>
                <h4 className="bb-card-title">Bespoke Concierge</h4>
              </div>
            </div>

            <div className="bb-concierge-actions">
              {/* WhatsApp Action */}
              <a
                href={CONTACT_CONFIG.getGeneralWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="bb-action-pill bb-action-whatsapp"
                aria-label="Enquire on WhatsApp: +91 85160 51495"
              >
                <svg className="bb-pill-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z" />
                </svg>
                <span>WhatsApp: {CONTACT_CONFIG.phone.display}</span>
              </a>

              {/* Direct Call Action */}
              <a
                href={`tel:${CONTACT_CONFIG.phone.tel}`}
                className="bb-action-pill bb-action-call"
                aria-label="Call studio: +91 85160 51495"
              >
                <svg className="bb-pill-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>Call Studio: {CONTACT_CONFIG.phone.display}</span>
              </a>
            </div>

            {/* Social & Email Row */}
            <div className="bb-secondary-contact-row">
              <a
                href={CONTACT_CONFIG.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="bb-social-chip"
                aria-label="Instagram profile @beautyblossom878"
              >
                <svg className="bb-chip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                <span>@beautyblossom878</span>
              </a>

              <a
                href={`mailto:${CONTACT_CONFIG.email}`}
                className="bb-social-chip"
                aria-label="Email inquiry: beautyblossoms@gmail.com"
              >
                <svg className="bb-chip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <span>{CONTACT_CONFIG.email}</span>
              </a>
            </div>
          </div>

          {/* Card 3: Authentic Heritage */}
          <div className="bb-footer-card">
            <div className="bb-card-header">
              <span className="bb-card-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </span>
              <div>
                <span className="bb-card-eyebrow">GUJARAT & RAJASTHAN</span>
                <h4 className="bb-card-title">Artisan Heritage</h4>
              </div>
            </div>

            <p className="bb-heritage-text">
              Our festive and bridal lehengas are specially curated from authentic generational artisan clusters across Gujarat and Rajasthan — celebrated for authentic hand-cut mirrors, fine resham embroidery, and dramatic 360° twirl flares.
            </p>

            <div className="bb-heritage-tags">
              <span className="bb-tag-item">✦ Authentic Mirror Work</span>
              <span className="bb-tag-item">✦ Pure Silks</span>
              <span className="bb-tag-item">✦ Royal Kalidar Flare</span>
            </div>
          </div>

        </div>

        {/* 3. Ornamental Floral Divider */}
        <div className="bb-footer-ornament-divider" aria-hidden="true">
          <span className="bb-ornament-line" />
          <span className="bb-ornament-motif">✦ ✿ ✦</span>
          <span className="bb-ornament-line" />
        </div>

        {/* 4. Refined Copyright & Studio Policy Bar */}
        <div className="bb-footer-bottom-bar">
          <p className="bb-footer-copyright">
            © {CURRENT_YEAR} BeautyBlossoms. All rights reserved.
          </p>
          <p className="bb-footer-disclaimer">
            Boutique Showcase & In-Studio Trials in Bhopal • No Online Checkout
          </p>
        </div>
      </div>
    </footer>
  );
}
