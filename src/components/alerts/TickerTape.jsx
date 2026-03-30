// src/components/alerts/TickerTape.jsx
import styles from './TickerTape.module.css';

export default function TickerTape({ alerts }) {
  if (!alerts || alerts.length === 0) return null;

  // Duplicate for seamless loop
  const items = [...alerts, ...alerts];

  return (
    <div className={styles.wrap}>
      <div className={styles.labelChip}>
        <span className={styles.labelDot} />
        LIVE
      </div>
      <div className={styles.track}>
        <div className={styles.belt} style={{ '--count': alerts.length }}>
          {items.map((a, i) => (
            <span key={i} className={`${styles.item} ${a.direction === 'BULLISH' ? styles.bull : styles.bear}`}>
              <span className={styles.arrow}>{a.direction === 'BULLISH' ? 'B' : 'S'}</span>
              <span className={styles.sym}>{a.symbol}</span>
              <span className={styles.sep}>·</span>
              <span className={styles.contract}>{a.contract}</span>
              <span className={styles.sep}>·</span>
              <span className={styles.ltp}>₹{a.option_ltp}</span>
              <span className={styles.divider}>|</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
