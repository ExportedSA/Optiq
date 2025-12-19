#!/usr/bin/env node

/**
 * Wait for a service to be available on a given port
 * Usage: node wait-for-port.js <port> [host] [maxRetries]
 */

import { createConnection } from "net";

const PORT = parseInt(process.argv[2] || "3001", 10);
const HOST = process.argv[3] || "localhost";
const MAX_RETRIES = parseInt(process.argv[4] || "60", 10);
const RETRY_INTERVAL_MS = 1000;

async function waitForPort(host, port, maxRetries, intervalMs) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await new Promise((resolve, reject) => {
        const socket = createConnection({ host, port }, () => {
          socket.end();
          resolve();
        });
        socket.on("error", reject);
        socket.setTimeout(1000, () => {
          socket.destroy();
          reject(new Error("Connection timeout"));
        });
      });
      console.log(`✅ Service ready on ${host}:${port}`);
      return true;
    } catch {
      if (attempt === maxRetries) {
        console.error(`❌ Service not ready on ${host}:${port} after ${maxRetries} attempts`);
        process.exit(1);
      }
      if (attempt % 10 === 0) {
        console.log(`⏳ Waiting for ${host}:${port}... (attempt ${attempt}/${maxRetries})`);
      }
      await new Promise((r) => setTimeout(r, intervalMs));
    }
  }
  return false;
}

waitForPort(HOST, PORT, MAX_RETRIES, RETRY_INTERVAL_MS);
