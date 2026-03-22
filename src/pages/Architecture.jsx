import React, { useState, useEffect, useRef } from 'react';

// ── Animated Data Packet along SVG path ────────────────────────
const DataPacket = ({ x1, y1, x2, y2, color, delay = 0, duration = 2.5 }) => {
  const [pos, setPos] = useState(0);
  useEffect(() => {
    let start = null;
    let id;
    const run = (ts) => {
      if (!start) start = ts - delay * 1000;
      const t = ((ts - start) / (duration * 1000)) % 1;
      setPos(Math.max(0, t));
      id = requestAnimationFrame(run);
    };
    const timeout = setTimeout(() => { id = requestAnimationFrame(run); }, delay * 1000);
    return () => { clearTimeout(timeout); cancelAnimationFrame(id); };
  }, [delay, duration]);

  const cx = x1 + (x2 - x1) * pos;
  const cy = y1 + (y2 - y1) * pos;
  return (
    <g>
      <circle cx={cx} cy={cy} r={3.5} fill={color} opacity={0.9}
        style={{ filter: `drop-shadow(0 0 4px ${color})` }}
      />
      <circle cx={cx} cy={cy} r={6} fill={color} opacity={0.25} />
    </g>
  );
};

// ── Animated connection line with glow & packets ────────────────
const NeonEdge = ({ x1, y1, x2, y2, color, label, packets = 1, curved = false }) => {
  const id = `edge-${x1}-${y1}-${x2}-${y2}`.replace(/\./g, '');
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 - (curved ? 40 : 0);
  const d = curved
    ? `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`
    : `M ${x1} ${y1} L ${x2} ${y2}`;

  const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  return (
    <g>
      <defs>
        <filter id={`glow-e-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <marker id={`arr-${id}`} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <polygon points="0 0, 7 3.5, 0 7" fill={color} opacity="0.7" />
        </marker>
      </defs>

      {/* Glow track */}
      <path d={d} stroke={color} strokeWidth="3" fill="none" opacity="0.12" filter={`url(#glow-e-${id})`} />
      {/* Main line */}
      <path d={d} stroke={color} strokeWidth="1.5" fill="none" opacity="0.45"
        strokeDasharray="8 6"
        markerEnd={`url(#arr-${id})`}
        filter={`url(#glow-e-${id})`}
      />

      {/* Data packets */}
      {Array.from({ length: packets }).map((_, i) =>
        !curved ? (
          <DataPacket key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            color={color} delay={i * (2.5 / packets)} duration={2.5} />
        ) : null
      )}

      {/* Label */}
      {label && (
        <text x={mx} y={curved ? my - 6 : (y1 + y2) / 2 - 8}
          textAnchor="middle" fill={color} fontSize="8" opacity="0.7"
          fontFamily="Outfit" fontWeight="600" letterSpacing="0.05em"
        >{label}</text>
      )}
    </g>
  );
};

// ── Node ────────────────────────────────────────────────────────
const CyberNode = ({ x, y, emoji, label, sublabel, color, size = 'md', active, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const w = size === 'lg' ? 110 : size === 'sm' ? 80 : 95;
  const h = size === 'lg' ? 90 : size === 'sm' ? 68 : 78;

  return (
    <g transform={`translate(${x - w / 2},${y - h / 2})`}
      style={{ cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <defs>
        <filter id={`glow-n-${label.replace(/\s/g,'')}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={hovered ? 5 : 3} result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Outer glow halo */}
      <rect x={-6} y={-6} width={w + 12} height={h + 12}
        rx={18} ry={18} fill="none"
        stroke={color} strokeWidth={hovered ? 2 : 1}
        opacity={hovered ? 0.3 : 0.12}
        filter={`url(#glow-n-${label.replace(/\s/g,'')})`}
        style={{ transition: 'all 0.3s' }}
      />

      {/* Card background */}
      <rect x={0} y={0} width={w} height={h} rx={14} ry={14}
        fill={`${color}0${hovered ? 'f' : '8'}`}
        stroke={color}
        strokeWidth={hovered || active ? 1.5 : 0.75}
        opacity={1}
        style={{ transition: 'all 0.3s' }}
      />

      {/* Top glint */}
      <rect x={14} y={1} width={w - 28} height={2} rx={1}
        fill={color} opacity={0.5}
      />

      {/* Emoji */}
      <text x={w / 2} y={h * 0.42} textAnchor="middle"
        fontSize={size === 'lg' ? 22 : 18} fontFamily="Segoe UI Emoji"
      >{emoji}</text>

      {/* Label */}
      <text x={w / 2} y={h * 0.7} textAnchor="middle"
        fill={color} fontSize={size === 'lg' ? 11 : 9.5}
        fontFamily="Outfit" fontWeight="700"
      >{label}</text>

      {/* Sublabel */}
      {sublabel && (
        <text x={w / 2} y={h * 0.87} textAnchor="middle"
          fill={color} fontSize="7.5" opacity="0.6" fontFamily="Outfit"
        >{sublabel}</text>
      )}
    </g>
  );
};

// ── Layer header ─────────────────────────────────────────────────
const LayerLabel = ({ x, label, color }) => (
  <g>
    <text x={x} y={18} textAnchor="middle"
      fill={color} fontSize="7" opacity="0.55"
      fontFamily="Outfit" fontWeight="700" letterSpacing="0.12em"
    >{label}</text>
    <line x1={x - 40} y1={22} x2={x + 40} y2={22}
      stroke={color} strokeWidth="0.5" opacity="0.2"
      strokeDasharray="3 3"
    />
  </g>
);

const techStack = [
  { label: 'React', desc: 'Frontend UI', color: '#38bdf8', emoji: '⚛️', tag: 'Frontend' },
  { label: 'Vite', desc: 'Build Tool', color: '#a78bfa', emoji: '⚡', tag: 'Frontend' },
  { label: 'Node.js', desc: 'API Server', color: '#34d399', emoji: '🟢', tag: 'Backend' },
  { label: 'Python', desc: 'AI/ML Engine', color: '#fbbf24', emoji: '🐍', tag: 'AI' },
  { label: 'MongoDB', desc: 'Primary DB', color: '#4ade80', emoji: '🍃', tag: 'Database' },
  { label: 'LangChain', desc: 'RAG Pipeline', color: '#c4b5fd', emoji: '🔗', tag: 'AI' },
  { label: 'OpenAI', desc: 'LLM Engine', color: '#10b981', emoji: '🤖', tag: 'AI' },
  { label: 'Pinecone', desc: 'Vector DB', color: '#a78bfa', emoji: '📌', tag: 'AI' },
  { label: 'OAuth 2.0', desc: 'Auth System', color: '#f97316', emoji: '🔐', tag: 'Security' },
  { label: 'Redis', desc: 'Cache Layer', color: '#f87171', emoji: '⚡', tag: 'Infra' },
  { label: 'AWS S3', desc: 'File Storage', color: '#fb923c', emoji: '☁️', tag: 'Storage' },
  { label: 'WebSocket', desc: 'Real-time', color: '#22d3ee', emoji: '📡', tag: 'Backend' },
];

const tagColors = {
  Frontend: '#38bdf8', Backend: '#34d399', AI: '#c4b5fd',
  Database: '#4ade80', Security: '#f97316', Infra: '#f87171',
  Storage: '#fb923c',
};

const ragSteps = [
  { label: 'User Input', icon: '💬', color: '#38bdf8', desc: 'Student types message in natural language' },
  { label: 'Embedding', icon: '🔢', color: '#7c3aed', desc: 'Text → high-dim vector via OpenAI embeddings' },
  { label: 'Vector Search', icon: '🔍', color: '#c4b5fd', desc: 'Pinecone finds semantically similar therapy docs' },
  { label: 'Context Retrieval', icon: '📚', color: '#a78bfa', desc: 'Top-K relevant passages retrieved from context DB' },
  { label: 'LLM Prompt', icon: '🤖', color: '#10b981', desc: 'GPT-4 + retrieved context → structured prompt' },
  { label: 'Empathetic Response', icon: '💜', color: '#f472b6', desc: 'Emotionally calibrated, safe, compassionate reply' },
];

export default function Architecture() {
  const [activeNode, setActiveNode] = useState(null);
  const [activeTag, setActiveTag] = useState('All');
  const tags = ['All', ...Object.keys(tagColors)];

  // SVG diagram layout — all x,y in a 900×320 viewBox
  const NODES = {
    react:   { x: 90,  y: 120, emoji: '⚛️', label: 'React App',    sublabel: 'Vite + Router', color: '#38bdf8', size: 'lg' },
    pwa:     { x: 90,  y: 240, emoji: '📱', label: 'Mobile PWA',   sublabel: 'Responsive',    color: '#38bdf8', size: 'sm' },
    gateway: { x: 250, y: 160, emoji: '🔀', label: 'API Gateway',  sublabel: 'Rate + CORS',   color: '#7c3aed', size: 'lg' },
    auth:    { x: 250, y: 270, emoji: '🔐', label: 'OAuth 2.0',    sublabel: 'JWT Tokens',    color: '#f97316', size: 'sm' },
    node:    { x: 430, y: 110, emoji: '🟢', label: 'Node.js',      sublabel: 'Express API',   color: '#34d399' },
    python:  { x: 430, y: 200, emoji: '🐍', label: 'Python AI',    sublabel: 'FastAPI',       color: '#fbbf24' },
    ws:      { x: 430, y: 285, emoji: '📡', label: 'WebSocket',    sublabel: 'Real-time',     color: '#22d3ee', size: 'sm' },
    lang:    { x: 620, y: 110, emoji: '🔗', label: 'LangChain',    sublabel: 'Orchestrator',  color: '#c4b5fd' },
    gpt:     { x: 620, y: 200, emoji: '🤖', label: 'OpenAI GPT',   sublabel: 'LLM Engine',    color: '#10b981' },
    pine:    { x: 620, y: 285, emoji: '📌', label: 'Pinecone',     sublabel: 'Vector Store',  color: '#a78bfa', size: 'sm' },
    mongo:   { x: 810, y: 110, emoji: '🍃', label: 'MongoDB',      sublabel: 'Student Data',  color: '#4ade80' },
    s3:      { x: 810, y: 200, emoji: '☁️', label: 'AWS S3',       sublabel: 'Session Logs',  color: '#fb923c' },
    redis:   { x: 810, y: 285, emoji: '⚡', label: 'Redis',        sublabel: 'Cache Layer',   color: '#f87171', size: 'sm' },
  };

  const EDGES = [
    // Frontend → Gateway
    { from: 'react',   to: 'gateway', color: '#38bdf8', label: 'HTTPS', packets: 2 },
    { from: 'pwa',     to: 'gateway', color: '#38bdf8',                  packets: 1 },
    // Gateway → Services
    { from: 'gateway', to: 'node',    color: '#7c3aed', label: 'REST',   packets: 2 },
    { from: 'gateway', to: 'python',  color: '#7c3aed', label: 'gRPC',   packets: 1 },
    { from: 'gateway', to: 'ws',      color: '#22d3ee',                  packets: 1 },
    { from: 'gateway', to: 'auth',    color: '#f97316',                  packets: 1 },
    // Services → AI
    { from: 'node',    to: 'lang',    color: '#34d399', label: 'RAG',    packets: 2 },
    { from: 'python',  to: 'gpt',     color: '#fbbf24',                  packets: 1 },
    { from: 'python',  to: 'pine',    color: '#fbbf24',                  packets: 1 },
    // AI → Data
    { from: 'lang',    to: 'pine',    color: '#c4b5fd', label: 'Embed',  packets: 1 },
    { from: 'gpt',     to: 'mongo',   color: '#10b981',                  packets: 1 },
    { from: 'node',    to: 'mongo',   color: '#34d399', label: 'CRUD',   packets: 2 },
    { from: 'node',    to: 'redis',   color: '#f87171',                  packets: 1 },
    { from: 'node',    to: 's3',      color: '#fb923c',                  packets: 1 },
  ];

  const filteredStack = activeTag === 'All' ? techStack : techStack.filter(t => t.tag === activeTag);

  return (
    <div className="page-container">

      {/* Page header */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 5,
          background: 'linear-gradient(135deg, #22d3ee, #7c3aed, #f472b6)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>⚙️ System Architecture</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Neon-lit blueprint of MindMitra's intelligent infrastructure — live data flows animated
        </p>
      </div>

      {/* ── SVG Node Diagram ──────────────────────────────────────── */}
      <div style={{
        borderRadius: 24, marginBottom: 24, overflow: 'hidden',
        background: 'radial-gradient(ellipse at 30% 40%, rgba(124,58,237,0.07) 0%, rgba(6,182,212,0.04) 50%, transparent 80%), rgba(255,255,255,0.02)',
        border: '1px solid rgba(124,58,237,0.18)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 0 80px rgba(124,58,237,0.07), 0 12px 48px rgba(0,0,0,0.4)',
        animation: 'cinematic-fade 0.5s ease both',
      }}>
        {/* Panel header */}
        <div style={{
          padding: '18px 28px 14px',
          background: 'linear-gradient(90deg, rgba(124,58,237,0.10) 0%, rgba(34,211,238,0.05) 50%, transparent)',
          borderBottom: '1px solid rgba(255,255,255,0.045)',
          display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 11,
              background: 'rgba(124,58,237,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem',
              boxShadow: '0 0 14px rgba(124,58,237,0.4)',
            }}>🕸️</div>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 1 }}>Infrastructure Topology</h3>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Hover nodes to inspect · Animated data flow</p>
            </div>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px',
            borderRadius: 999, background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)',
            fontSize: '0.68rem', fontWeight: 700, color: '#34d399',
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 6px #34d399', animation: 'pulse-glow-soft 2s ease-in-out infinite' }} />
            Live
          </div>
        </div>

        {/* SVG Diagram */}
        <div style={{ padding: '12px 0 20px', overflowX: 'auto' }}>
          <svg viewBox="0 0 900 320" style={{ width: '100%', minWidth: 700, height: 320 }}>
            {/* Grid lines */}
            {[180, 340, 520, 720].map(x => (
              <line key={x} x1={x} y1={30} x2={x} y2={310}
                stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="3 5"
              />
            ))}

            {/* Layer labels */}
            <LayerLabel x={90}  label="CLIENT"   color="#38bdf8" />
            <LayerLabel x={250} label="GATEWAY"  color="#7c3aed" />
            <LayerLabel x={430} label="SERVICES" color="#34d399" />
            <LayerLabel x={620} label="AI CORE"  color="#c4b5fd" />
            <LayerLabel x={810} label="DATA"     color="#4ade80" />

            {/* Edges */}
            {EDGES.map((e, i) => {
              const from = NODES[e.from], to = NODES[e.to];
              return (
                <NeonEdge key={i}
                  x1={from.x} y1={from.y}
                  x2={to.x}   y2={to.y}
                  color={e.color} label={e.label}
                  packets={e.packets || 1}
                />
              );
            })}

            {/* Nodes */}
            {Object.entries(NODES).map(([key, n]) => (
              <CyberNode key={key}
                x={n.x} y={n.y}
                emoji={n.emoji} label={n.label}
                sublabel={n.sublabel} color={n.color}
                size={n.size || 'md'}
                active={activeNode === key}
                onClick={() => setActiveNode(activeNode === key ? null : key)}
              />
            ))}
          </svg>
        </div>

        {/* Node detail panel */}
        {activeNode && NODES[activeNode] && (
          <div style={{
            margin: '0 24px 20px',
            padding: '14px 18px', borderRadius: 14,
            background: `${NODES[activeNode].color}08`,
            border: `1px solid ${NODES[activeNode].color}30`,
            display: 'flex', alignItems: 'center', gap: 14,
            animation: 'cinematic-fade 0.3s ease both',
          }}>
            <span style={{ fontSize: '2rem', filter: `drop-shadow(0 0 8px ${NODES[activeNode].color})` }}>
              {NODES[activeNode].emoji}
            </span>
            <div>
              <div style={{ fontWeight: 800, color: NODES[activeNode].color, marginBottom: 3 }}>
                {NODES[activeNode].label}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                {NODES[activeNode].sublabel} · Click another node to inspect
              </div>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <div style={{
                padding: '4px 12px', borderRadius: 999, fontSize: '0.7rem', fontWeight: 700,
                background: `${NODES[activeNode].color}15`, border: `1px solid ${NODES[activeNode].color}30`,
                color: NODES[activeNode].color,
              }}>Selected</div>
            </div>
          </div>
        )}
      </div>

      {/* ── Tech Stack Grid ───────────────────────────────────────── */}
      <div style={{
        borderRadius: 24, padding: '24px 28px', marginBottom: 24,
        background: 'rgba(255,255,255,0.02)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(56,189,248,0.14)',
        animation: 'cinematic-fade 0.5s ease 0.15s both',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18, flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 11, fontSize: '1.1rem',
              background: 'rgba(56,189,248,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 14px rgba(56,189,248,0.2)',
            }}>🛠️</div>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 1 }}>Technology Stack</h3>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Production-ready infrastructure</p>
            </div>
          </div>
          {/* Tag filters */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {tags.map(t => (
              <button key={t} onClick={() => setActiveTag(t)}
                style={{
                  padding: '4px 12px', borderRadius: 999, border: 'none',
                  background: activeTag === t ? (tagColors[t] ? `${tagColors[t]}25` : 'rgba(124,58,237,0.2)') : 'rgba(255,255,255,0.04)',
                  color: activeTag === t ? (tagColors[t] || '#c4b5fd') : 'var(--text-muted)',
                  border: `1px solid ${activeTag === t ? (tagColors[t] || '#c4b5fd') + '40' : 'rgba(255,255,255,0.06)'}`,
                  cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700,
                  transition: 'all 0.25s',
                }}
              >{t}</button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(128px,1fr))', gap: 12 }}>
          {filteredStack.map((t, i) => (
            <div key={t.label} style={{
              padding: '18px 14px', borderRadius: 18, textAlign: 'center',
              background: `${t.color}07`,
              border: `1px solid ${t.color}20`,
              cursor: 'default', transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
              animation: `cinematic-fade 0.4s ease ${i * 0.05}s both`,
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
                e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.35), 0 0 20px ${t.color}20`;
                e.currentTarget.style.borderColor = `${t.color}45`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = `${t.color}20`;
              }}
            >
              <div style={{ fontSize: '1.6rem', marginBottom: 8, filter: `drop-shadow(0 0 6px ${t.color}60)` }}>{t.emoji}</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: t.color, marginBottom: 3 }}>{t.label}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: 8, lineHeight: 1.4 }}>{t.desc}</div>
              <span style={{
                fontSize: '0.6rem', padding: '2px 9px', borderRadius: 99,
                background: `${t.color}12`, border: `1px solid ${t.color}30`,
                color: t.color, fontWeight: 700,
              }}>{t.tag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── RAG Pipeline ─────────────────────────────────────────── */}
      <div style={{
        borderRadius: 24, padding: '24px 28px',
        background: 'linear-gradient(135deg, rgba(34,211,238,0.04) 0%, rgba(124,58,237,0.05) 100%)',
        border: '1px solid rgba(34,211,238,0.12)',
        backdropFilter: 'blur(20px)',
        animation: 'cinematic-fade 0.5s ease 0.3s both',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 11, fontSize: '1.1rem',
            background: 'rgba(34,211,238,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 14px rgba(34,211,238,0.2)',
          }}>🌐</div>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 1 }}>AI RAG Pipeline Flow</h3>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>How Buddy understands and responds to you</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'stretch', flexWrap: 'wrap', justifyContent: 'center', gap: 0 }}>
          {ragSteps.map((step, i) => (
            <React.Fragment key={step.label}>
              {/* Step card */}
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '0 10px', minWidth: 100, maxWidth: 130,
                animation: `cinematic-fade 0.5s ease ${i * 0.08}s both`,
              }}>
                <div style={{
                  width: 58, height: 58, borderRadius: 18, marginBottom: 10,
                  background: `${step.color}12`,
                  border: `1.5px solid ${step.color}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.4rem',
                  boxShadow: `0 0 14px ${step.color}25`,
                  transition: 'all 0.3s',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px) scale(1.08)';
                    e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.3), 0 0 24px ${step.color}40`;
                    e.currentTarget.style.borderColor = `${step.color}80`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = `0 0 14px ${step.color}25`;
                    e.currentTarget.style.borderColor = `${step.color}40`;
                  }}
                >
                  <span style={{ filter: `drop-shadow(0 0 4px ${step.color})` }}>{step.icon}</span>
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: step.color, textAlign: 'center', marginBottom: 4 }}>{step.label}</div>
                <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5 }}>{step.desc}</div>
                {/* Step number */}
                <div style={{
                  marginTop: 8, width: 18, height: 18, borderRadius: '50%',
                  background: `${step.color}15`, border: `1px solid ${step.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.6rem', fontWeight: 700, color: step.color,
                }}>{i + 1}</div>
              </div>

              {/* Arrow connector */}
              {i < ragSteps.length - 1 && (
                <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, padding: '0 4px' }}>
                  <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                  }}>
                    <div style={{
                      width: 28, height: 2,
                      background: `linear-gradient(90deg, ${step.color}, ${ragSteps[i + 1].color})`,
                      boxShadow: `0 0 6px ${step.color}50`,
                      borderRadius: 1,
                      position: 'relative',
                    }}>
                      <div style={{
                        position: 'absolute', right: -5, top: '50%',
                        transform: 'translateY(-50%)',
                        width: 0, height: 0,
                        borderTop: '4px solid transparent',
                        borderBottom: '4px solid transparent',
                        borderLeft: `6px solid ${ragSteps[i + 1].color}`,
                        filter: `drop-shadow(0 0 3px ${ragSteps[i + 1].color})`,
                      }} />
                    </div>
                    {/* Animated packet dot */}
                    <div style={{
                      width: 4, height: 4, borderRadius: '50%',
                      background: step.color,
                      boxShadow: `0 0 4px ${step.color}`,
                      animation: `neon-flow ${1.2 + i * 0.2}s ease-in-out infinite`,
                      animationDelay: `${i * 0.3}s`,
                    }} />
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
