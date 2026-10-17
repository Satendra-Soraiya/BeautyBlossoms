import React, { useState, useEffect } from 'react';
import AdminPinModal from './AdminPinModal';
import AdminProductList from './AdminProductList';
import AdminProductEditor from './AdminProductEditor';
import { adminService } from '../../services/adminService';
import { getProducts } from '../../services/productService';
import { LEHENGA_PRODUCTS } from '../../data/products';
import './AdminCMS.css';

export default function AdminCMS({ onExitToStore, onSelectProductToView }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => adminService.isAuthenticated());
  const [products, setProducts] = useState(LEHENGA_PRODUCTS);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [toast, setToast] = useState('');

  // Load latest live products catalog on mount or auth
  const loadLatestProducts = () => {
    getProducts({ forceRefresh: true }).then((loaded) => {
      if (Array.isArray(loaded) && loaded.length > 0) {
        setProducts(loaded);
      }
    }).catch((err) => {
      console.warn('Failed to fetch fresh products for CMS:', err);
    });
  };

  useEffect(() => {
    let isMounted = true;
    if (isAuthenticated) {
      getProducts({ forceRefresh: true }).then((loaded) => {
        if (isMounted && Array.isArray(loaded) && loaded.length > 0) {
          setProducts(loaded);
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => {
      setToast('');
    }, 3500);
  };

  const handleLogout = () => {
    adminService.logout();
    setIsAuthenticated(false);
    setEditingProduct(null);
  };

  const handleAddNew = () => {
    // Generate next available code
    const existingNums = products
      .map((p) => {
        const match = p.productCode?.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
      })
      .filter((n) => !isNaN(n));

    const nextNum = existingNums.length > 0 ? Math.max(...existingNums) + 1 : 1;
    const nextCode = `BB-${String(nextNum).padStart(2, '0')}`;

    setEditingProduct({
      id: nextCode.toLowerCase(),
      productCode: nextCode,
      name: `${nextCode} Handcrafted Festive Lehenga`,
      category: 'festive-special',
      rentPrice: 749,
      formattedRentPrice: '₹749 / day',
      price: 34999,
      formattedPrice: '₹34,999',
      availability: 'Rent & Buy',
      tagline: 'Authentic handcrafted kalidar silk lehenga with artisanal Gujarati embroidery',
      slayTagline: 'Rent for Garba night and slay',
      images: [],
      thumbnail: '',
      details: {
        colour: 'Royal Jewel Tone',
        fabric: 'Pure Silk with Embellished Dupatta',
        work: 'Kutchi Mirror Kalis & Hand Tassels',
        flare: '5.2 meters circular flare',
        lining: 'Heavy Shantoon with Stiffened Can-Can Net',
        components: 'Flared Kalidar Skirt, Embroidered Choli Blouse, Embellished Dupatta',
        care: 'Strictly Dry Clean Only. Store in muslin wrap.',
      },
    });
    setIsNew(true);
  };

  const handleEditProduct = (prod) => {
    setEditingProduct(prod);
    setIsNew(false);
  };

  const handleSaveSuccess = (savedProd, message) => {
    setEditingProduct(null);
    setIsNew(false);
    showToast(message || 'Changes saved successfully!');
    // Update local state immediately
    setProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === savedProd.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = savedProd;
        return copy;
      }
      return [savedProd, ...prev];
    });
    // Also re-verify with backend
    loadLatestProducts();
  };

  const handleDeleteProduct = async (prod) => {
    if (!window.confirm(`Delete outfit ${prod.productCode} (${prod.name}) from the catalog?`)) {
      return;
    }

    try {
      await adminService.deleteProduct(prod.id);
      showToast(`Outfit ${prod.productCode} deleted successfully.`);
      setProducts((prev) => prev.filter((p) => p.id !== prod.id));
    } catch (err) {
      alert(`Could not delete outfit: ${err.message}`);
    }
  };

  const handleViewInStore = (prod) => {
    if (onSelectProductToView) {
      onSelectProductToView(prod);
    } else {
      window.location.hash = `#product/${prod.slug || prod.id}`;
    }
  };

  if (!isAuthenticated) {
    return (
      <AdminPinModal
        onAuthenticated={() => setIsAuthenticated(true)}
        onExit={onExitToStore}
      />
    );
  }

  return (
    <div className="bb-admin-root">
      {/* Toast Notification */}
      {toast && (
        <div className="bb-admin-toast" role="status">
          <span className="bb-toast-icon">✓</span>
          <span>{toast}</span>
        </div>
      )}

      {/* Main CMS Navigation Bar */}
      <header className="bb-admin-nav-bar">
        <div className="bb-admin-nav-brand">
          <span className="bb-admin-brand-icon">✿</span>
          <div className="bb-admin-brand-titles">
            <h2>Beauty Blossoms</h2>
            <span className="bb-admin-brand-sub">Boutique Catalog CMS</span>
          </div>
        </div>

        <div className="bb-admin-nav-actions">
          <button
            type="button"
            onClick={onExitToStore}
            className="bb-admin-view-store-btn"
          >
            <span>Storefront</span>
            <span className="bb-btn-arrow">↗</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="bb-admin-logout-btn"
            title="Log out from CMS"
            aria-label="Log out"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="bb-logout-svg">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main CMS Body */}
      <main className="bb-admin-main-content">
        {editingProduct ? (
          <AdminProductEditor
            product={editingProduct}
            isNew={isNew}
            onSaveSuccess={handleSaveSuccess}
            onCancel={() => {
              setEditingProduct(null);
              setIsNew(false);
            }}
            onDeleteSuccess={(deletedId) => {
              setEditingProduct(null);
              setProducts((prev) => prev.filter((p) => p.id !== deletedId));
              showToast('Outfit deleted.');
            }}
          />
        ) : (
          <AdminProductList
            products={products}
            onEditProduct={handleEditProduct}
            onAddNewProduct={handleAddNew}
            onViewProductInStore={handleViewInStore}
            onDeleteProduct={handleDeleteProduct}
          />
        )}
      </main>
    </div>
  );
}
