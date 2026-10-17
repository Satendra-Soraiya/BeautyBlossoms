import React, { useState } from 'react';
import AdminImageManager from './AdminImageManager';
import { COLLECTION_CATEGORIES } from '../../data/products';
import { adminService } from '../../services/adminService';

const AVAILABLE_STATUSES = [
  { id: 'Rent & Buy', label: 'Rent & Buy (Standard)' },
  { id: 'Rent Only', label: 'Rent Only' },
  { id: 'Available to Own', label: 'Available to Own' },
  { id: 'Booked / Trial', label: 'Booked / Out on Trial' },
];

export default function AdminProductEditor({
  product,
  isNew = false,
  onSaveSuccess,
  onCancel,
  onDeleteSuccess,
}) {
  // Form State
  const [name, setName] = useState(product?.name || '');
  const [productCode, setProductCode] = useState(product?.productCode || '');
  const [category, setCategory] = useState(product?.category || 'festive-special');
  const [rentPrice, setRentPrice] = useState(product?.rentPrice || 799);
  const [buyPrice, setBuyPrice] = useState(product?.price || 34999);
  const [availability, setAvailability] = useState(product?.availability || 'Rent & Buy');
  const [tagline, setTagline] = useState(product?.tagline || '');
  const [slayTagline, setSlayTagline] = useState(product?.slayTagline || 'Rent for Garba night and slay');
  const [description, setDescription] = useState(
    product?.description ||
      'A stunning Dandiya and festive creation curated directly from authentic generational artisan clusters across Gujarat and Rajasthan. Available to rent for your Garba night (₹500 – ₹1,000/day) or direct in-studio purchase — visit our Bhopal studio for trials and fittings.'
  );

  // Specifications State
  const [details, setDetails] = useState({
    colour: product?.details?.colour || 'Smoky Charcoal with Vibrant Embroidery',
    fabric: product?.details?.fabric || 'Pure Silk with Embellished Dupatta',
    work: product?.details?.work || 'Kutchi Geometric Threadwork & Hand Mirror Work',
    flare: product?.details?.flare || '5.4 meters circular flare',
    lining: product?.details?.lining || 'Heavy Shantoon with Stiffened Can-Can Net',
    components: product?.details?.components || 'Flared Kalidar Skirt, Embroidered Choli Blouse, Embellished Dupatta',
    care: product?.details?.care || 'Strictly Dry Clean Only. Store in muslin wrap.',
  });

  // Images State
  const [images, setImages] = useState(product?.images || []);
  const [thumbnail, setThumbnail] = useState(product?.thumbnail || '');

  // UI state
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDetailChange = (key, val) => {
    setDetails((prev) => ({ ...prev, [key]: val }));
  };

  const handlePresetRent = (val) => {
    setRentPrice(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide an outfit name');
      return;
    }
    if (!productCode.trim()) {
      setError('Please provide a boutique SKU code (e.g. BB-21)');
      return;
    }

    setSaving(true);
    setError('');

    const formattedRentPrice = `₹${rentPrice} / day`;
    const formattedPrice = `₹${Number(buyPrice).toLocaleString('en-IN')}`;
    const cleanId = (product?.id || productCode.toLowerCase().replace(/[^a-z0-9]/g, '-')).trim();

    const selectedCategoryObj = COLLECTION_CATEGORIES.find((c) => c.id === category);
    const categoryLabel = selectedCategoryObj?.label || 'Festive Special';

    const payload = {
      id: cleanId,
      slug: cleanId,
      productCode: productCode.trim().toUpperCase(),
      name: name.trim(),
      collection: 'Dandiya Night Lehengas',
      tagline: tagline.trim(),
      slayTagline: slayTagline.trim(),
      rentPrice: Number(rentPrice),
      formattedRentPrice,
      price: Number(buyPrice),
      formattedPrice,
      buyPrice: Number(buyPrice),
      formattedBuyPrice: formattedPrice,
      availability,
      availabilityBadge: availability.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      category,
      categoryLabel,
      featured: product?.featured || false,
      thumbnail: thumbnail || (images[0]?.url) || `/products/${cleanId}.webp`,
      images: images.map((img, idx) => ({
        url: img.url,
        title: img.title || (idx === 0 ? 'Full Front Silhouette' : 'Luxury Gift Box Ensemble & Details'),
        alt: img.alt || `${name} (${productCode}) — Photograph ${idx + 1}`,
      })),
      description: description.trim(),
      details,
      sizeFitting: product?.sizeFitting || {
        standardSizes: 'XS, S, M, L, XL',
        skirtLength: '42 inches standard',
        waistFitting: 'Adjustable drawstring tie-up with matching tassels',
      },
      bookingInfo: product?.bookingInfo || {
        status: 'Available to Rent for Garba Night & Direct In-Studio Purchase.',
        rental: `${formattedRentPrice} (1-Day Garba Rental)`,
        purchase: `${formattedPrice} (Buy to Own)`,
        trials: 'Available for in-person trials & booking at our Bhopal studio (184, Press Colony, Anand Nagar, Bhopal).',
      },
    };

    try {
      if (isNew) {
        const created = await adminService.createProduct(payload);
        onSaveSuccess(created || payload, 'Outfit created successfully!');
      } else {
        const updated = await adminService.updateProduct(cleanId, payload);
        onSaveSuccess(updated || payload, 'Outfit updated successfully!');
      }
    } catch (err) {
      setError(err.message || 'Failed to save outfit changes');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${productCode} (${name})? This cannot be undone.`)) {
      return;
    }

    setDeleting(true);
    try {
      await adminService.deleteProduct(product.id);
      onDeleteSuccess(product.id);
    } catch (err) {
      setError(err.message || 'Failed to delete outfit');
      setDeleting(false);
    }
  };

  return (
    <div className="bb-admin-editor-wrap">
      {/* Sticky Mobile Header */}
      <header className="bb-admin-editor-header">
        <button
          type="button"
          onClick={onCancel}
          className="bb-editor-back-btn"
          aria-label="Back to outfits catalog"
        >
          ← Back
        </button>
        <div className="bb-editor-header-title">
          <h3>{isNew ? 'New Lehenga Outfit' : `Edit ${productCode || 'Outfit'}`}</h3>
          <span className="bb-editor-header-sub">{name || 'Fill in outfit details below'}</span>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          className="bb-editor-save-head-btn"
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </header>

      {error && <div className="bb-editor-error-banner" role="alert">⚠️ {error}</div>}

      <form onSubmit={handleSubmit} className="bb-admin-editor-form">
        {/* Section 1: Photos & Camera Management */}
        <section className="bb-editor-section">
          <AdminImageManager
            images={images}
            thumbnail={thumbnail}
            productCode={productCode || 'BB-NEW'}
            onChangeImages={setImages}
            onChangeThumbnail={setThumbnail}
          />
        </section>

        {/* Section 2: Essential Outfit Identity */}
        <section className="bb-editor-section">
          <h4 className="bb-section-heading">Basic Information</h4>

          <div className="bb-form-grid">
            <div className="bb-field-group">
              <label htmlFor="outfit-name">Outfit Name *</label>
              <input
                id="outfit-name"
                type="text"
                className="bb-input-field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. BB-21 Shyamali Charcoal Festive Lehenga"
                required
              />
            </div>

            <div className="bb-field-row-two">
              <div className="bb-field-group">
                <label htmlFor="outfit-code">Boutique Code *</label>
                <input
                  id="outfit-code"
                  type="text"
                  className="bb-input-field"
                  value={productCode}
                  onChange={(e) => setProductCode(e.target.value.toUpperCase())}
                  placeholder="BB-21"
                  required
                />
              </div>

              <div className="bb-field-group">
                <label htmlFor="outfit-category">Category</label>
                <select
                  id="outfit-category"
                  className="bb-select-field"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {COLLECTION_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bb-field-group">
              <label htmlFor="outfit-tagline">Editorial Tagline</label>
              <input
                id="outfit-tagline"
                type="text"
                className="bb-input-field"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Smoky charcoal silk with vivid scarlet and saffron Gujarati motifs"
              />
            </div>

            <div className="bb-field-group">
              <label htmlFor="outfit-slay">Slay Callout Tagline</label>
              <input
                id="outfit-slay"
                type="text"
                className="bb-input-field"
                value={slayTagline}
                onChange={(e) => setSlayTagline(e.target.value)}
                placeholder="Rent for Garba night and slay"
              />
            </div>
          </div>
        </section>

        {/* Section 3: Rental & Ownership Pricing */}
        <section className="bb-editor-section">
          <h4 className="bb-section-heading">Rental &amp; Purchase Pricing</h4>

          <div className="bb-pricing-editor-card">
            <div className="bb-field-group">
              <label htmlFor="rent-price">1-Day Garba Rental Rate (₹)</label>
              <div className="bb-price-input-row">
                <span className="bb-curr-symbol">₹</span>
                <input
                  id="rent-price"
                  type="number"
                  min="300"
                  max="5000"
                  step="50"
                  className="bb-input-field bb-rent-field"
                  value={rentPrice}
                  onChange={(e) => setRentPrice(e.target.value)}
                  placeholder="749"
                />
                <span className="bb-per-day">/ day</span>
              </div>

              {/* Quick Preset Buttons */}
              <div className="bb-rent-presets">
                {[500, 599, 699, 749, 799, 899, 999].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    className={`bb-preset-chip ${Number(rentPrice) === amt ? 'is-selected' : ''}`}
                    onClick={() => handlePresetRent(amt)}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>

            <div className="bb-field-row-two" style={{ marginTop: '1rem' }}>
              <div className="bb-field-group">
                <label htmlFor="buy-price">Buy-to-Own Retail Price (₹)</label>
                <div className="bb-price-input-row">
                  <span className="bb-curr-symbol">₹</span>
                  <input
                    id="buy-price"
                    type="number"
                    min="1000"
                    step="500"
                    className="bb-input-field"
                    value={buyPrice}
                    onChange={(e) => setBuyPrice(e.target.value)}
                    placeholder="34999"
                  />
                </div>
              </div>

              <div className="bb-field-group">
                <label htmlFor="availability-status">Availability</label>
                <select
                  id="availability-status"
                  className="bb-select-field"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                >
                  {AVAILABLE_STATUSES.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Garment Craftsmanship & Specs */}
        <section className="bb-editor-section">
          <h4 className="bb-section-heading">Garment Details &amp; Specifications</h4>

          <div className="bb-form-grid">
            <div className="bb-field-row-two">
              <div className="bb-field-group">
                <label htmlFor="spec-colour">Colour Palette</label>
                <input
                  id="spec-colour"
                  type="text"
                  className="bb-input-field"
                  value={details.colour}
                  onChange={(e) => handleDetailChange('colour', e.target.value)}
                  placeholder="e.g. Smoky Charcoal with Scarlet Trim"
                />
              </div>

              <div className="bb-field-group">
                <label htmlFor="spec-fabric">Fabric</label>
                <input
                  id="spec-fabric"
                  type="text"
                  className="bb-input-field"
                  value={details.fabric}
                  onChange={(e) => handleDetailChange('fabric', e.target.value)}
                  placeholder="e.g. Pure Dupion Silk with Embroidered Dupatta"
                />
              </div>
            </div>

            <div className="bb-field-row-two">
              <div className="bb-field-group">
                <label htmlFor="spec-work">Embroidery &amp; Work</label>
                <input
                  id="spec-work"
                  type="text"
                  className="bb-input-field"
                  value={details.work}
                  onChange={(e) => handleDetailChange('work', e.target.value)}
                  placeholder="e.g. Kutchi Mirror Kalis & Hand Tassels"
                />
              </div>

              <div className="bb-field-group">
                <label htmlFor="spec-flare">Flare (Twirl Diameter)</label>
                <input
                  id="spec-flare"
                  type="text"
                  className="bb-input-field"
                  value={details.flare}
                  onChange={(e) => handleDetailChange('flare', e.target.value)}
                  placeholder="e.g. 5.3 meters circular flare"
                />
              </div>
            </div>

            <div className="bb-field-group">
              <label htmlFor="outfit-description">Full Description</label>
              <textarea
                id="outfit-description"
                rows={3}
                className="bb-textarea-field"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Sticky Mobile Footer Action Bar */}
        <div className="bb-editor-sticky-footer">
          {!isNew && (
            <button
              type="button"
              onClick={handleDelete}
              className="bb-editor-delete-action"
              disabled={deleting || saving}
            >
              {deleting ? 'Deleting...' : 'Delete Outfit'}
            </button>
          )}

          <div className="bb-editor-footer-right">
            <button
              type="button"
              onClick={onCancel}
              className="bb-editor-cancel-action"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bb-editor-save-action"
              disabled={saving}
            >
              {saving ? 'Publishing...' : 'Save & Publish'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
