import crypto from "node:crypto";
import { env } from "../env";
const ALGO = "aes-256-gcm";
const IV_LENGTH = 12;
function getKey() {
    const raw = env.DATA_ENCRYPTION_KEY;
    const key = Buffer.from(raw, "base64");
    if (key.length !== 32) {
        throw new Error("DATA_ENCRYPTION_KEY must be base64-encoded 32 bytes");
    }
    return key;
}
export function encryptString(plaintext) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGO, getKey(), iv);
    const ct = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
    const tag = cipher.getAuthTag();
    const payload = {
        v: 1,
        iv: iv.toString("base64"),
        tag: tag.toString("base64"),
        ct: ct.toString("base64"),
    };
    return Buffer.from(JSON.stringify(payload), "utf8").toString("base64");
}
export function decryptString(token) {
    const decoded = Buffer.from(token, "base64").toString("utf8");
    const payload = JSON.parse(decoded);
    if (payload.v !== 1)
        throw new Error("Unsupported encryption payload version");
    const iv = Buffer.from(payload.iv, "base64");
    const tag = Buffer.from(payload.tag, "base64");
    const ct = Buffer.from(payload.ct, "base64");
    const decipher = crypto.createDecipheriv(ALGO, getKey(), iv);
    decipher.setAuthTag(tag);
    const pt = Buffer.concat([decipher.update(ct), decipher.final()]);
    return pt.toString("utf8");
}
//# sourceMappingURL=crypto.js.map