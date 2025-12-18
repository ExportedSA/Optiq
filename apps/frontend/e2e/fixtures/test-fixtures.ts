import { test as base, expect } from "@playwright/test";

/**
 * Test Fixtures
 * 
 * Provides reusable test utilities and authenticated contexts.
 */

export interface TestUser {
  email: string;
  password: string;
  name: string;
}

export interface TestOrganization {
  name: string;
  slug: string;
}

// Test data
export const TEST_USER: TestUser = {
  email: `e2e-test-${Date.now()}@optiq.test`,
  password: "TestPassword123!",
  name: "E2E Test User",
};

export const TEST_ORG: TestOrganization = {
  name: "E2E Test Organization",
  slug: `e2e-test-org-${Date.now()}`,
};

// Extended test with fixtures
export const test = base.extend<{
  testUser: TestUser;
  testOrg: TestOrganization;
  authenticatedPage: typeof base;
}>({
  testUser: async ({}, use) => {
    await use(TEST_USER);
  },

  testOrg: async ({}, use) => {
    await use(TEST_ORG);
  },

  authenticatedPage: async ({ page, testUser }, use) => {
    // Login before test
    await page.goto("/signin");
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/app/);
    
    await use(base);
  },
});

export { expect };

// Helper functions
export async function createTestUser(page: any, user: TestUser) {
  await page.goto("/signup");
  await page.fill('input[name="name"]', user.name);
  await page.fill('input[name="email"]', user.email);
  await page.fill('input[name="password"]', user.password);
  await page.fill('input[name="confirmPassword"]', user.password);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/app|\/onboarding/);
}

export async function login(page: any, user: TestUser) {
  await page.goto("/signin");
  await page.fill('input[name="email"]', user.email);
  await page.fill('input[name="password"]', user.password);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/app/);
}

export async function logout(page: any) {
  await page.goto("/api/auth/signout");
  await page.click('button:has-text("Sign out")');
  await page.waitForURL(/\/signin/);
}

export async function waitForToast(page: any, text: string) {
  await page.waitForSelector(`text=${text}`, { timeout: 10000 });
}

export async function waitForApiResponse(page: any, urlPattern: string | RegExp) {
  return page.waitForResponse((response: any) => {
    const url = response.url();
    if (typeof urlPattern === "string") {
      return url.includes(urlPattern);
    }
    return urlPattern.test(url);
  });
}
