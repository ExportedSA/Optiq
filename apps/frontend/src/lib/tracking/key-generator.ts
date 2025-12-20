/**
 * Tracking Site Key Generator
 * 
 * Generates secure, non-guessable public keys for tracking sites
 */

import "server-only";
import { randomBytes } from "crypto";

const KEY_PREFIX = "pk_";
const KEY_LENGTH = 32; // 32 bytes = 256 bits

/**
 * Generate a secure, non-guessable public key for a tracking site
 * 
 * Format: pk_<base64url>
 * Example: pk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
 */
export function generatePublicKey(): string {
  const buffer = randomBytes(KEY_LENGTH);
  const base64url = buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
  
  return `${KEY_PREFIX}${base64url}`;
}

/**
 * Validate public key format
 */
export function isValidPublicKey(key: string): boolean {
  if (!key.startsWith(KEY_PREFIX)) {
    return false;
  }

  const keyPart = key.slice(KEY_PREFIX.length);
  
  // Check length (base64url of 32 bytes is ~43 characters)
  if (keyPart.length < 40 || keyPart.length > 50) {
    return false;
  }

  // Check characters (base64url alphabet)
  const base64urlRegex = /^[A-Za-z0-9_-]+$/;
  return base64urlRegex.test(keyPart);
}
