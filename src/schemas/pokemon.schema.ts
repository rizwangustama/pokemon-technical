import { z } from 'zod';

// ==========================================
// Client-Facing Zod Schemas (BFF Optimized)
// ==========================================

export const pokemonListItemSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  url: z.string(),
  imageUrl: z.string().url(),
});

export const paginationInfoSchema = z.object({
  total: z.number().int().nonnegative(),
  limit: z.number().int().positive(),
  page: z.number().int().positive(),
  hasNextPage: z.boolean(),
});

export const pokemonListResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    items: z.array(pokemonListItemSchema),
    pagination: paginationInfoSchema,
  }),
});

export const pokemonDetailSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  height: z.number(),
  weight: z.number(),
  imageUrl: z.string().url(),
  types: z.array(z.string()),
  abilities: z.array(z.string()),
  stats: z.array(
    z.object({
      name: z.string(),
      value: z.number(),
    })
  ),
});

export const pokemonDetailResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: pokemonDetailSchema,
});

export type PokemonDetail = z.infer<typeof pokemonDetailSchema>;
export type PokemonDetailResponse = z.infer<typeof pokemonDetailResponseSchema>;
export type PokemonListResponse = z.infer<typeof pokemonListResponseSchema>;
export type PokemonListItem = z.infer<typeof pokemonListItemSchema>;
export type PaginationInfo = z.infer<typeof paginationInfoSchema>;
