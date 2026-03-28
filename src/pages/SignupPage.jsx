// src/pages/SignupPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import styles from './AuthPage.module.css';

const COUNTRY_CODES = [
  { code: '+91', label: '+91 IN' },
  { code: '+1',  label: '+1  US' },
  { code: '+44', label: '+44 GB' },
  { code: '+61', label: '+61 AU' },
  { code: '+971',label: '+971 AE' },
  { code: '+65', label: '+65 SG' },
  { code: '+81', label: '+81 JP' },
  { code: '+49', label: '+49 DE' },
  { code: '+33', label: '+33 FR' },
  { code: '+86', label: '+86 CN' },
  { code: '+7',  label: '+7  RU' },
  { code: '+55', label: '+55 BR' },
  { code: '+27', label: '+27 ZA' },
  { code: '+234',label: '+234 NG' },
];

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '',
    countryCode: '+91', phoneDigits: '',
    password: '', confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handlePhoneChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 15);
    setForm((p) => ({ ...p, phoneDigits: digits }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const phone = form.phoneDigits ? form.countryCode + form.phoneDigits : '';
    const result = await signup({ ...form, phone });

    if (!result.success) {
      setError(result.error);
      setLoading(false);
      return;
    }

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
                disabled={loading}
              />
            </div>
          ))}

          <div className={styles.field}>
            <label className={styles.label}>Phone</label>
            <div className={styles.phoneRow}>
              <select
                className={styles.codeSelect}
                name="countryCode"
                value={form.countryCode}
                onChange={handleChange}
                disabled={loading}
              >
                {COUNTRY_CODES.map(({ code, label }) => (
                  <option key={code} value={code}>{label}</option>
                ))}
              </select>
              <input
                className={styles.input}
                type="tel"
                inputMode="numeric"
                placeholder="9999999999"
                value={form.phoneDigits}
                onChange={handlePhoneChange}
                disabled={loading}
              />
            </div>
          </div>

          {[
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
                disabled={loading}
              />
            </div>
          ))}

          <Button type="submit" variant="primary" size="lg" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>

        <p className={styles.link}>
          Have an account?{' '}
          <span onClick={() => navigate('/login')}>Sign in</span>
        </p>
      </div>
    </div>
  );
}
