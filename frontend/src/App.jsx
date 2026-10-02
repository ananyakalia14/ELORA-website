import React, { useState, useEffect } from 'react';
import AnnouncementTicker from './components/AnnouncementTicker';
import IntroSequence from './components/IntroSequence';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ProductSection from './components/ProductSection';
import ProductModal from './components/ProductModal';
import GlazingMilkDetailView from './components/GlazingMilkDetailView';
import ShadeDetailView from './components/ShadeDetailView';
import LipTintDetailView from './components/LipTintDetailView';
import ElixirDetailView from './components/ElixirDetailView';
import NectarDetailView from './components/NectarDetailView';
import LipLinerDetailView from './components/LipLinerDetailView';
import PhilosophySection from './components/PhilosophySection';

import ValuesSection from './components/ValuesSection';
import PressSection from './components/PressSection';
import CartDrawer from './components/CartDrawer';
import SearchDrawer from './components/SearchDrawer';
import AccountPage from './components/AccountPage';
import CheckoutPage from './components/CheckoutPage';
import OrderTrackingModal from './components/OrderTrackingModal';
import MobileStickyCta from './components/MobileStickyCta';
import EditorialComingSoon from './components/EditorialComingSoon';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';
import LegalPage from './components/LegalPage';
import { PRODUCTS } from './data/products';

export default function App() {
  const [introFinished, setIntroFinished] = useState(false);
  const [landingVisible, setLandingVisible] = useState(false);

  // Legal / Info page state (privacy, terms, accessibility, faq, contact)
  const [legalPage, setLegalPage] = useState(null);

  // Search drawer state
  const [searchOpen, setSearchOpen] = useState(false);

  // Account modal state
  const [accountOpen, setAccountOpen] = useState(false);

  // Order tracking modal state
  const [trackingOpen, setTrackingOpen] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState(null);

  // Checkout page state
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  // Coming Soon modal state (journal / stores)
  const [comingSoon, setComingSoon] = useState({ isOpen: false, type: 'journal' });

  // Admin Dashboard modal state
  const [adminOpen, setAdminOpen] = useState(false);

  // Cart state (starts empty with BAG (0) as requested)
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  // Modal quick view state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [glazingMilkViewOpen, setGlazingMilkViewOpen] = useState(false);
  const [lipTintViewOpen, setLipTintViewOpen] = useState(false);
  const [shadeViewOpen, setShadeViewOpen] = useState(false);
  const [elixirViewOpen, setElixirViewOpen] = useState(false);
  const [nectarViewOpen, setNectarViewOpen] = useState(false);
  const [lipLinerViewOpen, setLipLinerViewOpen] = useState(false);
  const [selectedShadeForView, setSelectedShadeForView] = useState(null);

  const handleNavigate = (target) => {
    if (!target) return;
    const cleanHash = target.startsWith('#') ? target.slice(1).toLowerCase() : target.toLowerCase();

    // Instantly reveal landing content if intro was running
    setIntroFinished(true);
    setLandingVisible(true);

    if (['privacy', 'privacy-policy'].includes(cleanHash)) {
      setLegalPage('privacy');
      window.history.replaceState(null, '', '#privacy');
      return;
    }
    if (['terms', 'terms-of-service', 'tos'].includes(cleanHash)) {
      setLegalPage('terms');
      window.history.replaceState(null, '', '#terms');
      return;
    }
    if (['accessibility', 'accessibility-statement'].includes(cleanHash)) {
      setLegalPage('accessibility');
      window.history.replaceState(null, '', '#accessibility');
      return;
    }
    if (['faq', 'faqs', 'help'].includes(cleanHash)) {
      setLegalPage('faq');
      window.history.replaceState(null, '', '#faq');
      return;
    }
    if (['contact', 'contact-us', 'concierge'].includes(cleanHash)) {
      setLegalPage('contact');
      window.history.replaceState(null, '', '#contact');
      return;
    }
    if (cleanHash === 'journal') {
      setComingSoon({ isOpen: true, type: 'journal' });
      window.history.replaceState(null, '', '#journal');
      return;
    }
    if (cleanHash === 'stores' || cleanHash === 'store' || cleanHash === 'store-locator') {
      setComingSoon({ isOpen: true, type: 'stores' });
      window.history.replaceState(null, '', '#stores');
      return;
    }
    if (['track', 'track-order', 'tracking', 'order-status'].includes(cleanHash)) {
      setTrackingOpen(true);
      window.history.replaceState(null, '', '#track-order');
      return;
    }
    if (cleanHash === 'admin') {
      setAdminOpen(true);
      window.history.replaceState(null, '', '#admin');
      return;
    }
    if (target === '#' || cleanHash === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.replaceState(null, '', window.location.pathname);
      return;
    }

    let targetId = cleanHash;
    if (cleanHash === 'story' || cleanHash === 'about') targetId = 'philosophy';

    if (cleanHash === 'shop') targetId = 'shop';

    const element =
      document.getElementById(targetId) ||
      document.getElementById(cleanHash) ||
      document.querySelector(target);

    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const offsetPosition = elementRect - bodyRect - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      window.history.replaceState(null, '', `#${cleanHash}`);
    }
  };

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash) {
        setIntroFinished(true);
        setLandingVisible(true);
        handleNavigate(hash);
      }
    };
    window.addEventListener('hashchange', handleHash);
    if (window.location.hash) {
      setIntroFinished(true);
      setLandingVisible(true);
      setTimeout(handleHash, 100);
      setTimeout(handleHash, 450);
    }
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const closeAllProductViews = () => {
    setGlazingMilkViewOpen(false);
    setElixirViewOpen(false);
    setNectarViewOpen(false);
    setLipLinerViewOpen(false);
    setLipTintViewOpen(false);
    setShadeViewOpen(false);
    setSelectedProduct(null);
  };

  const handleOpenProduct = (product) => {
    if (!product) return;
    closeAllProductViews();

    const isGlazingMilk =
      product.isGlazingMilk ||
      product.id === 'glazing-milk' ||
      product.id === 'lumineuse' ||
      (product.name && product.name.toLowerCase().includes('glazing')) ||
      (product.name && product.name.toLowerCase().includes('milk'));

    const isElixir =
      product.id === 'elixir' ||
      (product.name && product.name.toLowerCase().includes('elixir')) ||
      (product.name && product.name.toLowerCase().includes('glazed barrier'));

    const isNectar =
      product.id === 'nectar' ||
      (product.name && product.name.toLowerCase().includes('nectar'));

    const isLipLiner =
      product.id === 'hero-serum' ||
      (product.name && product.name.toLowerCase().includes('color')) ||
      (product.name && product.name.toLowerCase().includes('liner'));

    const isLipTint =
      product.id === 'brume' ||
      (product.name && product.name.toLowerCase().includes('tint')) ||
      (product.name && product.name.toLowerCase().includes('shade'));

    if (isGlazingMilk) {
      setGlazingMilkViewOpen(true);
    } else if (isElixir) {
      setElixirViewOpen(true);
    } else if (isNectar) {
      setNectarViewOpen(true);
    } else if (isLipLiner) {
      setLipLinerViewOpen(true);
    } else if (isLipTint) {
      setLipTintViewOpen(true);
    } else {
      setSelectedProduct(product);
    }
  };

  const handleTransitionStart = () => {
    setLandingVisible(true);
  };

  const handleIntroComplete = () => {
    setIntroFinished(true);
    setLandingVisible(true);
  };

  const handleAddToCart = (product, qty = 1) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === product.id);
      if (existing) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [
        ...prevItems,
        {
          id: product.id || product.productId || `item-${Date.now()}`,
          productId: product.productId || product.id,
          name: product.name,
          variantName: product.variantName || null,
          volume: product.volume || null,
          price: product.price,
          quantity: qty,
          image: product.image,
        },
      ];
    });
    setCartOpen(true);
  };


  const handleUpdateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const handleRemoveItem = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const heroSerum = PRODUCTS.find((p) => p.id === 'hero-serum') || PRODUCTS[0];
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="app-root">
      {/* Intro sequence and smooth FLIP transition */}
      {!introFinished && (
        <IntroSequence
          onTransitionStart={handleTransitionStart}
          onIntroComplete={handleIntroComplete}
        />
      )}

      {/* Main Landing Page Content */}
      <div
        className={`landing-page-content ${landingVisible ? 'is-visible' : ''}`}
        style={{
          opacity: landingVisible ? 1 : 0,
          transition: 'opacity 900ms cubic-bezier(0.76, 0, 0.24, 1)',
          pointerEvents: landingVisible ? 'auto' : 'none',
        }}
      >
        {/* Top Infinite-Scroll Announcement Ticker */}
        <AnnouncementTicker />

        {/* Transparent Sticky Navigation Header */}
        <Header
          cartCount={totalCartCount}
          onOpenCart={() => setCartOpen(true)}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenAccount={() => setAccountOpen(true)}
          introFinished={introFinished}
          onNavigate={handleNavigate}
        />

        <main id="main-content">
          {/* Hero Section */}
          <HeroSection
            onShopHero={() => setElixirViewOpen(true)}
            onQuickView={() => setElixirViewOpen(true)}
          />

          {/* Curated Botanical Edit with Shade/Variant Swatches */}
          <ProductSection
            onAddToCart={handleAddToCart}
            onQuickView={handleOpenProduct}
          />


          {/* Editorial Split-Screen Brand Philosophy Section */}
          <PhilosophySection />



          {/* Interactive Our Values Tabbed Showcase Section */}
          <ValuesSection />

          {/* Editorial Press Quotes Carousel */}
          <PressSection />
        </main>

        {/* Luxury Footer */}
        <Footer onNavigate={handleNavigate} />
      </div>

      {/* Mobile Sticky Quick Add Dock */}
      <MobileStickyCta onAddToCart={handleAddToCart} />

      {/* Quick View Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Full-Screen Glazing Milk Detail View */}
      <GlazingMilkDetailView
        isOpen={glazingMilkViewOpen}
        onClose={() => setGlazingMilkViewOpen(false)}
        onAddToCart={handleAddToCart}
        onOpenCart={() => {
          setGlazingMilkViewOpen(false);
          setCartOpen(true);
        }}
        cartCount={totalCartCount}
      />

      {/* Full-Screen The Glazed Barrier Elixir Product Detail View */}
      <ElixirDetailView
        isOpen={elixirViewOpen}
        onClose={() => setElixirViewOpen(false)}
        onAddToCart={handleAddToCart}
        onOpenCart={() => {
          setElixirViewOpen(false);
          setCartOpen(true);
        }}
        cartCount={totalCartCount}
      />

      {/* Full-Screen Barrier Repair Nectar Detail View */}
      <NectarDetailView
        isOpen={nectarViewOpen}
        onClose={() => setNectarViewOpen(false)}
        onAddToCart={handleAddToCart}
        onOpenCart={() => {
          setNectarViewOpen(false);
          setCartOpen(true);
        }}
        cartCount={totalCartCount}
      />

      {/* Full-Screen Color, The Élora Way / Lip Liner Detail View */}
      <LipLinerDetailView
        isOpen={lipLinerViewOpen}
        onClose={() => setLipLinerViewOpen(false)}
        onAddToCart={handleAddToCart}
        onOpenCart={() => {
          setLipLinerViewOpen(false);
          setCartOpen(true);
        }}
        cartCount={totalCartCount}
      />

      {/* Full-Screen Dedicated Peptide Lip Tint Detail View */}
      <LipTintDetailView
        isOpen={lipTintViewOpen}
        onClose={() => setLipTintViewOpen(false)}
        onAddToCart={handleAddToCart}
        onOpenCart={() => {
          setLipTintViewOpen(false);
          setCartOpen(true);
        }}
        cartCount={totalCartCount}
      />

      {/* Full-Screen Shade Product Detail View */}
      <ShadeDetailView
        isOpen={shadeViewOpen}
        initialShade={selectedShadeForView}
        onClose={() => setShadeViewOpen(false)}
        onAddToCart={handleAddToCart}
        onOpenCart={() => {
          setShadeViewOpen(false);
          setCartOpen(true);
        }}
        cartCount={totalCartCount}
      />

      {/* Slide-out Rhode-Style Search Drawer */}
      <SearchDrawer
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectProduct={(product) => {
          handleOpenProduct(product);
          setSearchOpen(false);
        }}
        onAddToCart={handleAddToCart}
        onNavigate={handleNavigate}
      />

      {/* Full-Screen Standalone Account Page */}
      <AccountPage
        isOpen={accountOpen}
        onClose={() => setAccountOpen(false)}
        onOpenCart={() => {
          setAccountOpen(false);
          setCartOpen(true);
        }}
        onOpenSearch={() => {
          setAccountOpen(false);
          setSearchOpen(true);
        }}
        onOpenAdmin={() => {
          setAccountOpen(false);
          setAdminOpen(true);
        }}
        onTrackOrder={(order) => {
          setTrackingOrder(order);
          setTrackingOpen(true);
        }}
        cartCount={totalCartCount}
      />

      {/* Dynamic Slide-Out Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onAddCrossSell={handleAddToCart}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />

      {/* Luxury Atelier Checkout Page with 3D Factory Processing Machine */}
      <CheckoutPage
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={cartItems}
        onClearCart={() => setCartItems([])}
        onOpenStore={() => {
          setCheckoutOpen(false);
        }}
        onTrackOrder={(order) => {
          setTrackingOrder(order);
          setTrackingOpen(true);
        }}
      />

      {/* Real-Time Order & Delivery Tracking Portal */}
      <OrderTrackingModal
        isOpen={trackingOpen}
        onClose={() => {
          setTrackingOpen(false);
          setTrackingOrder(null);
          if (['#track', '#track-order', '#tracking'].includes(window.location.hash.toLowerCase())) {
            window.history.replaceState(null, '', window.location.pathname);
          }
        }}
        initialOrder={trackingOrder}
        onOpenStore={() => {
          setTrackingOpen(false);
          handleNavigate('#shop');
        }}
      />

      {/* Editorial Coming Soon Modal (The Journal & Store Locator) */}
      <EditorialComingSoon
        isOpen={comingSoon.isOpen}
        onClose={() => {
          setComingSoon({ ...comingSoon, isOpen: false });
          if (window.location.hash === '#journal' || window.location.hash === '#stores') {
            window.history.replaceState(null, '', window.location.pathname);
          }
        }}
        type={comingSoon.type}
        onGoToShop={() => handleNavigate('#shop')}
      />

      {/* Boutique Operations & Admin Dashboard Modal */}
      <AdminDashboard
        isOpen={adminOpen}
        onClose={() => {
          setAdminOpen(false);
          if (window.location.hash === '#admin') {
            window.history.replaceState(null, '', window.location.pathname);
          }
        }}
      />

      {/* Official Legal & Information Pages (Privacy, Terms, Accessibility, FAQ, Contact) */}
      {legalPage && (
        <LegalPage
          pageType={legalPage}
          onClose={() => {
            setLegalPage(null);
            if (['#privacy', '#terms', '#accessibility', '#faq', '#contact'].includes(window.location.hash.toLowerCase())) {
              window.history.replaceState(null, '', window.location.pathname);
            }
          }}
        />
      )}
    </div>
  );
}
