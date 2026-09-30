import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  CreditCard,
  Truck,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Gift
} from 'lucide-react';
import GlitterConfetti from './GlitterConfetti';

export default function CheckoutPage({
  isOpen,
  onClose,
  items = [],
  onClearCart,
  onOpenStore,
}) {
  const [confettiActive, setConfettiActive] = useState(false);
  // Form State with lazy localStorage initialization
  const [formData, setFormData] = useState(() => {
    let email = '';
    let firstName = '';
    let lastName = '';
    try {
      const stored = localStorage.getItem('elora_user');
      if (stored) {
        const u = JSON.parse(stored);
        if (u && u.email) {
          email = u.email;
          if (u.full_name) {
            firstName = u.full_name.split(' ')[0] || '';
            lastName = u.full_name.split(' ').slice(1).join(' ') || '';
          }
        }
      }
    } catch {
      // ignore
    }

    return {
      email,
      subscribeNewsletter: true,
      firstName,
      lastName,
      address: '',
      apartment: '',
      city: '',
      state: 'CA',
      zipCode: '',
      country: 'United States',
      phone: '',
      shippingMethod: 'standard', // 'standard' | 'express'
      paymentMethod: 'card', // 'card' | 'klarna' | 'cod'
      cardNumber: '',
      cardExpiry: '',
      cardCvc: '',
      cardName: '',
    };
  });

  const [formErrors, setFormErrors] = useState({});
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null); // { code: 'GLAZE15', percent: 15 }
  const [discountError, setDiscountError] = useState('');

  // Processing state: 'idle' | 'processing' | 'confirmed'
  const [paymentState, setPaymentState] = useState('idle');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [orderNumber, setOrderNumber] = useState('');

  // Calculate totals
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = appliedDiscount ? (subtotal * appliedDiscount.percent) / 100 : 0;
  const isFreeShipping = subtotal >= 75 || (appliedDiscount && appliedDiscount.freeShipping);
  const shippingCost = formData.shippingMethod === 'express' ? 14.0 : isFreeShipping ? 0 : 6.0;
  const estimatedTax = (subtotal - discountAmount) * 0.0825;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingCost + estimatedTax);

  // Quick test autofill helper
  const handleQuickFill = () => {
    setFormData((prev) => ({
      ...prev,
      email: prev.email || 'client@elora-botanicals.com',
      firstName: 'Elena',
      lastName: 'Rostova',
      address: '742 Evergreen Terrace',
      apartment: 'Suite 4B',
      city: 'Beverly Hills',
      state: 'CA',
      zipCode: '90210',
      phone: '+1 (555) 234-5678',
      cardNumber: '4242 •••• •••• 4242',
      cardExpiry: '12/28',
      cardCvc: '888',
      cardName: 'Elena Rostova',
    }));
    setFormErrors({});
  };

  const handleApplyDiscount = (e) => {
    e.preventDefault();
    setDiscountError('');
    const code = discountCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'GLAZE15' || code === 'WELCOME15') {
      setAppliedDiscount({ code, percent: 15, label: '15% Off Your Ritual' });
      setDiscountCode('');
    } else if (code === 'FREESHIP') {
      setAppliedDiscount({ code, percent: 0, freeShipping: true, label: 'Complimentary Shipping' });
      setDiscountCode('');
    } else {
      setDiscountError('Invalid promotional code. Try GLAZE15');
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.email || !formData.email.includes('@')) {
      errors.email = 'Valid email is required for confirmation.';
    }
    if (!formData.firstName.trim()) errors.firstName = 'First name is required.';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required.';
    if (!formData.address.trim()) errors.address = 'Delivery address is required.';
    if (!formData.city.trim()) errors.city = 'City is required.';
    if (!formData.zipCode.trim()) errors.zipCode = 'ZIP code is required.';

    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber.trim()) errors.cardNumber = 'Card number is required.';
      if (!formData.cardExpiry.trim()) errors.cardExpiry = 'Expiry date required.';
      if (!formData.cardCvc.trim()) errors.cardCvc = 'CVC required.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const processingSteps = [
    { title: 'Authorizing Secure Payment', detail: 'Verifying 256-bit encrypted token...' },
    { title: 'Atelier Queue Allocation', detail: 'Assigning cold-pressed batch from sterile vault...' },
    { title: 'Robotic Formulation & Inspection', detail: 'Extracting Alpine rose stem cells & oligo-hyaluronic peptides...' },
    { title: 'Packaging & Custom Wax Emblem', detail: 'Hand-sealing luxury flacon in recyclable linen sleeve...' },
    { title: 'Receipt Printed & Courier Dispatched', detail: 'Payment confirmed. Complimentary deluxe samples included.' },
  ];

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      // Scroll to first error
      const firstErr = document.querySelector('.checkout-field-error');
      if (firstErr) {
        firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Generate clean order number
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    setOrderNumber(`EL-${randomNum}`);

    // Begin processing with luxury glitters & shimmers
    setPaymentState('processing');
    setProcessingProgress(0);
    setCurrentStepIndex(0);
    setConfettiActive(false);
  };

  // Step progression during processing (smooth ~2.8s simulation)
  useEffect(() => {
    if (paymentState !== 'processing') return;

    const interval = setInterval(() => {
      setProcessingProgress((prev) => {
        const next = prev + 3.5;
        const step = Math.min(
          Math.floor((next / 100) * processingSteps.length),
          processingSteps.length - 1
        );
        setCurrentStepIndex(step);

        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setPaymentState('confirmed');
            setConfettiActive(true);
            if (onClearCart) onClearCart();
          }, 350);
          return 100;
        }
        return next;
      });
    }, 90);

    return () => clearInterval(interval);
  }, [paymentState, onClearCart, processingSteps.length]);

  if (!isOpen) return null;

  return (
    <div className="checkout-page-overlay" role="dialog" aria-modal="true" aria-label="Élora Secure Checkout">
      {/* Active Glitter, Shimmer & Foil Confetti Overlay */}
      {confettiActive && <GlitterConfetti active={true} continuous={true} />}

      {/* =========================================================================
          PROCESSING STATE: LUXURY SHIMMER & GLITTER PROCESSING MODAL
         ========================================================================= */}
      {paymentState === 'processing' && (
        <div className="checkout-processing-container shimmer-processing-view">
          {/* Ambient Floating Shimmers */}
          <div className="shimmer-particles-ambient">
            <span className="shimmer-star s1">✦</span>
            <span className="shimmer-star s2">✨</span>
            <span className="shimmer-star s3">✧</span>
            <span className="shimmer-star s4">✦</span>
            <span className="shimmer-star s5">✨</span>
            <span className="shimmer-star s6">✧</span>
          </div>

          <div className="shimmer-processing-card">
            {/* Luminous Pulsing Seal */}
            <div className="shimmer-seal-wrap">
              <div className="shimmer-ring-outer" />
              <div className="shimmer-ring-inner" />
              <div className="shimmer-seal-core">
                <Sparkles size={36} color="#D4AF37" className="seal-sparkle-icon" />
              </div>
            </div>

            <div className="shimmer-badge-pill">
              <span className="shimmer-dot" />
              <span>PROCESSING ENCRYPTED PAYMENT</span>
            </div>

            <h3 className="shimmer-processing-title">
              {processingSteps[currentStepIndex].title}
            </h3>
            <p className="shimmer-processing-detail">
              {processingSteps[currentStepIndex].detail}
            </p>

            {/* Shimmer Gold Progress Bar */}
            <div className="shimmer-progress-track">
              <div
                className="shimmer-progress-fill"
                style={{ width: `${Math.min(100, processingProgress)}%` }}
              />
            </div>

            <div className="shimmer-progress-stats">
              <span>Allocating French Alpine Rose Ritual</span>
              <span>{Math.round(Math.min(100, processingProgress))}%</span>
            </div>

            <div className="shimmer-footer-note">
              <span>Total authorized: <strong>${grandTotal.toFixed(2)}</strong></span>
              <span className="shimmer-secure-tag">
                <ShieldCheck size={13} color="#27672B" /> 256-Bit TLS Bank Encrypted
              </span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          CONFIRMED STATE: LUXURY ORDER RECEIPT + CONFETTI CELEBRATION
         ========================================================================= */}
      {paymentState === 'confirmed' && (
        <div className="checkout-confirmed-container">
          <div className="confirmed-card">
            <div className="confirmed-icon-wrap shimmer-celebrate-glow">
              <CheckCircle2 size={48} color="#27672B" />
              <div className="confirmed-sparkle-badge">✦</div>
            </div>

            <span className="confirmed-eyebrow">✦ ORDER CONFIRMED & ALLOCATED ✦</span>
            <h2 className="confirmed-title">Thank You, {formData.firstName}!</h2>
            <p className="confirmed-subtitle">
              Your order <strong>#{orderNumber}</strong> has been authorized and formulated at the Élora Atelier.
              A confirmation receipt and courier tracking details have been sent to <strong>{formData.email}</strong>.
            </p>

            {/* Estimated Delivery Timeline */}
            <div className="confirmed-timeline">
              <div className="timeline-item is-done">
                <div className="timeline-bullet" />
                <div className="timeline-text">
                  <strong>Order Confirmed</strong>
                  <small>Today</small>
                </div>
              </div>
              <div className="timeline-divider is-done" />
              <div className="timeline-item is-active">
                <div className="timeline-bullet" />
                <div className="timeline-text">
                  <strong>Formulation & Packaging</strong>
                  <small>In Atelier</small>
                </div>
              </div>
              <div className="timeline-divider" />
              <div className="timeline-item">
                <div className="timeline-bullet" />
                <div className="timeline-text">
                  <strong>White-Glove Delivery</strong>
                  <small>2–3 business days</small>
                </div>
              </div>
            </div>

            {/* Order Recap */}
            <div className="confirmed-summary-box">
              <div className="confirmed-summary-header">
                <span>Items Ordered ({items.reduce((s, i) => s + i.quantity, 0)})</span>
                <span>Total Paid: ${grandTotal.toFixed(2)}</span>
              </div>
              <div className="confirmed-items-scroll">
                {items.map((item) => (
                  <div key={item.id} className="confirmed-item-row">
                    <img src={item.image} alt={item.name} className="confirmed-item-img" />
                    <div className="confirmed-item-info">
                      <p className="confirmed-item-name">{item.name}</p>
                      <p className="confirmed-item-meta">
                        Qty: {item.quantity} {item.variantName ? `• ${item.variantName}` : ''}
                      </p>
                    </div>
                    <span className="confirmed-item-price">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Complimentary Gift Perks Note */}
            <div className="confirmed-perk-callout">
              <Gift size={16} color="#AC7E76" />
              <span>
                Complimentary French Alpine Rose deluxe miniature sample + cold-pressed elixir vial included in your custom box.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="confirmed-actions">
              <button
                className="btn-pill-primary confirmed-continue-btn"
                onClick={() => {
                  setConfettiActive(false);
                  onClose();
                  if (onOpenStore) onOpenStore();
                }}
              >
                Continue Shopping
              </button>

              <button
                className="btn-pill-secondary confirmed-replay-btn"
                onClick={() => {
                  // Re-trigger celebratory burst
                  setConfettiActive(false);
                  setTimeout(() => setConfettiActive(true), 50);
                }}
              >
                <Sparkles size={15} color="#D4AF37" />
                <span>Shower More Glitters & Confetti ✨</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          IDLE STATE: LUXURY CHECKOUT FORM & SUMMARY
         ========================================================================= */}
      {paymentState === 'idle' && (
        <div className="checkout-main-content">
          {/* Header */}
          <header className="checkout-header">
            <div className="checkout-header-inner">
              <button
                className="checkout-back-btn"
                onClick={onClose}
                aria-label="Return to shopping bag"
              >
                <ArrowLeft size={16} />
                <span>Return to Bag</span>
              </button>

              <div className="checkout-logo-wrap">
                <h1 className="checkout-brand-logo">É L O R A</h1>
                <span className="checkout-header-tag">Atelier Checkout</span>
              </div>

              <div className="checkout-security-badge">
                <Lock size={13} color="#27672B" />
                <span>256-Bit Encrypted</span>
              </div>
            </div>
          </header>

          {/* Main 2-Column Body */}
          <div className="checkout-container">
            <div className="checkout-grid">
              {/* Left Column: Form */}
              <div className="checkout-form-column">
                {/* Express Checkout */}
                <div className="checkout-express-section">
                  <div className="express-title">Express Checkout</div>
                  <div className="express-buttons-row">
                    <button
                      type="button"
                      className="btn-express-pay btn-apple-pay"
                      onClick={handleQuickFill}
                      title="Quick Fill Demo Details"
                    >
                      <span className="apple-logo"></span> Pay
                    </button>
                    <button
                      type="button"
                      className="btn-express-pay btn-shop-pay"
                      onClick={handleQuickFill}
                    >
                      shop<span className="shop-pay-highlight">Pay</span>
                    </button>
                    <button
                      type="button"
                      className="btn-express-pay btn-google-pay"
                      onClick={handleQuickFill}
                    >
                      G Pay
                    </button>
                  </div>
                </div>

                <div className="checkout-divider">
                  <span>OR CONTINUE WITH BESPOKE CHECKOUT</span>
                </div>

                <div className="quick-fill-helper-row">
                  <span className="helper-label">Need a fast demonstration?</span>
                  <button
                    type="button"
                    className="btn-quick-fill"
                    onClick={handleQuickFill}
                  >
                    ⚡ One-Click Autofill Demo Info
                  </button>
                </div>

                <form onSubmit={handlePlaceOrder} noValidate>
                  {/* Step 1: Contact Information */}
                  <section className="checkout-section">
                    <div className="section-header-row">
                      <h2 className="checkout-section-title">1. Contact Information</h2>
                    </div>

                    <div className="checkout-field-wrap">
                      <label htmlFor="checkout-email" className="checkout-label">
                        Email Address <span className="req">*</span>
                      </label>
                      <input
                        id="checkout-email"
                        type="email"
                        className={`checkout-input ${formErrors.email ? 'has-error' : ''}`}
                        placeholder="you@domain.com"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
                        }}
                      />
                      {formErrors.email && (
                        <span className="checkout-field-error">{formErrors.email}</span>
                      )}
                    </div>

                    <label className="checkout-checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.subscribeNewsletter}
                        onChange={(e) =>
                          setFormData({ ...formData, subscribeNewsletter: e.target.checked })
                        }
                      />
                      <span>Keep me informed of rare seasonal harvests and secret botanical drops</span>
                    </label>
                  </section>

                  {/* Step 2: Delivery Address */}
                  <section className="checkout-section">
                    <h2 className="checkout-section-title">2. Shipping Destination</h2>

                    <div className="checkout-field-wrap">
                      <label htmlFor="checkout-country" className="checkout-label">
                        Country / Region
                      </label>
                      <select
                        id="checkout-country"
                        className="checkout-select"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="France">France</option>
                        <option value="Germany">Germany</option>
                        <option value="Australia">Australia</option>
                        <option value="Japan">Japan</option>
                      </select>
                    </div>

                    <div className="checkout-row-2">
                      <div className="checkout-field-wrap">
                        <label htmlFor="checkout-firstname" className="checkout-label">
                          First Name <span className="req">*</span>
                        </label>
                        <input
                          id="checkout-firstname"
                          type="text"
                          className={`checkout-input ${formErrors.firstName ? 'has-error' : ''}`}
                          placeholder="Elena"
                          value={formData.firstName}
                          onChange={(e) => {
                            setFormData({ ...formData, firstName: e.target.value });
                            if (formErrors.firstName) setFormErrors({ ...formErrors, firstName: '' });
                          }}
                        />
                        {formErrors.firstName && (
                          <span className="checkout-field-error">{formErrors.firstName}</span>
                        )}
                      </div>

                      <div className="checkout-field-wrap">
                        <label htmlFor="checkout-lastname" className="checkout-label">
                          Last Name <span className="req">*</span>
                        </label>
                        <input
                          id="checkout-lastname"
                          type="text"
                          className={`checkout-input ${formErrors.lastName ? 'has-error' : ''}`}
                          placeholder="Rostova"
                          value={formData.lastName}
                          onChange={(e) => {
                            setFormData({ ...formData, lastName: e.target.value });
                            if (formErrors.lastName) setFormErrors({ ...formErrors, lastName: '' });
                          }}
                        />
                        {formErrors.lastName && (
                          <span className="checkout-field-error">{formErrors.lastName}</span>
                        )}
                      </div>
                    </div>

                    <div className="checkout-field-wrap">
                      <label htmlFor="checkout-address" className="checkout-label">
                        Street Address <span className="req">*</span>
                      </label>
                      <input
                        id="checkout-address"
                        type="text"
                        className={`checkout-input ${formErrors.address ? 'has-error' : ''}`}
                        placeholder="742 Evergreen Terrace"
                        value={formData.address}
                        onChange={(e) => {
                          setFormData({ ...formData, address: e.target.value });
                          if (formErrors.address) setFormErrors({ ...formErrors, address: '' });
                        }}
                      />
                      {formErrors.address && (
                        <span className="checkout-field-error">{formErrors.address}</span>
                      )}
                    </div>

                    <div className="checkout-field-wrap">
                      <label htmlFor="checkout-apt" className="checkout-label">
                        Apartment, suite, unit (optional)
                      </label>
                      <input
                        id="checkout-apt"
                        type="text"
                        className="checkout-input"
                        placeholder="Suite 4B"
                        value={formData.apartment}
                        onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                      />
                    </div>

                    <div className="checkout-row-3">
                      <div className="checkout-field-wrap">
                        <label htmlFor="checkout-city" className="checkout-label">
                          City <span className="req">*</span>
                        </label>
                        <input
                          id="checkout-city"
                          type="text"
                          className={`checkout-input ${formErrors.city ? 'has-error' : ''}`}
                          placeholder="Beverly Hills"
                          value={formData.city}
                          onChange={(e) => {
                            setFormData({ ...formData, city: e.target.value });
                            if (formErrors.city) setFormErrors({ ...formErrors, city: '' });
                          }}
                        />
                        {formErrors.city && (
                          <span className="checkout-field-error">{formErrors.city}</span>
                        )}
                      </div>

                      <div className="checkout-field-wrap">
                        <label htmlFor="checkout-state" className="checkout-label">
                          State
                        </label>
                        <input
                          id="checkout-state"
                          type="text"
                          className="checkout-input"
                          placeholder="CA"
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        />
                      </div>

                      <div className="checkout-field-wrap">
                        <label htmlFor="checkout-zip" className="checkout-label">
                          ZIP Code <span className="req">*</span>
                        </label>
                        <input
                          id="checkout-zip"
                          type="text"
                          className={`checkout-input ${formErrors.zipCode ? 'has-error' : ''}`}
                          placeholder="90210"
                          value={formData.zipCode}
                          onChange={(e) => {
                            setFormData({ ...formData, zipCode: e.target.value });
                            if (formErrors.zipCode) setFormErrors({ ...formErrors, zipCode: '' });
                          }}
                        />
                        {formErrors.zipCode && (
                          <span className="checkout-field-error">{formErrors.zipCode}</span>
                        )}
                      </div>
                    </div>

                    <div className="checkout-field-wrap">
                      <label htmlFor="checkout-phone" className="checkout-label">
                        Phone (for courier delivery notifications)
                      </label>
                      <input
                        id="checkout-phone"
                        type="tel"
                        className="checkout-input"
                        placeholder="+1 (555) 234-5678"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </section>

                  {/* Step 3: Shipping Method */}
                  <section className="checkout-section">
                    <h2 className="checkout-section-title">3. Shipping Speed</h2>
                    <div className="shipping-options-group">
                      <label
                        className={`shipping-option-card ${
                          formData.shippingMethod === 'standard' ? 'is-selected' : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name="shippingMethod"
                          value="standard"
                          checked={formData.shippingMethod === 'standard'}
                          onChange={() => setFormData({ ...formData, shippingMethod: 'standard' })}
                        />
                        <div className="shipping-option-info">
                          <span className="shipping-option-name">
                            {isFreeShipping ? 'Complimentary White-Glove Shipping' : 'Standard Botanical Ground'}
                          </span>
                          <span className="shipping-option-desc">
                            2–4 business days • Temperature-controlled eco packaging
                          </span>
                        </div>
                        <span className="shipping-option-price">
                          {isFreeShipping ? 'FREE' : '$6.00'}
                        </span>
                      </label>

                      <label
                        className={`shipping-option-card ${
                          formData.shippingMethod === 'express' ? 'is-selected' : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name="shippingMethod"
                          value="express"
                          checked={formData.shippingMethod === 'express'}
                          onChange={() => setFormData({ ...formData, shippingMethod: 'express' })}
                        />
                        <div className="shipping-option-info">
                          <span className="shipping-option-name">Signature Priority Atelier Air</span>
                          <span className="shipping-option-desc">
                            1–2 business days • Priority formulation batching
                          </span>
                        </div>
                        <span className="shipping-option-price">$14.00</span>
                      </label>
                    </div>
                  </section>

                  {/* Step 4: Payment Method */}
                  <section className="checkout-section">
                    <div className="section-header-row">
                      <h2 className="checkout-section-title">4. Payment Authorization</h2>
                      <span className="security-tag">
                        <ShieldCheck size={13} color="#27672B" /> Encrypted & Simulated
                      </span>
                    </div>

                    <div className="payment-tabs-group">
                      <label
                        className={`payment-tab ${
                          formData.paymentMethod === 'card' ? 'is-active' : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={formData.paymentMethod === 'card'}
                          onChange={() => setFormData({ ...formData, paymentMethod: 'card' })}
                        />
                        <CreditCard size={15} />
                        <span>Credit / Debit Card</span>
                      </label>

                      <label
                        className={`payment-tab ${
                          formData.paymentMethod === 'klarna' ? 'is-active' : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="klarna"
                          checked={formData.paymentMethod === 'klarna'}
                          onChange={() => setFormData({ ...formData, paymentMethod: 'klarna' })}
                        />
                        <span className="klarna-badge">Klarna.</span>
                        <span>4 × ${(grandTotal / 4).toFixed(2)}</span>
                      </label>
                    </div>

                    {formData.paymentMethod === 'card' && (
                      <div className="card-fields-box">
                        <div className="checkout-field-wrap">
                          <label htmlFor="card-number" className="checkout-label">
                            Card Number <span className="req">*</span>
                          </label>
                          <input
                            id="card-number"
                            type="text"
                            className={`checkout-input ${formErrors.cardNumber ? 'has-error' : ''}`}
                            placeholder="4242 •••• •••• 4242"
                            value={formData.cardNumber}
                            onChange={(e) => {
                              setFormData({ ...formData, cardNumber: e.target.value });
                              if (formErrors.cardNumber) setFormErrors({ ...formErrors, cardNumber: '' });
                            }}
                          />
                          {formErrors.cardNumber && (
                            <span className="checkout-field-error">{formErrors.cardNumber}</span>
                          )}
                        </div>

                        <div className="checkout-row-2">
                          <div className="checkout-field-wrap">
                            <label htmlFor="card-expiry" className="checkout-label">
                              Expiration Date <span className="req">*</span>
                            </label>
                            <input
                              id="card-expiry"
                              type="text"
                              className={`checkout-input ${formErrors.cardExpiry ? 'has-error' : ''}`}
                              placeholder="MM / YY"
                              value={formData.cardExpiry}
                              onChange={(e) => {
                                setFormData({ ...formData, cardExpiry: e.target.value });
                                if (formErrors.cardExpiry) setFormErrors({ ...formErrors, cardExpiry: '' });
                              }}
                            />
                            {formErrors.cardExpiry && (
                              <span className="checkout-field-error">{formErrors.cardExpiry}</span>
                            )}
                          </div>

                          <div className="checkout-field-wrap">
                            <label htmlFor="card-cvc" className="checkout-label">
                              Security Code (CVC) <span className="req">*</span>
                            </label>
                            <input
                              id="card-cvc"
                              type="text"
                              className={`checkout-input ${formErrors.cardCvc ? 'has-error' : ''}`}
                              placeholder="CVC"
                              value={formData.cardCvc}
                              onChange={(e) => {
                                setFormData({ ...formData, cardCvc: e.target.value });
                                if (formErrors.cardCvc) setFormErrors({ ...formErrors, cardCvc: '' });
                              }}
                            />
                            {formErrors.cardCvc && (
                              <span className="checkout-field-error">{formErrors.cardCvc}</span>
                            )}
                          </div>
                        </div>

                        <div className="checkout-field-wrap">
                          <label htmlFor="card-name" className="checkout-label">
                            Name on Card
                          </label>
                          <input
                            id="card-name"
                            type="text"
                            className="checkout-input"
                            placeholder="Elena Rostova"
                            value={formData.cardName}
                            onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                          />
                        </div>
                      </div>
                    )}

                    {formData.paymentMethod === 'klarna' && (
                      <div className="klarna-info-box">
                        <p>
                          Pay in 4 interest-free installments of{' '}
                          <strong>${(grandTotal / 4).toFixed(2)}</strong>. Automatically deducted every 2 weeks.
                        </p>
                      </div>
                    )}
                  </section>

                  {/* Submit Button */}
                  <div className="checkout-submit-area">
                    <button
                      type="submit"
                      className="btn-place-order"
                      aria-label="Pay and craft order"
                    >
                      <span>Pay ${grandTotal.toFixed(2)} • Authorize & Craft Order</span>
                      <ChevronRight size={18} />
                    </button>

                    <p className="checkout-terms-note">
                      By completing your purchase, you authorize the simulated atelier fulfillment flow.
                      All transactions are processed through Élora's high-precision botanical robotics line.
                    </p>
                  </div>
                </form>
              </div>

              {/* Right Column: Order Summary */}
              <div className="checkout-summary-column">
                <div className="checkout-summary-sticky">
                  <div className="summary-card">
                    <h3 className="summary-title">Your Atelier Selection</h3>

                    {/* Items List */}
                    <div className="summary-items-list">
                      {items.map((item) => (
                        <div key={item.id} className="summary-item-row">
                          <div className="summary-item-thumb">
                            <img src={item.image} alt={item.name} />
                            <span className="summary-item-qty">{item.quantity}</span>
                          </div>
                          <div className="summary-item-info">
                            <p className="summary-item-name">{item.name}</p>
                            {(item.variantName || item.volume) && (
                              <p className="summary-item-meta">
                                {item.variantName} {item.variantName && item.volume ? '•' : ''} {item.volume}
                              </p>
                            )}
                          </div>
                          <span className="summary-item-price">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Discount Code Input */}
                    <form onSubmit={handleApplyDiscount} className="discount-form">
                      <div className="discount-input-row">
                        <input
                          type="text"
                          className="discount-input"
                          placeholder="Promotional code (e.g. GLAZE15)"
                          value={discountCode}
                          onChange={(e) => setDiscountCode(e.target.value)}
                        />
                        <button type="submit" className="discount-apply-btn">
                          Apply
                        </button>
                      </div>
                      {discountError && <span className="discount-error-text">{discountError}</span>}
                      {appliedDiscount && (
                        <div className="discount-applied-badge">
                          <span>{appliedDiscount.code} applied ({appliedDiscount.label})</span>
                          <button
                            type="button"
                            onClick={() => setAppliedDiscount(null)}
                            className="discount-remove-btn"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </form>

                    {/* Price Breakdown */}
                    <div className="summary-totals-table">
                      <div className="totals-row">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>

                      {appliedDiscount && (
                        <div className="totals-row discount-row">
                          <span>Special Discount</span>
                          <span>-${discountAmount.toFixed(2)}</span>
                        </div>
                      )}

                      <div className="totals-row">
                        <span>Estimated Shipping</span>
                        <span>
                          {shippingCost === 0 ? (
                            <strong style={{ color: '#27672B' }}>FREE</strong>
                          ) : (
                            `$${shippingCost.toFixed(2)}`
                          )}
                        </span>
                      </div>

                      <div className="totals-row">
                        <span>Estimated Taxes (8.25%)</span>
                        <span>${estimatedTax.toFixed(2)}</span>
                      </div>

                      <div className="totals-divider" />

                      <div className="totals-row grand-total-row">
                        <span>Total Due</span>
                        <div className="grand-total-val-wrap">
                          <small>USD</small>
                          <span className="grand-total-num">${grandTotal.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Complimentary Perks Callout */}
                    <div className="summary-perks-box">
                      <div className="perk-row">
                        <Sparkles size={14} color="#AC7E76" />
                        <span>Complimentary French Alpine Rose deluxe sample with order</span>
                      </div>
                      <div className="perk-row">
                        <ShieldCheck size={14} color="#AC7E76" />
                        <span>30-Day Glazed Skin Barrier Guarantee</span>
                      </div>
                      <div className="perk-row">
                        <Truck size={14} color="#AC7E76" />
                        <span>100% Carbon-neutral temperature-safe packaging</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
