/**
 * Beauty Blossoms — Boutique CMS Administration Service
 * 
 * Provides secure, mobile-friendly API communication for managing lehenga outfits:
 * - Passcode verification and session persistence
 * - Direct camera snapshots & gallery uploads to backend Sharp optimization pipeline
 * - Real-time creation, updating, renaming, and removal of outfits
 */

const TOKEN_KEY = 'bb_cms_token';
const REMEMBER_KEY = 'bb_cms_remember';

export const adminService = {
  /**
   * Checks if current browser session has verified passcode
   */
  isAuthenticated() {
    try {
      const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
      return Boolean(token && token.startsWith('bb_authenticated_'));
    } catch {
      return false;
    }
  },

  /**
   * Verifies the 4-digit boutique passcode
   */
  async verifyPasscode(pin, remember = true) {
    try {
      const res = await fetch('/api/auth/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.token) {
        if (remember) {
          localStorage.setItem(TOKEN_KEY, data.token);
          localStorage.setItem(REMEMBER_KEY, 'true');
        } else {
          sessionStorage.setItem(TOKEN_KEY, data.token);
        }
        return { success: true };
      }

      return { success: false, error: data.error || 'Invalid boutique passcode' };
    } catch (err) {
      // Local offline verification fallback for 2026 if backend network is unreachable
      if (String(pin).trim() === '2026') {
        const dummyToken = 'bb_authenticated_offline_2026';
        if (remember) {
          localStorage.setItem(TOKEN_KEY, dummyToken);
        } else {
          sessionStorage.setItem(TOKEN_KEY, dummyToken);
        }
        return { success: true };
      }
      return { success: false, error: err.message || 'Verification connection failed' };
    }
  },

  /**
   * Logs out from CMS session
   */
  logout() {
    try {
      localStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
    } catch (e) {
      console.warn('Logout storage error:', e);
    }
  },

  /**
   * Uploads an outfit photo (from mobile camera or photo gallery)
   * Backend automatically rotates and optimizes into high-fidelity WebP
   */
  async uploadImage(file, productCode = 'outfit', title = '') {
    const formData = new FormData();
    formData.append('images', file);
    formData.append('productCode', productCode);
    if (title) formData.append('title', title);

    const res = await fetch('/api/products/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to upload photo');
    }

    const data = await res.json();
    return data.image || (data.images && data.images[0]);
  },

  /**
   * Creates a new lehenga outfit in the collection
   */
  async createProduct(productData) {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create outfit');
    }

    const data = await res.json();
    return data.data;
  },

  /**
   * Updates an existing lehenga outfit
   */
  async updateProduct(id, productData) {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update outfit');
    }

    const data = await res.json();
    return data.data;
  },

  /**
   * Deletes a lehenga outfit from the catalog
   */
  async deleteProduct(id) {
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to delete outfit');
    }

    return await res.json();
  },
};
