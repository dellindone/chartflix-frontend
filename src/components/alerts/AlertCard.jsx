// src/components/alerts/AlertCard.jsx
import { formatINR } from '../../utils/helpers';
import styles from './AlertCard.module.css';

const CAT_LABEL = { INDEX: 'Index', STOCK: 'Stock', COMMODITY: 'Commodity' };
const CAT_CLS   = { INDEX: styles.cpIndex, STOCK: styles.cpStock, COMMODITY: styles.cpCommodity };

function formatTimestamp(isoStr) {
  if (!isoStr) return '';
  return new Date(isoStr).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
}

export default function AlertCard({ alert }) {
  const isBull = alert.direction === 'BULLISH';

  return (
    <div className={`${styles.card} ${isBull ? styles.bull : styles.bear} fade-in`}>
      {/* Header */}
      <div className={styles.head}>
        <div className={styles.badges}>
          <span className={`${styles.dirPill} ${isBull ? styles.dpBull : styles.dpBear}`}>
            {isBull ? '▲ BULL' : '▼ BEAR'}
          </span>
          <span className={`${styles.catPill} ${CAT_CLS[alert.category]}`}>
            {CAT_LABEL[alert.category]}
          </span>
          <span className={styles.optPill}>OPTION</span>
        </div>
        <span className={styles.exch}>{alert.exchange}</span>
      </div>

      {/* Body */}
      <div className={styles.body}>
        <div className={styles.contractRow}>
          <div className={styles.contract}>{alert.contract}</div>
          <button
            className={styles.copyBtn}
            title="Copy contract"
            onClick={() => navigator.clipboard.writeText(alert.contract)}
            type="button"
          >📎</button>
        </div>
        <div className={styles.symRow}>
          Symbol: <span>{alert.symbol}</span>
        </div>

        <div className={styles.grid}>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>LTP</span>
            <span className={`${styles.fieldVal} ${isBull ? styles.green : styles.red}`}>
              ₹ {formatINR(alert.ltp)}
            </span>
          </div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Strike</span>
            <span className={`${styles.fieldVal} ${styles.blue}`}>
              {formatINR(alert.strike)}
            </span>
          </div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Option LTP</span>
            <span className={`${styles.fieldVal} ${styles.amber}`}>
              ₹ {alert.option_ltp}
            </span>
          </div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Lot Size</span>
            <span className={styles.fieldVal}>{alert.lot_size}</span>
          </div>
        </div>

        <div className={styles.invest}>
          <span className={styles.investLabel}>Investment</span>
          <span className={styles.investVal}>₹ {formatINR(alert.investment)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>{formatTimestamp(alert.created_at)}</div>
    </div>
  );
}
