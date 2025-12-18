import crypto from "node:crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Identity signals that can be used to identify a visitor
 */
export interface IdentitySignals {
  anonymousId?: string;
  deviceId?: string;
  emailHash?: string;
  phoneHash?: string;
  customerId?: string;
  externalId?: string;
}

/**
 * Identity resolution result
 */
export interface IdentityResolution {
  identityKey: string;
  identityId: string;
  isNew: boolean;
  mergedFrom?: string[];
}

/**
 * Generate a deterministic identity key from signals
 * Priority: emailHash > phoneHash > customerId > deviceId > anonymousId
 */
function generateIdentityKey(signals: IdentitySignals): string {
  // Use the strongest available identifier
  if (signals.emailHash) {
    return `email:${signals.emailHash}`;
  }
  if (signals.phoneHash) {
    return `phone:${signals.phoneHash}`;
  }
  if (signals.customerId) {
    return `customer:${signals.customerId}`;
  }
  if (signals.deviceId) {
    return `device:${signals.deviceId}`;
  }
  if (signals.anonymousId) {
    return `anon:${signals.anonymousId}`;
  }
  
  // Fallback: generate random key
  return `temp:${crypto.randomUUID()}`;
}

/**
 * Find existing identities that match any of the provided signals
 */
async function findMatchingIdentities(
  organizationId: string,
  siteId: string,
  signals: IdentitySignals,
): Promise<string[]> {
  const conditions: any[] = [];

  if (signals.emailHash) {
    conditions.push({ emailHash: signals.emailHash });
  }
  if (signals.phoneHash) {
    conditions.push({ phoneHash: signals.phoneHash });
  }
  if (signals.customerId) {
    conditions.push({ customerId: signals.customerId });
  }
  if (signals.externalId) {
    conditions.push({ externalId: signals.externalId });
  }
  if (signals.deviceId) {
    conditions.push({ deviceId: signals.deviceId });
  }
  if (signals.anonymousId) {
    conditions.push({ anonymousId: signals.anonymousId });
  }

  if (conditions.length === 0) {
    return [];
  }

  const identities = await prisma.identity.findMany({
    where: {
      organizationId,
      siteId,
      OR: conditions,
    },
    select: {
      id: true,
      identityKey: true,
    },
  });

  return identities.map((i) => i.id);
}

/**
 * Merge multiple identities into a single canonical identity
 */
async function mergeIdentities(
  organizationId: string,
  siteId: string,
  identityIds: string[],
  signals: IdentitySignals,
  mergeReason: string,
): Promise<string> {
  // Get all identities with their aliases
  const identities = await prisma.identity.findMany({
    where: {
      id: { in: identityIds },
    },
    include: {
      aliases: true,
    },
    orderBy: {
      firstSeenAt: "asc", // Oldest identity becomes the target
    },
  });

  if (identities.length === 0) {
    throw new Error("No identities found to merge");
  }

  if (identities.length === 1) {
    // No merge needed, just update the identity
    return identities[0].id;
  }

  // Target identity (oldest one)
  const targetIdentity = identities[0];
  const sourceIdentities = identities.slice(1);

  // Merge all signals into target identity
  const mergedSignals: IdentitySignals = {
    anonymousId: targetIdentity.anonymousId ?? undefined,
    deviceId: targetIdentity.deviceId ?? undefined,
    emailHash: targetIdentity.emailHash ?? undefined,
    phoneHash: targetIdentity.phoneHash ?? undefined,
    customerId: targetIdentity.customerId ?? undefined,
    externalId: targetIdentity.externalId ?? undefined,
  };

  // Collect all aliases
  const allAliases = new Map<string, { type: string; value: string; firstSeen: Date; lastSeen: Date }>();

  // Add target's aliases
  for (const alias of targetIdentity.aliases) {
    const key = `${alias.aliasType}:${alias.aliasValue}`;
    allAliases.set(key, {
      type: alias.aliasType,
      value: alias.aliasValue,
      firstSeen: alias.firstSeenAt,
      lastSeen: alias.lastSeenAt,
    });
  }

  // Merge source identities
  for (const sourceIdentity of sourceIdentities) {
    // Merge signals (prefer non-null values)
    if (sourceIdentity.anonymousId && !mergedSignals.anonymousId) {
      mergedSignals.anonymousId = sourceIdentity.anonymousId;
    }
    if (sourceIdentity.deviceId && !mergedSignals.deviceId) {
      mergedSignals.deviceId = sourceIdentity.deviceId;
    }
    if (sourceIdentity.emailHash && !mergedSignals.emailHash) {
      mergedSignals.emailHash = sourceIdentity.emailHash;
    }
    if (sourceIdentity.phoneHash && !mergedSignals.phoneHash) {
      mergedSignals.phoneHash = sourceIdentity.phoneHash;
    }
    if (sourceIdentity.customerId && !mergedSignals.customerId) {
      mergedSignals.customerId = sourceIdentity.customerId;
    }
    if (sourceIdentity.externalId && !mergedSignals.externalId) {
      mergedSignals.externalId = sourceIdentity.externalId;
    }

    // Merge aliases
    for (const alias of sourceIdentity.aliases) {
      const key = `${alias.aliasType}:${alias.aliasValue}`;
      const existing = allAliases.get(key);
      
      if (!existing) {
        allAliases.set(key, {
          type: alias.aliasType,
          value: alias.aliasValue,
          firstSeen: alias.firstSeenAt,
          lastSeen: alias.lastSeenAt,
        });
      } else {
        // Update timestamps if needed
        if (alias.firstSeenAt < existing.firstSeen) {
          existing.firstSeen = alias.firstSeenAt;
        }
        if (alias.lastSeenAt > existing.lastSeen) {
          existing.lastSeen = alias.lastSeenAt;
        }
      }
    }
  }

  // Apply new signals
  if (signals.anonymousId && !mergedSignals.anonymousId) {
    mergedSignals.anonymousId = signals.anonymousId;
  }
  if (signals.deviceId && !mergedSignals.deviceId) {
    mergedSignals.deviceId = signals.deviceId;
  }
  if (signals.emailHash) {
    mergedSignals.emailHash = signals.emailHash;
  }
  if (signals.phoneHash) {
    mergedSignals.phoneHash = signals.phoneHash;
  }
  if (signals.customerId) {
    mergedSignals.customerId = signals.customerId;
  }
  if (signals.externalId) {
    mergedSignals.externalId = signals.externalId;
  }

  // Generate new identity key based on merged signals
  const newIdentityKey = generateIdentityKey(mergedSignals);

  // Determine matching field for audit
  let matchingField: string | null = null;
  let matchingValue: string | null = null;

  if (mergeReason === "emailHash" && signals.emailHash) {
    matchingField = "emailHash";
    matchingValue = signals.emailHash;
  } else if (mergeReason === "phoneHash" && signals.phoneHash) {
    matchingField = "phoneHash";
    matchingValue = signals.phoneHash;
  } else if (mergeReason === "customerId" && signals.customerId) {
    matchingField = "customerId";
    matchingValue = signals.customerId;
  }

  // Perform merge in transaction
  await prisma.$transaction(async (tx) => {
    // Update target identity with merged signals
    await tx.identity.update({
      where: { id: targetIdentity.id },
      data: {
        identityKey: newIdentityKey,
        anonymousId: mergedSignals.anonymousId,
        deviceId: mergedSignals.deviceId,
        emailHash: mergedSignals.emailHash,
        phoneHash: mergedSignals.phoneHash,
        customerId: mergedSignals.customerId,
        externalId: mergedSignals.externalId,
        lastSeenAt: new Date(),
      },
    });

    // Delete old aliases for target
    await tx.identityAlias.deleteMany({
      where: { identityId: targetIdentity.id },
    });

    // Create merged aliases
    for (const alias of allAliases.values()) {
      await tx.identityAlias.create({
        data: {
          identityId: targetIdentity.id,
          aliasType: alias.type,
          aliasValue: alias.value,
          firstSeenAt: alias.firstSeen,
          lastSeenAt: alias.lastSeen,
        },
      });
    }

    // Create merge audit records
    for (const sourceIdentity of sourceIdentities) {
      await tx.identityMerge.create({
        data: {
          organizationId,
          sourceIdentityId: sourceIdentity.id,
          targetIdentityId: targetIdentity.id,
          mergeReason,
          matchingField,
          matchingValue,
          sourceAliasCount: sourceIdentity.aliases.length,
          targetAliasCount: allAliases.size,
        },
      });
    }

    // Delete source identities
    await tx.identity.deleteMany({
      where: {
        id: { in: sourceIdentities.map((i) => i.id) },
      },
    });
  });

  return targetIdentity.id;
}

/**
 * Create a new identity with aliases
 */
async function createIdentity(
  organizationId: string,
  siteId: string,
  signals: IdentitySignals,
): Promise<string> {
  const identityKey = generateIdentityKey(signals);

  const identity = await prisma.identity.create({
    data: {
      organizationId,
      siteId,
      identityKey,
      anonymousId: signals.anonymousId,
      deviceId: signals.deviceId,
      emailHash: signals.emailHash,
      phoneHash: signals.phoneHash,
      customerId: signals.customerId,
      externalId: signals.externalId,
      eventCount: 0,
    },
  });

  // Create aliases for all non-null signals
  const aliases: { type: string; value: string }[] = [];

  if (signals.anonymousId) {
    aliases.push({ type: "anonymousId", value: signals.anonymousId });
  }
  if (signals.deviceId) {
    aliases.push({ type: "deviceId", value: signals.deviceId });
  }
  if (signals.emailHash) {
    aliases.push({ type: "emailHash", value: signals.emailHash });
  }
  if (signals.phoneHash) {
    aliases.push({ type: "phoneHash", value: signals.phoneHash });
  }
  if (signals.customerId) {
    aliases.push({ type: "customerId", value: signals.customerId });
  }
  if (signals.externalId) {
    aliases.push({ type: "externalId", value: signals.externalId });
  }

  for (const alias of aliases) {
    await prisma.identityAlias.create({
      data: {
        identityId: identity.id,
        aliasType: alias.type,
        aliasValue: alias.value,
      },
    });
  }

  return identity.id;
}

/**
 * Resolve identity from signals
 * 
 * This is the main entry point for identity resolution.
 * It will find or create an identity and merge if necessary.
 */
export async function resolveIdentity(
  organizationId: string,
  siteId: string,
  signals: IdentitySignals,
): Promise<IdentityResolution> {
  // Find matching identities
  const matchingIdentityIds = await findMatchingIdentities(organizationId, siteId, signals);

  if (matchingIdentityIds.length === 0) {
    // No existing identity, create new one
    const identityId = await createIdentity(organizationId, siteId, signals);
    const identityKey = generateIdentityKey(signals);

    return {
      identityKey,
      identityId,
      isNew: true,
    };
  }

  if (matchingIdentityIds.length === 1) {
    // Single match, update it
    const identityId = matchingIdentityIds[0];

    // Update last seen and add any new aliases
    await prisma.identity.update({
      where: { id: identityId },
      data: {
        lastSeenAt: new Date(),
        eventCount: { increment: 1 },
        // Update signals if they're stronger
        ...(signals.emailHash && { emailHash: signals.emailHash }),
        ...(signals.phoneHash && { phoneHash: signals.phoneHash }),
        ...(signals.customerId && { customerId: signals.customerId }),
        ...(signals.externalId && { externalId: signals.externalId }),
      },
    });

    // Add new aliases if they don't exist
    const existingAliases = await prisma.identityAlias.findMany({
      where: { identityId },
      select: { aliasType: true, aliasValue: true },
    });

    const existingAliasKeys = new Set(
      existingAliases.map((a) => `${a.aliasType}:${a.aliasValue}`),
    );

    const newAliases: { type: string; value: string }[] = [];

    if (signals.anonymousId && !existingAliasKeys.has(`anonymousId:${signals.anonymousId}`)) {
      newAliases.push({ type: "anonymousId", value: signals.anonymousId });
    }
    if (signals.deviceId && !existingAliasKeys.has(`deviceId:${signals.deviceId}`)) {
      newAliases.push({ type: "deviceId", value: signals.deviceId });
    }
    if (signals.emailHash && !existingAliasKeys.has(`emailHash:${signals.emailHash}`)) {
      newAliases.push({ type: "emailHash", value: signals.emailHash });
    }
    if (signals.phoneHash && !existingAliasKeys.has(`phoneHash:${signals.phoneHash}`)) {
      newAliases.push({ type: "phoneHash", value: signals.phoneHash });
    }
    if (signals.customerId && !existingAliasKeys.has(`customerId:${signals.customerId}`)) {
      newAliases.push({ type: "customerId", value: signals.customerId });
    }
    if (signals.externalId && !existingAliasKeys.has(`externalId:${signals.externalId}`)) {
      newAliases.push({ type: "externalId", value: signals.externalId });
    }

    for (const alias of newAliases) {
      await prisma.identityAlias.create({
        data: {
          identityId,
          aliasType: alias.type,
          aliasValue: alias.value,
        },
      });
    }

    const identity = await prisma.identity.findUnique({
      where: { id: identityId },
      select: { identityKey: true },
    });

    return {
      identityKey: identity!.identityKey,
      identityId,
      isNew: false,
    };
  }

  // Multiple matches - need to merge
  const mergeReason = signals.emailHash
    ? "emailHash"
    : signals.phoneHash
    ? "phoneHash"
    : signals.customerId
    ? "customerId"
    : "deviceId";

  const targetIdentityId = await mergeIdentities(
    organizationId,
    siteId,
    matchingIdentityIds,
    signals,
    mergeReason,
  );

  const identity = await prisma.identity.findUnique({
    where: { id: targetIdentityId },
    select: { identityKey: true },
  });

  return {
    identityKey: identity!.identityKey,
    identityId: targetIdentityId,
    isNew: false,
    mergedFrom: matchingIdentityIds.filter((id) => id !== targetIdentityId),
  };
}

/**
 * Get identity by key
 */
export async function getIdentityByKey(identityKey: string) {
  return prisma.identity.findUnique({
    where: { identityKey },
    include: {
      aliases: true,
    },
  });
}

/**
 * Get identity merge history
 */
export async function getIdentityMergeHistory(identityId: string) {
  return prisma.identityMerge.findMany({
    where: {
      OR: [
        { sourceIdentityId: identityId },
        { targetIdentityId: identityId },
      ],
    },
    orderBy: { mergedAt: "desc" },
  });
}
