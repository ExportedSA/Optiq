/**
 * Identity Resolution Tests
 * 
 * Tests for the identity resolution system including:
 * - Identity creation
 * - Identity matching
 * - Identity merging
 * - Alias management
 * - Audit trail
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { PrismaClient } from "@prisma/client";
import { resolveIdentity, getIdentityByKey, getIdentityMergeHistory } from "./identity-resolver";

const prisma = new PrismaClient();
let testOrganizationId: string;
let testSiteId: string;

beforeAll(async () => {
  // Create test organization
  const org = await prisma.organization.create({
    data: {
      name: "Test Organization",
      slug: "test-org-identity-" + Date.now(),
    },
  });
  testOrganizationId = org.id;

  // Create test tracking site
  const site = await prisma.trackingSite.create({
    data: {
      organizationId: testOrganizationId,
      name: "Test Site",
      domain: "example.com",
      publicKey: "test_identity_key_" + Date.now(),
    },
  });
  testSiteId = site.id;
});

afterAll(async () => {
  // Clean up test data
  await prisma.identityMerge.deleteMany({
    where: { organizationId: testOrganizationId },
  });
  await prisma.identityAlias.deleteMany({
    where: {
      identity: {
        organizationId: testOrganizationId,
      },
    },
  });
  await prisma.identity.deleteMany({
    where: { organizationId: testOrganizationId },
  });
  await prisma.trackingSite.delete({
    where: { id: testSiteId },
  });
  await prisma.organization.delete({
    where: { id: testOrganizationId },
  });

  await prisma.$disconnect();
});

beforeEach(async () => {
  // Clean up identities before each test
  await prisma.identityMerge.deleteMany({
    where: { organizationId: testOrganizationId },
  });
  await prisma.identityAlias.deleteMany({
    where: {
      identity: {
        organizationId: testOrganizationId,
      },
    },
  });
  await prisma.identity.deleteMany({
    where: { organizationId: testOrganizationId },
  });
});

describe("Identity Creation", () => {
  it("should create new identity with anonymous ID", async () => {
    const result = await resolveIdentity(testOrganizationId, testSiteId, {
      anonymousId: "anon_123",
    });

    expect(result.isNew).toBe(true);
    expect(result.identityKey).toBe("anon:anon_123");
    expect(result.identityId).toBeDefined();

    // Verify identity was created
    const identity = await getIdentityByKey(result.identityKey);
    expect(identity).not.toBeNull();
    expect(identity?.anonymousId).toBe("anon_123");
    expect(identity?.aliases).toHaveLength(1);
    expect(identity?.aliases[0].aliasType).toBe("anonymousId");
  });

  it("should create identity with email hash (highest priority)", async () => {
    const result = await resolveIdentity(testOrganizationId, testSiteId, {
      anonymousId: "anon_123",
      emailHash: "email_hash_123",
    });

    expect(result.isNew).toBe(true);
    expect(result.identityKey).toBe("email:email_hash_123");

    const identity = await getIdentityByKey(result.identityKey);
    expect(identity?.emailHash).toBe("email_hash_123");
    expect(identity?.anonymousId).toBe("anon_123");
    expect(identity?.aliases).toHaveLength(2);
  });

  it("should create identity with all signals", async () => {
    const result = await resolveIdentity(testOrganizationId, testSiteId, {
      anonymousId: "anon_123",
      deviceId: "device_123",
      emailHash: "email_hash_123",
      phoneHash: "phone_hash_123",
      customerId: "cust_123",
      externalId: "ext_123",
    });

    expect(result.isNew).toBe(true);
    expect(result.identityKey).toBe("email:email_hash_123"); // Email has highest priority

    const identity = await getIdentityByKey(result.identityKey);
    expect(identity?.aliases).toHaveLength(6);
  });
});

describe("Identity Matching", () => {
  it("should match existing identity by anonymous ID", async () => {
    // First visit
    const result1 = await resolveIdentity(testOrganizationId, testSiteId, {
      anonymousId: "anon_123",
    });

    expect(result1.isNew).toBe(true);

    // Second visit with same anonymous ID
    const result2 = await resolveIdentity(testOrganizationId, testSiteId, {
      anonymousId: "anon_123",
    });

    expect(result2.isNew).toBe(false);
    expect(result2.identityId).toBe(result1.identityId);
    expect(result2.identityKey).toBe(result1.identityKey);
  });

  it("should match existing identity by email hash", async () => {
    // First visit
    const result1 = await resolveIdentity(testOrganizationId, testSiteId, {
      anonymousId: "anon_123",
      emailHash: "email_hash_123",
    });

    // Second visit with different anonymous ID but same email
    const result2 = await resolveIdentity(testOrganizationId, testSiteId, {
      anonymousId: "anon_456",
      emailHash: "email_hash_123",
    });

    expect(result2.isNew).toBe(false);
    expect(result2.identityId).toBe(result1.identityId);
  });

  it("should add new alias to existing identity", async () => {
    // First visit
    const result1 = await resolveIdentity(testOrganizationId, testSiteId, {
      anonymousId: "anon_123",
    });

    const identity1 = await getIdentityByKey(result1.identityKey);
    expect(identity1?.aliases).toHaveLength(1);

    // Second visit adds device ID
    await resolveIdentity(testOrganizationId, testSiteId, {
      anonymousId: "anon_123",
      deviceId: "device_123",
    });

    const identity2 = await getIdentityByKey(result1.identityKey);
    expect(identity2?.aliases).toHaveLength(2);
  });
});

describe("Identity Merging", () => {
  it("should merge two identities when email hash is added", async () => {
    // First visit - anonymous only
    const result1 = await resolveIdentity(testOrganizationId, testSiteId, {
      anonymousId: "anon_123",
    });

    // Second visit - different anonymous ID
    const result2 = await resolveIdentity(testOrganizationId, testSiteId, {
      anonymousId: "anon_456",
    });

    expect(result1.identityId).not.toBe(result2.identityId);

    // Third visit - adds email hash that links both
    const result3 = await resolveIdentity(testOrganizationId, testSiteId, {
      anonymousId: "anon_123",
      emailHash: "email_hash_123",
    });

    // Fourth visit - same email with second anonymous ID
    const result4 = await resolveIdentity(testOrganizationId, testSiteId, {
      anonymousId: "anon_456",
      emailHash: "email_hash_123",
    });

    // Should be merged into same identity
    expect(result4.identityId).toBe(result3.identityId);
    expect(result4.mergedFrom).toBeDefined();

    // Verify merged identity has both anonymous IDs as aliases
    const mergedIdentity = await getIdentityByKey(result4.identityKey);
    expect(mergedIdentity?.aliases.length).toBeGreaterThanOrEqual(2);

    const aliasValues = mergedIdentity?.aliases.map((a) => a.aliasValue);
    expect(aliasValues).toContain("anon_123");
    expect(aliasValues).toContain("anon_456");
  });

  it("should create merge audit trail", async () => {
    // Create two separate identities
    const result1 = await resolveIdentity(testOrganizationId, testSiteId, {
      anonymousId: "anon_123",
    });

    const result2 = await resolveIdentity(testOrganizationId, testSiteId, {
      anonymousId: "anon_456",
    });

    // Merge them via email hash
    await resolveIdentity(testOrganizationId, testSiteId, {
      anonymousId: "anon_123",
      emailHash: "email_hash_123",
    });

    const result4 = await resolveIdentity(testOrganizationId, testSiteId, {
      anonymousId: "anon_456",
      emailHash: "email_hash_123",
    });

    // Check merge history
    const mergeHistory = await getIdentityMergeHistory(result4.identityId);
    expect(mergeHistory.length).toBeGreaterThan(0);

    const merge = mergeHistory[0];
    expect(merge.mergeReason).toBe("emailHash");
    expect(merge.matchingField).toBe("emailHash");
    expect(merge.matchingValue).toBe("email_hash_123");
  });

  it("should merge multiple identities into oldest one", async () => {
    // Create three identities at different times
    const result1 = await resolveIdentity(testOrganizationId, testSiteId, {
      anonymousId: "anon_1",
    });

    await new Promise((resolve) => setTimeout(resolve, 10));

    const result2 = await resolveIdentity(testOrganizationId, testSiteId, {
      anonymousId: "anon_2",
    });

    await new Promise((resolve) => setTimeout(resolve, 10));

    const result3 = await resolveIdentity(testOrganizationId, testSiteId, {
      anonymousId: "anon_3",
    });

    // Merge all three via customer ID
    const result4 = await resolveIdentity(testOrganizationId, testSiteId, {
      anonymousId: "anon_1",
      customerId: "cust_123",
    });

    const result5 = await resolveIdentity(testOrganizationId, testSiteId, {
      anonymousId: "anon_2",
      customerId: "cust_123",
    });

    const result6 = await resolveIdentity(testOrganizationId, testSiteId, {
      anonymousId: "anon_3",
      customerId: "cust_123",
    });

    // All should resolve to the same identity (the oldest one)
    expect(result6.identityId).toBe(result5.identityId);
    expect(result5.identityId).toBe(result4.identityId);

    // The target should be the first identity created
    expect(result6.identityId).toBe(result1.identityId);
  });
});

describe("Identity Key Priority", () => {
  it("should prioritize email hash over phone hash", async () => {
    const result = await resolveIdentity(testOrganizationId, testSiteId, {
      phoneHash: "phone_hash_123",
      emailHash: "email_hash_123",
    });

    expect(result.identityKey).toBe("email:email_hash_123");
  });

  it("should prioritize phone hash over customer ID", async () => {
    const result = await resolveIdentity(testOrganizationId, testSiteId, {
      customerId: "cust_123",
      phoneHash: "phone_hash_123",
    });

    expect(result.identityKey).toBe("phone:phone_hash_123");
  });

  it("should prioritize customer ID over device ID", async () => {
    const result = await resolveIdentity(testOrganizationId, testSiteId, {
      deviceId: "device_123",
      customerId: "cust_123",
    });

    expect(result.identityKey).toBe("customer:cust_123");
  });

  it("should prioritize device ID over anonymous ID", async () => {
    const result = await resolveIdentity(testOrganizationId, testSiteId, {
      anonymousId: "anon_123",
      deviceId: "device_123",
    });

    expect(result.identityKey).toBe("device:device_123");
  });
});

describe("Cross-Device Identity Resolution", () => {
  it("should link mobile and desktop sessions via email", async () => {
    // Desktop session
    const desktop = await resolveIdentity(testOrganizationId, testSiteId, {
      anonymousId: "desktop_anon_123",
      deviceId: "desktop_device_123",
    });

    // Mobile session
    const mobile = await resolveIdentity(testOrganizationId, testSiteId, {
      anonymousId: "mobile_anon_456",
      deviceId: "mobile_device_456",
    });

    expect(desktop.identityId).not.toBe(mobile.identityId);

    // User logs in on desktop
    const desktopLogin = await resolveIdentity(testOrganizationId, testSiteId, {
      anonymousId: "desktop_anon_123",
      emailHash: "user_email_hash",
    });

    // User logs in on mobile
    const mobileLogin = await resolveIdentity(testOrganizationId, testSiteId, {
      anonymousId: "mobile_anon_456",
      emailHash: "user_email_hash",
    });

    // Should be merged
    expect(mobileLogin.identityId).toBe(desktopLogin.identityId);

    // Verify both device IDs are preserved
    const identity = await getIdentityByKey(mobileLogin.identityKey);
    const aliasValues = identity?.aliases.map((a) => a.aliasValue);
    expect(aliasValues).toContain("desktop_device_123");
    expect(aliasValues).toContain("mobile_device_456");
  });
});

describe("Privacy and Security", () => {
  it("should only store hashed email, not plain text", async () => {
    const result = await resolveIdentity(testOrganizationId, testSiteId, {
      emailHash: "hashed_email_value",
    });

    const identity = await getIdentityByKey(result.identityKey);
    expect(identity?.emailHash).toBe("hashed_email_value");
    
    // Verify it's a hash (64 characters for SHA-256)
    expect(identity?.emailHash?.length).toBe(64);
  });

  it("should isolate identities by organization", async () => {
    // Create second organization
    const org2 = await prisma.organization.create({
      data: {
        name: "Test Organization 2",
        slug: "test-org-2-" + Date.now(),
      },
    });

    const site2 = await prisma.trackingSite.create({
      data: {
        organizationId: org2.id,
        name: "Test Site 2",
        domain: "example2.com",
        publicKey: "test_key_2_" + Date.now(),
      },
    });

    // Same email hash in different organizations
    const result1 = await resolveIdentity(testOrganizationId, testSiteId, {
      emailHash: "shared_email_hash",
    });

    const result2 = await resolveIdentity(org2.id, site2.id, {
      emailHash: "shared_email_hash",
    });

    // Should be different identities
    expect(result1.identityId).not.toBe(result2.identityId);

    // Cleanup
    await prisma.identity.deleteMany({ where: { organizationId: org2.id } });
    await prisma.trackingSite.delete({ where: { id: site2.id } });
    await prisma.organization.delete({ where: { id: org2.id } });
  });
});

describe("Event Count Tracking", () => {
  it("should increment event count on each resolution", async () => {
    const result1 = await resolveIdentity(testOrganizationId, testSiteId, {
      anonymousId: "anon_123",
    });

    let identity = await prisma.identity.findUnique({
      where: { id: result1.identityId },
    });
    expect(identity?.eventCount).toBe(0);

    // Second event
    await resolveIdentity(testOrganizationId, testSiteId, {
      anonymousId: "anon_123",
    });

    identity = await prisma.identity.findUnique({
      where: { id: result1.identityId },
    });
    expect(identity?.eventCount).toBe(1);

    // Third event
    await resolveIdentity(testOrganizationId, testSiteId, {
      anonymousId: "anon_123",
    });

    identity = await prisma.identity.findUnique({
      where: { id: result1.identityId },
    });
    expect(identity?.eventCount).toBe(2);
  });
});
