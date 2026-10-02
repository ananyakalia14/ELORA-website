import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, User, X, Check, ArrowRight, Sparkles, Package, LogOut, Truck } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

export default function AccountModal({ isOpen, onClose, onOpenCart, onTrackOrder }) {
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

  // User session state & orders
  const [currentUser, setCurrentUser] = useState(null);
  const [orders, setOrders] = useState([]);

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

  // Handle Sign In submit — Authenticates strictly against PostgreSQL database
  const handleSignIn = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setErrorMessage('Please enter both your email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append('username', trimmedEmail);
      formData.append('password', trimmedPassword);

      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Invalid email or password. Please verify your credentials or register for an account.');
        } else {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.detail || 'Sign in failed.');
        }
      }

      const data = await res.json();
      const token = data.access_token;

      const meRes = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!meRes.ok) {
        throw new Error('Failed to retrieve user profile from database.');
      }

      const me = await meRes.json();
      const verifiedUser = {
        id: me.id,
        name: me.name,
        email: me.email,
        role: me.role,
        memberSince: me.created_at
          ? new Date(me.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
          : '2026',
        token: token,
      };

      const loadOrders = async (authToken) => {
        let localOrders = [];
        try {
          localOrders = JSON.parse(localStorage.getItem('elora_orders') || '[]');
        } catch {}

        try {
          const ordersRes = await fetch(`${API_BASE_URL}/orders`, {
            headers: { Authorization: `Bearer ${authToken}` },
          });
          if (ordersRes.ok) {
            const dbOrders = await ordersRes.json();
            const combined = [...dbOrders];
            const dbIds = new Set(dbOrders.map((o) => o.id));
            for (const loc of localOrders) {
              if (!dbIds.has(loc.id)) combined.push(loc);
            }
            setOrders(combined);
          } else {
            setOrders(localOrders);
          }
        } catch {
          setOrders(localOrders);
        }
      };

      loadOrders(token);

      localStorage.setItem('elora_token', token);
      localStorage.setItem('elora_user', JSON.stringify(verifiedUser));
      setCurrentUser(verifiedUser);
      setView('dashboard');
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setErrorMessage('Cannot connect to authentication database server. Please ensure the backend is running.');
      } else {
        setErrorMessage(err.message || 'Invalid credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Sign Up submit — Creates user in PostgreSQL database
  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPassword) {
      setErrorMessage('Please fill in all fields to create your account.');
      return;
    }

    if (trimmedPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          password: trimmedPassword,
        }),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.detail || 'This email is already registered in the database. Please sign in instead.');
        } else {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.detail || 'Could not register account in database.');
        }
      }

      // Authenticate to obtain real JWT token
      const formData = new URLSearchParams();
      formData.append('username', trimmedEmail);
      formData.append('password', trimmedPassword);

      const loginRes = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
      });

      if (!loginRes.ok) {
        throw new Error('Account created, but sign-in failed. Please sign in manually.');
      }

      const loginData = await loginRes.json();
      const token = loginData.access_token;

      const meRes = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const me = meRes.ok ? await meRes.json() : { name: trimmedName, email: trimmedEmail, created_at: new Date() };
      const verifiedUser = {
        id: me.id,
        name: me.name,
        email: me.email,
        role: me.role,
        memberSince: me.created_at
          ? new Date(me.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
          : '2026',
        token: token,
      };

      localStorage.setItem('elora_token', token);
      localStorage.setItem('elora_user', JSON.stringify(verifiedUser));
      setCurrentUser(verifiedUser);
      setView('dashboard');
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setErrorMessage('Cannot connect to authentication database server. Please ensure the backend is running.');
      } else {
        setErrorMessage(err.message || 'Could not create account.');
      }
    } finally {
      setIsLoading(false);
    }
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
    localStorage.removeItem('elora_token');
    localStorage.removeItem('elora_user');
    setCurrentUser(null);
    setEmail('');
    setPassword('');
    setName('');
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
                <span className="elora-account-dash-badge">CLIENT SANCTUARY</span>
                <h3 className="elora-account-dash-welcome">
                  Welcome back, {currentUser.name || currentUser.email}
                </h3>
                <p className="elora-account-dash-tier">{currentUser.email}</p>
              </div>

              {/* Account Status Pill */}
              <div className="elora-account-reward-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.78rem', color: '#5A4A45' }}>Account Status</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#2E7D32' }}>Active Member</span>
                </div>
              </div>

              {/* Order Status */}
              <div className="elora-account-order-preview">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Package size={15} color="#AC7E76" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#3A2E2B' }}>
                      Order History ({orders.length})
                    </span>
                  </div>
                  <button
                    type="button"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#AC7E76',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                    onClick={() => {
                      onClose();
                      onTrackOrder?.(orders[0] || null);
                    }}
                  >
                    <Truck size={12} /> Track Order →
                  </button>
                </div>

                {orders && orders.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                    {orders.map((order, idx) => {
                      const orderNum = order.order_number || `EL-${order.id}`;
                      const trackNum = order.tracking_number || `EL-TRK-${78290 + (order.id || idx)}`;
                      return (
                        <div
                          key={order.id || idx}
                          style={{
                            background: '#FAF8F5',
                            padding: '10px 12px',
                            borderRadius: '10px',
                            border: '1px solid rgba(172, 126, 118, 0.15)',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', fontWeight: 600, color: '#2E1A16' }}>
                            <span>Order #{orderNum}</span>
                            <span style={{ color: '#AC7E76', textTransform: 'uppercase', fontSize: '0.68rem' }}>
                              {order.status || 'Confirmed'}
                            </span>
                          </div>
                          <p style={{ margin: '4px 0', fontSize: '0.72rem', color: '#5A4A45' }}>
                            {order.items?.map((it) => `${it.name}${it.quantity > 1 ? ` (x${it.quantity})` : ''}`).join(', ') || 'The Élora Botanical Ritual'}
                          </p>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.7rem', color: '#776863' }}>
                              Total: ${(order.total || 0).toFixed(2)}
                            </span>
                            <button
                              type="button"
                              style={{
                                background: '#2E1A16',
                                color: '#FAF8F5',
                                border: 'none',
                                borderRadius: '999px',
                                padding: '3px 8px',
                                fontSize: '0.68rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}
                              onClick={() => {
                                onClose();
                                onTrackOrder?.(order);
                              }}
                            >
                              Track →
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="elora-account-order-desc">
                    No previous orders placed. Your completed orders will appear here.
                  </p>
                )}
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
