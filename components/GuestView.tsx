'use client';
// ── components/GuestView.tsx ──────────────────────────────────

import { Cormorant_Garamond, Playfair_Display, Be_Vietnam_Pro } from 'next/font/google';

const beVietnam = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '600', '800'],
});

const playfair = Playfair_Display({
  subsets: ['latin', 'vietnamese'],
  weight: ['600', '700'],
  style: ['italic', 'normal'],
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

function formatDate(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
}

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
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
    transition: { delay: i * 0.07 + 0.15, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ─── Animated light sweep line beside the name ─── */
function LightBeam({ direction = 'right' }: { direction?: 'left' | 'right' }) {
  const isRight = direction === 'right';
  return (
    <div style={{
      flex: 1, height: '1px',
      position: 'relative', overflow: 'hidden',
      background: 'rgba(255,255,255,0.06)',
    }}>
      <motion.div
        style={{
          position: 'absolute', top: '-4px',
          width: '60px', height: '9px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.95) 0%, rgba(200,230,255,0.5) 50%, transparent 100%)',
          filter: 'blur(1px)',
        }}
        animate={{ x: isRight ? ['-60px', '115%'] : ['115%', '-60px'] }}
        transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 0.8, ease: 'easeInOut' }}
      />
    </div>
  );
}

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
        className={beVietnam.className} // Apply font class directly here
        style={{
          fontWeight: 800, // <--- Add this for Bold
          fontSize: 'clamp(1.4rem, 3.8vw, 2.8rem)',
          lineHeight: 1.35,
          margin: 0,
          padding: '6px 0',
          background: 'linear-gradient(130deg, #ffffff 30%, #fde68a 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '0.02em', // Reduced slightly to help fit
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
/* ─── Info row: label dim, value white, same size ─── */
function InfoRow({ label, value, custom }: { label: string; value: string; custom: number }) {
  return (
    <motion.div
      custom={custom} variants={lineVariants} initial="hidden" animate="show"
      style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '13px' }}
    >
      <span style={{
        fontFamily: 'var(--font-body)',
        fontSize: 'clamp(0.88rem, 1.4vw, 1.05rem)',
        fontWeight: 500,
        color: 'rgba(255,255,255,0.42)',
        flexShrink: 0,
        minWidth: '148px',
      }}>
        {label}
      </span>
      <div style={{ width: '1px', height: '13px', background: 'rgba(255,255,255,0.15)', flexShrink: 0, alignSelf: 'center' }} />
      <span style={{
        fontFamily: 'var(--font-body)',
        fontSize: 'clamp(0.88rem, 1.4vw, 1.05rem)',
        fontWeight: 600,
        color: '#ffffff',
      }}>
        {value}
      </span>
    </motion.div>
  );
}

const PHOTO_W = 380;
const PHOTO_H = 380; // 1:1 to match 1800×1800 source image

export default function GuestView({ guest, tapCount }: GuestViewProps) {
  const fullName = `${guest.first_name} ${guest.last_name}`;

  return (
    <motion.div
      key="guest"
      className="fixed inset-0 z-10 flex items-center justify-center px-8 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0" style={{
        background: 'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(0,50,160,0.28) 0%, transparent 70%)',
      }} />

      <motion.div
        key={guest.rfid_card_id}
        variants={cardVariants}
        initial="hidden" animate="show" exit="exit"
        className="relative w-full max-w-5xl"
        style={{
          background: 'rgba(3, 10, 32, 0.88)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '24px',
          backdropFilter: 'blur(40px)',
          boxShadow:
            '0 0 80px rgba(0,60,200,0.2), 0 2px 0 rgba(255,255,255,0.06) inset, 0 -1px 0 rgba(0,0,0,0.4) inset',
          overflow: 'hidden',
        }}
      >
        {/* Subtle shimmer overlay */}
        <div className="pointer-events-none absolute inset-0" style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%, rgba(245,200,66,0.03) 100%)',
        }} />

        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0" style={{ height: '2px' }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, transparent 0%, rgba(0,180,255,0.6) 30%, rgba(255,255,255,0.9) 50%, rgba(245,200,66,0.6) 70%, transparent 100%)',
          }} />
        </div>

        <div className="relative flex flex-col md:flex-row items-center gap-10 md:gap-14 p-10 md:p-14">

          {/* ══ LEFT — PHOTO CARD ══ */}
          <div className="flex-shrink-0 flex flex-col items-center" style={{ gap: '14px' }}>

            <div style={{ position: 'relative', display: 'inline-block' }}>

              {/* Outer card shell — glow ring, circle for VIP */}
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 24px rgba(0,160,255,0.25), 0 0 60px rgba(0,80,180,0.12)',
                    '0 0 36px rgba(0,180,255,0.35), 0 0 80px rgba(0,100,200,0.18)',
                    '0 0 24px rgba(0,160,255,0.25), 0 0 60px rgba(0,80,180,0.12)',
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute', inset: '-2px',
                  borderRadius: guest.is_vip ? '50%' : '16px',
                  border: '1px solid rgba(255,255,255,0.14)',
                  background: 'transparent',
                  zIndex: 0,
                }}
              />

              {/* Photo container — circle for VIP */}
              <div style={{
                position: 'relative',
                width: `${PHOTO_W}px`,
                height: `${PHOTO_H}px`,
                borderRadius: guest.is_vip ? '50%' : '14px',
                overflow: 'hidden',
                backgroundColor: '#060e28',
                zIndex: 1,
              }}>
                {!guest.photo_url ? (
                  <Image
                    src="/pfp/testcircle.png"
                    alt={fullName}
                    fill
                    className="object-cover object-center"
                    unoptimized priority
                    sizes={`${PHOTO_W}px`}
                  />
                ) : (
                  <div style={{
                    width: '100%', height: '100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '5rem',
                    background: 'linear-gradient(170deg, #0d2560 0%, #060e28 100%)',
                  }}>
                    👤
                  </div>
                )}

                {/* ── LEFT white light column ── */}
                <motion.div
                  animate={{ opacity: [0.55, 0.85, 0.55] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute', top: 0, left: 0, bottom: 0,
                    width: '52px',
                    background:
                      'linear-gradient(to right, rgba(255,255,255,0.22) 0%, rgba(200,230,255,0.10) 50%, transparent 100%)',
                    pointerEvents: 'none',
                  }}
                />

                {/* ── RIGHT white light column ── */}
                <motion.div
                  animate={{ opacity: [0.55, 0.85, 0.55] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                  style={{
                    position: 'absolute', top: 0, right: 0, bottom: 0,
                    width: '52px',
                    background:
                      'linear-gradient(to left, rgba(255,255,255,0.22) 0%, rgba(200,230,255,0.10) 50%, transparent 100%)',
                    pointerEvents: 'none',
                  }}
                />

                {/* Bottom name fade overlay — only for non-VIP (rect card) */}
                {!guest.is_vip && (
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: '90px',
                    background: 'linear-gradient(to top, rgba(3,10,32,0.96) 0%, rgba(3,10,32,0.4) 60%, transparent 100%)',
                  }} />
                )}
              </div>

              {/* Thin bottom border accent — only for non-VIP */}
              {!guest.is_vip && (
                <div style={{
                  position: 'absolute', bottom: '-1px', left: '10%', right: '10%', height: '2px',
                  background: 'linear-gradient(90deg, transparent, rgba(0,180,255,0.7), transparent)',
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
                  background: 'linear-gradient(135deg, #f5c842, #d4960a)',
                  color: '#000', fontWeight: 800, fontSize: '0.75rem',
                  letterSpacing: '0.22em',
                  boxShadow: '0 0 18px rgba(245,200,66,0.45)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                KHÁCH MỜI
              </motion.div>
            )}
          </div>

          {/* ══ RIGHT — INFO ══ */}
          <div className="flex-1 min-w-0 flex flex-col">

            {/* Welcome label */}
            <motion.p
              custom={0} variants={lineVariants} initial="hidden" animate="show"
              style={{
                color: 'rgba(0,200,255,0.8)',
                fontFamily: 'var(--font-body)',
                fontWeight: 600, fontSize: '1rem',
                letterSpacing: '0.4em', textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              {guest.is_vip ? '✦ Xin chào, Đồng chí' : '✦ Xin Chào, Đại Biểu'}
            </motion.p>

            {/* Name — rectangle frame, full width, single line auto-shrink */}
            <motion.div
              custom={1} variants={lineVariants} initial="hidden" animate="show"
              style={{ position: 'relative', marginBottom: '26px', padding: '14px 20px', display: 'block' }}
            >
              {/* Outer rectangle border */}
              <div style={{
                position: 'absolute', inset: 0,
                border: '1px solid rgba(0,200,255,0.35)',
                borderRadius: '6px',
                boxShadow: '0 0 18px rgba(0,180,255,0.12), inset 0 0 18px rgba(0,100,200,0.06)',
                pointerEvents: 'none',
              }} />

              {/* Corner brackets — TL */}
              <svg width="14" height="14" viewBox="0 0 14 14" style={{ position: 'absolute', top: '-1px', left: '-1px' }}>
                <path d="M1 13 L1 1 L13 1" stroke="#00d2ff" strokeWidth="2" fill="none" strokeLinecap="square" />
              </svg>
              {/* TR */}
              <svg width="14" height="14" viewBox="0 0 14 14" style={{ position: 'absolute', top: '-1px', right: '-1px' }}>
                <path d="M13 13 L13 1 L1 1" stroke="#00d2ff" strokeWidth="2" fill="none" strokeLinecap="square" />
              </svg>
              {/* BL */}
              <svg width="14" height="14" viewBox="0 0 14 14" style={{ position: 'absolute', bottom: '-1px', left: '-1px' }}>
                <path d="M1 1 L1 13 L13 13" stroke="#00d2ff" strokeWidth="2" fill="none" strokeLinecap="square" />
              </svg>
              {/* BR */}
              <svg width="14" height="14" viewBox="0 0 14 14" style={{ position: 'absolute', bottom: '-1px', right: '-1px' }}>
                <path d="M13 1 L13 13 L1 13" stroke="#00d2ff" strokeWidth="2" fill="none" strokeLinecap="square" />
              </svg>

              <FitName name={fullName} />
            </motion.div>

            {/* Divider */}
            <motion.div custom={2} variants={lineVariants} initial="hidden" animate="show"
              style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '20px' }} />

            {/* Info rows — VIP shows only Chức vụ value (2-line), non-VIP shows label+value rows */}
            {guest.is_vip ? (
              <motion.p
                custom={3} variants={lineVariants} initial="hidden" animate="show"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'clamp(1rem, 1.6vw, 1.25rem)',
                  fontWeight: 700,
                  color: '#ffffff',
                  lineHeight: 1.55,
                  marginBottom: '8px',
                  marginTop: '8px'
                }}
              >
                {guest.job_position || 'Đại Biểu'}
              </motion.p>
            ) : (
              <>
                <InfoRow label="Chức vụ" value={guest.job_position || 'Đại Biểu'} custom={3} />
                <InfoRow label="Đơn vị" value={guest.branch_location || '—'} custom={4} />
              </>
            )}

            {/* Divider */}
            <motion.div custom={6} variants={lineVariants} initial="hidden" animate="show"
              style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginTop: '6px', marginBottom: '16px' }} />

            {/* Bottom message */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ position: 'relative', marginTop: '20px' }}
            >
              <motion.div
                animate={{ scaleY: [0.6, 1, 0.6], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute', left: 0, top: '4px', bottom: '4px',
                  width: '3px', borderRadius: '2px',
                  background: 'linear-gradient(to bottom, #f5c842, rgba(245,200,66,0.3))',
                }}
              />
              <span className={luxuryFont.className} style={{
                display: 'block',
                paddingLeft: '14px',
                fontSize: 'clamp(1.15rem, 1.55vw, 1.4rem)',
                fontWeight: 600,
                fontStyle: 'italic',
                color: '#fde68a',
                lineHeight: 1.45,
                letterSpacing: '0.01em',
                textShadow: '0 2px 12px rgba(245,200,66,0.25)',
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
        fontFamily: 'var(--font-body)',
        fontSize: 'clamp(0.62rem, 1vw, 0.85rem)',
        fontWeight: 700, color: 'rgba(245,200,66,0.55)',
        letterSpacing: '0.28em', textTransform: 'uppercase',
      }}>
        Tiên Phong – Đoàn Kết – Sáng Tạo – Đột Phá – Phát Triển
      </p>
    </motion.div>
  );
}