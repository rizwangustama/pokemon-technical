import { POKEMON_ARTWORK_BASE_URL } from '@/constants/index';

/**
 * Capitalize the first letter of a string.
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Extract the numeric ID from a PokeAPI URL.
 * e.g. "https://pokeapi.co/api/v2/pokemon/25/" → 25
 */
export function extractIdFromUrl(url: string): number {
  const match = url.match(/\/(\d+)\/?$/);
  return match ? Number(match[1]) : 0;
}

/**
 * Format a number as a zero-padded Pokédex entry string.
 * e.g. 25 → "#025"
 */
export function formatPokedexNumber(id: number | string): string {
  return `#${String(id).padStart(3, '0')}`;
}

/**
 * Generate the official artwork image URL for a given Pokemon ID.
 */
export function getPokemonArtworkUrl(id: number | string): string {
  return `${POKEMON_ARTWORK_BASE_URL}/${id}.png`;
}

/**
 * Replaces hyphens with spaces and capitalizes each word.
 * e.g. "special-attack" → "Special Attack"
 */
export function formatSpasi(value: string | undefined): string {
  if (!value) return '';
  return value
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Abbreviates long stat names for display in stat bars.
 */
export function formatStatName(statName: string): string {
  switch (statName) {
    case 'special-attack':
      return 'Sp. Atk';
    case 'special-defense':
      return 'Sp. Def';
    case 'hp':
      return 'HP';
    default:
      return formatSpasi(statName);
  }
}
