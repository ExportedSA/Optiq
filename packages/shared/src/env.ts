import { z } from "zod";

export const AppEnvSchema = z.enum(["development", "staging", "production"]);
export type AppEnv = z.infer<typeof AppEnvSchema>;

export type EnvLoadOptions = {
  redactKeys?: string[];
};

export class EnvValidationError extends Error {
  public readonly details: unknown;

  public constructor(message: string, details: unknown) {
    super(message);
    this.name = "EnvValidationError";
    this.details = details;
  }
}

function formatZodError(err: z.ZodError) {
  const flat = err.flatten();
  return {
    formErrors: flat.formErrors,
    fieldErrors: flat.fieldErrors,
  };
}

export function loadEnv<TSchema extends z.ZodTypeAny>(
  schema: TSchema,
  raw: Record<string, string | undefined>,
  options: EnvLoadOptions = {},
): z.infer<TSchema> {
  const parsed = schema.safeParse(raw);
  if (parsed.success) return parsed.data;

  const redacted = new Set(options.redactKeys ?? []);
  const snapshot: Record<string, string | undefined> = {};
  for (const [k, v] of Object.entries(raw)) {
    snapshot[k] = redacted.has(k) ? "[REDACTED]" : v;
  }

  throw new EnvValidationError("Invalid environment configuration", {
    errors: formatZodError(parsed.error),
    snapshot,
  });
}

export function getRuntimeEnv(rawAppEnv: string | undefined): AppEnv {
  const appEnv = rawAppEnv?.toLowerCase();
  if (appEnv === "production") return "production";
  if (appEnv === "staging") return "staging";
  return "development";
}

export function buildEnvMeta(appEnv: AppEnv) {
  return {
    appEnv,
    isDevelopment: appEnv === "development",
    isStaging: appEnv === "staging",
    isProduction: appEnv === "production",
  };
}
