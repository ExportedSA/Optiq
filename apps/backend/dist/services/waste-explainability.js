/**
 * Waste Explainability Service
 *
 * Generates detailed explanations for waste flags with full traceability
 * to rules, data, and attribution models.
 */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
/**
 * Convert micros to dollars
 */
function fromMicros(micros) {
    if (micros === null)
        return null;
    return Number(micros) / 1_000_000;
}
/**
 * Generate explanation for zero conversions
 */
function generateZeroConversionsExplanation(wasteScore, supportingData) {
    const spend = fromMicros(wasteScore.totalSpend) || 0;
    return {
        ruleType: "ZERO_CONVERSIONS",
        ruleName: "Zero Attributed Conversions",
        ruleDescription: `This campaign/ad spent $${spend.toFixed(2)} but generated zero attributed conversions using the ${wasteScore.attributionModel} attribution model.`,
        spendWindow: {
            start: wasteScore.date,
            end: wasteScore.date,
            totalSpend: spend,
        },
        attribution: {
            model: wasteScore.attributionModel,
            lookbackDays: 30, // Default lookback
        },
        conversions: {
            actual: 0,
            reason: "No conversions were attributed to this spend using the selected attribution model. This could indicate targeting issues, poor ad creative, or insufficient tracking.",
        },
        supportingData: {
            touchpoints: supportingData.touchpoints || 0,
            impressions: Number(supportingData.impressions || 0),
            clicks: Number(supportingData.clicks || 0),
            clickThroughRate: supportingData.clicks > 0
                ? (Number(supportingData.clicks) / Number(supportingData.impressions)) * 100
                : undefined,
        },
        recommendations: [
            {
                action: "Pause campaign immediately",
                reason: "Zero conversions indicate this spend is not generating any return",
                priority: "high",
            },
            {
                action: "Review targeting settings",
                reason: "Ensure ads are reaching the right audience",
                priority: "high",
            },
            {
                action: "Check tracking implementation",
                reason: "Verify conversion tracking is properly configured",
                priority: "medium",
            },
            {
                action: "Test different ad creative",
                reason: "Current creative may not be resonating with audience",
                priority: "medium",
            },
        ],
        generatedAt: new Date(),
    };
}
/**
 * Generate explanation for CPA breach
 */
function generateCpaBreachExplanation(wasteScore, supportingData) {
    const actualCpa = fromMicros(wasteScore.cpa);
    const targetCpa = fromMicros(wasteScore.targetCpa);
    const deviation = actualCpa && targetCpa
        ? ((actualCpa - targetCpa) / targetCpa) * 100
        : 0;
    return {
        ruleType: "CPA_BREACH",
        ruleName: "CPA Target Breach",
        ruleDescription: `Cost per acquisition ($${actualCpa?.toFixed(2)}) exceeds target ($${targetCpa?.toFixed(2)}) by ${deviation.toFixed(1)}%.`,
        spendWindow: {
            start: wasteScore.date,
            end: wasteScore.date,
            totalSpend: fromMicros(wasteScore.totalSpend) || 0,
        },
        attribution: {
            model: wasteScore.attributionModel,
            lookbackDays: 30,
        },
        conversions: {
            actual: wasteScore.attributedConversions,
            reason: `While conversions were generated, the cost per conversion is ${deviation.toFixed(1)}% higher than target, indicating inefficient spend.`,
        },
        performance: {
            actualCpa: actualCpa || undefined,
            targetCpa: targetCpa || undefined,
            cpaDeviation: deviation,
        },
        supportingData: {
            touchpoints: supportingData.touchpoints || 0,
            impressions: Number(supportingData.impressions || 0),
            clicks: Number(supportingData.clicks || 0),
            clickThroughRate: supportingData.clicks > 0
                ? (Number(supportingData.clicks) / Number(supportingData.impressions)) * 100
                : undefined,
        },
        recommendations: [
            {
                action: "Optimize targeting to reduce CPA",
                reason: `CPA is ${deviation.toFixed(1)}% above target`,
                priority: "high",
            },
            {
                action: "Lower bids or adjust budget",
                reason: "Reduce cost per click to improve CPA",
                priority: "high",
            },
            {
                action: "Improve landing page conversion rate",
                reason: "Better conversion rate will lower CPA",
                priority: "medium",
            },
            {
                action: "Test different audience segments",
                reason: "Find more cost-effective audiences",
                priority: "medium",
            },
        ],
        generatedAt: new Date(),
    };
}
/**
 * Generate explanation for ROAS breach
 */
function generateRoasBreachExplanation(wasteScore, supportingData) {
    const actualRoas = wasteScore.roas;
    const targetRoas = wasteScore.targetRoas;
    const deviation = actualRoas && targetRoas
        ? ((targetRoas - actualRoas) / targetRoas) * 100
        : 0;
    return {
        ruleType: "ROAS_BREACH",
        ruleName: "ROAS Target Breach",
        ruleDescription: `Return on ad spend (${actualRoas?.toFixed(2)}x) is below target (${targetRoas?.toFixed(2)}x) by ${deviation.toFixed(1)}%.`,
        spendWindow: {
            start: wasteScore.date,
            end: wasteScore.date,
            totalSpend: fromMicros(wasteScore.totalSpend) || 0,
        },
        attribution: {
            model: wasteScore.attributionModel,
            lookbackDays: 30,
        },
        conversions: {
            actual: wasteScore.attributedConversions,
            reason: `Conversions generated $${fromMicros(wasteScore.attributedRevenue)?.toFixed(2)} in revenue, but ROAS is ${deviation.toFixed(1)}% below target.`,
        },
        performance: {
            actualRoas: actualRoas || undefined,
            targetRoas: targetRoas || undefined,
            roasDeviation: deviation,
        },
        supportingData: {
            touchpoints: supportingData.touchpoints || 0,
            impressions: Number(supportingData.impressions || 0),
            clicks: Number(supportingData.clicks || 0),
            clickThroughRate: supportingData.clicks > 0
                ? (Number(supportingData.clicks) / Number(supportingData.impressions)) * 100
                : undefined,
        },
        recommendations: [
            {
                action: "Increase average order value",
                reason: `ROAS is ${deviation.toFixed(1)}% below target`,
                priority: "high",
            },
            {
                action: "Focus on higher-value customer segments",
                reason: "Target customers with higher purchase intent",
                priority: "high",
            },
            {
                action: "Optimize product mix in campaigns",
                reason: "Promote higher-margin products",
                priority: "medium",
            },
            {
                action: "Implement upselling strategies",
                reason: "Increase revenue per conversion",
                priority: "medium",
            },
        ],
        generatedAt: new Date(),
    };
}
/**
 * Generate and store explanation for a waste score
 */
export async function generateWasteExplanation(wasteScoreId) {
    // Get waste score with related data
    const wasteScore = await prisma.wasteScore.findUnique({
        where: { id: wasteScoreId },
        include: {
            platform: true,
            campaign: true,
            ad: true,
        },
    });
    if (!wasteScore) {
        throw new Error(`Waste score not found: ${wasteScoreId}`);
    }
    // Get supporting data (impressions, clicks, etc.)
    const supportingData = await getSupportingData(wasteScore);
    // Determine which rule triggered
    let explanation;
    if (wasteScore.attributedConversions === 0) {
        explanation = generateZeroConversionsExplanation(wasteScore, supportingData);
    }
    else if (wasteScore.cpaBreach) {
        explanation = generateCpaBreachExplanation(wasteScore, supportingData);
    }
    else if (wasteScore.roasBreach) {
        explanation = generateRoasBreachExplanation(wasteScore, supportingData);
    }
    else {
        // No waste detected
        throw new Error("No waste rule triggered for this score");
    }
    // Store explanation in database
    await prisma.wasteExplanation.upsert({
        where: { wasteScoreId },
        create: {
            wasteScoreId,
            ruleType: explanation.ruleType,
            ruleName: explanation.ruleName,
            ruleDescription: explanation.ruleDescription,
            spendWindowStart: explanation.spendWindow.start,
            spendWindowEnd: explanation.spendWindow.end,
            totalSpendAmount: BigInt(Math.round(explanation.spendWindow.totalSpend * 1_000_000)),
            attributionModel: explanation.attribution.model,
            lookbackDays: explanation.attribution.lookbackDays,
            expectedConversions: explanation.conversions.expected,
            actualConversions: explanation.conversions.actual,
            conversionGap: explanation.conversions.gap,
            actualCpa: explanation.performance?.actualCpa
                ? BigInt(Math.round(explanation.performance.actualCpa * 1_000_000))
                : null,
            targetCpa: explanation.performance?.targetCpa
                ? BigInt(Math.round(explanation.performance.targetCpa * 1_000_000))
                : null,
            cpaDeviation: explanation.performance?.cpaDeviation,
            actualRoas: explanation.performance?.actualRoas,
            targetRoas: explanation.performance?.targetRoas,
            roasDeviation: explanation.performance?.roasDeviation,
            touchpointCount: explanation.supportingData.touchpoints,
            impressions: BigInt(explanation.supportingData.impressions),
            clicks: BigInt(explanation.supportingData.clicks),
            clickThroughRate: explanation.supportingData.clickThroughRate,
            recommendations: explanation.recommendations,
        },
        update: {
            ruleType: explanation.ruleType,
            ruleName: explanation.ruleName,
            ruleDescription: explanation.ruleDescription,
            recommendations: explanation.recommendations,
            generatedAt: new Date(),
        },
    });
    return explanation;
}
/**
 * Get supporting data for explanation
 */
async function getSupportingData(wasteScore) {
    const where = {
        organizationId: wasteScore.organizationId,
        date: wasteScore.date,
        ...(wasteScore.platformId && { platformId: wasteScore.platformId }),
        ...(wasteScore.adAccountId && { adAccountId: wasteScore.adAccountId }),
        ...(wasteScore.campaignId && { campaignId: wasteScore.campaignId }),
        ...(wasteScore.adId && { adId: wasteScore.adId }),
    };
    let impressions = BigInt(0);
    let clicks = BigInt(0);
    if (wasteScore.adId) {
        const metrics = await prisma.dailyAdMetric.findMany({ where });
        impressions = metrics.reduce((sum, m) => sum + m.impressions, BigInt(0));
        clicks = metrics.reduce((sum, m) => sum + m.clicks, BigInt(0));
    }
    else if (wasteScore.campaignId) {
        const metrics = await prisma.dailyCampaignMetric.findMany({ where });
        impressions = metrics.reduce((sum, m) => sum + m.impressions, BigInt(0));
        clicks = metrics.reduce((sum, m) => sum + m.clicks, BigInt(0));
    }
    else if (wasteScore.adAccountId) {
        const metrics = await prisma.dailyAdAccountMetric.findMany({ where });
        impressions = metrics.reduce((sum, m) => sum + m.impressions, BigInt(0));
        clicks = metrics.reduce((sum, m) => sum + m.clicks, BigInt(0));
    }
    // Get touchpoint count
    const touchpoints = await prisma.touchPoint.count({
        where: {
            occurredAt: wasteScore.date,
            ...(wasteScore.adId && { adId: wasteScore.adId }),
            ...(wasteScore.campaignId && !wasteScore.adId && { campaignId: wasteScore.campaignId }),
        },
    });
    return {
        impressions,
        clicks,
        touchpoints,
    };
}
/**
 * Get explanation for a waste score
 */
export async function getWasteExplanation(wasteScoreId) {
    const explanation = await prisma.wasteExplanation.findUnique({
        where: { wasteScoreId },
    });
    if (!explanation) {
        return null;
    }
    return {
        ruleType: explanation.ruleType,
        ruleName: explanation.ruleName,
        ruleDescription: explanation.ruleDescription,
        spendWindow: {
            start: explanation.spendWindowStart,
            end: explanation.spendWindowEnd,
            totalSpend: fromMicros(explanation.totalSpendAmount) || 0,
        },
        attribution: {
            model: explanation.attributionModel,
            lookbackDays: explanation.lookbackDays,
        },
        conversions: {
            expected: explanation.expectedConversions || undefined,
            actual: explanation.actualConversions,
            gap: explanation.conversionGap || undefined,
            reason: explanation.ruleDescription,
        },
        performance: {
            actualCpa: fromMicros(explanation.actualCpa) || undefined,
            targetCpa: fromMicros(explanation.targetCpa) || undefined,
            cpaDeviation: explanation.cpaDeviation || undefined,
            actualRoas: explanation.actualRoas || undefined,
            targetRoas: explanation.targetRoas || undefined,
            roasDeviation: explanation.roasDeviation || undefined,
        },
        supportingData: {
            touchpoints: explanation.touchpointCount,
            impressions: Number(explanation.impressions),
            clicks: Number(explanation.clicks),
            clickThroughRate: explanation.clickThroughRate || undefined,
        },
        recommendations: explanation.recommendations,
        generatedAt: explanation.generatedAt,
    };
}
/**
 * Batch generate explanations for all waste scores without explanations
 */
export async function generateMissingExplanations(organizationId) {
    const where = {
        ...(organizationId && { organizationId }),
        explanation: null,
        OR: [
            { attributedConversions: 0 },
            { cpaBreach: true },
            { roasBreach: true },
        ],
    };
    const wasteScores = await prisma.wasteScore.findMany({
        where,
        take: 100, // Process in batches
    });
    let generated = 0;
    let failed = 0;
    for (const score of wasteScores) {
        try {
            await generateWasteExplanation(score.id);
            generated++;
        }
        catch (error) {
            console.error(`Failed to generate explanation for ${score.id}:`, error);
            failed++;
        }
    }
    return { generated, failed };
}
//# sourceMappingURL=waste-explainability.js.map