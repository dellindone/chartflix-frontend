// src/pages/AlertsPage.jsx
import { useEffect, useState } from 'react';
import { useAlertFilters } from '../hooks/useAlertFilters';
import CategorySummary from '../components/alerts/CategorySummary';
import AlertFilters from '../components/alerts/AlertFilters';
import AlertCard from '../components/alerts/AlertCard';
import AlertCardSkeleton from '../components/alerts/AlertCardSkeleton';
import TickerTape from '../components/alerts/TickerTape';
import styles from './AlertsPage.module.css';

const SKELETON_COUNT = 14;

export default function AlertsPage() {
  const {
    categoryFilter, setCategoryFilter,
    directionFilter, setDirectionFilter,
    filteredAlerts, getCategorySummary,
    totalAlerts, loading, error,
    isConnected, lastWsAlert, tickerAlerts,
  } = useAlertFilters();

  // Toast — auto-dismiss after 4s
  const [toast, setToast] = useState(null);
  useEffect(() => {
    if (!lastWsAlert) return;
    setToast(lastWsAlert);
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [lastWsAlert]);

  return (
    <div className={styles.page}>

      {/* Live toast */}
      {toast && (
        <div className={`${styles.toast} ${toast.direction === 'BULLISH' ? styles.toastBull : styles.toastBear}`}>
          <span className={styles.toastDot} />
          <span className={styles.toastText}>
            <strong>{toast.symbol}</strong> · {toast.contract} ·{' '}
            <span className={toast.direction === 'BULLISH' ? styles.bull : styles.bear}>
              {toast.direction === 'BULLISH' ? 'BULLISH' : 'BEARISH'}
            </span>
          </span>
          <span className={styles.toastLtp}>₹{toast.option_ltp}</span>
        </div>
      )}

      <div className={styles.fixed}>
        {/* Ticker tape — shows once WS alerts arrive */}
        <TickerTape alerts={tickerAlerts} />

        <CategorySummary
          getSummary={getCategorySummary}
          activeCategory={categoryFilter}
          onSelectCategory={setCategoryFilter}
        />
        <AlertFilters
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          directionFilter={directionFilter}
          setDirectionFilter={setDirectionFilter}
        />
        <div className={styles.resultBar}>
          <span className={styles.resultText}>
            {loading
              ? 'Loading alerts...'
              : <>Showing <strong>{filteredAlerts.length}</strong> of <strong>{totalAlerts}</strong> alerts</>
            }
          </span>
          <span className={`${styles.liveChip} ${isConnected ? styles.liveOn : styles.liveOff}`}>
            <span className={styles.liveDot} />
            {isConnected ? 'LIVE' : 'OFFLINE'}
          </span>
        </div>
      </div>

      <div className={styles.scroll}>
        {error ? (
          <div className={styles.empty}>⚠ {error}</div>
        ) : loading ? (
          /* Skeleton loader grid */
          <div className={styles.grid}>
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <AlertCardSkeleton key={i} index={i} />
            ))}
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className={styles.empty}>No alerts match your filters.</div>
        ) : (
          /* Staggered card entrance */
          <div className={styles.grid}>
            {filteredAlerts.map((alert, i) => (
              <div
                key={alert.id}
                className="card-enter"
                style={{ animationDelay: `${Math.min(i * 40, 600)}ms` }}
              >
                <AlertCard alert={alert} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
