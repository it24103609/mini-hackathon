import React, { useState } from 'react';
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
  History,
  Menu,
  X
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, cart } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="glass-panel" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="navbar-container">
        
        {/* Logo */}
        <Link to="/" onClick={closeMenu} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: 'var(--primary-gradient)', padding: '8px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(0,210,255,0.3)' }}>
            <Pill size={22} color="#0b0f19" />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              MedFind LK
            </span>
            <span style={{ display: 'block', fontSize: '0.62rem', color: 'var(--text-dim)', fontWeight: 600, letterSpacing: '0.8px' }}>
              SRI LANKA MEDICINE FINDER
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="navbar-desktop-links">
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

        {/* User Status / Login Buttons (Desktop) */}
        <div className="navbar-desktop-user">
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

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="navbar-mobile-drawer">
          {user && (
            <div style={{ padding: '12px 16px', background: 'rgba(0, 210, 255, 0.08)', borderRadius: 'var(--radius-md)', marginBottom: '12px' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{user.name}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '2px' }}>{user.email}</div>
              <span className={`badge badge-${user.status === 'approved' ? 'approved' : user.status === 'pending' ? 'pending' : 'rejected'}`} style={{ marginTop: '8px' }}>
                {user.role} ({user.status})
              </span>
            </div>
          )}

          <Link to="/medicines" onClick={closeMenu} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
            <Pill size={16} /> Browse Medicines
          </Link>

          {/* Patient Mobile Links */}
          {user && user.role === 'patient' && (
            <>
              <Link to="/cart" onClick={closeMenu} className="btn btn-primary" style={{ width: '100%', justifyContent: 'flex-start' }}>
                <ShoppingCart size={18} /> Cart ({totalCartItems})
              </Link>
              <Link to="/orders" onClick={closeMenu} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
                <History size={16} /> My Orders
              </Link>
            </>
          )}

          {/* Pharmacist Mobile Links */}
          {user && user.role === 'pharmacist' && (
            <>
              <Link to="/pharmacist/dashboard" onClick={closeMenu} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
                <PlusCircle size={16} /> My Medicines
              </Link>
              <Link to="/pharmacist/orders" onClick={closeMenu} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
                <PackageCheck size={16} /> Pharmacy Orders
              </Link>
            </>
          )}

          {/* Admin Mobile Links */}
          {user && user.role === 'admin' && (
            <>
              <Link to="/admin/pharmacists" onClick={closeMenu} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
                <Building2 size={16} /> Pharmacist Approvals
              </Link>
              <Link to="/admin/users" onClick={closeMenu} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
                <Users size={16} /> Manage Users
              </Link>
              <Link to="/admin/orders" onClick={closeMenu} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
                <PackageCheck size={16} /> Monitor Orders
              </Link>
            </>
          )}

          {/* Login/Register or Logout for Mobile */}
          <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {user ? (
              <button onClick={handleLogout} className="btn btn-danger" style={{ width: '100%', justifyContent: 'center' }}>
                <LogOut size={16} /> Logout
              </button>
            ) : (
              <>
                <Link to="/login" onClick={closeMenu} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                  Login
                </Link>
                <Link to="/register" onClick={closeMenu} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
