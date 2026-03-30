// src/components/alerts/CategorySummary.jsx
import React from 'react';
import styles from './CategorySummary.module.css';

const CATS = [
  { key: 'INDEX',     label: 'Index',     dotCls: 'dotIndex' },
  { key: 'COMMODITY', label: 'Commodity', dotCls: 'dotCommodity' },
  { key: 'STOCK',     label: 'Stocks',    dotCls: 'dotStock' },
];

const ACTIVE_CLS = { INDEX: 'activeIndex', COMMODITY: 'activeCommodity', STOCK: 'activeStock' };
const TITLE_CLS  = { INDEX: 'titleIndex',  COMMODITY: 'titleCommodity',  STOCK: 'titleStock' };

export default function CategorySummary({ getSummary, activeCategory, onSelectCategory }) {
  return (
    <div className={styles.grid}>
      {CATS.map(({ key, label, dotCls }) => {
        const { bull, bear, total, bullPct } = getSummary(key);
        const isActive = activeCategory === key;

        return (
          <div
            key={key}
            className={`${styles.card} ${isActive ? styles[ACTIVE_CLS[key]] : ''}`}
            onClick={() => onSelectCategory(isActive ? 'ALL' : key)}
          >
            <div className={styles.top}>
              <div className={`${styles.title} ${styles[TITLE_CLS[key]]}`}>
                <span className={`${styles.dot} ${styles[dotCls]}`} />
                {label}
              </div>
              <span className={styles.totalText}>{total} alerts</span>
            </div>

            <div className={styles.counts}>
              <div className={styles.bullBox}>
                <span className={styles.bullNum}>{bull}</span>
                <span className={styles.countLabel}>Bull</span>
              </div>
              <div className={styles.bearBox}>
                <span className={styles.bearNum}>{bear}</span>
                <span className={styles.countLabel}>Bear</span>
              </div>
            </div>

            <div className={styles.barTrack}>
              <div className={styles.barFill} style={{ width: `${bullPct}%` }} />
            </div>
            <div className={styles.pctRow}>
              <span>{bullPct}% bull</span>
              <span>{100 - bullPct}% bear</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
