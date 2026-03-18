// src/components/reco/RecoCard.jsx
import React from 'react';
import { formatINR, calcPct } from '../../utils/helpers';
import styles from './RecoCard.module.css';

export default function RecoCard({ rec }) {
  const upside = parseFloat(calcPct(rec.cmp, rec.target));

  return (
    <div className={`${styles.card} ${styles[rec.action]} fade-in`}>
      <div className={styles.head}>
        <div className={styles.badges}>
          <span className={`${styles.actionPill} ${styles[rec.action]}`}>{rec.action.toUpperCase()}</span>
          <span className={styles.sectorPill}>{rec.sector}</span>
        </div>
        <span className={styles.date}>{rec.date}</span>
      </div>

      <div className={styles.body}>
        <div className={styles.sym}>{rec.sym}</div>
        <div className={styles.name}>{rec.name}</div>

        <div className={styles.prices}>
          <div className={styles.priceField}>
            <span className={styles.priceLabel}>CMP</span>
            <span className={`${styles.priceVal} ${styles.cmp}`}>₹{formatINR(rec.cmp)}</span>
          </div>
          <div className={styles.priceField}>
            <span className={styles.priceLabel}>Target</span>
            <span className={`${styles.priceVal} ${styles.tp}`}>₹{formatINR(rec.target)}</span>
          </div>
          <div className={styles.priceField}>
            <span className={styles.priceLabel}>Stop Loss</span>
            <span className={`${styles.priceVal} ${styles.sl}`}>₹{formatINR(rec.stopLoss)}</span>
          </div>
        </div>

        <div className={styles.upside}>
          <span className={styles.upsideLabel}>{rec.action === 'sell' ? 'Downside' : 'Upside'}</span>
          <span className={`${styles.upsideVal} ${upside >= 0 ? styles.pos : styles.neg}`}>
            {upside >= 0 ? '+' : ''}{upside}%
          </span>
        </div>

        <div className={styles.note}>{rec.note}</div>
      </div>
    </div>
  );
}
