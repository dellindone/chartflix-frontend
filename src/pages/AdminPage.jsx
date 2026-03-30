// src/pages/AdminPage.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiCall, API_ENDPOINTS } from '../utils/api';
import { fmtTime } from '../utils/helpers';
import styles from './AdminPage.module.css';

const ROLES = ['user', 'analyst', 'admin'];

const ROLE_META = {
  admin:   { label: 'Admin',   color: '#e879f9', bg: 'rgba(232,121,249,0.1)',  border: 'rgba(232,121,249,0.3)'  },
  analyst: { label: 'Analyst', color: '#818cf8', bg: 'rgba(129,140,248,0.1)',  border: 'rgba(129,140,248,0.3)'  },
  user:    { label: 'Member',  color: '#64748b', bg: 'rgba(100,116,139,0.08)', border: 'rgba(100,116,139,0.25)' },
};

function SkeletonRow() {
  return (
    <tr className={styles.skRow}>
      {[180, 200, 120, 80, 160].map((w, i) => (
        <td key={i}><div className={styles.skBone} style={{ width: w }} /></td>
      ))}
    </tr>
  );
}

export default function AdminPage() {
  const { currentUser } = useAuth();
  const [users, setUsers]       = useState([]);
  const [search, setSearch]     = useState('');
  const [roleTab, setRoleTab]   = useState('ALL');
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [updating, setUpdating] = useState(null);
  const [toast, setToast]       = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchUsers = async () => {
    setLoading(true); setError(null);
    try {
      const res  = await apiCall(API_ENDPOINTS.ADMIN_USERS, { method: 'GET' });
      const json = await res.json();
      if (json.success) setUsers(json.data);
      else setError(json.message || 'Failed to load users');
    } catch { setError('Failed to load users'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (currentUser?.role === 'admin') fetchUsers();
  }, [currentUser?.role]);

  if (currentUser && currentUser.role !== 'admin') {
    return (
      <div className={styles.denied}>
        <div className={styles.deniedTitle}>Access Denied</div>
        <div className={styles.deniedSub}>This page is restricted to administrators.</div>
      </div>
    );
  }

  const handleRoleChange = async (userId, newRole) => {
    if (!newRole) return;
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
      } else showToast(json.message || 'Update failed', 'error');
    } catch { showToast('Update failed', 'error'); }
    finally { setUpdating(null); }
  };

  const stats = {
    total:    users.length,
    admins:   users.filter((u) => u.role === 'admin').length,
    analysts: users.filter((u) => u.role === 'analyst').length,
    members:  users.filter((u) => u.role === 'user').length,
  };

  const filtered = users.filter((u) => {
    const q = search.trim().toLowerCase();
    const matchSearch = !q || u.email.toLowerCase().includes(q) || u.name?.toLowerCase().includes(q);
    const matchRole   = roleTab === 'ALL' || u.role === roleTab;
    return matchSearch && matchRole;
  });

  const STAT_CARDS = [
    { label: 'Total Users', value: stats.total,    color: 'var(--primary-light)', accent: '#6366f1' },
    { label: 'Admins',      value: stats.admins,   color: '#e879f9',              accent: '#e879f9' },
    { label: 'Analysts',    value: stats.analysts, color: '#818cf8',              accent: '#818cf8' },
    { label: 'Members',     value: stats.members,  color: '#64748b',              accent: '#64748b' },
  ];

  const TABS = [
    { key: 'ALL',     label: 'All',      count: users.length },
    { key: 'admin',   label: 'Admins',   count: stats.admins },
    { key: 'analyst', label: 'Analysts', count: stats.analysts },
    { key: 'user',    label: 'Members',  count: stats.members },
  ];

  return (
    <div className={styles.page}>
      {toast && (
        <div className={`${styles.toast} ${toast.type === 'error' ? styles.toastErr : styles.toastOk} fade-in`}>
          {toast.msg}
        </div>
      )}

      <div className={styles.scroll}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.heading}>Admin Panel</h1>
            <p className={styles.sub}>Manage users, roles and permissions</p>
          </div>
          <button className={styles.refreshBtn} onClick={fetchUsers} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {/* Stat cards */}
        <div className={styles.statsRow}>
          {STAT_CARDS.map((s) => (
            <div key={s.label} className={styles.statCard} style={{ '--accent': s.accent }}>
              <div className={styles.statAccent} />
              <div className={styles.statVal} style={{ color: s.color }}>{s.value}</div>
              <div className={styles.statLabel}>{s.label}</div>
              <div className={styles.statBar}>
                <div
                  className={styles.statBarFill}
                  style={{
                    width: stats.total ? `${(s.value / stats.total) * 100}%` : '0%',
                    background: s.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Users table */}
        <div className={styles.tableWrap}>
          {/* Table toolbar */}
          <div className={styles.toolbar}>
            <div className={styles.roleTabs}>
              {TABS.map((t) => (
                <button
                  key={t.key}
                  className={`${styles.roleTab} ${roleTab === t.key ? styles.roleTabActive : ''}`}
                  onClick={() => setRoleTab(t.key)}
                >
                  {t.label}
                  <span className={styles.roleTabCount}>{t.count}</span>
                </button>
              ))}
            </div>
            <div className={styles.toolbarRight}>
              <div className={styles.searchWrap}>
                <svg className={styles.searchIcon} viewBox="0 0 16 16" fill="none">
                  <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
                <input
                  className={styles.searchInput}
                  type="text"
                  placeholder="Search name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button className={styles.clearSearch} onClick={() => setSearch('')}>×</button>
                )}
              </div>
              <span className={styles.tableCount}>{filtered.length} / {users.length}</span>
            </div>
          </div>

          {/* Table */}
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Joined</th>
                  <th>Role</th>
                  <th>Change Role</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
                ) : error ? (
                  <tr><td colSpan={6} className={styles.emptyErr}>{error}</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={6} className={styles.empty}>No users found.</td></tr>
                ) : (
                  filtered.map((user, i) => {
                    const meta = ROLE_META[user.role] || ROLE_META.user;
                    const isSelf = user.id === currentUser?.id;
                    return (
                      <tr
                        key={user.id}
                        className={`${isSelf ? styles.selfRow : ''} card-enter`}
                        style={{ animationDelay: `${i * 30}ms` }}
                      >
                        {/* User */}
                        <td>
                          <div className={styles.userCell}>
                            <div
                              className={styles.avatar}
                              style={{ background: meta.bg, color: meta.color, borderColor: meta.border }}
                            >
                              {(user.name || '?')[0].toUpperCase()}
                            </div>
                            <div>
                              <div className={styles.userName}>
                                {user.name}
                                {isSelf && <span className={styles.youTag}>You</span>}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className={styles.emailCell}>{user.email}</td>

                        {/* Phone */}
                        <td className={styles.dimCell}>{user.phone || '—'}</td>

                        {/* Joined */}
                        <td className={styles.dimCell}>
                          {user.created_at ? fmtTime(user.created_at).split(',')[0] : '—'}
                        </td>

                        {/* Role pill */}
                        <td>
                          <span
                            className={styles.rolePill}
                            style={{ color: meta.color, borderColor: meta.border, background: meta.bg }}
                          >
                            {meta.label}
                          </span>
                        </td>

                        {/* Role change */}
                        <td>
                          <select
                            className={styles.roleSelect}
                            value={user.role}
                            disabled={updating === user.id}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          >
                            {ROLES.map((r) => (
                              <option key={r} value={r}>{ROLE_META[r]?.label || r}</option>
                            ))}
                          </select>
                          {updating === user.id && <span className={styles.updatingDot} />}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
