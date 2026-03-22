import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

export const moodList = [
  { id: 'happy', emoji: '😊', label: 'Happy', color: '#34d399', colorBg: 'rgba(52,211,153,0.15)' },
  { id: 'calm', emoji: '😌', label: 'Calm', color: '#38bdf8', colorBg: 'rgba(56,189,248,0.15)' },
  { id: 'anxious', emoji: '😰', label: 'Anxious', color: '#fb923c', colorBg: 'rgba(251,146,60,0.15)' },
  { id: 'stressed', emoji: '😤', label: 'Stressed', color: '#f87171', colorBg: 'rgba(248,113,113,0.15)' },
  { id: 'tired', emoji: '😴', label: 'Tired', color: '#a78bfa', colorBg: 'rgba(167,139,250,0.15)' },
];

const initialMoodHistory = [
  { day: 'Mon', stress: 45, anxiety: 30, focus: 70, mood: 'calm' },
  { day: 'Tue', stress: 60, anxiety: 50, focus: 55, mood: 'anxious' },
  { day: 'Wed', stress: 35, anxiety: 25, focus: 80, mood: 'happy' },
  { day: 'Thu', stress: 70, anxiety: 65, focus: 40, mood: 'stressed' },
  { day: 'Fri', stress: 50, anxiety: 40, focus: 60, mood: 'tired' },
  { day: 'Sat', stress: 25, anxiety: 20, focus: 85, mood: 'happy' },
  { day: 'Sun', stress: 30, anxiety: 25, focus: 78, mood: 'calm' },
];

export function AppProvider({ children }) {
  const [currentMood, setCurrentMood] = useState('calm');
  const [moodHistory, setMoodHistory] = useState(initialMoodHistory);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, role: 'ai', text: "Hey there! I'm Buddy, your personal wellness companion 🌸 How are you feeling today?", time: new Date() },
  ]);
  const [streak, setStreak] = useState(3);
  const [activePage, setActivePage] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName] = useState('Aryan');

  const emotions = {
    stress: 48,
    anxiety: 35,
    focus: 72,
    energy: 60,
    mood_score: 68,
  };

  const addMessage = (msg) => {
    setChatMessages(prev => [...prev, { id: Date.now(), ...msg, time: new Date() }]);
  };

  const setMood = (moodId) => {
    setCurrentMood(moodId);
    const today = new Date().toLocaleDateString('en', { weekday: 'short' });
    setMoodHistory(prev => prev.map(d =>
      d.day === today ? { ...d, mood: moodId } : d
    ));
  };

  return (
    <AppContext.Provider value={{
      currentMood, setMood,
      moodHistory,
      chatMessages, addMessage,
      streak,
      activePage, setActivePage,
      sidebarOpen, setSidebarOpen,
      emotions,
      userName,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
};
