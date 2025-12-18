"use client";

import { useCallback, useEffect, useState } from "react";

type NotificationDto = {
  id: string;
  title: string;
  message: string;
  priority: string;
  status: string;
  actionUrl?: string | null;
  metadata: any;
  createdAt: string;
  readAt: string | null;
};

export function NotificationsClient() {
  const [items, setItems] = useState<NotificationDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/notifications?limit=50&includeRead=true");
      if (!res.ok) throw new Error("Failed to load notifications");
      const json = await res.json();
      setItems(json.notifications ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function markRead(id: string) {
    await fetch("/api/notifications/read", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ notificationId: id }),
    });
    void load();
  }

  async function markAllRead() {
    await fetch("/api/notifications/read-all", { method: "POST" });
    void load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
          <p className="mt-1 text-sm text-zinc-600">Alerts and system messages for your workspace.</p>
        </div>

        <button
          onClick={() => void markAllRead()}
          className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Mark all read
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <div className="divide-y divide-zinc-100">
          {loading ? (
            <div className="p-6 text-sm text-zinc-500">Loading…</div>
          ) : items.length === 0 ? (
            <div className="p-6 text-sm text-zinc-500">No notifications.</div>
          ) : (
            items.map((n) => (
              <div key={n.id} className="flex items-start justify-between gap-4 p-4 hover:bg-zinc-50">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium ${n.readAt ? "text-zinc-400" : "text-zinc-900"}`}>
                      {n.title}
                    </span>
                    {!n.readAt && (
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">new</span>
                    )}
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">
                      {n.priority}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-600">{n.message}</p>
                  <div className="mt-2 text-xs text-zinc-500">
                    {new Date(n.createdAt).toLocaleString()}
                  </div>

                  {n.actionUrl ? (
                    <a className="mt-2 inline-block text-sm underline" href={n.actionUrl}>
                      View
                    </a>
                  ) : null}
                </div>

                {!n.readAt ? (
                  <button
                    onClick={() => void markRead(n.id)}
                    className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
                  >
                    Mark read
                  </button>
                ) : null}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
