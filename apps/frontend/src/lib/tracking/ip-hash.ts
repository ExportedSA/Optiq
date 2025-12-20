/**
 * IP Address Hashing
 * 
 * Hashes IP addresses for privacy compliance
 * Never stores raw IP addresses
 */

import "server-only";
import { createHash } from "crypto";

const HASH_ALGORITHM = "sha256";
const HASH_SALT = process.env.IP_HASH_SALT || "optiq-default-salt-change-in-production";

/**
 * Hash an IP address for privacy-safe storage
 * 
 * Uses SHA-256 with a salt to create a one-way hash
 * The hash can be used for:
 * - Deduplication
 * - Fraud detection
 * - Rate limiting
 * 
 * But cannot be reversed to get the original IP
 */
export function hashIpAddress(ip: string): string {
  if (!ip) {
    return "";
  }

  // Normalize IPv6 addresses
  const normalizedIp = normalizeIp(ip);

  // Create hash with salt
  const hash = createHash(HASH_ALGORITHM);
  hash.update(HASH_SALT);
  hash.update(normalizedIp);

  return hash.digest("hex");
}

/**
 * Normalize IP address for consistent hashing
 */
function normalizeIp(ip: string): string {
  // Remove IPv6 brackets if present
  let normalized = ip.replace(/^\[|\]$/g, "");

  // Convert IPv4-mapped IPv6 to IPv4
  // ::ffff:192.0.2.1 -> 192.0.2.1
  const ipv4MappedMatch = normalized.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/i);
  if (ipv4MappedMatch) {
    normalized = ipv4MappedMatch[1];
  }

  // Lowercase for consistency
  normalized = normalized.toLowerCase();

  return normalized;
}

/**
 * Extract IP address from request headers
 * Checks common proxy headers in order of preference
 */
export function getClientIp(request: Request): string | null {
  const headers = request.headers;

  // Check X-Forwarded-For (most common proxy header)
  const xForwardedFor = headers.get("x-forwarded-for");
  if (xForwardedFor) {
    // X-Forwarded-For can contain multiple IPs, take the first (client IP)
    const ips = xForwardedFor.split(",").map(ip => ip.trim());
    if (ips[0]) {
      return ips[0];
    }
  }

  // Check X-Real-IP (nginx)
  const xRealIp = headers.get("x-real-ip");
  if (xRealIp) {
    return xRealIp;
  }

  // Check CF-Connecting-IP (Cloudflare)
  const cfConnectingIp = headers.get("cf-connecting-ip");
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  // Check True-Client-IP (Akamai, Cloudflare Enterprise)
  const trueClientIp = headers.get("true-client-ip");
  if (trueClientIp) {
    return trueClientIp;
  }

  // Check X-Client-IP
  const xClientIp = headers.get("x-client-ip");
  if (xClientIp) {
    return xClientIp;
  }

  return null;
}
