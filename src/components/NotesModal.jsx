import React, { useState, useEffect } from 'react';
import { X, Save, FileText, ExternalLink, Bookmark, CheckCircle2 } from 'lucide-react';
import { DIFFICULTY_COLORS } from '../utils/theme';

export function NotesModal({ 
  problem, 
  isOpen, 
  onClose, 
  savedNote, 
  onSaveNote, 
  isSolved, 
  onToggleSolved,
  isBookmarked,
  onToggleBookmark 
}) {
  const [text, setText] = useState('');

  useEffect(() => {
    setText(savedNote || '');
  }, [savedNote, isOpen]);

  if (!isOpen || !problem) return null;

  const diffTheme = DIFFICULTY_COLORS[problem.difficulty] || DIFFICULTY_COLORS.Medium;

  const handleSave = () => {
    onSaveNote(problem.id, text);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                LC #{problem.lcNo}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${diffTheme.badge}`}>
                {problem.difficulty}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                {problem.topic}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {problem.title}
            </h3>
            {problem.pattern && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                💡 <span className="font-medium text-slate-700 dark:text-slate-300">{problem.pattern}</span>
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          
          {/* Quick controls bar */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onToggleSolved(problem.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isSolved
                    ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSolved ? 'Solved' : 'Mark as Solved'}</span>
              </button>

              <button
                onClick={() => onToggleBookmark(problem.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isBookmarked
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-amber-400'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
                <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
              </button>
            </div>

            <a
              href={problem.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
            >
              <span>Solve on LeetCode</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Personal notes area */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
              <FileText className="w-4 h-4 text-blue-500" />
              <span>Personal Notes & Key Takeaways</span>
            </label>
            <p className="text-xs text-slate-400 mb-2">
              Write your approach, time/space complexity notes, edge cases, or key intuition here.
            </p>
            <textarea
              rows={6}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. Approach: Use two pointers moving inward from both ends. Time: O(n), Space: O(1). Edge case: Array with only negative numbers..."
              className="w-full p-3.5 rounded-xl text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono placeholder:font-sans placeholder:text-slate-400 transition-all resize-y"
            />
          </div>

          {problem.companies && problem.companies.length > 0 && (
            <div>
              <p className="text-xs font-medium text-slate-400 mb-1.5">Asked in target companies:</p>
              <div className="flex flex-wrap gap-1.5">
                {problem.companies.map((c, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Notes</span>
          </button>
        </div>

      </div>
    </div>
  );
}
