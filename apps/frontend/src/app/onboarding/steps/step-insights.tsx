"use client";

import { useState, useEffect } from "react";

interface StepInsightsProps {
  organizationId: string;
  onComplete: () => void;
}

export function StepInsights({ organizationId, onComplete }: StepInsightsProps) {
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(false);
  const [stats, setStats] = useState({
    totalSpend: 0,
    conversions: 0,
    cpa: 0,
    roas: 0,
  });

  useEffect(() => {
    checkForData();
    const interval = setInterval(checkForData, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const checkForData = async () => {
    try {
      const response = await fetch("/api/rollups/summary");
      if (response.ok) {
        const data = await response.json();
        if (data.totalRollups > 0) {
          setHasData(true);
          setStats({
            totalSpend: data.totalSpend || 0,
            conversions: data.totalConversions || 0,
            cpa: data.avgCpa || 0,
            roas: data.avgRoas || 0,
          });
        }
      }
    } catch (error) {
      console.error("Failed to check for data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Checking for data...</p>
        </div>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Waiting for Data</h2>
          <p className="text-gray-600 mt-2">
            We're syncing your ad data. This usually takes a few minutes.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-900">What's happening?</h3>
                <ul className="text-sm text-blue-800 mt-2 space-y-1">
                  <li>✓ Connecting to your ad platforms</li>
                  <li>✓ Fetching campaign data</li>
                  <li>✓ Processing attribution</li>
                  <li>⏳ Generating insights...</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">While you wait...</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                  1
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-700">
                    <strong>Verify tracking:</strong> Make sure you've installed the tracking snippet on your website
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                  2
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-700">
                    <strong>Check connections:</strong> Ensure your ad accounts are properly connected
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                  3
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-700">
                    <strong>Be patient:</strong> Initial sync can take 5-10 minutes depending on your data volume
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              onClick={checkForData}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              ↻ Refresh
            </button>
            <button
              onClick={onComplete}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="mb-6">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900">You're All Set! 🎉</h2>
        <p className="text-gray-600 mt-2">
          Your data is flowing. Here's a quick snapshot of your performance.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
          <p className="text-sm text-blue-600 font-medium mb-1">Total Spend</p>
          <p className="text-3xl font-bold text-blue-900">
            ${(stats.totalSpend / 1_000_000).toFixed(2)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
          <p className="text-sm text-green-600 font-medium mb-1">Conversions</p>
          <p className="text-3xl font-bold text-green-900">
            {stats.conversions.toFixed(0)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
          <p className="text-sm text-purple-600 font-medium mb-1">Avg CPA</p>
          <p className="text-3xl font-bold text-purple-900">
            ${stats.cpa.toFixed(2)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6">
          <p className="text-sm text-orange-600 font-medium mb-1">Avg ROAS</p>
          <p className="text-3xl font-bold text-orange-900">
            {stats.roas.toFixed(2)}x
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white mb-6">
        <h3 className="text-lg font-semibold mb-2">What's Next?</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start">
            <span className="mr-2">📊</span>
            <span>Explore your dashboard to see detailed performance metrics</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">🎯</span>
            <span>Review waste alerts to identify optimization opportunities</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">🔄</span>
            <span>Compare attribution models to understand your customer journey</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">⚡</span>
            <span>Set up automated alerts for performance anomalies</span>
          </li>
        </ul>
      </div>

      <div className="flex justify-center">
        <button
          onClick={onComplete}
          className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all"
        >
          Go to Dashboard →
        </button>
      </div>
    </div>
  );
}
