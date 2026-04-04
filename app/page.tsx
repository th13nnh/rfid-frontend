'use client';
// ── app/page.tsx ──────────────────────────────────────────────

import { useState, useCallback, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import LandingView from '@/components/LandingView';
import GuestView from '@/components/GuestView';
import { fetchGuestByRfid, logTap, Guest } from '@/lib/api';
import { useRfidScanner } from '@/hooks/useRfidScanner';

const COUNTDOWN_TOTAL = 5;

type AppState = 'landing' | 'guest';

interface ToastMsg { id: number; text: string; type: 'error' | 'info' }

export default function Home() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [guest, setGuest] = useState<Guest | null>(null);
  const [tapCount, setTapCount] = useState(1);
  const [countdown, setCountdown] = useState(COUNTDOWN_TOTAL);
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const [flash, setFlash] = useState(false);

  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const toastId = useRef(0);

  // ── helpers ──────────────────────────────────────────────────
  const addToast = (text: string, type: ToastMsg['type'] = 'error') => {
    const id = ++toastId.current;
    setToasts(p => [...p, { id, text, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  };

  const doFlash = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 250);
  };

  const startCountdown = useCallback(() => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setCountdown(COUNTDOWN_TOTAL);
    countdownRef.current = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(countdownRef.current!);
          setAppState('landing');
          return COUNTDOWN_TOTAL;
        }
        return c - 1;
      });
    }, 1000);
  }, []);

  const resetCountdown = useCallback(() => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setCountdown(COUNTDOWN_TOTAL);
    setAppState('landing');
  }, []);

  // ── RFID scan handler ─────────────────────────────────────────
  const handleScan = useCallback(async (cardId: string) => {
    doFlash();
    try {
      const [guestData, tapData] = await Promise.all([
        fetchGuestByRfid(cardId),
        logTap(cardId),
      ]);
      setGuest(guestData);
      setTapCount(tapData.tap_count ?? 1);
      setAppState('guest');
      startCountdown();
    } catch {
      addToast(`❌ Thẻ "${cardId}" không hợp lệ hoặc chưa đăng ký.`);
      if (appState === 'guest') startCountdown();
    }
  }, [appState, startCountdown]);

  useRfidScanner({ onScan: handleScan });

  // Dev shortcut: press D to simulate a scan
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === 'd' || e.key === 'D') && !e.ctrlKey && !e.metaKey) {
        handleScan('3209942002');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleScan]);

  useEffect(() => () => { if (countdownRef.current) clearInterval(countdownRef.current); }, []);

  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #c9f0ff 0%, #e8f9ff 35%, #ffffff 55%, #e0f6ff 80%, #8dd9f5 100%)' }}
    >

      {/* Tech SVG background */}
      <TechBackground />

      {/* Top accent bar */}
      <div
        className="fixed top-0 left-0 right-0 z-20 h-[3px]"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #29c5f6 25%, #1a6fff 50%, #29c5f6 75%, transparent 100%)',
        }}
      />

      {/* Scan flash */}
      <AnimatePresence>
        {flash && (
          <motion.div
            className="fixed inset-0 z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{ background: 'rgba(41,197,246,0.15)' }}
          />
        )}
      </AnimatePresence>

      {/* Main views */}
      <AnimatePresence mode="wait">
        {appState === 'landing' && <LandingView key="landing" />}
        {appState === 'guest' && guest && (
          <GuestView
            key="guest"
            guest={guest}
            tapCount={tapCount}
            countdown={countdown}
            totalCountdown={COUNTDOWN_TOTAL}
          />
        )}
      </AnimatePresence>

      {/* Toast stack */}
      <div className="fixed bottom-16 left-1/2 z-50 flex flex-col gap-2 -translate-x-1/2 items-center">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="px-6 py-3.5 rounded-xl text-sm font-semibold tracking-wide whitespace-nowrap"
              style={{
                background: t.type === 'error' ? 'rgba(180,30,30,0.88)' : 'rgba(26,111,255,0.88)',
                border: `1px solid ${t.type === 'error' ? 'rgba(255,100,80,0.4)' : 'rgba(41,197,246,0.4)'}`,
                backdropFilter: 'blur(12px)',
                color: '#fff',
              }}
            >
              {t.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Light-blue tech background ────────────────────────────────
function TechBackground() {
  // Generate dot positions for top-left grid
  const dotsTopLeft = [];
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 9 - row; col++) {
      dotsTopLeft.push({ cx: 28 + col * 26, cy: 28 + row * 26, key: `tl-${row}-${col}` });
    }
  }

  // Generate dot positions for top-right grid
  const dotsTopRight = [];
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 9 - row; col++) {
      dotsTopRight.push({ cx: 1252 - col * 26, cy: 28 + row * 26, key: `tr-${row}-${col}` });
    }
  }

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1280 720"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="cornerGlowTL" cx="0%" cy="0%" r="60%">
            <stop offset="0%" stopColor="#7dd4f0" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#7dd4f0" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cornerGlowTR" cx="100%" cy="0%" r="60%">
            <stop offset="0%" stopColor="#7dd4f0" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#7dd4f0" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Corner ambient glows */}
        <rect width="1280" height="720" fill="url(#cornerGlowTL)" />
        <rect width="1280" height="720" fill="url(#cornerGlowTR)" />

        {/* ── TOP-LEFT rounded rect outlines ── */}
        <rect x="6" y="100" width="200" height="148" rx="28" fill="none" stroke="#5ec8f0" strokeWidth="1.5" opacity="0.45" />
        <rect x="28" y="122" width="148" height="102" rx="18" fill="none" stroke="#5ec8f0" strokeWidth="1" opacity="0.35" />
        <rect x="50" y="144" width="96" height="58" rx="10" fill="none" stroke="#5ec8f0" strokeWidth="0.8" opacity="0.25" />

        {/* ── TOP-RIGHT rounded rect outlines ── */}
        <rect x="1074" y="100" width="200" height="148" rx="28" fill="none" stroke="#5ec8f0" strokeWidth="1.5" opacity="0.45" />
        <rect x="1104" y="122" width="148" height="102" rx="18" fill="none" stroke="#5ec8f0" strokeWidth="1" opacity="0.35" />
        <rect x="1134" y="144" width="96" height="58" rx="10" fill="none" stroke="#5ec8f0" strokeWidth="0.8" opacity="0.25" />

        {/* ── Dot grids ── */}
        {dotsTopLeft.map(d => (
          <circle key={d.key} cx={d.cx} cy={d.cy} r="2.2" fill="#3ab5e0" opacity="0.38" />
        ))}
        {dotsTopRight.map(d => (
          <circle key={d.key} cx={d.cx} cy={d.cy} r="2.2" fill="#3ab5e0" opacity="0.38" />
        ))}

        {/* ── BOTTOM-LEFT tech corner ── */}
        {/* Base orange wedge */}
        <polygon points="0,560 210,720 0,720" fill="#ff6a1a" opacity="0.93" />
        {/* Lighter orange behind */}
        <polygon points="0,500 145,720 210,720 32,590" fill="#ff8c42" opacity="0.88" />
        {/* Blue diagonal bar */}
        <polygon points="0,600 105,720 55,720 0,638" fill="#1a6fff" opacity="0.93" />
        {/* Cyan edge highlight on orange */}
        <polygon points="0,560 210,720 204,720 0,554" fill="#29c5f6" opacity="0.78" />
        {/* Cyan edge highlight on blue */}
        <polygon points="0,600 105,720 100,720 0,595" fill="#29c5f6" opacity="0.6" />
        {/* White dot */}
        <circle cx="20" cy="668" r="7" fill="white" opacity="0.96" />
        {/* Cyan accent squares */}
        <rect x="48" y="650" width="22" height="22" rx="4" fill="#29c5f6" opacity="0.97" />
        <rect x="95" y="682" width="15" height="15" rx="3" fill="#29c5f6" opacity="0.82" />
        {/* Outlined square */}
        <rect x="72" y="668" width="14" height="14" rx="2" fill="none" stroke="#1a6fff" strokeWidth="2.5" />
        {/* Small blue tag */}
        <rect x="20" y="635" width="8" height="20" rx="2" fill="#1a6fff" opacity="0.85" />
        {/* Three dots row */}
        <circle cx="50" cy="632" r="3.5" fill="white" opacity="0.9" />
        <circle cx="62" cy="632" r="3.5" fill="white" opacity="0.7" />
        <circle cx="74" cy="632" r="3.5" fill="white" opacity="0.5" />

        {/* ── BOTTOM-RIGHT tech corner (mirrored) ── */}
        <polygon points="1280,560 1070,720 1280,720" fill="#ff6a1a" opacity="0.93" />
        <polygon points="1280,500 1135,720 1070,720 1248,590" fill="#ff8c42" opacity="0.88" />
        <polygon points="1280,600 1175,720 1225,720 1280,638" fill="#1a6fff" opacity="0.93" />
        <polygon points="1280,560 1070,720 1076,720 1280,554" fill="#29c5f6" opacity="0.78" />
        <polygon points="1280,600 1175,720 1180,720 1280,595" fill="#29c5f6" opacity="0.6" />
        <circle cx="1260" cy="668" r="7" fill="white" opacity="0.96" />
        <rect x="1210" y="650" width="22" height="22" rx="4" fill="#29c5f6" opacity="0.97" />
        <rect x="1170" y="682" width="15" height="15" rx="3" fill="#29c5f6" opacity="0.82" />
        <rect x="1194" y="668" width="14" height="14" rx="2" fill="none" stroke="#1a6fff" strokeWidth="2.5" />
        <rect x="1252" y="635" width="8" height="20" rx="2" fill="#1a6fff" opacity="0.85" />
        <circle cx="1230" cy="632" r="3.5" fill="white" opacity="0.9" />
        <circle cx="1218" cy="632" r="3.5" fill="white" opacity="0.7" />
        <circle cx="1206" cy="632" r="3.5" fill="white" opacity="0.5" />
      </svg>
    </div>
  );
}