import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Users, Trash2, Shield, Mail, Phone, MapPin, CheckCircle } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('all');
  const [msg, setMsg] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await API.get('/users');
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete user "${name}"? This action cannot be undone.`)) return;
    try {
      const res = await API.delete(`/users/${id}`);
      if (res.data.success) {
        setMsg(`User "${name}" deleted successfully.`);
        fetchUsers();
        setTimeout(() => setMsg(''), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  const filteredUsers = users.filter((u) => {
    if (roleFilter === 'all') return true;
    return u.role === roleFilter;
  });

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
      
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Users size={28} color="var(--primary)" /> User Management
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
          Monitor system registered patients and pharmacists. Delete accounts when necessary.
        </p>
      </div>

      {msg && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7', padding: '12px 20px', borderRadius: 'var(--radius-md)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle size={20} /> <span>{msg}</span>
        </div>
      )}

      {/* Role Filter */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        {['all', 'patient', 'pharmacist', 'admin'].map((role) => (
          <button
            key={role}
            onClick={() => setRoleFilter(role)}
            className={`btn ${roleFilter === role ? 'btn-primary' : 'btn-secondary'}`}
            style={{ textTransform: 'capitalize', padding: '8px 18px' }}
          >
            {role} ({users.filter((u) => role === 'all' || u.role === role).length})
          </button>
        ))}
      </div>

      {/* User Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>Loading users...</div>
      ) : (
        <div className="glass-panel" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '16px 20px' }}>User Details</th>
                <th style={{ padding: '16px 20px' }}>Role</th>
                <th style={{ padding: '16px 20px' }}>Approval Status</th>
                <th style={{ padding: '16px 20px' }}>Registered Date</th>
                <th style={{ padding: '16px 20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{u.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.email}</div>
                    {u.shopName && <div style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>Shop: {u.shopName}</div>}
                  </td>

                  <td style={{ padding: '16px 20px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      background: u.role === 'admin' ? 'rgba(0, 210, 255, 0.2)' : u.role === 'pharmacist' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                      color: u.role === 'admin' ? 'var(--primary)' : u.role === 'pharmacist' ? '#fcd34d' : 'var(--text-main)'
                    }}>
                      {u.role}
                    </span>
                  </td>

                  <td style={{ padding: '16px 20px' }}>
                    <span className={`badge badge-${u.status === 'approved' ? 'approved' : u.status === 'pending' ? 'pending' : 'rejected'}`}>
                      {u.status}
                    </span>
                  </td>

                  <td style={{ padding: '16px 20px', color: 'var(--text-muted)' }}>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>

                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    {u.role !== 'admin' && (
                      <button
                        onClick={() => handleDeleteUser(u._id, u.name)}
                        className="btn btn-danger"
                        style={{ padding: '6px 12px', fontSize: '0.82rem' }}
                      >
                        <Trash2 size={14} /> Delete User
                      </button>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

export default AdminUsers;
