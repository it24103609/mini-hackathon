import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

const CartScreen = () => {
  const { cart, updateCartQuantity, removeFromCart, clearCart, getCartTotal, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const grandTotal = getCartTotal();

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (cart.length === 0) return;

    setLoading(true);
    setError('');

    try {
      // Group cart items into API request payload
      const orderItems = cart.map((item) => ({
        medicine: item.medicine._id,
        quantity: item.quantity
      }));

      // Pharmacy reference from first medicine
      const pharmacyId = cart[0].medicine.pharmacyId?._id || cart[0].medicine.pharmacyId;

      const res = await API.post('/orders', {
        items: orderItems,
        pharmacyId
      });

      if (res.data.success) {
        clearCart();
        setSuccess(true);
        setTimeout(() => {
          navigate('/orders');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed. Please try again.');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="glass-panel" style={{ maxWidth: '540px', margin: '60px auto', padding: '40px', textAlign: 'center' }}>
        <CheckCircle2 size={64} color="#10b981" style={{ marginBottom: '16px' }} />
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Order Placed Successfully!</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px', marginBottom: '24px' }}>
          Your order has been recorded and submitted to the pharmacy.
        </p>
        <div style={{ color: 'var(--primary)', fontWeight: 600 }}>Redirecting to your orders...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ShoppingCart size={28} color="var(--primary)" /> Shopping Cart
        </h1>
        <Link to="/" className="btn btn-secondary">
          <ArrowLeft size={16} /> Continue Shopping
        </Link>
      </div>

      {error && (
        <div style={{
          background: 'rgba(244, 63, 94, 0.15)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          color: '#fca5a5',
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {cart.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px' }}>
          <ShoppingCart size={54} style={{ color: 'var(--text-dim)', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>Your Cart is Empty</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Browse available medicines across Sri Lanka and add them to your cart.</p>
          <Link to="/" className="btn btn-primary">
            Find Medicines
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '28px' }}>
          
          {/* Cart Item List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {cart.map((item) => (
              <div key={item.medicine._id} className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '8px',
                    background: 'rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    {item.medicine.imageUrl ? (
                      <img src={item.medicine.imageUrl} alt={item.medicine.medicineName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <ShoppingCart size={24} color="var(--primary)" />
                    )}
                  </div>

                  <div>
                    <h4 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '4px' }}>{item.medicine.medicineName}</h4>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>LKR {item.price.toLocaleString()} per unit</div>
                  </div>
                </div>

                {/* Quantity Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.4)', padding: '4px 8px', borderRadius: '8px' }}>
                    <button
                      onClick={() => updateCartQuantity(item.medicine._id, item.quantity - 1)}
                      className="btn btn-secondary"
                      style={{ padding: '4px 8px' }}
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ fontWeight: 700, padding: '0 8px' }}>{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.medicine._id, item.quantity + 1)}
                      className="btn btn-secondary"
                      style={{ padding: '4px 8px' }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div style={{ width: '110px', textAlign: 'right', fontWeight: 800, color: 'var(--primary)' }}>
                    LKR {(item.price * item.quantity).toLocaleString()}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.medicine._id)}
                    className="btn btn-danger"
                    style={{ padding: '8px' }}
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

              </div>
            ))}
          </div>

          {/* Order Summary Panel */}
          <div className="glass-panel" style={{ padding: '24px', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              Order Summary
            </h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: 'var(--text-muted)' }}>
              <span>Items Total</span>
              <span>LKR {grandTotal.toLocaleString()}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', color: 'var(--text-muted)' }}>
              <span>Delivery / Service</span>
              <span style={{ color: '#10b981', fontWeight: 700 }}>FREE (Pay at Pharmacy)</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 800, paddingTop: '16px', borderTop: '1px solid var(--border-color)', marginBottom: '24px' }}>
              <span>Total Amount</span>
              <span style={{ color: 'var(--primary)' }}>LKR {grandTotal.toLocaleString()}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
            >
              {loading ? 'Processing Order...' : 'Confirm Order / Purchase'}
            </button>
          </div>

        </div>
      )}

    </div>
  );
};

export default CartScreen;
