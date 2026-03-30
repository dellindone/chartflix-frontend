// src/pages/AlertsPage.jsx
import { useEffect, useState } from 'react';
import { useAlertFilters } from '../hooks/useAlertFilters';
import CategorySummary from '../components/alerts/CategorySummary';
import AlertFilters from '../components/alerts/AlertFilters';
import AlertCard from '../components/alerts/AlertCard';
import Spinner from '../components/common/Spinner';
import styles from './AlertsPage.module.css';

export default function AlertsPage() {
  const {
    categoryFilter, setCategoryFilter,
    directionFilter, setDirectionFilter,
    filteredAlerts, getCategorySummary,
    totalAlerts, loading, error,
    isConnected, lastWsAlert,
  } = useAlertFilters();

  // Toast state — auto-dismiss after 4 s
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!lastWsAlert) return;
    setToast(lastWsAlert);
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [lastWsAlert]);

  return (
    <div className={styles.page}>

      {/* Live toast notification */}
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
          {/* Live indicator */}
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
          <Spinner text="Loading alerts..." />
        ) : filteredAlerts.length === 0 ? (
          <div className={styles.empty}>No alerts match your filters.</div>
        ) : (
          <div className={styles.grid}>
            {filteredAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
