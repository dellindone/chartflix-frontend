// src/components/reco/AnalystSection.jsx
import RecoCard from './RecoCard';
import styles from './AnalystSection.module.css';

export default function AnalystSection({ analyst, isCollapsed, onToggleCollapse, showCollapseBtn }) {
  const buyCount  = analyst.recommendations.filter((r) => r.action === 'BUY').length;
  const sellCount = analyst.recommendations.filter((r) => r.action === 'SELL').length;
  const holdCount = analyst.recommendations.filter((r) => r.action === 'HOLD').length;

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <div className={styles.info}>
          <div
            className={styles.avatar}
            style={{ background: analyst.avatarBg, color: analyst.avatarColor }}
          >
            {analyst.initials}
          </div>
          <div>
            <div className={styles.name}>{analyst.name}</div>
            <div className={styles.tag}>{analyst.tag}</div>
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.stats}>
            {buyCount  > 0 && <span className={`${styles.stat} ${styles.bull}`}>▲ {buyCount} Buy</span>}
            {sellCount > 0 && <span className={`${styles.stat} ${styles.bear}`}>▼ {sellCount} Sell</span>}
            {holdCount > 0 && <span className={styles.stat}>▬ {holdCount} Hold</span>}
          </div>
          {showCollapseBtn && (
            <button
              className={`${styles.collapseBtn} ${isCollapsed ? styles.collapsed : ''}`}
              onClick={onToggleCollapse}
              title={isCollapsed ? 'Expand' : 'Collapse'}
            >
              <span className={styles.chev}>▼</span>
            </button>
          )}
        </div>
      </div>

      {!isCollapsed && (
        <div className={styles.grid}>
          {analyst.recommendations.map((rec) => (
            <RecoCard key={rec.id} rec={rec} />
          ))}
        </div>
      )}
    </div>
  );
}
