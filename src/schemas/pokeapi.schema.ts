import { z } from 'zod';

// ==========================================
// Raw Upstream Zod Schemas (PokeAPI)
// ==========================================

export const pokeApiPokemonListItemSchema = z.object({
  name: z.string(),
  url: z.string().url(),
});

export const pokeApiPokemonListResponseSchema = z.object({
  count: z.number().int().nonnegative(),
  next: z.string().url().nullable(),
  previous: z.string().url().nullable(),
  results: z.array(pokeApiPokemonListItemSchema),
});

export const pokeApiPokemonDetailResponseSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  base_experience: z.number().int().nonnegative(),
  height: z.number().int().nonnegative(),
  weight: z.number().int().nonnegative(),
  is_default: z.boolean(),
  order: z.number().int().nonnegative(),
  location_area_encounters: z.string(),
  species: pokeApiPokemonListItemSchema,
  abilities: z.array(
    z.object({
      ability: pokeApiPokemonListItemSchema,
      is_hidden: z.boolean(),
      slot: z.number(),
    })
  ),
  forms: z.array(pokeApiPokemonListItemSchema),
  game_indices: z.array(
    z.object({
      game_index: z.number(),
      version: pokeApiPokemonListItemSchema,
    })
  ),
  moves: z.array(
    z.object({
      move: pokeApiPokemonListItemSchema,
    })
  ),
  sprites: z.object({
    front_default: z.string().url().nullable(),
    other: z.object({
      'official-artwork': z.object({
        front_default: z.string().url().nullable(),
      }).optional(),
    }).optional(),
  }),
  stats: z.array(
    z.object({
      base_stat: z.number(),
      effort: z.number(),
      stat: pokeApiPokemonListItemSchema,
    })
  ),
  types: z.array(
    z.object({
      slot: z.number(),
      type: pokeApiPokemonListItemSchema,
    })
  ),
});

export const pokeApiTypePokemonSchema = z.object({
  pokemon: pokeApiPokemonListItemSchema,
  slot: z.number(),
});

export const pokeApiTypeDetailResponseSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  pokemon: z.array(pokeApiTypePokemonSchema),
});

export type PokeApiPokemonListResponse = z.infer<typeof pokeApiPokemonListResponseSchema>;
export type PokeApiPokemonDetailResponse = z.infer<typeof pokeApiPokemonDetailResponseSchema>;
export type PokeApiTypeDetailResponse = z.infer<typeof pokeApiTypeDetailResponseSchema>;
export type PokeApiPokemonListItem = z.infer<typeof pokeApiPokemonListItemSchema>;
export type PokeApiTypePokemon = z.infer<typeof pokeApiTypePokemonSchema>;
