"use client";

/**
 * Alerts Inbox Component
 * 
 * Lists AlertEvents with filtering and status updates
 */

import { useState, useEffect } from "react";
import { AlertCard } from "./components/alert-card";
import { AlertFilters } from "./components/alert-filters";

interface Alert {
  id: string;
  status: "TRIGGERED" | "ACKNOWLEDGED" | "RESOLVED" | "DISMISSED";
  severity: "INFO" | "WARNING" | "CRITICAL";
  title: string;
  message: string;
  context: any;
  triggeredAt: string;
  alertRule: {
    name: string;
    type: string;
  };
}

export function AlertsInbox() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string[]>(["TRIGGERED", "ACKNOWLEDGED"]);
  const [severityFilter, setSeverityFilter] = useState<string[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchAlerts();
  }, [statusFilter, severityFilter]);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter.length > 0) {
        params.set("status", statusFilter.join(","));
      }
      if (severityFilter.length > 0) {
        params.set("severity", severityFilter.join(","));
      }

      const response = await fetch(`/api/alerts?${params}`);
      if (response.ok) {
        const result = await response.json();
        setAlerts(result.data || []);
        setTotal(result.pagination?.total || 0);
      }
    } catch (error) {
      console.error("Failed to fetch alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (alertId: string, action: "acknowledge" | "resolve" | "dismiss") => {
    try {
      const response = await fetch("/api/alerts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alertId, action }),
      });

      if (response.ok) {
        // Refresh alerts
        fetchAlerts();
      }
    } catch (error) {
      console.error("Failed to update alert:", error);
    }
  };

  const triggeredCount = alerts.filter(a => a.status === "TRIGGERED").length;
  const criticalCount = alerts.filter(a => a.severity === "CRITICAL" && a.status === "TRIGGERED").length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Alerts</h1>
              <p className="text-gray-600 mt-1">
                {triggeredCount > 0 ? (
                  <>
                    <span className="font-semibold text-red-600">{triggeredCount}</span> active alert{triggeredCount !== 1 ? "s" : ""}
                    {criticalCount > 0 && (
                      <span className="ml-2">
                        (<span className="font-semibold text-red-700">{criticalCount}</span> critical)
                      </span>
                    )}
                  </>
                ) : (
                  "No active alerts"
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Total: {total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <AlertFilters
          statusFilter={statusFilter}
          severityFilter={severityFilter}
          onStatusFilterChange={setStatusFilter}
          onSeverityFilterChange={setSeverityFilter}
        />

        {/* Alerts List */}
        <div className="mt-6 space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : alerts.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">All Clear!</h3>
              <p className="text-gray-600">No alerts match your current filters</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onStatusUpdate={handleStatusUpdate}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
