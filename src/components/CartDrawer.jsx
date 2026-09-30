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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif-display)', fontSize: '1.45rem', color: 'var(--color-espresso)' }}>
              Your Bag
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--color-espresso-light)', fontWeight: 500 }}>
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
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-espresso)' }}>
              Add <strong>${remainingForFreeShipping.toFixed(2)}</strong> for{' '}
              <strong>complimentary shipping</strong>
            </p>
          ) : (
            <p style={{ margin: 0, color: '#27672B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {items.map((item) => (
                <div key={item.id} className="cart-item-card">
                  <div className="cart-item-thumb">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="cart-item-info">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ fontFamily: 'var(--font-serif-display)', fontSize: '1.12rem', color: 'var(--color-espresso)', margin: 0 }}>
                        {item.name}
                      </h4>
                      <span style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--color-espresso)' }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    {/* Variant and volume line */}
                    <div style={{ fontSize: '0.74rem', color: '#776863', margin: '2px 0 8px 0', display: 'flex', gap: '8px' }}>
                      {item.variantName && <span>{item.variantName}</span>}
                      {item.volume && <span>• {item.volume}</span>}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
                        <Trash2 size={14} />
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
                      <img src={cs.image} alt={cs.name} />
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
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.94rem' }}>
              <span style={{ color: 'var(--color-espresso-light)' }}>Subtotal</span>
              <span style={{ fontWeight: 600, fontSize: '1.18rem', color: 'var(--color-espresso)' }}>
                ${subtotal.toFixed(2)}
              </span>
            </div>

            <p style={{ fontSize: '0.74rem', color: '#776863', margin: '0 0 1rem 0' }}>
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

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.72rem', color: '#776863', marginTop: '12px' }}>
              <ShieldCheck size={13} color="#C4A265" />
              <span>Complimentary deluxe mini sample included with every order</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
