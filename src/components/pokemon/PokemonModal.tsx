'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { usePokemonDetail } from '@/hooks/usePokemon';
import { formatPokedexNumber } from '@/utils/index';
import PokemonImage from './PokemonImage';
import PokemonStats from './PokemonStats';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { logClientActivity } from '@/utils/clientLogger';

interface PokemonModalProps {
  pokemonName: string | null;
  onClose: () => void;
}

export default function PokemonModal({ pokemonName, onClose }: PokemonModalProps) {
  const isOpen = Boolean(pokemonName);
  const { data: detailResponse, isLoading, error } = usePokemonDetail(pokemonName ?? '');

  // Refs for GSAP targets
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Activity logging
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

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Prevent body scroll
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }
    return () => {
      if (typeof window !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, [isOpen]);

  // GSAP entrance animation (fires when content is ready)
  const pokemon = detailResponse?.data;
  const isError = Boolean(error);
  const contentReady = !isLoading && !isError && Boolean(pokemon);

  useEffect(() => {
    if (!isOpen) return;

    const ctx = gsap.context(() => {
      // --- Backdrop fade-in ---
      gsap.fromTo(
        backdropRef.current,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.3, ease: 'power2.out' }
      );

      // --- Panel slide up + scale ---
      gsap.fromTo(
        panelRef.current,
        { autoAlpha: 0, y: 48, scale: 0.96 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: 'power3.out', delay: 0.05 }
      );

      // --- Close button pop-in ---
      gsap.fromTo(
        closeRef.current,
        { autoAlpha: 0, scale: 0.6, rotate: -45 },
        { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.4, ease: 'back.out(2)', delay: 0.2 }
      );
    });

    return () => ctx.revert();
  }, [isOpen]);

  // Animate content panels once data is ready
  useEffect(() => {
    if (!contentReady) return;

    const ctx = gsap.context(() => {
      // Left image panel — slide in from left
      gsap.fromTo(
        imageRef.current,
        { autoAlpha: 0, x: -24 },
        { autoAlpha: 1, x: 0, duration: 0.5, ease: 'power3.out', delay: 0.1 }
      );

      // Right content — stagger children
      const children = contentRef.current
        ? Array.from(contentRef.current.children)
        : [];

      gsap.fromTo(
        children,
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.45,
          ease: 'power3.out',
          stagger: 0.08,
          delay: 0.15,
        }
      );
    });

    return () => ctx.revert();
  }, [contentReady]);

  if (!isOpen) return null;

  return (
    <div
      ref={backdropRef}
      id="dialog"
      role="dialog"
      aria-modal="true"
      aria-label={pokemon ? `${pokemon.name} details` : 'Pokemon details'}
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
    >
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden />

      {/* Modal panel */}
      <div
        ref={panelRef}
        className="modal-panel relative w-full md:w-auto md:min-w-[740px] md:max-w-[820px] h-[88vh] md:h-auto md:max-h-[90vh] rounded-t-2xl md:rounded-2xl overflow-hidden bg-white shadow-2xl"
      >
        {/* Close button */}
        <button
          ref={closeRef}
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-all duration-200 cursor-pointer"
          aria-label="Close modal"
        >
          <svg width="16" height="16" viewBox="0 0 19 19" fill="none">
            <path d="M14.25 4.75L4.75 14.25" stroke="#4D5053" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4.75 4.75L14.25 14.25" stroke="#4D5053" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size={56} />
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="flex flex-col items-center justify-center h-64 gap-3 text-red-400">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12 7v5M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <p className="text-sm font-medium">Failed to load Pokémon data</p>
          </div>
        )}

        {/* Content */}
        {contentReady && pokemon && (
          <div className="flex h-full">
            {/* Left panel — image */}
            <div
              ref={imageRef}
              className="hidden md:flex w-[220px] flex-shrink-0 relative bg-gradient-to-b from-[#EFF3F6] to-[#dce6ed]"
            >
              <Image
                src="/bg-popup.png"
                alt=""
                fill
                className="object-cover opacity-60 animate-[pulse_3s_infinite]"
                aria-hidden
              />
              <div className="relative z-10 flex items-center justify-center w-full h-full p-4">
                <PokemonImage
                  imageUrl={pokemon.imageUrl}
                  pokemonName={pokemon.name}
                  size="lg"
                />
              </div>
            </div>

            {/* Right panel — details */}
            <div ref={contentRef} className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-6">
              {/* Header */}
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-3">
                  <h2 className="text-3xl font-extrabold capitalize text-[#2F3133] leading-none">
                    {pokemon.name}
                  </h2>
                  <span className="text-base text-[#A0AFBA] font-semibold">
                    {formatPokedexNumber(pokemon.id)}
                  </span>
                </div>
              </div>

              {/* Mobile image */}
              <div className="flex md:hidden justify-center">
                <PokemonImage imageUrl={pokemon.imageUrl} pokemonName={pokemon.name} size="sm" />
              </div>

              {/* Stats panel */}
              <PokemonStats pokemon={pokemon} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
