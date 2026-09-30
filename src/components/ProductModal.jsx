import React, { useState } from 'react';
import { X, Check, Star, Sparkles, Droplet } from 'lucide-react';

export default function ProductModal({ product, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 900);
  };

  return (
    <div
      className="drawer-overlay is-open"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
      onClick={onClose}
    >
      <div
        className="product-modal-dialog"
        style={{
          background: '#FFFDF9',
          borderRadius: '24px',
          maxWidth: '860px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 60px rgba(58, 46, 43, 0.25)',
          border: '1px solid var(--color-border)',
          position: 'relative',
          padding: '2.5rem',
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr',
          gap: '2.5rem',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '50%',
            color: 'var(--color-espresso)',
          }}
          aria-label="Close product details"
        >
          <X size={20} />
        </button>

        {/* Modal Left Image */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div
            style={{
              aspectRatio: '1 / 1',
              borderRadius: '20px',
              overflow: 'hidden',
              background: '#F4EFE7',
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          {product.secondaryImage && (
            <div
              style={{
                aspectRatio: '16 / 9',
                borderRadius: '14px',
                overflow: 'hidden',
                background: '#F4EFE7',
              }}
            >
              <img
                src={product.secondaryImage}
                alt={`${product.name} active botanical`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          )}
        </div>

        {/* Modal Right Info */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <span
              style={{
                background: 'rgba(212, 197, 189, 0.4)',
                padding: '4px 10px',
                borderRadius: '9999px',
                fontSize: '0.7rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              {product.badge}
            </span>
            <span style={{ fontSize: '0.78rem', color: '#776863' }}>{product.volume}</span>
          </div>

          <h2 style={{ fontFamily: 'var(--font-serif-display)', fontSize: '2rem', marginBottom: '4px' }}>
            {product.name}
          </h2>
          <p style={{ color: 'var(--color-espresso-light)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            {product.subtitle}
          </p>

          <div style={{ fontSize: '1.4rem', fontWeight: 500, marginBottom: '1.2rem' }}>
            ${product.price}
          </div>

          <p style={{ fontSize: '0.92rem', color: '#4A3B37', lineHeight: 1.65, marginBottom: '1.5rem', fontWeight: 300 }}>
            {product.description}
          </p>

          {/* Key Actives */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.76rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.6rem', color: '#776863' }}>
              Bio-Active Ingredients
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {product.keyActives?.map((act, i) => (
                <span
                  key={i}
                  style={{
                    background: '#F4EFE7',
                    border: '1px solid var(--color-border)',
                    padding: '6px 12px',
                    borderRadius: '9999px',
                    fontSize: '0.78rem',
                    color: 'var(--color-espresso)',
                  }}
                >
                  {act}
                </span>
              ))}
            </div>
          </div>

          {/* Clinical Results */}
          {product.clinicalMetrics && (
            <div
              style={{
                background: '#F9F6F0',
                padding: '1rem',
                borderRadius: '14px',
                border: '1px solid var(--color-border)',
                marginBottom: '1.8rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <Sparkles size={14} color="#C4A265" />
                <span style={{ fontSize: '0.74rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Clinical Evaluation
                </span>
              </div>
              {product.clinicalMetrics.map((m, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '3px 0' }}>
                  <span style={{ color: '#5A4A45' }}>{m.label}</span>
                  <strong style={{ color: 'var(--color-espresso)' }}>{m.value}</strong>
                </div>
              ))}
            </div>
          )}

          {/* Add to Bag Row */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: 'auto' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                border: '1px solid var(--color-border)',
                borderRadius: '9999px',
                padding: '6px 14px',
                gap: '12px',
              }}
            >
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: 'var(--color-espresso)' }}
              >
                -
              </button>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, minWidth: '16px', textAlign: 'center' }}>
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: 'var(--color-espresso)' }}
              >
                +
              </button>
            </div>

            <button
              onClick={handleAdd}
              className="btn-pill-primary"
              style={{ flex: 1 }}
              disabled={added}
            >
              {added ? (
                <>
                  <Check size={16} /> Added to Bag
                </>
              ) : (
                `Add to Bag • $${product.price * quantity}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
