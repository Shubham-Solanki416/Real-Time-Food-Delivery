import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Edit2, Trash2, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';
// Assuming there's a map picker component from checkout we can reuse or build here. For simplicity, basic form first, map can be integrated similarly.
// import AddressMap from '../checkout/AddressMap'; 

const SavedAddresses = ({ user }) => {
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  const resetForm = () => {
    setFormData({ street: '', city: '', state: '', zipCode: '', country: '' });
    setIsAdding(false);
    setEditId(null);
  };

  const handleEdit = (addr) => {
    setFormData({
      street: addr.street,
      city: addr.city,
      state: addr.state,
      zipCode: addr.zipCode,
      country: addr.country,
    });
    setEditId(addr._id);
    setIsAdding(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    
    try {
      const { data } = await api.delete(`/me/address/${id}`);
      setAddresses(data.addresses);
      toast.success("Address deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete address");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        const { data } = await api.put(`/me/address/${editId}`, formData);
        setAddresses(data.addresses);
        toast.success("Address updated");
      } else {
        const { data } = await api.post('/me/address', formData);
        setAddresses(data.addresses);
        toast.success("Address added");
      }
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  if (isAdding) {
    return (
      <div>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={20} color="#ff4b2b" />
          {editId ? 'Edit Address' : 'Add New Address'}
        </h3>
        <form onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Street Address</label>
            <input type="text" value={formData.street} onChange={(e) => setFormData({...formData, street: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #dfe6e9' }} required />
          </div>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>City</label>
              <input type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #dfe6e9' }} required />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>State</label>
              <input type="text" value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #dfe6e9' }} required />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Zip Code</label>
              <input type="text" value={formData.zipCode} onChange={(e) => setFormData({...formData, zipCode: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #dfe6e9' }} required />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Country</label>
              <input type="text" value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #dfe6e9' }} required />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="button" onClick={resetForm} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #dfe6e9', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
            <button type="submit" disabled={loading} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#ff4b2b', color: 'white', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              {loading && <Loader2 size={16} className="spin" />}
              Save Address
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.5rem', margin: 0, color: '#2d3436' }}>Saved Addresses</h3>
        <button 
          onClick={() => setIsAdding(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: 'rgba(255, 75, 43, 0.1)', color: '#ff4b2b', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
        >
          <Plus size={18} /> Add New
        </button>
      </div>

      {addresses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#636e72' }}>
          <MapPin size={48} color="#dfe6e9" style={{ marginBottom: '16px' }} />
          <p>You haven't saved any addresses yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {addresses.map((addr) => (
            <div key={addr._id} style={{ border: '1px solid #dfe6e9', borderRadius: '12px', padding: '20px', position: 'relative' }}>
              {addr.isDefault && (
                <div style={{ position: 'absolute', top: '20px', right: '20px', color: '#00b894', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                  <CheckCircle2 size={16} /> Default
                </div>
              )}
              <h4 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', color: '#2d3436', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={18} color="#636e72" />
                Delivery Address
              </h4>
              <p style={{ margin: '0 0 4px 0', color: '#636e72', lineHeight: 1.5 }}>
                {addr.street}<br/>
                {addr.city}, {addr.state} {addr.zipCode}<br/>
                {addr.country}
              </p>
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button onClick={() => handleEdit(addr)} style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'transparent', border: 'none', color: '#0984e3', cursor: 'pointer', padding: 0, fontSize: '0.9rem', fontWeight: 500 }}>
                  <Edit2 size={14} /> Edit
                </button>
                <div style={{ width: '1px', backgroundColor: '#dfe6e9' }} />
                <button onClick={() => handleDelete(addr._id)} style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'transparent', border: 'none', color: '#d63031', cursor: 'pointer', padding: 0, fontSize: '0.9rem', fontWeight: 500 }}>
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedAddresses;
