import React from 'react';
import { CONTACT_CONFIG } from '../../config/contact';
import './BrandFooter.css';

const CURRENT_YEAR = 2026;

/**
 * BrandFooter Component
 * 
 * Clean, high-end editorial luxury footer:
 * - Panoramic illuminated palace backdrop with soft dark vignette
 * - Deep velvet espresso-wine canvas matching the brand's royal palette
 * - Spacious architectural typography with zero artificial card boxes or badge clutter
 * - Direct, clean links for WhatsApp, Phone, Instagram, and Email
 * - Understated quiet luxury styling with delicate hairline divider
 */
export default function BrandFooter({ onAboutClick }) {
  return (
    <footer className="bb-brand-footer" aria-label="Beauty Blossoms Studio Information">
      {/* 1. Atmospheric Illuminated Palace Banner */}
      <div className="bb-footer-banner-wrapper">
        <img
          src="/brand/palace-banner.jpg"
          alt="Royal heritage palace courtyard illuminated at dusk"
          className="bb-footer-banner-img"
          loading="lazy"
        />
        <div className="bb-footer-banner-overlay" aria-hidden="true" />
        
        <div className="bb-footer-banner-content">
          <span className="bb-banner-eyebrow">HAUTE COUTURE LEHENGAS</span>
          <h3 className="bb-footer-brand-title">BEAUTY BLOSSOMS</h3>
          <p className="bb-footer-tagline">Tradition. Elegance. You.</p>
          
          <button
            type="button"
            onClick={onAboutClick}
            className="bb-footer-explore-btn"
            aria-label="Explore Dandiya Night Lehengas collection"
          >
            <span>Explore Collection</span>
            <span className="bb-btn-arrow" aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      {/* 2. Editorial Information Section (Super Clean & Unboxed) */}
      <div className="bb-footer-body">
        <div className="bb-footer-columns">
          
          {/* Column 1: Studio Location */}
          <div className="bb-footer-section">
            <h4 className="bb-section-label">VISIT OUR STUDIO</h4>
            <address className="bb-studio-address">
              <p className="bb-address-street">{CONTACT_CONFIG.studio.addressLine1}, {CONTACT_CONFIG.studio.addressLine2}</p>
              <p className="bb-address-city">{CONTACT_CONFIG.studio.city}</p>
            </address>
            <div className="bb-studio-meta">
              <span className="bb-meta-label">Hours:</span>
              <span className="bb-meta-value">{CONTACT_CONFIG.studio.timings}</span>
            </div>
            <p className="bb-studio-footnote">*{CONTACT_CONFIG.studio.note}</p>
          </div>

          {/* Column 2: Concierge & Direct Contact */}
          <div className="bb-footer-section">
            <h4 className="bb-section-label">CONCIERGE & BOOKINGS</h4>
            <ul className="bb-contact-list">
              <li>
                <span className="bb-list-label">WhatsApp</span>
                <a
                  href={CONTACT_CONFIG.getGeneralWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bb-contact-link"
                >
                  {CONTACT_CONFIG.phone.display}
                </a>
              </li>
              <li>
                <span className="bb-list-label">Direct Call</span>
                <a
                  href={`tel:${CONTACT_CONFIG.phone.tel}`}
                  className="bb-contact-link"
                >
                  {CONTACT_CONFIG.phone.display}
                </a>
              </li>
              <li>
                <span className="bb-list-label">Email</span>
                <a
                  href={`mailto:${CONTACT_CONFIG.email}`}
                  className="bb-contact-link"
                >
                  {CONTACT_CONFIG.email}
                </a>
              </li>
              <li>
                <span className="bb-list-label">Instagram</span>
                <a
                  href={CONTACT_CONFIG.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bb-contact-link"
                >
                  @beautyblossom878
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Regional Heritage */}
          <div className="bb-footer-section">
            <h4 className="bb-section-label">AUTHENTIC HERITAGE</h4>
            <p className="bb-heritage-description">
              Curated directly from generational artisan clusters across Gujarat and Rajasthan. Each lehenga features authentic resham threadwork, hand-cut mirror work, and full circular twirl kalis — showcased exclusively for in-person trials at our Bhopal studio.
            </p>
          </div>

        </div>

        {/* 3. Hairline Divider & Bottom Copyright */}
        <div className="bb-footer-bottom">
          <div className="bb-footer-rule" />
          <div className="bb-footer-bottom-content">
            <p className="bb-copyright">
              © {CURRENT_YEAR} BeautyBlossoms. All rights reserved.
            </p>
            <p className="bb-policy-note">
              Bhopal Boutique Showcase • Direct In-Studio Purchase Only
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
