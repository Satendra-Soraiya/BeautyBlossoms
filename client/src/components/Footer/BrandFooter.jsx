import React from 'react';
import { CONTACT_CONFIG } from '../../config/contact';
import './BrandFooter.css';

const CURRENT_YEAR = 2026;

/**
 * BrandFooter Component
 * 
 * Recreates the heritage Indian palace brand footer from the design reference:
 * - Panoramic illuminated palace backdrop
 * - Elegant editorial typography
 * - Configurable boutique contact info, timings, and appointment booking
 */
export default function BrandFooter({ onAboutClick }) {
  return (
    <footer className="bb-brand-footer" aria-label="Beauty Blossoms Brand Information">
      {/* Illuminated Palace Fort Backdrop Banner */}
      <div className="bb-footer-banner-wrapper">
        <img
          src="/brand/palace-banner.jpg"
          alt="Majestic illuminated royal heritage palace courtyard at dusk"
          className="bb-footer-banner-img"
          loading="lazy"
        />
        <div className="bb-footer-banner-overlay" aria-hidden="true" />
        
        {/* Banner Center Content (Matches Reference Bottom Bar) */}
        <div className="bb-footer-banner-content">
          <div className="bb-footer-brand-title">BEAUTY BLOSSOMS</div>
          <div className="bb-footer-flourish" aria-hidden="true">✿</div>
          <p className="bb-footer-tagline">{CONTACT_CONFIG.tagline}</p>
          
          <button
            type="button"
            onClick={onAboutClick}
            className="bb-footer-about-btn"
          >
            <span>Explore Collection →</span>
          </button>
        </div>
      </div>

      {/* Boutique Details & Concierge Info */}
      <div className="bb-footer-details-container">
        <div className="bb-footer-grid">
          {/* Column 1: Boutique Studio */}
          <div className="bb-footer-col">
            <h4 className="bb-footer-heading">Boutique Studio</h4>
            <address className="bb-footer-address">
              <p>{CONTACT_CONFIG.studio.addressLine1}</p>
              <p>{CONTACT_CONFIG.studio.addressLine2}</p>
              <p>{CONTACT_CONFIG.studio.city}</p>
            </address>
            <p className="bb-footer-timings">
              <strong>Timings:</strong> {CONTACT_CONFIG.studio.timings}
            </p>
            <p className="bb-footer-note">*{CONTACT_CONFIG.studio.note}</p>
          </div>

          {/* Column 2: Concierge & Booking */}
          <div className="bb-footer-col">
            <h4 className="bb-footer-heading">Bespoke Concierge</h4>
            <p className="bb-footer-contact-link">
              <span className="bb-footer-label">Direct Phone:</span>{' '}
              <a href={`tel:${CONTACT_CONFIG.phone.tel}`}>{CONTACT_CONFIG.phone.display}</a>
            </p>
            <p className="bb-footer-contact-link">
              <span className="bb-footer-label">WhatsApp Booking:</span>{' '}
              <a
                href={CONTACT_CONFIG.getGeneralWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
              >
                Chat on WhatsApp
              </a>
            </p>
            <p className="bb-footer-contact-link">
              <span className="bb-footer-label">Inquiries:</span>{' '}
              <a href={`mailto:${CONTACT_CONFIG.email}`}>{CONTACT_CONFIG.email}</a>
            </p>
          </div>

          {/* Column 3: The Collection */}
          <div className="bb-footer-col">
            <h4 className="bb-footer-heading">Navratri & Dandiya</h4>
            <p className="bb-footer-bio">
              Each Beauty Blossoms lehenga is individually handcrafted by generational artisans in Rajasthan and Gujarat, featuring authentic resham, mirror work, and antique zardozi.
            </p>
          </div>
        </div>

        {/* Copyright & Disclaimer Bar */}
        <div className="bb-footer-bottom-row">
          <p className="bb-footer-copy">
            © {CURRENT_YEAR} Beauty Blossoms Couture. All rights reserved.
          </p>
          <p className="bb-footer-disclaimer">
            Catalogue & Studio Booking Experience • No Online Checkout
          </p>
        </div>
      </div>
    </footer>
  );
}
