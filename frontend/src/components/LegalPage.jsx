import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Shield,
  Scale,
  Accessibility,
  HelpCircle,
  Mail,
  Phone,
  MapPin,
  Clock,
  ChevronDown,
  Search,
  CheckCircle2,
  Send,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

const LEGAL_TABS = [
  { id: 'privacy', label: 'Privacy Policy', icon: Shield },
  { id: 'terms', label: 'Terms of Service', icon: Scale },
  { id: 'accessibility', label: 'Accessibility', icon: Accessibility },
  { id: 'faq', label: 'FAQ', icon: HelpCircle },
  { id: 'contact', label: 'Contact', icon: Mail },
];

const PAGES = {
  privacy: {
    icon: Shield,
    label: 'Privacy Policy',
    tagline: 'Your privacy and data sovereignty are paramount to the Élora experience.',
    lastUpdated: 'October 1, 2026',
    sections: [
      {
        title: 'Information We Collect',
        content: `When you visit eloraskin.com, we collect essential browsing metadata including device type, IP address, geographical region, and browsing behaviour to ensure an optimal digital experience. When you create an account, place an order, or subscribe to our Inner Circle newsletter, we collect information you provide directly — such as your name, email address, shipping address, telephone number, and payment credentials.`,
      },
      {
        title: 'How We Use Your Information',
        content: `We use your information exclusively to process and fulfill your boutique allocations, personalize your skincare consultations, dispatch opted-in editorial newsletters, enhance website security, and comply with international commerce regulations. We will never sell, lease, or monetize your personal data to third parties.`,
      },
      {
        title: 'Cookies & Analytical Discretion',
        content: `Élora utilizes first-party cookies and privacy-first analytics to understand how our community interacts with our catalog. You can manage or revoke your cookie preferences at any time through our footer controls. Essential session cookies required for cart operations and checkout security remain mandatory.`,
      },
      {
        title: 'Data Retention & Cryptographic Security',
        content: `We retain client data only for the duration required to fulfill transactional obligations and legal records. All payment credentials are encrypted end-to-end via TLS 1.3 in transit and stored in PCI-DSS Level 1 certified vaults using AES-256 encryption. We never retain raw credit card numbers on our servers.`,
      },
      {
        title: 'Your Global Data Rights',
        content: `In accordance with GDPR, CCPA, and global privacy standards, you maintain the right to access, rectify, port, or request total deletion of your personal records. To execute your privacy rights, email privacy@eloraskin.com. All formal requests are fulfilled within 30 business days.`,
      },
      {
        title: 'Data Protection Officer & Inquiries',
        content: `For any formal privacy inquiries or regulatory correspondence, contact our Data Protection Office at privacy@eloraskin.com or via mail at Élora Skin & Beauty, Atelier de Beauté, 74 Rue des Alpes, 74000 Annecy, France.`,
      },
    ],
  },
  terms: {
    icon: Scale,
    label: 'Terms of Service',
    tagline: 'Standard terms governing your boutique allocations and interactions with Élora.',
    lastUpdated: 'October 1, 2026',
    sections: [
      {
        title: 'Acceptance of Terms',
        content: `By accessing or purchasing from eloraskin.com (the "Site"), you agree to be bound by these Terms of Service and all related company policies. If you do not agree to these terms, you should discontinue use of the site immediately. Continued access constitutes binding acceptance.`,
      },
      {
        title: 'Product Availability & Allocation Limits',
        content: `Due to the artisanal extraction methods of our French Alpine actives, products are subject to seasonal batch allocations. We reserve the right to limit order quantities per household and modify or discontinue formulations without prior notice.`,
      },
      {
        title: 'Pricing & Currency Disclosures',
        content: `All prices are listed in USD unless dynamically localized. Applicable sales taxes and duties are calculated at checkout based on your delivery destination. In the event of a technical typographical pricing error, we reserve the right to cancel affected unfulfilled orders with immediate full refund.`,
      },
      {
        title: 'Complimentary Shipping & Global Delivery',
        content: `Complimentary signature standard shipping applies to all orders over $75 within the continental United States. Express and international shipping options are calculated dynamically. Delivery timelines represent estimates provided by logistics partners and are not strictly guaranteed during peak seasons.`,
      },
      {
        title: '30-Day Atelier Return Guarantee',
        content: `We accept returns of unopened, unused items in original pristine packaging within 30 days of delivery. To initiate a return or exchange, contact concierge@eloraskin.com. Approved refunds are credited to the original payment method within 5–10 business days upon inspection.`,
      },
      {
        title: 'Intellectual Property & Brand Trademarks',
        content: `All visual assets, logotypes, botanical formulas, typography designs, 3D interactive models, and editorial copy are the sole intellectual property of Élora Skin & Beauty. Reproduction or commercial exploitation without written consent is strictly prohibited.`,
      },
    ],
  },
  accessibility: {
    icon: Accessibility,
    label: 'Accessibility Statement',
    tagline: 'Committed to delivering an inclusive, seamless luxury digital experience for all.',
    lastUpdated: 'October 1, 2026',
    sections: [
      {
        title: 'Our Accessibility Commitment',
        content: `Élora Skin & Beauty believes that luxury beauty and digital empowerment should be universally accessible. We are dedicated to ensuring our digital experiences conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.`,
      },
      {
        title: 'Implemented Accessibility Features',
        content: `Our digital platform includes semantic HTML5 structures, full screen-reader ARIA landmarks, WCAG-compliant color contrast ratios (minimum 4.5:1), complete keyboard navigability with visible focus rings, reduced-motion media alternatives, and responsive scalable typography up to 200% zoom.`,
      },
      {
        title: 'Assistive Tech & 3D Visual Fallbacks',
        content: `For visitors utilizing screen readers or reduced-graphics preferences, all interactive 3D product visualizers and canvas simulations provide rich descriptive alt text and static tabular specifications.`,
      },
      {
        title: 'Ongoing Auditing & Enhancement',
        content: `We partner with independent accessibility consultants to perform quarterly audits and user testing across modern assistive devices, including VoiceOver, NVDA, and screen magnification software.`,
      },
      {
        title: 'Direct Accessibility Concierge Support',
        content: `If you encounter any difficulty navigating our platform or require assistance completing an order, our dedicated accessibility team is available at accessibility@eloraskin.com or +1 (800) 555-ÉLORA. We are delighted to assist you directly.`,
      },
    ],
  },
  faq: {
    icon: HelpCircle,
    label: 'Frequently Asked Questions',
    tagline: 'Answers to essential questions regarding our formulations, rituals, and orders.',
    lastUpdated: 'October 1, 2026',
    items: [
      {
        category: 'Formulation & Science',
        question: 'What defines the signature Élora formulation philosophy?',
        answer:
          'Every Élora product unites wild-harvested French Alpine botanical stem cells with 5-tier oligo molecular delivery systems and cold-pressed phyto-actives. Our formulas are designed to drench the skin barrier in restorative dew without heavy occlusives or irritation.',
      },
      {
        category: 'Formulation & Science',
        question: 'Are all Élora products cruelty-free, clean, and vegan?',
        answer:
          'Yes. Élora is 100% Leaping Bunny certified cruelty-free. We never test on animals, nor do our active ingredient suppliers. The majority of our formulations are 100% vegan, formulated without parabens, phthalates, synthetic fragrance, or mineral oils.',
      },
      {
        category: 'Formulation & Science',
        question: 'How should I layer the Glazing Milk and Glazed Barrier Elixir?',
        answer:
          'After gentle cleansing, dispense 3–4 drops of Glazing Milk Essence into your palms and press softly into damp skin. Follow immediately with 2 pumps of The Glazed Barrier Elixir to lock in micronized ceramides and provide an instant glass-skin finish.',
      },
      {
        category: 'Orders & Shipping',
        question: 'What are your shipping rates and delivery timelines?',
        answer:
          'We offer complimentary signature standard delivery on all domestic orders over $75 (3–5 business days). Express 2-day delivery is available at checkout for $15. International orders are handled with prepaid duties and taxes.',
      },
      {
        category: 'Orders & Shipping',
        question: 'How can I track my boutique parcel?',
        answer:
          'As soon as your allocation is packaged at our atelier, you will receive a tracking link via email. You can also view live delivery milestones inside your Élora Client Account dashboard.',
      },
      {
        category: 'Returns & Exchanges',
        question: 'What is your returns policy?',
        answer:
          'We accept returns of unopened and unused products within 30 days of receipt in original packaging. Contact concierge@eloraskin.com to receive a prepaid digital return label. Refunds process within 5–10 business days.',
      },
      {
        category: 'Storage & Care',
        question: 'How should I preserve the potency of my Élora formulations?',
        answer:
          'Store products in a cool, dry environment away from direct sunlight. Our cold-pressed botanical essences perform best stored upright at temperatures between 15°C and 25°C (59°F–77°F).',
      },
    ],
  },
  contact: {
    icon: Mail,
    label: 'Client Concierge & Contact',
    tagline: 'Our dedicated skincare advisors and atelier specialists are at your service.',
    lastUpdated: 'October 1, 2026',
    channels: [
      {
        title: 'Client Concierge Email',
        detail: 'concierge@eloraskin.com',
        subtext: 'Response within 1 business day',
        icon: Mail,
      },
      {
        title: 'Toll-Free Telephone',
        detail: '+1 (800) 555-ÉLORA',
        subtext: 'Mon–Fri, 9:00 AM – 6:00 PM EST',
        icon: Phone,
      },
      {
        title: 'Atelier Headquarters',
        detail: '74 Rue des Alpes, 74000 Annecy, France',
        subtext: 'Haute-Savoie Botanical Laboratory',
        icon: MapPin,
      },
      {
        title: 'Concierge Hours',
        detail: 'Mon–Fri: 9AM–6PM EST | Sat: 10AM–4PM EST',
        subtext: 'Closed Sundays and French national holidays',
        icon: Clock,
      },
    ],
  },
};

export default function LegalPage({ pageType = 'privacy', onClose }) {
  const [activeTab, setActiveTab] = useState(pageType || 'privacy');
  const [faqSearch, setFaqSearch] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    topic: 'General Skincare Consultation',
    orderNumber: '',
    message: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Synchronize active tab with prop
  useEffect(() => {
    if (pageType && PAGES[pageType]) {
      setActiveTab(pageType);
    }
  }, [pageType]);

  // Lock body scroll and handle Escape key
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    window.history.replaceState(null, '', `#${tabId}`);
    const container = document.querySelector('.legal-page-overlay');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.email || !contactForm.message) return;
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setContactForm({
        name: '',
        email: '',
        topic: 'General Skincare Consultation',
        orderNumber: '',
        message: '',
      });
    }, 4000);
  };

  const currentPage = PAGES[activeTab] || PAGES.privacy;
  const Icon = currentPage.icon;

  const filteredFaqs =
    currentPage.items?.filter(
      (item) =>
        item.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
        item.answer.toLowerCase().includes(faqSearch.toLowerCase()) ||
        item.category.toLowerCase().includes(faqSearch.toLowerCase())
    ) || [];

  return (
    <div className="legal-page-overlay" role="dialog" aria-modal="true">
      <div className="legal-page-container">
        {/* Top Header Bar with Back Button & Brand Tag */}
        <div className="legal-top-bar">
          <button
            className="legal-back-btn"
            onClick={onClose}
            aria-label="Return to homepage"
          >
            <ArrowLeft size={16} strokeWidth={2} />
            <span>Return to Élora</span>
          </button>

          <span className="legal-atelier-badge">
            ÉLORA ATELIER &bull; OFFICIAL DOCUMENTATION
          </span>
        </div>

        {/* Tab Navigation for Seamless Switching between all 5 pages */}
        <nav className="legal-tab-nav" aria-label="Official Pages Navigation">
          {LEGAL_TABS.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`legal-tab-btn ${isActive ? 'is-active' : ''}`}
                aria-selected={isActive}
                role="tab"
              >
                <TabIcon size={15} strokeWidth={isActive ? 2.2 : 1.5} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Hero Header */}
        <header className="legal-hero">
          <div className="legal-hero-icon">
            <Icon size={28} strokeWidth={1.4} />
          </div>
          <h1 className="legal-hero-title">{currentPage.label}</h1>
          <p className="legal-hero-tagline">{currentPage.tagline}</p>
          <p className="legal-hero-updated">Effective: {currentPage.lastUpdated}</p>
          <div className="legal-hero-divider" />
        </header>

        {/* MAIN BODY: Privacy, Terms, Accessibility */}
        {currentPage.sections && (
          <main className="legal-content">
            {currentPage.sections.map((section, idx) => (
              <section key={idx} className="legal-section">
                <div className="legal-section-number">
                  ARTICLE {String(idx + 1).padStart(2, '0')}
                </div>
                <h2 className="legal-section-title">{section.title}</h2>
                <div className="legal-section-body">
                  <p>{section.content}</p>
                </div>
              </section>
            ))}
          </main>
        )}

        {/* MAIN BODY: Interactive FAQ Page */}
        {activeTab === 'faq' && (
          <main className="legal-faq-container">
            {/* Search Bar */}
            <div className="legal-faq-search-wrap">
              <Search size={18} className="legal-faq-search-icon" />
              <input
                type="text"
                placeholder="Search ritual guides, formulations, shipping..."
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                className="legal-faq-search-input"
                aria-label="Search frequently asked questions"
              />
              {faqSearch && (
                <button
                  onClick={() => setFaqSearch('')}
                  className="legal-faq-search-clear"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Accordion List */}
            <div className="legal-faq-list">
              {filteredFaqs.length === 0 ? (
                <div className="legal-faq-empty">
                  <p>No questions matched "{faqSearch}".</p>
                  <button
                    onClick={() => setFaqSearch('')}
                    className="legal-faq-reset-btn"
                  >
                    View All Questions
                  </button>
                </div>
              ) : (
                filteredFaqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className={`legal-faq-item ${isOpen ? 'is-open' : ''}`}
                    >
                      <button
                        className="legal-faq-question-btn"
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        aria-expanded={isOpen}
                      >
                        <div className="legal-faq-question-left">
                          <span className="legal-faq-category-badge">
                            {faq.category}
                          </span>
                          <span className="legal-faq-question-text">
                            {faq.question}
                          </span>
                        </div>
                        <ChevronDown
                          size={18}
                          className={`legal-faq-chevron ${isOpen ? 'is-rotated' : ''}`}
                        />
                      </button>

                      {isOpen && (
                        <div className="legal-faq-answer-panel">
                          <p>{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </main>
        )}

        {/* MAIN BODY: Interactive Contact Concierge Page */}
        {activeTab === 'contact' && (
          <main className="legal-contact-container">
            {/* Channels Grid */}
            <div className="legal-contact-grid">
              {currentPage.channels?.map((channel, idx) => {
                const ChannelIcon = channel.icon;
                return (
                  <div key={idx} className="legal-contact-card">
                    <div className="legal-contact-card-icon">
                      <ChannelIcon size={20} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="legal-contact-card-title">{channel.title}</h3>
                      <p className="legal-contact-card-detail">{channel.detail}</p>
                      <p className="legal-contact-card-subtext">{channel.subtext}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Interactive Concierge Dispatch Message Box */}
            <div className="legal-contact-form-card">
              <div className="legal-contact-form-header">
                <span className="legal-section-number">PRIVATE INQUIRY</span>
                <h2 className="legal-section-title">Send a Note to Concierge</h2>
                <p className="legal-contact-form-subtext">
                  Whether regarding a custom formulation inquiry, bespoke allocation, or order assistance, our specialists reply promptly.
                </p>
              </div>

              {formSubmitted ? (
                <div className="legal-contact-success">
                  <CheckCircle2 size={32} className="text-[#C4A265]" />
                  <div>
                    <h3 className="font-serif text-xl text-[#3A2E2B] mb-1">
                      Message Dispatched to Concierge
                    </h3>
                    <p className="text-sm text-[#3A2E2B]/75">
                      Thank you for contacting Élora. A dedicated skincare advisor has received your dispatch and will respond within 24 hours.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="legal-contact-form">
                  <div className="legal-form-row">
                    <div className="legal-form-group">
                      <label className="legal-form-label">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Camille Laurent"
                        value={contactForm.name}
                        onChange={(e) =>
                          setContactForm({ ...contactForm, name: e.target.value })
                        }
                        className="legal-form-input"
                      />
                    </div>

                    <div className="legal-form-group">
                      <label className="legal-form-label">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. camille@example.com"
                        value={contactForm.email}
                        onChange={(e) =>
                          setContactForm({ ...contactForm, email: e.target.value })
                        }
                        className="legal-form-input"
                      />
                    </div>
                  </div>

                  <div className="legal-form-row">
                    <div className="legal-form-group">
                      <label className="legal-form-label">Topic / Department</label>
                      <select
                        value={contactForm.topic}
                        onChange={(e) =>
                          setContactForm({ ...contactForm, topic: e.target.value })
                        }
                        className="legal-form-input legal-form-select"
                      >
                        <option>General Skincare Consultation</option>
                        <option>Order Tracking & Allocation</option>
                        <option>Returns & Exchanges</option>
                        <option>Press & Editorial Partnerships</option>
                        <option>Wholesale & Boutique Accounts</option>
                      </select>
                    </div>

                    <div className="legal-form-group">
                      <label className="legal-form-label">Order Number (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. ELORA-8921"
                        value={contactForm.orderNumber}
                        onChange={(e) =>
                          setContactForm({
                            ...contactForm,
                            orderNumber: e.target.value,
                          })
                        }
                        className="legal-form-input"
                      />
                    </div>
                  </div>

                  <div className="legal-form-group">
                    <label className="legal-form-label">Your Message *</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="How may our concierge assist your ritual today?"
                      value={contactForm.message}
                      onChange={(e) =>
                        setContactForm({
                          ...contactForm,
                          message: e.target.value,
                        })
                      }
                      className="legal-form-input legal-form-textarea"
                    />
                  </div>

                  <button type="submit" className="legal-form-submit-btn">
                    <Send size={16} />
                    <span>Dispatch Inquiry to Atelier</span>
                  </button>
                </form>
              )}
            </div>
          </main>
        )}

        {/* Luxury Footer CTA */}
        <footer className="legal-footer-cta">
          <div className="legal-footer-divider" />
          <p className="legal-footer-text">
            Élora Skin & Beauty &bull; Atelier de Beauté, Haute-Savoie, France
          </p>
          <a
            href="mailto:concierge@eloraskin.com"
            className="legal-footer-email"
          >
            concierge@eloraskin.com
          </a>
          <button className="legal-footer-home-btn" onClick={onClose}>
            Return to Atelier Store
          </button>
        </footer>
      </div>
    </div>
  );
}
