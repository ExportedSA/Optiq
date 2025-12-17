import "next-auth";

import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      activeOrgId?: string;
    };
  }

  interface User {
    activeOrgId?: string | null;
  }
}

declare module "next-auth/adapters" {
  interface AdapterUser {
    activeOrgId?: string | null;
  }
}
