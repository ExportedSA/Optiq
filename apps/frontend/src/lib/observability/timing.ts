/**
 * Performance Timing Utilities
 * 
 * Provides timing instrumentation for routes, jobs, and operations.
 */

import { apiLogger, jobLogger } from "./logger";
import { startTransaction, type Transaction, type Span } from "./sentry";

export interface TimingResult<T> {
  result: T;
  durationMs: number;
}

export interface TimingContext {
  operation: string;
  metadata?: Record<string, unknown>;
}

/**
 * Time an async operation and log the result
 */
export async function timeAsync<T>(
  operation: string,
  fn: () => Promise<T>,
  metadata?: Record<string, unknown>
): Promise<TimingResult<T>> {
  const startTime = performance.now();
  
  try {
    const result = await fn();
    const durationMs = Math.round(performance.now() - startTime);
    
    apiLogger.debug(`${operation} completed`, {
      operation,
      durationMs,
      ...metadata,
    });
    
    return { result, durationMs };
  } catch (error) {
    const durationMs = Math.round(performance.now() - startTime);
    
    apiLogger.error(`${operation} failed`, error as Error, {
      operation,
      durationMs,
      ...metadata,
    });
    
    throw error;
  }
}

/**
 * Time a sync operation
 */
export function timeSync<T>(
  operation: string,
  fn: () => T,
  metadata?: Record<string, unknown>
): TimingResult<T> {
  const startTime = performance.now();
  
  try {
    const result = fn();
    const durationMs = Math.round(performance.now() - startTime);
    
    apiLogger.debug(`${operation} completed`, {
      operation,
      durationMs,
      ...metadata,
    });
    
    return { result, durationMs };
  } catch (error) {
    const durationMs = Math.round(performance.now() - startTime);
    
    apiLogger.error(`${operation} failed`, error as Error, {
      operation,
      durationMs,
      ...metadata,
    });
    
    throw error;
  }
}

/**
 * Create a timer for manual timing control
 */
export function createTimer(operation: string, metadata?: Record<string, unknown>) {
  const startTime = performance.now();
  let transaction: Transaction | null = null;
  
  return {
    start() {
      transaction = startTransaction(operation, "function");
    },
    
    checkpoint(name: string) {
      const elapsed = Math.round(performance.now() - startTime);
      apiLogger.debug(`${operation}:${name}`, {
        operation,
        checkpoint: name,
        elapsedMs: elapsed,
        ...metadata,
      });
    },
    
    end(status: "ok" | "error" = "ok") {
      const durationMs = Math.round(performance.now() - startTime);
      
      if (transaction) {
        transaction.finish(status);
      }
      
      const logFn = status === "ok" ? apiLogger.info.bind(apiLogger) : apiLogger.error.bind(apiLogger);
      logFn(`${operation} ${status === "ok" ? "completed" : "failed"}`, {
        operation,
        durationMs,
        status,
        ...metadata,
      });
      
      return durationMs;
    },
  };
}

/**
 * Job timing wrapper with detailed logging
 */
export async function timeJob<T>(
  jobName: string,
  fn: () => Promise<T>,
  metadata?: Record<string, unknown>
): Promise<{ result: T; durationMs: number; success: boolean }> {
  const startTime = performance.now();
  const transaction = startTransaction(jobName, "job");
  
  jobLogger.info(`Job started: ${jobName}`, { jobName, ...metadata });
  
  try {
    const result = await fn();
    const durationMs = Math.round(performance.now() - startTime);
    
    transaction.finish("ok");
    
    jobLogger.info(`Job completed: ${jobName}`, {
      jobName,
      durationMs,
      success: true,
      ...metadata,
    });
    
    return { result, durationMs, success: true };
  } catch (error) {
    const durationMs = Math.round(performance.now() - startTime);
    
    transaction.finish("error");
    
    jobLogger.error(`Job failed: ${jobName}`, error as Error, {
      jobName,
      durationMs,
      success: false,
      ...metadata,
    });
    
    throw error;
  }
}

/**
 * Route timing wrapper
 */
export function createRouteTimer(
  method: string,
  path: string,
  metadata?: Record<string, unknown>
) {
  const startTime = performance.now();
  const transaction = startTransaction(`${method} ${path}`, "http.server");
  
  return {
    addContext(ctx: Record<string, unknown>) {
      Object.assign(metadata ?? {}, ctx);
    },
    
    startSpan(name: string): Span {
      return transaction.startSpan(name);
    },
    
    finish(statusCode: number) {
      const durationMs = Math.round(performance.now() - startTime);
      const status = statusCode >= 400 ? "error" : "ok";
      
      transaction.finish(status);
      
      const logLevel = statusCode >= 500 ? "error" : statusCode >= 400 ? "warn" : "info";
      const logFn = apiLogger[logLevel].bind(apiLogger);
      
      logFn(`${method} ${path}`, {
        method,
        path,
        statusCode,
        durationMs,
        ...metadata,
      });
      
      return durationMs;
    },
  };
}

/**
 * Database query timing
 */
export async function timeQuery<T>(
  queryName: string,
  fn: () => Promise<T>
): Promise<T> {
  const startTime = performance.now();
  
  try {
    const result = await fn();
    const durationMs = Math.round(performance.now() - startTime);
    
    // Warn on slow queries (>1s)
    if (durationMs > 1000) {
      apiLogger.warn(`Slow query: ${queryName}`, {
        query: queryName,
        durationMs,
      });
    } else {
      apiLogger.debug(`Query: ${queryName}`, {
        query: queryName,
        durationMs,
      });
    }
    
    return result;
  } catch (error) {
    const durationMs = Math.round(performance.now() - startTime);
    
    apiLogger.error(`Query failed: ${queryName}`, error as Error, {
      query: queryName,
      durationMs,
    });
    
    throw error;
  }
}

/**
 * External API call timing
 */
export async function timeExternalCall<T>(
  service: string,
  operation: string,
  fn: () => Promise<T>
): Promise<T> {
  const startTime = performance.now();
  
  try {
    const result = await fn();
    const durationMs = Math.round(performance.now() - startTime);
    
    apiLogger.info(`External call: ${service}.${operation}`, {
      service,
      operation,
      durationMs,
      success: true,
    });
    
    return result;
  } catch (error) {
    const durationMs = Math.round(performance.now() - startTime);
    
    apiLogger.error(`External call failed: ${service}.${operation}`, error as Error, {
      service,
      operation,
      durationMs,
      success: false,
    });
    
    throw error;
  }
}
