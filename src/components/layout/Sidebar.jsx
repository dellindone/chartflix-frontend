// src/components/layout/Sidebar.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  { path: '/alerts',  label: 'Alert Terminal',      icon: '◇' },
  { path: '/reco',    label: 'Stock Reco',           icon: '◆' },
];

export default function Sidebar({ isOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className={`${styles.sidebar} ${isOpen ? '' : styles.collapsed}`}>
      <div className={styles.brand}>
        <div className={styles.company}>CHARTFLIX</div>
        <div className={styles.tagline}>Alert &amp; Analytics Terminal</div>
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <div
            key={item.path}
            className={`${styles.item} ${location.pathname === item.path ? styles.active : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className={styles.icon}>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </nav>
    </aside>
  );
}
