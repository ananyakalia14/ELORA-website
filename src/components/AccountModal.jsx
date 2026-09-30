import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, User, X, Check, ArrowRight, Sparkles, Package, LogOut } from 'lucide-react';

/**
 * AccountModal Component for Élora Skin & Beauty
 * Replicates the exact visual design and typography of the Élora Account Portal mockup:
 * - Left side: Intravenous IV infusion drip pouch with Élora skincare products dripping rose elixir.
 * - Background: Warm sandy plaster wall with soft botanical palm shadows.
 * - Right side:
 *   - "ÉLORA SKIN & BEAUTY" serif typography
 *   - Frosted pill inputs for Email (with Mail icon) and Password (with Lock icon & show/hide toggle)
 *   - Dusty rose terracotta pill "SIGN IN" button with active states
 *   - "Forgot your password?" recovery flow
 *   - "Don't have an account? Sign up!" registration flow
 *   - Interactive Signed-In VIP Member Dashboard with rewards & order history
 */
export default function AccountModal({ isOpen, onClose, onOpenCart }) {
  // View states: 'signin' | 'signup' | 'forgot' | 'dashboard'
  const [view, setView] = useState('signin');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // User session state
  const [currentUser, setCurrentUser] = useState(null);

  // Close on ESC key & prevent body scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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

  // Handle Sign Up submit
  const handleSignUp = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMessage('Please fill in all fields to create your account.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCurrentUser({
        name: name,
        email: email,
        tier: 'Élora Étoile Privé (Tier I)',
        points: 100, // Welcome gift points
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
      className="elora-account-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Élora Account Portal"
    >
      {/* Main Card Container reproducing the 16:9 ratio and lighting */}
      <div
        className="elora-account-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          className="elora-account-close-btn"
          onClick={onClose}
          aria-label="Close Account dialog"
        >
          <X size={18} />
        </button>

        {/* Left Side: Intravenous Skincare Infusion Pouch */}
        <div className="elora-account-visual-pane">
          <img
            src="/images/elora-account-pouch.png"
            alt="Élora Skin Nutrition Intravenously Optimised"
            className="elora-account-pouch-img"
          />
        </div>

        {/* Right Side: Interactive Portal Form */}
        <div className="elora-account-form-pane">
          {/* Logo Header */}
          <div className="elora-account-logo-block">
            <h1 className="elora-account-brand-title">É L O R A</h1>
            <p className="elora-account-brand-subtitle">SKIN &amp; BEAUTY</p>
          </div>

          {/* VIEW 1: SIGN IN (Matches mockup exact layout) */}
          {view === 'signin' && (
            <form onSubmit={handleSignIn} className="elora-account-form">
              {errorMessage && (
                <div className="elora-account-error-msg">{errorMessage}</div>
              )}

              {/* Email Input Field */}
              <div className="elora-account-input-pill">
                <Mail size={17} className="elora-account-input-icon" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="elora-account-input-field"
                  autoComplete="email"
                  required
                />
              </div>

              {/* Password Input Field */}
              <div className="elora-account-input-pill">
                <Lock size={17} className="elora-account-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="elora-account-input-field"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="elora-account-eye-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Terracotta Dusty Rose SIGN IN Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="elora-account-submit-btn"
              >
                {isLoading ? (
                  <span className="elora-account-btn-loading">
                    <span className="elora-account-spinner" /> SIGNING IN...
                  </span>
                ) : (
                  'SIGN IN'
                )}
              </button>

              {/* Footer Links */}
              <div className="elora-account-links-group">
                <button
                  type="button"
                  className="elora-account-text-link"
                  onClick={() => {
                    setErrorMessage('');
                    setForgotSent(false);
                    setView('forgot');
                  }}
                >
                  Forgot your password?
                </button>

                <p className="elora-account-signup-prompt">
                  Don’t have an account?{' '}
                  <button
                    type="button"
                    className="elora-account-signup-link"
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
          )}

          {/* VIEW 2: SIGN UP (Join Élora Privé) */}
          {view === 'signup' && (
            <form onSubmit={handleSignUp} className="elora-account-form">
              <div className="elora-account-subheading">
                <span>CREATE YOUR ACCOUNT</span>
                <p>Unlock 15% off your first ritual and member-only privileges.</p>
              </div>

              {errorMessage && (
                <div className="elora-account-error-msg">{errorMessage}</div>
              )}

              {/* Name Input */}
              <div className="elora-account-input-pill">
                <User size={17} className="elora-account-input-icon" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="elora-account-input-field"
                  autoComplete="name"
                  required
                />
              </div>

              {/* Email Input */}
              <div className="elora-account-input-pill">
                <Mail size={17} className="elora-account-input-icon" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="elora-account-input-field"
                  autoComplete="email"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="elora-account-input-pill">
                <Lock size={17} className="elora-account-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="elora-account-input-field"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="elora-account-eye-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="elora-account-submit-btn"
              >
                {isLoading ? (
                  <span className="elora-account-btn-loading">
                    <span className="elora-account-spinner" /> CREATING ACCOUNT...
                  </span>
                ) : (
                  'CREATE ACCOUNT'
                )}
              </button>

              <div className="elora-account-links-group">
                <p className="elora-account-signup-prompt">
                  Already have an account?{' '}
                  <button
                    type="button"
                    className="elora-account-signup-link"
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
          )}

          {/* VIEW 3: FORGOT PASSWORD */}
          {view === 'forgot' && (
            <div className="elora-account-form">
              <div className="elora-account-subheading">
                <span>PASSWORD RECOVERY</span>
                <p>Enter your email address to receive a secure password reset link.</p>
              </div>

              {forgotSent ? (
                <div className="elora-account-success-box">
                  <div className="elora-account-success-icon">
                    <Check size={20} color="#27672B" />
                  </div>
                  <h4>Recovery Link Sent</h4>
                  <p>Check your inbox at <strong>{email}</strong> for instructions to access your account.</p>
                  <button
                    type="button"
                    className="elora-account-submit-btn"
                    style={{ marginTop: '1rem' }}
                    onClick={() => {
                      setForgotSent(false);
                      setView('signin');
                    }}
                  >
                    RETURN TO SIGN IN
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword}>
                  {errorMessage && (
                    <div className="elora-account-error-msg">{errorMessage}</div>
                  )}

                  <div className="elora-account-input-pill" style={{ marginBottom: '1.25rem' }}>
                    <Mail size={17} className="elora-account-input-icon" />
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="elora-account-input-field"
                      autoComplete="email"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="elora-account-submit-btn"
                  >
                    {isLoading ? 'SENDING LINK...' : 'SEND RESET LINK'}
                  </button>

                  <div className="elora-account-links-group">
                    <button
                      type="button"
                      className="elora-account-text-link"
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

          {/* VIEW 4: SIGNED-IN MEMBER DASHBOARD */}
          {view === 'dashboard' && currentUser && (
            <div className="elora-account-dashboard">
              <div className="elora-account-dash-header">
                <span className="elora-account-dash-badge">ÉLORARÉSERVE PRIVÉ</span>
                <h3 className="elora-account-dash-welcome">
                  Welcome back, {currentUser.name}
                </h3>
                <p className="elora-account-dash-tier">{currentUser.tier}</p>
              </div>

              {/* Loyalty Reward Pill */}
              <div className="elora-account-reward-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={16} color="#A87C74" />
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#3A2E2B' }}>
                    {currentUser.points} Radiant Reward Points
                  </span>
                </div>
                <span className="elora-account-reward-sub">
                  Complimentary luxury mini elixir ready to redeem
                </span>
              </div>

              {/* Recent Order Preview */}
              <div className="elora-account-order-preview">
                <div className="elora-account-order-title-row">
                  <Package size={15} color="#5A4A45" />
                  <span>Order #EL-8942 • Delivered</span>
                </div>
                <p className="elora-account-order-desc">
                  Glazing Milk Essence, The Hero Serum (Dewy Glass)
                </p>
              </div>

              {/* Action Buttons */}
              <div className="elora-account-dash-actions">
                <button
                  type="button"
                  className="elora-account-submit-btn"
                  onClick={onClose}
                >
                  CONTINUE SHOPPING
                </button>

                {onOpenCart && (
                  <button
                    type="button"
                    className="elora-account-secondary-btn"
                    onClick={() => {
                      onClose();
                      onOpenCart();
                    }}
                  >
                    VIEW SHOPPING BAG
                  </button>
                )}

                <button
                  type="button"
                  className="elora-account-signout-btn"
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
  );
}
