import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Manage your organization settings and preferences
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SettingsCard
          href="/app/settings/alerts"
          title="Alert Settings"
          description="Configure CPA thresholds, waste alerts, and notification preferences"
          icon="🔔"
        />
        <SettingsCard
          href="/app/settings/integrations"
          title="Integrations"
          description="Manage connected ad platforms and API credentials"
          icon="🔌"
        />
        <SettingsCard
          href="/app/settings/team"
          title="Team"
          description="Invite team members and manage permissions"
          icon="👥"
        />
        <SettingsCard
          href="/app/settings/billing"
          title="Billing"
          description="View usage, manage subscription, and payment methods"
          icon="💳"
        />
        <SettingsCard
          href="/app/settings/tracking"
          title="Tracking"
          description="Configure tracking pixels and conversion settings"
          icon="📊"
        />
      </div>
    </div>
  );
}

function SettingsCard({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start gap-4">
        <span className="text-2xl">{icon}</span>
        <div>
          <h3 className="font-medium text-zinc-900 group-hover:text-zinc-700">
            {title}
          </h3>
          <p className="mt-1 text-sm text-zinc-500">{description}</p>
        </div>
      </div>
    </Link>
  );
}
