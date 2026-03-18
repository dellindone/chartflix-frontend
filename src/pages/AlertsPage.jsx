// src/pages/AlertsPage.jsx
import React from 'react';
import { useAlertFilters } from '../hooks/useAlertFilters';
import CategorySummary from '../components/alerts/CategorySummary';
import AlertFilters from '../components/alerts/AlertFilters';
import SuggestionsBar from '../components/alerts/SuggestionsBar';
import AlertCard from '../components/alerts/AlertCard';
import { getDateRange } from '../utils/helpers';
import styles from './AlertsPage.module.css';

export default function AlertsPage() {
  const {
    categoryFilter, setCategoryFilter,
    directionFilter, toggleDirection,
    quickDate, setQuickDateKey,
    customFrom, customTo, applyCustomDate,
    filteredAlerts, getCategorySummary,
    totalAlerts,
  } = useAlertFilters();

  // Resolve current date range for suggestions
  const { from: dateFrom, to: dateTo } = quickDate === 'custom'
    ? { from: customFrom, to: customTo }
    : getDateRange(quickDate);

  return (
    <div className={styles.page}>
      {/* Fixed top controls */}
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
          toggleDirection={toggleDirection}
          quickDate={quickDate}
          setQuickDateKey={setQuickDateKey}
          customFrom={customFrom}
          customTo={customTo}
          applyCustomDate={applyCustomDate}
        />
        <SuggestionsBar
          dateFrom={dateFrom}
          dateTo={dateTo}
          onSetDirection={toggleDirection}
          onSetCategory={setCategoryFilter}
          onSetQuickDate={setQuickDateKey}
        />
        <div className={styles.resultBar}>
          <span className={styles.resultText}>
            Showing <strong>{filteredAlerts.length}</strong> of <strong>{totalAlerts}</strong> alerts
          </span>
        </div>
      </div>

      {/* Scrollable cards */}
      <div className={styles.scroll}>
        {filteredAlerts.length === 0 ? (
          <div className={styles.empty}>◼ No alerts match your filters — try "All time"</div>
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
