// src/components/reco/RecoCard.jsx
import { formatINR, calcPct } from '../../utils/helpers';
import styles from './RecoCard.module.css';

function formatDate(isoStr) {
  if (!isoStr) return '';
  return new Date(isoStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export default function RecoCard({ rec }) {
  const upside = parseFloat(calcPct(rec.cmp, rec.target));
  const actionLower = rec.action.toLowerCase();

  return (
    <div className={`${styles.card} ${styles[actionLower]} fade-in`}>
      <div className={styles.head}>
        <div className={styles.badges}>
          <span className={`${styles.actionPill} ${styles[actionLower]}`}>{rec.action}</span>
          <span className={styles.sectorPill}>{rec.sector}</span>
        </div>
        <span className={styles.date}>{formatDate(rec.published_at || rec.created_at)}</span>
      </div>

      <div className={styles.body}>
        <div className={styles.symRow}>
          <div className={styles.sym}>{rec.symbol}</div>
          <button
            className={styles.copyBtn}
            title="Copy symbol"
            onClick={() => navigator.clipboard.writeText(rec.symbol)}
            type="button"
          >📋</button>
        </div>
        <div className={styles.nameRow}>
          <div className={styles.name}>{rec.name}</div>
          <button
            className={styles.copyBtn}
            title="Copy name"
            onClick={() => navigator.clipboard.writeText(rec.name)}
            type="button"
          >📋</button>
        </div>

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
            <span className={`${styles.priceVal} ${styles.sl}`}>₹{formatINR(rec.stop_loss)}</span>
          </div>
        </div>

        <div className={styles.upside}>
          <span className={styles.upsideLabel}>{rec.action === 'SELL' ? 'Downside' : 'Upside'}</span>
          <span className={`${styles.upsideVal} ${upside >= 0 ? styles.pos : styles.neg}`}>
            {upside >= 0 ? '+' : ''}{upside}%
          </span>
        </div>

        {rec.note && <div className={styles.note}>{rec.note}</div>}
      </div>
    </div>
  );
}
