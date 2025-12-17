"use client";

import { useState } from "react";

interface Platform {
  code: string;
  name: string;
  count: number;
}

interface FiltersProps {
  platforms: Platform[];
  selectedPlatforms: string[];
  onPlatformChange: (platforms: string[]) => void;
  search: string;
  onSearchChange: (search: string) => void;
}

export function CampaignFilters({
  platforms,
  selectedPlatforms,
  onPlatformChange,
  search,
  onSearchChange,
}: FiltersProps) {
  const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);

  const togglePlatform = (code: string) => {
    if (selectedPlatforms.includes(code)) {
      onPlatformChange(selectedPlatforms.filter((p) => p !== code));
    } else {
      onPlatformChange([...selectedPlatforms, code]);
    }
  };

  const clearPlatforms = () => {
    onPlatformChange([]);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 sm:max-w-xs">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          placeholder="Search campaigns..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-zinc-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-zinc-400"
        />
      </div>

      <div className="relative">
        <button
          onClick={() => setShowPlatformDropdown(!showPlatformDropdown)}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          <FilterIcon className="h-4 w-4" />
          Platform
          {selectedPlatforms.length > 0 && (
            <span className="rounded-full bg-zinc-900 px-1.5 py-0.5 text-xs text-white">
              {selectedPlatforms.length}
            </span>
          )}
          <ChevronDownIcon className="h-4 w-4" />
        </button>

        {showPlatformDropdown && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowPlatformDropdown(false)}
            />
            <div className="absolute left-0 z-20 mt-2 w-56 rounded-lg border border-zinc-200 bg-white py-1 shadow-lg">
              {platforms.length > 0 ? (
                <>
                  {platforms.map((platform) => (
                    <label
                      key={platform.code}
                      className="flex cursor-pointer items-center gap-3 px-4 py-2 hover:bg-zinc-50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPlatforms.includes(platform.code)}
                        onChange={() => togglePlatform(platform.code)}
                        className="h-4 w-4 rounded border-zinc-300"
                      />
                      <span className="flex-1 text-sm text-zinc-700">
                        {platform.name}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {platform.count}
                      </span>
                    </label>
                  ))}
                  {selectedPlatforms.length > 0 && (
                    <div className="border-t border-zinc-100 px-4 py-2">
                      <button
                        onClick={clearPlatforms}
                        className="text-sm text-zinc-600 hover:text-zinc-900"
                      >
                        Clear all
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <p className="px-4 py-2 text-sm text-zinc-500">No platforms</p>
              )}
            </div>
          </>
        )}
      </div>

      {selectedPlatforms.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedPlatforms.map((code) => {
            const platform = platforms.find((p) => p.code === code);
            return (
              <span
                key={code}
                className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700"
              >
                {platform?.name ?? code}
                <button
                  onClick={() => togglePlatform(code)}
                  className="ml-0.5 text-zinc-500 hover:text-zinc-700"
                >
                  <XIcon className="h-3 w-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
}

function FilterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
      />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
