import "server-only";

import type { AggregatedMetricsRow, CachedMetrics } from "./types";

const DEFAULT_TTL_MS = 5 * 60 * 1000;

const memoryCache = new Map<string, CachedMetrics>();

export interface CacheOptions {
  ttlMs?: number;
}

export class MetricsCache {
  private readonly ttlMs: number;

  constructor(options: CacheOptions = {}) {
    this.ttlMs = options.ttlMs ?? DEFAULT_TTL_MS;
  }

  get(key: string): AggregatedMetricsRow[] | null {
    const cached = memoryCache.get(key);

    if (!cached) return null;

    if (new Date() > cached.expiresAt) {
      memoryCache.delete(key);
      return null;
    }

    return cached.data;
  }

  set(key: string, data: AggregatedMetricsRow[], ttlMs?: number): void {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + (ttlMs ?? this.ttlMs));

    memoryCache.set(key, {
      key,
      data,
      computedAt: now,
      expiresAt,
    });
  }

  invalidate(key: string): boolean {
    return memoryCache.delete(key);
  }

  invalidatePattern(pattern: string): number {
    let count = 0;
    const regex = new RegExp(pattern.replace(/\*/g, ".*"));

    for (const key of memoryCache.keys()) {
      if (regex.test(key)) {
        memoryCache.delete(key);
        count++;
      }
    }

    return count;
  }

  invalidateOrganization(organizationId: string): number {
    return this.invalidatePattern(`metrics:${organizationId}:.*`);
  }

  clear(): void {
    memoryCache.clear();
  }

  size(): number {
    return memoryCache.size;
  }

  prune(): number {
    const now = new Date();
    let pruned = 0;

    for (const [key, cached] of memoryCache.entries()) {
      if (now > cached.expiresAt) {
        memoryCache.delete(key);
        pruned++;
      }
    }

    return pruned;
  }

  getStats(): {
    size: number;
    keys: string[];
    oldestEntry: Date | null;
    newestEntry: Date | null;
  } {
    let oldest: Date | null = null;
    let newest: Date | null = null;

    for (const cached of memoryCache.values()) {
      if (!oldest || cached.computedAt < oldest) oldest = cached.computedAt;
      if (!newest || cached.computedAt > newest) newest = cached.computedAt;
    }

    return {
      size: memoryCache.size,
      keys: Array.from(memoryCache.keys()),
      oldestEntry: oldest,
      newestEntry: newest,
    };
  }
}

export const metricsCache = new MetricsCache();
