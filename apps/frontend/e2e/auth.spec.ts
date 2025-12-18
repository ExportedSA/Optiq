import { test, expect } from "@playwright/test";

/**
 * E2E Tests: Authentication Flow
 * 
 * Tests signup, login, and logout functionality.
 */

test.describe("Authentication", () => {
  const testEmail = `e2e-auth-${Date.now()}@optiq.test`;
  const testPassword = "TestPassword123!";
  const testName = "E2E Auth User";

  test("should show signin page", async ({ page }) => {
    await page.goto("/signin");
    
    await expect(page.locator("h1, h2").first()).toContainText(/sign in|login/i);
    await expect(page.locator('input[name="email"], input[type="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"], input[type="password"]')).toBeVisible();
  });

  test("should show signup page", async ({ page }) => {
    await page.goto("/signup");
    
    await expect(page.locator("h1, h2").first()).toContainText(/sign up|create|register/i);
    await expect(page.locator('input[name="email"], input[type="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"], input[type="password"]')).toBeVisible();
  });

  test("should show validation errors for invalid input", async ({ page }) => {
    await page.goto("/signin");
    
    // Submit empty form
    await page.click('button[type="submit"]');
    
    // Should show validation error
    await expect(page.locator("text=/required|invalid|enter/i").first()).toBeVisible({ timeout: 5000 });
  });

  test("should show error for invalid credentials", async ({ page }) => {
    await page.goto("/signin");
    
    await page.fill('input[name="email"], input[type="email"]', "invalid@example.com");
    await page.fill('input[name="password"], input[type="password"]', "wrongpassword");
    await page.click('button[type="submit"]');
    
    // Should show error message
    await expect(page.locator("text=/invalid|incorrect|failed|error/i").first()).toBeVisible({ timeout: 10000 });
  });

  test.describe("Full auth flow", () => {
    test("should complete signup → login → logout flow", async ({ page }) => {
      // Step 1: Sign up
      await page.goto("/signup");
      
      // Fill signup form
      const nameInput = page.locator('input[name="name"]');
      if (await nameInput.isVisible()) {
        await nameInput.fill(testName);
      }
      
      await page.fill('input[name="email"], input[type="email"]', testEmail);
      await page.fill('input[name="password"], input[type="password"]', testPassword);
      
      const confirmInput = page.locator('input[name="confirmPassword"]');
      if (await confirmInput.isVisible()) {
        await confirmInput.fill(testPassword);
      }
      
      await page.click('button[type="submit"]');
      
      // Should redirect to app or onboarding
      await page.waitForURL(/\/(app|onboarding)/, { timeout: 15000 });
      
      // Step 2: Logout
      // Look for logout button or user menu
      const userMenu = page.locator('[data-testid="user-menu"], button:has-text("Account"), button:has-text("Profile")');
      if (await userMenu.isVisible()) {
        await userMenu.click();
      }
      
      const logoutButton = page.locator('button:has-text("Sign out"), button:has-text("Logout"), a:has-text("Sign out")');
      if (await logoutButton.isVisible()) {
        await logoutButton.click();
        await page.waitForURL(/\/(signin|login|\/)/, { timeout: 10000 });
      } else {
        // Direct signout
        await page.goto("/api/auth/signout");
        const confirmButton = page.locator('button:has-text("Sign out")');
        if (await confirmButton.isVisible()) {
          await confirmButton.click();
        }
      }
      
      // Step 3: Login with created account
      await page.goto("/signin");
      await page.fill('input[name="email"], input[type="email"]', testEmail);
      await page.fill('input[name="password"], input[type="password"]', testPassword);
      await page.click('button[type="submit"]');
      
      // Should redirect to app
      await page.waitForURL(/\/app/, { timeout: 15000 });
      
      // Verify we're logged in
      await expect(page).toHaveURL(/\/app/);
    });
  });
});
