/**
 * Disconnect Integration Endpoint
 * 
 * DELETE /api/integrations/[id]/disconnect
 * Disconnects an integration connection
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { appLogger } from "@/lib/observability";

export const runtime = "nodejs";

/**
 * DELETE /api/integrations/[id]/disconnect
 * Disconnect an integration connection
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const logger = appLogger.child({ integration: "disconnect" });

  try {
    // Authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const organizationId = session.user.activeOrgId;
    if (!organizationId) {
      return NextResponse.json(
        { error: "No active organization" },
        { status: 400 }
      );
    }

    const connectionId = params.id;

    // Verify connection belongs to organization
    const connection = await prisma.integrationConnection.findFirst({
      where: {
        id: connectionId,
        organizationId,
      },
    });

    if (!connection) {
      return NextResponse.json(
        { error: "Connection not found" },
        { status: 404 }
      );
    }

    // Update status to DISCONNECTED and clear tokens
    const updated = await prisma.integrationConnection.update({
      where: { id: connectionId },
      data: {
        status: "DISCONNECTED",
        accessTokenEnc: null,
        refreshTokenEnc: null,
        accessTokenExpiresAt: null,
        refreshTokenExpiresAt: null,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        platformCode: true,
        externalAccountId: true,
        externalAccountName: true,
        status: true,
      },
    });

    logger.info("Integration disconnected", {
      connectionId,
      platform: connection.platformCode,
      accountId: connection.externalAccountId,
    });

    return NextResponse.json({
      success: true,
      connection: updated,
    });
  } catch (error) {
    logger.error("Failed to disconnect integration", error as Error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
