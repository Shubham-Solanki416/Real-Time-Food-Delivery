import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { 
  BarChart3, 
  Utensils, 
  ShoppingBag, 
  Plus, 
  Edit, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  ChefHat,
  Package,
  Truck,
  Loader2,
  Image as ImageIcon,
  XCircle,
  MapPin,
  Timer,
  Store,
  DollarSign,
  User,
  LogOut,
  Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import io from 'socket.io-client';
import { RevenueChart, PopularItemsChart } from '../components/AnalyticsCharts';

const RestaurantDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [analytics, setAnalytics] = useState(null);
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

  // Fetch Restaurant & Data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const { data: restData } = await api.get('/manager/my-restaurant');
      setRestaurant(restData.restaurant);

      const [menuRes, ordersRes, analyticsRes] = await Promise.all([
        api.get(`/restaurant/${restData.restaurant._id}/menu`),
        api.get(`/restaurant/${restData.restaurant._id}/orders`),
        api.get(`/manager/analytics?range=${revenueRange}`)
      ]);

      setFoods(menuRes.data.foods);
      setOrders(ordersRes.data.orders.reverse());
      setAnalytics(analyticsRes.data);

    } catch (error) {
      if (error.response?.status === 404) {
        setRestaurant(null);
      } else {
        toast.error('Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [revenueRange]);

  // Socket setup for real-time updates
  useEffect(() => {
    if (user) {
      const newSocket = io('http://localhost:4000');
      setSocket(newSocket);
      newSocket.emit('setup', user);
      
      // Listen for order updates if needed
      return () => newSocket.disconnect();
    }
  }, [user]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      const { data } = await api.put(`/order/${orderId}/status`, { status: newStatus });
      setOrders(prev => prev.map(o => o._id === orderId ? data.order : o));
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  const deleteFood = async (id) => {
    if (!window.confirm('Are you sure you want to delete this dish?')) return;
    try {
      await api.delete(`/food/${id}`);
      setFoods(prev => prev.filter(f => f._id !== id));
      toast.success('Dish deleted');
    } catch (error) {
      toast.error('Failed to delete dish');
    }
  };

  const handleFoodSubmit = async (formData) => {
    try {
      if (editingFood) {
        const { data } = await api.put(`/food/${editingFood._id}`, formData);
        setFoods(prev => prev.map(f => f._id === editingFood._id ? data.food : f));
        toast.success('Dish updated successfully');
      } else {
        const { data } = await api.post('/food/new', { ...formData, restaurant: restaurant._id });
        setFoods(prev => [...prev, data.food]);
        toast.success('New dish added');
      }
      setIsModalOpen(false);
      setEditingFood(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const openEditModal = (food) => {
    setEditingFood(food);
    setIsModalOpen(true);
  };

  const NavButton = ({ id, label, icon: Icon, activeTab, onClick, badge }) => (
    <button
      onClick={() => onClick(id)}
      className={`admin-nav-btn ${activeTab === id ? 'active' : ''}`}
      style={{ position: 'relative' }}
    >
      <Icon size={20} />
      <span>{label}</span>
      {badge > 0 && (
        <span style={{
          position: 'absolute',
          right: '20px',
          background: '#ff4b2b',
          color: '#fff',
          fontSize: '0.7rem',
          padding: '2px 6px',
          borderRadius: '10px',
          fontWeight: 800
        }}>{badge}</span>
      )}
    </button>
  );

  if (loading) return (
    <div style={fullPageStatusStyle}>
      <Loader2 className="animate-spin" size={48} color="#ff4b2b" />
    </div>
  );

  if (!restaurant) {
    return <RegisterRestaurant onCreated={(data) => setRestaurant(data)} />;
  }

  if (restaurant.status === 'pending') {
    return (
      <div style={pendingWrapperStyle}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={pendingCardStyle}
        >
          <Clock size={64} color="#f1c40f" />
          <h2 style={{ margin: '20px 0 10px', fontSize: '1.8rem' }}>Registration Pending</h2>
          <p style={{ color: '#636e72', fontSize: '1.1rem', maxWidth: '400px', textAlign: 'center' }}>
            Your restaurant <strong>"{restaurant.name}"</strong> is currently under review by our team. 
            Once approved, you'll gain access to your full dashboard.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            style={{ ...primaryBtnStyle, marginTop: '30px', padding: '12px 30px' }}
          >
            Check Status
          </button>
        </motion.div>
      </div>
    );
  }

  if (restaurant.status === 'rejected') {
    return (
      <div style={pendingWrapperStyle}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={pendingCardStyle}
        >
          <XCircle size={64} color="#e74c3c" />
          <h2 style={{ margin: '20px 0 10px', fontSize: '1.8rem' }}>Registration Rejected</h2>
          <p style={{ color: '#636e72', fontSize: '1.1rem', maxWidth: '400px', textAlign: 'center' }}>
            We're sorry, but your restaurant registration was not approved. 
            Please contact support for more information.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-wrapper">
      <aside className="admin-sidebar" style={{ borderRight: '1px solid #edf2f7' }}>
        <div className="admin-brand">
          <ChefHat color="#ff4b2b" size={32} />
          <span>Manager Panel</span>
        </div>
        
        <nav className="admin-nav">
          <NavButton id="overview" label="Overview" icon={BarChart3} activeTab={activeTab} onClick={setActiveTab} />
          <NavButton id="menu" label="Menu Manager" icon={Utensils} activeTab={activeTab} onClick={setActiveTab} />
          <NavButton id="orders" label="Orders Feed" icon={ShoppingBag} activeTab={activeTab} onClick={setActiveTab} badge={orders.filter(o => o.orderStatus === 'Order Placed').length} />
        </nav>

        <div className="management-card" style={{ padding: '20px', marginTop: 'auto', border: 'none', background: '#f8f9fc' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <img src={restaurant?.images?.[0]?.url} alt={restaurant?.name} style={{ width: '50px', height: '50px', borderRadius: '12px', objectFit: 'cover' }} />
            <div style={{ overflow: 'hidden' }}>
              <h4 style={{ fontSize: '0.9rem', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{restaurant?.name}</h4>
              <p style={{ fontSize: '0.75rem', color: '#636e72', margin: 0 }}>{restaurant?.category}</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="admin-main-wrapper">
        <header className="admin-main-header" style={navbarStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Manager Panel</h2>
            <div style={{ padding: '4px 12px', background: '#f1f2f6', borderRadius: '20px', fontSize: '0.8rem', color: '#636e72', fontWeight: 600 }}>
              {user?.name}
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
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <div style={overviewGridStyle}>
                <StatCard icon={<Package color="#3498db" />} label="Total Orders" value={analytics?.totalOrders || 0} />
                <StatCard icon={<Utensils color="#2ecc71" />} label="Menu Items" value={foods.length} />
                <StatCard icon={<DollarSign color="#f1c40f" />} label="Total Revenue" value={`₹${analytics?.totalRevenue || 0}`} />
                <StatCard icon={<CheckCircle2 color="#e74c3c" />} label="Completed Orders" value={orders.filter(o => o.orderStatus === 'Delivered').length} />
              </div>

              <div style={chartsGridStyle}>
                <RevenueChart 
                  data={analytics?.revenueData || []} 
                  currentRange={revenueRange}
                  onRangeChange={setRevenueRange}
                />
                <PopularItemsChart data={analytics?.popularItems || []} />
              </div>
            </div>
          )}

          {activeTab === 'menu' && (
            <div className="management-card" style={{ padding: '0' }}>
              <div className="card-header">
                <span className="count-badge">{foods.length} Dishes</span>
                <button onClick={() => setIsModalOpen(true)} style={primaryBtnStyle}>
                  <Plus size={18} /> Add New Dish
                </button>
              </div>

              <div style={menuTableStyle}>
                <header style={tableHeaderStyle}>
                  <span>Dish</span>
                  <span>Category</span>
                  <span>Price</span>
                  <span>Status</span>
                  <span>Actions</span>
                </header>
                {foods.map(food => (
                  <div key={food._id} style={tableRowStyle}>
                    <div style={foodCellStyle}>
                      <img src={food.images?.[0]?.url} alt={food.name} style={tableFoodImgStyle} />
                      <div>
                        <strong>{food.name}</strong>
                        <p style={tableSubtextStyle}>{food.description.substring(0, 40)}...</p>
                      </div>
                    </div>
                    <span>{food.category}</span>
                    <span style={{ fontWeight: 700 }}>₹{food.price}</span>
                    <span style={food.isAvailable ? activeStatusLabelStyle : inactiveStatusLabelStyle}>
                      {food.isAvailable ? 'Available' : 'Sold Out'}
                    </span>
                    <div style={actionGroupStyle}>
                      <button onClick={() => openEditModal(food)} style={iconBtnStyle} title="Edit"><Edit size={16} /></button>
                      <button onClick={() => deleteFood(food._id)} style={{ ...iconBtnStyle, color: '#e74c3c' }} title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div style={ordersSectionStyle}>
              <div style={ordersFeedStyle}>
                {orders.map(order => (
                  <div key={order._id} style={orderCardStyle}>
                    <div style={orderHeaderStyle}>
                      <div>
                        <span style={orderIdStyle}>#{order._id.slice(-6)}</span>
                        <span style={orderTimeStyle}>{new Date(order.createdAt).toLocaleTimeString()}</span>
                      </div>
                      <span style={getStatusBadgeStyle(order.orderStatus)}>{order.orderStatus}</span>
                    </div>

                    <div style={orderBodyStyle}>
                      <div style={orderItemsListStyle}>
                        {order.orderItems.map((item, i) => (
                          <div key={i} style={orderItemRowStyle}>
                            <span style={itemQtyStyle}>{item.quantity}x</span>
                            <span style={itemNameStyle}>{item.name}</span>
                          </div>
                        ))}
                      </div>
                      <div style={orderTotalColStyle}>
                        <span>Total Payable</span>
                        <strong>₹{order.totalPrice}</strong>
                      </div>
                    </div>

                    <div style={orderFooterStyle}>
                        <div style={customerInfoStyle}>
                          <strong>{order.shippingInfo?.city || 'Default City'}</strong>
                          <p>{order.shippingInfo?.phoneNo || 'No Number'}</p>
                        </div>
                       <div style={statusActionBtnGroupStyle}>
                         {order.orderStatus === 'Order Placed' && (
                           <button onClick={() => updateStatus(order._id, 'Preparing')} style={statusActionBtnStyle}>
                             <Clock size={16} /> Mark Preparing
                           </button>
                         )}
                         {order.orderStatus === 'Preparing' && (
                            <button onClick={() => updateStatus(order._id, 'Out for Delivery')} style={{ ...statusActionBtnStyle, background: '#3498db' }}>
                              <Truck size={16} /> Out for Delivery
                            </button>
                         )}
                         {order.orderStatus === 'Out for Delivery' && (
                            <button onClick={() => updateStatus(order._id, 'Delivered')} style={{ ...statusActionBtnStyle, background: '#2ecc71' }}>
                              <CheckCircle2 size={16} /> Mark Delivered
                            </button>
                         )}
                       </div>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && (
                  <div style={emptyOrdersStyle}>
                    <Package size={64} color="#dfe6e9" />
                    <p>No orders yet. Keep up the good work!</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <FoodModal 
            onClose={() => { setIsModalOpen(false); setEditingFood(null); }}
            onSubmit={handleFoodSubmit}
            editData={editingFood}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const FoodModal = ({ onClose, onSubmit, editData }) => {
  const [formData, setFormData] = useState(editData || {
    name: '',
    description: '',
    price: '',
    category: 'Main Course',
    images: [{ public_id: 'temp', url: '' }],
    isAvailable: true
  });
  const [uploading, setUploading] = useState(false);

  const categories = [
    "Starters", "Main Course", "Breads", "Rice", "Chinese", 
    "Pizza", "Burgers", "Snacks", "South Indian", "Desserts", "Beverages"
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setTimeout(() => {
      const mockUrl = URL.createObjectURL(file);
      setFormData({ ...formData, images: [{ public_id: 'uploaded', url: mockUrl }] });
      setUploading(false);
      toast.success('Image uploaded!');
    }, 1500);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={modalOverlayStyle}>
      <motion.div initial={{ y: 50, scale: 0.9 }} animate={{ y: 0, scale: 1 }} exit={{ y: 50, scale: 0.9 }} style={modalContentStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{editData ? 'Edit Dish' : 'Add New Dish'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#636e72' }}>
            <Plus size={24} style={{ transform: 'rotate(45deg)' }} />
          </button>
        </div>
        
        <div style={formGroupStyle}>
          <label style={labelStyle}>Dish Name</label>
          <div style={inputWrapperStyle}>
            <Utensils size={18} style={inputIconStyle} />
            <input 
              type="text" 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              placeholder="e.g. Spicy Chicken Burger" 
              style={modalInputStyle}
            />
          </div>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Description</label>
          <textarea 
            style={{ ...modalInputStyle, minHeight: '80px', padding: '12px 15px' }} 
            value={formData.description} 
            onChange={(e) => setFormData({...formData, description: e.target.value})} 
            placeholder="Describe your dish..." 
          />
        </div>

        <div style={flexRowStyle}>
          <div style={{ ...formGroupStyle, flex: 1 }}>
            <label style={labelStyle}>Price (₹)</label>
            <div style={inputWrapperStyle}>
              <span style={{ position: 'absolute', left: '15px', fontWeight: 700, color: '#2d3436' }}>₹</span>
              <input 
                type="number" 
                value={formData.price} 
                onChange={(e) => setFormData({...formData, price: e.target.value})} 
                placeholder="0.00" 
                style={{ ...modalInputStyle, paddingLeft: '35px' }}
              />
            </div>
          </div>
          <div style={{ ...formGroupStyle, flex: 1 }}>
            <label style={labelStyle}>Category</label>
            <select 
              value={formData.category} 
              onChange={(e) => setFormData({...formData, category: e.target.value})} 
              style={modalSelectStyle}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ ...formGroupStyle, marginBottom: '25px' }}>
          <label style={{ ...labelStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Availability
            <div 
              onClick={() => setFormData(prev => ({ ...prev, isAvailable: !prev.isAvailable }))}
              style={{
                width: '44px',
                height: '24px',
                background: formData.isAvailable ? '#2ecc71' : '#dfe6e9',
                borderRadius: '20px',
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              <div style={{
                width: '18px',
                height: '18px',
                background: '#fff',
                borderRadius: '50%',
                position: 'absolute',
                top: '3px',
                left: formData.isAvailable ? '23px' : '3px',
                transition: 'all 0.3s'
              }} />
            </div>
          </label>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Food Image</label>
          <div style={imageUploadWrapperStyle}>
            {formData.images?.[0]?.url ? (
              <div style={{ position: 'relative' }}>
                <img src={formData.images[0].url} alt="preview" style={imagePreviewStyle} />
                <button 
                  onClick={() => setFormData({...formData, images: [{ public_id: 'temp', url: '' }]})}
                  style={removeImageBtnStyle}
                >
                   <Trash2 size={12} color="#fff" />
                </button>
              </div>
            ) : (
              <label htmlFor="image-upload" style={emptyImagePlaceholderStyle}>
                {uploading ? <Loader2 className="animate-spin" /> : <ImageIcon size={32} color="#b2bec3" />}
                <p style={{ fontSize: '0.7rem', color: '#b2bec3', marginTop: '5px' }}>Add Photo</p>
              </label>
            )}
            <input type="file" id="image-upload" hidden onChange={handleImageUpload} />
            {!formData.images?.[0]?.url && !uploading && (
               <label htmlFor="image-upload" style={uploadBtnStyle}>Select Image</label>
            )}
          </div>
        </div>

        <div style={modalActionRowStyle}>
          <button onClick={onClose} style={cancelBtnStyle}>Discard</button>
          <button 
            onClick={() => onSubmit(formData)} 
            style={{ 
              ...primaryBtnStyle, 
              padding: '14px 30px', 
              fontSize: '1rem',
              background: 'linear-gradient(135deg, #ff4b2b 0%, #ff416c 100%)',
              boxShadow: '0 8px 15px rgba(255, 75, 43, 0.2)'
            }}
          >
            {editData ? 'Update Dish' : 'Publish Dish'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const RegisterRestaurant = ({ onCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Pizza',
    deliveryTime: 30,
    avgPrice: 500,
    images: [{ public_id: 'temp', url: '' }]
  });
  const [loading, setLoading] = useState(false);

  const categories = [
    "Pizza", "Burgers", "Snacks", "South Indian", "Desserts", "Beverages", "Main Course", "Chinese"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/admin/restaurant/new', formData);
      toast.success('Restaurant registration submitted!');
      onCreated(data.restaurant);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={signupWrapperStyle}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={signupCardStyle}
      >
        <div style={brandStyle}>
          <ChefHat color="#ff4b2b" size={32} />
          <span>Register Restaurant</span>
        </div>
        <p style={{ color: '#636e72', marginBottom: '30px' }}>Fill in the details to list your restaurant on Food Express.</p>
        
        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Restaurant Name</label>
            <div style={inputWrapperStyle}>
              <Store size={18} style={inputIconStyle} />
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. The Italian Kitchen"
                style={modalInputStyle}
              />
            </div>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Description</label>
            <textarea 
              required
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Tell customers about your restaurant..."
              style={{ ...modalInputStyle, padding: '12px 15px', minHeight: '80px' }}
            />
          </div>

          <div style={flexRowStyle}>
            <div style={{ ...formGroupStyle, flex: 1 }}>
              <label style={labelStyle}>Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                style={modalSelectStyle}
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div style={{ ...formGroupStyle, flex: 1 }}>
              <label style={labelStyle}>Avg. Price (₹)</label>
              <div style={inputWrapperStyle}>
                <DollarSign size={18} style={inputIconStyle} />
                <input 
                  type="number" 
                  required
                  value={formData.avgPrice}
                  onChange={(e) => setFormData({...formData, avgPrice: e.target.value})}
                  style={modalInputStyle}
                />
              </div>
            </div>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Delivery Time (min)</label>
            <div style={inputWrapperStyle}>
              <Timer size={18} style={inputIconStyle} />
              <input 
                type="number" 
                required
                value={formData.deliveryTime}
                onChange={(e) => setFormData({...formData, deliveryTime: e.target.value})}
                style={modalInputStyle}
              />
            </div>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Restaurant Image URL</label>
            <div style={inputWrapperStyle}>
              <ImageIcon size={18} style={inputIconStyle} />
              <input 
                type="url" 
                required
                value={formData.images[0].url}
                onChange={(e) => setFormData({...formData, images: [{ public_id: 'url', url: e.target.value }]})}
                placeholder="https://images.unsplash.com/..."
                style={modalInputStyle}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} style={{ ...primaryBtnStyle, width: '100%', justifyContent: 'center', marginTop: '10px' }}>
            {loading ? <Loader2 className="animate-spin" /> : 'Submit for Approval'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div style={statCardStyle}>
    <div style={statIconStyle}>{icon}</div>
    <div>
      <p style={{ margin: 0, color: '#636e72', fontSize: '0.85rem' }}>{label}</p>
      <h4 style={{ margin: '4px 0 0 0', fontSize: '1.5rem', fontWeight: 800 }}>{value}</h4>
    </div>
  </div>
);

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

// Styles
const dashboardWrapperStyle = { display: 'flex', height: '100vh', background: '#f8f9fc', overflow: 'hidden' };
const fullPageStatusStyle = { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' };
const sidebarStyle = { width: '280px', background: '#fff', borderRight: '1px solid #edf2f7', padding: '40px 20px', display: 'flex', flexDirection: 'column', gap: '40px' };
const brandStyle = { display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.4rem', fontWeight: 800, color: '#2d3436' };
const navStyle = { display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 };
const navBtnStyle = { display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 20px', borderRadius: '12px', border: 'none', background: 'transparent', color: '#636e72', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' };
const activeNavBtnStyle = { ...navBtnStyle, background: '#fff5f5', color: '#ff4b2b' };
const badgeStyle = { background: '#ff4b2b', color: '#fff', padding: '2px 8px', borderRadius: '20px', fontSize: '0.7rem', marginLeft: 'auto' };
const restaurantInfoCardStyle = { background: '#f8f9fc', borderRadius: '20px', padding: '20px', textAlign: 'center' };
const sidebarRestImgStyle = { width: '60px', height: '60px', borderRadius: '15px', objectFit: 'cover', marginBottom: '12px' };
const mainWrapperStyle = { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' };
const dashboardHeaderStyle = { padding: '30px 40px', background: '#fff', borderBottom: '1px solid #edf2f7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const userHeaderInfoStyle = { color: '#636e72', fontSize: '0.9rem' };
const scrollContentStyle = { padding: '40px', overflowY: 'auto', flex: 1 };
const overviewGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' };
const chartsGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' };
const statCardStyle = { background: '#fff', borderRadius: '24px', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' };
const statIconStyle = { width: '56px', height: '56px', background: '#f8f9fc', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const menuSectionStyle = { background: '#fff', borderRadius: '24px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' };
const sectionActionRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' };
const primaryBtnStyle = { background: '#ff4b2b', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' };
const menuTableStyle = { display: 'flex', flexDirection: 'column' };
const tableHeaderStyle = { display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 120px', padding: '15px 20px', borderBottom: '2px solid #f8f9fc', color: '#b2bec3', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' };
const tableRowStyle = { display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 120px', padding: '20px', alignItems: 'center', borderBottom: '1px solid #f8f9fc' };
const foodCellStyle = { display: 'flex', alignItems: 'center', gap: '15px' };
const tableFoodImgStyle = { width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover' };
const tableSubtextStyle = { margin: '2px 0 0 0', fontSize: '0.8rem', color: '#b2bec3' };
const activeStatusLabelStyle = { color: '#2ecc71', background: '#eafaf1', padding: '6px 12px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 700 };
const inactiveStatusLabelStyle = { ...activeStatusLabelStyle, color: '#e74c3c', background: '#fdeaeb' };
const actionGroupStyle = { display: 'flex', gap: '10px' };
const iconBtnStyle = { background: 'none', border: 'none', color: '#636e72', cursor: 'pointer', padding: '5px' };
const ordersSectionStyle = { maxWidth: '900px' };
const ordersFeedStyle = { display: 'flex', flexDirection: 'column', gap: '20px' };
const orderCardStyle = { background: '#fff', borderRadius: '24px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #edf2f7' };
const orderHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' };
const orderIdStyle = { fontWeight: 800, fontSize: '1.1rem', color: '#2d3436' };
const orderTimeStyle = { marginLeft: '12px', fontSize: '0.85rem', color: '#b2bec3' };
const orderBodyStyle = { display: 'flex', justifyContent: 'space-between', padding: '20px 0', borderTop: '1px solid #f8f9fc', borderBottom: '1px solid #f8f9fc' };
const orderItemsListStyle = { display: 'flex', flexDirection: 'column', gap: '8px' };
const orderItemRowStyle = { fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '5px' };
const itemQtyStyle = { fontWeight: 700, color: '#ff4b2b' };
const itemNameStyle = { color: '#2d3436', fontWeight: 500 };
const orderTotalColStyle = { textAlign: 'right' };
const orderFooterStyle = { marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const customerInfoStyle = { '& strong': { display: 'block' } };
const statusActionBtnGroupStyle = { display: 'flex', gap: '12px' };
const statusActionBtnStyle = { padding: '12px 20px', background: '#ff4b2b', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' };
const getStatusBadgeStyle = (status) => {
  const styles = {
    'Order Placed': { background: '#fff5f5', color: '#ff4b2b' },
    'Preparing': { background: '#ebf5ff', color: '#3498db' },
    'Out for Delivery': { background: '#fff9db', color: '#f1c40f' },
    'Delivered': { background: '#eafaf1', color: '#2ecc71' }
  };
  const base = {
    padding: '6px 12px',
    borderRadius: '50px',
    fontSize: '0.75rem',
    fontWeight: 700
  };
  return { ...base, ...(styles[status] || styles['Order Placed']) };
};

const emptyOrdersStyle = { textAlign: 'center', padding: '60px', color: '#b2bec3' };

const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' };
const modalContentStyle = { background: '#fff', borderRadius: '28px', width: '100%', maxWidth: '500px', padding: '40px', boxShadow: '0 25px 50px rgba(0,0,0,0.1)', position: 'relative' };
const formGroupStyle = { marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' };
const labelStyle = { fontSize: '0.9rem', fontWeight: 700, color: '#2d3436' };
const inputWrapperStyle = { position: 'relative', display: 'flex', alignItems: 'center' };
const inputIconStyle = { position: 'absolute', left: '15px', color: '#b2bec3' };
const modalInputStyle = { width: '100%', padding: '12px 15px 12px 45px', borderRadius: '12px', border: '1px solid #edf2f7', background: '#f8f9fc', fontSize: '0.95rem', outline: 'none', transition: 'all 0.3s' };
const modalSelectStyle = { width: '100%', padding: '12px 15px', borderRadius: '12px', border: '1px solid #edf2f7', background: '#f8f9fc', fontSize: '0.95rem', outline: 'none', cursor: 'pointer' };
const flexRowStyle = { display: 'flex', gap: '20px' };
const imageUploadWrapperStyle = { display: 'flex', alignItems: 'center', gap: '20px' };
const imagePreviewStyle = { width: '80px', height: '80px', borderRadius: '16px', objectFit: 'cover', border: '2px solid #edf2f7' };
const removeImageBtnStyle = { position: 'absolute', top: '-8px', right: '-8px', background: '#ff4b2b', border: 'none', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' };
const emptyImagePlaceholderStyle = { width: '80px', height: '80px', borderRadius: '16px', background: '#f8f9fc', border: '2px dashed #dfe6e9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' };
const uploadBtnStyle = { padding: '10px 15px', background: '#fff', border: '1px solid #edf2f7', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, color: '#ff4b2b', cursor: 'pointer' };
const modalActionRowStyle = { display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '30px' };
const cancelBtnStyle = { padding: '12px 24px', background: 'none', border: 'none', fontWeight: 700, color: '#636e72', cursor: 'pointer' };

const pendingWrapperStyle = { 
  height: '100vh', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  background: '#f8f9fc',
  padding: '20px'
};

const pendingCardStyle = { 
  background: '#fff', 
  padding: '60px 40px', 
  borderRadius: '32px', 
  boxShadow: '0 20px 50px rgba(0,0,0,0.05)', 
  display: 'flex', 
  flexDirection: 'column', 
  alignItems: 'center',
  maxWidth: '500px'
};

const signupWrapperStyle = {
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  padding: '20px'
};

const signupCardStyle = {
  background: '#fff',
  padding: '40px',
  borderRadius: '24px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  width: '100%',
  maxWidth: '550px'
};

export default RestaurantDashboard;
