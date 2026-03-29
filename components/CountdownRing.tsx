'use client';
// ── components/CountdownRing.tsx ──────────────────────────────

import { motion } from 'framer-motion';

const R     = 28;
const CIRC  = 2 * Math.PI * R; // ≈ 175.9

interface CountdownRingProps {
  seconds: number;
  total: number;
}

export default function CountdownRing({ seconds, total }: CountdownRingProps) {
  const progress  = seconds / total;          // 1 → 0
  const offset    = CIRC * (1 - progress);    // 0 → CIRC

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="70" height="70" viewBox="0 0 70 70" style={{ transform: 'rotate(-90deg)' }}>
        {/* track */}
        <circle
          cx="35" cy="35" r={R}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="4"
        />
        {/* progress arc */}
        <motion.circle
          cx="35" cy="35" r={R}
          fill="none"
          stroke="url(#arcGrad)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={offset}
          transition={{ duration: 0.95, ease: 'linear' }}
        />
        <defs>
          <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#00d2ff" />
            <stop offset="100%" stopColor="#f5c842" />
          </linearGradient>
        </defs>
      </svg>
      <span
        className="font-display text-2xl leading-none tabular-nums"
        style={{ color: seconds <= 2 ? '#f87171' : '#00d2ff', fontFamily: 'var(--font-display)' }}
      >
        {seconds}
      </span>
    </div>
  );
}
