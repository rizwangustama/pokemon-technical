import { axiosInstance } from '@/lib/axios';
import {
  pokemonDetailResponseSchema,
  PokemonDetailResponse,
  PokemonListResponse,
} from '@/schemas/pokemon.schema';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '@/constants';

export const pokemonService = {
  /**
   * Fetch a paginated list of Pokemon.
   */
  async getPokemonList(
    limit = DEFAULT_LIMIT,
    page = DEFAULT_PAGE,
    search = '',
    type = '',
  ): Promise<PokemonListResponse> {
    const response = await axiosInstance.get<PokemonListResponse>('/pokemon/list', {
      params: { limit, page, search, type, types: type },
    });
    return response.data;
  },

  /**
   * Fetch details for a specific Pokemon by name or ID.
   */
  async getPokemonDetail(nameOrId: string | number): Promise<PokemonDetailResponse> {
    const response = await axiosInstance.get(`/pokemon/${String(nameOrId).toLowerCase()}`);
    // Validate enveloped response payload using Zod to ensure strong type safety at runtime
    return pokemonDetailResponseSchema.parse(response.data);
  },
};
