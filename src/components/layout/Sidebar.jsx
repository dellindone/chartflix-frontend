// src/components/layout/Sidebar.jsx
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Sidebar.module.css';

const BASE_ITEMS = [
  { path: '/alerts',  label: 'Alert Terminal', desc: 'Live options alerts' },
  { path: '/reco',    label: 'Stock Reco',      desc: 'Analyst picks'      },
];

const ANALYST_ITEMS = [
  { path: '/analyst', label: 'My Content',  desc: 'Manage your posts' },
];

const ADMIN_ITEMS = [
  { path: '/admin', label: 'Admin Panel', desc: 'User management' },
];

export default function Sidebar({ isOpen }) {
  const navigate   = useNavigate();
  const location   = useLocation();
  const { currentUser } = useAuth();
  const role = currentUser?.role;

  const items = [
    ...BASE_ITEMS,
    ...(role === 'analyst' || role === 'admin' ? ANALYST_ITEMS : []),
    ...(role === 'admin' ? ADMIN_ITEMS : []),
  ];

  return (
    <aside className={`${styles.sidebar} ${isOpen ? '' : styles.collapsed}`}>
      <div className={styles.brand}>
        <div className={styles.logo}>
          <img src="/logo.png" alt="Chartflix" className={styles.logoImg} />
        </div>
        <div className={styles.brandText}>
          <div className={styles.company}>CHARTFLIX</div>
          <div className={styles.tagline}>Trading Terminal</div>
        </div>
      </div>

      <nav className={styles.nav}>
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div
              key={item.path}
              className={`${styles.item} ${isActive ? styles.active : ''}`}
              onClick={() => navigate(item.path)}
            >
              <div className={styles.itemText}>
                <span className={styles.label}>{item.label}</span>
                <span className={styles.desc}>{item.desc}</span>
              </div>
              {isActive && <span className={styles.activeDot} />}
            </div>
          );
        })}
      </nav>

      <div className={styles.footer}>
        {role && (
          <div className={styles.roleBadge}>
            <span className={styles.roleLabel}>{role.toUpperCase()}</span>
          </div>
        )}
      </div>
    </aside>
  );
}
