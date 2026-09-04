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
  Eye,
  RotateCcw,
  Clock,
  ShieldCheck,
  Compass,
  ArrowRight
} from 'lucide-react';

const BrowseMedicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  
  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [availability, setAvailability] = useState('');

  const { user, addToCart } = useAuth();
  const [addedNotice, setAddedNotice] = useState('');

  const fetchMedicines = async () => {
    setLoading(true);
    setApiError(false);
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
      setApiError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchMedicines();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, category, location, availability]);

  const handleClearFilters = () => {
    setSearch('');
    setCategory('');
    setLocation('');
    setAvailability('');
  };

  const handleAddToCart = (med) => {
    addToCart(med, 1);
    setAddedNotice(`Added ${med.medicineName} to cart!`);
    setTimeout(() => setAddedNotice(''), 3000);
  };

  // Find available alternative medicines/pharmacies if some are out of stock
  const availableAlternatives = medicines.filter(m => m.quantity > 0);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
      
      {/* MedFind LK Hackathon Hero Header */}
      <div className="glass-panel hero-panel" style={{
        padding: '48px 32px',
        textAlign: 'center',
        marginBottom: '32px',
        background: 'linear-gradient(135deg, rgba(18, 24, 38, 0.95) 0%, rgba(10, 30, 60, 0.9) 100%)',
        border: '1px solid rgba(0, 210, 255, 0.2)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '20px', background: 'rgba(0, 210, 255, 0.15)', color: 'var(--primary)', fontWeight: 800, fontSize: '0.85rem', marginBottom: '16px', letterSpacing: '1px' }}>
          <Pill size={16} /> MEDFIND LK — SRI LANKA MEDICINE FINDER
        </div>

        <h1 className="hero-heading" style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: '14px', lineHeight: 1.2 }}>
          Find the medicine you need,<br />
          <span style={{ background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            before you visit the pharmacy.
          </span>
        </h1>

        <p className="hero-subtext" style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '680px', margin: '0 auto 28px' }}>
          Search real-time stock availability, compare prices, and locate pharmacies across Sri Lanka.
        </p>

        {/* Quick Location Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '28px' }}>
          <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 600 }}>Quick City Select:</span>
          <select
            className="form-select"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{ maxWidth: '240px', padding: '8px 16px', fontSize: '0.88rem', borderRadius: '20px', background: 'rgba(11, 15, 25, 0.85)' }}
          >
            <option value="">📍 Choose a City...</option>
            <option value="Jaffna">📍 Jaffna</option>
            <option value="Colombo">📍 Colombo</option>
            <option value="Kandy">📍 Kandy</option>
            <option value="Galle">📍 Galle</option>
            <option value="Vavuniya">📍 Vavuniya</option>
            <option value="Batticaloa">📍 Batticaloa</option>
            <option value="Kalmunai">📍 Kalmunai</option>
          </select>
        </div>

        {/* 4 Value Proposition Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-main)', textAlign: 'left' }}>
            <ShieldCheck size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
            <span>Check stock availability before travelling</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-main)', textAlign: 'left' }}>
            <Building2 size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
            <span>Compare nearby pharmacies & prices</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-main)', textAlign: 'left' }}>
            <Clock size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
            <span>Save time searching for medicines</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-main)', textAlign: 'left' }}>
            <Compass size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
            <span>Direct pharmacy contact & location</span>
          </div>
        </div>

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
      <div className="glass-panel" style={{ padding: '20px 16px', marginBottom: '32px' }}>
        <div className="filter-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'end' }}>
          
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

          {/* Location Text Input Filter */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">📍 City / Location</label>
            <div style={{ position: 'relative' }}>
              <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-dim)' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '40px' }}
                placeholder="Type city (e.g. Jaffna, Colombo)"
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

          {/* Clear Filters Button */}
          <div>
            <button
              onClick={handleClearFilters}
              className="btn btn-secondary"
              style={{ width: '100%', padding: '12px', fontSize: '0.88rem' }}
              title="Reset all search filters"
            >
              <RotateCcw size={16} /> Clear Filters
            </button>
          </div>

        </div>
      </div>

      {/* Friendly API Error State */}
      {apiError ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '48px 24px', borderColor: 'rgba(244, 63, 94, 0.4)' }}>
          <AlertTriangle size={54} color="#f43f5e" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>Unable to Load Medicines</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 24px' }}>
            We couldn't connect to the pharmacy database. Please verify your backend connection or try again.
          </p>
          <button onClick={fetchMedicines} className="btn btn-primary">
            <RotateCcw size={16} /> Try Again
          </button>
        </div>
      ) : loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          Searching real-time medicine stock availability...
        </div>
      ) : medicines.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px' }}>
          <Pill size={48} style={{ color: 'var(--text-dim)', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>No Medicines Found</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>No medicines match your search criteria.</p>
          <button onClick={handleClearFilters} className="btn btn-secondary">
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          {/* Alternative Pharmacies Highlight Section if Out of Stock exists */}
          {medicines.some(m => m.quantity === 0) && availableAlternatives.length > 0 && (
            <div className="glass-panel" style={{ padding: '20px 24px', marginBottom: '28px', background: 'rgba(16, 185, 129, 0.08)', borderColor: 'rgba(16, 185, 129, 0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#6ee7b7', fontWeight: 700, fontSize: '0.95rem' }}>
                <CheckCircle size={20} />
                <span>Found {availableAlternatives.length} Available Medicine Alternative(s) at nearby pharmacies!</span>
              </div>
            </div>
          )}

          {/* Medicines Grid */}
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

                    {/* Stock updated indicator */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '12px' }}>
                      <Clock size={12} color="var(--primary)" />
                      <span>Stock status verified recently</span>
                    </div>

                    {/* Description */}
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {med.description || 'No description provided.'}
                    </p>

                    {/* Pharmacy Details */}
                    {med.pharmacyId && (
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px', background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '8px' }}>
                        <Building2 size={14} color="var(--primary)" />
                        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{med.pharmacyId.shopName || med.pharmacyId.name}</span>
                        <span>({med.location || med.pharmacyId.location || 'Sri Lanka'})</span>
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
        </>
      )}

    </div>
  );
};

export default BrowseMedicines;
