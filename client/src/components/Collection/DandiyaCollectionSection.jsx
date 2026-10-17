import React, { useState, useMemo } from 'react';
import LehengaProductCard from './LehengaProductCard';
import { LEHENGA_PRODUCTS, COLLECTION_CATEGORIES } from '../../data/products';
import { CONTACT_CONFIG } from '../../config/contact';
import './DandiyaCollectionSection.css';

/**
 * DandiyaCollectionSection Component
 * 
 * Implements the homepage collection section directly following the hero:
 * - Fluid floral ivory-blush background
 * - Two-column responsive card layout
 * - Interactive category filters and sorting
 * - Seamless product detail selection
 */
export default function DandiyaCollectionSection({
  onSelectProduct,
  favorites = [],
  onToggleFavorite,
  products = LEHENGA_PRODUCTS,
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price-asc' | 'price-desc'
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    const list = Array.isArray(products) && products.length > 0 ? products : LEHENGA_PRODUCTS;
    return list.filter((product) => {
      // Category match
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory;

      // Search match
      const matchesSearch =
        !searchQuery.trim() ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.productCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.details?.colour && product.details.colour.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') {
        return (a.price || 0) - (b.price || 0);
      }
      if (sortBy === 'price-desc') {
        return (b.price || 0) - (a.price || 0);
      }
      return 0; // Default order
    });
  }, [products, selectedCategory, sortBy, searchQuery]);

  return (
    <section
      id="collection-section"
      className="bb-collection-section"
      aria-label="Dandiya Night Lehengas Collection"
    >
      {/* Decorative Floral Top Transition Border */}
      <div className="bb-collection-top-divider" aria-hidden="true">
        <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className="bb-divider-svg">
          <path d="M0,0 C300,30 900,30 1200,0 L1200,40 L0,40 Z" fill="var(--bb-cream-light)" />
        </svg>
      </div>

      <div className="bb-collection-container">
        {/* Section Header */}
        <header className="bb-collection-header">
          <div className="bb-collection-eyebrow-wrapper">
            <span className="bb-collection-eyebrow">OUR COLLECTION</span>
            <span className="bb-collection-floral-flourish" aria-hidden="true">✿</span>
          </div>
          
          <h2 className="bb-collection-title">Dandiya Night Lehengas</h2>
          
          <p className="bb-collection-tagline">
            Celebrate every twirl in an outfit made for unforgettable Navratri nights.
          </p>
        </header>

        {/* Collection Controls Bar */}
        <div className="bb-collection-controls">
          <div className="bb-controls-action-row">
            {/* Filter Toggle */}
            <button
              type="button"
              className={`bb-control-btn ${showFilters || selectedCategory !== 'all' ? 'is-active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
              aria-expanded={showFilters}
              aria-label="Filter lehenga collection by category"
            >
              <svg className="bb-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="21" x2="4" y2="14" />
                <line x1="4" y1="10" x2="4" y2="3" />
                <line x1="12" y1="21" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12" y2="3" />
                <line x1="20" y1="21" x2="20" y2="16" />
                <line x1="20" y1="12" x2="20" y2="3" />
                <line x1="1" y1="14" x2="7" y2="14" />
                <line x1="9" y1="8" x2="15" y2="8" />
                <line x1="17" y1="16" x2="23" y2="16" />
              </svg>
              <span>Filter {selectedCategory !== 'all' ? `(${selectedCategory})` : ''}</span>
            </button>

            {/* Sort Toggle */}
            <div className="bb-sort-wrapper">
              <label htmlFor="bb-sort-select" className="visually-hidden">Sort lehengas</label>
              <select
                id="bb-sort-select"
                className="bb-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort lehengas by price or featured"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Collapsible Filter Categories */}
          {showFilters && (
            <div className="bb-filter-pills-bar" role="tablist" aria-label="Lehenga categories">
              {COLLECTION_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={selectedCategory === cat.id}
                  className={`bb-category-pill ${selectedCategory === cat.id ? 'is-active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}

          {/* Quick Search Field */}
          <div className="bb-search-wrapper">
            <svg className="bb-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="search"
              className="bb-search-input"
              placeholder="Search by code (e.g. BB-21) or color..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search collection by outfit code or name"
            />
            {searchQuery && (
              <button
                type="button"
                className="bb-search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search query"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 2-Column Responsive Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="bb-products-grid">
            {filteredProducts.map((product) => (
              <LehengaProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
                isFavorite={favorites.includes(product.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="bb-collection-empty">
            <p>No outfits found matching your selection.</p>
            <button
              type="button"
              className="bb-reset-filters-btn"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Boutique Concierge Assistance Card */}
        <div className="bb-concierge-callout">
          <div className="bb-concierge-content">
            <span className="bb-concierge-eyebrow">BESPOKE STYLING</span>
            <h3 className="bb-concierge-title">Need Help Shortlisting Your Outfit?</h3>
            <p className="bb-concierge-text">
              Our stylists are ready on WhatsApp to guide you on measurements, customization, and trial appointments.
            </p>
          </div>
          <a
            href={CONTACT_CONFIG.getGeneralWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="bb-concierge-action-btn"
            aria-label="Chat with stylist concierge on WhatsApp"
          >
            <svg className="bb-wa-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z" />
            </svg>
            <span>Ask a Stylist</span>
          </a>
        </div>
      </div>
    </section>
  );
}
