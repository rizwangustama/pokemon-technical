import { z } from 'zod';
import { baseEntitySchema } from './index';

// Schema for simple item inside a list
export const pokemonListItemSchema = z.object({
  name: z.string(),
  url: z.string().url(),
});

// Schema for detailed Pokemon info
export const pokemonDetailSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  sprites: z.object({
    front_default: z.string().url().nullable(),
    other: z.object({
      'official-artwork': z.object({
        front_default: z.string().url().nullable(),
      }).optional(),
    }).optional(),
  }),
  types: z.array(
    z.object({
      slot: z.number(),
      type: baseEntitySchema,
    })
  ),
  stats: z.array(
    z.object({
      base_stat: z.number(),
      effort: z.number(),
      stat: baseEntitySchema,
    })
  ),
});

export type PokemonListItem = z.infer<typeof pokemonListItemSchema>;
export type PokemonDetail = z.infer<typeof pokemonDetailSchema>;
export type PokemonListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
};
