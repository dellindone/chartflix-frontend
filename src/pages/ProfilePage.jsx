// src/pages/ProfilePage.jsx
import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const { currentUser, updateProfile, logout } = useAuth();
  const fileRef = useRef(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const nameParts = (currentUser?.name || '').split(' ');
  const [form, setForm] = useState({
    firstName: nameParts[0] || '',
    lastName:  nameParts.slice(1).join(' ') || '',
    email:     currentUser?.email    || '',
    phone:     currentUser?.phone    || '',
    location:  currentUser?.location || '',
  });

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handlePhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (ev) => {
      setLoading(true);
      const result = await updateProfile({ photo: ev.target.result });
      setLoading(false);
      if (!result.success) {
        setError(result.error);
        setTimeout(() => setError(''), 3000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const fullName = [form.firstName, form.lastName].filter(Boolean).join(' ') || currentUser.name;
    const result = await updateProfile({
      name: fullName,
      email: form.email,
      phone: form.phone,
      location: form.location,
    });

    setLoading(false);

    if (!result.success) {
      setError(result.error);
      setTimeout(() => setError(''), 3000);
      return;
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    const parts = (currentUser?.name || '').split(' ');
    setForm({
      firstName: parts[0] || '',
      lastName:  parts.slice(1).join(' ') || '',
      email:     currentUser?.email    || '',
      phone:     currentUser?.phone    || '',
      location:  currentUser?.location || '',
    });
  };

  const initials = ((form.firstName?.[0] || '') + (form.lastName?.[0] || '')).toUpperCase() || '?';

  return (
    <div className={styles.page}>
      <div className={styles.scroll}>
        <div className={styles.heading}>My Profile</div>
        <div className={styles.sub}>Manage your personal information</div>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.card}>
          {/* Avatar row */}
          <div className={styles.avatarRow}>
            <div className={styles.avatarWrap} onClick={() => !loading && fileRef.current?.click()}>
              <div className={styles.avatar}>
                {currentUser?.photo
                  ? <img src={currentUser.photo} alt="avatar" className={styles.avatarImg} />
                  : <span>{initials}</span>}
              </div>
              <div className={styles.avatarEdit}>✎</div>
            </div>
            <div>
              <div className={styles.profileName}>{currentUser?.name}</div>
              <div className={styles.profileRole}>Trader</div>
              <div className={styles.photoHint} onClick={() => !loading && fileRef.current?.click()}>📷 Change photo</div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} disabled={loading} />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSave}>
            <div className={styles.grid}>
              <div className={styles.field}>
                <label className={styles.label}>First Name</label>
                <input className={styles.input} name="firstName" value={form.firstName} onChange={handleChange} placeholder="First name" disabled={loading} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Last Name</label>
                <input className={styles.input} name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last name" disabled={loading} />
              </div>
              <div className={`${styles.field} ${styles.full}`}>
                <label className={styles.label}>Email</label>
                <input className={styles.input} type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email address" disabled={loading} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Phone</label>
                <input className={styles.input} type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 99999 99999" disabled={loading} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Location</label>
                <input className={styles.input} name="location" value={form.location} onChange={handleChange} placeholder="City, Country" disabled={loading} />
              </div>
            </div>

            <div className={styles.actions}>
              <Button type="submit" variant="primary" size="md" disabled={loading}>
                {loading ? 'Saving...' : 'Save changes'}
              </Button>
              <Button type="button" variant="ghost" size="md" onClick={handleReset} disabled={loading}>Reset</Button>
              <Button type="button" variant="ghost" size="md" onClick={logout} disabled={loading}>Logout</Button>
            </div>
            {saved && <div className={styles.savedMsg}>✓ Profile saved successfully</div>}
          </form>
        </div>
      </div>
    </div>
  );
}
