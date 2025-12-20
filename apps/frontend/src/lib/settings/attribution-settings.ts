/**
 * Attribution Settings
 * 
 * Manages default attribution model and settings for organizations
 */

import "server-only";
import { prisma } from "@/lib/prisma";
import type { AttributionModel } from "@prisma/client";

export interface AttributionSettings {
  defaultModel: AttributionModel;
  lookbackDays: number;
  enabledModels: AttributionModel[];
}

export const DEFAULT_ATTRIBUTION_SETTINGS: AttributionSettings = {
  defaultModel: "LAST_TOUCH",
  lookbackDays: 30,
  enabledModels: ["FIRST_TOUCH", "LAST_TOUCH", "LINEAR", "TIME_DECAY", "POSITION_BASED"],
};

/**
 * Get attribution settings for an organization
 */
export async function getAttributionSettings(
  organizationId: string
): Promise<AttributionSettings> {
  const settings = await prisma.organizationSettings.findUnique({
    where: { organizationId },
    select: { attributionSettings: true },
  });

  if (!settings?.attributionSettings) {
    return DEFAULT_ATTRIBUTION_SETTINGS;
  }

  const parsed = settings.attributionSettings as Partial<AttributionSettings>;

  return {
    defaultModel: parsed.defaultModel ?? DEFAULT_ATTRIBUTION_SETTINGS.defaultModel,
    lookbackDays: parsed.lookbackDays ?? DEFAULT_ATTRIBUTION_SETTINGS.lookbackDays,
    enabledModels: parsed.enabledModels ?? DEFAULT_ATTRIBUTION_SETTINGS.enabledModels,
  };
}

/**
 * Update attribution settings for an organization
 */
export async function updateAttributionSettings(
  organizationId: string,
  settings: Partial<AttributionSettings>
): Promise<void> {
  const current = await getAttributionSettings(organizationId);

  const updated: AttributionSettings = {
    defaultModel: settings.defaultModel ?? current.defaultModel,
    lookbackDays: settings.lookbackDays ?? current.lookbackDays,
    enabledModels: settings.enabledModels ?? current.enabledModels,
  };

  await prisma.organizationSettings.upsert({
    where: { organizationId },
    create: {
      organizationId,
      attributionSettings: updated as any,
    },
    update: {
      attributionSettings: updated as any,
    },
  });
}

/**
 * Get default attribution model for an organization
 */
export async function getDefaultAttributionModel(
  organizationId: string
): Promise<AttributionModel> {
  const settings = await getAttributionSettings(organizationId);
  return settings.defaultModel;
}

/**
 * Validate attribution model is enabled for organization
 */
export async function isAttributionModelEnabled(
  organizationId: string,
  model: AttributionModel
): Promise<boolean> {
  const settings = await getAttributionSettings(organizationId);
  return settings.enabledModels.includes(model);
}
