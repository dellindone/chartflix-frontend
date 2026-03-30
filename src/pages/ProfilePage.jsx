// src/pages/ProfilePage.jsx
import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import styles from './ProfilePage.module.css';

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

function parsePhone(raw = '') {
  if (!raw) return { code: '+91', digits: '' };
  const cleaned = raw.replace(/\s/g, '');
  // Try longest country code first to avoid +1 matching +91/+971 etc.
  const sorted = [...COUNTRY_CODES].sort((a, b) => b.code.length - a.code.length);
  for (const { code } of sorted) {
    if (cleaned.startsWith(code)) {
      return { code, digits: cleaned.slice(code.length) };
    }
  }
  return { code: '+91', digits: cleaned.replace(/\D/g, '') };
}

export default function ProfilePage() {
  const { currentUser, updateProfile } = useAuth();
  const fileRef = useRef(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const nameParts = (currentUser?.name || '').split(' ');
  const parsedPhone = parsePhone(currentUser?.phone || '');
  const [form, setForm] = useState({
    firstName:   nameParts[0] || '',
    lastName:    nameParts.slice(1).join(' ') || '',
    email:       currentUser?.email    || '',
    countryCode: parsedPhone.code,
    phoneDigits: parsedPhone.digits,
    location:    currentUser?.location || '',
  });

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handlePhoneChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 15);
    setForm((p) => ({ ...p, phoneDigits: digits }));
  };

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
    const phone = form.phoneDigits ? form.countryCode + form.phoneDigits : '';
    const result = await updateProfile({
      name: fullName,
      email: form.email,
      phone,
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
                {currentUser?.photo_url
                  ? <img src={currentUser.photo_url} alt="avatar" className={styles.avatarImg} />
                  : <span>{initials}</span>}
              </div>
              <div className={styles.avatarEdit}>✎</div>
            </div>
            <div>
              <div className={styles.profileName}>{currentUser?.name}</div>
              <div className={styles.profileRole}>{currentUser?.role?.charAt(0).toUpperCase() + currentUser?.role?.slice(1)}</div>
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
                <input className={styles.input} type="email" name="email" value={form.email} readOnly disabled={loading} placeholder="Email address" />
              </div>
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
              <div className={styles.field}>
                <label className={styles.label}>Location</label>
                <input className={styles.input} name="location" value={form.location} onChange={handleChange} placeholder="City, Country" disabled={loading} />
              </div>
            </div>

            <div className={styles.actions}>
              <div className={styles.centerAction}>
                <Button type="submit" variant="primary" size="md" disabled={loading}>
                  {loading ? 'Saving...' : 'Save changes'}
                </Button>
              </div>
            </div>
            {saved && <div className={styles.savedMsg}>Profile saved successfully</div>}
          </form>
        </div>
      </div>
    </div>
  );
}
