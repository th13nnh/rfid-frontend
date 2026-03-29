'use client';
// ── components/GuestView.tsx ──────────────────────────────────

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Guest } from '@/lib/api';

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
  hidden: { opacity: 0, y: 48, scale: 0.95 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0, y: -24, scale: 0.97,
    transition: { duration: 0.4 },
  },
};

const lineVariants = {
  hidden: { opacity: 0, x: -20 },
  show: (i: number) => ({
    opacity: 1, x: 0,
    transition: { delay: i * 0.08 + 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ─── Corner accent SVG ─── */
function CornerAccent({ rotate = 0 }: { rotate?: number }) {
  return (
    <svg
      width="28" height="28" viewBox="0 0 28 28"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <path d="M2 26 L2 2 L26 2" stroke="#00d2ff" strokeWidth="2.5"
        fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="2" cy="2" r="2.5" fill="#f5c842" />
    </svg>
  );
}

/* ─── Animated light sweep on one side ─── */
function LightBeam({ direction = 'right' }: { direction?: 'left' | 'right' }) {
  const isRight = direction === 'right';
  return (
    <div
      style={{
        flex: 1,
        height: '2px',
        position: 'relative',
        overflow: 'hidden',
        background: 'rgba(255,255,255,0.08)',
        borderRadius: '2px',
      }}
    >
      {/* Static base line */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,210,255,0.15)',
      }} />
      {/* Animated light orb */}
      <motion.div
        style={{
          position: 'absolute',
          top: '-4px',
          width: '40px',
          height: '10px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.95) 0%, rgba(0,210,255,0.6) 50%, transparent 100%)',
          filter: 'blur(1px)',
        }}
        animate={{
          x: isRight
            ? ['-40px', '120%']
            : ['120%', '-40px'],
        }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          repeatDelay: 0.6,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}

export default function GuestView({ guest, tapCount, countdown, totalCountdown }: GuestViewProps) {
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
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,60,180,0.3) 0%, transparent 70%)',
        }}
      />

      <motion.div
        key={guest.rfid_card_id}
        variants={cardVariants}
        initial="hidden"
        animate="show"
        exit="exit"
        className="relative w-full max-w-5xl"
        style={{
          background: 'rgba(2, 12, 38, 0.82)',
          border: '1px solid rgba(0,210,255,0.18)',
          borderRadius: '28px',
          backdropFilter: 'blur(32px)',
          boxShadow:
            '0 0 100px rgba(0,80,220,0.22), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.05)',
          overflow: 'hidden',
        }}
      >
        {/* Holographic shimmer overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, rgba(0,210,255,0.07) 0%, transparent 35%, transparent 65%, rgba(245,200,66,0.05) 100%)',
            borderRadius: '28px',
          }}
        />

        {/* Top accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-[3px]"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, #00d2ff 30%, #f5c842 60%, #00d2ff 80%, transparent 100%)',
          }}
        />

        <div className="relative flex flex-col md:flex-row items-center gap-10 md:gap-14 p-10 md:p-14">

          {/* ── LEFT: SQUARE PHOTO ── */}
          <div className="flex-shrink-0 flex flex-col items-center gap-4">

            {/* Square frame wrapper */}
            <div style={{ position: 'relative', display: 'inline-block' }}>

              {/* Outer glow border */}
              <div
                style={{
                  position: 'absolute',
                  inset: '-3px',
                  borderRadius: '14px',
                  padding: '3px',
                  background: 'linear-gradient(135deg, #00d2ff, #f5c842, #00d2ff)',
                  boxShadow: '0 0 32px rgba(0,210,255,0.5), 0 0 64px rgba(0,210,255,0.2)',
                }}
              />

              {/* Photo container */}
              <div
                style={{
                  position: 'relative',
                  width: '400px',       // display size (adjust for UI)
                  height: '400px',      // square container
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '3px solid #03122e',
                  boxShadow: 'inset 0 0 20px rgba(0,0,0,0.6)',
                  zIndex: 1,
                }}
              >
                {!guest.photo_url ? (
                  <Image
                    // src={guest.photo_url}
                    src="/pfp/test.jpg"
                    alt={fullName}
                    fill
                    className="object-cover object-center"
                    unoptimized
                    priority
                    sizes="400px"
                    quality={100}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%', height: '100%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '5rem',
                      background: 'linear-gradient(160deg, #0a2a6e 0%, #03122e 100%)',
                    }}
                  >
                    👤
                  </div>
                )}

                {/* Bottom gradient overlay (like image 3) */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  height: '60px',
                  background: 'linear-gradient(to top, rgba(2,12,38,0.85) 0%, transparent 100%)',
                }} />
              </div>

              {/* Corner accents */}
              <div style={{ position: 'absolute', top: '-2px', left: '-2px', zIndex: 2 }}>
                <CornerAccent rotate={0} />
              </div>
              <div style={{ position: 'absolute', top: '-2px', right: '-2px', zIndex: 2 }}>
                <CornerAccent rotate={90} />
              </div>
              <div style={{ position: 'absolute', bottom: '-2px', left: '-2px', zIndex: 2 }}>
                <CornerAccent rotate={270} />
              </div>
              <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', zIndex: 2 }}>
                <CornerAccent rotate={180} />
              </div>

              {/* Scanning line animation */}
              <motion.div
                style={{
                  position: 'absolute',
                  left: 0, right: 0,
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, rgba(0,210,255,0.7), transparent)',
                  boxShadow: '0 0 8px rgba(0,210,255,0.8)',
                  zIndex: 3,
                  pointerEvents: 'none',
                }}
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>

            {/* VIP badge */}
            {guest.is_vip && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 260 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '6px 20px',
                  borderRadius: '999px',
                  background: 'linear-gradient(135deg, #f5c842, #e6a800)',
                  color: '#000',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  letterSpacing: '0.2em',
                  boxShadow: '0 0 20px rgba(245,200,66,0.5)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                ⭐ VIP
              </motion.div>
            )}

            {/* Tap count badge */}
            <motion.div
              custom={4} variants={lineVariants} initial="hidden" animate="show"
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '6px 16px',
                borderRadius: '10px',
                background: 'rgba(0,210,255,0.08)',
                border: '1px solid rgba(0,210,255,0.25)',
                fontFamily: 'var(--font-body)',
              }}
            >
              <span style={{ fontSize: '1rem' }}>🏷️</span>
              <div style={{ lineHeight: 1 }}>
                <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2px' }}>
                  Quẹt hôm nay
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#00d2ff' }}>
                  {tapCount} lần
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT: INFO ── */}
          <div className="flex-1 min-w-0 flex flex-col gap-0">

            {/* Welcome tag */}
            <motion.p
              custom={0} variants={lineVariants} initial="hidden" animate="show"
              style={{
                color: '#00d2ff',
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                fontSize: '0.7rem',
                letterSpacing: '0.4em',
                textTransform: 'uppercase',
                marginBottom: '16px',
              }}
            >
              ✦ Xin Chào, Đại Biểu
            </motion.p>

            {/* Name + light beams */}
            <motion.div
              custom={1} variants={lineVariants} initial="hidden" animate="show"
              style={{ marginBottom: '20px' }}
            >
              {/* Light beams row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <LightBeam direction="left" />
                <div style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: '#f5c842',
                  boxShadow: '0 0 10px #f5c842',
                  flexShrink: 0,
                }} />
                <LightBeam direction="right" />
              </div>

              {/* Full name */}
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.2rem, 5vw, 4rem)',
                  lineHeight: 1.05,
                  background: 'linear-gradient(135deg, #ffffff 0%, #fde68a 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 2px 16px rgba(245,200,66,0.3))',
                  margin: 0,
                  letterSpacing: '0.02em',
                }}
              >
                {fullName}
              </h2>

              {/* Light beams row (bottom) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                <LightBeam direction="right" />
                <div style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: '#00d2ff',
                  boxShadow: '0 0 10px #00d2ff',
                  flexShrink: 0,
                }} />
                <LightBeam direction="left" />
              </div>
            </motion.div>

            {/* Divider */}
            <motion.div
              custom={2} variants={lineVariants} initial="hidden" animate="show"
              style={{ height: '1px', background: 'rgba(255,255,255,0.07)', marginBottom: '20px' }}
            />

            {/* Work Position */}
            <motion.div
              custom={3} variants={lineVariants} initial="hidden" animate="show"
              style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '14px' }}
            >
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.72rem',
                color: 'rgba(0,210,255,0.7)',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                fontWeight: 600,
                flexShrink: 0,
                minWidth: '110px',
              }}>
                Chức vụ
              </span>
              <div style={{ width: '1px', height: '14px', background: 'rgba(0,210,255,0.3)', flexShrink: 0 }} />
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(1rem, 2vw, 1.4rem)',
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '0.01em',
              }}>
                {guest.job_position || 'Đại Biểu'}
              </span>
            </motion.div>

            {/* Working Branch */}
            <motion.div
              custom={4} variants={lineVariants} initial="hidden" animate="show"
              style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '28px' }}
            >
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.72rem',
                color: 'rgba(0,210,255,0.7)',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                fontWeight: 600,
                flexShrink: 0,
                minWidth: '110px',
              }}>
                Đơn vị
              </span>
              <div style={{ width: '1px', height: '14px', background: 'rgba(0,210,255,0.3)', flexShrink: 0 }} />
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(0.9rem, 1.6vw, 1.15rem)',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.65)',
                letterSpacing: '0.03em',
              }}>
                {guest.branch_location || '—'}
              </span>
            </motion.div>

            {/* Divider */}
            <motion.div
              custom={5} variants={lineVariants} initial="hidden" animate="show"
              style={{ height: '1px', background: 'rgba(255,255,255,0.07)', marginBottom: '18px' }}
            />

            {/* Bottom row: join date + RFID */}
            <motion.div
              custom={6} variants={lineVariants} initial="hidden" animate="show"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}
            >
              {/* Join date */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.9rem' }}>📅</span>
                <div>
                  <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'var(--font-body)' }}>
                    Tham gia
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font-body)' }}>
                    {formatDate(guest.join_date)}
                  </div>
                </div>
              </div>

              {/* RFID */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <motion.div
                  style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#00d2ff', boxShadow: '0 0 8px #00d2ff', flexShrink: 0 }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
                <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-body)' }}>
                  Mã thẻ:
                </span>
                <span style={{ fontSize: '0.88rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-body)' }}>
                  {guest.rfid_card_id}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Slogan */}
      <p
        className="fixed bottom-7 left-0 right-0 text-center"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(0.65rem, 1.1vw, 0.9rem)',
          fontWeight: 700,
          color: 'rgba(245,200,66,0.6)',
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
        }}
      >
        Tiên Phong – Đoàn Kết – Sáng Tạo – Đột Phá – Phát Triển
      </p>
    </motion.div>
  );
}