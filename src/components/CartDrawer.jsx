import React from 'react';
import { X, Trash2, ArrowRight, ShieldCheck, Sparkles, Plus, Check } from 'lucide-react';
import { CROSS_SELL_PRODUCTS } from '../data/products';

export default function CartDrawer({
  isOpen,
  onClose,
  items = [],
  onUpdateQuantity,
  onRemoveItem,
  onAddCrossSell,
  onCheckout,
}) {
  const FREE_SHIPPING_THRESHOLD = 75;

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressPercent = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  // Filter cross-sells so we don't cross-sell something that's already in the cart with the same id
  const availableCrossSells = CROSS_SELL_PRODUCTS.filter(
    (cs) => !items.some((item) => item.id === cs.id || item.name === cs.name)
  );

  return (
    <>
      {/* Backdrop with blur */}
      <div
        className={`drawer-overlay ${isOpen ? 'is-open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out Drawer */}
      <aside
        className={`cart-drawer ${isOpen ? 'is-open' : ''}`}
        aria-label="Shopping Bag Drawer"
      >
        {/* Cart Header */}
        <div className="cart-header">
          <div className="cart-header-title-wrap">
            <h3 className="cart-header-title">
              Your Bag
            </h3>
            <span className="cart-header-count">
              ({items.reduce((sum, item) => sum + item.quantity, 0)})
            </span>
          </div>

          <button
            className="cart-close-btn"
            onClick={onClose}
            aria-label="Close shopping bag"
          >
            <X size={20} />
          </button>
        </div>

        {/* Dynamic Free Shipping Progress Bar ($75 Threshold) */}
        <div className="cart-shipping-banner">
          {remainingForFreeShipping > 0 ? (
            <p className="cart-shipping-text">
              Add <strong>${remainingForFreeShipping.toFixed(2)}</strong> for{' '}
              <strong>complimentary shipping</strong>
            </p>
          ) : (
            <p className="cart-shipping-unlocked">
              <Sparkles size={14} /> You've unlocked complimentary shipping + travel elixir!
            </p>
          )}
          <div className="cart-shipping-progress">
            <div
              className="cart-shipping-bar"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Body with Line Items */}
        <div className="cart-body">
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', margin: 'auto 0', padding: '2rem' }}>
              <p style={{ fontFamily: 'var(--font-serif-display)', fontSize: '1.4rem', marginBottom: '0.5rem' }}>
                Your bag is empty
              </p>
              <p style={{ fontSize: '0.86rem', color: 'var(--color-espresso-light)', marginBottom: '1.5rem', fontWeight: 300 }}>
                Explore our Élora botanical formulations for healthy glazed skin.
              </p>
              <button
                className="btn-pill-primary"
                onClick={onClose}
                style={{ padding: '12px 24px', fontSize: '0.78rem' }}
              >
                Shop The Edit
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {items.map((item) => (
                <div key={item.id} className="cart-item-card">
                  <div className="cart-item-thumb">
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/elora-hero-serum.jpg';
                      }}
                    />
                  </div>
                  <div className="cart-item-info">
                    <div className="cart-item-header-row">
                      <h4 className="cart-item-title">
                        {item.name}
                      </h4>
                      <span className="cart-item-price">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    {/* Variant and volume line */}
                    {(item.variantName || item.volume) && (
                      <div className="cart-item-meta">
                        {item.variantName && <span>{item.variantName}</span>}
                        {item.variantName && item.volume && <span>•</span>}
                        {item.volume && <span>{item.volume}</span>}
                      </div>
                    )}

                    <div className="cart-item-actions-row">
                      {/* Stepper (+ / - / remove) */}
                      <div className="cart-stepper">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                          className="cart-stepper-btn"
                        >
                          -
                        </button>
                        <span className="cart-stepper-value">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                          className="cart-stepper-btn"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="cart-remove-btn"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* "Complete The Ritual" Mini Cross-Sell Carousel */}
          {availableCrossSells.length > 0 && (
            <div className="cart-cross-sell-section">
              <div className="cross-sell-header">
                <span className="cross-sell-label">Complete Your Ritual</span>
                <span className="cross-sell-badge">Quick-Add</span>
              </div>

              <div className="cross-sell-list">
                {availableCrossSells.slice(0, 3).map((cs) => (
                  <div key={cs.id} className="cross-sell-card">
                    <div className="cross-sell-thumb">
                      <img
                        src={cs.image}
                        alt={cs.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/images/peptide-lip-tint-balm.jpg';
                        }}
                      />
                    </div>
                    <div className="cross-sell-details">
                      <p className="cross-sell-name">{cs.name}</p>
                      <p className="cross-sell-meta">{cs.variantName} • ${cs.price}</p>
                    </div>
                    <button
                      className="cross-sell-add-btn"
                      onClick={() => onAddCrossSell(cs)}
                      aria-label={`Add ${cs.name} to bag`}
                    >
                      <Plus size={13} />
                      <span>Add</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Cart Footer */}
        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-subtotal-row">
              <span className="cart-subtotal-label">Subtotal</span>
              <span className="cart-subtotal-value">
                ${subtotal.toFixed(2)}
              </span>
            </div>

            <p className="cart-taxes-note">
              Taxes and complimentary shipping calculated at checkout.
            </p>

            <button
              onClick={onCheckout}
              className="btn-checkout-full"
              aria-label="Proceed to Checkout"
            >
              <span>Checkout • ${subtotal.toFixed(2)}</span>
              <ArrowRight size={16} />
            </button>

            <div className="cart-sample-perk">
              <ShieldCheck size={14} color="#AC7E76" />
              <span>Complimentary deluxe mini sample included with every order</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
