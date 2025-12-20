/**
 * Waste Explainability API Routes
 *
 * Endpoints for retrieving waste explanations
 */
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { getWasteExplanation, generateWasteExplanation, generateMissingExplanations, } from "../../services/waste-explainability";
const prisma = new PrismaClient();
/**
 * Query parameters schema
 */
const GetExplanationParamsSchema = z.object({
    wasteScoreId: z.string(),
});
const GenerateMissingQuerySchema = z.object({
    organizationId: z.string().optional(),
});
/**
 * Register waste explainability routes
 */
export async function registerWasteExplainabilityRoutes(app) {
    /**
     * GET /api/waste/explain/:wasteScoreId
     *
     * Get explanation for a specific waste score
     */
    app.get("/api/waste/explain/:wasteScoreId", async (req, reply) => {
        try {
            const { wasteScoreId } = req.params;
            // Get existing explanation
            let explanation = await getWasteExplanation(wasteScoreId);
            // If no explanation exists, generate it
            if (!explanation) {
                explanation = await generateWasteExplanation(wasteScoreId);
            }
            return reply.status(200).send({
                success: true,
                explanation,
            });
        }
        catch (error) {
            req.log.error({ err: error }, "Failed to get waste explanation");
            return reply.status(500).send({
                success: false,
                error: "Failed to get explanation",
                message: error instanceof Error ? error.message : "Unknown error",
            });
        }
    });
    /**
     * GET /api/waste/scores
     *
     * Get waste scores with optional filters
     */
    app.get("/api/waste/scores", async (req, reply) => {
        try {
            const { organizationId, startDate, endDate, platformId, campaignId, hasWaste } = req.query;
            const where = {
                organizationId,
                ...(startDate && { date: { gte: new Date(startDate) } }),
                ...(endDate && { date: { ...where.date, lte: new Date(endDate) } }),
                ...(platformId && { platformId }),
                ...(campaignId && { campaignId }),
                ...(hasWaste === "true" && {
                    OR: [
                        { attributedConversions: 0 },
                        { cpaBreach: true },
                        { roasBreach: true },
                    ],
                }),
            };
            const scores = await prisma.wasteScore.findMany({
                where,
                include: {
                    explanation: true,
                    campaign: true,
                    ad: true,
                    platform: true,
                },
                orderBy: {
                    wastePercent: "desc",
                },
                take: 50,
            });
            return reply.status(200).send({
                success: true,
                count: scores.length,
                scores: scores.map((score) => ({
                    id: score.id,
                    date: score.date,
                    platform: score.platform?.name,
                    campaign: score.campaign?.name,
                    ad: score.ad?.name,
                    totalSpend: Number(score.totalSpend) / 1_000_000,
                    wasteSpend: Number(score.wasteSpend) / 1_000_000,
                    wastePercent: score.wastePercent,
                    attributedConversions: score.attributedConversions,
                    cpa: score.cpa ? Number(score.cpa) / 1_000_000 : null,
                    roas: score.roas,
                    cpaBreach: score.cpaBreach,
                    roasBreach: score.roasBreach,
                    hasExplanation: !!score.explanation,
                })),
            });
        }
        catch (error) {
            req.log.error({ err: error }, "Failed to get waste scores");
            return reply.status(500).send({
                success: false,
                error: "Failed to get waste scores",
            });
        }
    });
    /**
     * POST /api/waste/explain/generate-missing
     *
     * Generate explanations for all waste scores without explanations
     */
    app.post("/api/waste/explain/generate-missing", async (req, reply) => {
        try {
            const { organizationId } = req.query;
            const result = await generateMissingExplanations(organizationId);
            return reply.status(200).send({
                success: true,
                generated: result.generated,
                failed: result.failed,
            });
        }
        catch (error) {
            req.log.error({ err: error }, "Failed to generate missing explanations");
            return reply.status(500).send({
                success: false,
                error: "Failed to generate explanations",
            });
        }
    });
    /**
     * GET /api/waste/summary
     *
     * Get waste summary with explanations
     */
    app.get("/api/waste/summary", async (req, reply) => {
        try {
            const { organizationId, startDate, endDate } = req.query;
            const where = {
                organizationId,
                ...(startDate && { date: { gte: new Date(startDate) } }),
                ...(endDate && { date: { ...where.date, lte: new Date(endDate) } }),
            };
            const scores = await prisma.wasteScore.findMany({
                where,
                include: {
                    explanation: true,
                },
            });
            const totalSpend = scores.reduce((sum, s) => sum + Number(s.totalSpend), 0) / 1_000_000;
            const totalWaste = scores.reduce((sum, s) => sum + Number(s.wasteSpend), 0) / 1_000_000;
            const wastePercent = totalSpend > 0 ? (totalWaste / totalSpend) * 100 : 0;
            const zeroConversions = scores.filter((s) => s.attributedConversions === 0).length;
            const cpaBreaches = scores.filter((s) => s.cpaBreach).length;
            const roasBreaches = scores.filter((s) => s.roasBreach).length;
            const withExplanations = scores.filter((s) => s.explanation).length;
            return reply.status(200).send({
                success: true,
                summary: {
                    totalSpend,
                    totalWaste,
                    wastePercent,
                    wasteFlags: {
                        zeroConversions,
                        cpaBreaches,
                        roasBreaches,
                        total: zeroConversions + cpaBreaches + roasBreaches,
                    },
                    explanations: {
                        generated: withExplanations,
                        missing: scores.length - withExplanations,
                    },
                },
            });
        }
        catch (error) {
            req.log.error({ err: error }, "Failed to get waste summary");
            return reply.status(500).send({
                success: false,
                error: "Failed to get summary",
            });
        }
    });
    app.log.info("Waste explainability routes registered");
}
//# sourceMappingURL=waste-explainability.js.map