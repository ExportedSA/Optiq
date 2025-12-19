#!/usr/bin/env node

/**
 * Wait for PostgreSQL database to be ready
 * Used during development to ensure DB is up before starting services
 */

import { createConnection } from "net";

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = parseInt(process.env.DB_PORT || "5432", 10);
const MAX_RETRIES = 30;
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
      console.log(`✅ Database is ready on ${host}:${port}`);
      return true;
    } catch {
      if (attempt === maxRetries) {
        console.error(`❌ Database not ready after ${maxRetries} attempts`);
        process.exit(1);
      }
      console.log(`⏳ Waiting for database... (attempt ${attempt}/${maxRetries})`);
      await new Promise((r) => setTimeout(r, intervalMs));
    }
  }
  return false;
}

waitForPort(DB_HOST, DB_PORT, MAX_RETRIES, RETRY_INTERVAL_MS);
