'use client';

import React from 'react';
import { PokemonListItem } from '@/schemas/pokemon.schema';
import { capitalize, formatPokedexNumber } from '@/utils/index';
import { logClientActivity } from '@/utils/clientLogger';

interface PokemonCardProps {
  pokemon: PokemonListItem;
  onClick: () => void;
}

export function PokemonCard({ pokemon, onClick }: PokemonCardProps) {
  const { id, name, imageUrl } = pokemon;

  const handleClick = () => {
    logClientActivity('Click Pokemon Card', `Name: ${name}, ID: ${id}`);
    onClick();
  };

  return (
    <div
      onClick={handleClick}
      className="group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-gray-150 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-400 hover:shadow-[0_12px_24px_rgba(59,130,246,0.08)] cursor-pointer"
    >
      {/* Background radial glow on hover */}
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-blue-500/0 to-blue-500/0 opacity-0 transition-all duration-300 group-hover:from-blue-500/[0.02] group-hover:to-blue-500/[0.06] group-hover:opacity-100" />
      
      {/* Pokedex ID Tag */}
      <span className="absolute top-3.5 right-4 font-mono text-xs font-bold text-gray-400 group-hover:text-blue-500 transition-colors">
        {formatPokedexNumber(id)}
      </span>

      {/* Image Container */}
      <div className="relative my-3 flex h-32 w-32 items-center justify-center rounded-full bg-gray-50/50 p-2 transition-transform duration-300 group-hover:scale-110">
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-contain drop-shadow-[0_6px_10px_rgba(0,0,0,0.04)] group-hover:drop-shadow-[0_12px_20px_rgba(59,130,246,0.18)] transition-all duration-300"
          loading="lazy"
        />
      </div>

      {/* Title */}
      <h3 className="z-10 mt-2 text-base font-bold text-gray-800 transition-colors group-hover:text-blue-600">
        {capitalize(name)}
      </h3>
    </div>
  );
}
export default PokemonCard;
