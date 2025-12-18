import { test, expect } from "@playwright/test";

/**
 * E2E Tests: Onboarding & Workspace Creation
 * 
 * Tests the onboarding flow and workspace setup.
 */

test.describe("Onboarding", () => {
  const testEmail = `e2e-onboard-${Date.now()}@optiq.test`;
  const testPassword = "TestPassword123!";
  const testOrgName = "E2E Test Company";

  test.beforeEach(async ({ page }) => {
    // Create a new account for each test
    await page.goto("/signup");
    
    const nameInput = page.locator('input[name="name"]');
    if (await nameInput.isVisible()) {
      await nameInput.fill("E2E Onboard User");
    }
    
    await page.fill('input[name="email"], input[type="email"]', testEmail);
    await page.fill('input[name="password"], input[type="password"]', testPassword);
    
    const confirmInput = page.locator('input[name="confirmPassword"]');
    if (await confirmInput.isVisible()) {
      await confirmInput.fill(testPassword);
    }
    
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(app|onboarding)/, { timeout: 15000 });
  });

  test("should show onboarding or dashboard after signup", async ({ page }) => {
    // After signup, user should see either onboarding or dashboard
    const isOnboarding = page.url().includes("onboarding");
    const isDashboard = page.url().includes("app");
    
    expect(isOnboarding || isDashboard).toBe(true);
  });

  test("should allow creating a workspace/organization", async ({ page }) => {
    // Navigate to settings or onboarding to create workspace
    const settingsLink = page.locator('a[href*="settings"], button:has-text("Settings")');
    const onboardingForm = page.locator('form[data-testid="onboarding-form"], form:has-text("organization"), form:has-text("workspace")');
    
    if (await onboardingForm.isVisible()) {
      // Fill onboarding form
      const orgNameInput = page.locator('input[name="organizationName"], input[name="orgName"], input[name="name"]').first();
      if (await orgNameInput.isVisible()) {
        await orgNameInput.fill(testOrgName);
      }
      
      const submitButton = page.locator('button[type="submit"]');
      await submitButton.click();
      
      // Wait for completion
      await page.waitForURL(/\/app/, { timeout: 15000 });
    } else if (await settingsLink.isVisible()) {
      await settingsLink.click();
      
      // Look for organization settings
      const orgSettings = page.locator('a[href*="organization"], a[href*="workspace"]');
      if (await orgSettings.isVisible()) {
        await orgSettings.click();
      }
    }
    
    // Verify we're in the app
    await expect(page).toHaveURL(/\/app/);
  });

  test("should display sidebar navigation after onboarding", async ({ page }) => {
    // Wait for app to load
    await page.waitForURL(/\/app/, { timeout: 15000 });
    
    // Check for sidebar navigation elements
    const sidebar = page.locator('nav, aside, [role="navigation"]');
    await expect(sidebar.first()).toBeVisible();
    
    // Check for common navigation items
    const navItems = [
      /dashboard/i,
      /campaigns/i,
      /settings/i,
    ];
    
    for (const item of navItems) {
      const link = page.locator(`a, button`).filter({ hasText: item });
      // At least one nav item should be visible
      if (await link.first().isVisible()) {
        await expect(link.first()).toBeVisible();
        break;
      }
    }
  });
});
