import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { aiResponses, defaultResponses, quickReplies } from '../data/mockData';
import { Send, Mic, RefreshCw, Sparkles } from 'lucide-react';

const getAIResponse = (userMsg) => {
  const lower = userMsg.toLowerCase();
  for (const { keywords, responses } of aiResponses) {
    if (keywords.some(k => lower.includes(k)))
      return responses[Math.floor(Math.random() * responses.length)];
  }
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
};

const formatTime = (d) =>
  (d instanceof Date ? d : new Date()).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: true });

const emotionContext = (msg) => {
  const l = msg.toLowerCase();
  if (l.match(/stress|overwhelm|pressure|exam/))   return { label: '💜 Empathetic',  color: '#c4b5fd', aura: 'rgba(167,139,250,0.15)' };
  if (l.match(/happy|great|amazing|excited/))       return { label: '🌟 Joyful',      color: '#fbbf24', aura: 'rgba(251,191,36,0.12)' };
  if (l.match(/sad|cry|down|depressed|lonely/))     return { label: '🫂 Comforting',  color: '#38bdf8', aura: 'rgba(56,189,248,0.12)' };
  if (l.match(/anxious|worried|panic|nervous/))     return { label: '🧘 Calming',     color: '#34d399', aura: 'rgba(52,211,153,0.12)' };
  if (l.match(/tired|exhaust|sleep|fatigue/))       return { label: '🌙 Nurturing',   color: '#a78bfa', aura: 'rgba(167,139,250,0.12)' };
  return { label: '🤗 Warm',  color: '#ec4899', aura: 'rgba(236,72,153,0.08)' };
};

// Animated wave bar for "Buddy is listening"
const WaveBar = ({ delay }) => (
  <div style={{
    width: 3, borderRadius: 99,
    background: 'var(--accent-cyan)',
    animation: `wave 1.2s ease-in-out ${delay}s infinite`,
    minHeight: 8,
    alignSelf: 'center',
  }} />
);

export default function Chat() {
  const { chatMessages, addMessage } = useApp();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [emotion, setEmotion] = useState({ label: '🤗 Warm', color: '#ec4899', aura: 'rgba(236,72,153,0.08)' });
  const [listeningPulse, setListeningPulse] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput('');
    const ctx = emotionContext(msg);
    setEmotion(ctx);
    addMessage({ role: 'user', text: msg });
    setListeningPulse(true);
    setIsTyping(true);
    await new Promise(r => setTimeout(r, 1400 + Math.random() * 900));
    setIsTyping(false);
    setListeningPulse(false);
    addMessage({ role: 'ai', text: getAIResponse(msg) });
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>

      {/* Ambient background glow that shifts with emotion */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `radial-gradient(ellipse at 70% 20%, ${emotion.aura} 0%, transparent 60%),
                     radial-gradient(ellipse at 20% 80%, rgba(124,58,237,0.08) 0%, transparent 50%)`,
        transition: 'background 1.2s ease',
      }} />

      {/* ── CHAT HEADER ──────────────────────────────────────── */}
      <div style={{
        padding: '16px 28px',
        background: 'rgba(8,7,20,0.75)',
        backdropFilter: 'blur(24px)',
        borderBottom: `1px solid ${emotion.color}30`,
        display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0, zIndex: 2,
        transition: 'border-color 0.6s ease',
      }}>
        {/* Avatar orb */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: `radial-gradient(circle at 35% 30%, ${emotion.aura}, rgba(8,7,20,0.9))`,
            border: `2px solid ${emotion.color}50`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.8rem',
            boxShadow: `0 0 20px ${emotion.color}30`,
            animation: 'avatar-breathe 4s ease-in-out infinite',
            transition: 'border-color 0.6s ease, box-shadow 0.6s ease',
          }}>🌸</div>
          {/* Online pulse */}
          <div style={{
            position: 'absolute', bottom: 1, right: 1,
            width: 13, height: 13, borderRadius: '50%',
            background: '#34d399',
            border: '2px solid var(--bg-deep)',
            boxShadow: listeningPulse ? '0 0 0 4px rgba(52,211,153,0.3)' : '0 0 8px #34d399',
            transition: 'box-shadow 0.4s ease',
          }} />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontFamily: 'var(--font-ui)', fontSize: '1.05rem', marginBottom: 2 }}>Buddy</div>
          <div style={{ fontSize: '0.73rem', display: 'flex', alignItems: 'center', gap: 6 }}>
            {isTyping ? (
              <span style={{ color: '#34d399', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span>composing a response</span>
                <WaveBar delay={0} />
                <WaveBar delay={0.15} />
                <WaveBar delay={0.3} />
              </span>
            ) : (
              <span style={{ color: '#34d399' }}>✅ Online · AI Mental Health Companion</span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Emotion badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '6px 14px', borderRadius: 999,
            background: `${emotion.color}15`,
            border: `1px solid ${emotion.color}35`,
            fontSize: '0.75rem', fontWeight: 700,
            color: emotion.color,
            transition: 'all 0.5s ease',
          }}>
            <Sparkles size={11} />
            {emotion.label}
          </div>
          <button className="btn-icon" id="refresh-chat-btn" title="New conversation"
            onClick={() => addMessage({ role: 'ai', text: "Let's start fresh 🌸 I'm here whenever you want to talk — no pressure, no judgment." })}>
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* ── MESSAGES ─────────────────────────────────────────── */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '28px 28px 12px',
        display: 'flex', flexDirection: 'column', gap: 20, zIndex: 1,
      }}>
        {chatMessages.map((msg, i) => (
          <div key={msg.id}
            style={{
              display: 'flex',
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              alignItems: 'flex-end', gap: 12,
              animation: 'cinematic-fade 0.4s ease both',
            }}
          >
            {/* AI avatar */}
            {msg.role === 'ai' && (
              <div style={{
                width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                background: `radial-gradient(circle at 35% 30%, rgba(124,58,237,0.4), rgba(6,182,212,0.3))`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.1rem',
                border: '1px solid rgba(124,58,237,0.35)',
                boxShadow: '0 0 12px rgba(124,58,237,0.3)',
              }}>🌸</div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, maxWidth: '72%', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              {/* Bubble */}
              <div style={msg.role === 'user' ? {
                background: `linear-gradient(135deg, var(--primary) 0%, #4f46e5 100%)`,
                color: 'white',
                borderRadius: '22px 22px 5px 22px',
                padding: '13px 18px',
                fontSize: '0.9rem', lineHeight: 1.6,
                boxShadow: '0 6px 24px rgba(124,58,237,0.35), 0 2px 8px rgba(0,0,0,0.3)',
                letterSpacing: '0.01em',
              } : {
                background: 'linear-gradient(135deg, rgba(6,182,212,0.1) 0%, rgba(79,70,229,0.12) 100%)',
                border: `1px solid ${emotion.color}25`,
                color: 'var(--text-primary)',
                borderRadius: '22px 22px 22px 5px',
                padding: '13px 18px',
                fontSize: '0.9rem', lineHeight: 1.6,
                boxShadow: `0 6px 24px rgba(0,0,0,0.2), 0 0 16px ${emotion.color}10`,
                letterSpacing: '0.01em',
                position: 'relative', overflow: 'hidden',
              }}>
                {/* AI bubble shimmer top-left */}
                {msg.role === 'ai' && (
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                    background: `linear-gradient(90deg, transparent, ${emotion.color}40, transparent)`,
                  }} />
                )}
                {msg.text}
              </div>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', padding: '0 6px' }}>
                {formatTime(msg.time)}
              </span>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, animation: 'cinematic-fade 0.3s ease' }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
              background: 'radial-gradient(circle at 35% 30%, rgba(124,58,237,0.4), rgba(6,182,212,0.3))',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem',
              border: '1px solid rgba(124,58,237,0.35)',
              animation: 'halo-pulse 2s ease-in-out infinite',
            }}>🌸</div>
            <div style={{
              background: 'linear-gradient(135deg, rgba(6,182,212,0.1), rgba(79,70,229,0.12))',
              border: `1px solid ${emotion.color}25`,
              borderRadius: '22px 22px 22px 5px',
              padding: '14px 20px',
              display: 'flex', gap: 6, alignItems: 'center',
            }}>
              <div className="typing-dot" />
              <div className="typing-dot" />
              <div className="typing-dot" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── QUICK REPLIES ─────────────────────────────────────── */}
      <div style={{
        padding: '10px 28px 0',
        display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none',
        flexShrink: 0, zIndex: 1,
      }}>
        {quickReplies.map((q, i) => (
          <button key={i}
            onClick={() => sendMessage(q)}
            id={`quick-reply-${i}`}
            style={{
              padding: '7px 14px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)',
              fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', flexShrink: 0,
              backdropFilter: 'blur(12px)',
              transition: 'all 0.25s ease', whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = `${emotion.color}18`;
              e.currentTarget.style.borderColor = `${emotion.color}40`;
              e.currentTarget.style.color = emotion.color;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >{q}</button>
        ))}
      </div>

      {/* ── INPUT BAR ─────────────────────────────────────────── */}
      <div style={{
        padding: '14px 28px 22px',
        display: 'flex', gap: 12, alignItems: 'flex-end',
        flexShrink: 0, zIndex: 1,
      }}>
        <div style={{
          flex: 1, position: 'relative',
          borderRadius: 20,
          background: 'rgba(255,255,255,0.04)',
          border: `1px solid ${input ? emotion.color + '50' : 'rgba(255,255,255,0.08)'}`,
          backdropFilter: 'blur(16px)',
          boxShadow: input ? `0 0 20px ${emotion.color}15` : 'none',
          transition: 'border-color 0.3s, box-shadow 0.3s',
        }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Share what's on your mind... Buddy is listening 🌸"
            rows={1}
            id="chat-input"
            style={{
              width: '100%', background: 'transparent', border: 'none', outline: 'none',
              color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: '0.9rem',
              padding: '14px 52px 14px 18px', resize: 'none', lineHeight: 1.6,
              minHeight: 50, maxHeight: 120, borderRadius: 20,
            }}
          />
          <button className="btn-icon" id="mic-btn"
            style={{
              position: 'absolute', right: 10, bottom: 8,
              background: 'transparent', border: 'none', color: 'var(--text-muted)',
            }}>
            <Mic size={16} />
          </button>
        </div>

        <button
          onClick={() => sendMessage()}
          disabled={isTyping || !input.trim()}
          id="send-msg-btn"
          style={{
            width: 50, height: 50, borderRadius: 16, border: 'none',
            background: input.trim()
              ? `linear-gradient(135deg, var(--primary), ${emotion.color === '#ec4899' ? '#4f46e5' : emotion.color})`
              : 'rgba(255,255,255,0.06)',
            cursor: input.trim() ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: input.trim() ? `0 6px 20px rgba(124,58,237,0.4)` : 'none',
            transition: 'all 0.3s ease',
            flexShrink: 0,
          }}
          onMouseEnter={e => { if (input.trim()) e.currentTarget.style.transform = 'scale(1.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <Send size={18} color={input.trim() ? 'white' : 'var(--text-muted)'} />
        </button>
      </div>
    </div>
  );
}
