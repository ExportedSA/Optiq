"use client";

import { useState } from "react";

interface AlertCardProps {
  alert: {
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
  };
  onStatusUpdate: (alertId: string, action: "acknowledge" | "resolve" | "dismiss") => void;
}

export function AlertCard({ alert, onStatusUpdate }: AlertCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);

  const handleAction = async (action: "acknowledge" | "resolve" | "dismiss") => {
    setUpdating(true);
    await onStatusUpdate(alert.id, action);
    setUpdating(false);
  };

  // Severity styling
  const severityConfig = {
    CRITICAL: {
      bg: "bg-red-50",
      border: "border-red-200",
      badge: "bg-red-100 text-red-800",
      icon: "🔴",
    },
    WARNING: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      badge: "bg-orange-100 text-orange-800",
      icon: "⚠️",
    },
    INFO: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      badge: "bg-blue-100 text-blue-800",
      icon: "ℹ️",
    },
  };

  // Status styling
  const statusConfig = {
    TRIGGERED: {
      badge: "bg-red-100 text-red-800",
      label: "Active",
    },
    ACKNOWLEDGED: {
      badge: "bg-yellow-100 text-yellow-800",
      label: "Acknowledged",
    },
    RESOLVED: {
      badge: "bg-green-100 text-green-800",
      label: "Resolved",
    },
    DISMISSED: {
      badge: "bg-gray-100 text-gray-800",
      label: "Dismissed",
    },
  };

  const config = severityConfig[alert.severity];
  const statusBadge = statusConfig[alert.status];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={`bg-white rounded-lg shadow border-l-4 ${config.border} ${config.bg} transition-all`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3 flex-1">
            <span className="text-2xl">{config.icon}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.badge}`}>
                  {alert.severity}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.badge}`}>
                  {statusBadge.label}
                </span>
                <span className="text-xs text-gray-500">{formatDate(alert.triggeredAt)}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
              <p className="text-gray-700 mt-1">{alert.message}</p>
            </div>
          </div>
        </div>

        {/* Context Details (Expandable) */}
        {alert.context && Object.keys(alert.context).length > 0 && (
          <div className="mt-4">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {expanded ? "Hide details ▲" : "Show details ▼"}
            </button>
            {expanded && (
              <div className="mt-3 bg-white rounded-lg border border-gray-200 p-4">
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  {Object.entries(alert.context).map(([key, value]) => (
                    <div key={key}>
                      <dt className="text-gray-500 font-medium">{key}:</dt>
                      <dd className="text-gray-900">
                        {typeof value === "number" && key.toLowerCase().includes("pct")
                          ? `${value.toFixed(1)}%`
                          : typeof value === "number" && (key.toLowerCase().includes("cpa") || key.toLowerCase().includes("spend") || key.toLowerCase().includes("threshold"))
                          ? `$${value.toFixed(2)}`
                          : String(value)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        {alert.status === "TRIGGERED" && (
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => handleAction("acknowledge")}
              disabled={updating}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? "Updating..." : "Acknowledge"}
            </button>
            <button
              onClick={() => handleAction("resolve")}
              disabled={updating}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? "Updating..." : "Resolve"}
            </button>
            <button
              onClick={() => handleAction("dismiss")}
              disabled={updating}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? "Updating..." : "Dismiss"}
            </button>
          </div>
        )}

        {alert.status === "ACKNOWLEDGED" && (
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => handleAction("resolve")}
              disabled={updating}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? "Updating..." : "Resolve"}
            </button>
            <button
              onClick={() => handleAction("dismiss")}
              disabled={updating}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? "Updating..." : "Dismiss"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
