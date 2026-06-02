import { env } from '@/lib/env.client';

export const API_BASE_URL = env.NEXT_PUBLIC_API_URL;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
} as const;
