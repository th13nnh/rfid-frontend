'use client';
// ── components/LandingView.tsx ────────────────────────────────

import { motion } from 'framer-motion';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const up = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function LandingView() {
  return (
    <motion.div
      key="landing"
      className="fixed inset-0 z-10 flex flex-col items-center justify-center text-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background glow blob */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 50%, rgba(0,80,200,0.22) 0%, transparent 70%)',
        }}
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="flex flex-col items-center gap-0 relative z-10"
      >
        {/* Emblem */}
        <motion.div variants={up} className="mb-8">
          <div className="relative w-32 h-32 mx-auto">
            {/* Rotating conic ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'conic-gradient(from 0deg, #c8102e, #0047ab, #ffd700, #00c8ff, #c8102e)',
                padding: '3px',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            >
              <div
                className="w-full h-full rounded-full flex items-center justify-center text-5xl"
                style={{ background: '#03122e' }}
              >
                🌟
              </div>
            </motion.div>
            {/* Outer glow ring */}
            <motion.div
              className="absolute inset-[-8px] rounded-full border border-cyan-400/20"
              animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>

        {/* Label */}
        <motion.p
          variants={up}
          className="text-sm tracking-[0.4em] uppercase mb-3"
          style={{ color: '#00d2ff', fontFamily: 'var(--font-body)', fontWeight: 600 }}
        >
          Chào Mừng Đại Hội Đại Biểu Toàn Quốc
        </motion.p>

        {/* Main title */}
        <motion.h1
          variants={up}
          className="leading-none mb-2"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3rem, 7vw, 6.5rem)',
            background: 'linear-gradient(135deg, #f5c842 0%, #fde68a 45%, #ffffff 60%, #fde68a 80%, #f5c842 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 2px 32px rgba(245,200,66,0.45))',
            letterSpacing: '0.05em',
          }}
        >
          ĐOÀN TNCS<br />HỒ CHÍ MINH
        </motion.h1>

        {/* Subtitle row */}
        <motion.p
          variants={up}
          className="font-semibold tracking-widest mb-1"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1.1rem, 2.5vw, 2rem)',
            color: '#fff',
          }}
        >
          LẦN THỨ XII
        </motion.p>

        <motion.p
          variants={up}
          className="tracking-[0.12em] mb-10"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(0.9rem, 1.8vw, 1.4rem)',
            color: '#00d2ff',
            fontWeight: 600,
          }}
        >
          NHIỆM KỲ 2022 – 2027
        </motion.p>

        {/* Divider */}
        <motion.div
          variants={up}
          className="w-72 h-px mb-10"
          style={{
            background: 'linear-gradient(90deg, transparent, #00d2ff, #f5c842, #00d2ff, transparent)',
          }}
        />

        {/* Scan prompt */}
        <motion.div
          variants={up}
          className="flex items-center gap-4 px-8 py-4 rounded-full"
          style={{
            background: 'rgba(0,210,255,0.06)',
            border: '1px solid rgba(0,210,255,0.25)',
          }}
          animate={{
            boxShadow: [
              '0 0 0 0 rgba(0,210,255,0.3)',
              '0 0 0 14px rgba(0,210,255,0)',
            ],
          }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut', delay: 1.5 }}
        >
          <motion.span
            className="text-3xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          >
            💳
          </motion.span>
          <span
            className="tracking-[0.14em] uppercase"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.8rem, 1.4vw, 1.05rem)',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.88)',
            }}
          >
            Vui Lòng Quẹt Thẻ Để Điểm Danh
          </span>
        </motion.div>
      </motion.div>

      {/* Slogan footer */}
      <motion.p
        className="fixed bottom-7 left-0 right-0 text-center tracking-[0.28em] uppercase"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(0.65rem, 1.1vw, 0.9rem)',
          fontWeight: 700,
          color: 'rgba(245,200,66,0.7)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        Tiên Phong – Đoàn Kết – Sáng Tạo – Đột Phá – Phát Triển
      </motion.p>
    </motion.div>
  );
}
