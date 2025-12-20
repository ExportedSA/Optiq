/**
 * Token Encryption Utilities
 * 
 * Encrypts and decrypts OAuth tokens for secure storage
 */

import "server-only";
import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 32;

/**
 * Get encryption key from environment
 */
function getEncryptionKey(): Buffer {
  const key = process.env.TOKEN_ENCRYPTION_KEY;
  if (!key) {
    throw new Error("TOKEN_ENCRYPTION_KEY environment variable is required");
  }
  
  // Key should be 32 bytes (64 hex chars) for AES-256
  if (key.length !== 64) {
    throw new Error("TOKEN_ENCRYPTION_KEY must be 64 hex characters (32 bytes)");
  }
  
  return Buffer.from(key, "hex");
}

/**
 * Encrypt a token
 */
export function encryptToken(plaintext: string): string {
  if (!plaintext) {
    throw new Error("Cannot encrypt empty token");
  }

  const key = getEncryptionKey();
  
  // Generate random IV
  const iv = crypto.randomBytes(IV_LENGTH);
  
  // Create cipher
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  // Encrypt
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  
  // Get auth tag
  const authTag = cipher.getAuthTag();
  
  // Combine: iv + authTag + encrypted
  const combined = Buffer.concat([iv, authTag, encrypted]);
  
  // Return as base64
  return combined.toString("base64");
}

/**
 * Decrypt a token
 */
export function decryptToken(ciphertext: string): string {
  if (!ciphertext) {
    throw new Error("Cannot decrypt empty ciphertext");
  }

  const key = getEncryptionKey();
  
  // Decode from base64
  const combined = Buffer.from(ciphertext, "base64");
  
  // Extract components
  const iv = combined.subarray(0, IV_LENGTH);
  const authTag = combined.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const encrypted = combined.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
  
  // Create decipher
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  
  // Decrypt
  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);
  
  return decrypted.toString("utf8");
}

/**
 * Generate a new encryption key (for setup)
 */
export function generateEncryptionKey(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Verify encryption/decryption works
 */
export function verifyEncryption(): boolean {
  try {
    const testData = "test-token-" + Date.now();
    const encrypted = encryptToken(testData);
    const decrypted = decryptToken(encrypted);
    return testData === decrypted;
  } catch (error) {
    return false;
  }
}
