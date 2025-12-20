/**
 * Encryption utilities for sensitive data
 */
import crypto from "crypto";
import { env } from "../env";
const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 64;
/**
 * Get encryption key from environment
 */
function getEncryptionKey() {
    if (!env.DATA_ENCRYPTION_KEY) {
        throw new Error("DATA_ENCRYPTION_KEY environment variable is not set");
    }
    // Derive a 32-byte key from the hex string
    return Buffer.from(env.DATA_ENCRYPTION_KEY, "hex").subarray(0, 32);
}
/**
 * Encrypt a string
 */
export function encryptString(text) {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    const authTag = cipher.getAuthTag();
    // Format: iv:authTag:encrypted
    return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
}
/**
 * Decrypt a string
 */
export function decryptString(encryptedText) {
    const key = getEncryptionKey();
    const parts = encryptedText.split(":");
    if (parts.length !== 3) {
        throw new Error("Invalid encrypted text format");
    }
    const iv = Buffer.from(parts[0], "hex");
    const authTag = Buffer.from(parts[1], "hex");
    const encrypted = parts[2];
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}
/**
 * Hash a string (one-way, for IP addresses, etc.)
 */
export function hashString(text, salt) {
    const actualSalt = salt || "default-salt";
    return crypto
        .createHash("sha256")
        .update(text + actualSalt)
        .digest("hex");
}
//# sourceMappingURL=encryption.js.map