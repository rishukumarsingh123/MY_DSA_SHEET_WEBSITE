import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ListOrdered, 
  TrendingUp, 
  Moon, 
  Sun, 
  Download, 
  Upload, 
  RotateCcw, 
  Search, 
  Flame, 
  Settings, 
  CheckCircle2,
  GraduationCap
} from 'lucide-react';

import { BrandLogo } from './BrandLogo';

export function Header({ 
  activeTab, 
  setActiveTab, 
  theme, 
  toggleTheme, 
  stats, 
  searchQuery, 
  setSearchQuery,
  exportProgress,
  importProgress,
  resetProgress,
  onOpenRandomModal
}) {
  const [showSettings, setShowSettings] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const fileInputRef = useRef(null);
  const settingsRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
        setShowResetConfirm(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result;
      if (typeof content === 'string') {
        const result = importProgress(content);
        if (result.success) {
          alert('Progress restored successfully! 🎉');
        } else {
          alert(`Failed to import progress: ${result.error}`);
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
    setShowSettings(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo & Personal Title */}
          <div className="flex items-center space-x-3">
            <BrandLogo size="md" onClick={() => setActiveTab('dashboard')} />
            {stats.streak > 0 && (
              <span className="hidden xl:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-800 animate-pulse-subtle">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                {stats.streak}d streak
              </span>
            )}
          </div>

          {/* Navigation Tabs (Desktop) */}
          <nav className="hidden md:flex items-center space-x-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('problems')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'problems'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ListOrdered className="w-4 h-4" />
              <span>Problems</span>
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-xs font-mono bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300">
                {stats.totalProblems}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('progress')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'progress'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Progress & Analytics</span>
            </button>
          </nav>

          {/* Right Section: Search & Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Quick Overall Progress Pill */}
            <div 
              onClick={() => setActiveTab('progress')}
              className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 cursor-pointer hover:opacity-90 transition-opacity"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <div className="text-xs">
                <span className="font-bold text-emerald-700 dark:text-emerald-300">{stats.solvedCount}</span>
                <span className="text-slate-400">/{stats.totalProblems}</span>
                <span className="ml-1.5 font-semibold text-emerald-600 dark:text-emerald-400">({stats.overallPercentage}%)</span>
              </div>
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 sm:p-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Settings & Backup Dropdown */}
            <div className="relative" ref={settingsRef}>
              <button
                onClick={() => setShowSettings(!showSettings)}
                aria-label="Settings"
                className="p-2 sm:p-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition-colors"
              >
                <Settings className="w-4 h-4" />
              </button>

              {showSettings && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 text-sm animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">Data Management</p>
                    <p className="text-xs text-slate-400">Your progress is saved locally</p>
                  </div>

                  <button
                    onClick={() => {
                      exportProgress();
                      setShowSettings(false);
                    }}
                    className="w-full text-left px-4 py-2.5 flex items-center space-x-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <Download className="w-4 h-4 text-blue-500" />
                    <div>
                      <div className="font-medium">Export Backup (JSON)</div>
                      <div className="text-xs text-slate-400">Save your progress offline</div>
                    </div>
                  </button>

                  <label className="w-full cursor-pointer px-4 py-2.5 flex items-center space-x-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                    <Upload className="w-4 h-4 text-emerald-500" />
                    <div>
                      <div className="font-medium">Import Backup</div>
                      <div className="text-xs text-slate-400">Restore from JSON file</div>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>

                  {!showResetConfirm ? (
                    <button
                      onClick={() => setShowResetConfirm(true)}
                      className="w-full text-left px-4 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center space-x-2.5 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Reset All Progress</span>
                    </button>
                  ) : (
                    <div className="px-4 py-2 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 rounded-lg mx-2 my-1">
                      <p className="text-xs text-rose-700 dark:text-rose-300 font-semibold mb-2">Are you sure? This cannot be undone.</p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            resetProgress();
                            setShowSettings(false);
                            setShowResetConfirm(false);
                          }}
                          className="px-2.5 py-1 text-xs bg-rose-600 hover:bg-rose-700 text-white rounded font-medium"
                        >
                          Yes, Reset
                        </button>
                        <button
                          onClick={() => setShowResetConfirm(false)}
                          className="px-2.5 py-1 text-xs bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-200 dark:border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-1.5 py-1 px-3 rounded-lg transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          
          <button
            onClick={() => setActiveTab('problems')}
            className={`flex items-center space-x-1.5 py-1 px-3 rounded-lg transition-colors ${
              activeTab === 'problems'
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <ListOrdered className="w-4 h-4" />
            <span>Problems ({stats.totalProblems})</span>
          </button>

          <button
            onClick={() => setActiveTab('progress')}
            className={`flex items-center space-x-1.5 py-1 px-3 rounded-lg transition-colors ${
              activeTab === 'progress'
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Progress</span>
          </button>
        </div>

      </div>
    </header>
  );
}
