import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';

// Pages
import BrowseMedicines from './pages/BrowseMedicines';
import MedicineDetails from './pages/MedicineDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import CartScreen from './pages/CartScreen';
import OrderHistory from './pages/OrderHistory';
import PharmacistDashboard from './pages/PharmacistDashboard';
import PharmacistOrders from './pages/PharmacistOrders';
import AdminPharmacists from './pages/AdminPharmacists';
import AdminUsers from './pages/AdminUsers';
import AdminOrders from './pages/AdminOrders';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <main style={{ flexGrow: 1 }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/medicines" element={<BrowseMedicines />} />
              <Route path="/medicine/:id" element={<MedicineDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Patient Routes */}
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/orders" element={<OrderHistory />} />

              {/* Pharmacist Routes */}
              <Route path="/pharmacist/dashboard" element={<PharmacistDashboard />} />
              <Route path="/pharmacist/orders" element={<PharmacistOrders />} />

              {/* Admin Routes */}
              <Route path="/admin/pharmacists" element={<AdminPharmacists />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
            </Routes>
          </main>

          <footer className="site-footer">
            <div className="footer-inner">
              <div className="footer-brand">
                <div className="footer-logo">MedFind <span>LK</span></div>
                <p>Find the medicine you need,<br />before you visit the pharmacy.</p>
              </div>
              <div className="footer-links">
                <span>Explore</span>
                <Link to="/">Home</Link>
                <Link to="/medicines">Browse Medicines</Link>
              </div>
              <div className="footer-links">
                <span>Account</span>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </div>
              <div className="footer-contact">
                <span>Need help?</span>
                <a href="mailto:hello@medfind.lk">hello@medfind.lk</a>
                <small>Serving communities across Sri Lanka</small>
              </div>
            </div>
            <div className="footer-bottom">© {new Date().getFullYear()} MedFind LK <span>Made for easier healthcare access in Sri Lanka.</span></div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
