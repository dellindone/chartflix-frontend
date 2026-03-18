// src/pages/SignupPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import styles from './AuthPage.module.css';

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = signup(form);
    if (!result.success) { setError(result.error); return; }
    navigate('/alerts');
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.brand}>CHARTFLIX</div>
        <h1 className={styles.heading}>Create account</h1>
        <p className={styles.sub}>Join the terminal</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {[
            { name: 'name',            label: 'Full Name',        type: 'text',     placeholder: 'John Doe' },
            { name: 'email',           label: 'Email',            type: 'email',    placeholder: 'you@example.com' },
            { name: 'phone',           label: 'Phone',            type: 'tel',      placeholder: '+91 99999 99999' },
            { name: 'password',        label: 'Password',         type: 'password', placeholder: 'Min. 6 characters' },
            { name: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: 'Repeat password' },
          ].map(({ name, label, type, placeholder }) => (
            <div className={styles.field} key={name}>
              <label className={styles.label}>{label}</label>
              <input
                className={styles.input}
                type={type}
                name={name}
                placeholder={placeholder}
                value={form[name]}
                onChange={handleChange}
              />
            </div>
          ))}
          <Button type="submit" variant="primary" size="lg">Create account</Button>
        </form>

        <p className={styles.link}>
          Have an account?{' '}
          <span onClick={() => navigate('/login')}>Sign in</span>
        </p>
      </div>
    </div>
  );
}
