"use client";

import { useState, useEffect } from "react";

interface StepConnectionsProps {
  organizationId: string;
  onComplete: () => void;
  onSkip: () => void;
}

export function StepConnections({ organizationId, onComplete, onSkip }: StepConnectionsProps) {
  const [connections, setConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      const response = await fetch("/api/integrations");
      if (response.ok) {
        const data = await response.json();
        setConnections(data.connections || []);
      }
    } catch (error) {
      console.error("Failed to fetch connections:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = (platform: "meta" | "google-ads") => {
    const url = platform === "meta" 
      ? "/api/integrations/meta/connect"
      : "/api/integrations/google-ads/connect";
    window.location.href = url;
  };

  const hasMetaConnection = connections.some(c => c.platformCode === "META_ADS");
  const hasGoogleConnection = connections.some(c => c.platformCode === "GOOGLE_ADS");
  const hasAnyConnection = hasMetaConnection || hasGoogleConnection;

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Connect Ad Platforms</h2>
        <p className="text-gray-600 mt-2">
          Link your ad accounts to start tracking spend and performance
        </p>
      </div>

      <div className="space-y-4">
        {/* Meta Ads */}
        <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Meta Ads</h3>
                <p className="text-sm text-gray-600">Facebook & Instagram advertising</p>
                {hasMetaConnection && (
                  <p className="text-sm text-green-600 mt-1">
                    ✓ {connections.filter(c => c.platformCode === "META_ADS").length} account(s) connected
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => handleConnect("meta")}
              className={`px-4 py-2 rounded-lg font-medium ${
                hasMetaConnection
                  ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {hasMetaConnection ? "Add More" : "Connect"}
            </button>
          </div>
        </div>

        {/* Google Ads */}
        <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Google Ads</h3>
                <p className="text-sm text-gray-600">Search, Display & YouTube advertising</p>
                {hasGoogleConnection && (
                  <p className="text-sm text-green-600 mt-1">
                    ✓ {connections.filter(c => c.platformCode === "GOOGLE_ADS").length} account(s) connected
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => handleConnect("google-ads")}
              className={`px-4 py-2 rounded-lg font-medium ${
                hasGoogleConnection
                  ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {hasGoogleConnection ? "Add More" : "Connect"}
            </button>
          </div>
        </div>
      </div>

      {hasAnyConnection && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-900">Connections Active</h3>
              <p className="text-sm text-green-800 mt-1">
                Your ad accounts are connected. We'll start syncing data automatically.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-200">
        <button
          onClick={onSkip}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          I'll connect later
        </button>
        <button
          onClick={onComplete}
          disabled={!hasAnyConnection}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {hasAnyConnection ? "Continue" : "Connect at least one platform"}
        </button>
      </div>
    </div>
  );
}
