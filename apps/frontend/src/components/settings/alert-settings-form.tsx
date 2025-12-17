"use client";

import { useState } from "react";
import type { AlertSettings } from "@/lib/settings";

interface AlertSettingsFormProps {
  initialSettings: AlertSettings;
  onSave: (settings: Partial<AlertSettings>) => Promise<void>;
}

export function AlertSettingsForm({ initialSettings, onSave }: AlertSettingsFormProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await onSave({
        wasteAlerts: settings.wasteAlerts,
        cpaAlerts: settings.cpaAlerts,
        performanceAlerts: settings.performanceAlerts,
        frequency: settings.frequency,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Waste Alerts */}
      <section className="rounded-xl border border-zinc-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-medium text-zinc-900">Waste Detection Alerts</h3>
            <p className="mt-1 text-sm text-zinc-500">
              Get notified when ad spend waste is detected
            </p>
          </div>
          <Toggle
            checked={settings.wasteAlerts.enabled}
            onChange={(enabled) =>
              setSettings((s) => ({
                ...s,
                wasteAlerts: { ...s.wasteAlerts, enabled },
              }))
            }
          />
        </div>

        {settings.wasteAlerts.enabled && (
          <div className="mt-6 space-y-4 border-t border-zinc-100 pt-6">
            <div>
              <label className="block text-sm font-medium text-zinc-700">
                Minimum Waste Level
              </label>
              <select
                value={settings.wasteAlerts.thresholdLevel}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    wasteAlerts: {
                      ...s.wasteAlerts,
                      thresholdLevel: e.target.value as AlertSettings["wasteAlerts"]["thresholdLevel"],
                    },
                  }))
                }
                className="mt-1 w-full max-w-xs rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
              >
                <option value="low">Low (any waste)</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical only</option>
              </select>
            </div>

            <NotificationChannels
              email={settings.wasteAlerts.notifyEmail}
              inApp={settings.wasteAlerts.notifyInApp}
              onEmailChange={(notifyEmail) =>
                setSettings((s) => ({
                  ...s,
                  wasteAlerts: { ...s.wasteAlerts, notifyEmail },
                }))
              }
              onInAppChange={(notifyInApp) =>
                setSettings((s) => ({
                  ...s,
                  wasteAlerts: { ...s.wasteAlerts, notifyInApp },
                }))
              }
            />
          </div>
        )}
      </section>

      {/* CPA Alerts */}
      <section className="rounded-xl border border-zinc-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-medium text-zinc-900">CPA Threshold Alerts</h3>
            <p className="mt-1 text-sm text-zinc-500">
              Get notified when CPA exceeds your target
            </p>
          </div>
          <Toggle
            checked={settings.cpaAlerts.enabled}
            onChange={(enabled) =>
              setSettings((s) => ({
                ...s,
                cpaAlerts: { ...s.cpaAlerts, enabled },
              }))
            }
          />
        </div>

        {settings.cpaAlerts.enabled && (
          <div className="mt-6 space-y-4 border-t border-zinc-100 pt-6">
            <div>
              <label className="block text-sm font-medium text-zinc-700">
                Target CPA
              </label>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-zinc-500">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={settings.cpaAlerts.targetCpa}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      cpaAlerts: {
                        ...s.cpaAlerts,
                        targetCpa: parseFloat(e.target.value) || 0,
                      },
                    }))
                  }
                  className="w-32 rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-zinc-700">
                  Warning Threshold
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="500"
                    value={settings.cpaAlerts.warningThresholdPercent}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        cpaAlerts: {
                          ...s.cpaAlerts,
                          warningThresholdPercent: parseInt(e.target.value) || 0,
                        },
                      }))
                    }
                    className="w-24 rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
                  />
                  <span className="text-sm text-zinc-500">% above target</span>
                </div>
                <p className="mt-1 text-xs text-zinc-400">
                  Alert at ${((settings.cpaAlerts.targetCpa * (100 + settings.cpaAlerts.warningThresholdPercent)) / 100).toFixed(2)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700">
                  Critical Threshold
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="500"
                    value={settings.cpaAlerts.criticalThresholdPercent}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        cpaAlerts: {
                          ...s.cpaAlerts,
                          criticalThresholdPercent: parseInt(e.target.value) || 0,
                        },
                      }))
                    }
                    className="w-24 rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
                  />
                  <span className="text-sm text-zinc-500">% above target</span>
                </div>
                <p className="mt-1 text-xs text-zinc-400">
                  Alert at ${((settings.cpaAlerts.targetCpa * (100 + settings.cpaAlerts.criticalThresholdPercent)) / 100).toFixed(2)}
                </p>
              </div>
            </div>

            <NotificationChannels
              email={settings.cpaAlerts.notifyEmail}
              inApp={settings.cpaAlerts.notifyInApp}
              onEmailChange={(notifyEmail) =>
                setSettings((s) => ({
                  ...s,
                  cpaAlerts: { ...s.cpaAlerts, notifyEmail },
                }))
              }
              onInAppChange={(notifyInApp) =>
                setSettings((s) => ({
                  ...s,
                  cpaAlerts: { ...s.cpaAlerts, notifyInApp },
                }))
              }
            />
          </div>
        )}
      </section>

      {/* Performance Alerts */}
      <section className="rounded-xl border border-zinc-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-medium text-zinc-900">Performance Drop Alerts</h3>
            <p className="mt-1 text-sm text-zinc-500">
              Get notified when conversions drop significantly
            </p>
          </div>
          <Toggle
            checked={settings.performanceAlerts.enabled}
            onChange={(enabled) =>
              setSettings((s) => ({
                ...s,
                performanceAlerts: { ...s.performanceAlerts, enabled },
              }))
            }
          />
        </div>

        {settings.performanceAlerts.enabled && (
          <div className="mt-6 space-y-4 border-t border-zinc-100 pt-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-zinc-700">
                  Conversion Drop Threshold
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={settings.performanceAlerts.conversionDropPercent}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        performanceAlerts: {
                          ...s.performanceAlerts,
                          conversionDropPercent: parseInt(e.target.value) || 50,
                        },
                      }))
                    }
                    className="w-24 rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
                  />
                  <span className="text-sm text-zinc-500">% drop</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700">
                  Comparison Window
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={settings.performanceAlerts.windowDays}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        performanceAlerts: {
                          ...s.performanceAlerts,
                          windowDays: parseInt(e.target.value) || 7,
                        },
                      }))
                    }
                    className="w-24 rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
                  />
                  <span className="text-sm text-zinc-500">days</span>
                </div>
              </div>
            </div>

            <NotificationChannels
              email={settings.performanceAlerts.notifyEmail}
              inApp={settings.performanceAlerts.notifyInApp}
              onEmailChange={(notifyEmail) =>
                setSettings((s) => ({
                  ...s,
                  performanceAlerts: { ...s.performanceAlerts, notifyEmail },
                }))
              }
              onInAppChange={(notifyInApp) =>
                setSettings((s) => ({
                  ...s,
                  performanceAlerts: { ...s.performanceAlerts, notifyInApp },
                }))
              }
            />
          </div>
        )}
      </section>

      {/* Frequency Controls */}
      <section className="rounded-xl border border-zinc-200 bg-white p-6">
        <h3 className="text-base font-medium text-zinc-900">Alert Frequency</h3>
        <p className="mt-1 text-sm text-zinc-500">
          Control how often you receive alerts
        </p>

        <div className="mt-6 space-y-4 border-t border-zinc-100 pt-6">
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Minimum Interval Between Alerts
            </label>
            <select
              value={settings.frequency.minIntervalMinutes}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  frequency: {
                    ...s.frequency,
                    minIntervalMinutes: parseInt(e.target.value),
                  },
                }))
              }
              className="mt-1 w-full max-w-xs rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
              <option value="240">4 hours</option>
              <option value="480">8 hours</option>
              <option value="1440">24 hours</option>
            </select>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-zinc-100 p-4">
            <div>
              <p className="text-sm font-medium text-zinc-700">Email Digest</p>
              <p className="text-xs text-zinc-500">
                Receive a summary instead of individual emails
              </p>
            </div>
            <Toggle
              checked={settings.frequency.digestEnabled}
              onChange={(digestEnabled) =>
                setSettings((s) => ({
                  ...s,
                  frequency: { ...s.frequency, digestEnabled },
                }))
              }
            />
          </div>

          {settings.frequency.digestEnabled && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-zinc-700">
                  Digest Frequency
                </label>
                <select
                  value={settings.frequency.digestFrequency}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      frequency: {
                        ...s.frequency,
                        digestFrequency: e.target.value as "daily" | "weekly",
                      },
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700">
                  Delivery Time
                </label>
                <input
                  type="time"
                  value={settings.frequency.digestTime}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      frequency: { ...s.frequency, digestTime: e.target.value },
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-3">
        {saved && (
          <span className="text-sm text-green-600">Settings saved!</span>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
        checked ? "bg-zinc-900" : "bg-zinc-200"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function NotificationChannels({
  email,
  inApp,
  onEmailChange,
  onInAppChange,
}: {
  email: boolean;
  inApp: boolean;
  onEmailChange: (value: boolean) => void;
  onInAppChange: (value: boolean) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700">
        Notification Channels
      </label>
      <div className="mt-2 flex flex-wrap gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={inApp}
            onChange={(e) => onInAppChange(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-300"
          />
          <span className="text-sm text-zinc-600">In-app notifications</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={email}
            onChange={(e) => onEmailChange(e.target.checked)}
            className="h-4 w-4 rounded border-zinc-300"
          />
          <span className="text-sm text-zinc-600">Email</span>
        </label>
      </div>
    </div>
  );
}
