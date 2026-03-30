// src/utils/helpers.js

/** Get initials from a full name */
export function getInitials(name = '') {
  const parts = name.trim().split(' ');
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || '?';
}

/** Format date to YYYY-MM-DD */
export function toDateStr(date) {
  return date.toISOString().split('T')[0];
}

/** Format number to Indian locale */
export function formatINR(amount) {
  return amount?.toLocaleString('en-IN') ?? '0';
}

/** Format a UTC ISO timestamp to a readable local date+time */
export function fmtTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
}

/** Calculate percentage change */
export function calcPct(cmp, target) {
  if (!cmp || !target) return '0.0';
  return (((target - cmp) / cmp) * 100).toFixed(1);
}

/** Get date range from quick select key */
export function getDateRange(key) {
  const today = new Date();
  const todayStr = toDateStr(today);

  switch (key) {
    case 'today':
      return { from: todayStr, to: todayStr };
    case 'yesterday': {
      const y = new Date(today);
      y.setDate(y.getDate() - 1);
      const s = toDateStr(y);
      return { from: s, to: s };
    }
    case '7d': {
      const s = new Date(today);
      s.setDate(s.getDate() - 6);
      return { from: toDateStr(s), to: todayStr };
    }
    case '30d': {
      const s = new Date(today);
      s.setDate(s.getDate() - 29);
      return { from: toDateStr(s), to: todayStr };
    }
    case 'all':
    default:
      return { from: '', to: '' };
  }
}
