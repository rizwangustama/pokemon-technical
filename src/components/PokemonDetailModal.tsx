'use client';

import React, { useEffect } from 'react';
import { usePokemonDetail } from '@/hooks/usePokemon';
import { capitalize, formatPokedexNumber } from '@/utils/index';
import { logClientActivity } from '@/utils/clientLogger';
import Loading from './ui/Loading';

interface PokemonDetailModalProps {
  pokemonName: string | null;
  onClose: () => void;
}

export const typeColorMap: Record<
  string,
  { bg: string; text: string; border: string; progress: string }
> = {
  normal: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-250', progress: 'bg-gray-400' },
  fire: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', progress: 'bg-red-500' },
  water: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', progress: 'bg-blue-500' },
  grass: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', progress: 'bg-green-500' },
  electric: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-205', progress: 'bg-amber-400' },
  ice: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', progress: 'bg-cyan-400' },
  fighting: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', progress: 'bg-orange-500' },
  poison: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', progress: 'bg-purple-500' },
  ground: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', progress: 'bg-yellow-600' },
  flying: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', progress: 'bg-indigo-400' },
  psychic: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200', progress: 'bg-pink-500' },
  bug: { bg: 'bg-lime-50', text: 'text-lime-700', border: 'border-lime-200', progress: 'bg-lime-500' },
  rock: { bg: 'bg-stone-100', text: 'text-stone-700', border: 'border-stone-300', progress: 'bg-stone-500' },
  ghost: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', progress: 'bg-violet-600' },
  dragon: { bg: 'bg-indigo-150', text: 'text-indigo-800', border: 'border-indigo-300', progress: 'bg-indigo-600' },
  steel: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300', progress: 'bg-slate-500' },
  dark: { bg: 'bg-zinc-800', text: 'text-zinc-100', border: 'border-zinc-700', progress: 'bg-zinc-700' },
  fairy: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', progress: 'bg-rose-400' },
};

const statColorMap: Record<string, string> = {
  hp: 'bg-emerald-500',
  attack: 'bg-red-500',
  defense: 'bg-blue-500',
  'special-attack': 'bg-purple-500',
  'special-defense': 'bg-indigo-500',
  speed: 'bg-amber-500',
};

export function PokemonDetailModal({ pokemonName, onClose }: PokemonDetailModalProps) {
  const isOpen = Boolean(pokemonName);
  const { data: detailResponse, isLoading, error } = usePokemonDetail(pokemonName ?? '');

  useEffect(() => {
    if (isOpen && pokemonName) {
      logClientActivity('Open Pokemon Details Modal', `Name: ${pokemonName}`);
    }
    return () => {
      if (isOpen && pokemonName) {
        logClientActivity('Close Pokemon Details Modal', `Name: ${pokemonName}`);
      }
    };
  }, [isOpen, pokemonName]);

  if (!isOpen) return null;

  const pokemon = detailResponse?.data;

  // Primary color style based on pokemon primary type
  const primaryType = pokemon?.types[0] ?? 'normal';
  const typeStyle = typeColorMap[primaryType] || typeColorMap.normal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Content Card */}
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl transition-all duration-300 animate-in fade-in zoom-in-95">
        {/* Top Gradient Header */}
        <div className={`absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500`} />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-800 focus:outline-none"
          aria-label="Close modal"
        >
          ✕
        </button>

        {isLoading ? (
          <div className="flex min-h-[350px] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loading size={48} />
              <p className="text-sm font-medium text-gray-500">Querying PokeAPI...</p>
            </div>
          </div>
        ) : error || !pokemon ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 text-red-500">⚠️ Error loading details</div>
            <p className="text-sm text-gray-600">
              {error instanceof Error ? error.message : 'Could not fetch data.'}
            </p>
            <button
              onClick={onClose}
              className="mt-6 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left Panel: Visuals & Types */}
            <div className="flex flex-col items-center border-b border-gray-100 p-8 md:border-b-0 md:border-r">
              <div className="relative flex h-48 w-48 items-center justify-center rounded-full bg-gray-50 p-6">
                <div
                  className={`absolute inset-4 rounded-full filter blur-xl opacity-30 ${typeStyle.bg}`}
                />
                <img
                  src={pokemon.imageUrl}
                  alt={pokemon.name}
                  className="relative z-10 h-full w-full object-contain drop-shadow-md"
                />
              </div>

              <div className="mt-6 text-center">
                <span className="font-mono text-sm font-bold text-gray-400">
                  {formatPokedexNumber(pokemon.id)}
                </span>
                <h2 className="text-2xl font-black text-gray-900">{capitalize(pokemon.name)}</h2>
              </div>

              {/* Types */}
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {pokemon.types.map((type) => {
                  const currentStyle = typeColorMap[type] || typeColorMap.normal;
                  return (
                    <span
                      key={type}
                      className={`rounded-full border px-3.5 py-1 text-xs font-bold tracking-wide uppercase ${currentStyle.bg} ${currentStyle.text} ${currentStyle.border}`}
                    >
                      {type}
                    </span>
                  );
                })}
              </div>

              {/* Height & Weight */}
              <div className="mt-6 grid grid-cols-2 gap-8 border-t border-gray-100 pt-6 w-full text-center">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Height</p>
                  <p className="mt-1 text-lg font-bold text-gray-800">{pokemon.height / 10} m</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Weight</p>
                  <p className="mt-1 text-lg font-bold text-gray-800">{pokemon.weight / 10} kg</p>
                </div>
              </div>

              {/* Abilities */}
              <div className="mt-6 border-t border-gray-100 pt-6 w-full">
                <p className="text-center text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Abilities</p>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {pokemon.abilities.map((ability) => (
                    <span
                      key={ability}
                      className="rounded bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600 border border-gray-200"
                    >
                      {capitalize(ability.replace('-', ' '))}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Panel: Stats */}
            <div className="flex flex-col justify-center p-8 bg-gray-50/50">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-5">Base Stats</h3>
              <div className="space-y-4">
                {pokemon.stats.map((stat) => {
                  // Normalize value out of 150 for progress bars
                  const percentage = Math.min((stat.value / 150) * 100, 100);
                  const barColor = statColorMap[stat.name] || 'bg-gray-400';
                  return (
                    <div key={stat.name} className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-gray-500 uppercase tracking-wide">
                          {stat.name.replace('-', ' ')}
                        </span>
                        <span className="text-gray-800 font-bold font-mono">{stat.value}</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default PokemonDetailModal;
