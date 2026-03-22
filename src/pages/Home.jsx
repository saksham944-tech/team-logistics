import React, { useState, useEffect, useRef } from 'react';
import { useApp, moodList } from '../context/AppContext';
import { ArrowRight, Sparkles, Wind, Zap } from 'lucide-react';

const timeGreeting = () => {
  const h = new Date().getHours();
  if (h < 5)  return { text: 'Still awake?', sub: 'Late nights can be heavy. Buddy is here.' };
  if (h < 12) return { text: 'Good Morning', sub: 'A new day, a fresh beginning.' };
  if (h < 17) return { text: 'Good Afternoon', sub: 'How has your day been so far?' };
  if (h < 21) return { text: 'Good Evening', sub: 'Let\'s wind down together.' };
  return { text: 'Good Night', sub: 'Rest is healing. I\'m here if you need to talk.' };
};

const moodData = {
  happy: {
    insight: "You're radiating something beautiful today ✨ Hold onto this energy — it's real and it's yours.",
    companionMood: '✨', companionBg: 'linear-gradient(135deg, rgba(52,211,153,0.3), rgba(56,189,248,0.2))',
    aura: '#34d399', poem: '"Like morning light through autumn leaves —\nyour joy lights up every corner."',
  },
  calm: {
    insight: 'A still lake reflects the stars perfectly 🌙 Your calm mind is your greatest strength right now.',
    companionMood: '🌙', companionBg: 'linear-gradient(135deg, rgba(56,189,248,0.3), rgba(124,58,237,0.2))',
    aura: '#38bdf8', poem: '"In the silence between heartbeats,\nthere is peace waiting for you."',
  },
  anxious: {
    insight: 'That fluttering feeling in your chest is just your mind asking for attention 🌿 Let\'s breathe through it together.',
    companionMood: '🫂', companionBg: 'linear-gradient(135deg, rgba(251,146,60,0.25), rgba(196,181,253,0.2))',
    aura: '#fb923c', poem: '"Even the stormiest seas\nfind their way back to shore."',
  },
  stressed: {
    insight: 'I see you carrying a lot right now 💜 You don\'t have to carry it alone. One breath, one step.',
    companionMood: '💜', companionBg: 'linear-gradient(135deg, rgba(248,113,113,0.2), rgba(124,58,237,0.2))',
    aura: '#f87171', poem: '"Mountains are climbed one step at a time.\nYou are stronger than you know."',
  },
  tired: {
    insight: 'Exhaustion is your body sending a message 🌙 Rest isn\'t giving up — it\'s how you come back stronger.',
    companionMood: '🌸', companionBg: 'linear-gradient(135deg, rgba(167,139,250,0.25), rgba(79,70,229,0.2))',
    aura: '#a78bfa', poem: '"Stars don\'t shine without darkness.\nYour rest is sacred."',
  },
};

const quickActions = [
  { id: 'breathe', icon: '🌿', label: 'Breathe', desc: '4-7-8 Technique', color: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.3)', glow: '#34d399', page: 'wellness' },
  { id: 'journal', icon: '📔', label: 'Journal', desc: 'Release & Reflect', color: 'rgba(196,181,253,0.12)', border: 'rgba(196,181,253,0.3)', glow: '#c4b5fd', page: 'wellness' },
  { id: 'music',  icon: '🎵', label: 'Lo-Fi',   desc: 'Calm your mind', color: 'rgba(56,189,248,0.12)', border: 'rgba(56,189,248,0.3)',   glow: '#38bdf8', page: 'wellness' },
  { id: 'mood',   icon: '🧠', label: 'Insights', desc: 'Emotion patterns', color: 'rgba(251,146,60,0.12)', border: 'rgba(251,146,60,0.3)', glow: '#fb923c', page: 'emotions' },
];

// Sakura petal component
function SakuraPetal({ style }) {
  return (
    <div style={{
      position: 'absolute',
      width: 8, height: 10,
      background: 'radial-gradient(ellipse, #ffd6f5 0%, #f9a8d4 60%, transparent 100%)',
      borderRadius: '50% 0 50% 0',
      animation: `sakura-fall ${3 + Math.random() * 4}s ease-in-out infinite`,
      animationDelay: `${Math.random() * 5}s`,
      opacity: 0,
      ...style,
    }} />
  );
}

// Orbit dot
function OrbitDot({ color, size, orbitR, duration, delay }) {
  return (
    <div style={{
      position: 'absolute',
      top: '50%', left: '50%',
      width: size, height: size,
      borderRadius: '50%',
      background: color,
      boxShadow: `0 0 ${size * 2}px ${color}`,
      marginTop: -size / 2, marginLeft: -size / 2,
      '--orbit-r': `${orbitR}px`,
      animation: `orbit ${duration}s linear infinite`,
      animationDelay: `${delay}s`,
    }} />
  );
}

export default function Home() {
  const { currentMood, setMood, streak, setActivePage, userName, emotions } = useApp();
  const [moodPop, setMoodPop] = useState(null);
  const [showPoem, setShowPoem] = useState(false);

  const moody = moodList.find(m => m.id === currentMood) || moodList[1];
  const md = moodData[currentMood] || moodData.calm;
  const greeting = timeGreeting();

  useEffect(() => {
    const t = setTimeout(() => setShowPoem(true), 600);
    return () => clearTimeout(t);
  }, []);

  const handleMoodClick = (moodId) => {
    setMoodPop(moodId);
    setMood(moodId);
    setTimeout(() => setMoodPop(null), 500);
  };

  return (
    <div className="page-container">

      {/* ── CINEMATIC HERO ─────────────────────────────────── */}
      <div style={{
        position: 'relative',
        borderRadius: 28,
        overflow: 'hidden',
        marginBottom: 24,
        background: `linear-gradient(135deg, rgba(8,7,20,0.9) 0%, rgba(13,11,42,0.85) 100%)`,
        border: `1px solid ${md.aura}30`,
        boxShadow: `0 0 60px ${md.aura}18, 0 24px 64px rgba(0,0,0,0.5)`,
        minHeight: 340,
        animation: 'hero-entrance 0.7s cubic-bezier(0.4,0,0.2,1) both',
      }}>
        {/* Animated inner glow backdrop */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse at 80% 30%, ${md.aura}22 0%, transparent 60%),
                       radial-gradient(ellipse at 10% 80%, rgba(124,58,237,0.15) 0%, transparent 50%)`,
          transition: 'background 0.8s ease',
        }} />
        {/* Scanline texture */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 4px)',
          pointerEvents: 'none',
        }} />

        {/* Floating sakura petals inside hero */}
        {[...Array(8)].map((_, i) => (
          <SakuraPetal key={i} style={{
            left: `${10 + i * 12}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.7}s`,
          }} />
        ))}

        <div style={{
          position: 'relative', zIndex: 2,
          padding: '36px 40px',
          display: 'flex', alignItems: 'center', gap: 40, flexWrap: 'wrap',
        }}>

          {/* Left — Text */}
          <div style={{ flex: 1, minWidth: 240 }}>
            {/* Day badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '5px 14px', borderRadius: 999, marginBottom: 18,
              background: `${md.aura}18`,
              border: `1px solid ${md.aura}40`,
              fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em',
              color: md.aura,
            }}>
              <Sparkles size={11} />
              {new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>

            {/* Greeting */}
            <div style={{ marginBottom: 6, fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              {greeting.sub}
            </div>
            <h1 style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
              fontWeight: 900,
              lineHeight: 1.15,
              marginBottom: 16,
              letterSpacing: '-0.01em',
            }}>
              {greeting.text},<br />
              <span style={{
                background: `linear-gradient(135deg, #f1f0ff 0%, ${md.aura} 40%, #c4b5fd 80%, #38bdf8 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                backgroundSize: '200% auto',
                animation: 'text-shimmer 4s linear infinite',
              }}>{userName}</span>
              <span style={{ WebkitTextFillColor: 'initial' }}> 🌸</span>
            </h1>

            {/* Insight line */}
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '0.95rem',
              lineHeight: 1.7,
              maxWidth: 420,
              marginBottom: 8,
            }}>
              {md.insight}
            </p>

            {/* Poem */}
            {showPoem && (
              <div style={{
                marginBottom: 24, padding: '12px 18px',
                borderLeft: `3px solid ${md.aura}60`,
                animation: 'cinematic-fade 1s ease both',
              }}>
                <p style={{
                  fontSize: '0.82rem',
                  fontStyle: 'italic',
                  color: md.aura,
                  lineHeight: 1.8,
                  whiteSpace: 'pre-line',
                  opacity: 0.85,
                }}>{md.poem}</p>
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary"
                onClick={() => setActivePage('chat')}
                id="talk-to-buddy-btn"
                style={{
                  boxShadow: `0 6px 28px ${md.aura}40`,
                  background: `linear-gradient(135deg, var(--primary), ${md.aura === '#34d399' ? '#0ea5e9' : md.aura === '#38bdf8' ? '#4f46e5' : 'var(--secondary)'})`,
                }}
              >
                <span>💬</span> Talk to Buddy
              </button>
              <button className="btn btn-ghost" onClick={() => setActivePage('emotions')} id="view-emotions-btn">
                <span>🧠</span> View Emotions
              </button>
            </div>
          </div>

          {/* Right — Anime companion */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
            animation: 'hero-entrance-right 0.8s cubic-bezier(0.4,0,0.2,1) 0.2s both',
          }}>
            {/* Companion orb with orbit system */}
            <div style={{ position: 'relative', width: 180, height: 180 }}>
              {/* Orbit rings */}
              {[{ r: 82, dur: 8, delay: 0, color: `${md.aura}80`, size: 6 },
                { r: 72, dur: 12, delay: -4, color: 'rgba(236,72,153,0.8)', size: 4 },
                { r: 90, dur: 6, delay: -2, color: 'rgba(196,181,253,0.7)', size: 3 }].map((o, i) => (
                <OrbitDot key={i} {...o} />
              ))}

              {/* Ring glow */}
              <div style={{
                position: 'absolute', inset: 10,
                borderRadius: '50%',
                border: `1px solid ${md.aura}30`,
                animation: 'halo-pulse 3s ease-in-out infinite',
              }} />
              <div style={{
                position: 'absolute', inset: 22,
                borderRadius: '50%',
                border: `1px dashed ${md.aura}20`,
                animation: 'spin-slow 20s linear infinite',
              }} />

              {/* Main avatar */}
              <div style={{
                position: 'absolute', inset: 20,
                borderRadius: '50%',
                background: md.companionBg,
                backdropFilter: 'blur(12px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '3.8rem',
                border: `2px solid ${md.aura}40`,
                boxShadow: `inset 0 0 30px ${md.aura}20, 0 0 40px ${md.aura}30`,
                animation: 'companion-appear 0.9s cubic-bezier(0.4,0,0.2,1) 0.3s both, avatar-breathe 5s ease-in-out 1.5s infinite',
                transition: 'background 0.8s ease, border-color 0.8s ease',
              }}>
                {md.companionMood}
              </div>
            </div>

            {/* Companion name + status */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '1rem', fontWeight: 800,
                fontFamily: 'var(--font-ui)',
                background: `linear-gradient(135deg, #c4b5fd, ${md.aura})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: 4,
              }}>Buddy</div>
              <div style={{
                fontSize: '0.73rem', color: '#34d399',
                display: 'flex', alignItems: 'center', gap: 5,
                justifyContent: 'center',
              }}>
                <div style={{
                  width: 6, height: 6, borderRadius: '50%', background: '#34d399',
                  boxShadow: '0 0 6px #34d399',
                  animation: 'pulse-glow-soft 2s ease-in-out infinite',
                }} />
                Online · Your AI Companion
              </div>
            </div>

            {/* Mood insight pill */}
            <div style={{
              padding: '10px 16px', borderRadius: 14,
              background: `${md.aura}12`,
              border: `1px solid ${md.aura}30`,
              fontSize: '0.78rem',
              color: md.aura,
              fontWeight: 600,
              textAlign: 'center',
              maxWidth: 160,
              lineHeight: 1.4,
            }}>
              {moody.emoji} Feeling {moody.label}
            </div>
          </div>
        </div>
      </div>

      {/* ── CINEMATIC MOOD SELECTOR ─────────────────────────── */}
      <div style={{
        borderRadius: 24, padding: '24px 28px', marginBottom: 24,
        background: 'rgba(255,255,255,0.025)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'rgba(236,72,153,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.2rem',
            animation: 'heart-beat 2.5s ease-in-out infinite',
          }}>❤️</div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>How are you feeling right now?</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tap a mood — Buddy responds to you</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
          {moodList.map(m => {
            const isSelected = currentMood === m.id;
            const isPop = moodPop === m.id;
            return (
              <button
                key={m.id}
                onClick={() => handleMoodClick(m.id)}
                id={`mood-${m.id}`}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                  padding: '20px 8px',
                  borderRadius: 20,
                  border: isSelected ? `1.5px solid ${m.color}70` : '1px solid rgba(255,255,255,0.06)',
                  background: isSelected
                    ? `radial-gradient(ellipse at 50% 30%, ${m.colorBg}, rgba(8,7,20,0.8))`
                    : 'rgba(255,255,255,0.025)',
                  cursor: 'pointer',
                  transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: isSelected ? `0 0 20px ${m.color}25, 0 8px 24px rgba(0,0,0,0.3)` : '0 2px 8px rgba(0,0,0,0.2)',
                  transform: isPop ? 'scale(1.2)' : isSelected ? 'translateY(-4px)' : 'translateY(0)',
                }}
              >
                {/* Inner shimmer on selected */}
                {isSelected && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: `linear-gradient(135deg, ${m.color}08 0%, transparent 60%)`,
                    borderRadius: 'inherit',
                  }} />
                )}

                <span style={{
                  fontSize: '2.2rem', lineHeight: 1,
                  animation: isSelected ? 'bounce-soft 1.5s ease-in-out infinite' : 'none',
                  filter: isSelected ? `drop-shadow(0 0 8px ${m.color})` : 'none',
                  transition: 'filter 0.3s',
                }}>
                  {m.emoji}
                </span>
                <span style={{
                  fontSize: '0.73rem', fontWeight: 700,
                  color: isSelected ? m.color : 'var(--text-muted)',
                  transition: 'color 0.3s',
                  letterSpacing: '0.02em',
                }}>
                  {m.label}
                </span>

                {isSelected && (
                  <div style={{
                    width: 4, height: 4, borderRadius: '50%',
                    background: m.color,
                    boxShadow: `0 0 8px ${m.color}`,
                    animation: 'pulse-glow-soft 1.5s ease-in-out infinite',
                  }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── STATS ROW ──────────────────────────────────────── */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { icon: '📊', label: 'Mood Score', value: `${emotions.mood_score}%`, color: '#c4b5fd', c1: 'var(--primary)', c2: 'var(--accent-cyan)', badge: 'Today' },
          { icon: '🎯', label: 'Focus Level', value: `${emotions.focus}%`, color: '#34d399', c1: '#34d399', c2: '#06b6d4', badge: 'Focus' },
          { icon: '😰', label: 'Stress Level', value: `${emotions.stress}%`, color: '#fb923c', c1: '#fb923c', c2: '#f87171', badge: 'Alert' },
          { icon: '🔥', label: 'Day Streak', value: streak, sub: '🌸', color: '#fbbf24', c1: '#fbbf24', c2: '#f97316', badge: 'Streak' },
        ].map((s, idx) => (
          <div key={s.label} style={{
            padding: '22px 20px', borderRadius: 22,
            background: 'rgba(255,255,255,0.025)',
            backdropFilter: 'blur(16px)',
            border: `1px solid ${s.color}18`,
            transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
            animation: `cinematic-fade 0.6s ease ${idx * 0.1 + 0.4}s both`,
            cursor: 'default',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = `0 16px 40px rgba(0,0,0,0.4), 0 0 30px ${s.color}18`;
              e.currentTarget.style.borderColor = `${s.color}35`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = `${s.color}18`;
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
              <span style={{ fontSize: '1.6rem' }}>{s.icon}</span>
              <span style={{
                fontSize: '0.62rem', fontWeight: 700, padding: '3px 10px',
                borderRadius: 999, background: `${s.color}15`,
                border: `1px solid ${s.color}30`, color: s.color,
              }}>{s.badge}</span>
            </div>
            <div style={{
              fontFamily: 'var(--font-ui)', fontSize: '2.1rem', fontWeight: 800, lineHeight: 1,
              marginBottom: 4,
              background: `linear-gradient(135deg, ${s.c1}, ${s.c2})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>{s.value}{s.sub}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 12 }}>{s.label}</div>
            <div style={{
              height: 5, borderRadius: 99,
              background: 'rgba(255,255,255,0.05)',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', borderRadius: 99,
                width: typeof s.value === 'string' ? s.value : `${Math.min(s.value * 10, 100)}%`,
                background: `linear-gradient(90deg, ${s.c1}, ${s.c2})`,
                boxShadow: `0 0 8px ${s.c1}60`,
                animation: 'progress-fill 1.4s cubic-bezier(0.4,0,0.2,1) both',
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* ── QUICK ACTIONS + AFFIRMATION ─────────────────────── */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Quick actions */}
        <div style={{
          borderRadius: 24, padding: '24px',
          background: 'rgba(255,255,255,0.025)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 11,
              background: 'rgba(56,189,248,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem',
            }}><Zap size={18} color="#38bdf8" /></div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Quick Actions</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {quickActions.map(a => (
              <button key={a.id}
                id={`quick-${a.id}`}
                onClick={() => setActivePage(a.page)}
                style={{
                  padding: '16px 14px', borderRadius: 16,
                  background: a.color, border: `1px solid ${a.border}`,
                  cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                  color: 'var(--text-primary)',
                  position: 'relative', overflow: 'hidden',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                  e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.3), 0 0 20px ${a.glow}25`;
                  e.currentTarget.style.borderColor = `${a.glow}60`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = a.border;
                }}
              >
                <div style={{
                  fontSize: '1.6rem', marginBottom: 8,
                  filter: `drop-shadow(0 0 6px ${a.glow}60)`,
                }}>{a.icon}</div>
                <div style={{ fontSize: '0.87rem', fontWeight: 800, marginBottom: 2 }}>{a.label}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{a.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Affirmation + night status */}
        <div style={{
          borderRadius: 24, padding: '24px',
          background: 'rgba(255,255,255,0.025)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', flexDirection: 'column', gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 11,
              background: 'rgba(236,72,153,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
            }}>🌸</div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>For You, Today</h3>
          </div>

          <div style={{
            flex: 1, padding: '20px', borderRadius: 18,
            background: `linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(6,182,212,0.06) 50%, rgba(236,72,153,0.06) 100%)`,
            border: '1px solid rgba(124,58,237,0.18)',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Decorative corner */}
            <div style={{
              position: 'absolute', top: -20, right: -20,
              width: 80, height: 80, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(196,181,253,0.15) 0%, transparent 70%)',
            }} />
            <p style={{
              fontSize: '1rem', fontStyle: 'italic', lineHeight: 1.8,
              color: 'var(--accent-lavender)',
              position: 'relative', zIndex: 1,
            }}>
              "💜 You are enough.<br />Progress, not perfection."
            </p>
            <div style={{ marginTop: 12, fontSize: '0.72rem', color: 'var(--text-muted)', fontStyle: 'normal' }}>
              — Daily Affirmation
            </div>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 16px', borderRadius: 14,
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Wind size={14} style={{ color: 'var(--accent-cyan)' }} />
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Next check-in</span>
            </div>
            <span style={{ fontSize: '0.82rem', color: 'var(--accent-lavender)', fontWeight: 700 }}>8:00 PM</span>
          </div>

          <button className="btn btn-ghost" style={{ justifyContent: 'center' }}
            onClick={() => setActivePage('wellness')} id="wellness-btn">
            View Wellness Plan <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* ── DAILY STATUS PANEL ──────────────────────────────── */}
      <div style={{
        borderRadius: 24, padding: '24px 28px',
        background: 'rgba(6,182,212,0.03)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(6,182,212,0.12)',
        boxShadow: '0 4px 32px rgba(0,0,0,0.3)',
        animation: 'cinematic-fade 0.6s ease 0.8s both',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'rgba(6,182,212,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
            }}>📋</div>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Daily Mental Status</h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Powered by AI · Updated just now</p>
            </div>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px',
            borderRadius: 999, background: 'rgba(6,182,212,0.12)',
            border: '1px solid rgba(6,182,212,0.3)',
            fontSize: '0.7rem', fontWeight: 700, color: '#06b6d4',
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#06b6d4', boxShadow: '0 0 6px #06b6d4',
              animation: 'pulse-glow-soft 1.5s ease-in-out infinite',
            }} />
            Live
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
          {[
            { label: 'Stress Level', value: 'Medium', icon: '😰', color: '#fb923c', bg: 'rgba(251,146,60,0.08)' },
            { label: 'Current Mood', value: moody.label, icon: moody.emoji, color: md.aura, bg: `${md.aura}08` },
            { label: 'Focus State', value: 'Good Flow', icon: '🎯', color: '#34d399', bg: 'rgba(52,211,153,0.08)' },
            { label: 'Energy', value: 'Moderate', icon: '⚡', color: '#fbbf24', bg: 'rgba(251,191,36,0.08)' },
          ].map((item, i) => (
            <div key={item.label} style={{
              padding: '16px', borderRadius: 16,
              background: item.bg,
              border: `1px solid ${item.color}20`,
              transition: 'all 0.3s',
              animation: `cinematic-fade 0.5s ease ${i * 0.08 + 0.9}s both`,
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.borderColor = `${item.color}40`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = `${item.color}20`;
              }}
            >
              <div style={{ fontSize: '1.6rem', marginBottom: 8, filter: `drop-shadow(0 0 6px ${item.color}60)` }}>
                {item.icon}
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {item.label}
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: item.color }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
