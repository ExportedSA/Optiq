/**
 * Sentry Integration
 * 
 * Error tracking and performance monitoring via Sentry.
 * Activation is env-gated via SENTRY_DSN.
 */

import { appLogger } from "./logger";

// Sentry types (minimal interface to avoid hard dependency)
interface SentryScope {
  setTag(key: string, value: string): void;
  setUser(user: { id?: string; email?: string } | null): void;
  setContext(name: string, context: Record<string, unknown>): void;
  setLevel(level: "fatal" | "error" | "warning" | "info" | "debug"): void;
}

interface SentryTransaction {
  finish(): void;
  setStatus(status: string): void;
  startChild(options: { op: string; description?: string }): SentrySpan;
}

interface SentrySpan {
  finish(): void;
  setStatus(status: string): void;
}

interface SentryClient {
  init(options: Record<string, unknown>): void;
  captureException(error: Error, context?: Record<string, unknown>): string;
  captureMessage(message: string, level?: string): string;
  setUser(user: { id?: string; email?: string } | null): void;
  setTag(key: string, value: string): void;
  setContext(name: string, context: Record<string, unknown>): void;
  withScope(callback: (scope: SentryScope) => void): void;
  startTransaction(options: { name: string; op: string }): SentryTransaction;
  flush(timeout?: number): Promise<boolean>;
}

// Lazy-loaded Sentry client
let sentryClient: SentryClient | null = null;
let isInitialized = false;

const SENTRY_DSN = process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN;
const SENTRY_ENVIRONMENT = process.env.SENTRY_ENVIRONMENT ?? process.env.NODE_ENV ?? "development";
const SENTRY_RELEASE = process.env.SENTRY_RELEASE ?? process.env.VERCEL_GIT_COMMIT_SHA;
const SENTRY_ENABLED = !!SENTRY_DSN;
const SENTRY_SAMPLE_RATE = parseFloat(process.env.SENTRY_SAMPLE_RATE ?? "1.0");
const SENTRY_TRACES_SAMPLE_RATE = parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE ?? "0.1");

export function isSentryEnabled(): boolean {
  return SENTRY_ENABLED;
}

export async function initSentry(): Promise<void> {
  if (isInitialized || !SENTRY_ENABLED) {
    return;
  }

  try {
    // Dynamic import to avoid bundling Sentry when not used
    const Sentry = await import("@sentry/nextjs");
    
    Sentry.init({
      dsn: SENTRY_DSN,
      environment: SENTRY_ENVIRONMENT,
      release: SENTRY_RELEASE,
      sampleRate: SENTRY_SAMPLE_RATE,
      tracesSampleRate: SENTRY_TRACES_SAMPLE_RATE,
      
      // Don't send errors in development unless explicitly enabled
      enabled: SENTRY_ENABLED && (process.env.NODE_ENV === "production" || process.env.SENTRY_DEBUG === "true"),
      
      // Filtering
      ignoreErrors: [
        // Browser extensions
        /^chrome-extension:/,
        /^moz-extension:/,
        // Network errors that are usually transient
        "Network request failed",
        "Failed to fetch",
        "Load failed",
        // User-initiated navigation
        "AbortError",
      ],
      
      beforeSend(event) {
        // Scrub sensitive data
        if (event.request?.headers) {
          delete event.request.headers["Authorization"];
          delete event.request.headers["Cookie"];
        }
        return event;
      },
    });

    sentryClient = Sentry as unknown as SentryClient;
    isInitialized = true;
    
    appLogger.info("Sentry initialized", {
      environment: SENTRY_ENVIRONMENT,
      release: SENTRY_RELEASE,
      sampleRate: SENTRY_SAMPLE_RATE,
    });
  } catch (error) {
    appLogger.warn("Failed to initialize Sentry", { error: String(error) });
  }
}

export function captureException(
  error: Error,
  context?: {
    tags?: Record<string, string>;
    extra?: Record<string, unknown>;
    user?: { id?: string; email?: string };
    level?: "fatal" | "error" | "warning" | "info";
  }
): string | null {
  // Always log the error
  appLogger.error(error.message, error, context?.extra);

  if (!sentryClient || !isInitialized) {
    return null;
  }

  let eventId: string | null = null;

  sentryClient.withScope((scope) => {
    if (context?.tags) {
      Object.entries(context.tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }

    if (context?.extra) {
      scope.setContext("extra", context.extra);
    }

    if (context?.user) {
      scope.setUser(context.user);
    }

    if (context?.level) {
      scope.setLevel(context.level);
    }

    eventId = sentryClient!.captureException(error);
  });

  return eventId;
}

export function captureMessage(
  message: string,
  level: "fatal" | "error" | "warning" | "info" | "debug" = "info",
  context?: {
    tags?: Record<string, string>;
    extra?: Record<string, unknown>;
  }
): string | null {
  // Log the message
  switch (level) {
    case "fatal":
    case "error":
      appLogger.error(message, context?.extra);
      break;
    case "warning":
      appLogger.warn(message, context?.extra);
      break;
    default:
      appLogger.info(message, context?.extra);
  }

  if (!sentryClient || !isInitialized) {
    return null;
  }

  let eventId: string | null = null;

  sentryClient.withScope((scope) => {
    if (context?.tags) {
      Object.entries(context.tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }

    if (context?.extra) {
      scope.setContext("extra", context.extra);
    }

    scope.setLevel(level);
    eventId = sentryClient!.captureMessage(message, level);
  });

  return eventId;
}

export function setUser(user: { id?: string; email?: string } | null): void {
  if (!sentryClient || !isInitialized) {
    return;
  }
  sentryClient.setUser(user);
}

export function setTag(key: string, value: string): void {
  if (!sentryClient || !isInitialized) {
    return;
  }
  sentryClient.setTag(key, value);
}

export function setContext(name: string, context: Record<string, unknown>): void {
  if (!sentryClient || !isInitialized) {
    return;
  }
  sentryClient.setContext(name, context);
}

export async function flush(timeout: number = 2000): Promise<boolean> {
  if (!sentryClient || !isInitialized) {
    return true;
  }
  return sentryClient.flush(timeout);
}

// Transaction/span helpers for performance monitoring
export interface Transaction {
  finish(status?: "ok" | "error" | "cancelled"): void;
  startSpan(name: string): Span;
}

export interface Span {
  finish(status?: "ok" | "error"): void;
}

export function startTransaction(name: string, op: string): Transaction {
  if (!sentryClient || !isInitialized) {
    // Return no-op transaction
    return {
      finish: () => {},
      startSpan: () => ({ finish: () => {} }),
    };
  }

  const transaction = sentryClient.startTransaction({ name, op });

  return {
    finish(status = "ok") {
      transaction.setStatus(status);
      transaction.finish();
    },
    startSpan(spanName: string): Span {
      const span = transaction.startChild({ op: "function", description: spanName });
      return {
        finish(status = "ok") {
          span.setStatus(status);
          span.finish();
        },
      };
    },
  };
}
