import React, { useState, useEffect } from 'react';
import {
  X,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  ShieldCheck,
  Search,
  Copy,
  Check,
  ChevronRight,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import { API_BASE_URL } from '../config/api';

/**
 * OrderTrackingModal Component for Élora Skin & Beauty
 * Allows customers to track any order by Order # or Email,
 * or view real-time delivery milestones for previous purchases.
 */
export default function OrderTrackingModal({
  isOpen,
  onClose,
  initialOrder = null,
  onOpenStore,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Sync initial order if passed from checkout or account dashboard
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (initialOrder) {
        setSearchQuery(initialOrder.order_number || initialOrder.id ? `EL-${initialOrder.id}` : '');
        fetchOrderTracking(initialOrder.order_number || initialOrder.id);
      } else {
        // Try to load latest order from localStorage if available
        try {
          const stored = localStorage.getItem('elora_orders');
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const latest = parsed[0];
              setSearchQuery(latest.order_number || latest.id || '');
              fetchOrderTracking(latest.order_number || latest.id);
              return;
            }
          }
        } catch {
          // ignore
        }
      }
    } else {
      document.body.style.overflow = '';
      setError('');
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialOrder]);

  // ESC key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const fetchOrderTracking = async (lookupKey) => {
    if (!lookupKey) return;
    setLoading(true);
    setError('');

    const cleanKey = String(lookupKey).trim();

    try {
      const res = await fetch(`${API_BASE_URL}/orders/track/${encodeURIComponent(cleanKey)}`);
      if (res.ok) {
        const data = await res.json();
        setOrderData(data);
      } else {
        // Fallback: check localStorage for offline guest orders
        let localFound = null;
        try {
          const localOrders = JSON.parse(localStorage.getItem('elora_orders') || '[]');
          localFound = localOrders.find(
            (o) =>
              String(o.id) === cleanKey ||
              String(o.order_number).toLowerCase() === cleanKey.toLowerCase() ||
              String(o.tracking_number).toLowerCase() === cleanKey.toLowerCase()
          );
        } catch {
          // ignore
        }

        if (localFound) {
          setOrderData(formatLocalOrder(localFound));
        } else {
          throw new Error('Order not found. Please verify your order or tracking number.');
        }
      }
    } catch (err) {
      // Local fallback lookup
      let localFound = null;
      try {
        const localOrders = JSON.parse(localStorage.getItem('elora_orders') || '[]');
        localFound = localOrders.find(
          (o) =>
            String(o.id) === cleanKey ||
            String(o.order_number).toLowerCase() === cleanKey.toLowerCase() ||
            String(o.tracking_number).toLowerCase() === cleanKey.toLowerCase()
        );
      } catch {
        // ignore
      }

      if (localFound) {
        setOrderData(formatLocalOrder(localFound));
      } else {
        setError(err.message || 'Could not find order. Please check the order number.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatLocalOrder = (local) => {
    const createdDate = local.created_at ? new Date(local.created_at) : new Date();
    const orderNum = local.order_number || `EL-${local.id || 10421}`;
    const trackNum = local.tracking_number || `EL-TRK-${78290 + (local.id || 1)}`;

    return {
      order_id: local.id || 1,
      order_number: orderNum,
      tracking_number: trackNum,
      carrier: 'Élora White-Glove Atelier Courier',
      status: local.status || 'Confirmed',
      created_at: createdDate.toISOString(),
      estimated_delivery: new Date(createdDate.getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(
        'en-US',
        { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
      ),
      shipping_address: local.shipping_address || '742 Evergreen Terrace, Beverly Hills, CA 90210',
      customer_name: local.customer_name || 'Élora VIP Client',
      customer_email: local.customer_email || 'client@elora.com',
      total: local.total || 98.0,
      items: local.items || [],
      milestones: [
        {
          title: 'Order Placed & Authorized',
          detail: 'Payment authorized securely. Order entered into Atelier allocation queue.',
          timestamp: createdDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          completed: true,
          current: false,
        },
        {
          title: 'Atelier Formulation & Cold-Pressing',
          detail: 'French Alpine Rose actives and hyaluronic peptides prepared in sterile suite.',
          timestamp: 'In Progress',
          completed: true,
          current: true,
        },
        {
          title: 'Hand-Sealing & Wax Emblem',
          detail: 'Flacon sealed in linen sleeve with complimentary luxury miniatures.',
          timestamp: 'Upcoming',
          completed: false,
          current: false,
        },
        {
          title: 'Courier Handover & Departure',
          detail: 'Temperature-controlled botanical transit dispatched.',
          timestamp: 'Upcoming',
          completed: false,
          current: false,
        },
        {
          title: 'White-Glove Delivery',
          detail: 'Signature contactless delivery to your door.',
          timestamp: 'Estimated 2–3 Days',
          completed: false,
          current: false,
        },
      ],
    };
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    fetchOrderTracking(searchQuery);
  };

  const handleCopyTracking = () => {
    if (orderData?.tracking_number) {
      navigator.clipboard.writeText(orderData.tracking_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="elora-tracker-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Order Tracking Portal"
    >
      <div className="elora-tracker-backdrop" onClick={onClose} />

      <div className="elora-tracker-modal">
        {/* Header */}
        <div className="elora-tracker-header">
          <div className="elora-tracker-header-title-wrap">
            <span className="elora-tracker-badge">
              <Sparkles size={12} color="#D4AF37" /> ATELIER COURIER DISPATCH
            </span>
            <h2 className="elora-tracker-heading">Track Your Botanical Ritual</h2>
          </div>
          <button
            className="elora-tracker-close-btn"
            onClick={onClose}
            aria-label="Close Tracking Modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="elora-tracker-search-bar">
          <Search size={17} className="elora-tracker-search-icon" />
          <input
            type="text"
            className="elora-tracker-search-input"
            placeholder="Enter Order # (e.g. EL-10425), Tracking # or Email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" disabled={loading} className="elora-tracker-search-btn">
            {loading ? 'LOOKING UP...' : 'TRACK'}
          </button>
        </form>

        {error && <div className="elora-tracker-error-alert">{error}</div>}

        {/* Tracking Details View */}
        {orderData && (
          <div className="elora-tracker-content">
            {/* Status Summary Banner */}
            <div className="elora-tracker-status-banner">
              <div className="elora-tracker-status-left">
                <span className="elora-tracker-eyebrow">CURRENT STATUS</span>
                <h3 className="elora-tracker-status-title">
                  {orderData.status || 'Formulation in Progress'}
                </h3>
                <p className="elora-tracker-status-desc">
                  Estimated Arrival: <strong>{orderData.estimated_delivery}</strong>
                </p>
              </div>

              <div className="elora-tracker-status-right">
                <div className="elora-tracker-tag">
                  <Truck size={14} color="#AC7E76" />
                  <span>{orderData.carrier || 'White-Glove Courier'}</span>
                </div>
                <div className="elora-tracker-copy-pill" onClick={handleCopyTracking}>
                  <span>{orderData.tracking_number}</span>
                  {copied ? <Check size={13} color="#27672B" /> : <Copy size={13} />}
                </div>
              </div>
            </div>

            {/* Step-by-Step Visual Timeline */}
            <div className="elora-tracker-timeline-box">
              <h4 className="elora-tracker-section-title">Ritual Fulfillment Journey</h4>
              <div className="elora-tracker-timeline">
                {(orderData.milestones || []).map((step, idx) => (
                  <div
                    key={idx}
                    className={`elora-tracker-step ${step.completed ? 'is-completed' : ''} ${
                      step.current ? 'is-current' : ''
                    }`}
                  >
                    <div className="elora-tracker-step-icon-wrap">
                      <div className="elora-tracker-step-dot">
                        {step.completed ? (
                          <Check size={12} strokeWidth={3} />
                        ) : (
                          <span className="elora-tracker-dot-inner" />
                        )}
                      </div>
                      {idx < orderData.milestones.length - 1 && (
                        <div className="elora-tracker-step-line" />
                      )}
                    </div>

                    <div className="elora-tracker-step-content">
                      <div className="elora-tracker-step-header">
                        <strong className="elora-tracker-step-title">{step.title}</strong>
                        <span className="elora-tracker-step-time">{step.timestamp}</span>
                      </div>
                      <p className="elora-tracker-step-detail">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Destination & Order Recap Grid */}
            <div className="elora-tracker-grid">
              {/* Destination Card */}
              <div className="elora-tracker-card">
                <div className="elora-tracker-card-header">
                  <MapPin size={15} color="#AC7E76" />
                  <span>Destination Address</span>
                </div>
                <p className="elora-tracker-card-text">
                  <strong>{orderData.customer_name}</strong>
                  <br />
                  {orderData.shipping_address}
                </p>
                <div className="elora-tracker-card-security">
                  <ShieldCheck size={13} color="#27672B" />
                  <span>Temperature-Controlled Botanical Packaging</span>
                </div>
              </div>

              {/* Order Items Card */}
              <div className="elora-tracker-card">
                <div className="elora-tracker-card-header">
                  <Package size={15} color="#AC7E76" />
                  <span>
                    Order Items (
                    {orderData.items?.reduce((sum, item) => sum + (item.quantity || 1), 0) ||
                      orderData.items?.length ||
                      1}
                    )
                  </span>
                </div>

                <div className="elora-tracker-items-list">
                  {orderData.items && orderData.items.length > 0 ? (
                    orderData.items.map((item, i) => (
                      <div key={i} className="elora-tracker-item-row">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="elora-tracker-item-thumb"
                          />
                        )}
                        <div className="elora-tracker-item-info">
                          <span className="elora-tracker-item-name">{item.name}</span>
                          <span className="elora-tracker-item-meta">
                            Qty: {item.quantity || 1}{' '}
                            {item.variantName ? `• ${item.variantName}` : ''}
                            {item.shade ? `• ${item.shade}` : ''}
                          </span>
                        </div>
                        <span className="elora-tracker-item-price">
                          ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="elora-tracker-item-row">
                      <div className="elora-tracker-item-info">
                        <span className="elora-tracker-item-name">The Élora Botanical Ritual</span>
                        <span className="elora-tracker-item-meta">Cold-Pressed Essence Collection</span>
                      </div>
                      <span className="elora-tracker-item-price">
                        ${(orderData.total || 98.0).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="elora-tracker-total-row">
                  <span>Total Paid</span>
                  <strong>${(orderData.total || 0).toFixed(2)}</strong>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="elora-tracker-actions">
              <button
                type="button"
                className="elora-tracker-btn-primary"
                onClick={() => {
                  onClose();
                  if (onOpenStore) onOpenStore();
                }}
              >
                Continue Boutique Exploration
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
