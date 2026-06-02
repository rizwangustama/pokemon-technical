import 'server-only';
import { z } from 'zod';

const serverEnvSchema = z.object({
  POKEAPI_URL: z.string().url().default('https://pokeapi.co/api/v2'),
  PORT: z.preprocess(
    (val) => (val ? parseInt(String(val), 10) : undefined),
    z.number().int().positive().default(3000)
  ),
});

const parsed = serverEnvSchema.safeParse({
  POKEAPI_URL: process.env.POKEAPI_URL,
  PORT: process.env.PORT,
});

if (!parsed.success) {
  console.error(
    '❌ Invalid Server environment variables:',
    JSON.stringify(parsed.error.format(), null, 2)
  );
  throw new Error('Invalid Server environment variables');
}

export const env = parsed.data;
