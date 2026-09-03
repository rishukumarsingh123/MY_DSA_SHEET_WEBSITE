import React from 'react';

/**
 * Modern Vector Brand Logo for Rishu Kumar Singh
 * Features: Stylized Geometric "R" emblem fused with code bracket `< / >` and AI node accent.
 * Responsive, scalable, pixel-perfect on both Light and Dark themes.
 */
export function BrandIcon({ className = "w-10 h-10" }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} flex-shrink-0 transition-transform duration-300 hover:scale-105`}
    >
      <defs>
        {/* Background Gradient */}
        <linearGradient id="rishuBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="50%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>

        {/* Outer Glow Gradient */}
        <linearGradient id="rishuBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>

        {/* Letter 'R' Metallic/Neon Gradient */}
        <linearGradient id="rishuRGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>

        {/* AI Accent Gradient */}
        <linearGradient id="rishuAiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>

        {/* Soft Drop Shadow */}
        <filter id="rishuGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#3b82f6" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Rounded Squircle Container */}
      <rect
        x="5"
        y="5"
        width="90"
        height="90"
        rx="24"
        fill="url(#rishuBgGrad)"
        stroke="url(#rishuBorderGrad)"
        strokeWidth="2.5"
        filter="url(#rishuGlow)"
      />

      {/* Inner Decorative Tech Lines */}
      <path
        d="M 16 28 L 32 28 M 68 76 L 84 76"
        stroke="#38bdf8"
        strokeWidth="1.5"
        strokeOpacity="0.4"
        strokeLinecap="round"
      />

      {/* Geometric Futuristic Letter "R" */}
      {/* 1. Vertical Spine */}
      <path
        d="M 28 24 L 28 76"
        stroke="url(#rishuRGrad)"
        strokeWidth="7"
        strokeLinecap="round"
      />

      {/* 2. Upper Loop fused with Code Bracket styling */}
      <path
        d="M 28 28 L 52 28 C 66 28 72 37 72 46 C 72 55 65 62 52 62 L 28 62"
        stroke="url(#rishuRGrad)"
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 3. Dynamic Forward Leg */}
      <path
        d="M 48 58 L 72 76"
        stroke="url(#rishuRGrad)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* AI Core Glowing Node (Center point) */}
      <circle cx="50" cy="45" r="4.5" fill="#38bdf8" />
      <circle cx="50" cy="45" r="8" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.6" />

      {/* AI Pulse Sparks (Top Right) */}
      <circle cx="76" cy="22" r="3" fill="#ec4899" />
      <circle cx="83" cy="28" r="1.8" fill="#38bdf8" />
      <line x1="76" y1="22" x2="83" y2="28" stroke="#818cf8" strokeWidth="1" strokeOpacity="0.7" />
    </svg>
  );
}

export function BrandLogo({ size = 'md', showBadge = true, onClick }) {
  if (size === 'icon') {
    return <BrandIcon className="w-9 h-9" />;
  }

  if (size === 'lg') {
    return (
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 cursor-pointer group" onClick={onClick}>
        <BrandIcon className="w-16 h-16 sm:w-20 sm:h-20 shadow-2xl rounded-2xl" />
        <div className="text-center sm:text-left space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-white via-blue-100 to-cyan-300 bg-clip-text text-transparent">
              RISHU KUMAR SINGH
            </h1>
            {showBadge && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-cyan-300 border border-cyan-400/40">
                CSE (AI)
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-blue-200 tracking-wide">
            DSA Practice & Interview Mastery Hub
          </p>
          <p className="text-xs text-slate-300 font-mono">
            "Practice. Solve. Improve."
          </p>
        </div>
      </div>
    );
  }

  // Default 'md' (Header)
  return (
    <div className="flex items-center space-x-3 cursor-pointer group" onClick={onClick}>
      <BrandIcon className="w-10 h-10 sm:w-11 sm:h-11 shadow-md shadow-blue-500/20" />
      <div className="flex flex-col">
        <div className="flex items-center space-x-2">
          <span className="text-base sm:text-lg font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-cyan-200 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
            Rishu Kumar Singh
          </span>
          {showBadge && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-cyan-300 border border-blue-200 dark:border-blue-800">
              CSE (AI)
            </span>
          )}
        </div>
        <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-blue-600 dark:text-blue-400">My DSA Journey</span>
          <span>•</span>
          <span className="text-[11px] font-medium">Practice. Solve. Improve.</span>
        </div>
      </div>
    </div>
  );
}
