'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

// Theme tokens for each cursor context
const THEMES = {
  dark: {
    ringBorder: 'rgba(255, 255, 255, 0.9)',
    ringBg: 'rgba(255, 255, 255, 0.08)',
    dotColor: '#ffffff',
    hoverBorder: 'rgba(255, 255, 255, 1)',
    hoverBg: 'rgba(255, 255, 255, 0.15)',
  },
  light: {
    ringBorder: 'rgba(0, 0, 0, 0.75)',
    ringBg: 'rgba(0, 0, 0, 0.05)',
    dotColor: '#1a1a1a',
    hoverBorder: '#3E75C3',
    hoverBg: 'color-mix(in srgb, #3E75C3 12%, transparent)',
  },
} as const;

type CursorTheme = keyof typeof THEMES;

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const currentThemeRef = useRef<CursorTheme>('light');
  const isHoveringRef = useRef(false);

  useEffect(() => {
    // Detect touch device — skip custom cursor on mobile
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dot = dotRef.current!;
    const ring = ringRef.current!;

    // Use GSAP quickTo for performant positional lerp
    const moveDot = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power3.out' });
    const moveDotY = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power3.out' });
    const moveRing = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' });
    const moveRingY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' });

    /** Walk up DOM from element to find nearest [data-cursor-theme] */
    const getTheme = (el: Element | null): CursorTheme => {
      let node = el;
      while (node && node !== document.body) {
        const theme = node.getAttribute('data-cursor-theme');
        if (theme === 'dark' || theme === 'light') return theme;
        node = node.parentElement;
      }
      return 'light';
    };

    /** Apply a theme to cursor (only if not currently hovering interactive element) */
    const applyTheme = (theme: CursorTheme) => {
      if (currentThemeRef.current === theme) return;
      currentThemeRef.current = theme;

      if (isHoveringRef.current) return; // let hover state take precedence

      const t = THEMES[theme];
      gsap.to(ring, {
        borderColor: t.ringBorder,
        backgroundColor: t.ringBg,
        duration: 0.4,
        ease: 'power2.out',
      });
      gsap.to(dot, {
        backgroundColor: t.dotColor,
        duration: 0.4,
        ease: 'power2.out',
      });
    };

    // Track mouse position & detect section theme
    const onMouseMove = (e: MouseEvent) => {
      moveDot(e.clientX);
      moveDotY(e.clientY);
      moveRing(e.clientX);
      moveRingY(e.clientY);

      // Peek at the element under cursor (skip our own cursor elements)
      const el = document.elementFromPoint(e.clientX, e.clientY);
      applyTheme(getTheme(el));
    };

    // Hover effect — interactive elements
    const interactiveSelector =
      'a, button, [role="button"], input, textarea, select, label, [data-cursor="pointer"]';

    const onMouseEnter = (e: Event) => {
      isHoveringRef.current = true;
      const theme = THEMES[currentThemeRef.current];
      gsap.to(ring, {
        scale: 2.2,
        opacity: 0.85,
        duration: 0.3,
        ease: 'power2.out',
        borderColor: theme.hoverBorder,
        backgroundColor: theme.hoverBg,
      });
      gsap.to(dot, { scale: 0.4, duration: 0.3, ease: 'power2.out' });
    };

    const onMouseLeave = () => {
      isHoveringRef.current = false;
      const theme = THEMES[currentThemeRef.current];
      gsap.to(ring, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
        borderColor: theme.ringBorder,
        backgroundColor: theme.ringBg,
      });
      gsap.to(dot, { scale: 1, duration: 0.3, ease: 'power2.out' });
    };

    // Click pulse effect
    const onMouseDown = () => {
      gsap.to(ring, { scale: 0.85, duration: 0.1, ease: 'power2.in' });
      gsap.to(dot, { scale: 1.5, duration: 0.1, ease: 'power2.in' });
    };

    const onMouseUp = () => {
      gsap.to(ring, { scale: 1, duration: 0.25, ease: 'back.out(2)' });
      gsap.to(dot, { scale: 1, duration: 0.25, ease: 'back.out(2)' });
    };

    // Register global listeners
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    const attachInteractive = () => {
      const els = document.querySelectorAll(interactiveSelector);
      els.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnter);
        el.removeEventListener('mouseleave', onMouseLeave);
        el.addEventListener('mouseenter', onMouseEnter);
        el.addEventListener('mouseleave', onMouseLeave);
      });
    };

    attachInteractive();

    // MutationObserver to handle dynamically added elements (modals, dropdowns, etc.)
    const observer = new MutationObserver(attachInteractive);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Dot — precise tracker */}
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      {/* Ring — lagging follower */}
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
