import { z } from "zod";
export declare const AppEnvSchema: z.ZodEnum<{
    development: "development";
    staging: "staging";
    production: "production";
}>;
export type AppEnv = z.infer<typeof AppEnvSchema>;
export type EnvLoadOptions = {
    redactKeys?: string[];
};
export declare class EnvValidationError extends Error {
    readonly details: unknown;
    constructor(message: string, details: unknown);
}
export declare function loadEnv<TSchema extends z.ZodTypeAny>(schema: TSchema, raw: Record<string, string | undefined>, options?: EnvLoadOptions): z.infer<TSchema>;
export declare function getRuntimeEnv(rawAppEnv: string | undefined): AppEnv;
export declare function buildEnvMeta(appEnv: AppEnv): {
    appEnv: "development" | "staging" | "production";
    isDevelopment: boolean;
    isStaging: boolean;
    isProduction: boolean;
};
//# sourceMappingURL=env.d.ts.map