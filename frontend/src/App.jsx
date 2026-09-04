import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';

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
              <Route path="/" element={<BrowseMedicines />} />
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

          {/* Footer */}
          <footer style={{ borderTop: '1px solid var(--border-color)', padding: '24px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-dim)', background: 'rgba(11,15,25,0.8)' }}>
            © {new Date().getFullYear()} MedFind LK — Sri Lanka Medicine Availability Finder (MERN Mini-Hackathon Project)
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
