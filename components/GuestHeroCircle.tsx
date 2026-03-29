'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function GuestHeroCircle({
    name,
    photoUrl,
}: {
    name: string;
    photoUrl?: string;
}) {
    return (
        <div className="relative flex flex-col items-center">

            {/* HUD circles (background decor) */}
            <div className="absolute inset-[-80px] opacity-30 pointer-events-none">
                <div className="absolute left-0 top-1/2 w-32 h-32 border border-cyan-300 rounded-full animate-spin-slow" />
                <div className="absolute right-0 bottom-0 w-24 h-24 border border-blue-300 rounded-full animate-spin-slow-reverse" />
            </div>

            {/* MAIN CIRCLE */}
            <div className="relative">

                {/* Outer glow */}
                <motion.div
                    className="absolute inset-[-18px] rounded-full border border-cyan-300/40"
                    animate={{ scale: [1, 1.06, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 3, repeat: Infinity }}
                />

                {/* Rotating ring */}
                <motion.div
                    className="absolute inset-[-28px] rounded-full border-2 border-cyan-400/50"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
                />

                {/* Avatar */}
                <div className="relative w-60 h-60 rounded-full overflow-hidden border-4 border-cyan-300 shadow-[0_0_40px_rgba(0,255,255,0.5)]">
                    {photoUrl ? (
                        <Image
                            src={photoUrl}
                            alt={name}
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl bg-[#03122e]">
                            👤
                        </div>
                    )}
                </div>
            </div>

            {/* Name under circle (optional, you can remove if duplicate) */}
            <p className="mt-4 text-sm text-cyan-300 tracking-wide opacity-80">
                Đại biểu
            </p>

            {/* Animations */}
            <style>{`
        .animate-spin-slow {
          animation: spin 18s linear infinite;
        }
        .animate-spin-slow-reverse {
          animation: spin 22s linear infinite reverse;
        }
      `}</style>
        </div>
    );
}