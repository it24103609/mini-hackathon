import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { PackageCheck, Calendar, Clock, User, Phone, MapPin } from 'lucide-react';

const PharmacistOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await API.get('/orders');
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Error fetching pharmacy orders:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await API.put(`/orders/${orderId}/status`, { status: newStatus });
      if (res.data.success) {
        setMsg(`Order status updated to ${newStatus}`);
        fetchOrders();
        setTimeout(() => setMsg(''), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' }}>
      
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <PackageCheck size={28} color="var(--primary)" /> Pharmacy Orders Management
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
          View patient orders placed for your pharmacy and update status.
        </p>
      </div>

      {msg && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7', padding: '12px 20px', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
          {msg}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px' }}>
          <PackageCheck size={48} style={{ color: 'var(--text-dim)', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>No Orders Received Yet</h3>
          <p style={{ color: 'var(--text-muted)' }}>Incoming patient medicine orders will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map((order) => (
            <div key={order._id} className="glass-panel" style={{ padding: '24px' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', gap: '16px', marginBottom: '8px' }}>
                    <span><Calendar size={14} /> {new Date(order.createdAt).toLocaleDateString()}</span>
                    <span>Order ID: <strong>#{order._id.slice(-6)}</strong></span>
                  </div>

                  {/* Patient Info */}
                  {order.patient && (
                    <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                      Patient: {order.patient.name} ({order.patient.phone || order.patient.email})
                    </div>
                  )}
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Order Status</div>
                  <select
                    className="form-select"
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    style={{ padding: '6px 12px', fontSize: '0.88rem' }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Items */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                {order.items.map((item, idx) => (
                  <div key={idx} style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{item.medicine?.medicineName || 'Medicine'}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Qty: {item.quantity}</div>
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--primary)' }}>
                      LKR {(item.quantity * item.price).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ textAlign: 'right', fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>
                Total Order Amount: LKR {order.totalAmount.toLocaleString()}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default PharmacistOrders;
