import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Pill, AlertCircle, CheckCircle2, Building, User } from 'lucide-react';

const Register = () => {
  const [role, setRole] = useState('patient'); // 'patient' or 'pharmacist'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    shopName: '',
    location: '',
    phone: '',
    address: ''
  });

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    const res = await register({ ...formData, role });
    setLoading(false);

    if (res.success) {
      if (role === 'pharmacist') {
        setSuccessMsg('Pharmacist registration submitted successfully! Your account status is PENDING admin approval. You can login once approved.');
      } else {
        navigate('/');
      }
    } else {
      setError(res.message);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', padding: '36px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', background: 'var(--primary-gradient)', padding: '12px', borderRadius: '16px', marginBottom: '12px' }}>
            <Pill size={32} color="#0b0f19" />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Create Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Join MedFind LK as a Patient or Pharmacist
          </p>
        </div>

        {/* Role Switcher Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' }}>
          <button
            type="button"
            className={`btn ${role === 'patient' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setRole('patient')}
            style={{ padding: '10px' }}
          >
            <User size={18} /> Patient
          </button>
          <button
            type="button"
            className={`btn ${role === 'pharmacist' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setRole('pharmacist')}
            style={{ padding: '10px' }}
          >
            <Building size={18} /> Pharmacist
          </button>
        </div>

        {error && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: '#fca5a5',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#6ee7b7',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <CheckCircle2 size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 700, marginBottom: '4px' }}>Registration Submitted</div>
              <div>{successMsg}</div>
              <Link to="/login" className="btn btn-secondary" style={{ marginTop: '12px', display: 'inline-flex' }}>
                Go to Login
              </Link>
            </div>
          </div>
        )}

        {!successMsg && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="e.g. user@medfind.lk"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Additional Pharmacist Fields */}
            {role === 'pharmacist' && (
              <>
                <div style={{ padding: '16px', background: 'rgba(0, 210, 255, 0.05)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(0, 210, 255, 0.15)', marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Pharmacy Shop Details
                  </div>

                  <div className="form-group">
                    <label className="form-label">Pharmacy / Shop Name</label>
                    <input
                      type="text"
                      name="shopName"
                      className="form-input"
                      placeholder="e.g. HealthCare Pharmacy"
                      value={formData.shopName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">City / Location</label>
                    <input
                      type="text"
                      name="location"
                      className="form-input"
                      placeholder="e.g. Jaffna"
                      value={formData.location}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      className="form-input"
                      placeholder="e.g. 0771234567"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Full Address</label>
                    <input
                      type="text"
                      name="address"
                      className="form-input"
                      placeholder="e.g. No. 45, Hospital Road, Jaffna"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '12px', fontSize: '1rem', marginTop: '8px' }}
            >
              <UserPlus size={18} />
              {loading ? 'Creating Account...' : `Register as ${role === 'pharmacist' ? 'Pharmacist' : 'Patient'}`}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 700 }}>
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
