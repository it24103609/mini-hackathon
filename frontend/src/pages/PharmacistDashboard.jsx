import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, Edit3, Trash2, Pill, AlertTriangle, ShieldAlert, CheckCircle, X, Building2 } from 'lucide-react';

const PharmacistDashboard = () => {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMed, setEditMed] = useState(null);

  const [formData, setFormData] = useState({
    medicineName: '',
    category: 'Pain Relief',
    description: '',
    imageUrl: '',
    price: '',
    quantity: '',
    expiryDate: '',
    location: ''
  });

  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const fetchMyMedicines = async () => {
    setLoading(true);
    try {
      const res = await API.get('/medicines/my');
      if (res.data.success) {
        setMedicines(res.data.medicines);
      }
    } catch (err) {
      console.error('Error fetching pharmacist medicines:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user && user.status === 'approved') {
      fetchMyMedicines();
    } else {
      setLoading(false);
    }
  }, [user]);

  const openAddModal = () => {
    setEditMed(null);
    setFormData({
      medicineName: '',
      category: 'Pain Relief',
      description: '',
      imageUrl: '',
      price: '',
      quantity: '',
      expiryDate: '',
      location: user?.location || ''
    });
    setError('');
    setShowModal(true);
  };

  const openEditModal = (med) => {
    setEditMed(med);
    setFormData({
      medicineName: med.medicineName,
      category: med.category,
      description: med.description || '',
      imageUrl: med.imageUrl || '',
      price: med.price,
      quantity: med.quantity,
      expiryDate: med.expiryDate ? med.expiryDate.split('T')[0] : '',
      location: med.location || ''
    });
    setError('');
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');

    try {
      if (editMed) {
        // Edit existing medicine
        const res = await API.put(`/medicines/${editMed._id}`, formData);
        if (res.data.success) {
          setMsg('Medicine updated successfully.');
          setShowModal(false);
          fetchMyMedicines();
        }
      } else {
        // Add new medicine
        const res = await API.post('/medicines', formData);
        if (res.data.success) {
          setMsg('Medicine added successfully.');
          setShowModal(false);
          fetchMyMedicines();
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save medicine.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this medicine?')) return;
    try {
      const res = await API.delete(`/medicines/${id}`);
      if (res.data.success) {
        setMsg('Medicine deleted successfully.');
        fetchMyMedicines();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete medicine.');
    }
  };

  // If Pharmacist is PENDING approval
  if (user && user.status === 'pending') {
    return (
      <div style={{ maxWidth: '700px', margin: '60px auto', padding: '0 24px' }}>
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', borderColor: 'rgba(245, 158, 11, 0.4)' }}>
          <ShieldAlert size={64} color="#f59e0b" style={{ marginBottom: '16px' }} />
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px' }}>Registration Pending Admin Approval</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '24px' }}>
            Your pharmacist account for <strong style={{ color: 'var(--text-main)' }}>"{user.shopName || user.name}"</strong> has been registered successfully and is currently waiting for system administrator verification.
          </p>
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '16px', borderRadius: 'var(--radius-md)', color: '#fcd34d', fontSize: '0.9rem' }}>
            Once approved by Admin, you will gain full access to upload and manage medicine inventory.
          </div>
        </div>
      </div>
    );
  }

  // If Pharmacist is REJECTED
  if (user && user.status === 'rejected') {
    return (
      <div style={{ maxWidth: '700px', margin: '60px auto', padding: '0 24px' }}>
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', borderColor: 'rgba(244, 63, 94, 0.4)' }}>
          <AlertTriangle size={64} color="#f43f5e" style={{ marginBottom: '16px' }} />
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px' }}>Registration Rejected</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.6' }}>
            Your pharmacist account registration request was rejected by the administrator. Please contact admin support for further assistance.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Building2 size={28} color="var(--primary)" /> Pharmacist Inventory Dashboard
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
            Manage medicines, upload photo URLs, and update live stock quantity for <strong style={{ color: 'var(--text-main)' }}>{user?.shopName || user?.name}</strong>
          </p>
        </div>

        <button onClick={openAddModal} className="btn btn-primary" style={{ padding: '12px 20px' }}>
          <PlusCircle size={18} /> Add New Medicine
        </button>
      </div>

      {msg && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#6ee7b7', padding: '12px 20px', borderRadius: 'var(--radius-md)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle size={20} /> <span>{msg}</span>
        </div>
      )}

      {/* Medicine Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>Loading inventory...</div>
      ) : medicines.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px' }}>
          <Pill size={48} style={{ color: 'var(--text-dim)', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>No Medicines Added Yet</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Add your pharmacy stock to allow patients to find availability.</p>
          <button onClick={openAddModal} className="btn btn-primary">
            <PlusCircle size={18} /> Add First Medicine
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {medicines.map((med) => (
            <div key={med._id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ height: '140px', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'rgba(0,0,0,0.3)', marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {med.imageUrl ? (
                    <img src={med.imageUrl} alt={med.medicineName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Pill size={40} color="var(--primary)" style={{ opacity: 0.5 }} />
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                    {med.category}
                  </span>
                  <span className={`badge badge-${med.availability === 'Available' ? 'available' : med.availability === 'Low Stock' ? 'lowstock' : 'outstock'}`}>
                    {med.availability}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '4px' }}>{med.medicineName}</h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  Stock Quantity: <strong style={{ color: 'var(--text-main)' }}>{med.quantity} units</strong>
                </div>

                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '16px' }}>
                  LKR {med.price.toLocaleString()}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', paddingTop: '14px', borderTop: '1px solid var(--border-color)' }}>
                <button onClick={() => openEditModal(med)} className="btn btn-secondary" style={{ padding: '8px' }}>
                  <Edit3 size={16} /> Edit
                </button>
                <button onClick={() => handleDelete(med._id)} className="btn btn-danger" style={{ padding: '8px' }}>
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '540px', padding: '28px', maxHeight: '90vh', overflowY: 'auto' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>
                {editMed ? 'Edit Medicine Stock' : 'Add New Medicine'}
              </h3>
              <button onClick={() => setShowModal(false)} className="btn btn-secondary" style={{ padding: '6px' }}>
                <X size={18} />
              </button>
            </div>

            {error && (
              <div style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#fca5a5', padding: '10px 14px', borderRadius: 'var(--radius-md)', marginBottom: '16px', fontSize: '0.88rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Medicine Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Paracetamol 500mg"
                  value={formData.medicineName}
                  onChange={(e) => setFormData({ ...formData, medicineName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="Pain Relief">Pain Relief</option>
                  <option value="Antibiotics">Antibiotics</option>
                  <option value="Vitamins">Vitamins & Supplements</option>
                  <option value="First Aid">First Aid</option>
                  <option value="Diabetes">Diabetes</option>
                  <option value="Cardiology">Cardiology</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Price (LKR) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="form-input"
                    placeholder="e.g. 150"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Quantity Stock *</label>
                  <input
                    type="number"
                    min="0"
                    className="form-input"
                    placeholder="e.g. 25"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Medicine Photo URL (Cloudinary / Image Link)</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://res.cloudinary.com/..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">City / Location</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Jaffna"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Expiry Date *</label>
                <input
                  type="date"
                  className="form-input"
                  min={new Date().toISOString().split("T")[0]}
                  value={formData.expiryDate}
                  onClick={(e) => {
                    try {
                      e.target.showPicker();
                    } catch (err) {}
                  }}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  rows="3"
                  placeholder="Usage instructions, dosage info..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary" style={{ flexGrow: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flexGrow: 1 }}>
                  {editMed ? 'Update Medicine' : 'Save Medicine'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default PharmacistDashboard;
