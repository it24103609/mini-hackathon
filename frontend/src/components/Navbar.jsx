import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Pill, 
  ShoppingCart, 
  User, 
  LogOut, 
  ShieldAlert, 
  PlusCircle, 
  PackageCheck, 
  Users, 
  Building2, 
  History 
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, cart } = useAuth();
  const navigate = useNavigate();

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass-panel" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: 'var(--primary-gradient)', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(0,210,255,0.3)' }}>
            <Pill size={24} color="#0b0f19" />
          </div>
          <div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              MedFind LK
            </span>
            <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 600, letterSpacing: '1px' }}>
              SRI LANKA MEDICINE FINDER
            </span>
          </div>
        </Link>

        {/* Dynamic Navigation Links based on Role */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link to="/medicines" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
            Browse Medicines
          </Link>

          {/* Patient Links */}
          {user && user.role === 'patient' && (
            <>
              <Link to="/orders" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
                <History size={16} /> My Orders
              </Link>
              <Link to="/cart" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.88rem', position: 'relative' }}>
                <ShoppingCart size={18} /> Cart
                {totalCartItems > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    background: '#f43f5e',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700
                  }}>
                    {totalCartItems}
                  </span>
                )}
              </Link>
            </>
          )}

          {/* Pharmacist Links */}
          {user && user.role === 'pharmacist' && (
            <>
              <Link to="/pharmacist/dashboard" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
                <PlusCircle size={16} /> My Medicines
              </Link>
              <Link to="/pharmacist/orders" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
                <PackageCheck size={16} /> Pharmacy Orders
              </Link>
            </>
          )}

          {/* Admin Links */}
          {user && user.role === 'admin' && (
            <>
              <Link to="/admin/pharmacists" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
                <Building2 size={16} /> Pharmacist Approvals
              </Link>
              <Link to="/admin/users" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
                <Users size={16} /> Manage Users
              </Link>
              <Link to="/admin/orders" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
                <PackageCheck size={16} /> Monitor Orders
              </Link>
            </>
          )}
        </div>

        {/* User Status / Login Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {user.name}
                </div>
                <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', marginTop: '2px' }}>
                  <span className={`badge badge-${user.status === 'approved' ? 'approved' : user.status === 'pending' ? 'pending' : 'rejected'}`}>
                    {user.role} ({user.status})
                  </span>
                </div>
              </div>
              <button onClick={handleLogout} className="btn btn-danger" title="Logout" style={{ padding: '8px 12px' }}>
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '8px 16px' }}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '8px 16px' }}>
                Register
              </Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
