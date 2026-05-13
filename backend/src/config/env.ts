import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const AI_PROVIDERS = ['groq', 'openai', 'huggingface', 'ollama'] as const;

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(3001),
    FRONTEND_URL: z.string().url().default('http://localhost:8080'),

    AI_PROVIDER: z.enum(AI_PROVIDERS).default('groq'),
    GROQ_API_KEY: z.string().optional(),
    OPENAI_API_KEY: z.string().optional(),
    HUGGINGFACE_API_KEY: z.string().optional(),
    OLLAMA_URL: z.string().url().default('http://localhost:11434'),

    DATABASE_PATH: z.string().default('./data/conversations.db'),

    RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900_000),
    RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(100),

    LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  })
  .superRefine((env, ctx) => {
    const keyByProvider: Record<(typeof AI_PROVIDERS)[number], keyof typeof env | null> = {
      groq: 'GROQ_API_KEY',
      openai: 'OPENAI_API_KEY',
      huggingface: 'HUGGINGFACE_API_KEY',
      ollama: null,
    };
    const required = keyByProvider[env.AI_PROVIDER];
    if (required && !env[required]) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [required as string],
        message: `${required} is required when AI_PROVIDER=${env.AI_PROVIDER}`,
      });
    }
  });

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // Don't use the logger here — it depends on env. Plain stderr is correct for startup failure.
  console.error('❌ Invalid environment configuration:');
  for (const issue of parsed.error.issues) {
    console.error(`  - ${issue.path.join('.') || '(root)'}: ${issue.message}`);
  }
  process.exit(1);
}

export const config = parsed.data;
export type Config = typeof config;
