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
  const messages: string[] = [];
  
  // Format field-specific errors
  for (const [field, errors] of Object.entries(flat.fieldErrors)) {
    if (Array.isArray(errors) && errors.length > 0) {
      messages.push(`  • ${field}: ${errors.join(", ")}`);
    }
  }
  
  // Format form-level errors
  if (flat.formErrors.length > 0) {
    messages.push(`  • ${flat.formErrors.join(", ")}`);
  }
  
  return {
    formErrors: flat.formErrors,
    fieldErrors: flat.fieldErrors,
    readableMessage: messages.length > 0 
      ? `\n${messages.join("\n")}` 
      : "Unknown validation error",
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

  const formatted = formatZodError(parsed.error);
  const errorMessage = `
╔════════════════════════════════════════════════════════════════════════════╗
║ ENVIRONMENT CONFIGURATION ERROR                                            ║
╚════════════════════════════════════════════════════════════════════════════╝

Your application failed to start due to invalid or missing environment variables.

ERRORS:${formatted.readableMessage}

TROUBLESHOOTING:
  1. Copy .env.example to .env if you haven't already
  2. Fill in all required values in your .env file
  3. Ensure all values match the expected format (URLs, numbers, etc.)
  4. Check that sensitive values meet minimum length requirements

For more details, see .env.example in the project root.
`;

  throw new EnvValidationError(errorMessage, {
    errors: formatted,
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
