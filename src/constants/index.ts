import { env } from '@/lib/env.client';

export const API_BASE_URL = env.NEXT_PUBLIC_API_URL;

export const DEFAULT_LIMIT = 20;
export const DEFAULT_PAGE = 1;


export const POKEMON_ARTWORK_BASE_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';
