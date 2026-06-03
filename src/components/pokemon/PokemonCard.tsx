'use client';

import React from 'react';
import PokemonImage from './PokemonImage';
import { PokemonListItem } from '@/schemas/pokemon.schema';
import { capitalize, formatPokedexNumber } from '@/utils/index';
import { logClientActivity } from '@/utils/clientLogger';

interface PokemonCardProps {
  pokemon: PokemonListItem;
  onClick: (name: string) => void;
}

export default function PokemonCard({ pokemon, onClick }: PokemonCardProps) {
  const { id, name, imageUrl } = pokemon;

  const handleClick = () => {
    logClientActivity('Click Pokemon Card', `Name: ${name}, ID: ${id}`);
    onClick(name);
  };

  return (
    <article
      className="pokemon-card group"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${name}`}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      <PokemonImage imageUrl={imageUrl} pokemonName={name} size="md" />
      <div className="mt-3">
        <p className="text-xs text-[#A0AFBA] font-medium">{formatPokedexNumber(id)}</p>
        <h2 className="text-base font-bold text-[#2F3133] capitalize mt-0.5 leading-tight">
          {name}
        </h2>
      </div>
    </article>
  );
}
