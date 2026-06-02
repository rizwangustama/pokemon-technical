import { z } from 'zod';

const clientEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().default('/api'),
});

const parsed = clientEnvSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});

if (!parsed.success) {
  console.error(
    '❌ Invalid Client environment variables:',
    JSON.stringify(parsed.error.format(), null, 2)
  );
  throw new Error('Invalid Client environment variables');
}

export const env = parsed.data;
