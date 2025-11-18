import * as dotenv from "dotenv";

dotenv.config();

const requiredVars = ["DATABASE_URL"] as const;

const missing = requiredVars.filter((key) => !process.env[key]);
if (missing.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missing.join(", ")}`
  );
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: process.env.DATABASE_URL!,
  corsOrigin: process.env.CORS_ORIGIN ?? "*",
  socketPath: process.env.SOCKET_PATH ?? "/ws",
};
