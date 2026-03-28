// src/pages/AlertsPage.jsx
import { useAlertFilters } from '../hooks/useAlertFilters';
import CategorySummary from '../components/alerts/CategorySummary';
import AlertFilters from '../components/alerts/AlertFilters';
import AlertCard from '../components/alerts/AlertCard';
import styles from './AlertsPage.module.css';

export default function AlertsPage() {
  const {
    categoryFilter, setCategoryFilter,
    directionFilter, setDirectionFilter,
    filteredAlerts, getCategorySummary,
    totalAlerts, loading, error,
  } = useAlertFilters();

  return (
    <div className={styles.page}>
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
        </div>
      </div>

      <div className={styles.scroll}>
        {error ? (
          <div className={styles.empty}>⚠ {error}</div>
        ) : loading ? (
          <div className={styles.empty}>Loading...</div>
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
