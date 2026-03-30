// src/components/layout/Navbar.jsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../common/Avatar';
import styles from './Navbar.module.css';

const PAGE_TITLES = {
  '/alerts':  'Alert Terminal',
  '/reco':    'Stock Recommendations',
  '/profile': 'My Profile',
  '/analyst': 'My Content',
  '/admin':   'Admin Panel',
};



export default function Navbar({ onToggleSidebar, pathname }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [ddOpen, setDdOpen] = useState(false);
  const ddRef = useRef(null);

  const title = PAGE_TITLES[pathname] || 'CHARTFLIX';

  useEffect(() => {
    const handler = (e) => {
      if (ddRef.current && !ddRef.current.contains(e.target)) setDdOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => { setDdOpen(false); await logout(); };
  const goProfile    = ()         => { navigate('/profile'); setDdOpen(false); };

  const roleColor = currentUser?.role === 'admin' ? '#e879f9'
                  : currentUser?.role === 'analyst' ? '#818cf8'
                  : 'var(--tx-tertiary)';

  return (
    <header className={styles.navbar}>
      <div className={styles.left}>
        <button className={styles.menuBtn} onClick={onToggleSidebar} title="Toggle sidebar">
          <span /><span /><span />
        </button>
        <div className={styles.titleWrap}>
          <span className={styles.title}>{title}</span>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.ddWrap} ref={ddRef}>
          <button
            className={styles.avatarBtn}
            onClick={() => setDdOpen((p) => !p)}
            title="Account menu"
          >
            <Avatar name={currentUser?.name} photo={currentUser?.photo_url} size={32} />
            <div className={styles.userInfo}>
              <span className={styles.userName}>{currentUser?.name?.split(' ')[0]}</span>
              <span className={styles.userRole} style={{ color: roleColor }}>
                {currentUser?.role?.toUpperCase()}
              </span>
            </div>
            <span className={styles.caret}>▾</span>
          </button>

          {ddOpen && (
            <div className={`${styles.dropdown} fade-in`}>
              <div className={styles.ddUser}>
                <Avatar name={currentUser?.name} photo={currentUser?.photo_url} size={38} />
                <div>
                  <div className={styles.ddName}>{currentUser?.name}</div>
                  <div className={styles.ddEmail}>{currentUser?.email}</div>
                  <div className={styles.ddRoleBadge} style={{ color: roleColor }}>
                    {currentUser?.role?.toUpperCase()}
                  </div>
                </div>
              </div>
              <div className={styles.ddItem} onClick={goProfile}>
                My Profile
              </div>
              {(currentUser?.role === 'analyst' || currentUser?.role === 'admin') && (
                <div className={styles.ddItem} onClick={() => { navigate('/analyst'); setDdOpen(false); }}>
                  My Content
                </div>
              )}
              {currentUser?.role === 'admin' && (
                <div className={styles.ddItem} onClick={() => { navigate('/admin'); setDdOpen(false); }}>
                  Admin Panel
                </div>
              )}
              <div className={styles.ddSep} />
              <div className={`${styles.ddItem} ${styles.danger}`} onClick={handleLogout}>
                Sign Out
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
