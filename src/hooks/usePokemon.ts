import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { pokemonService } from '@/services/pokemon.service';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '@/constants';

export const pokemonKeys = {
  all: ['pokemon'] as const,
  lists: () => [...pokemonKeys.all, 'list'] as const,
  infiniteList: (limit: number, search: string | null, type: string | null) =>
    [...pokemonKeys.lists(), 'infinite', { limit, search, type }] as const,
  details: () => [...pokemonKeys.all, 'detail'] as const,
  detail: (nameOrId: string | number) =>
    [...pokemonKeys.details(), String(nameOrId).toLowerCase()] as const,
};


/**
 * Custom hook to fetch an infinite list of Pokemon.
 */
export function usePokemonInfiniteList(limit = DEFAULT_LIMIT, search: string | null = null, type: string | null = null) {
  return useInfiniteQuery({
    queryKey: pokemonKeys.infiniteList(limit, search, type),
    queryFn: ({ pageParam }) =>
      pokemonService.getPokemonList(limit, pageParam, search, type),
    initialPageParam: DEFAULT_PAGE,
    getNextPageParam: (lastPage) => {
      const { page, hasNextPage } = lastPage.data.pagination;
      return hasNextPage ? page + 1 : undefined;
    },
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
