'use client';
// ── components/GuestView.tsx ──────────────────────────────────

import { Be_Vietnam_Pro, Cormorant_Garamond } from 'next/font/google';

const beVietnam = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '600', '800'],
});

const luxuryFont = Cormorant_Garamond({
  subsets: ['latin', 'vietnamese'],
  weight: ['500', '600', '700'],
  style: ['italic', 'normal'],
});

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Guest } from '@/lib/api';
import { useEffect, useRef } from 'react';

interface GuestViewProps {
  guest: Guest;
  tapCount: number;
  countdown: number;
  totalCountdown: number;
}

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: {
    opacity: 0, y: -20, scale: 0.97,
    transition: { duration: 0.35 },
  },
};

const lineVariants = {
  hidden: { opacity: 0, x: -16 },
  show: (i: number) => ({
    opacity: 1, x: 0,
    transition: { delay: i * 0.07 + 0.15, duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

function FitName({ name }: { name: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const text = textRef.current;
    if (!wrap || !text) return;
    text.style.transform = 'scaleX(1)';
    const ratio = wrap.clientWidth / text.scrollWidth;
    if (ratio < 1) text.style.transform = `scaleX(${ratio})`;
  }, [name]);

  return (
    <div ref={wrapRef} style={{ overflow: 'hidden', width: '100%' }}>
      <h2
        ref={textRef}
        className={luxuryFont.className}
        style={{
          fontWeight: 800,
          fontSize: 'clamp(1.4rem, 3.8vw, 2.8rem)',
          lineHeight: 1.35,
          margin: 0,
          padding: '6px 0',
          // Deep navy text matching LandingView's dark blue tone
          color: '#0a3a6e',
          letterSpacing: '0.02em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          transformOrigin: 'left center',
          display: 'inline-block',
        }}
      >
        {name}
      </h2>
    </div>
  );
}

function InfoRow({ label, value, custom }: { label: string; value: string; custom: number }) {
  return (
    <motion.div
      custom={custom} variants={lineVariants} initial="hidden" animate="show"
      style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '13px' }}
    >
      <span style={{
        fontFamily: beVietnam.style.fontFamily,
        fontSize: 'clamp(0.88rem, 1.4vw, 1.05rem)',
        fontWeight: 500,
        // Muted cyan-blue for labels
        color: 'rgba(14, 80, 160, 0.55)',
        flexShrink: 0,
        minWidth: '148px',
      }}>
        {label}
      </span>
      <div style={{ width: '1px', height: '13px', background: 'rgba(41,197,246,0.35)', flexShrink: 0, alignSelf: 'center' }} />
      <span style={{
        fontFamily: beVietnam.style.fontFamily,
        fontSize: 'clamp(0.88rem, 1.4vw, 1.05rem)',
        fontWeight: 700,
        // Rich dark navy for values
        color: '#0a3a6e',
      }}>
        {value}
      </span>
    </motion.div>
  );
}

const PHOTO_W = 380;
const PHOTO_H = 380;

export default function GuestView({ guest, tapCount }: GuestViewProps) {
  const fullName = `${guest.first_name} ${guest.last_name}`;
  // Use card ID as the image filename
  const photoSrc = `/pfp/${guest.rfid_card_id}.png`;

  return (
    <motion.div
      key="guest"
      className="fixed inset-0 z-10 flex items-center justify-center px-8 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Ambient radial glow — cyan, matching LandingView */}
      <div className="pointer-events-none absolute inset-0" style={{
        background: 'radial-gradient(ellipse 70% 55% at 50% 50%, rgba(41,197,246,0.10), transparent)',
      }} />

      <motion.div
        key={guest.rfid_card_id}
        variants={cardVariants}
        initial="hidden" animate="show" exit="exit"
        className="relative w-full max-w-5xl"
        style={{
          // Light frosted glass — matching LandingView's white/cyan palette
          background: 'rgba(255, 255, 255, 0.78)',
          border: '1.5px solid rgba(41,197,246,0.55)',
          borderRadius: '24px',
          backdropFilter: 'blur(28px)',
          boxShadow:
            'inset 0 0 40px rgba(41,197,246,0.08), 0 8px 48px rgba(26,111,255,0.13), 0 2px 0 rgba(255,255,255,0.9) inset',
          overflow: 'hidden',
        }}
      >
        {/* Corner brackets — matching LandingView CTA corners */}
        <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-cyan-400" style={{ borderColor: 'rgba(41,197,246,0.9)' }} />
        <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2" style={{ borderColor: 'rgba(41,197,246,0.9)' }} />
        <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2" style={{ borderColor: 'rgba(41,197,246,0.9)' }} />
        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2" style={{ borderColor: 'rgba(41,197,246,0.9)' }} />

        {/* Top accent line — cyan-to-blue, identical to LandingView top bar */}
        <div className="absolute top-0 left-0 right-0" style={{ height: '3px' }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, transparent 0%, #29c5f6 25%, #1a6fff 50%, #29c5f6 75%, transparent 100%)',
          }} />
        </div>

        {/* Scan shimmer overlay — matching LandingView CTA scan effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-0 bottom-0"
            style={{
              width: '35%',
              background: 'linear-gradient(90deg, transparent, rgba(41,197,246,0.12), transparent)',
            }}
            animate={{ x: ['-120%', '400%'] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        <div className="relative flex flex-col md:flex-row items-center gap-10 md:gap-14 p-10 md:p-14">

          {/* ══ LEFT — PHOTO CARD ══ */}
          <div className="flex-shrink-0 flex flex-col items-center" style={{ gap: '14px' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>

              {/* Glow ring around photo */}
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(41,197,246,0.30), 0 0 50px rgba(26,111,255,0.12)',
                    '0 0 32px rgba(41,197,246,0.50), 0 0 70px rgba(26,111,255,0.20)',
                    '0 0 20px rgba(41,197,246,0.30), 0 0 50px rgba(26,111,255,0.12)',
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute', inset: '-2px',
                  borderRadius: guest.is_vip ? '50%' : '16px',
                  border: '1.5px solid rgba(41,197,246,0.6)',
                  background: 'transparent',
                  zIndex: 0,
                }}
              />

              {/* Photo */}
              <div style={{
                position: 'relative',
                width: `${PHOTO_W}px`,
                height: `${PHOTO_H}px`,
                borderRadius: guest.is_vip ? '50%' : '14px',
                overflow: 'hidden',
                // Light background matching theme
                backgroundColor: '#e8f9ff',
                zIndex: 1,
              }}>
                <Image
                  src={photoSrc}
                  alt={fullName}
                  fill
                  className="object-cover object-center"
                  unoptimized
                  priority
                  sizes={`${PHOTO_W}px`}
                />

                {/* Left light shimmer column */}
                <motion.div
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute', top: 0, left: 0, bottom: 0,
                    width: '52px',
                    background: 'linear-gradient(to right, rgba(255,255,255,0.45) 0%, rgba(200,240,255,0.18) 50%, transparent 100%)',
                    pointerEvents: 'none',
                  }}
                />

                {/* Right light shimmer column */}
                <motion.div
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                  style={{
                    position: 'absolute', top: 0, right: 0, bottom: 0,
                    width: '52px',
                    background: 'linear-gradient(to left, rgba(255,255,255,0.45) 0%, rgba(200,240,255,0.18) 50%, transparent 100%)',
                    pointerEvents: 'none',
                  }}
                />

                {/* Bottom name fade — non-VIP only, now to white */}
                {!guest.is_vip && (
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px',
                    background: 'linear-gradient(to top, rgba(240,252,255,0.92) 0%, rgba(240,252,255,0.4) 60%, transparent 100%)',
                  }} />
                )}
              </div>

              {/* Bottom cyan border accent */}
              {!guest.is_vip && (
                <div style={{
                  position: 'absolute', bottom: '-1px', left: '10%', right: '10%', height: '2px',
                  background: 'linear-gradient(90deg, transparent, rgba(41,197,246,0.8), transparent)',
                  zIndex: 2,
                }} />
              )}
            </div>

            {/* VIP badge */}
            {guest.is_vip && (
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 240 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '7px',
                  padding: '5px 18px', borderRadius: '999px',
                  // Cyan gradient badge matching theme instead of gold-on-dark
                  background: 'linear-gradient(135deg, #29c5f6, #1a6fff)',
                  color: '#ffffff', fontWeight: 800, fontSize: '0.75rem',
                  letterSpacing: '0.22em',
                  boxShadow: '0 0 18px rgba(41,197,246,0.45)',
                  fontFamily: beVietnam.style.fontFamily,
                  marginTop: '30px',
                }}
              >
                KHÁCH MỜI
              </motion.div>
            )}
          </div>

          {/* ══ RIGHT — INFO ══ */}
          <div className="flex-1 min-w-0 flex flex-col">

            {/* Welcome label — cyan accent like LandingView */}
            <motion.p
              custom={0} variants={lineVariants} initial="hidden" animate="show"
              style={{
                color: 'rgba(26,111,255,0.85)',
                fontFamily: beVietnam.style.fontFamily,
                fontWeight: 600, fontSize: '1rem',
                letterSpacing: '0.4em', textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              {guest.is_vip ? '✦ Xin chào, Đồng chí' : '✦ Xin Chào, Đại Biểu'}
            </motion.p>

            {/* Name box — light frosted, matching LandingView CTA border style */}
            <motion.div
              custom={1} variants={lineVariants} initial="hidden" animate="show"
              style={{ position: 'relative', marginBottom: '26px', padding: '14px 20px', display: 'block' }}
            >
              {/* Border */}
              <div style={{
                position: 'absolute', inset: 0,
                border: '2px solid rgba(41,197,246,0.70)',
                borderRadius: '6px',
                background: 'rgba(255,255,255,0.55)',
                boxShadow: 'inset 0 0 20px rgba(41,197,246,0.08), 0 0 18px rgba(41,197,246,0.10)',
                pointerEvents: 'none',
              }} />

              {/* Corner brackets — cyan, same as LandingView CTA */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: '14px', height: '14px', borderTop: '2px solid rgba(41,197,246,0.9)', borderLeft: '2px solid rgba(41,197,246,0.9)' }} />
              <div style={{ position: 'absolute', top: 0, right: 0, width: '14px', height: '14px', borderTop: '2px solid rgba(41,197,246,0.9)', borderRight: '2px solid rgba(41,197,246,0.9)' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, width: '14px', height: '14px', borderBottom: '2px solid rgba(41,197,246,0.9)', borderLeft: '2px solid rgba(41,197,246,0.9)' }} />
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: '14px', height: '14px', borderBottom: '2px solid rgba(41,197,246,0.9)', borderRight: '2px solid rgba(41,197,246,0.9)' }} />

              <FitName name={fullName} />
            </motion.div>

            {/* Divider */}
            <motion.div custom={2} variants={lineVariants} initial="hidden" animate="show"
              style={{ height: '1px', background: 'rgba(41,197,246,0.20)', marginBottom: '20px' }} />

            {/* Info rows */}
            <motion.p
              custom={3}
              variants={lineVariants}
              initial="hidden"
              animate="show"
              style={{
                fontFamily: beVietnam.style.fontFamily,
                fontSize: 'clamp(1rem, 1.6vw, 1.25rem)',
                fontWeight: 700,
                color: '#0a3a6e',
                lineHeight: 1.55,
                marginBottom: '8px',
                marginTop: '8px',
              }}
            >
              {guest.job_position || 'Đại Biểu'}
            </motion.p>

            {/* Divider */}
            <motion.div custom={6} variants={lineVariants} initial="hidden" animate="show"
              style={{ height: '1px', background: 'rgba(41,197,246,0.20)', marginTop: '6px', marginBottom: '16px' }} />

            {/* Bottom message — italic quote, now in navy-blue tone */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
              style={{ position: 'relative', marginTop: '20px' }}
            >
              {/* Animated cyan accent bar */}
              <motion.div
                animate={{ scaleY: [0.6, 1, 0.6], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute', left: 0, top: '4px', bottom: '4px',
                  width: '3px', borderRadius: '2px',
                  // Cyan bar matching LandingView accent color
                  background: 'linear-gradient(to bottom, #29c5f6, rgba(41,197,246,0.3))',
                }}
              />
              <span className={luxuryFont.className} style={{
                display: 'block',
                paddingLeft: '14px',
                fontSize: 'clamp(1.15rem, 1.55vw, 1.4rem)',
                fontWeight: 600,
                fontStyle: 'italic',
                // Dark navy blue for legibility on light background
                color: '#0e50a0',
                lineHeight: 1.45,
                letterSpacing: '0.01em',
                textShadow: '0 2px 12px rgba(41,197,246,0.12)',
              }}>
                {guest.is_vip
                  ? 'Chào mừng Đại biểu tham gia Đại hội Hội LHTN Việt Nam phường An Phú, lần thứ I nhiệm kỳ 2026 – 2031'
                  : <>Trân trọng chào mừng Đại biểu tham dự Đại hội<br />Chúc Đại hội diễn ra thành công tốt đẹp!</>}
              </span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Bottom slogan */}
      <p className="fixed bottom-7 left-0 right-0 text-center" style={{
        fontFamily: beVietnam.style.fontFamily,
        fontSize: 'clamp(0.62rem, 1vw, 0.85rem)',
        fontWeight: 800, color: 'rgba(14,80,160,0.75)',
        letterSpacing: '0.4em', textTransform: 'uppercase',
      }}>
        TIÊN PHONG - YÊU NƯỚC - BẢN LĨNH - SÁNG TẠO
      </p>
    </motion.div>
  );
}