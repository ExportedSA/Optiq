import "server-only";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

export async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("UNAUTHENTICATED");
  }
  return session;
}

export async function requireActiveOrgId(): Promise<string> {
  const session = await requireSession();
  const orgId = session.user.activeOrgId;
  if (!orgId) {
    throw new Error("NO_ACTIVE_ORG");
  }
  return orgId;
}
