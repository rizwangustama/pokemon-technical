'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const pokeballRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial states — hide all elements
      gsap.set(
        [badgeRef.current, headingRef.current, subRef.current, ctaRef.current],
        { autoAlpha: 0, y: 30 }
      );
      gsap.set(pokeballRef.current, { autoAlpha: 0, y: 60, scale: 0.9 });
      gsap.set(overlayRef.current, { autoAlpha: 0 });

      // Main entrance timeline
      const tl = gsap.timeline({ delay: 0.1 });

      tl.to(overlayRef.current, { autoAlpha: 1, duration: 0.6, ease: 'power2.out' })
        .to(
          badgeRef.current,
          { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' },
          '-=0.3'
        )
        .to(
          headingRef.current,
          { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' },
          '-=0.4'
        )
        .to(
          subRef.current,
          { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' },
          '-=0.45'
        )
        .to(
          ctaRef.current,
          { autoAlpha: 1, y: 0, duration: 0.7, ease: 'back.out(1.7)' },
          '-=0.45'
        )
        .to(
          pokeballRef.current,
          { autoAlpha: 1, y: 0, scale: 1, duration: 1, ease: 'power4.out' },
          '-=0.6'
        );

      // Continuous floating animation for the pokéball
      gsap.to(pokeballRef.current, {
        y: '-=18',
        duration: 3.5,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: 1.2,
      });

      // Subtle rotation for the pokéball
      gsap.to(pokeballRef.current, {
        rotation: 8,
        duration: 7,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: 1.2,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="h-screen min-h-[500px] relative overflow-hidden bg-primary"
      data-cursor-theme="dark"
      aria-label="Hero Section"
    >
      {/* Background image */}
      <Image
        src="/bg.png"
        alt="Pokemon Background"
        fill
        className="object-cover z-0"
        priority
      />

      {/* Overlay gradient */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 z-[1]"
      />

      {/* Pokeball decoration */}
      <div
        ref={pokeballRef}
        className="absolute -bottom-[12vh] md:-bottom-[18vh] left-1/2 -translate-x-1/2 w-[45vh] md:w-[65vh] z-[2]"
        aria-hidden="true"
      >
        <Image
          src="/bola.png"
          alt=""
          width={542}
          height={542}
          className="w-full h-auto opacity-90"
        />
      </div>

      {/* Hero content */}
      <div className="container relative z-10 flex flex-col items-center justify-center h-full gap-3 md:gap-5 pb-16 md:pb-20">
        {/* Badge */}
        <div ref={badgeRef} className="hero-badge">
          <span>✦ Pokédex</span>
        </div>

        {/* Heading */}
        <h1
          ref={headingRef}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center font-extrabold text-white drop-shadow-lg leading-tight max-w-2xl"
        >
          Get them all
          <br />
          <span className="text-yellow-300">for yourself!</span>
        </h1>

        {/* Subtitle */}
        <p
          ref={subRef}
          className="text-white/90 text-center text-sm sm:text-base md:text-lg max-w-xs sm:max-w-sm md:max-w-md leading-relaxed px-4 sm:px-0"
        >
          The perfect guide for anyone who wants to hunt Pokémon around the world.
        </p>

        {/* CTA Button */}
        <a
          ref={ctaRef}
          href="#pokemon-list"
          className="hero-cta mt-2"
          aria-label="Explore Pokemon"
        >
          Explore Now
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M12 5v14M5 12l7 7 7-7"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </section>
  );
}
