// src/pages/AdminPage.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiCall, API_ENDPOINTS } from '../utils/api';
import styles from './AdminPage.module.css';

const ROLES = ['user', 'analyst', 'admin'];

export default function AdminPage() {
  const { currentUser } = useAuth();
  const [users, setUsers]       = useState([]);
  const [search, setSearch]     = useState('');
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [updating, setUpdating] = useState(null);
  const [toast, setToast]       = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res  = await apiCall(API_ENDPOINTS.ADMIN_USERS, { method: 'GET' });
      const json = await res.json();
      if (json.success) setUsers(json.data);
      else setError(json.message || 'Failed to load users');
    } catch {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // All hooks must be above any conditional return
  useEffect(() => {
    if (currentUser?.role === 'admin') fetchUsers();
  }, [currentUser?.role]);

  // Role guard (after all hooks)
  if (currentUser && currentUser.role !== 'admin') {
    return (
      <div className={styles.denied}>
        <div className={styles.deniedIcon}>⬡</div>
        <div className={styles.deniedTitle}>Access Denied</div>
        <div className={styles.deniedSub}>This page is restricted to administrators.</div>
      </div>
    );
  }

  const handleRoleChange = async (userId, newRole) => {
    setUpdating(userId);
    try {
      const res  = await apiCall(API_ENDPOINTS.ADMIN_ROLE(userId), {
        method: 'PATCH',
        body: JSON.stringify({ role: newRole }),
      });
      const json = await res.json();
      if (json.success) {
        setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: newRole } : u));
        showToast(`Role updated to ${newRole}`);
      } else {
        showToast(json.message || 'Update failed', 'error');
      }
    } catch {
      showToast('Update failed', 'error');
    } finally {
      setUpdating(null);
    }
  };

  const roleColor = (role) =>
    role === 'admin' ? '#e879f9' : role === 'analyst' ? '#818cf8' : 'var(--tx-tertiary)';

  const filtered = search.trim()
    ? users.filter((u) => u.email.toLowerCase().includes(search.trim().toLowerCase()))
    : users;

  const stats = {
    total:    users.length,
    admins:   users.filter((u) => u.role === 'admin').length,
    analysts: users.filter((u) => u.role === 'analyst').length,
    users:    users.filter((u) => u.role === 'user').length,
  };

  return (
    <div className={styles.page}>
      {toast && (
        <div className={`${styles.toast} ${toast.type === 'error' ? styles.toastErr : styles.toastOk} fade-in`}>
          {toast.type === 'error' ? '✕' : '✓'} {toast.msg}
        </div>
      )}

      <div className={styles.scroll}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.heading}>Admin Panel</h1>
            <p className={styles.sub}>Manage users and permissions</p>
          </div>
          <button className={styles.refreshBtn} onClick={fetchUsers} disabled={loading}>
            ↻ Refresh
          </button>
        </div>

        {/* Stats row */}
        <div className={styles.statsRow}>
          {[
            { label: 'Total Users', value: stats.total,    icon: '◉',  color: 'var(--primary-light)' },
            { label: 'Admins',      value: stats.admins,   icon: '⬡',  color: '#e879f9' },
            { label: 'Analysts',    value: stats.analysts, icon: '✦',  color: '#818cf8' },
            { label: 'Members',     value: stats.users,    icon: '◎',  color: 'var(--tx-secondary)' },
          ].map((s) => (
            <div key={s.label} className={styles.statCard}>
              <span className={styles.statIcon} style={{ color: s.color }}>{s.icon}</span>
              <div className={styles.statVal} style={{ color: s.color }}>{s.value}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Users table */}
        <div className={styles.tableWrap}>
          <div className={styles.tableHeader}>
            <span>Users</span>
            <div className={styles.tableHeaderRight}>
              <input
                className={styles.searchInput}
                type="text"
                placeholder="Search by email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className={styles.tableCount}>{filtered.length} of {users.length}</span>
            </div>
          </div>

          {loading ? (
            <div className={styles.empty}>Loading users...</div>
          ) : error ? (
            <div className={styles.emptyErr}>⚠ {error}</div>
          ) : users.length === 0 ? (
            <div className={styles.empty}>No users found.</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Change Role</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user.id} className={user.id === currentUser?.id ? styles.selfRow : ''}>
                    <td>
                      <div className={styles.userCell}>
                        <div className={styles.avatar} style={{ background: `${roleColor(user.role)}22`, color: roleColor(user.role) }}>
                          {(user.name || '?')[0].toUpperCase()}
                        </div>
                        <div>
                          <div className={styles.userName}>{user.name}</div>
                          {user.id === currentUser?.id && <div className={styles.youTag}>You</div>}
                        </div>
                      </div>
                    </td>
                    <td className={styles.emailCell}>{user.email}</td>
                    <td className={styles.dimCell}>{user.phone || '—'}</td>
                    <td>
                      <span className={styles.rolePill} style={{ color: roleColor(user.role), borderColor: `${roleColor(user.role)}44`, background: `${roleColor(user.role)}11` }}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <div className={styles.roleSelect}>
                        {ROLES.filter((r) => r !== user.role).map((r) => (
                          <button
                            key={r}
                            className={styles.roleBtn}
                            style={{ color: roleColor(r), borderColor: `${roleColor(r)}44` }}
                            disabled={updating === user.id}
                            onClick={() => handleRoleChange(user.id, r)}
                          >
                            {updating === user.id ? '…' : `→ ${r}`}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
