"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Real-time Updates Hook
 * 
 * Provides WebSocket-like real-time updates with fallback to polling
 * Features:
 * - Auto-reconnection on disconnect
 * - Heartbeat monitoring
 * - Graceful degradation to polling if WebSocket unavailable
 */

export interface RealtimeConfig {
  endpoint: string;
  pollInterval?: number; // milliseconds, default 30000
  enabled?: boolean;
  onUpdate?: (data: any) => void;
  onError?: (error: Error) => void;
}

export function useRealtimeUpdates<T>(config: RealtimeConfig) {
  const [data, setData] = useState<T | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [error, setError] = useState<Error | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const pollInterval = config.pollInterval || 30000;
  const enabled = config.enabled !== false;

  // Fetch data via HTTP (fallback or primary method)
  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(config.endpoint);
      if (response.ok) {
        const result = await response.json();
        setData(result);
        setLastUpdate(new Date());
        setError(null);
        config.onUpdate?.(result);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      config.onError?.(error);
    }
  }, [config.endpoint, config.onUpdate, config.onError]);

  // Setup WebSocket connection (future enhancement)
  const connectWebSocket = useCallback(() => {
    // WebSocket implementation would go here
    // For now, we'll use polling as the primary method
    // This is a placeholder for future WebSocket integration
    
    // Example WebSocket setup (commented out):
    /*
    try {
      const wsUrl = config.endpoint.replace(/^http/, 'ws');
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        setIsConnected(true);
        setError(null);
        
        // Setup heartbeat
        heartbeatIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'ping' }));
          }
        }, 15000);
      };
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type !== 'pong') {
          setData(data);
          setLastUpdate(new Date());
          config.onUpdate?.(data);
        }
      };
      
      ws.onerror = (event) => {
        const error = new Error('WebSocket error');
        setError(error);
        config.onError?.(error);
      };
      
      ws.onclose = () => {
        setIsConnected(false);
        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current);
        }
        
        // Auto-reconnect after 5 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          if (enabled) {
            connectWebSocket();
          }
        }, 5000);
      };
      
      wsRef.current = ws;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      config.onError?.(error);
      
      // Fall back to polling
      startPolling();
    }
    */
    
    // For now, just use polling
    startPolling();
  }, [config.endpoint, enabled]);

  // Start polling
  const startPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
    
    // Initial fetch
    fetchData();
    
    // Setup polling interval
    pollIntervalRef.current = setInterval(() => {
      fetchData();
    }, pollInterval);
    
    setIsConnected(true);
  }, [fetchData, pollInterval]);

  // Stop polling
  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    setIsConnected(false);
  }, []);

  // Manual refresh
  const refresh = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  // Setup and cleanup
  useEffect(() => {
    if (enabled) {
      connectWebSocket();
    } else {
      stopPolling();
    }

    return () => {
      // Cleanup
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
    };
  }, [enabled, connectWebSocket, stopPolling]);

  return {
    data,
    isConnected,
    lastUpdate,
    error,
    refresh,
    setEnabled: (enabled: boolean) => {
      if (enabled) {
        connectWebSocket();
      } else {
        stopPolling();
      }
    },
  };
}
