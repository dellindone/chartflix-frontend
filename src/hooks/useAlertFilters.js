// src/hooks/useAlertFilters.js
import { useState, useMemo } from 'react';
import { ALERTS } from '../data/alerts';
import { getDateRange } from '../utils/helpers';

export function useAlertFilters() {
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [directionFilter, setDirectionFilter] = useState('BULLISH');
  const [quickDate, setQuickDate] = useState('today');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');

  // Resolve active date range
  const { from: dateFrom, to: dateTo } = useMemo(() => {
    if (quickDate === 'custom') return { from: customFrom, to: customTo };
    return getDateRange(quickDate);
  }, [quickDate, customFrom, customTo]);

  const setQuickDateKey = (key) => {
    setQuickDate(key);
    if (key !== 'custom') {
      setCustomFrom('');
      setCustomTo('');
    }
  };

  const applyCustomDate = (from, to) => {
    setCustomFrom(from);
    setCustomTo(to);
  };

  const toggleDirection = (dir) => {
    setDirectionFilter((prev) => (prev === dir ? 'ALL' : dir));
  };

  const isInDate = (alert) => {
    if (dateFrom && alert.date < dateFrom) return false;
    if (dateTo && alert.date > dateTo) return false;
    return true;
  };

  const filteredAlerts = useMemo(() => {
    return ALERTS.filter((a) => {
      if (categoryFilter !== 'ALL' && a.category !== categoryFilter) return false;
      if (directionFilter !== 'ALL' && a.direction !== directionFilter) return false;
      return isInDate(a);
    });
  }, [categoryFilter, directionFilter, dateFrom, dateTo]);

  // Category summary (only date-filtered, not category-filtered)
  const dateFilteredAlerts = useMemo(() => ALERTS.filter(isInDate), [dateFrom, dateTo]);

  const getCategorySummary = (cat) => {
    const subset = dateFilteredAlerts.filter((a) => a.category === cat);
    const bull = subset.filter((a) => a.direction === 'BULLISH').length;
    const bear = subset.filter((a) => a.direction === 'BEARISH').length;
    const total = bull + bear;
    const bullPct = total ? Math.round((bull / total) * 100) : 0;
    return { bull, bear, total, bullPct };
  };

  return {
    categoryFilter,
    setCategoryFilter,
    directionFilter,
    toggleDirection,
    quickDate,
    setQuickDateKey,
    customFrom,
    customTo,
    applyCustomDate,
    filteredAlerts,
    getCategorySummary,
    totalAlerts: ALERTS.length,
  };
}
