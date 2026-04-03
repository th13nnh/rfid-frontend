'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const up = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function LandingView() {
  return (
    <motion.div
      className="fixed inset-0 z-10 flex flex-col items-center justify-center px-4 md:px-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Background radial */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 50%, rgba(41,197,246,0.08), transparent)',
        }}
      />

      {/* Rings */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: 520,
          height: 520,
          borderRadius: '50%',
          border: '1px solid rgba(41,197,246,0.18)',
          top: '50%',
          left: '50%',
          x: '-50%',
          y: '-50%',
        }}
        animate={{ scale: [1, 1.06, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: 720,
          height: 720,
          borderRadius: '50%',
          border: '1px solid rgba(26,111,255,0.12)',
          top: '50%',
          left: '50%',
          x: '-50%',
          y: '-50%',
        }}
        animate={{ scale: [1, 1.04, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: 920,
          height: 920,
          borderRadius: '50%',
          border: '1px solid rgba(41,197,246,0.07)',
          top: '50%',
          left: '50%',
          x: '-50%',
          y: '-50%',
        }}
        animate={{ scale: [1, 1.03, 1], opacity: [0.2, 0.45, 0.2] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Main content */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-[1600px] flex flex-col items-center"
      >
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center">

          {/* LEFT LOGO */}
          <motion.div
            variants={up}
            className="flex justify-center md:justify-end items-end h-full"
          >
            <div className="relative w-full max-w-[650px] h-[580px]">
              <Image
                src="/media/logo.png"
                alt="logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>

          {/* RIGHT ARTWORK (MOVED UP) */}
          <motion.div
            variants={up}
            className="flex justify-center md:justify-start items-end h-full -mt-12 md:-mt-20"
          >
            <div className="relative w-full max-w-[650px] h-[550px]">
              <Image
                src="/media/logo1122.png"
                alt="artwork"
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>

        </div>

        {/* CTA */}
        <motion.div
          variants={up}
          className="mt-6 lg:mt-10 relative group w-fit mx-auto"
        >
          {/* Stronger glow */}
          <motion.div
            className="absolute -inset-2 rounded-md"
            style={{
              background: 'rgba(41,197,246,0.25)',
              filter: 'blur(12px)',
            }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          <div
            className="relative inline-flex items-center gap-6 px-10 py-5"
            style={{
              border: '2px solid rgba(41,197,246,0.9)',
              background: 'rgba(255,255,255,0.75)',
              backdropFilter: 'blur(18px)',
              boxShadow:
                'inset 0 0 30px rgba(41,197,246,0.2), 0 0 30px rgba(41,197,246,0.25)',
            }}
          >
            {/* Card icon */}
            <div
              className="w-12 h-7 rounded-sm relative shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #29c5f6, #1a6fff)',
              }}
            >
              <div className="absolute top-2 w-full h-[4px] bg-white/40" />
            </div>

            <span
              className="font-black tracking-[0.18em] text-xl md:text-2xl uppercase italic"
              style={{ color: '#0a3a6e' }}
            >
              Vui Lòng CHẠM Thẻ Để Điểm Danh
            </span>

            {/* Corners */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />
          </div>

          {/* 🔥 FIXED SCAN EFFECT */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute top-0 bottom-0"
              style={{
                width: '50%',
                background:
                  'linear-gradient(90deg, transparent, rgba(41,197,246,0.5), transparent)',
              }}
              animate={{ x: ['-120%', '250%'] }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.p
        className="absolute bottom-8 left-0 right-0 text-center tracking-[0.4em] uppercase"
        style={{
          fontSize: '0.9rem',
          fontWeight: 800,
          color: 'rgba(14,80,160,0.75)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        TIÊN PHONG - YÊU NƯỚC - BẢN LĨNH - SÁNG TẠO
      </motion.p>
    </motion.div>
  );
}