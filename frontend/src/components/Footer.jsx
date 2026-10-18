import React, { useState } from 'react';
import { Check } from 'lucide-react';

/**
 * Luxury E-Commerce Footer Component for Élora Skin & Beauty
 * Statuesque editorial serif ALL CAPS "ÉLORA" logotype hero banner
 * Rhode-inspired architectural grid with 35% / 65% split
 */
export default function Footer({ onNavigate, variant }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLinkClick = (e, href) => {
    if (onNavigate && href && href.startsWith('#')) {
      e.preventDefault();
      onNavigate(href);
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address');
      return;
    }
    setErrorMsg('');
    setSubscribed(true);
  };

  const isAccount = variant === 'account';

  return (
    <footer
      className={`elora-footer ${isAccount ? 'elora-footer-account' : 'bg-[#F9F6F0]'} text-[#3A2E2B] w-full overflow-hidden pb-20 md:pb-0`}
      role="contentinfo"
      aria-label="Site Footer"
    >
      {/* 1. TOP LOGO BANNER (GIANT FULL-BLEED ALL CAPS "ÉLORA" - BORDERLESS) */}
      <div className={`elora-footer-brand-banner w-full overflow-hidden ${isAccount ? 'elora-footer-banner-account' : 'bg-[#F9F6F0]'} pt-8 md:pt-14 pb-2 md:pb-4 flex items-center justify-center select-none`}>
        <h2
          className="elora-giant-wordmark w-full text-center font-serif uppercase text-[#3A2E2B] font-normal tracking-[-0.04em] leading-[0.78] whitespace-nowrap pointer-events-none"
          style={{
            fontSize: 'clamp(54px, 22vw, 360px)',
            fontFamily: "var(--font-serif-display, 'Italiana', 'Cormorant Garamond', 'Didot', Georgia, serif)",
            fontWeight: 400,
            textTransform: 'uppercase',
            letterSpacing: '-0.04em',
            lineHeight: 0.78,
            color: '#3A2E2B',
            display: 'block',
            width: '100%',
            margin: 0,
          }}
        >
          ÉLORA
        </h2>
      </div>

      {/* MAIN CONTENT: 35% Left Newsletter / 65% Right 4-Column Directory */}
      <div className="elora-footer-main max-w-[1440px] mx-auto flex flex-col md:flex-row">

        {/* 3. NEWSLETTER COLUMN (LEFT ~35%) */}
        <section
          className="elora-footer-newsletter w-full md:w-[36%] lg:w-[35%] p-6 sm:p-8 md:p-10 lg:p-14 md:border-r border-b md:border-b-0 border-[#3A2E2B]/15 flex flex-col justify-between"
          aria-labelledby="newsletter-heading"
        >
          <div>
            <h3
              id="newsletter-heading"
              className="elora-newsletter-headline font-sans text-base sm:text-lg text-[#3A2E2B] tracking-[0.08em] uppercase leading-snug mb-3 font-semibold"
            >
              JOIN THE ÉLORA INNER CIRCLE.
            </h3>

            <p className="elora-newsletter-subtext text-xs sm:text-sm text-[#3A2E2B]/75 leading-relaxed font-light mb-6">
              RECEIVE PRIVATE PREVIEWS, BOTANICAL FORMULATIONS, AND RITUAL GUIDANCE DIRECTLY TO YOUR INBOX.
            </p>

            {subscribed ? (
              <div className="elora-newsletter-success bg-[#FFFDF9] border border-[#3A2E2B]/20 p-4 rounded-sm flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#3A2E2B] text-[#FFFDF9] flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={12} strokeWidth={3} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#3A2E2B] mb-0.5">
                    Welcome to the Inner Circle
                  </p>
                  <p className="text-xs text-[#3A2E2B]/75 font-light">
                    Your exclusive ritual guide and private allocation link have been dispatched.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="elora-newsletter-form">
                <div className="elora-newsletter-input-wrap flex flex-col sm:flex-row items-stretch">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-label="Email address for Élora newsletter"
                    className="elora-newsletter-input flex-1 bg-white border border-[#3A2E2B]/20 sm:border-r-0 px-4 py-3.5 text-xs sm:text-sm text-[#3A2E2B] placeholder-[#3A2E2B]/45 rounded-sm sm:rounded-r-none focus:outline-none focus:border-[#3A2E2B] transition-colors"
                  />
                  <button
                    type="submit"
                    className="elora-newsletter-btn mt-2 sm:mt-0 bg-transparent hover:bg-[#3A2E2B] hover:text-[#FFFDF9] active:bg-[#241C1A] text-[#3A2E2B] border border-[#3A2E2B]/20 px-6 py-3.5 text-xs font-semibold tracking-[0.16em] uppercase rounded-sm sm:rounded-l-none transition-all duration-300 flex items-center justify-center shrink-0 cursor-pointer"
                  >
                    Subscribe
                  </button>
                </div>
                {errorMsg && (
                  <p className="text-[11px] text-red-600 mt-2 font-medium">{errorMsg}</p>
                )}
              </form>
            )}

            <p className="elora-newsletter-disclaimer text-[11px] text-[#3A2E2B]/60 mt-4 font-light leading-normal">
              By signing up, you agree to our{' '}
              <a
                href="#privacy"
                onClick={(e) => handleLinkClick(e, '#privacy')}
                className="underline hover:text-[#3A2E2B] transition-colors"
              >
                Privacy Policy*
              </a>
              .
            </p>
          </div>
        </section>

        {/* 4. DIRECTORY LINK COLUMNS (RIGHT ~65%) */}
        <nav
          className="elora-footer-directory w-full md:w-[64%] lg:w-[65%] p-6 sm:p-8 md:p-10 lg:p-14 grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10"
          aria-label="Footer Navigation"
        >
          {/* COLUMN 1: NAVIGATE */}
          <div className="elora-footer-col">
            <h4 className="elora-col-header text-[11px] font-semibold tracking-[0.18em] uppercase text-[#3A2E2B] mb-5">
              Navigate
            </h4>
            <ul className="elora-col-list space-y-3">
              {[
                { label: 'Shop The Collection', href: '#shop' },
                { label: 'Track Your Order', href: '#track-order' },
                { label: 'Our Story & Philosophy', href: '#story' },
                { label: 'The Journal', href: '#journal' },
                { label: 'Store Locator', href: '#stores' },
              ].map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="elora-link text-xs sm:text-[13px] text-[#3A2E2B]/80 hover:text-[#3A2E2B] font-light transition-colors duration-200 block py-0.5"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 2: COMMUNITY */}
          <div className="elora-footer-col">
            <h4 className="elora-col-header text-[11px] font-semibold tracking-[0.18em] uppercase text-[#3A2E2B] mb-5">
              Community
            </h4>
            <ul className="elora-col-list space-y-3">
              {[
                {
                  label: 'Instagram',
                  href: 'https://instagram.com',
                  icon: (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-75 group-hover:opacity-100 transition-opacity">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  ),
                },
                {
                  label: 'TikTok',
                  href: 'https://tiktok.com',
                  icon: (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-75 group-hover:opacity-100 transition-opacity">
                      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                    </svg>
                  ),
                },
                {
                  label: 'YouTube',
                  href: 'https://youtube.com',
                  icon: (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-75 group-hover:opacity-100 transition-opacity">
                      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                      <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" />
                    </svg>
                  ),
                },
                {
                  label: 'Pinterest',
                  href: 'https://pinterest.com',
                  icon: (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-75 group-hover:opacity-100 transition-opacity">
                      <line x1="12" y1="9" x2="12" y2="21" />
                      <path d="M8 12a4 4 0 1 1 7.8 1.4c-.4 2-1.3 4-2.8 4.6-1 .4-2-.2-1.9-1.2l.6-3.8" />
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                  ),
                },
              ].map((item, idx) => (
                <li key={idx}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="elora-link group text-xs sm:text-[13px] text-[#3A2E2B]/80 hover:text-[#3A2E2B] font-light transition-colors duration-200 inline-flex items-center gap-2 py-0.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3A2E2B]/40 group-hover:bg-[#3A2E2B] transition-colors" />
                    <span>{item.label}</span>
                    {item.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: OFFICIAL */}
          <div className="elora-footer-col">
            <h4 className="elora-col-header text-[11px] font-semibold tracking-[0.18em] uppercase text-[#3A2E2B] mb-5">
              Official
            </h4>
            <ul className="elora-col-list space-y-3">
              {[
                { label: 'Privacy Policy', href: '#privacy' },
                { label: 'Terms of Service', href: '#terms' },
                { label: 'Accessibility Statement', href: '#accessibility' },
                { label: 'FAQ', href: '#faq' },
                { label: 'Contact', href: '#contact' },
              ].map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="elora-link text-xs sm:text-[13px] text-[#3A2E2B]/80 hover:text-[#3A2E2B] font-light transition-colors duration-200 block py-0.5"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 4: CARE & SUPPORT */}
          <div className="elora-footer-col flex flex-col justify-between">
            <div>
              <h4 className="elora-col-header text-[11px] font-semibold tracking-[0.18em] uppercase text-[#3A2E2B] mb-5">
                Care
              </h4>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-[#3A2E2B]/60 font-semibold mb-1">
                    Client Concierge
                  </p>
                  <p className="text-xs sm:text-[13px] text-[#3A2E2B]/85 font-light">
                    M–F 9AM – 6PM EST
                  </p>
                </div>

                <div>
                  <a
                    href="mailto:concierge@eloraskin.com"
                    className="elora-footer-concierge-link"
                  >
                    Drop a note anytime.
                  </a>
                </div>

                <div className="pt-1 space-y-2">
                  <a
                    href="#admin"
                    onClick={(e) => handleLinkClick(e, '#admin')}
                    className="elora-link text-[11px] text-[#3A2E2B]/60 hover:text-[#3A2E2B] font-light block transition-colors"
                  >
                    Atelier Portal ✦
                  </a>
                  <a
                    href="#cookie-preferences"
                    className="elora-link text-[11px] text-[#3A2E2B]/70 hover:text-[#3A2E2B] font-light block transition-colors"
                  >
                    Cookie Preferences
                  </a>
                </div>
              </div>
            </div>

            {/* Copyright Notice */}
            <div className="pt-4 border-t border-[#3A2E2B]/10 lg:border-t-0 lg:pt-0">
              <p className="text-[11px] text-[#3A2E2B]/60 font-light tracking-wide">
                &copy; Élora Skin &amp; Beauty 2026
              </p>
            </div>
          </div>

        </nav>

      </div>
    </footer>
  );
}
