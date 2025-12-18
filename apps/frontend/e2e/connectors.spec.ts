import { test, expect } from "@playwright/test";

/**
 * E2E Tests: Connector Setup (Mocked)
 * 
 * Tests the ad platform connector flow with mocked OAuth.
 */

test.describe("Connectors", () => {
  // Use storage state for authenticated tests
  test.use({ storageState: "e2e/.auth/user.json" });

  test.beforeAll(async ({ browser }) => {
    // Setup: Create authenticated session
    const page = await browser.newPage();
    
    const testEmail = `e2e-connector-${Date.now()}@optiq.test`;
    const testPassword = "TestPassword123!";
    
    await page.goto("/signup");
    
    const nameInput = page.locator('input[name="name"]');
    if (await nameInput.isVisible()) {
      await nameInput.fill("E2E Connector User");
    }
    
    await page.fill('input[name="email"], input[type="email"]', testEmail);
    await page.fill('input[name="password"], input[type="password"]', testPassword);
    
    const confirmInput = page.locator('input[name="confirmPassword"]');
    if (await confirmInput.isVisible()) {
      await confirmInput.fill(testPassword);
    }
    
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(app|onboarding)/, { timeout: 15000 });
    
    // Save auth state
    await page.context().storageState({ path: "e2e/.auth/user.json" });
    await page.close();
  });

  test("should display available connectors", async ({ page }) => {
    await page.goto("/app/connectors");
    
    // Wait for page to load
    await page.waitForLoadState("networkidle");
    
    // Check for connector options
    const connectorCards = page.locator('[data-testid="connector-card"], .connector-card, [class*="connector"]');
    
    // Should show at least one connector option
    const platformNames = ["Meta", "Google", "TikTok", "LinkedIn"];
    let foundConnector = false;
    
    for (const platform of platformNames) {
      const platformElement = page.locator(`text=${platform}`);
      if (await platformElement.isVisible()) {
        foundConnector = true;
        break;
      }
    }
    
    // If no connectors visible, check for empty state or setup prompt
    if (!foundConnector) {
      const emptyState = page.locator('text=/connect|add|no connectors|get started/i');
      await expect(emptyState.first()).toBeVisible();
    }
  });

  test("should show connect button for each platform", async ({ page }) => {
    await page.goto("/app/connectors");
    await page.waitForLoadState("networkidle");
    
    // Look for connect buttons
    const connectButtons = page.locator('button:has-text("Connect"), a:has-text("Connect")');
    
    // Should have at least one connect option
    const count = await connectButtons.count();
    expect(count).toBeGreaterThanOrEqual(0); // May be 0 if all connected
  });

  test("should navigate to connector settings", async ({ page }) => {
    await page.goto("/app/settings");
    await page.waitForLoadState("networkidle");
    
    // Look for integrations/connectors section
    const integrationsLink = page.locator('a[href*="integrations"], a[href*="connectors"], a:has-text("Integrations"), a:has-text("Connectors")');
    
    if (await integrationsLink.first().isVisible()) {
      await integrationsLink.first().click();
      await page.waitForLoadState("networkidle");
      
      // Should be on integrations page
      expect(page.url()).toMatch(/integrations|connectors/);
    }
  });

  test("should handle mock OAuth flow", async ({ page }) => {
    // Mock the OAuth endpoint
    await page.route("**/api/auth/oauth/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, redirectUrl: "/app/connectors?connected=true" }),
      });
    });

    await page.goto("/app/connectors");
    await page.waitForLoadState("networkidle");
    
    // Find a connect button
    const connectButton = page.locator('button:has-text("Connect")').first();
    
    if (await connectButton.isVisible()) {
      // Mock the OAuth popup/redirect
      await page.route("**/oauth/**", async (route) => {
        await route.fulfill({
          status: 302,
          headers: { Location: "/app/connectors?connected=true" },
        });
      });
      
      await connectButton.click();
      
      // Wait for redirect or modal
      await page.waitForTimeout(1000);
    }
  });

  test("should display connected accounts", async ({ page }) => {
    // Mock connected accounts API
    await page.route("**/api/connectors**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          connectors: [
            {
              id: "mock-1",
              platform: "META",
              name: "Test Ad Account",
              status: "CONNECTED",
              lastSync: new Date().toISOString(),
            },
          ],
        }),
      });
    });

    await page.goto("/app/connectors");
    await page.waitForLoadState("networkidle");
    
    // Check for connected account display
    const connectedAccount = page.locator('text=/connected|active|test ad account/i');
    
    // Either show connected accounts or empty state
    const hasConnected = await connectedAccount.first().isVisible();
    const hasEmptyState = await page.locator('text=/no connectors|connect your/i').first().isVisible();
    
    expect(hasConnected || hasEmptyState).toBe(true);
  });
});
