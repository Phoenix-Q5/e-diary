import { z } from "zod";

const EnvSchema = z.object({
  PORT: z.coerce.number().default(8082),
  NODE_ENV: z.string().default("development"),

  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  ACCESS_TOKEN_TTL_MINUTES: z.coerce.number().default(15),
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().default(30),

  MONGO_HOST: z.string(),
  MONGO_USER: z.string(),
  MONGO_PASSWORD: z.string(),
  
  CLIENT_ORIGIN: z.string().url()
});

export type Env = z.infer<typeof EnvSchema>;

export function loadEnv(processEnv: NodeJS.ProcessEnv): Env {
  const parsed = EnvSchema.safeParse(processEnv);
  if (!parsed.success) {
    console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment variables");
  }
  return parsed.data;
}
