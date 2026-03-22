import React, { Suspense, lazy } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import ParticleField from './components/ParticleField';
import FloatingCompanion from './components/FloatingCompanion';
import AnimeBackground from './components/AnimeBackground';

// Lazy load pages for performance
const Home = lazy(() => import('./pages/Home'));
const Chat = lazy(() => import('./pages/Chat'));
const EmotionHub = lazy(() => import('./pages/EmotionHub'));
const Wellness = lazy(() => import('./pages/Wellness'));
const Profile = lazy(() => import('./pages/Profile'));
const Architecture = lazy(() => import('./pages/Architecture'));

const PageLoader = () => (
  <div style={{
    height: 'calc(100vh - 64px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexDirection: 'column', gap: 16,
  }}>
    <div style={{
      width: 48, height: 48,
      border: '2px solid rgba(124,58,237,0.2)',
      borderTop: '2px solid #7c3aed',
      borderRadius: '50%',
      animation: 'spin-slow 0.8s linear infinite',
    }} />
    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Loading...</div>
  </div>
);

function Router() {
  const { activePage } = useApp();

  const pages = {
    home: <Home />,
    chat: <Chat />,
    emotions: <EmotionHub />,
    wellness: <Wellness />,
    profile: <Profile />,
    architecture: <Architecture />,
  };

  return (
    <Suspense fallback={<PageLoader />}>
      <div key={activePage} style={{ animation: 'slide-in-up 0.35s cubic-bezier(0.4,0,0.2,1) both' }}>
        {pages[activePage] || <Home />}
      </div>
    </Suspense>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AnimeBackground />
      <ParticleField />
      <FloatingCompanion />
      <Layout>
        <Router />
      </Layout>
    </AppProvider>
  );
}
