import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { slugify, withSuffix } from "@/lib/slug";
import type { Prisma } from "@prisma/client";

const RegisterSchema = z.object({
  email: z.string().email().transform((v) => v.trim().toLowerCase()),
  password: z.string().min(12).max(200),
  name: z.string().min(1).max(200).optional(),
  organizationName: z.string().min(2).max(200),
});

async function ensureUniqueOrgSlug(base: string): Promise<string> {
  const existing = await prisma.organization.findUnique({
    where: { slug: base },
    select: { id: true },
  });
  if (!existing) return base;

  for (let i = 2; i <= 50; i += 1) {
    const candidate = withSuffix(base, String(i));
    const hit = await prisma.organization.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!hit) return candidate;
  }

  throw new Error("Unable to generate unique organization slug");
}

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = RegisterSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const { email, password, name, organizationName } = parsed.data;
  const passwordHash = await hashPassword(password);

  const baseSlug = slugify(organizationName);
  if (!baseSlug) {
    return NextResponse.json({ error: "invalid_organization" }, { status: 400 });
  }

  const orgSlug = await ensureUniqueOrgSlug(baseSlug);

  try {
    const created = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const existingUser = await tx.user.findUnique({
        where: { email },
        select: { id: true },
      });
      if (existingUser) {
        return { ok: false as const, reason: "email_in_use" as const };
      }

      const org = await tx.organization.create({
        data: {
          name: organizationName,
          slug: orgSlug,
        },
        select: { id: true },
      });

      const user = await tx.user.create({
        data: {
          email,
          name,
          passwordHash,
          activeOrgId: org.id,
        },
        select: { id: true },
      });

      await tx.membership.create({
        data: {
          userId: user.id,
          organizationId: org.id,
          role: "OWNER",
        },
        select: { id: true },
      });

      return { ok: true as const, userId: user.id, organizationId: org.id };
    });

    if (!created.ok) {
      return NextResponse.json({ error: created.reason }, { status: 409 });
    }

    return NextResponse.json(
      { userId: created.userId, organizationId: created.organizationId },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
