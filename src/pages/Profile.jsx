import React, { useState } from 'react';
import { avatarOptions } from '../data/mockData';
import { Shield, Lock, Eye, EyeOff, Edit2, Check } from 'lucide-react';

const privacySettings = [
  { label: 'Anonymize my data', desc: 'Your identity is never linked to sessions', default: true, icon: '👤' },
  { label: 'End-to-end encryption', desc: 'All chats are encrypted', default: true, icon: '🔐' },
  { label: 'Share insights with counselor', desc: 'Opt-in for professional support', default: false, icon: '👨‍⚕️' },
  { label: 'Usage analytics', desc: 'Help improve MindCare', default: false, icon: '📊' },
];

export default function Profile() {
  const [selectedAvatar, setSelectedAvatar] = useState(1);
  const [username, setUsername] = useState('StarDust_Aryan');
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('StarDust_Aryan');
  const [privacy, setPrivacy] = useState(() => {
    const m = {};
    privacySettings.forEach((s, i) => m[i] = s.default);
    return m;
  });
  const [showData, setShowData] = useState(false);

  const avatar = avatarOptions.find(a => a.id === selectedAvatar);

  const stats = [
    { label: 'Days Active', value: '21', icon: '📅' },
    { label: 'Chats', value: '47', icon: '💬' },
    { label: 'Streak', value: '3', icon: '🔥' },
    { label: 'Mood Logs', value: '19', icon: '📊' },
  ];

  return (
    <div className="page-container">
      <h2 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: 4 }}>👤 My Profile</h2>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 24 }}>Your identity, your journey, your space.</p>

      {/* Profile hero — cinematic */}
      <div style={{
        padding: '36px 32px', marginBottom: 24, borderRadius: 28,
        background: 'linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(6,182,212,0.06) 50%, rgba(236,72,153,0.05) 100%)',
        border: '1px solid rgba(124,58,237,0.2)',
        boxShadow: '0 0 60px rgba(124,58,237,0.08), 0 12px 48px rgba(0,0,0,0.4)',
        animation: 'hero-entrance 0.6s cubic-bezier(0.4,0,0.2,1) both',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Ambient bg orb */}
        <div style={{
          position: 'absolute', top: -60, right: -60, width: 250, height: 250,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
          {/* Avatar display */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative' }}>
              {/* Outer orbit ring */}
              <div style={{
                position: 'absolute', inset: -8,
                borderRadius: '50%',
                border: '1px dashed rgba(196,181,253,0.3)',
                animation: 'spin-slow 12s linear infinite',
              }} />
              <div style={{
                width: 110, height: 110, borderRadius: '50%',
                background: avatar.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '3.2rem',
                border: '2px solid rgba(196,181,253,0.4)',
                boxShadow: '0 0 0 6px rgba(124,58,237,0.1), 0 0 30px rgba(124,58,237,0.3)',
                animation: 'halo-pulse 3s ease-in-out infinite, avatar-breathe 4s ease-in-out infinite',
              }}>{avatar.emoji}</div>
              {/* Online dot */}
              <div style={{
                position: 'absolute', bottom: 6, right: 6,
                width: 18, height: 18, borderRadius: '50%',
                background: '#34d399', border: '2px solid var(--bg-deep)',
                boxShadow: '0 0 8px #34d399',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.6rem',
              }}>✓</div>
            </div>
            <span style={{
              padding: '4px 14px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700,
              background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.35)',
              color: '#c4b5fd',
            }}>{avatar.name}</span>
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              {editingName ? (
                <>
                  <input
                    className="input-field"
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    style={{ width: 200, padding: '8px 12px', fontSize: '1rem' }}
                    id="username-input"
                    autoFocus
                  />
                  <button className="btn-icon" onClick={() => { setUsername(nameInput); setEditingName(false); }} id="save-name-btn">
                    <Check size={14} />
                  </button>
                </>
              ) : (
                <>
                  <h3 style={{
                    fontSize: '1.5rem', fontWeight: 900,
                    background: 'linear-gradient(135deg, #f1f0ff, #c4b5fd)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  }}>{username}</h3>
                  <button className="btn-icon" onClick={() => setEditingName(true)} id="edit-name-btn">
                    <Edit2 size={14} />
                  </button>
                </>
              )}
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: 16 }}>
              🎓 Student · Mental Wellness Journey · Joined March 2025
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[{ l: '✅ Verified Student', c: '#34d399', bg: 'rgba(52,211,153,0.12)', br: 'rgba(52,211,153,0.3)' },
                { l: '🌸 Wellness Seeker', c: '#38bdf8', bg: 'rgba(56,189,248,0.1)', br: 'rgba(56,189,248,0.25)' },
                { l: '🔒 Anonymous Mode', c: '#c4b5fd', bg: 'rgba(124,58,237,0.12)', br: 'rgba(124,58,237,0.3)' }].map(b => (
                <span key={b.l} style={{
                  padding: '4px 12px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700,
                  background: b.bg, border: `1px solid ${b.br}`, color: b.c,
                }}>{b.l}</span>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {stats.map((s, i) => (
              <div key={s.label} style={{
                padding: '16px 14px', borderRadius: 16,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                textAlign: 'center',
                transition: 'all 0.3s',
                animation: `cinematic-fade 0.5s ease ${i * 0.1 + 0.3}s both`,
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
                  e.currentTarget.style.borderColor = 'rgba(196,181,253,0.2)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                }}
              >
                <div style={{ fontSize: '1.3rem', marginBottom: 5 }}>{s.icon}</div>
                <div style={{
                  fontFamily: 'var(--font-ui)', fontSize: '1.4rem', fontWeight: 900,
                  background: 'linear-gradient(135deg, #c4b5fd, #38bdf8)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>{s.value}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Avatar selector — cinematic */}
      <div style={{
        borderRadius: 24, padding: '24px 28px', marginBottom: 24,
        background: 'rgba(255,255,255,0.025)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(236,72,153,0.14)',
        animation: 'cinematic-fade 0.5s ease 0.2s both',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12, fontSize: '1.2rem',
            background: 'rgba(236,72,153,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 14px rgba(236,72,153,0.2)',
          }}>🎨</div>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 2 }}>Choose Your Avatar</h3>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Anime-style companion personas</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: 12 }}>
          {avatarOptions.map(av => {
            const sel = selectedAvatar === av.id;
            return (
              <button key={av.id} onClick={() => setSelectedAvatar(av.id)} id={`avatar-${av.id}`}
                style={{
                  padding: '18px 8px', borderRadius: 18,
                  border: sel ? '2px solid rgba(124,58,237,0.7)' : '1px solid rgba(255,255,255,0.06)',
                  background: sel ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.025)',
                  cursor: 'pointer', textAlign: 'center',
                  transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                  boxShadow: sel ? '0 0 24px rgba(124,58,237,0.35), 0 0 8px rgba(124,58,237,0.2)' : 'none',
                  transform: sel ? 'translateY(-3px)' : 'translateY(0)',
                }}
                onMouseEnter={e => { if (!sel) e.currentTarget.style.transform = 'translateY(-3px) scale(1.04)'; }}
                onMouseLeave={e => { if (!sel) e.currentTarget.style.transform = 'translateY(0) scale(1)'; }}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: av.bg, margin: '0 auto 8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.6rem',
                  boxShadow: sel ? `0 0 20px rgba(124,58,237,0.5)` : 'none',
                  border: `2px solid ${sel ? 'rgba(196,181,253,0.4)' : 'transparent'}`,
                  transition: 'all 0.3s',
                }}>{av.emoji}</div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: sel ? '#c4b5fd' : 'var(--text-muted)', transition: 'color 0.3s' }}>
                  {av.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Privacy settings */}
      <div className="glass-card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div className="section-header" style={{ marginBottom: 0 }}>
            <div className="section-icon" style={{ background: 'rgba(52,211,153,0.15)' }}>🔐</div>
            <div>
              <h3 style={{ fontSize: '1rem' }}>Privacy & Security</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Your data is always protected</p>
            </div>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 14px', borderRadius: 99,
            background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.3)',
          }}>
            <Shield size={14} style={{ color: '#34d399' }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#34d399' }}>Your data is safe 🔒</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {privacySettings.map((s, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 16px', borderRadius: 12,
              background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)',
              transition: 'all 0.3s',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: '1.2rem' }}>{s.icon}</span>
                <div>
                  <div style={{ fontSize: '0.87rem', fontWeight: 600 }}>{s.label}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{s.desc}</div>
                </div>
              </div>
              <button
                onClick={() => setPrivacy(p => ({ ...p, [i]: !p[i] }))}
                id={`privacy-toggle-${i}`}
                style={{
                  width: 48, height: 26, borderRadius: 99, border: 'none',
                  background: privacy[i]
                    ? 'linear-gradient(135deg, #7c3aed, #06b6d4)'
                    : 'rgba(255,255,255,0.08)',
                  cursor: 'pointer', position: 'relative', flexShrink: 0,
                  transition: 'all 0.3s',
                  boxShadow: privacy[i] ? '0 0 12px rgba(124,58,237,0.4)' : 'none',
                }}
              >
                <div style={{
                  position: 'absolute', top: 3,
                  left: privacy[i] ? 'calc(100% - 23px)' : 3,
                  width: 20, height: 20, borderRadius: '50%',
                  background: 'white',
                  transition: 'left 0.3s',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
                }} />
              </button>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 20, padding: '16px 18px', borderRadius: 14,
          background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <Lock size={16} style={{ color: 'var(--accent-lavender)', flexShrink: 0 }} />
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            MindCare uses military-grade AES-256 encryption. Your conversations with Buddy are never stored in plain text, 
            and your identity is fully anonymized. We comply with DPDP Act (India).
          </p>
        </div>
      </div>
    </div>
  );
}
