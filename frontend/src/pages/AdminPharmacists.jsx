import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Building2, CheckCircle, XCircle, UserPlus, ShieldAlert, MapPin, Phone, Mail, X } from 'lucide-react';

const AdminPharmacists = () => {
  const [pharmacists, setPharmacists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending'); // 'all', 'pending', 'approved', 'rejected'
  const [msg, setMsg] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    shopName: '',
    location: '',
    phone: '',
    address: ''
  });

  const fetchPharmacists = async () => {
    setLoading(true);
    try {
      const res = await API.get('/users/pharmacists');
      if (res.data.success) {
        setPharmacists(res.data.pharmacists);
      }
    } catch (err) {
      console.error('Error fetching pharmacists:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPharmacists();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      const res = await API.patch(`/users/${id}/status`, { status });
      if (res.data.success) {
        setMsg(`Pharmacist registration status updated to "${status.toUpperCase()}".`);
        fetchPharmacists();
        setTimeout(() => setMsg(''), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
    }
  };

  const handleAddPharmacist = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/users/pharmacist', formData);
      if (res.data.success) {
        setMsg('New Pharmacist account added directly by Admin.');
        setShowAddModal(false);
        fetchPharmacists();
        setTimeout(() => setMsg(''), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add pharmacist.');
    }
  };

  const filteredPharmacists = pharmacists.filter((p) => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Building2 size={28} color="var(--primary)" /> Pharmacist Approval Management
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
            Review pending pharmacist registrations and manage system approvals.
          </p>
        </div>

        <button onClick={() => setShowAddModal(true)} className="btn btn-primary" style={{ padding: '12px 20px' }}>
          <UserPlus size={18} /> Add Pharmacist
        </button>
      </div>

      {msg && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7', padding: '12px 20px', borderRadius: 'var(--radius-md)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle size={20} /> <span>{msg}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        {['pending', 'approved', 'rejected', 'all'].map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`btn ${filter === st ? 'btn-primary' : 'btn-secondary'}`}
            style={{ textTransform: 'capitalize', padding: '8px 18px' }}
          >
            {st} ({pharmacists.filter((p) => st === 'all' || p.status === st).length})
          </button>
        ))}
      </div>

      {/* Pharmacists List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>Loading pharmacists...</div>
      ) : filteredPharmacists.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px' }}>
          <ShieldAlert size={48} style={{ color: 'var(--text-dim)', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>No {filter} Pharmacists Found</h3>
          <p style={{ color: 'var(--text-muted)' }}>No pharmacist registrations match the selected status filter.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {filteredPharmacists.map((pharm) => (
            <div key={pharm._id} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{pharm.shopName || pharm.name}</h3>
                  <span className={`badge badge-${pharm.status === 'approved' ? 'approved' : pharm.status === 'pending' ? 'pending' : 'rejected'}`}>
                    {pharm.status}
                  </span>
                </div>

                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Mail size={14} color="var(--primary)" /> {pharm.email}
                  </div>
                  {pharm.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={14} color="var(--primary)" /> {pharm.phone}
                    </div>
                  )}
                  {pharm.location && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={14} color="var(--primary)" /> {pharm.location} ({pharm.address || 'Address on file'})
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                <button
                  onClick={() => handleStatusUpdate(pharm._id, 'approved')}
                  disabled={pharm.status === 'approved'}
                  className="btn btn-success"
                  style={{ padding: '8px' }}
                >
                  <CheckCircle size={16} /> Approve
                </button>

                <button
                  onClick={() => handleStatusUpdate(pharm._id, 'rejected')}
                  disabled={pharm.status === 'rejected'}
                  className="btn btn-danger"
                  style={{ padding: '8px' }}
                >
                  <XCircle size={16} /> Reject
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Add Pharmacist Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Admin Add Pharmacist</h3>
              <button onClick={() => setShowAddModal(false)} className="btn btn-secondary" style={{ padding: '6px' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleAddPharmacist}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-input" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="form-input" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input type="password" className="form-input" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Shop / Pharmacy Name</label>
                <input type="text" className="form-input" required value={formData.shopName} onChange={(e) => setFormData({ ...formData, shopName: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Location / City</label>
                <input type="text" className="form-input" required value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary" style={{ flexGrow: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flexGrow: 1 }}>Create Pharmacist</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPharmacists;
