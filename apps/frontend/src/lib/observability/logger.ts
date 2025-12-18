/**
 * Structured Logging Utility
 * 
 * Provides consistent, structured logging across the application.
 * Logs are JSON-formatted for easy parsing by log aggregators.
 */

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogContext {
  [key: string]: unknown;
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  service: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  traceId?: string;
  spanId?: string;
  duration?: number;
}

interface LoggerOptions {
  service: string;
  defaultContext?: LogContext;
  minLevel?: LogLevel;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const ENV_LOG_LEVEL = (process.env.LOG_LEVEL as LogLevel) ?? "info";
const IS_PRODUCTION = process.env.NODE_ENV === "production";

export class Logger {
  private service: string;
  private defaultContext: LogContext;
  private minLevel: number;

  constructor(options: LoggerOptions) {
    this.service = options.service;
    this.defaultContext = options.defaultContext ?? {};
    this.minLevel = LOG_LEVELS[options.minLevel ?? ENV_LOG_LEVEL] ?? LOG_LEVELS.info;
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= this.minLevel;
  }

  private formatEntry(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error
  ): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      service: this.service,
    };

    const mergedContext = { ...this.defaultContext, ...context };
    if (Object.keys(mergedContext).length > 0) {
      entry.context = mergedContext;
    }

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: IS_PRODUCTION ? undefined : error.stack,
      };
    }

    return entry;
  }

  private output(entry: LogEntry): void {
    const json = JSON.stringify(entry);

    switch (entry.level) {
      case "debug":
        console.debug(json);
        break;
      case "info":
        console.info(json);
        break;
      case "warn":
        console.warn(json);
        break;
      case "error":
        console.error(json);
        break;
    }
  }

  debug(message: string, context?: LogContext): void {
    if (!this.shouldLog("debug")) return;
    this.output(this.formatEntry("debug", message, context));
  }

  info(message: string, context?: LogContext): void {
    if (!this.shouldLog("info")) return;
    this.output(this.formatEntry("info", message, context));
  }

  warn(message: string, context?: LogContext): void {
    if (!this.shouldLog("warn")) return;
    this.output(this.formatEntry("warn", message, context));
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    if (!this.shouldLog("error")) return;
    const err = error instanceof Error ? error : undefined;
    const ctx = error instanceof Error ? context : (error as LogContext);
    this.output(this.formatEntry("error", message, ctx, err));
  }

  child(additionalContext: LogContext): Logger {
    return new Logger({
      service: this.service,
      defaultContext: { ...this.defaultContext, ...additionalContext },
      minLevel: Object.keys(LOG_LEVELS).find(
        (k) => LOG_LEVELS[k as LogLevel] === this.minLevel
      ) as LogLevel,
    });
  }

  withTraceId(traceId: string): Logger {
    return this.child({ traceId });
  }
}

export function createLogger(service: string, defaultContext?: LogContext): Logger {
  return new Logger({ service, defaultContext });
}

// Default application logger
export const appLogger = createLogger("optiq-app");

// Specialized loggers
export const apiLogger = createLogger("optiq-api");
export const jobLogger = createLogger("optiq-jobs");
export const authLogger = createLogger("optiq-auth");
export const billingLogger = createLogger("optiq-billing");
