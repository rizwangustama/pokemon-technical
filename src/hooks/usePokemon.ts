import { useQuery } from '@tanstack/react-query';
import { pokemonService } from '@/services/pokemon.service';

export const pokemonKeys = {
  all: ['pokemon'] as const,
  lists: () => [...pokemonKeys.all, 'list'] as const,
  list: (limit: number, offset: number) =>
    [...pokemonKeys.lists(), { limit, offset }] as const,
  details: () => [...pokemonKeys.all, 'detail'] as const,
  detail: (nameOrId: string | number) =>
    [...pokemonKeys.details(), String(nameOrId).toLowerCase()] as const,
};

/**
 * Custom hook to fetch a paginated list of Pokemon.
 */
export function usePokemonList(limit = 20, offset = 0) {
  return useQuery({
    queryKey: pokemonKeys.list(limit, offset),
    queryFn: () => pokemonService.getPokemonList(limit, offset),
    placeholderData: (prev) => prev, // Keeps old list visible while loading new pages (smoother UI)
  });
}

/**
 * Custom hook to fetch details for a specific Pokemon.
 */
export function usePokemonDetail(nameOrId: string | number) {
  const normalizedId = String(nameOrId).trim().toLowerCase();
  return useQuery({
    queryKey: pokemonKeys.detail(normalizedId),
    queryFn: () => pokemonService.getPokemonDetail(normalizedId),
    enabled: Boolean(normalizedId),
  });
}
