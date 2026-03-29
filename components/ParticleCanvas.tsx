'use client';
// ── components/ParticleCanvas.tsx ─────────────────────────────

import { useEffect, useRef } from 'react';

interface Particle {
  x: number; y: number;
  r: number; speed: number;
  angle: number; alpha: number;
  color: 'cyan' | 'gold';
  drift: number;
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    let W = 0, H = 0;
    const particles: Particle[] = [];
    let raf: number;

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const mkParticle = (): Particle => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.6 + 0.3,
      speed: Math.random() * 0.5 + 0.1,
      angle: Math.random() * Math.PI * 2,
      alpha: Math.random() * 0.55 + 0.15,
      color: Math.random() > 0.72 ? 'gold' : 'cyan',
      drift: (Math.random() - 0.5) * 0.008,
    });

    for (let i = 0; i < 140; i++) particles.push(mkParticle());

    const loop = () => {
      ctx.clearRect(0, 0, W, H);

      // Deep gradient base
      const g = ctx.createRadialGradient(W / 2, H * 0.55, 0, W / 2, H / 2, Math.max(W, H) * 0.75);
      g.addColorStop(0, 'rgba(0,20,70,0.95)');
      g.addColorStop(0.5, 'rgba(2,10,35,0.97)');
      g.addColorStop(1, 'rgba(1,5,18,1)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      for (const p of particles) {
        p.y -= p.speed;
        p.angle += p.drift;
        p.x += Math.sin(p.angle) * 0.4;
        if (p.y < -4) { Object.assign(p, mkParticle(), { y: H + 4 }); }

        const rgba = p.color === 'cyan'
          ? `rgba(0,210,255,${p.alpha})`
          : `rgba(245,200,66,${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = rgba;
        ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
}
