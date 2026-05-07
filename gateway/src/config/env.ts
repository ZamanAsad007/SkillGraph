import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  GATEWAY_PORT: z.coerce.number().default(3000),
  NODE_ENV: z.string().default("development"),
  DATABASE_URL: z.string().default("postgresql://skillgraph:skillgraph@postgres:5432/skillgraph"),
  REDIS_URL: z.string().default("redis://redis:6379"),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  GITHUB_CALLBACK_URL: z.string().optional(),
  JWT_PUBLIC_KEY: z.string().optional(),
  JWT_PRIVATE_KEY: z.string().optional(),
  JWT_ISSUER: z.string().default("skillgraph"),
  JWT_AUDIENCE: z.string().default("skillgraph-web")
});

export const env = envSchema.parse(process.env);
