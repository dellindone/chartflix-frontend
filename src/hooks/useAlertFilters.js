// src/hooks/useAlertFilters.js
import { useState, useMemo, useEffect } from 'react';
import { apiCall, API_ENDPOINTS } from '../utils/api';

export function useAlertFilters() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [directionFilter, setDirectionFilter] = useState('ALL');

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiCall(`${API_ENDPOINTS.ALERTS}?limit=100`, { method: 'GET' });
        const json = await res.json();
        if (json.success) {
          setAlerts(json.data);
        } else {
          setError(json.message || 'Failed to load alerts');
        }
      } catch {
        setError('Failed to load alerts');
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => {
      if (categoryFilter !== 'ALL' && a.category !== categoryFilter) return false;
      if (directionFilter !== 'ALL' && a.direction !== directionFilter) return false;
      return true;
    });
  }, [alerts, categoryFilter, directionFilter]);

  const getCategorySummary = (cat) => {
    const subset = alerts.filter((a) => a.category === cat);
    const bull = subset.filter((a) => a.direction === 'BULLISH').length;
    const bear = subset.filter((a) => a.direction === 'BEARISH').length;
    const total = bull + bear;
    const bullPct = total ? Math.round((bull / total) * 100) : 0;
    return { bull, bear, total, bullPct };
  };

  return {
    alerts,
    categoryFilter,
    setCategoryFilter,
    directionFilter,
    setDirectionFilter,
    filteredAlerts,
    getCategorySummary,
    totalAlerts: alerts.length,
    loading,
    error,
  };
}
