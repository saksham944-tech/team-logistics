// Mock chat AI responses based on keywords
export const aiResponses = [
  {
    keywords: ['stress', 'stressed', 'overwhelmed', 'pressure'],
    responses: [
      "I can sense you're feeling a lot of pressure right now 💜 Remember — it's okay to take a step back. Would you like to try a quick 4-7-8 breathing exercise?",
      "Study stress can feel really heavy. You don't have to carry it alone 🌙 Let's break it down together. What's weighing on you most right now?",
      "Stress is your mind's signal that something needs attention. Let's listen to it — want to try a 5-minute guided breathing session? 🌿",
    ],
  },
  {
    keywords: ['sad', 'unhappy', 'down', 'depressed', 'cry', 'crying'],
    responses: [
      "It's completely okay to feel sad sometimes, friend 🌸 Your feelings are valid. Would journaling about it help? Sometimes getting thoughts on paper brings clarity.",
      "I'm here with you in this moment 💙 You don't have to pretend to be okay. What do you think is at the root of this feeling?",
      "Sadness visits all of us. You're brave for acknowledging it 🌙 Want me to share some gentle coping techniques?",
    ],
  },
  {
    keywords: ['anxious', 'anxiety', 'worried', 'nervous', 'panic'],
    responses: [
      "Anxiety can feel like a storm inside 🌊 Try this — name 5 things you can see right now. Grounding techniques really help. Let me know how it goes!",
      "Your anxiety is being heard 💜 Let's slow everything down. Take one deep breath with me and then tell me what's triggering you.",
      "When anxiety hits, remember: this moment will pass 🌸 You've handled hard moments before. Want to do a quick calming exercise together?",
    ],
  },
  {
    keywords: ['tired', 'exhausted', 'sleep', 'fatigue', 'energy'],
    responses: [
      "Feeling tired is your body asking for rest 🌙 Have you had enough water and breaks today? Sleep is healing — don't underestimate it.",
      "Mental exhaustion is real and valid 💤 Sometimes the most productive thing you can do is rest. What's been draining your energy lately?",
      "Low energy might mean your nervous system needs a recharge 🌿 Want some gentle restorative activity suggestions?",
    ],
  },
  {
    keywords: ['happy', 'good', 'great', 'amazing', 'wonderful', 'excited'],
    responses: [
      "That genuinely makes me happy! 🌸✨ Positive energy is so important. What's been making you feel this way? Let's celebrate it!",
      "Yay!! Seeing you in good spirits makes my day brighter too 💫 Hold onto this feeling — want to log it in your mood journal?",
      "Such wonderful energy! 🌟 Keep nurturing what brings you joy. Would you like to explore any activities to amplify this feeling?",
    ],
  },
  {
    keywords: ['breathing', 'breath', 'meditate', 'meditation', 'exercise'],
    responses: [
      "Let's do the 4-7-8 technique 🌿: Inhale for 4 counts... hold for 7... exhale for 8. Repeat 3 times. How do you feel after?",
      "Deep breathing activates your parasympathetic nervous system 🧘‍♀️ Try box breathing: 4 counts in, 4 hold, 4 out, 4 hold. I'll guide you!",
    ],
  },
  {
    keywords: ['help', 'alone', 'lonely', 'nobody', 'no one'],
    responses: [
      "You're not alone — I'm right here with you 💙 And there are people who care about you. Want me to share some resources for connecting with others?",
      "Feeling alone is one of the hardest feelings. But reaching out like this takes courage 🌸 I'm really glad you're talking to me. What would help most right now?",
    ],
  },
];

export const defaultResponses = [
  "I hear you 💜 Tell me more about what's on your mind — I'm here to listen without judgment.",
  "Thank you for sharing that with me 🌸 Every feeling you have matters. How can I support you better right now?",
  "That's really insightful to notice about yourself 🌟 Self-awareness is the first step to healing. What would you like to explore further?",
  "I'm here, fully present with you 🌙 Let's navigate this together, one breath at a time.",
  "It sounds like you're going through something significant 💜 You deserve support. Want to try one of our calming techniques or just keep talking?",
];

export const quickReplies = [
  "I'm feeling stressed 😰",
  "Want to talk about my day 💬",
  "Try a breathing exercise 🌿",
  "I need motivation ✨",
  "I'm feeling anxious 😟",
  "Help me focus 🎯",
];

export const wellnessActivities = [
  {
    id: 'breathe',
    title: 'Mindful Breathing',
    subtitle: '4-7-8 Technique',
    emoji: '🌿',
    duration: '5 min',
    tag: 'Stress Relief',
    tagColor: '#34d399',
    color: 'rgba(52,211,153,0.12)',
    border: 'rgba(52,211,153,0.25)',
  },
  {
    id: 'journal',
    title: 'Thought Journal',
    subtitle: 'Express & Release',
    emoji: '📔',
    duration: '10 min',
    tag: 'Mindfulness',
    tagColor: '#c4b5fd',
    color: 'rgba(167,139,250,0.12)',
    border: 'rgba(167,139,250,0.25)',
  },
  {
    id: 'music',
    title: 'Lo-Fi Session',
    subtitle: 'Calm your mind',
    emoji: '🎵',
    duration: '∞',
    tag: 'Relaxation',
    tagColor: '#38bdf8',
    color: 'rgba(56,189,248,0.12)',
    border: 'rgba(56,189,248,0.25)',
  },
  {
    id: 'walk',
    title: 'Nature Walk',
    subtitle: 'Ground yourself',
    emoji: '🌸',
    duration: '20 min',
    tag: 'Movement',
    tagColor: '#fb923c',
    color: 'rgba(251,146,60,0.12)',
    border: 'rgba(251,146,60,0.25)',
  },
  {
    id: 'sleep',
    title: 'Sleep Hygiene',
    subtitle: 'Rest & Recover',
    emoji: '🌙',
    duration: '8 hrs',
    tag: 'Recovery',
    tagColor: '#a78bfa',
    color: 'rgba(139,92,246,0.12)',
    border: 'rgba(139,92,246,0.25)',
  },
  {
    id: 'study',
    title: 'Focus Sprint',
    subtitle: 'Pomodoro Method',
    emoji: '⏱️',
    duration: '25 min',
    tag: 'Productivity',
    tagColor: '#fbbf24',
    color: 'rgba(251,191,36,0.12)',
    border: 'rgba(251,191,36,0.25)',
  },
];

export const avatarOptions = [
  { id: 1, emoji: '🐱', name: 'Neko', bg: 'linear-gradient(135deg, #7c3aed, #ec4899)' },
  { id: 2, emoji: '🦊', name: 'Kitsune', bg: 'linear-gradient(135deg, #f97316, #fbbf24)' },
  { id: 3, emoji: '🐺', name: 'Ookami', bg: 'linear-gradient(135deg, #3b82f6, #06b6d4)' },
  { id: 4, emoji: '🐼', name: 'Panda', bg: 'linear-gradient(135deg, #374151, #6b7280)' },
  { id: 5, emoji: '🦋', name: 'Chou', bg: 'linear-gradient(135deg, #8b5cf6, #06b6d4)' },
  { id: 6, emoji: '🐰', name: 'Usagi', bg: 'linear-gradient(135deg, #ec4899, #f9a8d4)' },
  { id: 7, emoji: '🌙', name: 'Tsuki', bg: 'linear-gradient(135deg, #1e1b4b, #4c1d95)' },
  { id: 8, emoji: '⭐', name: 'Hoshi', bg: 'linear-gradient(135deg, #fbbf24, #f97316)' },
];
