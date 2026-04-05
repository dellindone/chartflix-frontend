// src/hooks/useAlertFilters.js
import { useState, useMemo, useEffect, useCallback } from 'react';
import { apiCall, API_ENDPOINTS } from '../utils/api';
import { useAlertsWebSocket } from './useAlertsWebSocket';

function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`; // local date, not UTC
}

export function useAlertFilters() {
  const [alerts, setAlerts]               = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [directionFilter, setDirectionFilter] = useState('ALL');
  const [lastWsAlert, setLastWsAlert]     = useState(null); // latest real-time alert for toast
  const [tickerAlerts, setTickerAlerts]   = useState([]);   // rolling queue for ticker tape
  const [dateFrom, setDateFrom]           = useState(todayISO);
  const [dateTo, setDateTo]               = useState(todayISO);

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchAlerts = useCallback(async (silent = false, from = dateFrom, to = dateTo) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ limit: 100 });
      if (from) params.set('date_from', from);
      if (to)   params.set('date_to', to);
      const res  = await apiCall(`${API_ENDPOINTS.ALERTS}?${params}`, { method: 'GET' });
      const json = await res.json();
      if (json.success) {
        setAlerts(json.data);
      } else {
        setError(json.message || 'Failed to load alerts');
      }
    } catch {
      setError('Failed to load alerts');
    } finally {
      if (!silent) setLoading(false);
    }
  }, [dateFrom, dateTo]);

  useEffect(() => { fetchAlerts(); }, [fetchAlerts]);

  // ── WebSocket ────────────────────────────────────────────────────────────
  const handleNewAlert = useCallback((data) => {
    setLastWsAlert(data);
    setTickerAlerts((prev) => [data, ...prev].slice(0, 12)); // keep last 12
    // Only silent-refresh if we're viewing today
    const today = todayISO();
    if (dateTo === today) fetchAlerts(true);
  }, [fetchAlerts, dateTo]);

  const { isConnected } = useAlertsWebSocket({ onNewAlert: handleNewAlert });

  // ── Filters ──────────────────────────────────────────────────────────────
  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => {
      if (categoryFilter !== 'ALL' && a.category !== categoryFilter) return false;
      if (directionFilter !== 'ALL' && a.direction !== directionFilter) return false;
      return true;
    });
  }, [alerts, categoryFilter, directionFilter]);

  const getCategorySummary = (cat) => {
    const subset  = alerts.filter((a) => a.category === cat);
    const bull    = subset.filter((a) => a.direction === 'BULLISH').length;
    const bear    = subset.filter((a) => a.direction === 'BEARISH').length;
    const total   = bull + bear;
    const bullPct = total ? Math.round((bull / total) * 100) : 0;
    return { bull, bear, total, bullPct };
  };

  return {
    alerts,
    categoryFilter, setCategoryFilter,
    directionFilter, setDirectionFilter,
    dateFrom, setDateFrom,
    dateTo, setDateTo,
    filteredAlerts,
    getCategorySummary,
    totalAlerts: alerts.length,
    loading,
    error,
    isConnected,
    lastWsAlert,
    tickerAlerts,
  };
}
