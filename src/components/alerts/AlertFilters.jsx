// src/components/alerts/AlertFilters.jsx
import styles from './AlertFilters.module.css';

const CATEGORIES = [
  { value: 'ALL',       label: 'All Categories' },
  { value: 'INDEX',     label: 'Index' },
  { value: 'STOCK',     label: 'Stock' },
  { value: 'COMMODITY', label: 'Commodity' },
];

const DIRECTIONS = [
  { value: 'ALL',     label: 'All Directions' },
  { value: 'BULLISH', label: 'Bullish' },
  { value: 'BEARISH', label: 'Bearish' },
];

export default function AlertFilters({
  categoryFilter, setCategoryFilter,
  directionFilter, setDirectionFilter,
}) {
  return (
    <div className={styles.bar}>
      <div className={styles.group}>
        <label className={styles.label}>Category</label>
        <div className={styles.selectWrap}>
          <select
            className={styles.select}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {CATEGORIES.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <span className={styles.arrow}>▾</span>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.group}>
        <label className={styles.label}>Direction</label>
        <div className={styles.selectWrap}>
          <select
            className={styles.select}
            value={directionFilter}
            onChange={(e) => setDirectionFilter(e.target.value)}
          >
            {DIRECTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <span className={styles.arrow}>▾</span>
        </div>
      </div>
    </div>
  );
}
