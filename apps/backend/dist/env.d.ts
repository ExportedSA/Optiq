import "dotenv/config";
export declare const env: {
    readonly appEnv: "development" | "staging" | "production";
    readonly isDevelopment: boolean;
    readonly isStaging: boolean;
    readonly isProduction: boolean;
    readonly APP_ENV: "development" | "staging" | "production";
    readonly NODE_ENV: "development" | "production" | "test";
    readonly PORT: number;
    readonly DATABASE_URL: string;
    readonly LOG_LEVEL: "error" | "fatal" | "warn" | "info" | "debug" | "trace";
    readonly DATA_ENCRYPTION_KEY: string;
    readonly META_APP_ID: string;
    readonly META_APP_SECRET: string;
    readonly META_REDIRECT_URI: string;
    readonly TIKTOK_APP_ID: string;
    readonly TIKTOK_APP_SECRET: string;
    readonly TIKTOK_OAUTH_REDIRECT_URI: string;
    readonly TIKTOK_API_BASE_URL: string;
    readonly CORS_ORIGIN?: string | undefined;
};
//# sourceMappingURL=env.d.ts.map