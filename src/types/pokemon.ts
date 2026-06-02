import { ApiResponse } from './api';

// ==========================================
// 1. Raw Upstream API Types (PokeAPI raw shape)
// ==========================================
export interface PokeApiPokemonListItem {
  name: string;
  url: string;
}

export interface PokeApiPokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokeApiPokemonListItem[];
}

export interface PokeApiAbilityInfo {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface PokeApiGameIndex {
  game_index: number;
  version: {
    name: string;
    url: string;
  };
}

export interface PokeApiMoveLearnMethod {
  name: string;
  url: string;
}

export interface PokeApiVersionGroup {
  name: string;
  url: string;
}

export interface PokeApiVersionGroupDetail {
  level_learned_at: number;
  move_learn_method: PokeApiMoveLearnMethod;
  order: number | null;
  version_group: PokeApiVersionGroup;
}

export interface PokeApiMoveInfo {
  move: {
    name: string;
    url: string;
  };
  version_group_details: PokeApiVersionGroupDetail[];
}

export interface PokeApiStatInfo {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokeApiTypeInfo {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokeApiSprites {
  back_default: string | null;
  back_female: string | null;
  back_shiny: string | null;
  back_shiny_female: string | null;
  front_default: string | null;
  front_female: string | null;
  front_shiny: string | null;
  front_shiny_female: string | null;
  other?: {
    dream_world?: {
      front_default: string | null;
      front_female: string | null;
    };
    home?: {
      front_default: string | null;
      front_female: string | null;
      front_shiny: string | null;
      front_shiny_female: string | null;
    };
    'official-artwork'?: {
      front_default: string | null;
      front_shiny: string | null;
    };
    showdown?: {
      back_default: string | null;
      back_female: string | null;
      back_shiny: string | null;
      back_shiny_female: string | null;
      front_default: string | null;
      front_female: string | null;
      front_shiny: string | null;
      front_shiny_female: string | null;
    };
  };
}

export interface PokeApiPokemonDetailResponse {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  weight: number;
  is_default: boolean;
  order: number;
  location_area_encounters: string;
  species: {
    name: string;
    url: string;
  };
  abilities: PokeApiAbilityInfo[];
  forms: Array<{ name: string; url: string }>;
  game_indices: PokeApiGameIndex[];
  moves: PokeApiMoveInfo[];
  sprites: PokeApiSprites;
  stats: PokeApiStatInfo[];
  types: PokeApiTypeInfo[];
}

export interface PokeApiDamageRelationLink {
  name: string;
  url: string;
}

export interface PokeApiDamageRelations {
  double_damage_from: PokeApiDamageRelationLink[];
  double_damage_to: PokeApiDamageRelationLink[];
  half_damage_from: PokeApiDamageRelationLink[];
  half_damage_to: PokeApiDamageRelationLink[];
  no_damage_from: PokeApiDamageRelationLink[];
  no_damage_to: PokeApiDamageRelationLink[];
}

export interface PokeApiTypeGameIndex {
  game_index: number;
  generation: {
    name: string;
    url: string;
  };
}

export interface PokeApiTypePokemon {
  pokemon: {
    name: string;
    url: string;
  };
  slot: number;
}

export interface PokeApiTypeDetailResponse {
  id: number;
  name: string;
  damage_relations: PokeApiDamageRelations;
  game_indices: PokeApiTypeGameIndex[];
  generation: {
    name: string;
    url: string;
  };
  move_damage_class: {
    name: string;
    url: string;
  } | null;
  moves: Array<{ name: string; url: string }>;
  names: Array<{
    language: { name: string; url: string };
    name: string;
  }>;
  pokemon: PokeApiTypePokemon[];
}

// ==========================================
// 2. Client-Facing Normalized Types (BFF shape)
// ==========================================
export interface PokemonListItem {
  id: number; // Extracted numeric ID from PokeAPI URL (e.g. 25)
  name: string;
  url: string;
  imageUrl: string; // Pre-calculated high-res artwork URL
}

export interface PaginationInfo {
  total: number;
  limit: number;
  offset: number;
  hasNextPage: boolean;
}

export interface PokemonListResponse extends ApiResponse<{
  items: PokemonListItem[];
  pagination: PaginationInfo;
}> { }

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  imageUrl: string; // Dynamic official artwork URL resolved server-side
  types: string[]; // Normalized as simple string array (e.g. ['grass', 'poison'])
  abilities: string[]; // Normalized as simple string array (e.g. ['overgrow', 'chlorophyll'])
  stats: Array<{
    name: string;
    value: number;
  }>; // Normalized flat stats array (e.g. [{ name: 'hp', value: 45 }])
}

export interface PokemonDetailResponse extends ApiResponse<PokemonDetail> { }
