/**
 * Prisma Seed Script
 * 
 * Seeds the database with sample data for local development.
 * Run with: npx prisma db seed
 */

import { PrismaClient, MembershipRole, PlatformCode, EntityStatus, TrackingEventType } from "@prisma/client";
import * as crypto from "crypto";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create platforms
  console.log("Creating platforms...");
  const platforms = await Promise.all([
    prisma.platform.upsert({
      where: { code: PlatformCode.META },
      update: {},
      create: { code: PlatformCode.META, name: "Meta Ads" },
    }),
    prisma.platform.upsert({
      where: { code: PlatformCode.GOOGLE_ADS },
      update: {},
      create: { code: PlatformCode.GOOGLE_ADS, name: "Google Ads" },
    }),
    prisma.platform.upsert({
      where: { code: PlatformCode.TIKTOK },
      update: {},
      create: { code: PlatformCode.TIKTOK, name: "TikTok Ads" },
    }),
  ]);

  // Create demo user
  console.log("Creating demo user...");
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@optiq.io" },
    update: {},
    create: {
      email: "demo@optiq.io",
      name: "Demo User",
      passwordHash: "$argon2id$v=19$m=65536,t=3,p=4$demo-password-hash", // Not a real hash
      emailVerified: new Date(),
    },
  });

  // Create demo organization
  console.log("Creating demo organization...");
  const demoOrg = await prisma.organization.upsert({
    where: { slug: "demo-org" },
    update: {},
    create: {
      name: "Demo Organization",
      slug: "demo-org",
    },
  });

  // Create membership
  await prisma.membership.upsert({
    where: {
      userId_organizationId: {
        userId: demoUser.id,
        organizationId: demoOrg.id,
      },
    },
    update: {},
    create: {
      userId: demoUser.id,
      organizationId: demoOrg.id,
      role: MembershipRole.OWNER,
    },
  });

  // Update user's active org
  await prisma.user.update({
    where: { id: demoUser.id },
    data: { activeOrgId: demoOrg.id },
  });

  // Create subscription (free tier)
  console.log("Creating subscription...");
  await prisma.subscription.upsert({
    where: { organizationId: demoOrg.id },
    update: {},
    create: {
      organizationId: demoOrg.id,
      plan: "FREE",
      status: "ACTIVE",
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      monthlyEventLimit: 1000,
      maxWorkspaces: 1,
      maxConnectors: 1,
    },
  });

  // Create tracking site
  console.log("Creating tracking site...");
  const trackingSite = await prisma.trackingSite.upsert({
    where: {
      organizationId_domain: {
        organizationId: demoOrg.id,
        domain: "demo.optiq.io",
      },
    },
    update: {},
    create: {
      organizationId: demoOrg.id,
      name: "Demo Website",
      domain: "demo.optiq.io",
      publicKey: `site_${crypto.randomBytes(16).toString("hex")}`,
    },
  });

  // Create sample ad account
  console.log("Creating sample ad account...");
  const metaPlatform = platforms.find((p) => p.code === PlatformCode.META)!;
  const adAccount = await prisma.adAccount.upsert({
    where: {
      organizationId_platformId_externalId: {
        organizationId: demoOrg.id,
        platformId: metaPlatform.id,
        externalId: "act_demo_123",
      },
    },
    update: {},
    create: {
      organizationId: demoOrg.id,
      platformId: metaPlatform.id,
      externalId: "act_demo_123",
      name: "Demo Meta Ad Account",
      currency: "USD",
      timezone: "America/New_York",
      status: EntityStatus.ACTIVE,
    },
  });

  // Create sample campaign
  console.log("Creating sample campaign...");
  const campaign = await prisma.campaign.upsert({
    where: {
      organizationId_platformId_externalId: {
        organizationId: demoOrg.id,
        platformId: metaPlatform.id,
        externalId: "camp_demo_456",
      },
    },
    update: {},
    create: {
      organizationId: demoOrg.id,
      platformId: metaPlatform.id,
      adAccountId: adAccount.id,
      externalId: "camp_demo_456",
      name: "Demo Campaign - Conversions",
      status: EntityStatus.ACTIVE,
      objective: "CONVERSIONS",
    },
  });

  // Create sample tracking events
  console.log("Creating sample tracking events...");
  const now = new Date();
  const eventTypes = [TrackingEventType.PAGE_VIEW, TrackingEventType.PAGE_VIEW, TrackingEventType.CONVERSION];
  
  for (let i = 0; i < 10; i++) {
    const eventDate = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const anonId = `anon_${crypto.randomBytes(8).toString("hex")}`;
    const sessionId = `sess_${crypto.randomBytes(8).toString("hex")}`;

    for (let j = 0; j < 5; j++) {
      const eventType = eventTypes[j % eventTypes.length];
      const eventId = `evt_${crypto.randomBytes(12).toString("hex")}`;

      await prisma.trackingEvent.upsert({
        where: {
          siteId_eventId: {
            siteId: trackingSite.id,
            eventId,
          },
        },
        update: {},
        create: {
          siteId: trackingSite.id,
          eventId,
          type: eventType,
          occurredAt: new Date(eventDate.getTime() + j * 60 * 1000),
          url: `https://demo.optiq.io/${eventType === TrackingEventType.CONVERSION ? "thank-you" : "page-" + j}`,
          path: eventType === TrackingEventType.CONVERSION ? "/thank-you" : `/page-${j}`,
          anonId,
          sessionId,
          utmSource: j === 0 ? "facebook" : undefined,
          utmMedium: j === 0 ? "cpc" : undefined,
          utmCampaign: j === 0 ? "demo_campaign" : undefined,
          valueMicros: eventType === TrackingEventType.CONVERSION ? BigInt(9999 * 10000) : undefined,
        },
      });
    }
  }

  // Create sample daily metrics
  console.log("Creating sample daily metrics...");
  for (let i = 0; i < 30; i++) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    date.setHours(0, 0, 0, 0);

    await prisma.dailyCampaignMetric.upsert({
      where: {
        organizationId_campaignId_date: {
          organizationId: demoOrg.id,
          campaignId: campaign.id,
          date,
        },
      },
      update: {},
      create: {
        organizationId: demoOrg.id,
        platformId: metaPlatform.id,
        adAccountId: adAccount.id,
        campaignId: campaign.id,
        date,
        impressions: BigInt(Math.floor(Math.random() * 10000) + 5000),
        clicks: BigInt(Math.floor(Math.random() * 500) + 100),
        spendMicros: BigInt((Math.floor(Math.random() * 100) + 50) * 1000000),
        conversions: BigInt(Math.floor(Math.random() * 20) + 5),
        revenueMicros: BigInt((Math.floor(Math.random() * 500) + 200) * 1000000),
      },
    });
  }

  // Create sample daily usage counters
  console.log("Creating sample usage counters...");
  for (let i = 0; i < 7; i++) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    date.setHours(0, 0, 0, 0);

    await prisma.dailyUsageCounter.upsert({
      where: {
        organizationId_date: {
          organizationId: demoOrg.id,
          date,
        },
      },
      update: {},
      create: {
        organizationId: demoOrg.id,
        date,
        pageViews: Math.floor(Math.random() * 100) + 50,
        conversions: Math.floor(Math.random() * 10) + 2,
        customEvents: Math.floor(Math.random() * 20) + 5,
        totalEvents: Math.floor(Math.random() * 130) + 57,
        activeConnectors: 1,
        activeCampaigns: 1,
      },
    });
  }

  console.log("✅ Database seeded successfully!");
  console.log(`
Demo credentials:
  Email: demo@optiq.io
  Organization: Demo Organization (demo-org)
  Tracking Site: demo.optiq.io
  `);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
