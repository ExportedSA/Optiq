"use client";

import { useState } from "react";

interface StepTrackingSiteProps {
  organizationId: string;
  onComplete: (siteId: string) => void;
  onSkip: () => void;
}

export function StepTrackingSite({ organizationId, onComplete, onSkip }: StepTrackingSiteProps) {
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [siteId, setSiteId] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/tracking-sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationId,
          name,
          domain,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create tracking site");
      }

      const data = await response.json();
      setSiteId(data.site.id);
      setPublicKey(data.site.publicKey);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (publicKey) {
      navigator.clipboard.writeText(getSnippet());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getSnippet = () => {
    return `<!-- Optiq Tracking -->
<script>
  (function() {
    window.optiq = window.optiq || [];
    window.optiq.push(['init', '${publicKey}']);
    
    var script = document.createElement('script');
    script.src = '${window.location.origin}/track.js';
    script.async = true;
    document.head.appendChild(script);
  })();
</script>`;
  };

  if (siteId && publicKey) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Install Tracking Code</h2>
          <p className="text-gray-600 mt-2">
            Add this snippet to your website's <code className="bg-gray-100 px-2 py-1 rounded">&lt;head&gt;</code> tag
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Tracking Snippet
              </label>
              <button
                onClick={handleCopy}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {copied ? "Copied!" : "Copy to clipboard"}
              </button>
            </div>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{getSnippet()}</code>
            </pre>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">What happens next?</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Paste this code in your website's HTML</li>
              <li>• Deploy your changes</li>
              <li>• Events will start flowing automatically</li>
              <li>• You can verify tracking in the dashboard</li>
            </ul>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Your Site Details</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-600">Site Name:</dt>
                <dd className="font-medium text-gray-900">{name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Domain:</dt>
                <dd className="font-medium text-gray-900">{domain}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Public Key:</dt>
                <dd className="font-mono text-xs text-gray-900">{publicKey}</dd>
              </div>
            </dl>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              onClick={onSkip}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              I'll do this later
            </button>
            <button
              onClick={() => onComplete(siteId)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Add Your Website</h2>
        <p className="text-gray-600 mt-2">
          Set up tracking to measure conversions and attribute them to your ad campaigns
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Site Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My Store"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-2">
            Domain
          </label>
          <input
            type="text"
            id="domain"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="example.com"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter your domain without https:// or www
          </p>
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
            disabled={loading || !name.trim() || !domain.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Site"}
          </button>
        </div>
      </form>
    </div>
  );
}
