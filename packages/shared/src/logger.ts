import pino from "pino";

import { getRuntimeEnv } from "./env";

export type LoggerOptions = {
  name?: string;
  level?: pino.LevelWithSilent;
  prettyPrint?: boolean;
};

/**
 * Create a Pino logger instance with sensible defaults
 */
export function createLogger(options: LoggerOptions = {}): pino.Logger {
  const appEnv = getRuntimeEnv(process.env.APP_ENV);
  const isDevelopment = appEnv === "development";

  const level = options.level ?? process.env.LOG_LEVEL ?? (isDevelopment ? "debug" : "info");

  const transport =
    options.prettyPrint ?? isDevelopment
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "HH:MM:ss Z",
            ignore: "pid,hostname",
          },
        }
      : undefined;

  return pino({
    name: options.name ?? "optiq",
    level,
    transport,
    // Redact sensitive fields
    redact: {
      paths: [
        "req.headers.authorization",
        "req.headers.cookie",
        "res.headers['set-cookie']",
        "*.password",
        "*.token",
        "*.secret",
        "*.apiKey",
      ],
      remove: true,
    },
    // Serialize errors properly
    serializers: {
      err: pino.stdSerializers.err,
      error: pino.stdSerializers.err,
      req: pino.stdSerializers.req,
      res: pino.stdSerializers.res,
    },
    // Add base fields
    base: {
      env: appEnv,
    },
  });
}

/**
 * Create a child logger with additional context
 */
export function createChildLogger(
  parent: pino.Logger,
  bindings: pino.Bindings,
): pino.Logger {
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
