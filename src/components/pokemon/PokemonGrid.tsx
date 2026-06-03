'use client';

import PokemonCard from './PokemonCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import type { PokemonListItem } from '@/schemas/pokemon.schema';

interface PokemonGridProps {
  pokemon: PokemonListItem[];
  isLoading: boolean;
  isError: boolean;
  hasNext: boolean;
  isFetchingNextPage: boolean;
  onCardClick: (name: string) => void;
  onLoadMore: () => void;
}

export default function PokemonGrid({
  pokemon,
  isLoading,
  isError,
  hasNext,
  isFetchingNextPage,
  onCardClick,
  onLoadMore,
}: PokemonGridProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-32">
        <LoadingSpinner size={56} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center py-32 gap-4 bg-red-50 rounded-2xl">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-red-300">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 7v5M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <p className="text-red-400 font-medium">Failed to load Pokémon</p>
        <p className="text-red-300 text-sm">Please check your connection and try again</p>
      </div>
    );
  }

  if (pokemon.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center py-32 gap-4 bg-slate-50 rounded-2xl">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-slate-300">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <p className="text-[#A0AFBA] font-medium">No Pokémon found</p>
        <p className="text-[#C5CDD3] text-sm">Try a different search or filter</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 pb-10">
        {pokemon.map((p) => (
          <PokemonCard key={p.id} pokemon={p} onClick={onCardClick} />
        ))}
      </div>

      {/* Load More Button */}
      {hasNext && (
        <div className="flex justify-center pb-12 pt-2">
          <button
            onClick={onLoadMore}
            disabled={isFetchingNextPage}
            className="px-6 py-3 rounded-xl bg-primary text-white font-semibold shadow-lg shadow-primary/20 hover:bg-primary-dark hover:shadow-primary-dark/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
            aria-label="Load more Pokémon"
          >
            {isFetchingNextPage ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading more...
              </>
            ) : (
              'Load More'
            )}
          </button>
        </div>
      )}
    </>
  );
}
