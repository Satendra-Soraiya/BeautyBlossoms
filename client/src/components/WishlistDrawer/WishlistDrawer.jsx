import React from 'react';
import { CONTACT_CONFIG } from '../../config/contact';
import { LEHENGA_PRODUCTS } from '../../data/products';
import './WishlistDrawer.css';

/**
 * WishlistDrawer Component
 * 
 * Replaces any shopping cart with a luxury bridal shortlist drawer:
 * - Customers can review their saved favourite lehengas
 * - Allows sending a consolidated enquiry to WhatsApp
 * - Direct "Call Studio to Book Trial" button
 */
export default function WishlistDrawer({
  isOpen,
  onClose,
  favoriteIds = [],
  onRemoveFavorite,
  onSelectProduct,
  products = LEHENGA_PRODUCTS,
}) {
  if (!isOpen) return null;

  const catalog = Array.isArray(products) && products.length > 0 ? products : LEHENGA_PRODUCTS;
  const savedProducts = catalog.filter((p) => favoriteIds.includes(p.id));

  const handleEnquireAll = () => {
    const url = CONTACT_CONFIG.getWishlistWhatsAppUrl(savedProducts);
    window.open(url, '_blank');
  };

  return (
    <div
      className="bb-drawer-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Shortlisted lehengas"
      onClick={onClose}
    >
      <div className="bb-drawer-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bb-drawer-header">
          <div className="bb-drawer-title-box">
            <h3 className="bb-drawer-title">Saved Shortlist</h3>
            <span className="bb-drawer-subtitle">
              {savedProducts.length} {savedProducts.length === 1 ? 'outfit' : 'outfits'} selected for trial
            </span>
          </div>
          <button
            type="button"
            className="bb-drawer-close-btn"
            onClick={onClose}
            aria-label="Close shortlist"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="bb-drawer-content">
          {savedProducts.length > 0 ? (
            <div className="bb-drawer-items-list">
              {savedProducts.map((product) => (
                <div key={product.id} className="bb-drawer-item">
                  <img
                    src={product.thumbnail}
                    alt={product.name}
                    className="bb-drawer-item-img"
                    onError={(e) => {
                      if (!e.currentTarget.dataset.fallbackApplied) {
                        e.currentTarget.dataset.fallbackApplied = 'true';
                        e.currentTarget.src = '/products/bb-21-front.jpg';
                      }
                    }}
                    onClick={() => {
                      onClose();
                      onSelectProduct(product);
                    }}
                  />
                  <div className="bb-drawer-item-info">
                    <span className="bb-drawer-item-code">{product.productCode}</span>
                    <h4
                      className="bb-drawer-item-name"
                      onClick={() => {
                        onClose();
                        onSelectProduct(product);
                      }}
                    >
                      {product.name}
                    </h4>
                    <span className="bb-drawer-item-price">{product.formattedPrice}</span>
                    <span className="bb-drawer-badge">{product.availability}</span>
                  </div>
                  <button
                    type="button"
                    className="bb-drawer-remove-btn"
                    onClick={() => onRemoveFavorite(product.id)}
                    aria-label={`Remove ${product.name} from shortlist`}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bb-drawer-empty">
              <span className="bb-drawer-empty-icon" aria-hidden="true">♡</span>
              <h4>Your Shortlist is Empty</h4>
              <p>Tap the heart icon on any lehenga to save outfits for your studio trial or enquiry.</p>
              <button type="button" className="bb-drawer-browse-btn" onClick={onClose}>
                Browse Dandiya Collection
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {savedProducts.length > 0 && (
          <div className="bb-drawer-footer">
            <button
              type="button"
              className="bb-drawer-wa-btn"
              onClick={handleEnquireAll}
            >
              <span>Enquire Shortlist on WhatsApp</span>
            </button>
            <a
              href={`tel:${CONTACT_CONFIG.phone.tel}`}
              className="bb-drawer-call-btn"
            >
              <span>Call Concierge ({CONTACT_CONFIG.phone.display})</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
