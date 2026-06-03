'use client';

import React, { useState, useEffect } from 'react';
import { usePokemonList } from '@/hooks/usePokemon';
import { PokemonCard } from '@/components/PokemonCard';
import { PokemonDetailModal, typeColorMap } from '@/components/PokemonDetailModal';
import { logClientActivity } from '@/utils/clientLogger';
import { capitalize } from '@/utils/index';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

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
  const [page, setPage] = useState(1);
  const [selectedPokemon, setSelectedPokemon] = useState<string | null>(null);

  // 1. Debounce Search Input to avoid overloading the API and logs
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // 2. Initial Mount System Logging
  useEffect(() => {
    logClientActivity('Initialize Dashboard', 'Loaded Pokemon V2 Frontend App');
  }, []);

  // 3. Log query parameters changes
  useEffect(() => {
    if (debouncedSearch) {
      logClientActivity('Update Search Query', `Query: "${debouncedSearch}"`);
      setPage(1); // Reset page on search
    }
  }, [debouncedSearch]);

  useEffect(() => {
    logClientActivity('Update Type Filter', `Type: ${activeType || 'All Types'}`);
    setPage(1); // Reset page on type filter change
  }, [activeType]);

  useEffect(() => {
    logClientActivity('Change Page', `Navigated to Page ${page}`);
  }, [page]);

  // 4. Fetch list using custom hook
  const limit = 16; // 4x4 Grid fits nicely
  const {
    data: listResponse,
    isLoading,
    isFetching,
    error,
  } = usePokemonList(limit, page, debouncedSearch, activeType);

  const pokemonItems = listResponse?.data?.items ?? [];
  const pagination = listResponse?.data?.pagination;
  const hasNextPage = pagination?.hasNextPage ?? false;
  const totalItems = pagination?.total ?? 0;

  const handleTypeSelect = (type: string) => {
    if (activeType === type) {
      setActiveType(''); // Clear filter
    } else {
      setActiveType(type);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50/50 pb-16 text-gray-900">
      {/* Upper Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            {/* Animated PokeBall Icon */}
            <div className="relative h-9 w-9 animate-spin hover:animate-[spin_0.5s_linear_infinite] cursor-pointer">
              <svg viewBox="0 0 100 100" className="h-full w-full">
                <circle cx="50" cy="50" r="48" fill="#F3F4F6" stroke="#1F2937" strokeWidth="6" />
                <path d="M2 50 H98" stroke="#1F2937" strokeWidth="8" />
                <path d="M2 50 A 48 48 0 0 1 98 50" fill="#EF4444" stroke="#1F2937" strokeWidth="6" />
                <circle cx="50" cy="50" r="16" fill="white" stroke="#1F2937" strokeWidth="8" />
                <circle cx="50" cy="50" r="6" fill="#F3F4F6" stroke="#9CA3AF" strokeWidth="1.5" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-gray-900 sm:text-xl">
                Poké<span className="text-blue-600">Terminal</span> v2
              </h1>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest leading-none">
                Clean Architecture & Logs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-xs font-bold text-gray-500">
              Terminal Log: Active
            </span>
          </div>
        </div>
      </header>

      {/* Hero / Terminal info Banner */}
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-gray-150 bg-white p-6 shadow-sm sm:p-8">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
              Real-time Console Activity Logger
            </h2>
            <p className="mt-2 text-sm text-gray-500 leading-relaxed">
              Every action you perform in this dashboard triggers network events that are signed on the client and verified on the server.
              Check your <strong className="text-gray-900 font-bold">Node.js system terminal</strong> (where you run <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-blue-600 font-semibold">npm run dev</code>) to inspect live client-server network telemetry and latency details!
            </p>
          </div>
          {/* Subtle decoration background pattern */}
          <div className="absolute right-0 bottom-0 top-0 hidden w-1/3 opacity-[0.03] lg:block">
            <svg className="h-full w-full" fill="none" viewBox="0 0 400 400">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect width="20" height="20" fill="none" />
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        </div>
      </section>

      {/* Main Section */}
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar / Filters (1 Column on Large screen) */}
          <div className="space-y-6 lg:col-span-1">
            {/* Search Card */}
            <div className="rounded-2xl border border-gray-150 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">
                Search Pokemon
              </h3>
              <Input
                placeholder="Type name (e.g. pikachu)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
                aria-label="Search Pokemon by name"
              />
            </div>

            {/* Types Filter Card */}
            <div className="rounded-2xl border border-gray-150 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">
                  Filter by Type
                </h3>
                {activeType && (
                  <button
                    onClick={() => setActiveType('')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {POKEMON_TYPES.map((type) => {
                  const isActive = activeType === type;
                  const currentStyle = typeColorMap[type] || typeColorMap.normal;
                  
                  return (
                    <button
                      key={type}
                      onClick={() => handleTypeSelect(type)}
                      className={[
                        'px-2.5 py-1 text-xs font-bold rounded-lg border transition-all duration-150 uppercase tracking-wide cursor-pointer',
                        isActive
                          ? `${currentStyle.bg} ${currentStyle.text} ${currentStyle.border} scale-105 shadow-sm font-black`
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900',
                      ]
                        .join(' ')
                        .trim()}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Grid list (3 Columns on Large Screen) */}
          <div className="space-y-6 lg:col-span-3">
            {/* Error Message */}
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <span className="font-semibold">Failed to fetch Pokémon list.</span> Please verify your connection or request signing credentials.
                <p className="mt-1 text-xs text-red-500 font-mono">
                  {error instanceof Error ? error.message : String(error)}
                </p>
              </div>
            )}

            {/* List Results */}
            {isLoading ? (
              // Loading skeletons
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-5 shadow-sm animate-pulse h-48"
                  >
                    <div className="h-4 w-12 rounded bg-gray-200 self-end mb-2" />
                    <div className="h-28 w-28 rounded-full bg-gray-150 mb-3" />
                    <div className="h-4 w-20 rounded bg-gray-200" />
                  </div>
                ))}
              </div>
            ) : pokemonItems.length === 0 ? (
              // Empty state
              <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
                <div className="text-4xl">🔍</div>
                <h3 className="mt-4 text-base font-bold text-gray-800">No Pokémon found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search filters or clear the active search term.
                </p>
                {(debouncedSearch || activeType) && (
                  <Button
                    variant="outline"
                    className="mt-6"
                    onClick={() => {
                      setSearch('');
                      setActiveType('');
                    }}
                  >
                    Reset Filters
                  </Button>
                )}
              </div>
            ) : (
              // Pokemon Grid
              <div className="relative">
                {isFetching && (
                  <div className="absolute top-2 right-2 z-10 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-bold text-gray-400 backdrop-blur-sm animate-pulse">
                    Refreshing...
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {pokemonItems.map((pokemon) => (
                    <PokemonCard
                      key={pokemon.id}
                      pokemon={pokemon}
                      onClick={() => setSelectedPokemon(pokemon.name)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Pagination Controls */}
            {pagination && totalItems > 0 && (
              <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                <div className="text-xs font-semibold text-gray-500">
                  Showing <span className="text-gray-800 font-bold">{pokemonItems.length}</span> of{' '}
                  <span className="text-gray-800 font-bold">{totalItems}</span> Pokemon
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1 || isLoading}
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  >
                    Previous
                  </Button>
                  <span className="font-mono text-sm font-bold text-gray-700">
                    Page {page}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!hasNextPage || isLoading}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Pokemon details modal overlay */}
      <PokemonDetailModal
        pokemonName={selectedPokemon}
        onClose={() => setSelectedPokemon(null)}
      />
    </main>
  );
}
