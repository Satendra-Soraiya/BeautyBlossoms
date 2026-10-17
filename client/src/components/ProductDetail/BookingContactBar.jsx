import React from 'react';
import { CONTACT_CONFIG } from '../../config/contact';

/**
 * BookingContactBar Component
 * 
 * Implements the non-eCommerce contact bar:
 * - NO Add to Cart, checkout, or online payments.
 * - Primary Action: "Call to Book" (`tel:...`)
 * - Secondary Action: "Enquire on WhatsApp" (`https://wa.me/...` with prefilled enquiry)
 * - Wishlist heart toggle button
 * - Fixed at viewport bottom with safe-area spacing
 */
export default function BookingContactBar({
  product,
  isFavorite = false,
  onToggleFavorite,
}) {
  const { name, productCode } = product;

  const whatsAppUrl = CONTACT_CONFIG.getWhatsAppEnquiryUrl(name, productCode);
  const telUrl = `tel:${CONTACT_CONFIG.phone.tel}`;

  return (
    <aside className="bb-booking-bar-wrapper" aria-label="Book or enquire about outfit">
      <div className="bb-booking-bar-inner">
        {/* Wishlist Shortlist Button */}
        <button
          type="button"
          className={`bb-booking-fav-btn ${isFavorite ? 'is-active' : ''}`}
          onClick={() => onToggleFavorite && onToggleFavorite(product.id)}
          aria-label={isFavorite ? `Remove ${name} from saved shortlist` : `Save ${name} to shortlist`}
        >
          <svg
            className="bb-booking-heart-icon"
            viewBox="0 0 24 24"
            fill={isFavorite ? '#CF2A52' : 'none'}
            stroke={isFavorite ? '#CF2A52' : '#641527'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Call to Book Action */}
        <a
          href={telUrl}
          className="bb-booking-call-btn"
          aria-label={`Call Beauty Blossoms concierge to book ${name}`}
        >
          <svg className="bb-booking-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <span>Call to Book</span>
        </a>

        {/* Enquire on WhatsApp Action (Prominent Rose-Pink Pill) */}
        <a
          href={whatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bb-booking-whatsapp-btn"
          aria-label={`Send prefilled enquiry for ${name} on WhatsApp`}
        >
          <svg className="bb-booking-btn-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z" />
          </svg>
          <span>Enquire on WhatsApp</span>
        </a>
      </div>
    </aside>
  );
}
