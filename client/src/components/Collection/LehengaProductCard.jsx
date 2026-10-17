import React from 'react';

/**
 * LehengaProductCard Component
 * 
 * Displays individual lehenga card in the 2-column mobile responsive grid:
 * - High-resolution portrait photograph with graceful aspect ratio (3:4)
 * - Wishlist heart toggle button (non-commercial, saving shortlisted favourites)
 * - Real availability status badge
 * - Product Code & Name
 * - Price & View Details action
 */
export default function LehengaProductCard({
  product,
  onSelectProduct,
  isFavorite,
  onToggleFavorite,
}) {
  const {
    productCode,
    name,
    formattedPrice,
    availability,
    availabilityBadge,
    thumbnail,
  } = product;

  const handleCardClick = () => {
    if (onSelectProduct) {
      onSelectProduct(product);
    }
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(product.id);
    }
  };

  const badgeClass = `bb-product-badge bb-badge-${availabilityBadge || 'available'}`;

  const handleImageError = (e) => {
    if (e.currentTarget.dataset.fallbackApplied) return;
    e.currentTarget.dataset.fallbackApplied = 'true';
    const fallbacks = {
      'rani-pink': '/products/bb-10.webp',
      'sunshine-yellow': '/products/bb-02.webp',
      'royal-plum': '/products/bb-05.webp',
      'blush-pink': '/products/bb-01.webp',
      'festive-special': '/products/bb-03.webp',
      'bridal-festive': '/products/bb-25.webp',
    };
    e.currentTarget.src = fallbacks[product.category] || '/products/bb-01.webp';
  };

  return (
    <article
      className="bb-product-card"
      onClick={handleCardClick}
      aria-label={`View details for ${name} (${productCode})`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* Product Image Stage */}
      <div className="bb-card-image-wrapper">
        <img
          src={thumbnail}
          alt={`${name} — ${productCode} Dandiya Night Lehenga`}
          className="bb-card-image"
          loading="lazy"
          onError={handleImageError}
        />

        {/* Wishlist Heart Button */}
        <button
          type="button"
          className={`bb-card-wishlist-btn ${isFavorite ? 'is-active' : ''}`}
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? `Remove ${name} from saved shortlist` : `Save ${name} to shortlist`}
        >
          <svg
            className="bb-heart-icon-svg"
            viewBox="0 0 24 24"
            fill={isFavorite ? '#CF2A52' : 'none'}
            stroke={isFavorite ? '#CF2A52' : '#4A232B'}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Availability Badge */}
        {availability && (
          <span className={badgeClass}>
            {availability}
          </span>
        )}
      </div>

      {/* Product Card Information */}
      <div className="bb-card-content">
        <span className="bb-card-code">{productCode}</span>
        <h3 className="bb-card-title">{name}</h3>
        <div className="bb-card-footer-row">
          <span className="bb-card-price">{formattedPrice}</span>
          <span className="bb-card-view-btn" aria-hidden="true">
            View Details →
          </span>
        </div>
      </div>
    </article>
  );
}
