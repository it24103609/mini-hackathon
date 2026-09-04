import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Pill, Building2, MapPin, Phone, Calendar, ArrowLeft, ShoppingCart, CheckCircle } from 'lucide-react';

const MedicineDetails = () => {
  const { id } = useParams();
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [notice, setNotice] = useState('');

  const { user, addToCart } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        const res = await API.get(`/medicines/${id}`);
        if (res.data.success) {
          setMedicine(res.data.medicine);
        }
      } catch (error) {
        console.error('Error fetching medicine details:', error);
      }
      setLoading(false);
    };

    fetchMedicine();
  }, [id]);

  const handleAddToCart = () => {
    if (medicine) {
      addToCart(medicine, Number(quantity));
      setNotice(`Added ${quantity} unit(s) of ${medicine.medicineName} to cart.`);
      setTimeout(() => setNotice(''), 3000);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-muted)' }}>Loading medicine details...</div>;
  }

  if (!medicine) {
    return (
      <div className="glass-panel" style={{ maxWidth: '600px', margin: '40px auto', padding: '40px', textAlign: 'center' }}>
        <h2>Medicine Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>The requested medicine does not exist or has been removed.</p>
        <Link to="/" className="btn btn-secondary" style={{ marginTop: '20px' }}>
          <ArrowLeft size={16} /> Back to Search
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>
      
      <Link to="/" className="btn btn-secondary" style={{ marginBottom: '24px' }}>
        <ArrowLeft size={16} /> Back to Search
      </Link>

      {notice && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#6ee7b7',
          padding: '12px 20px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <CheckCircle size={20} />
          <span>{notice}</span>
        </div>
      )}

      <div className="glass-panel" style={{ padding: '36px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '36px' }}>
        
        {/* Medicine Image */}
        <div style={{
          width: '100%',
          height: '320px',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          background: 'rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {medicine.imageUrl ? (
            <img src={medicine.imageUrl} alt={medicine.medicineName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <Pill size={80} color="var(--primary)" style={{ opacity: 0.4 }} />
          )}
        </div>

        {/* Details */}
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {medicine.category}
          </span>

          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '8px 0 12px' }}>
            {medicine.medicineName}
          </h1>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
            <span className={`badge badge-${medicine.availability === 'Available' ? 'available' : medicine.availability === 'Low Stock' ? 'lowstock' : 'outstock'}`}>
              {medicine.availability} ({medicine.quantity} remaining)
            </span>
          </div>

          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '20px' }}>
            LKR {medicine.price.toLocaleString()}
          </div>

          <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '24px' }}>
            {medicine.description || 'No detailed description specified for this medicine.'}
          </p>

          {/* Expiry Date */}
          {medicine.expiryDate && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
              <Calendar size={16} color="var(--primary)" />
              <span>Expiry Date: {new Date(medicine.expiryDate).toLocaleDateString()}</span>
            </div>
          )}

          {/* Pharmacy Info Box */}
          {medicine.pharmacyId && (
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '16px', marginBottom: '24px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Building2 size={16} color="var(--primary)" /> PHARMACY PROVIDER
              </div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{medicine.pharmacyId.shopName || medicine.pharmacyId.name}</div>
              {medicine.pharmacyId.location && (
                <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <MapPin size={14} /> {medicine.pharmacyId.location} ({medicine.pharmacyId.address || 'Address on file'})
                </div>
              )}
              {medicine.pharmacyId.phone && (
                <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <Phone size={14} /> {medicine.pharmacyId.phone}
                </div>
              )}
            </div>
          )}

          {/* Add to Cart Actions */}
          {(!user || user.role === 'patient') && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input
                type="number"
                min="1"
                max={medicine.quantity}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="form-input"
                style={{ width: '80px', textAlign: 'center' }}
                disabled={medicine.quantity === 0}
              />
              <button
                onClick={handleAddToCart}
                disabled={medicine.quantity === 0}
                className="btn btn-primary"
                style={{ padding: '12px 24px', flexGrow: 1 }}
              >
                <ShoppingCart size={18} /> Add to Shopping Cart
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default MedicineDetails;
