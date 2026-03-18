// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import styles from './AuthPage.module.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: 'demo@chartflix.com', password: 'demo123' });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(form.email, form.password);
    if (!result.success) { setError(result.error); return; }
    navigate('/alerts');
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.brand}>CHARTFLIX</div>
        <h1 className={styles.heading}>Welcome back</h1>
        <p className={styles.sub}>Sign in to your trading dashboard</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              className={styles.input}
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input
              className={styles.input}
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
            />
          </div>
          <Button type="submit" variant="primary" size="lg">Sign in</Button>
        </form>

        <p className={styles.link}>
          No account?{' '}
          <span onClick={() => navigate('/signup')}>Create one</span>
        </p>
      </div>
    </div>
  );
}
