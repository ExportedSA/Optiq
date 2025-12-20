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
/**
 * Create a console-based logger instance
 */
export declare function createLogger(options?: LoggerOptions): Logger;
/**
 * Create a child logger with additional context
 */
export declare function createChildLogger(parent: Logger, bindings: Record<string, unknown>): Logger;
/**
 * Default logger instance for convenience
 */
export declare const logger: Logger;
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
//# sourceMappingURL=logger-web.d.ts.map