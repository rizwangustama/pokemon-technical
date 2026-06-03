'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Hero from '@/components/layout/Hero';
import Footer from '@/components/layout/Footer';
import PokemonFilters from '@/components/pokemon/PokemonFilters';
import PokemonGrid from '@/components/pokemon/PokemonGrid';
import PokemonModal from '@/components/pokemon/PokemonModal';

import { usePokemonInfiniteList } from '@/hooks/usePokemon';
import { logClientActivity } from '@/utils/clientLogger';
import { DEFAULT_LIMIT } from '@/constants';

const POKEMON_TYPES = [
  'normal',
  'fire',
  'water',
  'grass',
  'electric',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'steel',
  'dark',
  'fairy',
];

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [activeType, setActiveType] = useState('');
  const [isTypeMenuOpen, setIsTypeMenuOpen] = useState(false);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedPokemon, setSelectedPokemon] = useState<string | null>(null);

  // 1. Debounce Search Input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // 2. Initial Mount Logging
  useEffect(() => {
    logClientActivity('Initialize Dashboard', 'Loaded Pokemon V2 Frontend App');
  }, []);

  // 3. Log query parameters changes
  useEffect(() => {
    if (debouncedSearch) {
      logClientActivity('Update Search Query', `Query: "${debouncedSearch}"`);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    logClientActivity('Update Type Filter', `Type: ${activeType || 'All Types'}`);
  }, [activeType]);

  // 4. Fetch list using custom hook
  const {
    data: listResponse,
    isLoading,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    error,
  } = usePokemonInfiniteList(DEFAULT_LIMIT, debouncedSearch, activeType);

  const pokemonItems = listResponse?.pages.flatMap((page) => page.data.items) ?? [];
  const totalItems = listResponse?.pages[0]?.data.pagination.total ?? 0;

  // Log loading more pages
  const fetchedPageCount = listResponse?.pages.length ?? 1;
  useEffect(() => {
    if (fetchedPageCount > 1) {
      logClientActivity('Load More Pokémon', `Loaded page ${fetchedPageCount}`);
    }
  }, [fetchedPageCount]);

  // 5. Client-side sorting
  const sortedItems = [...pokemonItems].sort((a, b) => {
    const cmp = a.name.localeCompare(b.name);
    return sortDirection === 'asc' ? cmp : -cmp;
  });

  const handleTypeSelect = (type: string) => {
    setActiveType(type);
    setIsTypeMenuOpen(false);
  };

  const handleTypeReset = () => {
    setActiveType('');
    setIsTypeMenuOpen(false);
  };

  return (
    <>
      <Header />
      <Hero />
      <main id="pokemon-list" className="bg-white pb-16 relative">
        {/* Refresh indicator */}
        {isFetching && !isLoading && (
          <div className="absolute top-2 right-2 md:top-4 md:right-4 z-10 rounded-full bg-white/70 px-3 py-1 text-[10px] font-bold text-gray-400 backdrop-blur-sm border border-slate-100 shadow-sm animate-pulse">
            Refreshing...
          </div>
        )}

        <div className="container">
          {/* Section header */}
          <div className="pt-10 md:pt-16 pb-4">
            <div className="flex items-center gap-3 mb-1">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                <path d="M8.74228e-07 10C9.89033e-07 8.68678 0.258659 7.38642 0.761205 6.17316C1.26375 4.95991 2.00035 3.85752 2.92893 2.92893C3.85752 2.00034 4.95991 1.26375 6.17317 0.761203C7.38642 0.258656 8.68678 -9.89033e-07 10 -8.74228e-07C11.3132 -7.59423e-07 12.6136 0.258657 13.8268 0.761205C15.0401 1.26375 16.1425 2.00035 17.0711 2.92893C17.9997 3.85752 18.7362 4.95991 19.2388 6.17317C19.7413 7.38642 20 8.68678 20 10L10 10L8.74228e-07 10Z" fill="url(#paint0_linear)" fillOpacity="0.5"/>
                <circle cx="12" cy="12" r="9.25" stroke="#F33C3C" strokeWidth="1.5"/>
                <circle cx="10.0001" cy="9.99989" r="2.88636" fill="#FEFEFE" stroke="#F33C3C" strokeWidth="1.5"/>
                <path d="M6.81818 10H0" stroke="#F33C3C" strokeWidth="1.5"/>
                <path d="M18.8811 10L12.5874 10" stroke="#F33C3C" strokeWidth="1.5"/>
                <defs>
                  <linearGradient id="paint0_linear" x1="23" y1="-9.31315e-07" x2="-3" y2="9.5" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F33C3C"/>
                    <stop offset="1" stopColor="#F33C3C" stopOpacity="0"/>
                  </linearGradient>
                </defs>
              </svg>
              <h2 className="text-lg md:text-xl font-bold text-[#2F3133]">Pokédex</h2>
            </div>
            <p className="text-sm text-[#A0AFBA]">
              {isLoading ? 'Loading...' : `${totalItems} Pokémon found`}
            </p>
          </div>

          {/* Filters */}
          <PokemonFilters
            pokemonTypes={POKEMON_TYPES}
            selectedType={activeType}
            isTypeMenuOpen={isTypeMenuOpen}
            sortDirection={sortDirection}
            searchTerm={search}
            onSearchChange={setSearch}
            onToggleSort={() => setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))}
            onSelectType={handleTypeSelect}
            onResetType={handleTypeReset}
            onToggleTypeMenu={() => setIsTypeMenuOpen((open) => !open)}
            onCloseTypeMenu={() => setIsTypeMenuOpen(false)}
          />

          {/* Grid */}
          <div className="pt-6">
            <PokemonGrid
              pokemon={sortedItems}
              isLoading={isLoading}
              isError={Boolean(error)}
              hasNext={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              onCardClick={setSelectedPokemon}
              onLoadMore={fetchNextPage}
            />
          </div>
        </div>
      </main>

      <PokemonModal
        pokemonName={selectedPokemon}
        onClose={() => setSelectedPokemon(null)}
      />

      <Footer />
    </>
  );
}
