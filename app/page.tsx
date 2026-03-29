'use client';
// ── app/page.tsx ──────────────────────────────────────────────

import { useState, useCallback, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import LandingView from '@/components/LandingView';
import GuestView from '@/components/GuestView';
import { fetchGuestByRfid, logTap, Guest } from '@/lib/api';
import { useRfidScanner } from '@/hooks/useRfidScanner';

// Canvas has window refs — load client-only
const ParticleCanvas = dynamic(() => import('@/components/ParticleCanvas'), { ssr: false });

const COUNTDOWN_TOTAL = 5; // seconds before returning to landing

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
      if (appState === 'guest') startCountdown(); // reset timer if on guest page
    }
  }, [appState, startCountdown]);

  useRfidScanner({ onScan: handleScan });

  // Dev shortcut: press D to simulate a scan
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === 'd' || e.key === 'D') && !e.ctrlKey && !e.metaKey) {
        handleScan('CARD-001');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleScan]);

  useEffect(() => () => { if (countdownRef.current) clearInterval(countdownRef.current); }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: '#010512' }}>

      {/* Particle background */}
      <ParticleCanvas />

      {/* Light beams */}
      <Beams />

      {/* Top accent bar */}
      <div
        className="fixed top-0 left-0 right-0 z-20 h-[3px]"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #00d2ff 25%, #f5c842 50%, #00d2ff 75%, transparent 100%)',
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
            style={{ background: 'rgba(0,210,255,0.1)' }}
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
                background: t.type === 'error' ? 'rgba(220,40,40,0.85)' : 'rgba(0,80,220,0.85)',
                border: `1px solid ${t.type === 'error' ? 'rgba(255,100,80,0.4)' : 'rgba(0,150,255,0.4)'}`,
                backdropFilter: 'blur(12px)',
                fontFamily: 'var(--font-body)',
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

// ── decorative light beams ────────────────────────────────────
function Beams() {
  const beams = [
    { left: '8%', height: '75%', dur: 8, delay: -1 },
    { left: '20%', height: '88%', dur: 11, delay: -3, opacity: 0.55 },
    { left: '35%', height: '68%', dur: 9, delay: -5 },
    { left: '52%', height: '95%', dur: 13, delay: -2, gold: true },
    { left: '67%', height: '80%', dur: 10, delay: -7 },
    { left: '80%', height: '72%', dur: 7, delay: -4, opacity: 0.5 },
    { left: '93%', height: '84%', dur: 12, delay: -6 },
  ];
  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
      {beams.map((b, i) => (
        <div
          key={i}
          className="absolute bottom-[-10%] w-[1.5px]"
          style={{
            left: b.left,
            height: b.height,
            opacity: b.opacity ?? 0.7,
            background: b.gold
              ? 'linear-gradient(to top, transparent, rgba(245,200,66,0.12), transparent)'
              : 'linear-gradient(to top, transparent, rgba(0,210,255,0.15), transparent)',
            animation: `beamSway ${b.dur}s ${b.delay}s ease-in-out infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes beamSway {
          0%,100% { transform: rotate(-3deg) scaleX(1); }
          50%      { transform: rotate(3deg) scaleX(1.6); }
        }
      `}</style>
    </div>
  );
}
