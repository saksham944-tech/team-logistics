import React, { useEffect, useRef } from 'react';

export default function ParticleField() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 }); // normalized 0-1

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let frame = 0;

    const handleMouse = (e) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };
    window.addEventListener('mousemove', handleMouse, { passive: true });

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);


    // ── Stars ──────────────────────────────────────────────
    const stars = Array.from({ length: 220 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight * 0.75,
      r: Math.random() * 1.8 + 0.2,
      opacity: Math.random() * 0.6 + 0.2,
      twinkleSpeed: Math.random() * 0.015 + 0.005,
      twinkleDir: Math.random() > 0.5 ? 1 : -1,
      color: ['#ffffff', '#e0d7ff', '#b3e0ff', '#ffd6f5', '#d4f0ff'][Math.floor(Math.random() * 5)],
    }));

    // ── Shooting stars ─────────────────────────────────────
    const shootingStars = Array.from({ length: 4 }, () => ({
      x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 0, active: false, delay: Math.random() * 600,
    }));

    const spawnShooter = (s) => {
      s.x = Math.random() * canvas.width * 0.7;
      s.y = Math.random() * canvas.height * 0.3;
      s.vx = 4 + Math.random() * 5;
      s.vy = 2 + Math.random() * 3;
      s.life = 0;
      s.maxLife = 60 + Math.random() * 40;
      s.active = true;
    };

    // ── Cherry blossoms ────────────────────────────────────
    const petals = Array.from({ length: 30 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight - 100,
      size: Math.random() * 8 + 4,
      vx: (Math.random() - 0.5) * 0.6,
      vy: Math.random() * 0.5 + 0.2,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.04,
      opacity: Math.random() * 0.6 + 0.2,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.025 + 0.01,
      color: ['#ffd6f5', '#ffb3dc', '#f9a8d4', '#e0b3ff', '#c4b5fd'][Math.floor(Math.random() * 5)],
    }));

    // ── Floating orbs ──────────────────────────────────────
    const orbs = Array.from({ length: 7 }, (_, i) => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: 60 + Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      color: ['#7c3aed', '#4f46e5', '#06b6d4', '#ec4899', '#8b5cf6', '#0ea5e9', '#a855f7'][i % 7],
      phase: Math.random() * Math.PI * 2,
    }));

    // ── Aurora bands ───────────────────────────────────────
    const auroraWaves = [
      { y: 0.15, amp: 80, speed: 0.004, color: 'rgba(124,58,237,', opMax: 0.09 },
      { y: 0.25, amp: 60, speed: 0.006, color: 'rgba(6,182,212,', opMax: 0.06 },
      { y: 0.08, amp: 100, speed: 0.003, color: 'rgba(236,72,153,', opMax: 0.05 },
    ];

    // ── Dust motes ─────────────────────────────────────────
    const dust = Array.from({ length: 18 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 2 + 0.5,
      vy: -(Math.random() * 0.3 + 0.1),
      vx: (Math.random() - 0.5) * 0.2,
      opacity: 0,
      maxOp: Math.random() * 0.4 + 0.1,
      life: 0,
      maxLife: Math.random() * 400 + 200,
      color: '#c4b5fd',
    }));

    const drawPetal = (ctx, x, y, size, rot, color, opacity) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.globalAlpha = opacity;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(size * 0.5, -size * 0.5, size, -size * 0.2, size * 0.8, 0);
      ctx.bezierCurveTo(size, size * 0.2, size * 0.5, size * 0.5, 0, 0);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.restore();
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      // Aurora
      auroraWaves.forEach(w => {
        const gradient = ctx.createLinearGradient(0, canvas.height * w.y - 120, 0, canvas.height * w.y + 120);
        const op = w.opMax * (0.5 + 0.5 * Math.sin(frame * w.speed));
        gradient.addColorStop(0, `${w.color}0)`);
        gradient.addColorStop(0.5, `${w.color}${op})`);
        gradient.addColorStop(1, `${w.color}0)`);

        ctx.beginPath();
        ctx.moveTo(0, canvas.height * w.y);
        for (let xi = 0; xi <= canvas.width; xi += 8) {
          const yOffset = Math.sin(xi * 0.006 + frame * w.speed * 5) * w.amp;
          ctx.lineTo(xi, canvas.height * w.y + yOffset);
        }
        ctx.lineTo(canvas.width, canvas.height * w.y + 200);
        ctx.lineTo(0, canvas.height * w.y + 200);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      // Orbs — with mouse parallax
      const mx = mouseRef.current.x - 0.5; // -0.5 to 0.5
      const my = mouseRef.current.y - 0.5;
      orbs.forEach(o => {
        o.x += o.vx;
        o.y += o.vy;
        o.phase += 0.008;
        if (o.x < -o.r * 2) o.x = canvas.width + o.r;
        if (o.x > canvas.width + o.r * 2) o.x = -o.r;
        if (o.y < -o.r * 2) o.y = canvas.height + o.r;
        if (o.y > canvas.height + o.r * 2) o.y = -o.r;

        // parallax offset — deeper orbs move more
        const depth = (o.r - 60) / 100; // 0–1
        const px = o.x - mx * 25 * (depth + 0.5);
        const py = o.y - my * 25 * (depth + 0.5);

        const pulseR = o.r * (0.95 + 0.05 * Math.sin(o.phase));
        const grad = ctx.createRadialGradient(px, py, 0, px, py, pulseR);
        grad.addColorStop(0, o.color + '40');
        grad.addColorStop(0.5, o.color + '18');
        grad.addColorStop(1, o.color + '00');
        ctx.beginPath();
        ctx.arc(px, py, pulseR, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      // Stars
      stars.forEach(s => {
        s.opacity += s.twinkleSpeed * s.twinkleDir;
        if (s.opacity > 0.9 || s.opacity < 0.1) s.twinkleDir *= -1;
        const hex = Math.floor(s.opacity * 255).toString(16).padStart(2, '0');
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.color + hex;
        ctx.fill();
        // Star cross sparkle for large stars
        if (s.r > 1.4 && s.opacity > 0.7) {
          ctx.save();
          ctx.globalAlpha = (s.opacity - 0.7) * 0.4;
          ctx.strokeStyle = s.color;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(s.x - s.r * 3, s.y);
          ctx.lineTo(s.x + s.r * 3, s.y);
          ctx.moveTo(s.x, s.y - s.r * 3);
          ctx.lineTo(s.x, s.y + s.r * 3);
          ctx.stroke();
          ctx.restore();
        }
      });

      // Shooting stars
      shootingStars.forEach(s => {
        if (!s.active) {
          s.delay--;
          if (s.delay <= 0) { spawnShooter(s); s.delay = Math.random() * 400 + 200; }
          return;
        }
        s.life++;
        const progress = s.life / s.maxLife;
        const tailLen = 120 * Math.min(progress * 3, 1);
        const op = progress < 0.2 ? progress / 0.2 : progress > 0.7 ? (1 - progress) / 0.3 : 1;

        const grad = ctx.createLinearGradient(s.x - s.vx * tailLen / s.vx, s.y - s.vy * tailLen / s.vx, s.x, s.y);
        grad.addColorStop(0, `rgba(255,255,255,0)`);
        grad.addColorStop(1, `rgba(255,255,255,${op * 0.9})`);

        ctx.save();
        ctx.globalAlpha = op;
        ctx.beginPath();
        ctx.moveTo(s.x - s.vx * (tailLen / 5), s.y - s.vy * (tailLen / 5));
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = '#c4b5fd';
        ctx.shadowBlur = 6;
        ctx.stroke();
        ctx.restore();

        s.x += s.vx;
        s.y += s.vy;
        if (s.life >= s.maxLife) s.active = false;
      });

      // Cherry blossom petals
      petals.forEach(p => {
        p.wobble += p.wobbleSpeed;
        p.rot += p.rotV;
        p.y += p.vy;
        p.x += p.vx + Math.sin(p.wobble) * 0.5;

        if (p.y > canvas.height + 30) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
        drawPetal(ctx, p.x, p.y, p.size, p.rot, p.color, p.opacity);
      });

      // Dust motes
      dust.forEach(d => {
        d.life++;
        if (d.life > d.maxLife) {
          d.x = Math.random() * canvas.width;
          d.y = canvas.height + 20;
          d.life = 0;
        }
        const prog = d.life / d.maxLife;
        d.opacity = prog < 0.2 ? (prog / 0.2) * d.maxOp
          : prog > 0.7 ? ((1 - prog) / 0.3) * d.maxOp
          : d.maxOp;
        d.y += d.vy;
        d.x += d.vx;

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(196,181,253,${d.opacity})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  );
}
