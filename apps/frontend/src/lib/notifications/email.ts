import "server-only";

import type {
  NotificationPayload,
  NotificationResult,
  NotificationChannelHandler,
  EmailNotification,
} from "./types";

function buildEmailHtml(payload: NotificationPayload): string {
  const priorityColor =
    payload.priority === "urgent"
      ? "#DC2626"
      : payload.priority === "high"
      ? "#F59E0B"
      : "#3B82F6";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${payload.title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <tr>
            <td style="background-color: ${priorityColor}; padding: 20px 30px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 600;">
                Optiq Alert
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">
              <h2 style="margin: 0 0 15px 0; color: #18181b; font-size: 18px; font-weight: 600;">
                ${payload.title}
              </h2>
              <p style="margin: 0 0 20px 0; color: #52525b; font-size: 14px; line-height: 1.6;">
                ${payload.message}
              </p>
              ${
                payload.actionUrl
                  ? `
              <a href="${payload.actionUrl}" style="display: inline-block; background-color: #18181b; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 500;">
                View Details
              </a>
              `
                  : ""
              }
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 30px; background-color: #fafafa; border-top: 1px solid #e4e4e7;">
              <p style="margin: 0; color: #71717a; font-size: 12px;">
                This alert was triggered by Optiq's monitoring system.
                <br>
                Organization ID: ${payload.organizationId}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

function buildEmailText(payload: NotificationPayload): string {
  let text = `${payload.title}\n\n${payload.message}`;

  if (payload.actionUrl) {
    text += `\n\nView details: ${payload.actionUrl}`;
  }

  text += `\n\n---\nOrganization ID: ${payload.organizationId}`;

  return text;
}

async function sendEmail(email: EmailNotification): Promise<{ success: boolean; error?: string }> {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM ?? "alerts@optiq.app";

  if (!smtpHost) {
    console.log("[EmailChannel] SMTP not configured, logging email:", {
      to: email.to,
      subject: email.subject,
      priority: email.priority,
    });

    return { success: true };
  }

  try {
    console.log("[EmailChannel] Would send email via SMTP:", {
      host: smtpHost,
      port: smtpPort,
      from: smtpFrom,
      to: email.to,
      subject: email.subject,
    });

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[EmailChannel] Failed to send email:", message);
    return { success: false, error: message };
  }
}

export class EmailChannelHandler implements NotificationChannelHandler {
  readonly channel = "email" as const;

  async send(payload: NotificationPayload): Promise<NotificationResult> {
    const recipientEmail = await this.getRecipientEmail(payload);

    if (!recipientEmail) {
      return {
        success: false,
        channel: this.channel,
        notificationId: payload.id,
        error: "No recipient email found",
      };
    }

    const email: EmailNotification = {
      to: recipientEmail,
      subject: `[${payload.priority.toUpperCase()}] ${payload.title}`,
      htmlBody: buildEmailHtml(payload),
      textBody: buildEmailText(payload),
      priority: payload.priority,
      metadata: payload.metadata,
    };

    const result = await sendEmail(email);

    return {
      success: result.success,
      channel: this.channel,
      notificationId: payload.id,
      error: result.error,
      sentAt: result.success ? new Date() : undefined,
    };
  }

  private async getRecipientEmail(payload: NotificationPayload): Promise<string | null> {
    if (payload.userId) {
      const { prisma } = await import("@/lib/prisma");
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { email: true },
      });
      return user?.email ?? null;
    }

    if (payload.organizationId) {
      const { prisma } = await import("@/lib/prisma");
      const owner = await prisma.membership.findFirst({
        where: {
          organizationId: payload.organizationId,
          role: "OWNER",
        },
        include: {
          user: { select: { email: true } },
        },
      });
      return owner?.user.email ?? null;
    }

    return null;
  }
}

export const emailChannelHandler = new EmailChannelHandler();
