import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, User, X, Check, Sparkles, Package, LogOut, ShoppingBag } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

/**
 * Full-Screen Standalone Account Page for Élora Skin & Beauty
 * 
 * Design Architecture:
 * - Top: 100% Transparent luxury navigation header (SHOP, ABOUT, JOURNAL, centered Élora logo, SEARCH, ACCOUNT, BAG)
 * - Hero Wrap: Full-screen 2K sunlit plaster wall with diagonal palm shadows and hanging IV infusion pouch art
 * - Left Column: Spacer on desktop (pouch rendered directly in background), responsive pouch image on mobile
 * - Right Column: Form elements floating directly against the sunlit wall with NO container card box:
 *                 - Serif É L O R A logotype + SKIN & BEAUTY subtitle
 *                 - Frosted translucent pill inputs with Mail and Lock icons
 *                 - Terracotta rose #AA776A pill SIGN IN button
 *                 - Direct sublinks for password recovery and account creation
 * - Bottom: Full Élora luxury footer revealed smoothly on scroll down.
 */
export default function AccountPage({
  isOpen,
  onClose,
  onOpenCart,
  onOpenSearch,
  cartCount = 0,
}) {
  // Views: 'signin' | 'signup' | 'forgot' | 'dashboard'
  const [view, setView] = useState('signin');

  // Input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // User session
  const [currentUser, setCurrentUser] = useState(null);

  // Manage hash route and body scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (window.location.hash !== '#account') {
        window.history.pushState(null, '', '#account');
      }

      const handlePopState = () => {
        onClose();
      };

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      window.addEventListener('popstate', handlePopState);
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        window.removeEventListener('popstate', handlePopState);
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
      if (window.location.hash === '#account') {
        window.history.replaceState(null, '', ' ');
      }
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Handle header navigation back to boutique sections
  const handleNav = (href) => {
    onClose();
    if (href && href.startsWith('#') && href !== '#') {
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 120);
    } else if (href === '#') {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  // Handle Sign In submit
  const handleSignIn = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both your email and password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const displayName = email.split('@')[0].replace(/[._]/g, ' ');
      const formattedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
      setCurrentUser({
        name: formattedName || 'Élise Dupont',
        email: email,
        tier: 'Élora Étoile Privé (Tier II)',
        points: 480,
      });
      setView('dashboard');
    }, 700);
  };

  // Handle Sign Up (Register) submit
  const handleSignUp = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
      setErrorMessage('Please fill in all fields to create your account.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const fullName = `${firstName.trim()} ${lastName.trim()}`;
      setCurrentUser({
        name: fullName,
        email: email,
        tier: 'Élora Étoile Privé (Tier I)',
        points: 100,
      });
      setView('dashboard');
    }, 800);
  };

  // Handle Forgot Password submit
  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please enter your account email address.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setForgotSent(true);
    }, 600);
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setEmail('');
    setPassword('');
    setView('signin');
  };

  return (
    <div
      className="elora-account-page-root"
      role="main"
      aria-label="Élora Skin & Beauty Account Page"
    >
      {/* Hero Section Container (Transparent Nav Header + 2K Sunlit Wall & IV Pouch + Floating Form) */}
      <div className="elora-account-hero-wrap">
        {/* 1. Transparent Navigation Header Bar */}
        <div className="elora-account-header-wrapper">
          <Header
            cartCount={cartCount}
            onOpenCart={() => {
              onClose();
              if (onOpenCart) onOpenCart();
            }}
            onOpenSearch={() => {
              onClose();
              if (onOpenSearch) onOpenSearch();
            }}
            onOpenAccount={() => {
              const root = document.querySelector('.elora-account-page-root');
              if (root) {
                root.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            introFinished={true}
            onNavigate={handleNav}
          />
        </div>

        {/* 2. Main Full-Screen Layout */}
        <div className="elora-account-page-body">
          {/* Left Side: Intravenous Infusion Pouch Art */}
          <div className="elora-account-hero-col">
            <div className="elora-account-pouch-frame">
              <img
                src="/images/elora-iv-pouch.png"
                alt="Élora Skin Nutrition Intravenously Optimised"
                className="elora-account-pouch-hero-img"
                onError={(e) => {
                  e.currentTarget.src = '/images/elora-account-user-bg.png';
                }}
              />
            </div>
          </div>

          {/* Right Side: Floating Sanctuary Portal */}
          <div className="elora-account-form-col">
            <div className="elora-account-portal-card">
            
            {/* VIEW 1: SIGN IN */}
            {view === 'signin' && (
              <div className="elora-account-form-inner">
                {/* Brand Logo & Subtitle */}
                <div className="elora-account-page-logo-block">
                  <h1 className="elora-account-page-title">ÉLORA</h1>
                  <p className="elora-account-page-subtitle">SKIN &amp; BEAUTY</p>
                </div>

                <form onSubmit={handleSignIn} className="elora-account-page-form">
                  {errorMessage && (
                    <div className="elora-account-error-msg">{errorMessage}</div>
                  )}

                  {/* Email Input Field */}
                  <div className="elora-account-pill-input">
                    <Mail size={18} className="elora-account-pill-icon" />
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="elora-account-pill-field"
                      autoComplete="email"
                      required
                    />
                  </div>

                  {/* Password Input Field with Visibility Toggle */}
                  <div className="elora-account-pill-input">
                    <Lock size={18} className="elora-account-pill-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="elora-account-pill-field"
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      className="elora-account-eye-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {/* Terracotta Rose "SIGN IN" Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="elora-account-page-submit-btn"
                  >
                    {isLoading ? (
                      <span className="elora-account-btn-loading">
                        <span className="elora-account-spinner" /> SIGNING IN...
                      </span>
                    ) : (
                      'SIGN IN'
                    )}
                  </button>

                  {/* Sub-links */}
                  <div className="elora-account-page-links">
                    <button
                      type="button"
                      className="elora-account-forgot-link"
                      onClick={() => {
                        setErrorMessage('');
                        setForgotSent(false);
                        setView('forgot');
                      }}
                    >
                      Forgot your password?
                    </button>

                    <p className="elora-account-signup-text">
                      Don’t have an account?{' '}
                      <button
                        type="button"
                        className="elora-account-signup-trigger"
                        onClick={() => {
                          setErrorMessage('');
                          setView('signup');
                        }}
                      >
                        Sign up!
                      </button>
                    </p>
                  </div>
                </form>
              </div>
            )}

            {/* VIEW 2: CREATE ACCOUNT (Sign Up) */}
            {view === 'signup' && (
              <div className="elora-create-account-container">
                <div className="elora-create-account-header">
                  <h2 className="elora-create-account-heading">Create Account</h2>
                  <p className="elora-create-account-subheading">
                    Join Élora Privé for member allocations &amp; complimentary shipping.
                  </p>
                </div>

                <form onSubmit={handleSignUp} className="elora-create-account-form">
                  {errorMessage && (
                    <div className="elora-account-error-msg">{errorMessage}</div>
                  )}

                  {/* 1. First Name */}
                  <div className="elora-create-account-input-box">
                    <input
                      type="text"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="elora-create-account-input"
                      autoComplete="given-name"
                      required
                    />
                  </div>

                  {/* 2. Last Name */}
                  <div className="elora-create-account-input-box">
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="elora-create-account-input"
                      autoComplete="family-name"
                      required
                    />
                  </div>

                  {/* 3. Email */}
                  <div className="elora-create-account-input-box">
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="elora-create-account-input"
                      autoComplete="email"
                      required
                    />
                  </div>

                  {/* 4. Password */}
                  <div className="elora-create-account-input-box relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="elora-create-account-input"
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      className="elora-account-eye-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {/* REGISTER Pill Button */}
                  <div className="elora-register-btn-wrap">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="elora-register-pill-btn"
                    >
                      {isLoading ? (
                        <span className="elora-account-btn-loading">
                          <span className="elora-account-spinner" style={{ borderTopColor: '#3A2E2B' }} /> REGISTERING...
                        </span>
                      ) : (
                        'REGISTER'
                      )}
                    </button>
                  </div>

                  {/* Footer Link: Already have an account? Sign in! */}
                  <div className="elora-create-account-footer">
                    <p className="elora-create-account-footer-text">
                      Already have an account?{' '}
                      <button
                        type="button"
                        className="elora-create-account-signin-link"
                        onClick={() => {
                          setErrorMessage('');
                          setView('signin');
                        }}
                      >
                        Sign in!
                      </button>
                    </p>
                  </div>
                </form>
              </div>
            )}

            {/* VIEW 3: FORGOT PASSWORD */}
            {view === 'forgot' && (
              <div className="elora-account-page-form">
                <div className="elora-account-view-header">
                  <span className="elora-account-view-title">RESET PASSWORD</span>
                  <p className="elora-account-view-desc">
                    Enter your email address to receive an instant recovery link.
                  </p>
                </div>

                {forgotSent ? (
                  <div className="elora-account-success-box">
                    <div className="elora-account-success-icon">
                      <Check size={22} color="#27672B" />
                    </div>
                    <h4>Recovery Link Dispatched</h4>
                    <p>
                      We have sent instructions to <strong>{email}</strong>. Please check your inbox.
                    </p>
                    <button
                      type="button"
                      className="elora-account-page-submit-btn"
                      style={{ marginTop: '1.25rem' }}
                      onClick={() => {
                        setForgotSent(false);
                        setView('signin');
                      }}
                    >
                      BACK TO SIGN IN
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotPassword}>
                    {errorMessage && (
                      <div className="elora-account-error-msg">{errorMessage}</div>
                    )}

                    <div className="elora-account-pill-input" style={{ marginBottom: '1.25rem' }}>
                      <Mail size={18} className="elora-account-pill-icon" />
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="elora-account-pill-field"
                        autoComplete="email"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="elora-account-page-submit-btn"
                    >
                      {isLoading ? 'DISPATCHING...' : 'SEND RESET LINK'}
                    </button>

                    <div className="elora-account-page-links">
                      <button
                        type="button"
                        className="elora-account-forgot-link"
                        onClick={() => {
                          setErrorMessage('');
                          setView('signin');
                        }}
                      >
                        ← Back to sign in
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* VIEW 4: VIP MEMBER DASHBOARD */}
            {view === 'dashboard' && currentUser && (
              <div className="elora-account-dash-view">
                <div className="elora-account-dash-header-block">
                  <span className="elora-account-dash-pill">ÉLORA ÉTOILE CLUB</span>
                  <h3 className="elora-account-dash-name">
                    Welcome back, {currentUser.name}
                  </h3>
                  <p className="elora-account-dash-subtitle">{currentUser.tier}</p>
                </div>

                {/* Loyalty Tier Box */}
                <div className="elora-account-dash-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={16} color="#AC7E76" />
                    <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#3A2E2B' }}>
                      {currentUser.points} Radiant Reward Points
                    </span>
                  </div>
                  <span className="elora-account-dash-card-note">
                    Tier status unlocks complimentary shipping on all botanical rituals.
                  </span>
                </div>

                {/* Order Summary */}
                <div className="elora-account-dash-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <Package size={16} color="#5A4A45" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#3A2E2B' }}>
                      Recent Order #EL-8942 • Delivered
                    </span>
                  </div>
                  <p className="elora-account-dash-card-desc">
                    Glazing Milk Essence (Ceramide Veil) + The Hero Serum (Original)
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="elora-account-dash-btn-group">
                  <button
                    type="button"
                    className="elora-account-page-submit-btn"
                    onClick={onClose}
                  >
                    CONTINUE SHOPPING
                  </button>

                  {onOpenCart && (
                    <button
                      type="button"
                      className="elora-account-dash-secondary-btn"
                      onClick={() => {
                        onClose();
                        onOpenCart();
                      }}
                    >
                      <ShoppingBag size={15} /> VIEW SHOPPING BAG
                    </button>
                  )}

                  <button
                    type="button"
                    className="elora-account-dash-logout-btn"
                    onClick={handleSignOut}
                  >
                    <LogOut size={14} /> Sign out of account
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
      </div>

      {/* 3. Luxury Élora Site Footer with smooth gradient fade */}
      <div className="elora-account-footer-wrap">
        <Footer onNavigate={handleNav} variant="account" />
      </div>
    </div>
  );
}
