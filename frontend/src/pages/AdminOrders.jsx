import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { PackageCheck, Calendar, Clock, User, Building2 } from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get('/orders');
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (err) {
        console.error('Error fetching admin orders:', err);
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
      
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <PackageCheck size={28} color="var(--primary)" /> System Orders Monitor
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
          Overview of all patient orders and transactions placed across registered Sri Lankan pharmacies.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px' }}>
          <PackageCheck size={48} style={{ color: 'var(--text-dim)', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>No Orders Recorded</h3>
          <p style={{ color: 'var(--text-muted)' }}>No medicine orders have been placed yet.</p>
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

                  <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                    {order.patient && (
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Patient: <strong style={{ color: 'var(--text-main)' }}>{order.patient.name}</strong> ({order.patient.email})
                      </div>
                    )}
                    {order.pharmacy && (
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Pharmacy: <strong style={{ color: 'var(--primary)' }}>{order.pharmacy.shopName || order.pharmacy.name}</strong> ({order.pharmacy.location})
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className={`badge badge-${order.status === 'Completed' ? 'approved' : order.status === 'Cancelled' ? 'rejected' : 'pending'}`}>
                    {order.status}
                  </span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', marginTop: '6px' }}>
                    LKR {order.totalAmount.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Items Summary */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                {order.items.map((item, idx) => (
                  <div key={idx} style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem' }}>
                    <div style={{ fontWeight: 600 }}>{item.medicine?.medicineName || 'Medicine'}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Qty: {item.quantity} × LKR {item.price.toLocaleString()}</div>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default AdminOrders;
