"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/app", label: "Dashboard", icon: "📊" },
  { href: "/app/campaigns", label: "Campaigns", icon: "📢" },
  { href: "/app/analytics", label: "Analytics", icon: "📈" },
  { href: "/app/attribution", label: "Attribution", icon: "🔗" },
  { href: "/app/waste", label: "Waste Detection", icon: "💸" },
  { href: "/app/integrations", label: "Integrations", icon: "🔌" },
  { href: "/app/settings", label: "Settings", icon: "⚙️" },
];

export function Sidebar({ collapsed = false }: { collapsed?: boolean }) {
  const pathname = usePathname();

  return (
    <aside
      className={`flex h-full flex-col border-r border-zinc-200 bg-white transition-all duration-200 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex h-16 items-center border-b border-zinc-200 px-4">
        <Link href="/app" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-sm font-bold text-white">
            O
          </div>
          {!collapsed && (
            <span className="text-lg font-semibold tracking-tight">Optiq</span>
          )}
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-zinc-100 text-zinc-900"
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <span className="text-base">{item.icon}</span>
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-zinc-200 p-3">
        <button
          onClick={() => signOut({ callbackUrl: "/signin" })}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900 ${
            collapsed ? "justify-center" : ""
          }`}
          title={collapsed ? "Sign out" : undefined}
        >
          <span className="text-base">🚪</span>
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  );
}
