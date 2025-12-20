/**
 * Web Logger Implementation (Console-based)
 *
 * This logger provides a console-based implementation for browser/edge environments.
 * Compatible with Next.js App Router, React Server Components, and client-side code.
 */
const LOG_LEVELS = {
    fatal: 60,
    error: 50,
    warn: 40,
    info: 30,
    debug: 20,
    trace: 10,
    silent: Infinity,
};
class ConsoleLogger {
    name;
    level;
    bindings;
    constructor(options = {}, bindings = {}) {
        this.name = options.name ?? "optiq";
        this.level = LOG_LEVELS[options.level ?? "info"];
        this.bindings = bindings;
    }
    shouldLog(level) {
        return LOG_LEVELS[level] >= this.level;
    }
    formatMessage(level, obj, msg, args) {
        if (!this.shouldLog(level))
            return;
        const timestamp = new Date().toISOString();
        const prefix = `[${timestamp}] ${level.toUpperCase()} (${this.name})`;
        // If obj is a string, treat it as the message
        if (typeof obj === "string") {
            const allArgs = msg !== undefined ? [msg, ...(args || [])] : args || [];
            console[level](prefix, obj, ...allArgs);
            return;
        }
        // Otherwise, obj is context data
        const contextData = { ...this.bindings, ...obj };
        const hasContext = Object.keys(contextData).length > 0;
        if (hasContext) {
            console[level](prefix, msg || "", contextData, ...(args || []));
        }
        else {
            console[level](prefix, msg || "", ...(args || []));
        }
    }
    fatal(obj, msg, ...args) {
        this.formatMessage("error", obj, msg, args);
    }
    error(obj, msg, ...args) {
        this.formatMessage("error", obj, msg, args);
    }
    warn(obj, msg, ...args) {
        this.formatMessage("warn", obj, msg, args);
    }
    info(obj, msg, ...args) {
        this.formatMessage("info", obj, msg, args);
    }
    debug(obj, msg, ...args) {
        this.formatMessage("debug", obj, msg, args);
    }
    trace(obj, msg, ...args) {
        this.formatMessage("debug", obj, msg, args);
    }
    child(bindings) {
        return new ConsoleLogger({ name: this.name, level: Object.keys(LOG_LEVELS).find(k => LOG_LEVELS[k] === this.level) }, { ...this.bindings, ...bindings });
    }
}
/**
 * Create a console-based logger instance
 */
export function createLogger(options = {}) {
    return new ConsoleLogger(options);
}
/**
 * Create a child logger with additional context
 */
export function createChildLogger(parent, bindings) {
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
};
//# sourceMappingURL=logger-web.js.map