import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { X, MessageCircle, Minimize2 } from 'lucide-react';

const moodExpressions = {
  happy:   { face: '😊', ring: '#34d399', text: "You're glowing today! ✨",       aura: 'rgba(52,211,153,0.25)' },
  calm:    { face: '😌', ring: '#38bdf8', text: "Peace lives here 🌙",            aura: 'rgba(56,189,248,0.25)' },
  anxious: { face: '🫂', ring: '#fb923c', text: "Breathe… I'm with you 🌿",      aura: 'rgba(251,146,60,0.25)' },
  stressed:{ face: '💜', ring: '#f87171', text: "You matter more than grades 💜", aura: 'rgba(248,113,113,0.25)' },
  tired:   { face: '🌛', ring: '#a78bfa', text: "Rest is sacred. I see you 🌸",  aura: 'rgba(167,139,250,0.25)' },
};

const idleMessages = [
  "I'm always here if you need to talk 🌸",
  "Remember to breathe today ✨",
  "You're doing better than you think 💜",
  "Take one small step at a time 🌿",
  "It's okay to feel what you feel 🫂",
  "How's your heart doing right now? 💙",
  "Even the stars take time to shine ⭐",
];

// Blink animation component
const BlinkingEye = ({ color }) => {
  const [blink, setBlink] = useState(false);
  useEffect(() => {
    const schedule = () => {
      const wait = 2500 + Math.random() * 4000;
      setTimeout(() => { setBlink(true); setTimeout(() => { setBlink(false); schedule(); }, 150); }, wait);
    };
    schedule();
  }, []);
  return (
    <div style={{
      width: 8, height: blink ? 2 : 8, borderRadius: '50%',
      background: color || '#c4b5fd',
      transition: 'height 0.08s ease',
      display: 'inline-block',
    }} />
  );
};

export default function FloatingCompanion() {
  const { currentMood, activePage, setActivePage } = useApp();
  const [minimized, setMinimized] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [showBubble, setShowBubble] = useState(true);
  const [bubbleText, setBubbleText] = useState('');
  const [isIdle, setIsIdle] = useState(false);
  const [wiggle, setWiggle] = useState(false);
  const idleRef = useRef(null);
  const msgIdx = useRef(0);

  const expr = moodExpressions[currentMood] || moodExpressions.calm;

  // Show page-based message when navigation changes
  useEffect(() => {
    const pageMessages = {
      home:         "Welcome home! 🏠 How are you feeling?",
      chat:         "I'm listening… say anything 💙",
      emotions:     "Let's see how your heart is doing today 🧠",
      wellness:     "Small steps build great journeys 🌿",
      profile:      "This is your space — safe and yours 🔒",
      architecture: "The tech behind your wellbeing ⚙️",
    };
    const msg = pageMessages[activePage];
    if (msg) {
      setBubbleText(msg);
      setShowBubble(true);
      setIsIdle(false);
    }
  }, [activePage]);

  // Idle messages cycling
  useEffect(() => {
    const cycle = () => {
      idleRef.current = setTimeout(() => {
        setBubbleText(idleMessages[msgIdx.current % idleMessages.length]);
        msgIdx.current++;
        setShowBubble(true);
        setIsIdle(true);
        idleRef.current = setTimeout(() => {
          setShowBubble(false);
          cycle();
        }, 5000);
      }, 12000);
    };
    cycle();
    return () => clearTimeout(idleRef.current);
  }, []);

  // Mood change reaction — brief wiggle
  useEffect(() => {
    setWiggle(true);
    setBubbleText(expr.text);
    setShowBubble(true);
    const t = setTimeout(() => setWiggle(false), 800);
    return () => clearTimeout(t);
  }, [currentMood]);

  if (dismissed) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 28, right: 28,
      zIndex: 200,
      display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10,
      userSelect: 'none',
    }}>

      {/* Speech bubble */}
      {showBubble && !minimized && (
        <div style={{
          maxWidth: 220, padding: '12px 16px',
          borderRadius: '18px 18px 6px 18px',
          background: 'rgba(13,11,42,0.92)',
          backdropFilter: 'blur(24px)',
          border: `1px solid ${expr.ring}35`,
          boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 20px ${expr.ring}15`,
          animation: 'cinematic-fade 0.4s ease both',
          position: 'relative',
        }}>
          {/* inner shimmer */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 1,
            background: `linear-gradient(90deg, transparent, ${expr.ring}50, transparent)`,
            borderRadius: '18px 18px 0 0',
          }} />
          <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: 1.6, margin: 0 }}>
            {bubbleText}
          </p>
        </div>
      )}

      {/* Companion orb */}
      <div style={{ position: 'relative' }}>

        {/* Dismiss button */}
        <button
          onClick={() => setDismissed(true)}
          title="Dismiss Buddy"
          style={{
            position: 'absolute', top: -6, left: -6, zIndex: 10,
            width: 20, height: 20, borderRadius: '50%', border: 'none',
            background: 'rgba(30,25,60,0.95)', color: 'var(--text-muted)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.7rem', transition: 'all 0.2s',
            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.8)'; e.currentTarget.style.color = 'white'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(30,25,60,0.95)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
        >
          <X size={10} />
        </button>

        {/* Minimize toggle */}
        <button
          onClick={() => setMinimized(m => !m)}
          title={minimized ? "Expand Buddy" : "Minimize"}
          style={{
            position: 'absolute', top: -6, right: -6, zIndex: 10,
            width: 20, height: 20, borderRadius: '50%', border: 'none',
            background: 'rgba(30,25,60,0.95)', color: 'var(--text-muted)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.7rem', transition: 'all 0.2s',
            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = `${expr.ring}80`; e.currentTarget.style.color = 'white'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(30,25,60,0.95)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
        >
          <Minimize2 size={9} />
        </button>

        {/* Outer pulsing ring */}
        <div style={{
          position: 'absolute', inset: -8, borderRadius: '50%',
          border: `1.5px solid ${expr.ring}50`,
          animation: 'halo-pulse 2.5s ease-in-out infinite',
        }} />

        {/* Rotating dashed ring */}
        {!minimized && (
          <div style={{
            position: 'absolute', inset: -3, borderRadius: '50%',
            border: `1px dashed ${expr.ring}35`,
            animation: 'spin-slow 12s linear infinite',
          }} />
        )}

        {/* Main body */}
        <div
          onClick={() => { if (minimized) { setMinimized(false); setShowBubble(true); } else setActivePage('chat'); }}
          title={minimized ? "Open Buddy" : "Talk to Buddy"}
          style={{
            width: minimized ? 52 : 72,
            height: minimized ? 52 : 72,
            borderRadius: '50%',
            background: `radial-gradient(circle at 35% 30%, ${expr.aura}, rgba(8,7,20,0.95))`,
            border: `2px solid ${expr.ring}60`,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: `0 0 0 4px ${expr.ring}15, 0 0 24px ${expr.ring}30, 0 8px 32px rgba(0,0,0,0.5)`,
            animation: wiggle
              ? 'mood-select-pop 0.5s ease'
              : 'avatar-breathe 4s ease-in-out infinite',
            transition: 'width 0.3s ease, height 0.3s ease, background 0.8s ease, border-color 0.8s ease',
            backdropFilter: 'blur(12px)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = `0 0 0 6px ${expr.ring}25, 0 0 40px ${expr.ring}50, 0 12px 40px rgba(0,0,0,0.6)`;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = `0 0 0 4px ${expr.ring}15, 0 0 24px ${expr.ring}30, 0 8px 32px rgba(0,0,0,0.5)`;
          }}
        >
          {/* Face emoji */}
          <div style={{
            fontSize: minimized ? '1.5rem' : '2rem',
            filter: `drop-shadow(0 0 6px ${expr.ring}90)`,
            lineHeight: 1, marginBottom: minimized ? 0 : 2,
          }}>
            {expr.face}
          </div>

          {/* Blinking eyes (visible only when not minimized) */}
          {!minimized && (
            <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
              <BlinkingEye color={expr.ring} />
              <BlinkingEye color={expr.ring} />
            </div>
          )}
        </div>

        {/* Name tag */}
        {!minimized && (
          <div style={{
            position: 'absolute', bottom: -22, left: '50%', transform: 'translateX(-50%)',
            whiteSpace: 'nowrap', fontSize: '0.65rem', fontWeight: 700,
            color: expr.ring, fontFamily: 'var(--font-ui)',
            textShadow: `0 0 8px ${expr.ring}80`,
          }}>
            ✦ Buddy ✦
          </div>
        )}

        {/* Chat indicator dot */}
        {minimized && (
          <div style={{
            position: 'absolute', bottom: 2, right: 2,
            width: 10, height: 10, borderRadius: '50%',
            background: '#34d399',
            boxShadow: '0 0 6px #34d399',
            border: '1.5px solid var(--bg-deep)',
            animation: 'pulse-glow-soft 2s ease-in-out infinite',
          }} />
        )}
      </div>

      {/* Extra bottom spacing for name tag */}
      {!minimized && <div style={{ height: 12 }} />}
    </div>
  );
}
