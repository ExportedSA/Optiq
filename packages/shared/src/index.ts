export type HealthResponse = {
  ok: true;
};

export {
  AppEnvSchema,
  buildEnvMeta,
  getRuntimeEnv,
  loadEnv,
  type AppEnv,
  type EnvLoadOptions,
} from "./env";
