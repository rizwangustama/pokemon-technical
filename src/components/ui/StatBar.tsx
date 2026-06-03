'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { formatStatName } from '@/utils/index';

interface StatBarProps {
  name: string;
  value: number;
  /** Stagger delay in seconds (passed from parent) */
  delay?: number;
}

const MAX_STAT = 255;

const getStatColor = (value: number): string => {
  if (value < 50) return '#e33e24';
  if (value < 80) return '#f5a623';
  if (value < 120) return '#4caf7d';
  return '#3E75C3';
};

export default function StatBar({ name, value, delay = 0 }: StatBarProps) {
  const percentage = Math.min((value / MAX_STAT) * 100, 100);
  const color = getStatColor(value);

  const fillRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fill = fillRef.current;
    const valueEl = valueRef.current;
    if (!fill || !valueEl) return;

    const ctx = gsap.context(() => {
      // Bar fill — grow from 0% to actual percentage
      gsap.fromTo(
        fill,
        { width: '0%' },
        {
          width: `${percentage}%`,
          duration: 0.9,
          ease: 'power3.out',
          delay,
        }
      );

      // Number count-up
      const counter = { val: 0 };
      gsap.to(counter, {
        val: value,
        duration: 0.8,
        ease: 'power2.out',
        delay,
        onUpdate: () => {
          valueEl.textContent = String(Math.round(counter.val));
        },
      });
    });

    return () => ctx.revert();
  }, [value, percentage, delay]);

  return (
    <div className="stat-row">
      <span className="stat-label">{formatStatName(name)}</span>
      <span ref={valueRef} className="stat-value">0</span>
      <div
        className="stat-bar"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={MAX_STAT}
      >
        <div
          ref={fillRef}
          className="stat-fill"
          style={{ width: '0%', backgroundColor: color }}
        />
      </div>
    </div>
  );
}
