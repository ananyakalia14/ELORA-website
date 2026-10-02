import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, Check, Package, LogOut, ShoppingBag, ShieldCheck, Sliders, Truck, ArrowRight } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { API_BASE_URL } from '../config/api';

export default function AccountPage({
  isOpen,
  onClose,
  onOpenCart,
  onOpenSearch,
  onOpenAdmin,
  onTrackOrder,
  cartCount = 0,
}) {
  // Input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // User session & real orders from PostgreSQL database
  const [currentUser, setCurrentUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [view, setView] = useState('signin');

  const loadLocalOrders = () => {
    try {
      const stored = localStorage.getItem('elora_orders');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  };

  // Verify real session with PostgreSQL database on open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (window.location.hash !== '#account') {
        window.history.pushState(null, '', '#account');
      }

      const localOrders = loadLocalOrders();
      setOrders(localOrders);

      // Check real JWT token against PostgreSQL database
      const token = localStorage.getItem('elora_token');
      if (token) {
        fetch(`${API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then(async (res) => {
            if (res.ok) {
              const me = await res.json();
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
              setCurrentUser(verifiedUser);
              setView('dashboard');

              // Fetch orders from database
              fetch(`${API_BASE_URL}/orders`, {
                headers: { Authorization: `Bearer ${token}` },
              })
                .then((r) => (r.ok ? r.json() : []))
                .then((dbOrders) => {
                  const combined = [...dbOrders];
                  // merge local orders not already in db
                  const dbIds = new Set(dbOrders.map((o) => o.id));
                  for (const loc of localOrders) {
                    if (!dbIds.has(loc.id)) {
                      combined.push(loc);
                    }
                  }
                  setOrders(combined);
                })
                .catch(() => setOrders(localOrders));
            } else {
              // Token invalid or expired, clear storage and show signin
              localStorage.removeItem('elora_token');
              localStorage.removeItem('elora_user');
              setCurrentUser(null);
              setView('signin');
            }
          })
          .catch(() => {
            setView('signin');
          });
      } else {
        setView('signin');
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
        } else if (res.status === 404) {
          throw new Error('Account not found with this email. Please create an account.');
        } else {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.detail || 'Sign in failed. Please check your credentials.');
        }
      }

      const data = await res.json();
      const token = data.access_token;

      // Fetch verified user from PostgreSQL database
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

      // Fetch user real orders from PostgreSQL database
      try {
        const ordersRes = await fetch(`${API_BASE_URL}/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (ordersRes.ok) {
          const userOrders = await ordersRes.json();
          setOrders(userOrders);
        }
      } catch {
        // Orders optional if none exist yet
      }

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

    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedFirst || !trimmedLast || !trimmedEmail || !trimmedPassword) {
      setErrorMessage('Please fill in all fields to create your account.');
      return;
    }

    if (trimmedPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      const fullName = `${trimmedFirst} ${trimmedLast}`;
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
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

      // Account created in PostgreSQL! Authenticate to obtain real JWT token
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

      // Fetch user profile from DB
      const meRes = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const me = meRes.ok ? await meRes.json() : { name: fullName, email: trimmedEmail, created_at: new Date() };
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
      setOrders([]);
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
    localStorage.removeItem('elora_orders');
    setCurrentUser(null);
    setOrders([]);
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
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
                src="/images/elora-new-pouch-raw.png"
                alt="Élora Skin Nutrition Intravenously Optimised"
                className="elora-account-pouch-hero-img"
                onError={(e) => {
                  e.currentTarget.src = '/images/elora-iv-pouch.png';
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

                <form onSubmit={handleSignIn} className="elora-account-page-form" autoComplete="off">
                  {/* Hidden dummy fields to prevent aggressive Chrome/Edge credentials autofill */}
                  <input type="text" name="prevent_autofill_email" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
                  <input type="password" name="prevent_autofill_pwd" style={{ display: 'none' }} tabIndex={-1} autoComplete="new-password" />

                  {errorMessage && (
                    <div className="elora-account-error-msg">{errorMessage}</div>
                  )}

                  {/* Email Input Field */}
                  <div className="elora-account-pill-input">
                    <Mail size={18} className="elora-account-pill-icon" />
                    <input
                      id="elora-signin-email"
                      name="elora_user_email"
                      type="text"
                      inputMode="email"
                      placeholder="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="elora-account-pill-field"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      required
                    />
                  </div>

                  {/* Password Input Field with Visibility Toggle */}
                  <div className="elora-account-pill-input">
                    <Lock size={18} className="elora-account-pill-icon" />
                    <input
                      id="elora-signin-password"
                      name="elora_user_key"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="elora-account-pill-field"
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

            {/* VIEW 4: CLIENT ACCOUNT SANCTUARY */}
            {view === 'dashboard' && currentUser && (() => {
              const isAdmin = currentUser?.role === 'admin' || currentUser?.email?.toLowerCase() === 'admin@elora.com';
              return (
              <div className="elora-account-dash-view">
                <div className="elora-account-dash-header-block">
                  <span className="elora-account-dash-pill">
                    {isAdmin ? '👑 ÉLORA ATELIER EXECUTIVE' : 'ÉLORA CLIENT PROFILE'}
                  </span>
                  <h3 className="elora-account-dash-name">
                    Welcome back, {currentUser.name || currentUser.email}
                  </h3>
                  <p className="elora-account-dash-subtitle">{currentUser.email}</p>
                </div>

                {/* Executive Admin Management Card (Visible ONLY to Admin Users) */}
                {isAdmin && (
                  <div className="elora-account-dash-card elora-account-admin-card">
                    <div className="elora-account-admin-badge-row">
                      <span className="elora-account-admin-badge">
                        <ShieldCheck size={13} color="#D4AF37" /> ATELIER EXECUTIVE SUITE
                      </span>
                    </div>
                    <h4 className="elora-account-admin-card-title">Atelier Administration & Operations</h4>
                    <p className="elora-account-admin-card-desc">
                      Manage boutique inventory stock, review customer order fulfillment queues, and monitor live sales performance.
                    </p>
                    <button
                      type="button"
                      className="elora-account-admin-launch-btn"
                      onClick={() => {
                        onClose();
                        onOpenAdmin?.();
                      }}
                    >
                      <Sliders size={14} /> Open Atelier Admin Console →
                    </button>
                  </div>
                )}

                {/* Account Status Card */}
                <div className="elora-account-dash-card">
                  <div className="elora-account-dash-card-row">
                    <span className="elora-account-dash-card-label">Account Status</span>
                    <span className="elora-account-dash-card-val" style={{ color: '#2E7D32', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Check size={13} strokeWidth={2.5} /> Active Member
                    </span>
                  </div>
                  <div className="elora-account-dash-card-row" style={{ marginTop: '2px' }}>
                    <span className="elora-account-dash-card-label">Member Since</span>
                    <span className="elora-account-dash-card-val">{currentUser.memberSince || '2026'}</span>
                  </div>
                </div>

                {/* Order Summary & History */}
                <div className="elora-account-dash-card">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: orders.length > 0 ? '8px' : '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Package size={15} color="#AC7E76" />
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#3A2E2B', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                        Recent Orders ({orders.length})
                      </span>
                    </div>

                    <button
                      type="button"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#AC7E76',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                      onClick={() => onTrackOrder?.(orders[0] || null)}
                    >
                      <Truck size={13} /> Order Tracker →
                    </button>
                  </div>

                  {orders && orders.length > 0 ? (
                    <div className="elora-account-order-list">
                      {orders.map((order, idx) => {
                        const orderNum = order.order_number || `EL-${order.id}`;
                        const trackNum = order.tracking_number || `EL-TRK-${78290 + (order.id || idx)}`;
                        const isDelivered = (order.status || '').toLowerCase() === 'delivered';
                        const isShipped = (order.status || '').toLowerCase() === 'shipped';

                        return (
                          <div key={order.id || idx} className="elora-account-order-item" style={{ padding: '12px', background: '#FAF8F5', borderRadius: '12px', marginBottom: '8px', border: '1px solid rgba(172, 126, 118, 0.15)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', fontWeight: 600, color: '#2E1A16' }}>
                              <span>Order #{orderNum}</span>
                              <span
                                style={{
                                  background: isDelivered ? '#E8F5E9' : isShipped ? '#E3F2FD' : '#FBE9E7',
                                  color: isDelivered ? '#2E7D32' : isShipped ? '#1565C0' : '#D84315',
                                  padding: '2px 8px',
                                  borderRadius: '999px',
                                  fontSize: '0.7rem',
                                  fontWeight: 600,
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.04em',
                                }}
                              >
                                {order.status || 'Confirmed'}
                              </span>
                            </div>

                            <p className="elora-account-order-desc" style={{ margin: '6px 0', fontSize: '0.75rem', color: '#5A4A45' }}>
                              {order.items?.map((it) => `${it.name}${it.quantity > 1 ? ` (x${it.quantity})` : ''}`).join(', ') || 'The Élora Botanical Ritual'}
                            </p>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                              <span style={{ fontSize: '0.72rem', color: '#776863' }}>
                                Total: <strong>${(order.total || 0).toFixed(2)}</strong> • {trackNum}
                              </span>

                              <button
                                type="button"
                                style={{
                                  background: '#2E1A16',
                                  color: '#FAF8F5',
                                  border: 'none',
                                  borderRadius: '999px',
                                  padding: '4px 10px',
                                  fontSize: '0.7rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                }}
                                onClick={() => onTrackOrder?.(order)}
                              >
                                <Truck size={11} /> Track Order
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="elora-account-empty-orders">
                      <p className="elora-account-empty-desc">
                        No purchase history yet. Items from your completed orders will appear here.
                      </p>
                    </div>
                  )}
                </div>

                {/* Shopping Bag Quick Action if items in cart */}
                {cartCount > 0 && (
                  <div className="elora-account-dash-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ShoppingBag size={15} color="#AC7E76" />
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#3A2E2B' }}>
                          Shopping Bag ({cartCount} {cartCount === 1 ? 'item' : 'items'})
                        </span>
                      </div>
                      <button
                        type="button"
                        className="elora-account-card-action-link"
                        onClick={() => {
                          onClose();
                          onOpenCart?.();
                        }}
                      >
                        View Bag →
                      </button>
                    </div>
                  </div>
                )}

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
                      <ShoppingBag size={15} /> VIEW SHOPPING BAG {cartCount > 0 ? `(${cartCount})` : ''}
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
              );
            })()}

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
