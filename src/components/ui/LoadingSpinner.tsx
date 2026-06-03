'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const MESSAGES = [
  'Catching Pokémon...',
  'Searching tall grass...',
  'Consulting Professor Oak...',
  'Loading Pokédex data...',
  'Almost there!',
];

interface LoadingSpinnerProps {
  size?: number;
  /** Override with a static message. If omitted, cycles through fun Pokémon phrases. */
  message?: string;
  showMessage?: boolean;
}

export default function LoadingSpinner({
  size = 48,
  message,
  showMessage = true,
}: LoadingSpinnerProps) {
  const [msgIndex, setMsgIndex] = useState(0);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!showMessage || message) return; // static message — no cycling needed

    const cycle = () => {
      const el = textRef.current;
      if (!el) return;

      // Fade out → update text → fade in
      gsap.to(el, {
        autoAlpha: 0,
        y: -6,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
          gsap.fromTo(
            el,
            { autoAlpha: 0, y: 6 },
            { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out' }
          );
        },
      });
    };

    const interval = setInterval(cycle, 2200);
    return () => clearInterval(interval);
  }, [showMessage, message]);

  const displayMessage = message ?? MESSAGES[msgIndex];

  return (
    <div
      className="flex flex-col items-center justify-center gap-4"
      role="status"
      aria-label={displayMessage}
    >
      <span className="loader" style={{ width: size, height: size }} />

      {showMessage && (
        <span
          ref={textRef}
          className="text-sm font-medium text-text-muted tracking-wide select-none"
          aria-live="polite"
        >
          {displayMessage}
        </span>
      )}
    </div>
  );
}
