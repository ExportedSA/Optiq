"use client";

import Link from "next/link";
import { AlertSettingsForm } from "@/components/settings/alert-settings-form";
import type { AlertSettings } from "@/lib/settings";

interface AlertSettingsPageClientProps {
  initialSettings: AlertSettings;
}

export function AlertSettingsPageClient({ initialSettings }: AlertSettingsPageClientProps) {
  const handleSave = async (updates: Partial<AlertSettings>) => {
    const response = await fetch("/api/settings/alerts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error("Failed to save settings");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/app/settings" className="hover:text-zinc-700">
          Settings
        </Link>
        <span>/</span>
        <span className="text-zinc-900">Alerts</span>
      </div>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Alert Settings</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Configure when and how you receive alerts about your ad performance
        </p>
      </div>

      <AlertSettingsForm initialSettings={initialSettings} onSave={handleSave} />
    </div>
  );
}
