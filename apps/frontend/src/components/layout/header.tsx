"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

interface HeaderProps {
  onToggleSidebar?: () => void;
  sidebarCollapsed?: boolean;
}

export function Header({ onToggleSidebar, sidebarCollapsed }: HeaderProps) {
  const { data: session } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 lg:hidden"
          aria-label="Toggle sidebar"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={sidebarCollapsed ? "M4 6h16M4 12h16M4 18h16" : "M6 18L18 6M6 6l12 12"}
            />
          </svg>
        </button>

        <button
          onClick={onToggleSidebar}
          className="hidden rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 lg:block"
          aria-label="Toggle sidebar"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      <div className="relative">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 text-xs font-semibold uppercase">
            {session?.user?.name?.[0] ?? session?.user?.email?.[0] ?? "U"}
          </div>
          <span className="hidden sm:inline">
            {session?.user?.name ?? session?.user?.email ?? "User"}
          </span>
          <svg
            className={`h-4 w-4 transition-transform ${showUserMenu ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {showUserMenu && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowUserMenu(false)}
            />
            <div className="absolute right-0 z-20 mt-2 w-56 rounded-lg border border-zinc-200 bg-white py-1 shadow-lg">
              <div className="border-b border-zinc-100 px-4 py-3">
                <p className="text-sm font-medium text-zinc-900">
                  {session?.user?.name ?? "User"}
                </p>
                <p className="text-xs text-zinc-500">{session?.user?.email}</p>
              </div>
              <a
                href="/app/settings"
                className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
              >
                Settings
              </a>
              <a
                href="/app/settings/billing"
                className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
              >
                Billing
              </a>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
