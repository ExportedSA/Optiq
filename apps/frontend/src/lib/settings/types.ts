import "server-only";

export interface AlertSettings {
  organizationId: string;
  
  wasteAlerts: {
    enabled: boolean;
    thresholdLevel: "low" | "medium" | "high" | "critical";
    notifyEmail: boolean;
    notifyInApp: boolean;
  };

  cpaAlerts: {
    enabled: boolean;
    targetCpa: number;
    warningThresholdPercent: number;
    criticalThresholdPercent: number;
    notifyEmail: boolean;
    notifyInApp: boolean;
  };

  performanceAlerts: {
    enabled: boolean;
    conversionDropPercent: number;
    windowDays: number;
    notifyEmail: boolean;
    notifyInApp: boolean;
  };

  frequency: {
    minIntervalMinutes: number;
    digestEnabled: boolean;
    digestFrequency: "daily" | "weekly";
    digestTime: string;
  };

  updatedAt: Date;
}

export const DEFAULT_ALERT_SETTINGS: Omit<AlertSettings, "organizationId" | "updatedAt"> = {
  wasteAlerts: {
    enabled: true,
    thresholdLevel: "medium",
    notifyEmail: true,
    notifyInApp: true,
  },
  cpaAlerts: {
    enabled: true,
    targetCpa: 25,
    warningThresholdPercent: 50,
    criticalThresholdPercent: 100,
    notifyEmail: true,
    notifyInApp: true,
  },
  performanceAlerts: {
    enabled: true,
    conversionDropPercent: 50,
    windowDays: 7,
    notifyEmail: false,
    notifyInApp: true,
  },
  frequency: {
    minIntervalMinutes: 60,
    digestEnabled: false,
    digestFrequency: "daily",
    digestTime: "09:00",
  },
};

export type AlertSettingsUpdate = Partial<Omit<AlertSettings, "organizationId" | "updatedAt">>;
