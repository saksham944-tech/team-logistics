import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { wellnessActivities } from '../data/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Check, Plus, Play } from 'lucide-react';

const moodColors = {
  happy: '#34d399', calm: '#38bdf8',
  anxious: '#fb923c', stressed: '#f87171', tired: '#a78bfa',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass-card-sm" style={{ padding: '10px 14px', border: '1px solid rgba(124,58,237,0.3)' }}>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4 }}>{label}</p>
        {payload.map(p => (
          <p key={p.name} style={{ fontSize: '0.82rem', color: p.color, fontWeight: 600 }}>
            {p.name}: {p.value}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Wellness() {
  const { moodHistory, streak, setActivePage } = useApp();
  const [completedActivities, setCompletedActivities] = useState(new Set());
  const [activeActivity, setActiveActivity] = useState(null);

  const toggleActivity = (id) => {
    setCompletedActivities(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  return (
    <div className="page-container">
      {/* Page header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: 4 }}>🌿 Wellness Tracker</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Your path to holistic wellbeing — one breath at a time</p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 20px', borderRadius: 999,
          background: 'linear-gradient(135deg, rgba(251,191,36,0.15), rgba(251,113,133,0.1))',
          border: '1px solid rgba(251,191,36,0.35)',
          boxShadow: '0 0 20px rgba(251,191,36,0.15)',
          animation: 'bounce-soft 2.5s ease-in-out infinite',
          fontWeight: 700, fontSize: '0.9rem', color: '#fbbf24',
        }}>
          🔥 {streak}-day streak
          <span style={{ color: '#fda4af', fontWeight: 500 }}>· keep going! 🌸</span>
        </div>
      </div>

      {/* Mood timeline + chart */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Timeline */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div className="section-header">
            <div className="section-icon" style={{ background: 'rgba(123,58,237,0.15)' }}>📅</div>
            <h3 style={{ fontSize: '1rem' }}>This Week's Mood</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {moodHistory.map((entry, i) => {
              const color = moodColors[entry.mood] || '#c4b5fd';
              const emojiMap = { happy: '😊', calm: '😌', anxious: '😰', stressed: '😤', tired: '😴' };
              return (
                <div key={entry.day} style={{ display: 'flex', gap: 16, alignItems: 'stretch' }}>
                  {/* Timeline connector */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 20 }}>
                    <div className="timeline-dot" style={{ background: color, color }} />
                    {i < moodHistory.length - 1 && (
                      <div className="timeline-line" style={{ height: 32, width: 2, background: `linear-gradient(180deg, ${color}60, transparent)` }} />
                    )}
                  </div>
                  {/* Content */}
                  <div style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    paddingBottom: 16,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: '1.2rem' }}>{emojiMap[entry.mood]}</span>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{entry.day}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                          {entry.mood}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontSize: '0.72rem', color: '#f87171' }}>S:{entry.stress}%</span>
                      <span style={{ fontSize: '0.72rem', color: '#34d399' }}>F:{entry.focus}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trend chart */}
        <div className="glass-card" style={{ padding: 24 }}>
          <div className="section-header">
            <div className="section-icon" style={{ background: 'rgba(52,211,153,0.15)' }}>📈</div>
            <h3 style={{ fontSize: '1rem' }}>Mood Score Trend</h3>
          </div>
          <div style={{ height: 200, marginBottom: 12 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moodHistory.map(d => ({ ...d, score: Math.round((100 - d.stress + d.focus) / 2) }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="score" name="Mood Score"
                  stroke="#c4b5fd" strokeWidth={2.5}
                  dot={{ fill: '#c4b5fd', r: 4, strokeWidth: 2, stroke: '#7c3aed' }}
                  activeDot={{ r: 6, fill: '#7c3aed' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {/* Simple stats */}
          <div style={{ display: 'flex', gap: 12 }}>
            {[{ label: 'Best Day', value: 'Wednesday', color: '#34d399' },
              { label: 'Avg Score', value: '72%', color: '#c4b5fd' },
              { label: 'Trend', value: '↑ Improving', color: '#38bdf8' }].map(s => (
              <div key={s.label} style={{
                flex: 1, padding: '10px 12px', borderRadius: 10,
                background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
              }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{s.label}</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activities — cinematic */}
      <div style={{
        borderRadius: 24, padding: '24px 28px', marginBottom: 24,
        background: 'rgba(255,255,255,0.025)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(56,189,248,0.14)',
        animation: 'cinematic-fade 0.5s ease 0.2s both',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'rgba(56,189,248,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
              boxShadow: '0 0 14px rgba(56,189,248,0.2)',
            }}>✨</div>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 2 }}>Suggested Activities</h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {completedActivities.size} of {wellnessActivities.length} completed today
              </p>
            </div>
          </div>
          <div style={{
            padding: '5px 14px', borderRadius: 999,
            background: 'rgba(124,58,237,0.15)',
            border: '1px solid rgba(124,58,237,0.3)',
            fontSize: '0.75rem', fontWeight: 700, color: '#c4b5fd',
          }}>{completedActivities.size}/{wellnessActivities.length} done</div>
        </div>

        <div className="grid-3">
          {wellnessActivities.map((act, i) => {
            const done = completedActivities.has(act.id);
            return (
              <div key={act.id}
                id={`activity-${act.id}`}
                style={{
                  padding: '20px 16px', borderRadius: 20,
                  background: done ? `${act.color}` : 'rgba(255,255,255,0.025)',
                  border: done ? `1.5px solid ${act.border}` : '1px solid rgba(255,255,255,0.06)',
                  opacity: done ? 0.85 : 1,
                  transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                  animation: `cinematic-fade 0.5s ease ${i * 0.07}s both`,
                  cursor: 'default',
                }}
                onMouseEnter={e => {
                  if (!done) {
                    e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
                    e.currentTarget.style.boxShadow = `0 16px 40px rgba(0,0,0,0.35), 0 0 24px ${act.border}`;
                    e.currentTarget.style.borderColor = act.border;
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = done ? act.border : 'rgba(255,255,255,0.06)';
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 14, marginBottom: 12,
                  background: act.color, border: `1px solid ${act.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.4rem',
                  boxShadow: `0 0 14px ${act.border}50`,
                }}>{act.emoji}</div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: 4 }}>{act.title}</h4>
                <p style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.5 }}>{act.subtitle}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <span style={{
                    fontSize: '0.62rem', fontWeight: 700, padding: '3px 9px', borderRadius: 99,
                    background: `${act.tagColor}12`, border: `1px solid ${act.tagColor}30`, color: act.tagColor,
                  }}>{act.tag}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{act.duration}</span>
                </div>
                <button
                  onClick={() => toggleActivity(act.id)}
                  id={`start-activity-${act.id}`}
                  style={{
                    width: '100%', padding: '9px 0', borderRadius: 12, border: 'none',
                    background: done
                      ? 'rgba(52,211,153,0.18)'
                      : `linear-gradient(135deg, ${act.color}, ${act.border}20)`,
                    border: `1px solid ${done ? 'rgba(52,211,153,0.4)' : act.border}`,
                    color: done ? '#34d399' : 'var(--text-primary)',
                    cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    transition: 'all 0.3s', fontFamily: 'var(--font-body)',
                    boxShadow: done ? 'none' : `0 4px 12px ${act.border}30`,
                  }}
                  onMouseEnter={e => { if (!done) e.currentTarget.style.transform = 'scale(1.03)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  {done ? <><Check size={13} /> Done!</> : <><Play size={13} /> Start</>}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Streak system — cinematic */}
      <div style={{
        padding: '28px', borderRadius: 24,
        background: 'linear-gradient(135deg, rgba(251,191,36,0.07) 0%, rgba(251,113,133,0.05) 50%, rgba(124,58,237,0.05) 100%)',
        border: '1px solid rgba(251,191,36,0.18)',
        boxShadow: '0 0 40px rgba(251,191,36,0.06)',
        animation: 'cinematic-fade 0.5s ease 0.4s both',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 5 }}>🏆 Your Wellness Journey</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Each day you show up is a win. Keep the momentum going!</p>
          </div>
          <div style={{
            fontSize: '1.05rem', fontWeight: 800, padding: '12px 22px', borderRadius: 999,
            background: 'linear-gradient(135deg, rgba(251,191,36,0.2), rgba(251,113,133,0.15))',
            border: '1px solid rgba(251,191,36,0.4)',
            color: '#fbbf24',
            boxShadow: '0 0 16px rgba(251,191,36,0.2)',
          }}>🔥 {streak} Day Streak</div>
        </div>
        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.25), transparent)', marginBottom: 20 }} />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {Array.from({ length: 14 }).map((_, i) => {
            const active = i < 3 + (streak % 4);
            return (
              <div key={i} style={{
                width: 44, height: 44, borderRadius: 12,
                background: active
                  ? 'linear-gradient(135deg, rgba(251,191,36,0.55), rgba(251,113,133,0.4))'
                  : 'rgba(255,255,255,0.03)',
                border: `1px solid ${active ? 'rgba(251,191,36,0.5)' : 'rgba(255,255,255,0.05)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.9rem',
                boxShadow: active ? '0 0 10px rgba(251,191,36,0.3)' : 'none',
                transition: 'all 0.3s',
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                {active
                  ? <span style={{ filter: 'drop-shadow(0 0 4px #fbbf24)' }}>🌸</span>
                  : <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>{14 - i}d</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
