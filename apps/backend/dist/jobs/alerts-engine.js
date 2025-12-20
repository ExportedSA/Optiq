import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const DEFAULTS = {
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
    roasAlerts: {
        enabled: false,
        targetRoas: 1.0,
        warningThresholdPercent: 25,
        criticalThresholdPercent: 50,
        notifyEmail: false,
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
    },
};
function dollarsFromMicros(micros) {
    return Number(micros) / 1_000_000;
}
function asDateOnly(d) {
    const out = new Date(d);
    out.setHours(0, 0, 0, 0);
    return out;
}
function addDays(d, days) {
    const out = new Date(d);
    out.setDate(out.getDate() + days);
    return out;
}
async function loadSettings(organizationId) {
    const settings = await prisma.organizationSettings.findUnique({
        where: { organizationId },
        select: { alertSettings: true },
    });
    const alertSettings = settings?.alertSettings ?? null;
    return {
        wasteAlerts: {
            enabled: alertSettings?.wasteAlerts?.enabled ?? DEFAULTS.wasteAlerts.enabled,
            thresholdLevel: alertSettings?.wasteAlerts?.thresholdLevel ?? DEFAULTS.wasteAlerts.thresholdLevel,
            notifyEmail: alertSettings?.wasteAlerts?.notifyEmail ?? DEFAULTS.wasteAlerts.notifyEmail,
            notifyInApp: alertSettings?.wasteAlerts?.notifyInApp ?? DEFAULTS.wasteAlerts.notifyInApp,
        },
        cpaAlerts: {
            enabled: alertSettings?.cpaAlerts?.enabled ?? DEFAULTS.cpaAlerts.enabled,
            targetCpa: alertSettings?.cpaAlerts?.targetCpa ?? DEFAULTS.cpaAlerts.targetCpa,
            warningThresholdPercent: alertSettings?.cpaAlerts?.warningThresholdPercent ?? DEFAULTS.cpaAlerts.warningThresholdPercent,
            criticalThresholdPercent: alertSettings?.cpaAlerts?.criticalThresholdPercent ?? DEFAULTS.cpaAlerts.criticalThresholdPercent,
            notifyEmail: alertSettings?.cpaAlerts?.notifyEmail ?? DEFAULTS.cpaAlerts.notifyEmail,
            notifyInApp: alertSettings?.cpaAlerts?.notifyInApp ?? DEFAULTS.cpaAlerts.notifyInApp,
        },
        roasAlerts: {
            enabled: alertSettings?.roasAlerts?.enabled ?? DEFAULTS.roasAlerts?.enabled ?? false,
            targetRoas: alertSettings?.roasAlerts?.targetRoas ?? DEFAULTS.roasAlerts?.targetRoas ?? 1.0,
            warningThresholdPercent: alertSettings?.roasAlerts?.warningThresholdPercent ?? DEFAULTS.roasAlerts?.warningThresholdPercent ?? 25,
            criticalThresholdPercent: alertSettings?.roasAlerts?.criticalThresholdPercent ?? DEFAULTS.roasAlerts?.criticalThresholdPercent ?? 50,
            notifyEmail: alertSettings?.roasAlerts?.notifyEmail ?? DEFAULTS.roasAlerts?.notifyEmail ?? false,
            notifyInApp: alertSettings?.roasAlerts?.notifyInApp ?? DEFAULTS.roasAlerts?.notifyInApp ?? true,
        },
        performanceAlerts: {
            enabled: alertSettings?.performanceAlerts?.enabled ?? DEFAULTS.performanceAlerts.enabled,
            conversionDropPercent: alertSettings?.performanceAlerts?.conversionDropPercent ?? DEFAULTS.performanceAlerts.conversionDropPercent,
            windowDays: alertSettings?.performanceAlerts?.windowDays ?? DEFAULTS.performanceAlerts.windowDays,
            notifyEmail: alertSettings?.performanceAlerts?.notifyEmail ?? DEFAULTS.performanceAlerts.notifyEmail,
            notifyInApp: alertSettings?.performanceAlerts?.notifyInApp ?? DEFAULTS.performanceAlerts.notifyInApp,
        },
        frequency: {
            minIntervalMinutes: alertSettings?.frequency?.minIntervalMinutes ?? DEFAULTS.frequency.minIntervalMinutes,
        },
    };
}
async function upsertRule(params) {
    const existing = await prisma.alertRule.findFirst({
        where: {
            organizationId: params.organizationId,
            type: params.type,
            name: params.name,
            status: "ACTIVE",
        },
        select: { id: true },
    });
    if (existing)
        return existing;
    return prisma.alertRule.create({
        data: {
            organizationId: params.organizationId,
            name: params.name,
            description: null,
            type: params.type,
            severity: params.severity,
            status: "ACTIVE",
            config: params.config,
            evaluationInterval: 24 * 60 * 60,
            notifyEmail: params.notifyEmail,
            notifyInApp: params.notifyInApp,
            notifySlack: false,
        },
        select: { id: true },
    });
}
async function shouldCooldown(ruleId, organizationId, minIntervalMinutes) {
    const latest = await prisma.alertEvent.findFirst({
        where: {
            organizationId,
            alertRuleId: ruleId,
            status: "TRIGGERED",
        },
        orderBy: { triggeredAt: "desc" },
        select: { triggeredAt: true },
    });
    if (!latest)
        return false;
    const mins = (Date.now() - latest.triggeredAt.getTime()) / 60000;
    return mins < minIntervalMinutes;
}
async function createAlertEventAndDeliver(params) {
    const event = await prisma.alertEvent.create({
        data: {
            organizationId: params.organizationId,
            alertRuleId: params.ruleId,
            status: "TRIGGERED",
            severity: params.severity,
            title: params.title,
            message: params.message,
            context: params.context,
        },
        select: { id: true, triggeredAt: true },
    });
    if (params.notifyInApp) {
        const memberships = await prisma.membership.findMany({
            where: { organizationId: params.organizationId },
            select: { userId: true },
        });
        if (memberships.length > 0) {
            await prisma.inAppNotification.createMany({
                data: memberships.map((m) => ({
                    id: `alert_${event.id}_${m.userId}`,
                    organizationId: params.organizationId,
                    userId: m.userId,
                    title: params.title,
                    message: params.message,
                    priority: params.severity === "CRITICAL" ? "urgent" : params.severity === "WARNING" ? "high" : "normal",
                    status: "sent",
                    actionUrl: "/app/notifications",
                    metadata: { alertEventId: event.id, ...params.context },
                })),
                skipDuplicates: true,
            });
        }
    }
    if (params.notifyEmail) {
        const owner = await prisma.membership.findFirst({
            where: { organizationId: params.organizationId, role: "OWNER" },
            include: { user: { select: { email: true } } },
        });
        if (owner?.user.email) {
            // Email is handled by frontend EmailChannelHandler (logs if SMTP not set).
            // For backend-only delivery, you'd add an SMTP client here.
            void owner;
        }
    }
    return event;
}
async function aggregateOrgRange(params) {
    const agg = await prisma.dailyAdAccountMetric.aggregate({
        where: {
            organizationId: params.organizationId,
            date: { gte: params.start, lte: params.end },
        },
        _sum: {
            spendMicros: true,
            conversions: true,
            revenueMicros: true,
            clicks: true,
            impressions: true,
        },
    });
    const spendMicros = agg._sum.spendMicros ?? 0n;
    const conversions = Number(agg._sum.conversions ?? 0n);
    const revenueMicros = agg._sum.revenueMicros ?? 0n;
    const clicks = Number(agg._sum.clicks ?? 0n);
    const impressions = Number(agg._sum.impressions ?? 0n);
    return {
        spend: dollarsFromMicros(spendMicros),
        conversions,
        revenue: dollarsFromMicros(revenueMicros),
        clicks,
        impressions,
    };
}
export async function runAlertsEngineJob(params) {
    const date = params?.date ? asDateOnly(params.date) : asDateOnly(new Date());
    const end = addDays(date, -1); // evaluate yesterday by default
    const organizations = params?.organizationId
        ? await prisma.organization.findMany({ where: { id: params.organizationId }, select: { id: true } })
        : await prisma.organization.findMany({ select: { id: true } });
    for (const org of organizations) {
        const settings = await loadSettings(org.id);
        const windowDays = settings.performanceAlerts.windowDays;
        const currentEnd = end;
        const currentStart = addDays(currentEnd, -(windowDays - 1));
        const previousEnd = addDays(currentStart, -1);
        const previousStart = addDays(previousEnd, -(windowDays - 1));
        const [current, previous] = await Promise.all([
            aggregateOrgRange({ organizationId: org.id, start: currentStart, end: currentEnd }),
            aggregateOrgRange({ organizationId: org.id, start: previousStart, end: previousEnd }),
        ]);
        const cpa = current.conversions > 0 ? current.spend / current.conversions : null;
        const prevCpa = previous.conversions > 0 ? previous.spend / previous.conversions : null;
        const roas = current.spend > 0 ? current.revenue / current.spend : null;
        const prevRoas = previous.spend > 0 ? previous.revenue / previous.spend : null;
        const minIntervalMinutes = settings.frequency.minIntervalMinutes;
        // CPA thresholds
        if (settings.cpaAlerts.enabled && cpa !== null && settings.cpaAlerts.targetCpa > 0) {
            const pctOver = ((cpa - settings.cpaAlerts.targetCpa) / settings.cpaAlerts.targetCpa) * 100;
            const severity = pctOver >= settings.cpaAlerts.criticalThresholdPercent
                ? "CRITICAL"
                : pctOver >= settings.cpaAlerts.warningThresholdPercent
                    ? "WARNING"
                    : null;
            if (severity) {
                const rule = await upsertRule({
                    organizationId: org.id,
                    name: severity === "CRITICAL" ? "CPA Critical Breach" : "CPA Above Target",
                    type: "CPA_SPIKE",
                    severity,
                    notifyEmail: settings.cpaAlerts.notifyEmail,
                    notifyInApp: settings.cpaAlerts.notifyInApp,
                    config: {
                        targetCpa: settings.cpaAlerts.targetCpa,
                        warningThresholdPercent: settings.cpaAlerts.warningThresholdPercent,
                        criticalThresholdPercent: settings.cpaAlerts.criticalThresholdPercent,
                        windowDays,
                    },
                });
                const cooldown = await shouldCooldown(rule.id, org.id, minIntervalMinutes);
                if (!cooldown) {
                    await createAlertEventAndDeliver({
                        organizationId: org.id,
                        ruleId: rule.id,
                        severity,
                        title: severity === "CRITICAL" ? "CPA is far above target" : "CPA is above target",
                        message: `CPA is $${cpa.toFixed(2)} vs target $${settings.cpaAlerts.targetCpa.toFixed(2)} (${pctOver.toFixed(0)}% over) in the last ${windowDays} days.`,
                        context: {
                            kind: "cpa_threshold",
                            windowStart: currentStart.toISOString(),
                            windowEnd: currentEnd.toISOString(),
                            cpa,
                            targetCpa: settings.cpaAlerts.targetCpa,
                            pctOver,
                            previousCpa: prevCpa,
                        },
                        notifyEmail: settings.cpaAlerts.notifyEmail,
                        notifyInApp: settings.cpaAlerts.notifyInApp,
                    });
                }
            }
        }
        // ROAS thresholds
        if (settings.roasAlerts?.enabled && roas !== null && settings.roasAlerts.targetRoas > 0) {
            const pctUnder = ((settings.roasAlerts.targetRoas - roas) / settings.roasAlerts.targetRoas) * 100;
            const severity = pctUnder >= settings.roasAlerts.criticalThresholdPercent
                ? "CRITICAL"
                : pctUnder >= settings.roasAlerts.warningThresholdPercent
                    ? "WARNING"
                    : null;
            if (severity) {
                const rule = await upsertRule({
                    organizationId: org.id,
                    name: severity === "CRITICAL" ? "ROAS Critical Drop" : "ROAS Below Target",
                    type: "ROAS_DROP",
                    severity,
                    notifyEmail: settings.roasAlerts.notifyEmail,
                    notifyInApp: settings.roasAlerts.notifyInApp,
                    config: {
                        targetRoas: settings.roasAlerts.targetRoas,
                        warningThresholdPercent: settings.roasAlerts.warningThresholdPercent,
                        criticalThresholdPercent: settings.roasAlerts.criticalThresholdPercent,
                        windowDays,
                    },
                });
                const cooldown = await shouldCooldown(rule.id, org.id, minIntervalMinutes);
                if (!cooldown) {
                    await createAlertEventAndDeliver({
                        organizationId: org.id,
                        ruleId: rule.id,
                        severity,
                        title: severity === "CRITICAL" ? "ROAS is far below target" : "ROAS is below target",
                        message: `ROAS is ${roas.toFixed(2)}x vs target ${settings.roasAlerts.targetRoas.toFixed(2)}x (${pctUnder.toFixed(0)}% under) in the last ${windowDays} days.`,
                        context: {
                            kind: "roas_threshold",
                            windowStart: currentStart.toISOString(),
                            windowEnd: currentEnd.toISOString(),
                            roas,
                            targetRoas: settings.roasAlerts.targetRoas,
                            pctUnder,
                            previousRoas: prevRoas,
                        },
                        notifyEmail: settings.roasAlerts.notifyEmail,
                        notifyInApp: settings.roasAlerts.notifyInApp,
                    });
                }
            }
        }
        // Spend spike anomaly (org-level)
        if (previous.spend > 0) {
            const pctChange = ((current.spend - previous.spend) / previous.spend) * 100;
            if (pctChange >= 50) {
                const rule = await upsertRule({
                    organizationId: org.id,
                    name: "Spend Spike",
                    type: "SPEND_THRESHOLD",
                    severity: pctChange >= 100 ? "CRITICAL" : "WARNING",
                    notifyEmail: false,
                    notifyInApp: true,
                    config: { thresholdPct: 50, windowDays },
                });
                const cooldown = await shouldCooldown(rule.id, org.id, minIntervalMinutes);
                if (!cooldown) {
                    await createAlertEventAndDeliver({
                        organizationId: org.id,
                        ruleId: rule.id,
                        severity: pctChange >= 100 ? "CRITICAL" : "WARNING",
                        title: "Spend spiked vs previous period",
                        message: `Spend increased ${pctChange.toFixed(0)}% vs previous ${windowDays}-day period ($${previous.spend.toFixed(2)} → $${current.spend.toFixed(2)}).`,
                        context: {
                            kind: "spend_spike",
                            windowStart: currentStart.toISOString(),
                            windowEnd: currentEnd.toISOString(),
                            currentSpend: current.spend,
                            previousSpend: previous.spend,
                            pctChange,
                        },
                        notifyEmail: false,
                        notifyInApp: true,
                    });
                }
            }
        }
        // Conversion drop anomaly
        if (settings.performanceAlerts.enabled && previous.conversions > 0) {
            const pctChange = ((current.conversions - previous.conversions) / previous.conversions) * 100;
            if (pctChange <= -settings.performanceAlerts.conversionDropPercent) {
                const rule = await upsertRule({
                    organizationId: org.id,
                    name: "Conversion Drop",
                    type: "CONVERSION_DROP",
                    severity: pctChange <= -75 ? "CRITICAL" : "WARNING",
                    notifyEmail: settings.performanceAlerts.notifyEmail,
                    notifyInApp: settings.performanceAlerts.notifyInApp,
                    config: { conversionDropPercent: settings.performanceAlerts.conversionDropPercent, windowDays },
                });
                const cooldown = await shouldCooldown(rule.id, org.id, minIntervalMinutes);
                if (!cooldown) {
                    await createAlertEventAndDeliver({
                        organizationId: org.id,
                        ruleId: rule.id,
                        severity: pctChange <= -75 ? "CRITICAL" : "WARNING",
                        title: "Conversions dropped",
                        message: `Conversions changed ${pctChange.toFixed(0)}% vs previous ${windowDays}-day period (${previous.conversions} → ${current.conversions}).`,
                        context: {
                            kind: "conversion_drop",
                            windowStart: currentStart.toISOString(),
                            windowEnd: currentEnd.toISOString(),
                            currentConversions: current.conversions,
                            previousConversions: previous.conversions,
                            pctChange,
                        },
                        notifyEmail: settings.performanceAlerts.notifyEmail,
                        notifyInApp: settings.performanceAlerts.notifyInApp,
                    });
                }
            }
        }
    }
}
//# sourceMappingURL=alerts-engine.js.map