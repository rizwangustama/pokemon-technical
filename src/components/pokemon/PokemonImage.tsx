'use client';

import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface PokemonImageProps {
  imageUrl: string;
  pokemonName: string;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_MAP = {
  sm:  'h-[120px]',
  md:  'h-[160px] md:h-[200px] lg:h-[215px]',
  lg:  'h-[200px] md:h-[280px]',
};

export default function PokemonImage({ imageUrl, pokemonName, size = 'md' }: PokemonImageProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  useEffect(() => {
    setStatus('loading');
    const img = new window.Image();
    img.src = imageUrl;
    img.onload  = () => setStatus('loaded');
    img.onerror = () => setStatus('error');
    return () => { img.onload = img.onerror = null; };
  }, [imageUrl]);

  return (
    <div className={`${SIZE_MAP[size]} relative flex items-center justify-center`}>
      {status === 'loading' && <LoadingSpinner size={40} />}
      {status === 'error' && (
        <div className="flex flex-col items-center gap-1 text-gray-300">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/><path d="M12 7v5M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          <span className="text-xs">No image</span>
        </div>
      )}
      {status === 'loaded' && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={pokemonName}
          className="h-full w-full object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-110"
        />
      )}
    </div>
  );
}
