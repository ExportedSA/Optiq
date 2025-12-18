import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import crypto from "node:crypto";

import { TikTokAdsClient } from "../../services/tiktok-ads-client";
import { encryptString } from "../../utils/crypto";

const prisma = new PrismaClient();

const OAuthStateSchema = z.object({
  organizationId: z.string(),
  advertiserId: z.string(),
  nonce: z.string(),
  timestamp: z.number(),
});

export async function registerTikTokAdsOAuthRoutes(app: FastifyInstance) {
  app.get(
    "/api/integrations/tiktok-ads/connect",
    async (req: FastifyRequest<{ Querystring: { organizationId: string; advertiserId: string } }>, reply: FastifyReply) => {
      const org = await prisma.organization.findUnique({ where: { id: req.query.organizationId }, select: { id: true } });
      if (!org) {
        return reply.status(404).send({ success: false, error: "Organization not found" });
      }

      const state = Buffer.from(
        JSON.stringify({
          organizationId: req.query.organizationId,
          advertiserId: req.query.advertiserId,
          nonce: crypto.randomBytes(16).toString("hex"),
          timestamp: Date.now(),
        }),
      ).toString("base64");

      const client = new TikTokAdsClient();
      const authUrl = client.buildAuthUrl({ state });
      return reply.status(200).send({ success: true, authUrl });
    },
  );

  app.get(
    "/api/integrations/tiktok-ads/callback",
    async (req: FastifyRequest<{ Querystring: { code?: string; state?: string; error?: string } }>, reply: FastifyReply) => {
      const { code, state, error } = req.query;

      if (error) {
        return reply.redirect(`/dashboard/integrations?error=${error}`);
      }

      if (!code || !state) {
        return reply.redirect("/dashboard/integrations?error=missing_params");
      }

      const stateData = JSON.parse(Buffer.from(state, "base64").toString());
      const validated = OAuthStateSchema.parse(stateData);

      if (Date.now() - validated.timestamp > 10 * 60 * 1000) {
        return reply.redirect("/dashboard/integrations?error=state_expired");
      }

      const client = new TikTokAdsClient();
      const tokens = await client.exchangeCode(code);

      const accessExp = new Date(Date.now() + tokens.expires_in * 1000);
      const refreshExp = new Date(Date.now() + tokens.refresh_expires_in * 1000);

      await prisma.integrationConnection.upsert({
        where: {
          organizationId_platformCode_externalAccountId: {
            organizationId: validated.organizationId,
            platformCode: "TIKTOK",
            externalAccountId: validated.advertiserId,
          },
        },
        create: {
          organizationId: validated.organizationId,
          platformCode: "TIKTOK",
          externalAccountId: validated.advertiserId,
          externalAccountName: null,
          currency: null,
          timezone: null,
          status: "CONNECTED",
          accessTokenEnc: encryptString(tokens.access_token),
          refreshTokenEnc: encryptString(tokens.refresh_token),
          accessTokenExpiresAt: accessExp,
          refreshTokenExpiresAt: refreshExp,
          scope: tokens.scope,
          tokenType: "Bearer",
          metadata: null,
        },
        update: {
          status: "CONNECTED",
          accessTokenEnc: encryptString(tokens.access_token),
          refreshTokenEnc: encryptString(tokens.refresh_token),
          accessTokenExpiresAt: accessExp,
          refreshTokenExpiresAt: refreshExp,
          scope: tokens.scope,
          tokenType: "Bearer",
        },
        select: { id: true },
      });

      return reply.redirect("/dashboard/integrations?connected=tiktok_ads");
    },
  );

  app.delete(
    "/api/integrations/tiktok-ads/disconnect",
    async (req: FastifyRequest<{ Body: { organizationId: string; advertiserId?: string } }>, reply: FastifyReply) => {
      const { organizationId, advertiserId } = req.body;

      await prisma.integrationConnection.updateMany({
        where: {
          organizationId,
          platformCode: "TIKTOK",
          ...(advertiserId ? { externalAccountId: advertiserId } : {}),
        },
        data: { status: "DISCONNECTED" },
      });

      return reply.status(200).send({ success: true });
    },
  );

  app.log.info("TikTok Ads OAuth routes registered");
}
