import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, MessageCircle, Brain, Leaf, User, Network, Menu, X, Shield, Bell } from 'lucide-react';

const navItems = [
  { id: 'home', label: 'Dashboard', icon: LayoutDashboard, emoji: '🏠' },
  { id: 'chat', label: 'AI Companion', icon: MessageCircle, emoji: '💬' },
  { id: 'emotions', label: 'Emotion Hub', icon: Brain, emoji: '🧠' },
  { id: 'wellness', label: 'Wellness', icon: Leaf, emoji: '🌿' },
  { id: 'profile', label: 'My Profile', icon: User, emoji: '👤' },
  { id: 'architecture', label: 'Architecture', icon: Network, emoji: '⚙️' },
];

const pageTitles = {
  home: 'Dashboard',
  chat: 'AI Companion',
  emotions: 'Emotion Hub',
  wellness: 'Wellness Tracker',
  profile: 'My Profile',
  architecture: 'System Architecture',
};

export default function Layout({ children }) {
  const { activePage, setActivePage, sidebarOpen, setSidebarOpen, userName } = useApp();
  const [notifications] = useState(3);

  return (
    <div className="app-layout">
      {/* Background */}
      <div className="anime-bg">
        <div className="anime-bg-layers">
          <div className="moon-glow" />
          <div className="city-silhouette" />
          <div className="horizon-glow" />
          <div className="scanlines" />
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 45,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
          }}
        />
      )}

      {/* Sidebar */}
      <nav className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">🌸</div>
          <span className="logo-text">MindCare</span>
        </div>

        <div className="nav-section-label">Navigation</div>

        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => { setActivePage(item.id); setSidebarOpen(false); }}
            style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
          >
            <span className="nav-item-icon">
              <item.icon size={18} />
            </span>
            <span>{item.label}</span>
            {item.id === 'chat' && (
              <span style={{
                marginLeft: 'auto',
                background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                color: 'white',
                fontSize: '0.65rem',
                padding: '2px 7px',
                borderRadius: '999px',
                fontWeight: 700,
              }}>AI</span>
            )}
          </button>
        ))}

        <div className="divider" />

        {/* Bottom user */}
        <div className="sidebar-bottom">
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 12px', marginBottom: 8,
            fontSize: '0.75rem', color: 'var(--text-muted)',
          }}>
            <Shield size={12} style={{ color: '#34d399' }} />
            <span>Your data is private 🔒</span>
          </div>
          <div className="sidebar-user">
            <div className="user-avatar-sm">🦊</div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{userName}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Student · Active</div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main */}
      <div className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              className="btn-icon"
              onClick={() => setSidebarOpen(v => !v)}
              style={{ display: 'flex' }}
              id="menu-toggle"
            >
              <Menu size={18} />
            </button>
            <div>
              <div className="topbar-title">{pageTitles[activePage]}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>

          <div className="topbar-actions">
            <div
              className="tooltip"
              data-tip={`${notifications} new insights`}
              style={{ position: 'relative' }}
            >
              <button className="btn-icon" id="notifications-btn">
                <Bell size={18} />
                {notifications > 0 && (
                  <span style={{
                    position: 'absolute', top: -3, right: -3,
                    width: 14, height: 14,
                    background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                    borderRadius: '50%',
                    fontSize: '0.6rem', fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{notifications}</span>
                )}
              </button>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 12px 6px 6px',
              borderRadius: 999,
              background: 'var(--glass)',
              border: '1px solid var(--border)',
              cursor: 'pointer',
            }}
              onClick={() => setActivePage('profile')}
              id="profile-topbar-btn"
            >
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.95rem',
              }}>🦊</div>
              <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{userName}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
