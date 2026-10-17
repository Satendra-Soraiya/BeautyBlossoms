import React, { useState, useMemo } from 'react';
import { COLLECTION_CATEGORIES } from '../../data/products';

export default function AdminProductList({
  products = [],
  onEditProduct,
  onAddNewProduct,
  onViewProductInStore,
  onDeleteProduct,
}) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        selectedCategory === 'all' || p.category === selectedCategory;

      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name?.toLowerCase().includes(q) ||
        p.productCode?.toLowerCase().includes(q) ||
        p.details?.colour?.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [products, search, selectedCategory]);

  return (
    <div className="bb-admin-list-container">
      {/* Top Controls Bar */}
      <div className="bb-admin-list-toolbar">
        <div className="bb-toolbar-search-box">
          <svg className="bb-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            className="bb-admin-search-input"
            placeholder="Search code (BB-21), name, or color..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              type="button"
              className="bb-admin-search-clear"
              onClick={() => setSearch('')}
            >
              ✕
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onAddNewProduct}
          className="bb-admin-add-btn"
        >
          <span className="bb-add-plus">+</span>
          <span>Add Lehenga</span>
        </button>
      </div>

      {/* Category Filter Pills Bar (Horizontal Scroll on Mobile) */}
      <div className="bb-admin-category-pills">
        {COLLECTION_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`bb-admin-pill ${selectedCategory === cat.id ? 'is-active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Count Stats Banner */}
      <div className="bb-admin-stats-row">
        <span>Showing <strong>{filtered.length}</strong> of {products.length} outfits</span>
        <span className="bb-stats-note">Garba Rental: ₹500 – ₹1,000 / day</span>
      </div>

      {/* Outfits List */}
      {filtered.length > 0 ? (
        <div className="bb-admin-cards-grid">
          {filtered.map((prod) => {
            const photoCount = Array.isArray(prod.images) ? prod.images.length : 1;

            return (
              <div key={prod.id} className="bb-admin-outfit-card">
                {/* Outfit Thumbnail */}
                <div
                  className="bb-card-thumb-wrap"
                  onClick={() => onEditProduct(prod)}
                >
                  <img
                    src={prod.thumbnail || prod.images?.[0]?.url || `/products/${prod.id}.webp`}
                    alt={prod.name}
                    className="bb-card-thumb"
                    loading="lazy"
                  />
                  <span className="bb-card-photo-chip">
                    📷 {photoCount}
                  </span>
                </div>

                {/* Outfit Details */}
                <div className="bb-card-info">
                  <div className="bb-card-top-tags">
                    <span className="bb-card-code">{prod.productCode}</span>
                    <span className="bb-card-category">{prod.categoryLabel || prod.category}</span>
                  </div>

                  <h4
                    className="bb-card-name"
                    onClick={() => onEditProduct(prod)}
                  >
                    {prod.name}
                  </h4>

                  <div className="bb-card-pricing-row">
                    <span className="bb-card-rent-price">
                      {prod.formattedRentPrice || `₹${prod.rentPrice || 749} / day`}
                    </span>
                    <span className="bb-card-avail-badge">
                      {prod.availability || 'Rent & Buy'}
                    </span>
                  </div>

                  {/* Mobile Quick Action Buttons */}
                  <div className="bb-card-actions-bar">
                    <button
                      type="button"
                      className="bb-card-action-btn bb-action-edit"
                      onClick={() => onEditProduct(prod)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="bb-action-svg">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                      </svg>
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      className="bb-card-action-btn bb-action-view"
                      onClick={() => onViewProductInStore(prod)}
                      title="View live product page in storefront"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="bb-action-svg">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      <span>View</span>
                    </button>

                    <button
                      type="button"
                      className="bb-card-action-btn bb-action-delete"
                      onClick={() => onDeleteProduct(prod)}
                      title="Delete outfit"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="bb-action-svg">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bb-admin-empty-state">
          <span className="bb-empty-icon">✿</span>
          <h3>No outfits found</h3>
          <p>Try adjusting your search query or category filters.</p>
          <button
            type="button"
            className="bb-admin-reset-btn"
            onClick={() => {
              setSearch('');
              setSelectedCategory('all');
            }}
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Floating Action Button for Mobile Add */}
      <button
        type="button"
        className="bb-admin-mobile-fab"
        onClick={onAddNewProduct}
        aria-label="Add new lehenga outfit"
      >
        <span className="bb-fab-icon">+</span>
      </button>
    </div>
  );
}
