// src/components/alerts/SuggestionsBar.jsx
import React, { useMemo } from 'react';
import { ALERTS } from '../../data/alerts';
import { toDateStr } from '../../utils/helpers';
import styles from './SuggestionsBar.module.css';

export default function SuggestionsBar({ dateFrom, dateTo, onSetDirection, onSetCategory, onSetQuickDate }) {
  const chips = useMemo(() => {

    const inDate = (a) => {
      if (dateFrom && a.date < dateFrom) return false;
      if (dateTo   && a.date > dateTo)   return false;
      return true;
    };
    const base  = ALERTS.filter(inDate);
    const today = toDateStr(new Date());
    const tc    = ALERTS.filter((a) => a.date === today).length;
    const bull  = base.filter((a) => a.direction === 'BULLISH').length;
    const bear  = base.filter((a) => a.direction === 'BEARISH').length;
    const result = [];

    if (tc)           result.push({ cls: 'green', label: `${tc} alerts today`,          action: () => onSetQuickDate('today') });
    if (bull > bear)  result.push({ cls: 'green', label: `${bull} bullish vs ${bear} bearish`, action: () => onSetDirection('BULLISH') });
    else if (bear > bull) result.push({ cls: 'red', label: `${bear} bearish signals`,   action: () => onSetDirection('BEARISH') });

    ['INDEX', 'STOCK', 'COMMODITY'].forEach((cat) => {
      const n = base.filter((a) => a.category === cat).length;
      if (n) result.push({ cls: '', label: `${n} ${cat.charAt(0) + cat.slice(1).toLowerCase()} alerts`, action: () => onSetCategory(cat) });
    });
    return result;
  }, [dateFrom, dateTo, onSetCategory, onSetDirection, onSetQuickDate]);

  if (!chips.length) return null;

  return (
    <div className={styles.bar}>
      <span className={styles.barLabel}>Suggestions</span>
      {chips.map((chip, i) => (
        <div key={i} className={`${styles.chip} ${chip.cls === 'green' ? styles.green : chip.cls === 'red' ? styles.red : ''}`} onClick={chip.action}>
          {chip.label}
        </div>
      ))}
    </div>
  );
}
