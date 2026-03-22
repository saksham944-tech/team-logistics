import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';

// ── Cinematic Radial Meter ─────────────────────────────────────
const RadialMeter = ({ value, color, label, emoji, size = 140 }) => {
  const [displayed, setDisplayed] = useState(0);
  const r = 50;
  const strokeW = 9;
  const circ = 2 * Math.PI * r;
  const filled = (displayed / 100) * circ;

  useEffect(() => {
    let start = null;
    const duration = 1400;
    const easeOut = t => 1 - Math.pow(1 - t, 3);
    const animate = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setDisplayed(Math.round(easeOut(p) * value));
      if (p < 1) requestAnimationFrame(animate);
    };
    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, [value]);

  const cx = size / 2, cy = size / 2;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
          <defs>
            {/* Outer glow */}
            <filter id={`glow-outer-${label}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur1" />
              <feMerge><feMergeNode in="blur1" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            {/* Soft inner shadow for track */}
            <filter id={`shadow-track-${label}`}>
              <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor={color} floodOpacity="0.15" />
            </filter>
            {/* Gradient for progress arc */}
            <linearGradient id={`grad-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.7" />
              <stop offset="100%" stopColor={color} />
            </linearGradient>
          </defs>

          {/* Outer halo ring */}
          <circle cx={cx} cy={cy} r={r + 7} fill="none"
            stroke={color} strokeWidth="1" strokeOpacity="0.1"
            strokeDasharray="4 6" />

          {/* Track bg */}
          <circle cx={cx} cy={cy} r={r} fill="none"
            stroke="rgba(255,255,255,0.045)" strokeWidth={strokeW}
            filter={`url(#shadow-track-${label})`} />

          {/* Progress arc */}
          <circle cx={cx} cy={cy} r={r} fill="none"
            stroke={`url(#grad-${label})`} strokeWidth={strokeW}
            strokeLinecap="round"
            strokeDasharray={`${filled} ${circ}`}
            filter={`url(#glow-outer-${label})`}
          />

          {/* Bright dot at progress tip */}
          {displayed > 3 && (() => {
            const angle = (filled / circ) * 2 * Math.PI - Math.PI / 2;
            const tx = cx + r * Math.cos(angle);
            const ty = cy + r * Math.sin(angle);
            return (
              <circle cx={tx} cy={ty} r={strokeW / 2 + 1}
                fill={color}
                filter={`url(#glow-outer-${label})`}
                style={{ transform: 'rotate(90deg)', transformOrigin: `${cx}px ${cy}px` }}
              />
            );
          })()}
        </svg>

        {/* Center content */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 2,
        }}>
          <span style={{ fontSize: '1.5rem', filter: `drop-shadow(0 0 8px ${color}80)` }}>{emoji}</span>
          <span style={{
            fontSize: '1.25rem', fontWeight: 900, fontFamily: 'var(--font-ui)',
            color, textShadow: `0 0 16px ${color}80`,
          }}>{displayed}%</span>
        </div>

        {/* Pulsing halo */}
        <div style={{
          position: 'absolute', inset: 8,
          borderRadius: '50%',
          boxShadow: `0 0 0 1px ${color}20, 0 0 20px ${color}18`,
          animation: 'halo-pulse 3s ease-in-out infinite',
          animationDelay: `${Math.random() * 1.5}s`,
          pointerEvents: 'none',
        }} />
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{label}</div>
        <div style={{
          width: 32, height: 3, borderRadius: 99, margin: '0 auto',
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        }} />
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass-card-sm" style={{ padding: '12px 16px', border: '1px solid rgba(124,58,237,0.3)' }}>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 6 }}>{label}</p>
        {payload.map(p => (
          <p key={p.name} style={{ fontSize: '0.85rem', color: p.color, fontWeight: 600 }}>
            {p.name}: {p.value}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function EmotionHub() {
  const { emotions, moodHistory } = useApp();
  const [timeRange, setTimeRange] = useState('week');

  const radarData = [
    { subject: 'Calm', value: 100 - emotions.anxiety },
    { subject: 'Focus', value: emotions.focus },
    { subject: 'Energy', value: emotions.energy },
    { subject: 'Happiness', value: emotions.mood_score },
    { subject: 'Resilience', value: 75 },
    { subject: 'Motivation', value: 65 },
  ];

  const insights = [
    {
      icon: '📚',
      title: 'Study Workload Peak',
      desc: 'Your stress spikes on Tuesday and Thursday — likely exam or assignment days.',
      type: 'warning',
      color: '#fb923c',
    },
    {
      icon: '🌿',
      title: 'Weekend Recovery',
      desc: 'Great pattern! Your focus and calm levels recover significantly on weekends.',
      type: 'positive',
      color: '#34d399',
    },
    {
      icon: '😰',
      title: 'Anxiety Trigger Detected',
      desc: 'You seem stressed due to academic pressure. Consider a short mindfulness session.',
      type: 'alert',
      color: '#f87171',
    },
    {
      icon: '🌙',
      title: 'Sleep Impact',
      desc: 'Low energy on Friday correlates with poor sleep patterns mid-week.',
      type: 'info',
      color: '#a78bfa',
    },
  ];

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 4 }}>
            🧠 Emotion Hub
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Real-time emotional intelligence powered by AI
          </p>
        </div>
        <div className="glass-card-sm" style={{
          display: 'flex', overflow: 'hidden', padding: 4,
        }}>
          {['week', 'month'].map(t => (
            <button key={t} onClick={() => setTimeRange(t)}
              style={{
                padding: '6px 16px', borderRadius: 10, border: 'none',
                background: timeRange === t ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'transparent',
                color: timeRange === t ? 'white' : 'var(--text-muted)',
                cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
                transition: 'all 0.3s',
              }}
              id={`range-${t}`}
            >
              {t === 'week' ? 'This Week' : 'This Month'}
            </button>
          ))}
        </div>
      </div>

      {/* Radial meters panel — cinematic */}
      <div style={{
        borderRadius: 24, marginBottom: 24,
        background: 'rgba(255,255,255,0.02)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(124,58,237,0.18)',
        boxShadow: '0 0 60px rgba(124,58,237,0.08), 0 8px 40px rgba(0,0,0,0.35)',
        overflow: 'hidden',
        animation: 'cinematic-fade 0.5s ease both',
      }}>
        {/* Panel header */}
        <div style={{
          padding: '20px 28px 16px',
          background: 'linear-gradient(90deg, rgba(124,58,237,0.12) 0%, rgba(6,182,212,0.06) 50%, transparent 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'rgba(124,58,237,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.2rem',
              boxShadow: '0 0 16px rgba(124,58,237,0.3)',
            }}>📊</div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 2 }}>Emotional State Monitor</h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Live AI-powered emotional analysis</p>
            </div>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '4px 12px', borderRadius: 999,
            background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)',
            fontSize: '0.7rem', fontWeight: 700, color: '#34d399',
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 6px #34d399', animation: 'pulse-glow-soft 2s ease-in-out infinite' }} />
            Real-time
          </div>
        </div>

        {/* Meters */}
        <div style={{
          padding: '32px 28px',
          display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 32,
          background: 'radial-gradient(ellipse at 50% 100%, rgba(124,58,237,0.06) 0%, transparent 70%)',
        }}>
          <RadialMeter value={emotions.stress} color="#f87171" label="Stress" emoji="😤" />
          <RadialMeter value={emotions.anxiety} color="#fb923c" label="Anxiety" emoji="😰" />
          <RadialMeter value={emotions.focus} color="#34d399" label="Focus" emoji="🎯" />
          <RadialMeter value={emotions.energy} color="#fbbf24" label="Energy" emoji="⚡" />
          <RadialMeter value={emotions.mood_score} color="#c4b5fd" label="Mood" emoji="🌸" />
        </div>
      </div>

      {/* Charts row */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Area chart */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div className="section-header">
            <div className="section-icon" style={{ background: 'rgba(56,189,248,0.15)' }}>📈</div>
            <h3 style={{ fontSize: '1rem' }}>Weekly Trend</h3>
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={moodHistory} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradStress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f87171" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradFocus" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradAnxiety" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fb923c" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#fb923c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="stress" name="Stress" stroke="#f87171" fill="url(#gradStress)" strokeWidth={2} dot={{ fill: '#f87171', r: 3 }} />
                <Area type="monotone" dataKey="anxiety" name="Anxiety" stroke="#fb923c" fill="url(#gradAnxiety)" strokeWidth={2} dot={{ fill: '#fb923c', r: 3 }} />
                <Area type="monotone" dataKey="focus" name="Focus" stroke="#34d399" fill="url(#gradFocus)" strokeWidth={2} dot={{ fill: '#34d399', r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
            {[{ color: '#f87171', label: 'Stress' }, { color: '#fb923c', label: 'Anxiety' }, { color: '#34d399', label: 'Focus' }].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.color, boxShadow: `0 0 6px ${l.color}` }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Radar */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div className="section-header">
            <div className="section-icon" style={{ background: 'rgba(167,139,250,0.15)' }}>🎯</div>
            <h3 style={{ fontSize: '1rem' }}>Wellness Radar</h3>
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.06)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
                <Radar name="Emotional State" dataKey="value"
                  stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.2}
                  dot={{ fill: '#c4b5fd', r: 3 }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Insights — cinematic */}
      <div style={{
        borderRadius: 24, padding: '24px 28px',
        background: 'rgba(255,255,255,0.02)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(251,191,36,0.15)',
        animation: 'cinematic-fade 0.6s ease 0.3s both',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12, fontSize: '1.2rem',
            background: 'rgba(251,191,36,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 16px rgba(251,191,36,0.2)',
          }}>🤖</div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 2 }}>AI Emotional Insights</h3>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Patterns Buddy detected this week</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px,1fr))', gap: 14 }}>
          {insights.map((ins, i) => (
            <div key={i} style={{
              padding: '18px 16px', borderRadius: 18,
              background: `${ins.color}06`,
              border: `1px solid ${ins.color}20`,
              borderLeft: `3px solid ${ins.color}`,
              transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
              cursor: 'default',
              animation: `cinematic-fade 0.5s ease ${i * 0.1 + 0.4}s both`,
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px) scale(1.01)';
                e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.3), 0 0 20px ${ins.color}15`;
                e.currentTarget.style.borderColor = `${ins.color}45`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = `${ins.color}20`;
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={{ fontSize: '1.5rem', flexShrink: 0, filter: `drop-shadow(0 0 6px ${ins.color}60)` }}>{ins.icon}</span>
                <div>
                  <p style={{ fontSize: '0.87rem', fontWeight: 800, color: ins.color, marginBottom: 5 }}>{ins.title}</p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{ins.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
