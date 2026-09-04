import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  MapPin, 
  Filter, 
  Pill, 
  ShoppingCart, 
  Building2, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Eye
} from 'lucide-react';

const BrowseMedicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [availability, setAvailability] = useState('');

  const { user, addToCart } = useAuth();
  const [addedNotice, setAddedNotice] = useState('');

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (location) params.append('location', location);
      if (availability) params.append('availability', availability);

      const res = await API.get(`/medicines?${params.toString()}`);
      if (res.data.success) {
        setMedicines(res.data.medicines);
      }
    } catch (error) {
      console.error('Error fetching medicines:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchMedicines();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, category, location, availability]);

  const handleAddToCart = (med) => {
    addToCart(med, 1);
    setAddedNotice(`Added ${med.medicineName} to cart!`);
    setTimeout(() => setAddedNotice(''), 3000);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
      
      {/* Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '10px' }}>
          Find Medicines Across Sri Lanka
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Search real-time stock availability, prices, and locations at registered pharmacies near you.
        </p>
      </div>

      {/* Added to Cart Notification Toast */}
      {addedNotice && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#10b981',
          color: '#0b0f19',
          fontWeight: 700,
          padding: '12px 24px',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle size={20} /> {addedNotice}
        </div>
      )}

      {/* Filter & Search Bar Panel */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          
          {/* Search by Name */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Medicine Search</label>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-dim)' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '40px' }}
                placeholder="e.g. Paracetamol, Amoxicillin"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Location Filter */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">City / Location</label>
            <div style={{ position: 'relative' }}>
              <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-dim)' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '40px' }}
                placeholder="e.g. Jaffna, Colombo"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Pain Relief">Pain Relief</option>
              <option value="Antibiotics">Antibiotics</option>
              <option value="Vitamins">Vitamins & Supplements</option>
              <option value="First Aid">First Aid</option>
              <option value="Diabetes">Diabetes</option>
              <option value="Cardiology">Cardiology</option>
            </select>
          </div>

          {/* Availability Filter */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Availability Stock</label>
            <select
              className="form-select"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
            >
              <option value="">All Stock Levels</option>
              <option value="Available">Available (&gt; 10)</option>
              <option value="Low Stock">Low Stock (1–10)</option>
              <option value="Out of Stock">Out of Stock (0)</option>
            </select>
          </div>

        </div>
      </div>

      {/* Medicines Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          Loading medicine stock availability...
        </div>
      ) : medicines.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px' }}>
          <Pill size={48} style={{ color: 'var(--text-dim)', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>No Medicines Found</h3>
          <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search term, location, or category filters.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {medicines.map((med) => {
            const badgeClass =
              med.availability === 'Available'
                ? 'badge-available'
                : med.availability === 'Low Stock'
                ? 'badge-lowstock'
                : 'badge-outstock';

            return (
              <div key={med._id} className="glass-panel glass-panel-interactive" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                
                <div>
                  {/* Image Preview / Placeholder */}
                  <div style={{
                    width: '100%',
                    height: '160px',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    marginBottom: '16px',
                    background: 'rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {med.imageUrl ? (
                      <img
                        src={med.imageUrl}
                        alt={med.medicineName}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <Pill size={48} style={{ color: 'var(--primary)', opacity: 0.5 }} />
                    )}
                  </div>

                  {/* Header & Badges */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                      {med.category}
                    </span>
                    <span className={`badge ${badgeClass}`}>
                      {med.availability} ({med.quantity})
                    </span>
                  </div>

                  {/* Medicine Name */}
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>
                    {med.medicineName}
                  </h3>

                  {/* Description */}
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {med.description || 'No description provided.'}
                  </p>

                  {/* Pharmacy Details */}
                  {med.pharmacyId && (
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px', background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '8px' }}>
                      <Building2 size={14} color="var(--primary)" />
                      <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{med.pharmacyId.shopName || med.pharmacyId.name}</span>
                      <span>({med.location || med.pharmacyId.location || 'N/A'})</span>
                    </div>
                  )}
                </div>

                {/* Price & Action */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Price per unit</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>
                      LKR {med.price.toLocaleString()}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Link to={`/medicine/${med._id}`} className="btn btn-secondary" style={{ padding: '8px 12px' }} title="View details">
                      <Eye size={16} />
                    </Link>

                    {/* Patient Add to Cart */}
                    {(!user || user.role === 'patient') && (
                      <button
                        onClick={() => handleAddToCart(med)}
                        disabled={med.quantity === 0}
                        className="btn btn-primary"
                        style={{ padding: '8px 14px' }}
                      >
                        <ShoppingCart size={16} /> Add
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default BrowseMedicines;
