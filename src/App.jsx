import React, { useState } from 'react';
import AnnouncementTicker from './components/AnnouncementTicker';
import IntroSequence from './components/IntroSequence';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ProductSection from './components/ProductSection';
import ProductModal from './components/ProductModal';
import GlazingMilkDetailView from './components/GlazingMilkDetailView';
import ShadeDetailView from './components/ShadeDetailView';
import PhilosophySection from './components/PhilosophySection';
import ValuesSection from './components/ValuesSection';
import PressSection from './components/PressSection';
import CartDrawer from './components/CartDrawer';
import SearchDrawer from './components/SearchDrawer';
import AccountPage from './components/AccountPage';
import MobileStickyCta from './components/MobileStickyCta';
import Footer from './components/Footer';
import { PRODUCTS } from './data/products';

export default function App() {
  const [introFinished, setIntroFinished] = useState(false);
  const [landingVisible, setLandingVisible] = useState(false);

  // Search drawer state
  const [searchOpen, setSearchOpen] = useState(false);

  // Account modal state
  const [accountOpen, setAccountOpen] = useState(false);

  // Cart state (starts empty with BAG (0) as requested)
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  // Modal quick view state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [glazingMilkViewOpen, setGlazingMilkViewOpen] = useState(false);
  const [shadeViewOpen, setShadeViewOpen] = useState(false);
  const [selectedShadeForView, setSelectedShadeForView] = useState(null);

  const handleOpenProduct = (product) => {
    if (!product) return;
    const isGlazingMilk =
      product.isGlazingMilk ||
      product.id === 'glazing-milk' ||
      product.id === 'lumineuse' ||
      (product.name && product.name.toLowerCase().includes('glazing')) ||
      (product.name && product.name.toLowerCase().includes('milk'));

    const isLipTint =
      product.id === 'brume' ||
      (product.name && product.name.toLowerCase().includes('tint')) ||
      (product.name && product.name.toLowerCase().includes('shade'));

    if (isGlazingMilk) {
      setGlazingMilkViewOpen(true);
    } else if (isLipTint) {
      setSelectedShadeForView(null);
      setShadeViewOpen(true);
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
        />

        <main id="main-content">
          {/* Hero Section */}
          <HeroSection
            onShopHero={() => handleAddToCart(heroSerum)}
            onQuickView={() => setSelectedProduct(heroSerum)}
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
        <Footer />
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
          alert('Proceeding to Élora Secure Checkout...');
        }}
      />
    </div>
  );
}
