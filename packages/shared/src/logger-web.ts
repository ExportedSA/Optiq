/**
 * Web Logger Implementation (Console-based)
 * 
 * This logger provides a console-based implementation for browser/edge environments.
 * Compatible with Next.js App Router, React Server Components, and client-side code.
 */

export type LoggerOptions = {
  name?: string;
  level?: "fatal" | "error" | "warn" | "info" | "debug" | "trace" | "silent";
};

export interface Logger {
  fatal(obj: unknown, msg?: string, ...args: unknown[]): void;
  fatal(msg: string, ...args: unknown[]): void;
  error(obj: unknown, msg?: string, ...args: unknown[]): void;
  error(msg: string, ...args: unknown[]): void;
  warn(obj: unknown, msg?: string, ...args: unknown[]): void;
  warn(msg: string, ...args: unknown[]): void;
  info(obj: unknown, msg?: string, ...args: unknown[]): void;
  info(msg: string, ...args: unknown[]): void;
  debug(obj: unknown, msg?: string, ...args: unknown[]): void;
  debug(msg: string, ...args: unknown[]): void;
  trace(obj: unknown, msg?: string, ...args: unknown[]): void;
  trace(msg: string, ...args: unknown[]): void;
  child(bindings: Record<string, unknown>): Logger;
}

const LOG_LEVELS = {
  fatal: 60,
  error: 50,
  warn: 40,
  info: 30,
  debug: 20,
  trace: 10,
  silent: Infinity,
} as const;

class ConsoleLogger implements Logger {
  private name: string;
  private level: number;
  private bindings: Record<string, unknown>;

  constructor(options: LoggerOptions = {}, bindings: Record<string, unknown> = {}) {
    this.name = options.name ?? "optiq";
    this.level = LOG_LEVELS[options.level ?? "info"];
    this.bindings = bindings;
  }

  private shouldLog(level: keyof typeof LOG_LEVELS): boolean {
    return LOG_LEVELS[level] >= this.level;
  }

  private formatMessage(level: string, obj: unknown, msg?: string, args?: unknown[]): void {
    if (!this.shouldLog(level as keyof typeof LOG_LEVELS)) return;

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] ${level.toUpperCase()} (${this.name})`;

    // If obj is a string, treat it as the message
    if (typeof obj === "string") {
      const allArgs = msg !== undefined ? [msg, ...((args as unknown[]) || [])] : (args as unknown[]) || [];
      console[level as "log" | "error" | "warn" | "info" | "debug"](prefix, obj, ...allArgs);
      return;
    }

    // Otherwise, obj is context data
    const contextData = { ...this.bindings, ...(obj as Record<string, unknown>) };
    const hasContext = Object.keys(contextData).length > 0;

    if (hasContext) {
      console[level as "log" | "error" | "warn" | "info" | "debug"](
        prefix,
        msg || "",
        contextData,
        ...((args as unknown[]) || [])
      );
    } else {
      console[level as "log" | "error" | "warn" | "info" | "debug"](
        prefix,
        msg || "",
        ...((args as unknown[]) || [])
      );
    }
  }

  fatal(obj: unknown, msg?: string, ...args: unknown[]): void {
    this.formatMessage("error", obj, msg, args);
  }

  error(obj: unknown, msg?: string, ...args: unknown[]): void {
    this.formatMessage("error", obj, msg, args);
  }

  warn(obj: unknown, msg?: string, ...args: unknown[]): void {
    this.formatMessage("warn", obj, msg, args);
  }

  info(obj: unknown, msg?: string, ...args: unknown[]): void {
    this.formatMessage("info", obj, msg, args);
  }

  debug(obj: unknown, msg?: string, ...args: unknown[]): void {
    this.formatMessage("debug", obj, msg, args);
  }

  trace(obj: unknown, msg?: string, ...args: unknown[]): void {
    this.formatMessage("debug", obj, msg, args);
  }

  child(bindings: Record<string, unknown>): Logger {
    return new ConsoleLogger(
      { name: this.name, level: Object.keys(LOG_LEVELS).find(k => LOG_LEVELS[k as keyof typeof LOG_LEVELS] === this.level) as any },
      { ...this.bindings, ...bindings }
    );
  }
}

/**
 * Create a console-based logger instance
 */
export function createLogger(options: LoggerOptions = {}): Logger {
  return new ConsoleLogger(options);
}

/**
 * Create a child logger with additional context
 */
export function createChildLogger(
  parent: Logger,
  bindings: Record<string, unknown>,
): Logger {
  return parent.child(bindings);
}

/**
 * Default logger instance for convenience
 */
export const logger = createLogger();

/**
 * Log levels for reference
 */
export const LogLevel = {
  FATAL: "fatal",
  ERROR: "error",
  WARN: "warn",
  INFO: "info",
  DEBUG: "debug",
  TRACE: "trace",
} as const;

export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel];
