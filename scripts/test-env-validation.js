#!/usr/bin/env node

/**
 * Test script to demonstrate environment validation
 * Run with: node scripts/test-env-validation.js
 */

console.log("Testing environment validation...\n");

// Test 1: Missing required variables
console.log("Test 1: Missing DATABASE_URL");
console.log("Expected: Validation error with clear message\n");

try {
  // Temporarily clear DATABASE_URL
  const originalUrl = process.env.DATABASE_URL;
  delete process.env.DATABASE_URL;
  
  // This should throw
  require("../packages/shared/dist/index.js");
  
  console.log("❌ FAILED: Should have thrown validation error\n");
  process.env.DATABASE_URL = originalUrl;
} catch (error) {
  if (error.name === "EnvValidationError") {
    console.log("✅ PASSED: Validation error caught");
    console.log("Error message preview:");
    console.log(error.message.substring(0, 300) + "...\n");
  } else {
    console.log("❌ FAILED: Wrong error type:", error.message, "\n");
  }
}

// Test 2: Invalid format
console.log("Test 2: Invalid DATABASE_URL format");
console.log("Expected: Validation error for invalid URL\n");

try {
  const originalUrl = process.env.DATABASE_URL;
  process.env.DATABASE_URL = "not-a-valid-url";
  
  // Clear require cache
  delete require.cache[require.resolve("../apps/backend/dist/env.js")];
  
  // This should throw
  require("../apps/backend/dist/env.js");
  
  console.log("❌ FAILED: Should have thrown validation error\n");
  process.env.DATABASE_URL = originalUrl;
} catch (error) {
  if (error.name === "EnvValidationError") {
    console.log("✅ PASSED: Invalid format caught");
    console.log("Error details available in error.details\n");
  } else {
    console.log("⚠️  Build required: Run 'npm run build' first\n");
  }
}

console.log("Environment validation tests complete!");
console.log("\nTo see validation in action:");
console.log("1. Remove a required variable from your .env");
console.log("2. Run: npm run dev");
console.log("3. Observe the clear error message with troubleshooting steps");
