import React, { useState, useEffect } from 'react';
import {
  X,
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  AlertTriangle,
  RefreshCw,
  Search,
  CheckCircle,
  Truck,
  Clock,
  Plus,
  Edit2,
  DollarSign,
  ArrowUpRight,
  ShieldAlert,
  LogOut
} from 'lucide-react';
import { API_BASE_URL } from '../config/api';

export default function AdminDashboard({ isOpen, onClose, onOpenStore }) {
  const [activeTab, setActiveTab] = useState('overview'); // overview, products, orders, users
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Editing product modal state
  const [editingProduct, setEditingProduct] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');

  // Admin auth
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('elora_token') || '');
  const [adminEmail, setAdminEmail] = useState('admin@elora.com');
  const [adminPassword, setAdminPassword] = useState('EloraAdmin2026!');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    if (isOpen) {
      checkAdminStatus();
    }
  }, [isOpen, adminToken]);

  const checkAdminStatus = async () => {
    const token = localStorage.getItem('elora_token');
    if (token) {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.role === 'admin') {
            setIsAdminAuthenticated(true);
            loadDashboardData(token);
            return;
          }
        }
      } catch {
        // Fall through to auto-login
      }
    }

    // Seamless auto-login with default admin credentials
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, password: adminPassword })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('elora_token', data.access_token);
        setAdminToken(data.access_token);
        setIsAdminAuthenticated(true);
        loadDashboardData(data.access_token);
        return;
      }
    } catch {
      // If network fails, allow preview mode
    }
    setIsAdminAuthenticated(false);
  };

  const handleAdminLogin = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, password: adminPassword })
      });

      if (!res.ok) {
        throw new Error('Invalid administrator credentials');
      }

      const data = await res.json();
      localStorage.setItem('elora_token', data.access_token);
      if (data.user) {
        localStorage.setItem('elora_user', JSON.stringify(data.user));
      }
      setAdminToken(data.access_token);
      setIsAdminAuthenticated(true);
      loadDashboardData(data.access_token);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = async (token) => {
    setLoading(true);
    setError('');
    const authHeaders = { Authorization: `Bearer ${token}` };

    try {
      // 1. Stats
      const statsRes = await fetch(`${API_BASE_URL}/admin/stats`, { headers: authHeaders });
      if (statsRes.ok) setStats(await statsRes.json());

      // 2. Products
      const prodRes = await fetch(`${API_BASE_URL}/admin/products?size=100`, { headers: authHeaders });
      if (prodRes.ok) setProducts(await prodRes.json());

      // 3. Orders
      const orderRes = await fetch(`${API_BASE_URL}/admin/orders?size=100`, { headers: authHeaders });
      if (orderRes.ok) setOrders(await orderRes.json());

      // 4. Users
      const usersRes = await fetch(`${API_BASE_URL}/admin/users?size=100`, { headers: authHeaders });
      if (usersRes.ok) setUsers(await usersRes.json());
    } catch (err) {
      setError('Error loading administrative data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setSuccessMsg(`Order #${orderId} status updated to ${newStatus}`);
        setTimeout(() => setSuccessMsg(''), 3000);
        loadDashboardData(adminToken);
      }
    } catch {
      setError('Could not update order status');
    }
  };

  const handleSaveProductEdit = async () => {
    if (!editingProduct) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          price: parseFloat(editPrice) || editingProduct.price,
          stock: parseInt(editStock, 10) ?? editingProduct.stock
        })
      });

      if (res.ok) {
        setSuccessMsg(`Updated ${editingProduct.name} successfully!`);
        setTimeout(() => setSuccessMsg(''), 3000);
        setEditingProduct(null);
        loadDashboardData(adminToken);
      }
    } catch {
      setError('Failed to update product');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="elora-admin-backdrop" role="dialog" aria-modal="true">
      <div className="elora-admin-shell">
        {/* Top Header Bar */}
        <header className="elora-admin-header">
          <div className="elora-admin-title-area">
            <span className="elora-admin-badge">ATELIER CONSOLE</span>
            <h2>Élora Administrative Sanctuary</h2>
          </div>

          <div className="elora-admin-header-actions">
            {isAdminAuthenticated && (
              <button
                type="button"
                onClick={() => loadDashboardData(adminToken)}
                className="elora-admin-btn-icon"
                title="Refresh Live Data"
              >
                <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="elora-admin-close-btn"
              title="Close and Return to Store"
            >
              <X size={20} />
            </button>
          </div>
        </header>

        {/* If Not Authenticated as Admin: Show Luxury PIN / Login Box */}
        {!isAdminAuthenticated ? (
          <div className="elora-admin-login-view">
            <div className="elora-admin-login-card">
              <div className="elora-admin-lock-icon">
                <ShieldAlert size={28} className="text-[#D4AF37]" />
              </div>
              <h3>Maison Administrator Portal</h3>
              <p>Please confirm authorized credentials to access product stock, pricing, and live customer orders.</p>

              {error && <div className="elora-admin-error">{error}</div>}

              <form onSubmit={handleAdminLogin} className="elora-admin-login-form">
                <div className="elora-admin-field-wrap">
                  <label>Admin Email</label>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="elora-admin-field-wrap">
                  <label>Password</label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="elora-admin-login-btn" disabled={loading}>
                  {loading ? 'Authenticating...' : 'Enter Atelier Console →'}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard View */
          <div className="elora-admin-body">
            {/* Success / Error Banners */}
            {successMsg && <div className="elora-admin-success-banner">{successMsg}</div>}
            {error && <div className="elora-admin-error-banner">{error}</div>}

            {/* Navigation Tabs */}
            <nav className="elora-admin-tabs">
              <button
                className={`elora-admin-tab ${activeTab === 'overview' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <TrendingUp size={15} /> Overview &amp; Analytics
              </button>
              <button
                className={`elora-admin-tab ${activeTab === 'products' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('products')}
              >
                <Package size={15} /> Final Boutique Products ({products.length})
              </button>
              <button
                className={`elora-admin-tab ${activeTab === 'orders' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                <ShoppingBag size={15} /> Customer Orders ({orders.length})
              </button>
              <button
                className={`elora-admin-tab ${activeTab === 'users' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('users')}
              >
                <Users size={15} /> Client Directory ({users.length})
              </button>
            </nav>

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && stats && (
              <div className="elora-admin-tab-content">
                <div className="elora-admin-kpi-grid">
                  <div className="elora-admin-kpi-card">
                    <span className="elora-kpi-label">TOTAL REVENUE</span>
                    <h3 className="elora-kpi-val">${stats.total_revenue?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
                    <small>Real-time order checkout receipts</small>
                  </div>
                  <div className="elora-admin-kpi-card">
                    <span className="elora-kpi-label">TOTAL ORDERS</span>
                    <h3 className="elora-kpi-val">{stats.total_orders}</h3>
                    <small>{stats.confirmed_orders} confirmed • {stats.pending_orders} pending</small>
                  </div>
                  <div className="elora-admin-kpi-card">
                    <span className="elora-kpi-label">AVERAGE ORDER VALUE</span>
                    <h3 className="elora-kpi-val">${stats.avg_order_value?.toFixed(2)}</h3>
                    <small>Basket volume across client orders</small>
                  </div>
                  <div className="elora-admin-kpi-card">
                    <span className="elora-kpi-label">CATALOG PRODUCTS</span>
                    <h3 className="elora-kpi-val">{stats.total_products}</h3>
                    <small>{stats.low_stock_count} item(s) low stock alert</small>
                  </div>
                </div>

                {/* Quick Status Bar */}
                <div className="elora-admin-status-strip">
                  <h4>Order Pipeline Health</h4>
                  <div className="elora-admin-status-pills">
                    <span className="status-pill pending">Pending: {stats.pending_orders}</span>
                    <span className="status-pill confirmed">Confirmed: {stats.confirmed_orders}</span>
                    <span className="status-pill shipped">Shipped: {stats.shipped_orders}</span>
                    <span className="status-pill delivered">Delivered: {stats.delivered_orders}</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: PRODUCTS CATALOG */}
            {activeTab === 'products' && (
              <div className="elora-admin-tab-content">
                <div className="elora-admin-table-header">
                  <div>
                    <h3>Canonical Boutique Collection</h3>
                    <p>Live inventory and pricing synced with Supabase PostgreSQL</p>
                  </div>
                </div>

                <div className="elora-admin-table-wrap">
                  <table className="elora-admin-table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Category</th>
                        <th>Shade / Subtitle</th>
                        <th>Price</th>
                        <th>Stock Reserve</th>
                        <th>Rating</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p.id}>
                          <td className="elora-prod-cell">
                            <img
                              src={p.image_url || '/images/elora-hero-serum.jpg'}
                              alt={p.name}
                              className="elora-prod-thumb"
                              onError={(e) => { e.target.src = '/images/elora-hero-serum.jpg'; }}
                            />
                            <div>
                              <strong>{p.name}</strong>
                              {p.badge && <span className="elora-item-badge">{p.badge}</span>}
                            </div>
                          </td>
                          <td>{p.category}</td>
                          <td>{p.shade || p.subtitle || '—'}</td>
                          <td className="font-semibold">${Number(p.price).toFixed(2)}</td>
                          <td>
                            <span className={`stock-tag ${p.stock < 30 ? 'low' : 'good'}`}>
                              {p.stock} units
                            </span>
                          </td>
                          <td>★ {p.rating || '5.0'}</td>
                          <td>
                            <button
                              type="button"
                              className="elora-table-edit-btn"
                              onClick={() => {
                                setEditingProduct(p);
                                setEditPrice(p.price);
                                setEditStock(p.stock);
                              }}
                            >
                              <Edit2 size={13} /> Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: CUSTOMER ORDERS */}
            {activeTab === 'orders' && (
              <div className="elora-admin-tab-content">
                <div className="elora-admin-table-header">
                  <div>
                    <h3>Live Client Orders</h3>
                    <p>Track order flow, line totals, and dispatch updates</p>
                  </div>
                </div>

                <div className="elora-admin-table-wrap">
                  <table className="elora-admin-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Client</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Placed On</th>
                        <th>Status</th>
                        <th>Update Dispatch</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => (
                        <tr key={o.id}>
                          <td><strong>#{o.id}</strong></td>
                          <td>User #{o.user_id}</td>
                          <td>
                            <div className="elora-order-items-compact">
                              {o.items?.map((it, idx) => (
                                <span key={idx} className="order-item-chip">
                                  {it.product?.name || `Item #${it.product_id}`} × {it.quantity}
                                </span>
                              )) || '—'}
                            </div>
                          </td>
                          <td className="font-semibold">${Number(o.total).toFixed(2)}</td>
                          <td>{o.created_at ? new Date(o.created_at).toLocaleDateString() : 'Recent'}</td>
                          <td>
                            <span className={`status-pill ${o.status}`}>{o.status}</span>
                          </td>
                          <td>
                            <select
                              value={o.status}
                              onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                              className="elora-status-select"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: USERS DIRECTORY */}
            {activeTab === 'users' && (
              <div className="elora-admin-tab-content">
                <div className="elora-admin-table-header">
                  <div>
                    <h3>Client Sanctuary Directory</h3>
                    <p>Registered customer profiles and lifetime order values</p>
                  </div>
                </div>

                <div className="elora-admin-table-wrap">
                  <table className="elora-admin-table">
                    <thead>
                      <tr>
                        <th>Client ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Skin Type</th>
                        <th>Orders</th>
                        <th>Lifetime Spend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id}>
                          <td>#{u.id}</td>
                          <td><strong>{u.name}</strong></td>
                          <td>{u.email}</td>
                          <td>
                            <span className={`role-tag ${u.role}`}>{u.role}</span>
                          </td>
                          <td>{u.skin_type || 'Combination'}</td>
                          <td>{u.order_count || 0}</td>
                          <td className="font-semibold">${(u.total_spent || 0).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal: Quick Edit Product Stock & Price */}
        {editingProduct && (
          <div className="elora-edit-modal-backdrop">
            <div className="elora-edit-modal">
              <div className="elora-edit-modal-header">
                <h4>Edit {editingProduct.name}</h4>
                <button type="button" onClick={() => setEditingProduct(null)}>
                  <X size={16} />
                </button>
              </div>
              <div className="elora-edit-modal-body">
                <div className="elora-edit-field">
                  <label>Price ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                  />
                </div>
                <div className="elora-edit-field">
                  <label>Stock Reserve (Units)</label>
                  <input
                    type="number"
                    value={editStock}
                    onChange={(e) => setEditStock(e.target.value)}
                  />
                </div>
              </div>
              <div className="elora-edit-modal-footer">
                <button
                  type="button"
                  className="elora-btn-cancel"
                  onClick={() => setEditingProduct(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="elora-btn-save"
                  onClick={handleSaveProductEdit}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
