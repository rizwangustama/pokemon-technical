import { z } from 'zod';

const clientEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().default('/api'),
  NEXT_PUBLIC_SIGNATURE_SECRET: z.string().min(10),
});

const parsed = clientEnvSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_SIGNATURE_SECRET: process.env.NEXT_PUBLIC_SIGNATURE_SECRET,
});

if (!parsed.success) {
  console.error(
    '❌ Invalid Client environment variables:',
    JSON.stringify(parsed.error.format(), null, 2)
  );
  throw new Error('Invalid Client environment variables');
}

export const env = parsed.data;
