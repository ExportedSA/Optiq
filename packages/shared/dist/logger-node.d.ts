/**
 * Node.js Logger Implementation (Pino)
 *
 * This logger uses Pino for high-performance structured logging in Node.js environments.
 * Should only be imported by backend/server code.
 */
import pino from "pino";
export type LoggerOptions = {
    name?: string;
    level?: pino.LevelWithSilent;
    prettyPrint?: boolean;
};
/**
 * Create a Pino logger instance with sensible defaults
 */
export declare function createLogger(options?: LoggerOptions): pino.Logger;
/**
 * Create a child logger with additional context
 */
export declare function createChildLogger(parent: pino.Logger, bindings: pino.Bindings): pino.Logger;
/**
 * Default logger instance for convenience
 */
export declare const logger: pino.Logger<never, boolean>;
/**
 * Log levels for reference
 */
export declare const LogLevel: {
    readonly FATAL: "fatal";
    readonly ERROR: "error";
    readonly WARN: "warn";
    readonly INFO: "info";
    readonly DEBUG: "debug";
    readonly TRACE: "trace";
};
export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel];
//# sourceMappingURL=logger-node.d.ts.map