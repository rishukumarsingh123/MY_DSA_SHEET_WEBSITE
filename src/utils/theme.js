export const DIFFICULTY_COLORS = {
  Easy: {
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/40 dark:border-emerald-700/40',
    dot: 'bg-emerald-500',
    bar: 'bg-emerald-500',
    border: 'border-emerald-500/20 dark:border-emerald-500/30',
    text: 'text-emerald-600 dark:text-emerald-400',
    cardBg: 'from-emerald-500/10 to-transparent'
  },
  Medium: {
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300/40 dark:border-amber-700/40',
    dot: 'bg-amber-500',
    bar: 'bg-amber-500',
    border: 'border-amber-500/20 dark:border-amber-500/30',
    text: 'text-amber-600 dark:text-amber-400',
    cardBg: 'from-amber-500/10 to-transparent'
  },
  Hard: {
    badge: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300/40 dark:border-rose-700/40',
    dot: 'bg-rose-500',
    bar: 'bg-rose-500',
    border: 'border-rose-500/20 dark:border-rose-500/30',
    text: 'text-rose-600 dark:text-rose-400',
    cardBg: 'from-rose-500/10 to-transparent'
  }
};

export const TOPIC_ICONS = {
  'Binary Search': '🔍',
  'Two Pointers': '👉👈',
  'Sorting': '📶',
  'Prefix Sum': '➕',
  'Sliding Window': '🪟',
  'Strings': '🔤',
  'Hashing': '🔑',
  'Linked List': '🔗',
  'Stack': '🥞',
  'Queue': '🎟️',
  'Heap': '⛰️',
  'Recursion': '🌀',
  'Trees': '🌳',
  'Graph': '🕸️',
  'Dynamic Programming': '🧩',
  'Greedy': '🎯',
  'Backtracking': '↩️',
  'Trie': '🌲',
  'Disjoint Set Union (DSU)': '🌐',
  'Segment Tree': '📐',
  'Bit Manipulation': '⚡',
  'Math & Number System': '🔢',
  // Backwards compatibility
  'Arrays': '📦',
  'Graphs': '🕸️',
  'Heap / Priority Queue': '⛰️',
  'Stack & Queue': '🥞',
  'Trie + Bit Manipulation + Math + Intervals': '⚡',
  'General': '📌'
};

export function formatTimeAgo(timestamp) {
  if (!timestamp) return '';
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay === 1) return 'Yesterday';
  if (diffDay < 30) return `${diffDay}d ago`;
  return new Date(timestamp).toLocaleDateString();
}
