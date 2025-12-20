/**
 * Encryption utilities for sensitive data
 */
/**
 * Encrypt a string
 */
export declare function encryptString(text: string): string;
/**
 * Decrypt a string
 */
export declare function decryptString(encryptedText: string): string;
/**
 * Hash a string (one-way, for IP addresses, etc.)
 */
export declare function hashString(text: string, salt?: string): string;
//# sourceMappingURL=encryption.d.ts.map