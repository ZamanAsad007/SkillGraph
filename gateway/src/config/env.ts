import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const booleanEnv = z.preprocess((value) => {
  if (typeof value === "string") return ["1", "true", "yes"].includes(value.toLowerCase());
  return value;
}, z.boolean());

const envSchema = z.object({
  GATEWAY_PORT: z.coerce.number().default(3000),
  NODE_ENV: z.string().default("development"),
  DATABASE_URL: z.string().default("postgresql://skillgraph:skillgraph@postgres:5432/skillgraph"),
  REDIS_URL: z.string().default("redis://redis:6379"),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  GITHUB_CALLBACK_URL: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CALLBACK_URL: z.string().optional(),
  FRONTEND_URL: z.string().url().default("http://localhost:5173"),
  GRAPH_SERVICE_URL: z.string().url().default("http://graph-service:3001"),
  NLP_SERVICE_URL: z.string().url().default("http://nlp-service:8001"),
  TOKEN_ENCRYPTION_KEY: z.string().default("skillgraph-development-token-key"),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_SECURE: booleanEnv.default(false),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  JWT_PUBLIC_KEY: z.string().optional(),
  JWT_PRIVATE_KEY: z.string().optional(),
  JWT_ISSUER: z.string().default("skillgraph"),
  JWT_AUDIENCE: z.string().default("skillgraph-web")
});

export const env = envSchema.parse(process.env);
