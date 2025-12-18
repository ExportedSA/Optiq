/**
 * Attribution Service
 *
 * Implements multiple attribution models for marketing attribution:
 * - Last-Click (LAST_TOUCH)
 * - First-Click (FIRST_TOUCH)
 * - Linear
 * - Time-Decay (configurable half-life)
 * - Position-Based (40/20/40)
 */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const DEFAULT_CONFIG = {
    timeDecayHalfLife: 7,
    positionBasedWeights: {
        first: 0.4,
        middle: 0.2,
        last: 0.4,
    },
};
/**
 * Calculate attribution weight for a touchpoint based on model
 */
export function calculateAttributionWeight(model, touchpointIndex, totalTouchpoints, touchpointTimestamp, conversionTimestamp, config = {}) {
    const cfg = { ...DEFAULT_CONFIG, ...config };
    switch (model) {
        case "FIRST_TOUCH":
            // 100% credit to first touchpoint
            return touchpointIndex === 0 ? 1.0 : 0.0;
        case "LAST_TOUCH":
            // 100% credit to last touchpoint (before conversion)
            return touchpointIndex === totalTouchpoints - 1 ? 1.0 : 0.0;
        case "LINEAR":
            // Equal credit to all touchpoints
            return 1.0 / totalTouchpoints;
        case "TIME_DECAY":
            // Exponential decay - more recent touchpoints get more credit
            // Uses configurable half-life
            const daysSinceTouch = (conversionTimestamp.getTime() - touchpointTimestamp.getTime()) / (1000 * 60 * 60 * 24);
            const weight = Math.pow(2, -daysSinceTouch / cfg.timeDecayHalfLife);
            return weight;
        case "POSITION_BASED":
            // Configurable weights for first, middle, and last touchpoints
            // Default: 40% first, 20% middle (distributed), 40% last
            if (totalTouchpoints === 1) {
                return 1.0;
            }
            if (totalTouchpoints === 2) {
                // Split between first and last
                return touchpointIndex === 0 ? cfg.positionBasedWeights.first : cfg.positionBasedWeights.last;
            }
            if (touchpointIndex === 0) {
                return cfg.positionBasedWeights.first;
            }
            if (touchpointIndex === totalTouchpoints - 1) {
                return cfg.positionBasedWeights.last;
            }
            // Middle touchpoints share the middle weight
            const middleTouchpoints = totalTouchpoints - 2;
            return cfg.positionBasedWeights.middle / middleTouchpoints;
        case "DATA_DRIVEN":
            // Placeholder for ML-based attribution
            // For now, use linear as fallback
            return 1.0 / totalTouchpoints;
        default:
            return 1.0 / totalTouchpoints;
    }
}
/**
 * Normalize attribution weights so they sum to 1.0
 */
export function normalizeWeights(weights) {
    const sum = weights.reduce((acc, w) => acc + w, 0);
    if (sum === 0 || !isFinite(sum)) {
        // If all weights are zero or invalid, distribute equally
        return weights.map(() => 1.0 / weights.length);
    }
    return weights.map((w) => w / sum);
}
/**
 * Calculate attribution for a conversion across all touchpoints
 */
export function calculateAttribution(conversionId, conversionValue, touchpoints, conversionTimestamp, model, config = {}) {
    if (touchpoints.length === 0) {
        return {
            conversionId,
            conversionValue,
            totalTouchpoints: 0,
            attributions: [],
        };
    }
    // Calculate raw weights
    const rawWeights = touchpoints.map((tp, index) => calculateAttributionWeight(model, index, touchpoints.length, tp.occurredAt, conversionTimestamp, config));
    // Normalize weights to sum to 1.0
    const normalizedWeights = normalizeWeights(rawWeights);
    // Calculate credit amounts
    const attributions = touchpoints.map((tp, index) => ({
        touchpointId: tp.id,
        model,
        weight: normalizedWeights[index],
        credit: normalizedWeights[index] * conversionValue,
        position: index + 1,
    }));
    return {
        conversionId,
        conversionValue,
        totalTouchpoints: touchpoints.length,
        attributions,
    };
}
/**
 * Calculate attribution for multiple models simultaneously
 */
export function calculateMultiModelAttribution(conversionId, conversionValue, touchpoints, conversionTimestamp, models, config = {}) {
    const results = new Map();
    for (const model of models) {
        const result = calculateAttribution(conversionId, conversionValue, touchpoints, conversionTimestamp, model, config);
        results.set(model, result);
    }
    return results;
}
/**
 * Persist attribution results to database
 */
export async function persistAttributionResults(siteId, conversionId, results) {
    // Delete existing attribution links for this conversion
    await prisma.attributionLink.deleteMany({
        where: { conversionId },
    });
    // Create new attribution links
    for (const [model, result] of results.entries()) {
        for (const attribution of result.attributions) {
            await prisma.attributionLink.create({
                data: {
                    siteId,
                    conversionId,
                    touchPointId: attribution.touchpointId,
                    model: model,
                    weight: attribution.weight,
                    position: attribution.position,
                    touchPointCount: result.totalTouchpoints,
                },
            });
        }
    }
}
/**
 * Get attribution results for a conversion from database
 */
export async function getAttributionResults(conversionId, model) {
    const links = await prisma.attributionLink.findMany({
        where: {
            conversionId,
            ...(model && { model: model }),
        },
        orderBy: {
            position: "asc",
        },
    });
    return links.map((link) => ({
        touchpointId: link.touchPointId,
        model: link.model,
        weight: link.weight,
        credit: 0, // Would need conversion value to calculate
        position: link.position,
    }));
}
/**
 * Compare attribution results across models
 */
export function compareAttributionModels(results) {
    const comparison = [];
    for (const [model, result] of results.entries()) {
        if (result.attributions.length === 0)
            continue;
        // Find top touchpoint
        const topAttribution = result.attributions.reduce((max, curr) => curr.credit > max.credit ? curr : max);
        // Calculate credit distribution
        const credits = result.attributions.map((a) => a.credit);
        const min = Math.min(...credits);
        const max = Math.max(...credits);
        const avg = credits.reduce((sum, c) => sum + c, 0) / credits.length;
        comparison.push({
            model,
            topTouchpoint: topAttribution.touchpointId,
            topTouchpointCredit: topAttribution.credit,
            creditDistribution: { min, max, avg },
        });
    }
    return comparison;
}
/**
 * Validate attribution results
 * Ensures weights sum to 1.0 and credits sum to conversion value
 */
export function validateAttributionResult(result) {
    const errors = [];
    // Check weights sum to 1.0 (with small tolerance for floating point)
    const weightSum = result.attributions.reduce((sum, a) => sum + a.weight, 0);
    if (Math.abs(weightSum - 1.0) > 0.0001) {
        errors.push(`Weights sum to ${weightSum}, expected 1.0`);
    }
    // Check credits sum to conversion value (with small tolerance)
    const creditSum = result.attributions.reduce((sum, a) => sum + a.credit, 0);
    if (Math.abs(creditSum - result.conversionValue) > 0.01) {
        errors.push(`Credits sum to ${creditSum}, expected ${result.conversionValue}`);
    }
    // Check all weights are non-negative
    const negativeWeights = result.attributions.filter((a) => a.weight < 0);
    if (negativeWeights.length > 0) {
        errors.push(`Found ${negativeWeights.length} negative weights`);
    }
    // Check positions are sequential
    const positions = result.attributions.map((a) => a.position).sort((a, b) => a - b);
    for (let i = 0; i < positions.length; i++) {
        if (positions[i] !== i + 1) {
            errors.push(`Position gap detected at ${i + 1}`);
            break;
        }
    }
    return {
        valid: errors.length === 0,
        errors,
    };
}
/**
 * Get attribution summary statistics
 */
export function getAttributionStats(result) {
    if (result.attributions.length === 0) {
        return {
            model: result.attributions[0]?.model || "LINEAR",
            totalCredit: 0,
            avgCreditPerTouchpoint: 0,
            maxCredit: 0,
            minCredit: 0,
            touchpointsWithCredit: 0,
            concentrationRatio: 0,
        };
    }
    const credits = result.attributions.map((a) => a.credit);
    const totalCredit = credits.reduce((sum, c) => sum + c, 0);
    const maxCredit = Math.max(...credits);
    const minCredit = Math.min(...credits);
    return {
        model: result.attributions[0].model,
        totalCredit,
        avgCreditPerTouchpoint: totalCredit / result.attributions.length,
        maxCredit,
        minCredit,
        touchpointsWithCredit: result.attributions.filter((a) => a.credit > 0).length,
        concentrationRatio: maxCredit / totalCredit,
    };
}
//# sourceMappingURL=attribution.js.map