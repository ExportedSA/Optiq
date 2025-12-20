"use client";

import { useState } from "react";

interface StepTargetsProps {
  organizationId: string;
  onComplete: () => void;
  onSkip: () => void;
}

export function StepTargets({ organizationId, onComplete, onSkip }: StepTargetsProps) {
  const [targetCpa, setTargetCpa] = useState("");
  const [targetRoas, setTargetRoas] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/settings/tracking", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetCpa: targetCpa ? parseFloat(targetCpa) : undefined,
          targetRoas: targetRoas ? parseFloat(targetRoas) : undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save targets");
      }

      onComplete();
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Set Your Targets</h2>
        <p className="text-gray-600 mt-2">
          Define your performance goals. We'll use these to identify waste and optimization opportunities.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="targetCpa" className="block text-sm font-medium text-gray-700 mb-2">
            Target CPA (Cost Per Acquisition)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-gray-500">$</span>
            <input
              type="number"
              id="targetCpa"
              value={targetCpa}
              onChange={(e) => setTargetCpa(e.target.value)}
              placeholder="50.00"
              step="0.01"
              min="0"
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Maximum amount you want to pay per conversion
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        <div>
          <label htmlFor="targetRoas" className="block text-sm font-medium text-gray-700 mb-2">
            Target ROAS (Return On Ad Spend)
          </label>
          <div className="relative">
            <input
              type="number"
              id="targetRoas"
              value={targetRoas}
              onChange={(e) => setTargetRoas(e.target.value)}
              placeholder="3.0"
              step="0.1"
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="absolute right-4 top-3.5 text-gray-500">x</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Minimum revenue multiple you want to achieve (e.g., 3x = $3 revenue per $1 spend)
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">💡 Pro Tip</h3>
          <p className="text-sm text-blue-800">
            You can set both targets, but we recommend starting with one based on your business model:
          </p>
          <ul className="text-sm text-blue-800 mt-2 space-y-1">
            <li>• <strong>CPA</strong> - Best for lead generation and subscription businesses</li>
            <li>• <strong>ROAS</strong> - Best for e-commerce with varying order values</li>
          </ul>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={onSkip}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Skip for now
          </button>
          <button
            type="submit"
            disabled={loading || (!targetCpa && !targetRoas)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Continue"}
          </button>
        </div>
      </form>
    </div>
  );
}
