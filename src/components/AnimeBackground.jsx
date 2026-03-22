import React from 'react';

/* ─────────────────────────────────────────────────────────────
   AnimeBackground — uses AI-generated Makoto Shinkai-style
   sunset image as the app background, with a layered gradient
   overlay that keeps UI panels readable while showing the art.
   ───────────────────────────────────────────────────────────── */
export default function AnimeBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >

      {/* ── 1. The anime artwork image ────────────────────────── */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(/anime-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center bottom',
        backgroundRepeat: 'no-repeat',
      }} />

      {/* ── 2. Gradient overlay — keeps upper UI readable but lets
             the anime scene breathe through                      */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          linear-gradient( 
            to bottom,
            rgba(4, 4, 18, 0.70) 0%,
            rgba(8, 6, 28, 0.55) 20%,
            rgba(10, 6, 30, 0.40) 40%,
            rgba(8, 4, 20, 0.25) 60%,
            rgba(6, 3, 14, 0.12) 78%,
            rgba(4, 2, 10, 0.05) 100%
          )
        `,
      }} />

      {/* ── 3. Side vignette — edges are darker for depth ──────── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(
            ellipse 80% 100% at 50% 50%,
            transparent 30%,
            rgba(0, 0, 8, 0.55) 100%
          )
        `,
      }} />

      {/* ── 4. Subtle purple-tint bloom at top-left ────────────── */}
      <div style={{
        position: 'absolute',
        top: -80, left: -80,
        width: 600, height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(80,40,160,0.18) 0%, transparent 70%)',
        filter: 'blur(40px)',
        animation: 'pulse-glow-soft 8s ease-in-out infinite',
      }} />

      {/* ── 5. Amber glow bloom at bottom-right ────────────────── */}
      <div style={{
        position: 'absolute',
        bottom: -60, right: -60,
        width: 500, height: 350,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(180,80,20,0.15) 0%, transparent 70%)',
        filter: 'blur(40px)',
        animation: 'pulse-glow-soft 10s ease-in-out infinite',
        animationDelay: '3s',
      }} />

    </div>
  );
}
