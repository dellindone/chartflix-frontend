// src/components/layout/AppLayout.jsx
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import styles from './AppLayout.module.css';

export default function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className={styles.layout}>
      <Sidebar isOpen={sidebarOpen} />
      <div className={styles.content}>
        <Navbar
          onToggleSidebar={() => setSidebarOpen((p) => !p)}
          pathname={location.pathname}
        />
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
