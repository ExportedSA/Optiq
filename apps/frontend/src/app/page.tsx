import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-16 text-zinc-900">
      <div className="mx-auto w-full max-w-3xl">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8">
          <h1 className="text-3xl font-semibold tracking-tight">Optiq</h1>
          <p className="mt-3 text-base text-zinc-600">
            Multi-tenant SaaS foundation with secure authentication and organization scoping.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/app"
              className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Go to app
            </Link>
            <Link
              href="/signin"
              className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
            >
              Create account
            </Link>
          </div>

          <div className="mt-8 text-sm text-zinc-600">
            Healthcheck: <a className="underline" href="/health">/health</a>
          </div>
        </div>
      </div>
    </main>
  );
}
