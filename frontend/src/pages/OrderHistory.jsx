import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { History, Package, Calendar, Clock, Building2 } from 'lucide-react';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get('/orders');
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (error) {
        console.error('Error fetching order history:', error);
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' }}>
      
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <History size={28} color="var(--primary)" /> My Order History
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
          Track and review your medicine purchases and status from Sri Lankan pharmacies.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px' }}>
          <Package size={48} style={{ color: 'var(--text-dim)', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>No Orders Found</h3>
          <p style={{ color: 'var(--text-muted)' }}>You haven't placed any medicine orders yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map((order) => {
            const statusClass =
              order.status === 'Completed'
                ? 'badge-approved'
                : order.status === 'Confirmed'
                ? 'badge-available'
                : order.status === 'Cancelled'
                ? 'badge-rejected'
                : 'badge-pending';

            return (
              <div key={order._id} className="glass-panel" style={{ padding: '24px' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={14} /> {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={14} /> {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span>Order ID: <strong style={{ color: 'var(--text-main)' }}>#{order._id.slice(-6)}</strong></span>
                    </div>

                    {order.pharmacy && (
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Building2 size={16} color="var(--primary)" />
                        Pharmacy: {order.pharmacy.shopName || order.pharmacy.name} ({order.pharmacy.location || 'Sri Lanka'})
                      </div>
                    )}
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span className={`badge ${statusClass}`} style={{ fontSize: '0.85rem' }}>
                      {order.status}
                    </span>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', marginTop: '6px' }}>
                      LKR {order.totalAmount.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.medicine?.medicineName || 'Medicine'}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Qty: {item.quantity} × LKR {item.price.toLocaleString()}</div>
                      </div>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.9rem' }}>
                        LKR {(item.quantity * item.price).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default OrderHistory;
