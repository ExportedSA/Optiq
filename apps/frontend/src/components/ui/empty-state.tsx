/**
 * Empty State Component
 * Actionable empty states that guide users to next steps
 */

import { ModernButton } from "./modern-button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  illustration?: "no-data" | "no-campaigns" | "no-events" | "no-results";
}

const illustrations = {
  "no-data": (
    <svg className="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  "no-campaigns": (
    <svg className="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
    </svg>
  ),
  "no-events": (
    <svg className="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
    </svg>
  ),
  "no-results": (
    <svg className="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
};

export function EmptyState({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  illustration,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {/* Icon/Illustration */}
      <div className="mb-6">
        {icon || (illustration && illustrations[illustration]) || (
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 max-w-md mb-6">
        {description}
      </p>

      {/* Actions */}
      {(primaryAction || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3">
          {primaryAction && (
            <ModernButton
              variant="primary"
              size="lg"
              onClick={primaryAction.onClick}
            >
              {primaryAction.label}
            </ModernButton>
          )}
          {secondaryAction && (
            <ModernButton
              variant="ghost"
              size="lg"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </ModernButton>
          )}
        </div>
      )}
    </div>
  );
}

// Preset empty states for common scenarios

export function NoCampaignsEmptyState({ onConnect }: { onConnect: () => void }) {
  return (
    <EmptyState
      illustration="no-campaigns"
      title="No campaigns tracked yet"
      description="Connect your ad accounts to start tracking campaign performance and attribution data."
      primaryAction={{
        label: "Connect Ad Account",
        onClick: onConnect,
      }}
      secondaryAction={{
        label: "View Setup Guide",
        onClick: () => window.open("/docs/setup", "_blank"),
      }}
    />
  );
}

export function NoEventsEmptyState({ onGetCode }: { onGetCode: () => void }) {
  return (
    <EmptyState
      illustration="no-events"
      title="No tracking events yet"
      description="Install the Optiq tracking code on your website to start capturing user behavior and conversion data."
      primaryAction={{
        label: "Get Tracking Code",
        onClick: onGetCode,
      }}
      secondaryAction={{
        label: "Installation Guide",
        onClick: () => window.open("/docs/tracking", "_blank"),
      }}
    />
  );
}

export function NoDataEmptyState({ onReset }: { onReset: () => void }) {
  return (
    <EmptyState
      illustration="no-data"
      title="No data for this period"
      description="Try selecting a different date range or adjusting your filters to see results."
      primaryAction={{
        label: "Reset Filters",
        onClick: onReset,
      }}
      secondaryAction={{
        label: "View All Data",
        onClick: onReset,
      }}
    />
  );
}

export function NoResultsEmptyState({ onClear, searchTerm }: { onClear: () => void; searchTerm?: string }) {
  return (
    <EmptyState
      illustration="no-results"
      title={searchTerm ? `No results for "${searchTerm}"` : "No results found"}
      description="Try adjusting your search terms or filters to find what you're looking for."
      primaryAction={{
        label: "Clear Search",
        onClick: onClear,
      }}
    />
  );
}
