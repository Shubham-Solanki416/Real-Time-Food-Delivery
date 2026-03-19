import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import {
  Users,
  Store,
  ShoppingCart,
  DollarSign,
  CheckCircle,
  XCircle,
  BarChart3,
  ClipboardList,
  Eye,
  X,
  User,
  LogOut,
  Globe
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RevenueChart } from '../components/AnalyticsCharts';
import '../styles/AdminPanel.css';

const AdminPanel = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [revenueRange, setRevenueRange] = useState('7D');

  const handleLogout = async () => {
    try {
      await api.get('/logout');
      logout();
      toast.success('Logged out');
      navigate('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const fetchStats = async (range = '7D') => {
    try {
      const { data } = await api.get(`/admin/stats?range=${range}`);
      setStats(data);
    } catch (error) {
      toast.error('Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(revenueRange);
  }, [revenueRange]);

  const NavButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`admin-nav-btn ${activeTab === id ? 'active' : ''}`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="admin-dashboard-wrapper">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <BarChart3 color="#ff4b2b" size={32} />
          <span>Admin Panel</span>
        </div>

        <nav className="admin-nav">
          <NavButton id="overview" label="Overview" icon={BarChart3} />
          <NavButton id="restaurants" label="Restaurants" icon={Store} />
          <NavButton id="users" label="Users" icon={Users} />
          <NavButton id="orders" label="Orders" icon={ClipboardList} />
        </nav>

        <div className="stat-card" style={{ padding: '20px', marginTop: 'auto' }}>
          <p style={{ fontSize: '0.8rem', color: '#636e72' }}>System Status</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '5px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6ab04c' }}></div>
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>All Systems Live</span>
          </div>
        </div>
      </aside>

      <div className="admin-main-wrapper">
        <header className="admin-main-header" style={navbarStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Admin Panel</h2>
            <div style={{ padding: '4px 12px', background: '#f1f2f6', borderRadius: '20px', fontSize: '0.8rem', color: '#636e72', fontWeight: 600 }}>
              Platform Admin
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <button 
              onClick={() => navigate('/')}
              style={navLinkStyle}
            >
              <Globe size={18} /> View Website
            </button>
            <button 
              onClick={() => navigate('/profile')}
              style={navLinkStyle}
            >
              <User size={18} /> Profile
            </button>
            <button 
              onClick={handleLogout}
              style={logoutBtnStyle}
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </header>

        <div className="admin-scroll-content">
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
              <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #ff4b2b', borderRadius: '50%' }}></div>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && stats && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                  <div className="stats-grid">
                    <StatCard title="Total Users" value={stats.usersCount} icon={Users} color="#4f46e5" />
                    <StatCard title="Restaurants" value={stats.restaurantsCount} icon={Store} color="#0891b2" />
                    <StatCard title="Orders" value={stats.totalOrders} icon={ShoppingCart} color="#059669" />
                    <StatCard title="Revenue" value={`₹${stats.totalRevenue}`} icon={DollarSign} color="#d97706" />
                  </div>

                  <div style={{ background: '#fff', borderRadius: '24px', padding: '10px' }}>
                    <RevenueChart
                      data={stats.revenueData || []}
                      currentRange={revenueRange}
                      onRangeChange={setRevenueRange}
                      title="Platform Revenue Trend"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'restaurants' && <RestaurantManager />}
              {activeTab === 'users' && <UserManager />}
              {activeTab === 'orders' && <OrderManager />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="stat-card">
    <div className="stat-icon-wrapper" style={{ backgroundColor: `${color}15` }}>
      <Icon size={24} color={color} />
    </div>
    <div className="stat-info">
      <h3>{title}</h3>
      <p className="stat-value">{value}</p>
    </div>
  </div>
);

// Placeholder Components for now
const RestaurantManager = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRestaurants = async () => {
    try {
      const { data } = await api.get('/admin/restaurants');
      setRestaurants(data.restaurants);
    } catch (error) {
      toast.error('Failed to fetch restaurants');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/restaurant/${id}`, { status });
      toast.success(`Restaurant ${status} successfully`);
      fetchRestaurants();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  if (loading) return <div className="text-center py-10 text-gray-500">Loading restaurants...</div>;

  return (
    <div className="management-card">
      <div className="card-header">
        <span className="count-badge">{restaurants.length} Total Restaurants</span>
      </div>
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Restaurant</th>
              <th>Owner</th>
              <th>Category</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((res) => (
              <tr key={res._id}>
                <td>
                  <div className="res-info">
                    <img src={res.images[0]?.url} alt={res.name} className="res-img" />
                    <span className="res-name">{res.name}</span>
                  </div>
                </td>
                <td>
                  <div className="owner-info">
                    <span className="owner-name">{res.owner?.name}</span>
                    <span className="owner-email">{res.owner?.email}</span>
                  </div>
                </td>
                <td>{res.category}</td>
                <td>
                  <span className={`status-badge ${res.status}`}>
                    {res.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    {res.status !== 'approved' && (
                      <button
                        onClick={() => updateStatus(res._id, 'approved')}
                        className="action-btn approve"
                        title="Approve"
                      >
                        <CheckCircle size={18} />
                      </button>
                    )}
                    {res.status !== 'rejected' && (
                      <button
                        onClick={() => updateStatus(res._id, 'rejected')}
                        className="action-btn reject"
                        title="Reject"
                      >
                        <XCircle size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data.users);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <div className="text-center py-10 text-gray-500">Loading users...</div>;

  return (
    <div className="management-card">
      <div className="card-header">
        <span className="count-badge text-purple-600 bg-purple-100">{users.length} Active Users</span>
      </div>
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td className="font-medium">{u.name}</td>
                <td className="text-sm">{u.email}</td>
                <td>
                  <span className={`status-badge ${u.role}`}>
                    {u.role}
                  </span>
                </td>
                <td className="text-sm text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [restaurantFilter, setRestaurantFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/admin/orders');
      setOrders(data.orders || []);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <div className="text-center py-10 text-gray-500">Loading orders...</div>;

  const filteredOrders = orders.filter((order) => {
    const userMatch = 
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const restaurantMatch = 
      !restaurantFilter || order.orderItems?.[0]?.restaurant?.name?.toLowerCase().includes(restaurantFilter.toLowerCase());

    const dateMatch = 
      !dateFilter || new Date(order.createdAt).toISOString().split('T')[0] === dateFilter;

    return userMatch && restaurantMatch && dateMatch;
  });

  return (
    <div className="management-card">
      <div className="card-header" style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <span className="count-badge text-blue-600 bg-blue-100">{filteredOrders.length} Orders</span>
        </div>
        
        <div className="filters-container" style={{ display: 'flex', gap: '15px', width: '100%', flexWrap: 'wrap' }}>
          <div className="filter-group" style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ fontSize: '0.8rem', color: '#636e72', marginBottom: '5px', display: 'block' }}>Search User</label>
            <input 
              type="text" 
              placeholder="Name or Email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '8px' }}
            />
          </div>
          <div className="filter-group" style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ fontSize: '0.8rem', color: '#636e72', marginBottom: '5px', display: 'block' }}>Restaurant</label>
            <input 
              type="text" 
              placeholder="Restaurant Name..." 
              value={restaurantFilter}
              onChange={(e) => setRestaurantFilter(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '8px' }}
            />
          </div>
          <div className="filter-group" style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ fontSize: '0.8rem', color: '#636e72', marginBottom: '5px', display: 'block' }}>Date</label>
            <input 
              type="date" 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '8px' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button 
              onClick={() => { setSearchTerm(''); setRestaurantFilter(''); setDateFilter(''); }}
              style={{ padding: '8px 16px', background: '#f1f2f6', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#2d3436' }}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>User</th>
              <th>Restaurant</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-400">No orders found matching filters.</td>
              </tr>
            ) : filteredOrders.map((o) => (
              <tr key={o._id}>
                <td className="text-xs text-gray-500 font-mono">{o._id.substring(0, 8)}...</td>
                <td className="text-sm">{new Date(o.createdAt).toLocaleString()}</td>
                <td>
                  <div className="font-medium">{o.user?.name}</div>
                  <div className="text-xs text-gray-400">{o.user?.email}</div>
                </td>
                <td className="text-sm font-medium">{o.orderItems?.[0]?.restaurant?.name}</td>
                <td className="font-medium">₹{o.totalPrice}</td>
                <td>
                  <span className={`status-badge ${o.orderStatus?.toLowerCase().replace(' ', '-')}`}>
                    {o.orderStatus}
                  </span>
                </td>
                <td>
                  <button 
                    onClick={() => { setSelectedOrder(o); setShowModal(true); }}
                    className="action-btn approve"
                    title="View Details"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder} 
          onClose={() => { setShowModal(false); setSelectedOrder(null); }} 
        />
      )}
    </div>
  );
};

const OrderDetailsModal = ({ order, onClose }) => {
  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal-content">
        <div className="modal-header">
          <h3>Order Details: <span className="text-gray-400">#{order._id.substring(0, 8)}</span></h3>
          <button className="close-modal-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="details-grid">
            <div className="detail-item">
              <label>Date</label>
              <p>{new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <div className="detail-item">
              <label>Customer</label>
              <p>{order.user?.name}</p>
              <span className="text-xs text-gray-500">{order.user?.email}</span>
            </div>
            <div className="detail-item">
              <label>Restaurant</label>
              <p>{order.orderItems?.[0]?.restaurant?.name || 'N/A'}</p>
            </div>
            <div className="detail-item">
              <label>Status</label>
              <span className={`status-badge ${order.orderStatus?.toLowerCase().replace(' ', '-')}`}>
                {order.orderStatus}
              </span>
            </div>
          </div>

          <div className="order-items-section">
            <h4>Items Ordered</h4>
            <div className="items-list">
              {order.orderItems?.map((item, idx) => (
                <div key={idx} className="item-row">
                  <span className="item-name">{item.name}</span>
                  <span className="item-qty">x{item.quantity}</span>
                  <span className="item-price">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="order-summary-section">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{order.itemsPrice}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee</span>
              <span>₹{order.deliveryPrice}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{order.totalPrice}</span>
            </div>
          </div>

          <div className="delivery-address-section">
            <h4>Delivery Address</h4>
            <p>{order.shippingInfo?.address}, {order.shippingInfo?.city}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const navbarStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '15px 40px',
  background: '#fff',
  borderBottom: '1px solid #edf2f7',
  position: 'sticky',
  top: 0,
  zIndex: 10
};

const navLinkStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  background: 'none',
  border: 'none',
  color: '#2d3436',
  fontWeight: 600,
  fontSize: '0.95rem',
  cursor: 'pointer',
  padding: '8px 12px',
  borderRadius: '8px',
  transition: 'all 0.2s'
};

const logoutBtnStyle = {
  ...navLinkStyle,
  background: '#ff4b2b',
  color: '#fff',
  padding: '10px 18px',
};

export default AdminPanel;
