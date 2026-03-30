// src/hooks/useAlertsWebSocket.js
import { useEffect, useRef, useState, useCallback } from 'react';

const getWsBase = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'https://api.chartflix.in/api/v1';
  try {
    const url = new URL(apiUrl);
    const protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${url.host}/ws/alerts`;
  } catch {
    return 'wss://api.chartflix.in/ws/alerts';
  }
};

const WS_BASE = getWsBase();
const MAX_DELAY = 30_000;

export function useAlertsWebSocket({ onNewAlert } = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef          = useRef(null);
  const unmountedRef   = useRef(false);
  const retryDelayRef  = useRef(1_000);
  const retryTimerRef  = useRef(null);
  const onNewAlertRef  = useRef(onNewAlert);

  // Always keep the callback ref up to date without re-connecting
  useEffect(() => { onNewAlertRef.current = onNewAlert; }, [onNewAlert]);

  const connect = useCallback(() => {
    const token = localStorage.getItem('access_token');
    if (!token || unmountedRef.current) return;

    const ws = new WebSocket(`${WS_BASE}?token=${encodeURIComponent(token)}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      retryDelayRef.current = 1_000; // reset backoff on success
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onNewAlertRef.current?.(data);
      } catch { /* ignore malformed frames */ }
    };

    ws.onclose = (event) => {
      setIsConnected(false);
      // 4001 = rejected by server (bad token) — don't retry
      if (!unmountedRef.current && event.code !== 4001) {
        retryTimerRef.current = setTimeout(() => {
          retryDelayRef.current = Math.min(retryDelayRef.current * 2, MAX_DELAY);
          connect();
        }, retryDelayRef.current);
      }
    };

    ws.onerror = () => ws.close();
  }, []); // stable — no deps needed

  useEffect(() => {
    unmountedRef.current = false;
    connect();
    return () => {
      unmountedRef.current = true;
      clearTimeout(retryTimerRef.current);
      wsRef.current?.close(1000, 'component unmount');
    };
  }, [connect]);

  return { isConnected };
}
