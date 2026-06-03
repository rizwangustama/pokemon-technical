'use client';

import StatBar from '@/components/ui/StatBar';
import TypeBadge from '@/components/ui/TypeBadge';
import type { PokemonDetail } from '@/schemas/pokemon.schema';
import { formatSpasi } from '@/utils/index';

interface PokemonStatsProps {
  pokemon: PokemonDetail;
}

export default function PokemonStats({ pokemon }: PokemonStatsProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Physical attributes */}
      <div className="flex gap-6 flex-wrap">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-[#A0AFBA] font-medium">Height</span>
          <span className="text-[#2F3133] text-sm font-bold">{(pokemon.height / 10).toFixed(1)} m</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-[#A0AFBA] font-medium">Weight</span>
          <span className="text-[#2F3133] text-sm font-bold">{(pokemon.weight / 10).toFixed(1)} kg</span>
        </div>
        {pokemon.abilities.length > 0 && (
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-[#A0AFBA] font-medium">Ability</span>
            <span className="text-[#2F3133] text-sm font-bold capitalize">{formatSpasi(pokemon.abilities[0])}</span>
          </div>
        )}
      </div>

      {/* Types */}
      <div>
        <h3 className="text-xs text-[#A0AFBA] font-medium mb-2 uppercase tracking-wider">Types</h3>
        <div className="flex gap-2 flex-wrap">
          {pokemon.types.map((typeName) => (
            <TypeBadge key={typeName} typeName={typeName} size="md" />
          ))}
        </div>
      </div>

      {/* Abilities badges */}
      <div>
        <h3 className="text-xs text-[#A0AFBA] font-medium mb-2 uppercase tracking-wider">Abilities</h3>
        <div className="flex gap-2 flex-wrap">
          {pokemon.abilities.map((abilityName, i) => (
            <span key={abilityName} className={`ts toast-${i % 5}`}>
              {formatSpasi(abilityName)}
            </span>
          ))}
        </div>
      </div>

      {/* Base stats */}
      <div>
        <h3 className="text-xs text-[#A0AFBA] font-medium mb-3 uppercase tracking-wider">Base Stats</h3>
        <div className="flex flex-col gap-2">
          {pokemon.stats.map((stat, i) => (
            <StatBar key={stat.name} name={stat.name} value={stat.value} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </div>
  );
}
