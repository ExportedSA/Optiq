"use client";

interface AlertFiltersProps {
  statusFilter: string[];
  severityFilter: string[];
  onStatusFilterChange: (filter: string[]) => void;
  onSeverityFilterChange: (filter: string[]) => void;
}

const STATUS_OPTIONS = [
  { value: "TRIGGERED", label: "Active", color: "red" },
  { value: "ACKNOWLEDGED", label: "Acknowledged", color: "yellow" },
  { value: "RESOLVED", label: "Resolved", color: "green" },
  { value: "DISMISSED", label: "Dismissed", color: "gray" },
];

const SEVERITY_OPTIONS = [
  { value: "CRITICAL", label: "Critical", color: "red" },
  { value: "WARNING", label: "Warning", color: "orange" },
  { value: "INFO", label: "Info", color: "blue" },
];

export function AlertFilters({
  statusFilter,
  severityFilter,
  onStatusFilterChange,
  onSeverityFilterChange,
}: AlertFiltersProps) {
  const toggleStatus = (status: string) => {
    if (statusFilter.includes(status)) {
      onStatusFilterChange(statusFilter.filter(s => s !== status));
    } else {
      onStatusFilterChange([...statusFilter, status]);
    }
  };

  const toggleSeverity = (severity: string) => {
    if (severityFilter.includes(severity)) {
      onSeverityFilterChange(severityFilter.filter(s => s !== severity));
    } else {
      onSeverityFilterChange([...severityFilter, severity]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex flex-wrap gap-6">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => toggleStatus(option.value)}
                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                  statusFilter.includes(option.value)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Severity Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Severity
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onSeverityFilterChange([])}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                severityFilter.length === 0
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              All
            </button>
            {SEVERITY_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => toggleSeverity(option.value)}
                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                  severityFilter.includes(option.value)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
