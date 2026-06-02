import { axiosInstance } from '@/lib/axios';
import {
  pokemonDetailSchema,
  PokemonDetail,
  PokemonListResponse,
} from '@/schemas/pokemon.schema';

export const pokemonService = {
  /**
   * Fetch a paginated list of Pokemon.
   */
  async getPokemonList(limit = 20, offset = 0): Promise<PokemonListResponse> {
    const response = await axiosInstance.get<PokemonListResponse>('/pokemon', {
      params: { limit, offset },
    });
    return response.data;
  },

  /**
   * Fetch details for a specific Pokemon by name or ID.
   */
  async getPokemonDetail(nameOrId: string | number): Promise<PokemonDetail> {
    const response = await axiosInstance.get(`/pokemon/${String(nameOrId).toLowerCase()}`);
    // Validate response payload using Zod to ensure strong type safety at runtime
    return pokemonDetailSchema.parse(response.data);
  },
};
