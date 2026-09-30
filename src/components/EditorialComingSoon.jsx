import React, { useState } from 'react';
import { X, ArrowRight, Sparkles, MapPin, BookOpen, Check, Bell } from 'lucide-react';

/**
 * Editorial Coming Soon Experience for Élora Skin & Beauty
 * Supports contextual modes:
 * - 'journal': The Élora Journal (Essays, slow beauty, French alpine botanical research)
 * - 'stores': Store Locator & Flagship Boutiques (Paris, New York, Tokyo, London)
 * - 'general': Upcoming Maison feature
 */
export default function EditorialComingSoon({ isOpen, onClose, type = 'journal', onGoToShop }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  if (!isOpen) return null;

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
  };

  const isJournal = type === 'journal';
  const isStores = type === 'stores';

  return (
    <div className="elora-coming-soon-backdrop" role="dialog" aria-modal="true">
      <div className="elora-coming-soon-wrapper">
        {/* Top Dismiss Button */}
        <button
          onClick={onClose}
          className="elora-coming-soon-close"
          aria-label="Close modal and return to boutique"
        >
          <X size={20} strokeWidth={1.5} />
        </button>

        {/* Inner Card Container */}
        <div className="elora-coming-soon-card">
          {/* Eyebrow Pill */}
          <div className="elora-coming-soon-pill">
            <Sparkles size={13} className="text-[#C29F82]" />
            <span>
              {isJournal
                ? 'VOLUME I • IN CURATION'
                : isStores
                ? 'MAISON FLAGSHIPS • 2026 / 2027'
                : 'ÉLORO ARCHIVES • IN PRODUCTION'}
            </span>
          </div>

          {/* Main Display Headline */}
          <h2 className="elora-coming-soon-title">
            {isJournal
              ? 'The Élora Journal'
              : isStores
              ? 'Ateliers & Sanctuaries'
              : 'Maison Élora'}
          </h2>

          <p className="elora-coming-soon-subtitle">
            {isJournal
              ? 'A seasonal print & digital compendium exploring biodynamic alpine botany, cellular longevity, and the intentional philosophy of slow skincare rituals.'
              : isStores
              ? 'Sensory architectural flagships and bespoke facial treatment sanctuaries are in preparation across global cultural capitals.'
              : 'An intentional beauty ritual currently being perfected in our Haute-Savoie formulation laboratories.'}
          </p>

          {/* Contextual Editorial Feature Grid */}
          {isJournal && (
            <div className="elora-coming-soon-grid">
              <div className="elora-coming-soon-item">
                <span className="elora-item-num">ESSAY 01</span>
                <h4>Alpine Epigenetics</h4>
                <p>How high-altitude French Alpine Roses harness extreme UV stress into cellular defense.</p>
              </div>
              <div className="elora-coming-soon-item">
                <span className="elora-item-num">ESSAY 02</span>
                <h4>The Ceramide Illusion</h4>
                <p>Why singular barrier ingredients fail without biomimetic 5-tier lipid transport envelopes.</p>
              </div>
              <div className="elora-coming-soon-item">
                <span className="elora-item-num">ESSAY 03</span>
                <h4>Intentional Skin</h4>
                <p>In praise of the three-step daily glaze ritual over 12-step sensory overwhelm.</p>
              </div>
            </div>
          )}

          {isStores && (
            <div className="elora-coming-soon-stores-grid">
              <div className="elora-store-card">
                <div className="elora-store-icon">
                  <MapPin size={16} />
                </div>
                <div className="elora-store-info">
                  <span className="elora-store-city">Paris • 1er</span>
                  <h5>18 Rue Saint-Honoré</h5>
                  <small>Opening Autumn 2026</small>
                </div>
              </div>

              <div className="elora-store-card">
                <div className="elora-store-icon">
                  <MapPin size={16} />
                </div>
                <div className="elora-store-info">
                  <span className="elora-store-city">New York • UES</span>
                  <h5>684 Madison Avenue</h5>
                  <small>Opening Winter 2026</small>
                </div>
              </div>

              <div className="elora-store-card">
                <div className="elora-store-icon">
                  <MapPin size={16} />
                </div>
                <div className="elora-store-info">
                  <span className="elora-store-city">Tokyo • Minato</span>
                  <h5>5-7-22 Minami-Aoyama</h5>
                  <small>Opening Spring 2027</small>
                </div>
              </div>

              <div className="elora-store-card">
                <div className="elora-store-icon">
                  <MapPin size={16} />
                </div>
                <div className="elora-store-info">
                  <span className="elora-store-city">London • Mayfair</span>
                  <h5>34 Mount Street</h5>
                  <small>Opening Summer 2027</small>
                </div>
              </div>
            </div>
          )}

          {/* VIP Notification Invitation Form */}
          <div className="elora-coming-soon-signup-box">
            {subscribed ? (
              <div className="elora-coming-soon-success">
                <div className="elora-success-icon-wrap">
                  <Check size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <h6>Private Allocation Confirmed</h6>
                  <p>
                    {isJournal
                      ? 'You will receive the inaugural digital issue 48 hours before public dissemination.'
                      : 'You are registered on our private preview guestlist for our flagship grand openings.'}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="elora-coming-soon-form">
                <span className="elora-form-label">
                  {isJournal
                    ? 'RECEIVE THE INAUGURAL ISSUE'
                    : isStores
                    ? 'REQUEST INAUGURAL GUESTLIST ACCESS'
                    : 'RECEIVE PRIVATE ALLOCATION NOTICE'}
                </span>
                <div className="elora-form-row">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="elora-coming-soon-input"
                  />
                  <button type="submit" className="elora-coming-soon-btn">
                    <span>Reserve Access</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Return Action */}
          <div className="elora-coming-soon-footer-actions">
            <button
              type="button"
              className="elora-return-shop-btn"
              onClick={() => {
                onClose();
                onGoToShop?.();
              }}
            >
              Continue Exploring The Collection →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
