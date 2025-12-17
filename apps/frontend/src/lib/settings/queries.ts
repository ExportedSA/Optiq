import "server-only";

import { prisma } from "@/lib/prisma";
import type { AlertSettings, AlertSettingsUpdate } from "./types";
import { DEFAULT_ALERT_SETTINGS } from "./types";

export async function getAlertSettings(organizationId: string): Promise<AlertSettings> {
  const settings = await prisma.organizationSettings.findUnique({
    where: { organizationId },
  });

  if (!settings) {
    return {
      organizationId,
      ...DEFAULT_ALERT_SETTINGS,
      updatedAt: new Date(),
    };
  }

  const alertSettings = settings.alertSettings as Record<string, unknown> | null;

  return {
    organizationId,
    wasteAlerts: {
      enabled: (alertSettings?.wasteAlerts as Record<string, unknown>)?.enabled as boolean ?? DEFAULT_ALERT_SETTINGS.wasteAlerts.enabled,
      thresholdLevel: (alertSettings?.wasteAlerts as Record<string, unknown>)?.thresholdLevel as AlertSettings["wasteAlerts"]["thresholdLevel"] ?? DEFAULT_ALERT_SETTINGS.wasteAlerts.thresholdLevel,
      notifyEmail: (alertSettings?.wasteAlerts as Record<string, unknown>)?.notifyEmail as boolean ?? DEFAULT_ALERT_SETTINGS.wasteAlerts.notifyEmail,
      notifyInApp: (alertSettings?.wasteAlerts as Record<string, unknown>)?.notifyInApp as boolean ?? DEFAULT_ALERT_SETTINGS.wasteAlerts.notifyInApp,
    },
    cpaAlerts: {
      enabled: (alertSettings?.cpaAlerts as Record<string, unknown>)?.enabled as boolean ?? DEFAULT_ALERT_SETTINGS.cpaAlerts.enabled,
      targetCpa: (alertSettings?.cpaAlerts as Record<string, unknown>)?.targetCpa as number ?? DEFAULT_ALERT_SETTINGS.cpaAlerts.targetCpa,
      warningThresholdPercent: (alertSettings?.cpaAlerts as Record<string, unknown>)?.warningThresholdPercent as number ?? DEFAULT_ALERT_SETTINGS.cpaAlerts.warningThresholdPercent,
      criticalThresholdPercent: (alertSettings?.cpaAlerts as Record<string, unknown>)?.criticalThresholdPercent as number ?? DEFAULT_ALERT_SETTINGS.cpaAlerts.criticalThresholdPercent,
      notifyEmail: (alertSettings?.cpaAlerts as Record<string, unknown>)?.notifyEmail as boolean ?? DEFAULT_ALERT_SETTINGS.cpaAlerts.notifyEmail,
      notifyInApp: (alertSettings?.cpaAlerts as Record<string, unknown>)?.notifyInApp as boolean ?? DEFAULT_ALERT_SETTINGS.cpaAlerts.notifyInApp,
    },
    performanceAlerts: {
      enabled: (alertSettings?.performanceAlerts as Record<string, unknown>)?.enabled as boolean ?? DEFAULT_ALERT_SETTINGS.performanceAlerts.enabled,
      conversionDropPercent: (alertSettings?.performanceAlerts as Record<string, unknown>)?.conversionDropPercent as number ?? DEFAULT_ALERT_SETTINGS.performanceAlerts.conversionDropPercent,
      windowDays: (alertSettings?.performanceAlerts as Record<string, unknown>)?.windowDays as number ?? DEFAULT_ALERT_SETTINGS.performanceAlerts.windowDays,
      notifyEmail: (alertSettings?.performanceAlerts as Record<string, unknown>)?.notifyEmail as boolean ?? DEFAULT_ALERT_SETTINGS.performanceAlerts.notifyEmail,
      notifyInApp: (alertSettings?.performanceAlerts as Record<string, unknown>)?.notifyInApp as boolean ?? DEFAULT_ALERT_SETTINGS.performanceAlerts.notifyInApp,
    },
    frequency: {
      minIntervalMinutes: (alertSettings?.frequency as Record<string, unknown>)?.minIntervalMinutes as number ?? DEFAULT_ALERT_SETTINGS.frequency.minIntervalMinutes,
      digestEnabled: (alertSettings?.frequency as Record<string, unknown>)?.digestEnabled as boolean ?? DEFAULT_ALERT_SETTINGS.frequency.digestEnabled,
      digestFrequency: (alertSettings?.frequency as Record<string, unknown>)?.digestFrequency as AlertSettings["frequency"]["digestFrequency"] ?? DEFAULT_ALERT_SETTINGS.frequency.digestFrequency,
      digestTime: (alertSettings?.frequency as Record<string, unknown>)?.digestTime as string ?? DEFAULT_ALERT_SETTINGS.frequency.digestTime,
    },
    updatedAt: settings.updatedAt,
  };
}

export async function updateAlertSettings(
  organizationId: string,
  updates: AlertSettingsUpdate
): Promise<AlertSettings> {
  const current = await getAlertSettings(organizationId);

  const merged = {
    wasteAlerts: { ...current.wasteAlerts, ...updates.wasteAlerts },
    cpaAlerts: { ...current.cpaAlerts, ...updates.cpaAlerts },
    performanceAlerts: { ...current.performanceAlerts, ...updates.performanceAlerts },
    frequency: { ...current.frequency, ...updates.frequency },
  };

  await prisma.organizationSettings.upsert({
    where: { organizationId },
    create: {
      organizationId,
      alertSettings: merged,
    },
    update: {
      alertSettings: merged,
    },
  });

  return getAlertSettings(organizationId);
}
