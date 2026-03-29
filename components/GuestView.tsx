'use client';
// ── components/GuestView.tsx ──────────────────────────────────

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Guest } from '@/lib/api';
import CountdownRing from './CountdownRing';

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
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -24, scale: 0.97, transition: { duration: 0.4 } },
};

const lineVariants = {
  hidden: { opacity: 0, x: -20 },
  show: (i: number) => ({
    opacity: 1, x: 0,
    transition: { delay: i * 0.08 + 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

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
          background: 'rgba(2, 12, 38, 0.78)',
          border: '1px solid rgba(0,210,255,0.18)',
          borderRadius: '28px',
          backdropFilter: 'blur(32px)',
          boxShadow: '0 0 100px rgba(0,80,220,0.22), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.05)',
          overflow: 'hidden',
        }}
      >
        {/* Holographic shimmer overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, rgba(0,210,255,0.08) 0%, transparent 35%, transparent 65%, rgba(245,200,66,0.06) 100%)',
            borderRadius: '28px',
          }}
        />

        {/* Top accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-[3px]"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, #00d2ff 30%, #f5c842 60%, #00d2ff 80%, transparent 100%)',
          }}
        />

        <div className="relative flex flex-col md:flex-row items-center gap-10 md:gap-14 p-10 md:p-14">

          {/* ── LEFT: PHOTO ── */}
          <div className="flex-shrink-0 flex flex-col items-center gap-4">
            <div className="relative">
              {/* Rotating ring */}
              <motion.div
                className="absolute inset-[-5px] rounded-full"
                style={{
                  background: 'conic-gradient(from 0deg, #00d2ff, #f5c842, #e63b2e, #00d2ff)',
                  padding: '3px',
                  borderRadius: '50%',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              />
              {/* Photo */}
              <div
                className="relative w-48 h-48 rounded-full overflow-hidden"
                style={{ border: '4px solid #03122e', boxShadow: '0 0 50px rgba(0,210,255,0.4)' }}
              >
                {guest.photo_url ? (
                  <Image
                    src={guest.photo_url}
                    alt={fullName}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-6xl"
                    style={{ background: 'linear-gradient(135deg, #0a2a6e, #03122e)' }}
                  >
                    👤
                  </div>
                )}
              </div>
            </div>

            {/* VIP badge */}
            {guest.is_vip && (
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 260 }}
                className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold tracking-widest"
                style={{
                  background: 'linear-gradient(135deg, #f5c842, #e6a800)',
                  color: '#000',
                  boxShadow: '0 0 20px rgba(245,200,66,0.5)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                ⭐ VIP
              </motion.div>
            )}


          </div>

          {/* ── RIGHT: INFO ── */}
          <div className="flex-1 min-w-0 flex flex-col gap-0">

            {/* Welcome tag */}
            <motion.p
              custom={0} variants={lineVariants} initial="hidden" animate="show"
              className="text-xs tracking-[0.4em] uppercase mb-3"
              style={{ color: '#00d2ff', fontFamily: 'var(--font-body)', fontWeight: 600 }}
            >
              ✦ Xin Chào, Đại Biểu
            </motion.p>

            {/* Name */}
            <motion.h2
              custom={1} variants={lineVariants} initial="hidden" animate="show"
              className="leading-none mb-3"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.2rem, 5vw, 4.2rem)',
                background: 'linear-gradient(135deg, #ffffff 0%, #fde68a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 2px 16px rgba(245,200,66,0.3))',
              }}
            >
              {fullName}
            </motion.h2>

            {/* Position */}
            <motion.p
              custom={2} variants={lineVariants} initial="hidden" animate="show"
              className="font-semibold tracking-wider mb-1"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(1rem, 2vw, 1.5rem)',
                color: '#00d2ff',
              }}
            >
              {guest.job_position || 'Đại Biểu'}
            </motion.p>

            {/* Branch */}
            <motion.p
              custom={3} variants={lineVariants} initial="hidden" animate="show"
              className="mb-8 font-light"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                color: 'rgba(255,255,255,0.55)',
                letterSpacing: '0.03em',
              }}
            >
              {guest.branch_location || ''}
            </motion.p>

            {/* Info chips */}
            <motion.div
              custom={4} variants={lineVariants} initial="hidden" animate="show"
              className="flex flex-wrap gap-3 mb-8"
            >
              <InfoChip icon="📅" label="Tham gia" value={formatDate(guest.join_date)} />
              <InfoChip icon="🏷️" label="Quẹt hôm nay" value={`${tapCount} lần`} accent />
            </motion.div>

            {/* Divider */}
            <motion.div
              custom={5} variants={lineVariants} initial="hidden" animate="show"
              className="h-px mb-5"
              style={{ background: 'rgba(255,255,255,0.07)' }}
            />

            {/* RFID row */}
            <motion.div
              custom={6} variants={lineVariants} initial="hidden" animate="show"
              className="flex items-center gap-3"
            >
              <motion.div
                className="w-2 h-2 rounded-full"
                style={{ background: '#00d2ff', boxShadow: '0 0 8px #00d2ff' }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
              <span
                className="text-xs uppercase tracking-widest"
                style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-body)' }}
              >
                Mã thẻ:
              </span>
              <span
                className="tracking-widest"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9rem',
                  color: 'rgba(255,255,255,0.45)',
                }}
              >
                {guest.rfid_card_id}
              </span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Slogan */}
      <p
        className="fixed bottom-7 left-0 right-0 text-center tracking-[0.28em] uppercase"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(0.65rem, 1.1vw, 0.9rem)',
          fontWeight: 700,
          color: 'rgba(245,200,66,0.6)',
        }}
      >
        Tiên Phong – Đoàn Kết – Sáng Tạo – Đột Phá – Phát Triển
      </p>
    </motion.div>
  );
}

function InfoChip({ icon, label, value, accent }: {
  icon: string; label: string; value: string; accent?: boolean;
}) {
  return (
    <div
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
      style={{
        background: accent ? 'rgba(0,210,255,0.08)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${accent ? 'rgba(0,210,255,0.25)' : 'rgba(255,255,255,0.08)'}`,
        fontFamily: 'var(--font-body)',
      }}
    >
      <span className="text-lg">{icon}</span>
      <div className="flex flex-col leading-none">
        <span className="text-[0.65rem] uppercase tracking-widest mb-0.5"
          style={{ color: 'rgba(255,255,255,0.35)' }}>
          {label}
        </span>
        <span className="text-sm font-semibold"
          style={{ color: accent ? '#00d2ff' : 'rgba(255,255,255,0.85)' }}>
          {value}
        </span>
      </div>
    </div>
  );
}
