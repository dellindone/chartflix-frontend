// src/components/layout/Navbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Avatar from '../common/Avatar';
import styles from './Navbar.module.css';

const PAGE_TITLES = {
  '/alerts':  'ALERT TERMINAL',
  '/reco':    'STOCK RECOMMENDATIONS',
  '/profile': 'MY PROFILE',
};

export default function Navbar({ onToggleSidebar, pathname }) {
  const { currentUser, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [ddOpen, setDdOpen] = useState(false);
  const ddRef = useRef(null);

  const title = PAGE_TITLES[pathname] || 'CHARTFLIX';

  useEffect(() => {
    const handleClick = (e) => {
      if (ddRef.current && !ddRef.current.contains(e.target)) setDdOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = async () => {
    setDdOpen(false);
    await logout();
  };

  const goProfile = () => {
    navigate('/profile');
    setDdOpen(false);
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.left}>
        <button className={styles.iconBtn} onClick={onToggleSidebar} title="Toggle sidebar">
          <span /><span /><span />
        </button>
        <span className={styles.title}>{title}</span>
      </div>

      <div className={styles.right}>
        <button className={styles.themeBtn} onClick={toggleTheme} title="Toggle theme">
          {isDark ? '☾' : '☀'}
        </button>

        <div className={styles.ddWrap} ref={ddRef}>
          <button className={styles.iconBtn} onClick={() => setDdOpen((p) => !p)} title="Menu">
            <span /><span /><span />
          </button>

          {ddOpen && (
            <div className={`${styles.dropdown} fade-in`}>
              <div className={styles.ddUser}>
                <Avatar name={currentUser?.name} photo={currentUser?.photo} size={36} />
                <div>
                  <div className={styles.ddName}>{currentUser?.name}</div>
                  <div className={styles.ddEmail}>{currentUser?.email}</div>
                </div>
              </div>
              <div className={styles.ddItem} onClick={goProfile}>○ My Profile</div>
              <div className={styles.ddSep} />
              <div className={`${styles.ddItem} ${styles.danger}`} onClick={handleLogout}>
                → Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
