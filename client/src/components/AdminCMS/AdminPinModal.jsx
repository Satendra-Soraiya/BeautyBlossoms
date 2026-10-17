import React, { useState } from 'react';
import { adminService } from '../../services/adminService';
import './AdminCMS.css';

export default function AdminPinModal({ onAuthenticated, onExit }) {
  const [pin, setPin] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pin.trim()) {
      setError('Please enter your 4-digit boutique passcode');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await adminService.verifyPasscode(pin.trim(), remember);
      if (res.success) {
        onAuthenticated();
      } else {
        setError(res.error || 'Incorrect passcode. Try again.');
      }
    } catch (err) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyClick = (digit) => {
    if (pin.length < 6) {
      setPin((prev) => prev + digit);
      setError('');
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setError('');
  };

  return (
    <div className="bb-admin-pin-backdrop">
      <div className="bb-admin-pin-card">
        {/* Brand Header */}
        <div className="bb-admin-pin-header">
          <div className="bb-admin-lock-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2 className="bb-admin-pin-title">Boutique Staff Portal</h2>
          <p className="bb-admin-pin-sub">
            Enter passcode to manage outfits, prices &amp; camera uploads
          </p>
        </div>

        {/* PIN Form */}
        <form onSubmit={handleSubmit} className="bb-admin-pin-form">
          <div className="bb-admin-pin-input-wrap">
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError('');
              }}
              placeholder="••••"
              className="bb-admin-pin-field"
              autoFocus
              aria-label="4-digit boutique passcode"
            />
          </div>

          {error && <div className="bb-admin-pin-error" role="alert">{error}</div>}

          {/* Quick Keypad for Mobile Touch Convenience */}
          <div className="bb-admin-keypad" aria-hidden="true">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                type="button"
                className="bb-admin-keypad-btn"
                onClick={() => handleKeyClick(num)}
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              className="bb-admin-keypad-btn bb-keypad-clear"
              onClick={() => setPin('')}
            >
              C
            </button>
            <button
              type="button"
              className="bb-admin-keypad-btn"
              onClick={() => handleKeyClick(0)}
            >
              0
            </button>
            <button
              type="button"
              className="bb-admin-keypad-btn bb-keypad-del"
              onClick={handleBackspace}
              aria-label="Delete last digit"
            >
              ⌫
            </button>
          </div>

          <label className="bb-admin-remember-row">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="bb-admin-remember-check"
            />
            <span>Remember this mobile device</span>
          </label>

          <button
            type="submit"
            className="bb-admin-pin-submit-btn"
            disabled={loading || pin.length < 4}
          >
            {loading ? 'Verifying...' : 'Unlock CMS Portal'}
          </button>
        </form>

        <div className="bb-admin-pin-footer">
          <button type="button" onClick={onExit} className="bb-admin-exit-link">
            ← Return to Boutique Store
          </button>
          <span className="bb-admin-pin-hint">Default Passcode: <strong>2026</strong></span>
        </div>
      </div>
    </div>
  );
}
