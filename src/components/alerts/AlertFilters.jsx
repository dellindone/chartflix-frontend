// src/components/alerts/AlertFilters.jsx
import React from 'react';
import styles from './AlertFilters.module.css';

const CATEGORIES = ['ALL', 'INDEX', 'STOCK', 'COMMODITY'];
const CAT_LABELS  = { ALL: 'All', INDEX: 'Index', STOCK: 'Stocks', COMMODITY: 'Commodities' };
const QUICK_DATES = [
  { key: 'today',     label: 'Today' },
  { key: 'yesterday', label: 'Yesterday' },
  { key: '7d',        label: 'Last 7d' },
  { key: '30d',       label: 'Last 30d' },
  { key: 'all',       label: 'All time' },
  { key: 'custom',    label: '📅 Custom' },
];

export default function AlertFilters({
  categoryFilter, setCategoryFilter,
  directionFilter, toggleDirection,
  quickDate, setQuickDateKey,
  customFrom, customTo, applyCustomDate,
}) {
  const [localFrom, setLocalFrom] = React.useState(customFrom);
  const [localTo, setLocalTo]   = React.useState(customTo);

  const handleApply = () => applyCustomDate(localFrom, localTo);

  return (
    <div className={styles.wrapper}>
      {/* Category + Direction */}
      <div className={styles.ctrlBar}>
        <div className={styles.group}>
          <span className={styles.label}>Category</span>
          <div className={styles.seg}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`${styles.sgb} ${categoryFilter === cat ? styles[`on${cat}`] || styles.on : ''}`}
                data-cat={cat}
                onClick={() => setCategoryFilter(cat)}
              >
                {CAT_LABELS[cat]}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.sep} />
        <div className={styles.group}>
          <span className={styles.label}>Direction</span>
          <div className={styles.seg}>
            <button
              className={`${styles.sgb} ${directionFilter === 'BULLISH' ? styles.bull : ''}`}
              onClick={() => toggleDirection('BULLISH')}
            >
              ▲ Bullish
            </button>
            <button
              className={`${styles.sgb} ${directionFilter === 'BEARISH' ? styles.bear : ''}`}
              onClick={() => toggleDirection('BEARISH')}
            >
              ▼ Bearish
            </button>
          </div>
        </div>
      </div>

      {/* Date strip */}
      <div className={styles.dateStrip}>
        <span className={styles.label}>Date</span>
        <div className={styles.quickBtns}>
          {QUICK_DATES.map(({ key, label }) => (
            <button
              key={key}
              className={`${styles.qb} ${quickDate === key ? styles.qbOn : ''}`}
              onClick={() => setQuickDateKey(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {quickDate === 'custom' && (
          <div className={styles.customRow}>
            <span className={styles.dsep}>From</span>
            <input type="date" className={styles.di} value={localFrom} onChange={(e) => setLocalFrom(e.target.value)} />
            <span className={styles.dsep}>To</span>
            <input type="date" className={styles.di} value={localTo} onChange={(e) => setLocalTo(e.target.value)} />
            <button className={styles.applyBtn} onClick={handleApply}>Apply</button>
          </div>
        )}
      </div>
    </div>
  );
}
