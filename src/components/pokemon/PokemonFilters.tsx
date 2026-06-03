'use client';

import Image from 'next/image';

interface PokemonFiltersProps {
  pokemonTypes: string[];
  selectedType: string;
  isTypeMenuOpen: boolean;
  sortDirection: 'asc' | 'desc';
  searchTerm: string;
  onSearchChange: (v: string) => void;
  onToggleSort: () => void;
  onSelectType: (name: string) => void;
  onResetType: () => void;
  onToggleTypeMenu: () => void;
  onCloseTypeMenu: () => void;
}

export default function PokemonFilters({
  pokemonTypes,
  selectedType,
  isTypeMenuOpen,
  sortDirection,
  searchTerm,
  onSearchChange,
  onToggleSort,
  onSelectType,
  onResetType,
  onToggleTypeMenu,
  onCloseTypeMenu,
}: PokemonFiltersProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 py-6 md:py-10 border-b border-slate-100">
      {/* Search */}
      <div className="flex-1">
        <label htmlFor="pokemon-search" className="sr-only">Search Pokemon</label>
        <div className="bg-white rounded-full overflow-hidden flex items-center shadow-sm border border-slate-200">
          <input
            id="pokemon-search"
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search Pokémon..."
            className="bg-transparent outline-none py-3 pl-5 pr-3 w-full text-sm text-[#4D5053] placeholder:text-[#A0AFBA]"
          />
          <div className="p-2.5 mx-1.5 bg-[#E1E9EF] rounded-full flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none" className="text-primary">
              <path d="M11.1931 2.72879C13.525 5.03385 13.525 8.7711 11.1931 11.0762C8.86132 13.3812 5.08069 13.3812 2.74887 11.0762C0.417045 8.7711 0.417045 5.03385 2.74887 2.72879C5.08069 0.423735 8.86132 0.423735 11.1931 2.72879" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11.1499 11.1096L16.9999 16.9716" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Sort + Type — row on all screens */}
      <div className="flex items-center gap-3 flex-wrap">

      {/* Sort */}
      <button
        onClick={onToggleSort}
        className="filter-btn flex items-center gap-2 cursor-pointer"
        aria-label={`Sort ${sortDirection === 'asc' ? 'descending' : 'ascending'}`}
      >
        <svg width="10" height="16" viewBox="0 0 10 16" fill="none" className="text-primary">
          <path d="M4.92308 0L9.84615 6.76923H0L4.92308 0Z" fill="currentColor" opacity={sortDirection === 'asc' ? '1' : '0.3'}/>
          <path d="M4.92311 16L3.69646e-05 9.23077L9.84619 9.23077L4.92311 16Z" fill="currentColor" opacity={sortDirection === 'desc' ? '1' : '0.3'}/>
        </svg>
        <span className="text-sm font-medium text-[#4D5053]">
          {sortDirection === 'asc' ? 'A → Z' : 'Z → A'}
        </span>
      </button>

      {/* Type filter */}
      <div className="relative">
        <button
          onClick={onToggleTypeMenu}
          className="filter-btn flex items-center gap-2 cursor-pointer"
          aria-expanded={isTypeMenuOpen}
          aria-haspopup="listbox"
        >
          <Image src="/icon-pokemon.svg" alt="" width={16} height={16} aria-hidden />
          <span className="text-sm font-medium text-primary capitalize">{selectedType || 'All Type'}</span>
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className={`transition-transform duration-200 text-primary ${isTypeMenuOpen ? 'rotate-180' : ''}`}>
            <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        {isTypeMenuOpen && (
          <div
            className="type-dropdown absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-y-auto"
            role="listbox"
            aria-label="Pokemon type filter"
          >
            {/* All Type option */}
            <button
              role="option"
              aria-selected={!selectedType}
              onClick={onResetType}
              className={`type-option w-full text-left cursor-pointer ${!selectedType ? 'active' : ''}`}
            >
              All Type
            </button>
            {pokemonTypes.map((type) => (
              <button
                key={type}
                role="option"
                aria-selected={selectedType === type}
                onClick={() => onSelectType(type)}
                className={`type-option w-full text-left capitalize cursor-pointer ${selectedType === type ? 'active' : ''}`}
              >
                {type}
              </button>
            ))}
          </div>
        )}

        {/* Backdrop to close menu */}
        {isTypeMenuOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={onCloseTypeMenu}
            aria-hidden
          />
        )}
      </div>

      </div> {/* end sort+type row */}
    </div>
  );
}
