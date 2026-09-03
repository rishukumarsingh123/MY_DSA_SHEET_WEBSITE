import React from 'react';
import { ExternalLink, Bookmark, FileText, Check, Trash2 } from 'lucide-react';
import { DIFFICULTY_COLORS } from '../utils/theme';

export function ProblemCard({
  problem,
  isSolved,
  isBookmarked,
  hasNote,
  onToggleSolved,
  onToggleBookmark,
  onOpenNotes,
  onDeleteProblem
}) {
  const diffTheme = DIFFICULTY_COLORS[problem.difficulty] || DIFFICULTY_COLORS.Medium;

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to remove "${problem.title}" from your sheet?`)) {
      onDeleteProblem(problem.id);
    }
  };

  return (
    <div className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between group ${
      isSolved
        ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300/60 dark:border-emerald-800/40 shadow-sm'
        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm hover:shadow-md'
    }`}>
      <div>
        {/* Top bar: Checkbox, LC#, Difficulty, Bookmark */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSolved(problem.id)}
              aria-label={isSolved ? 'Mark as unsolved' : 'Mark as solved'}
              className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                isSolved
                  ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                  : 'border-2 border-slate-300 dark:border-slate-600 hover:border-emerald-500 dark:hover:border-emerald-400 bg-white dark:bg-slate-900'
              }`}
            >
              {isSolved && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </button>
            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              #{problem.lcNo || '-'}
            </span>
            {problem.isCustom && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                Custom
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${diffTheme.badge}`}>
              {problem.difficulty}
            </span>
            <button
              onClick={() => onToggleBookmark(problem.id)}
              className={`p-1.5 rounded-lg transition-colors ${
                isBookmarked
                  ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/60'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
            </button>
            {onDeleteProblem && (
              <button
                onClick={handleDelete}
                title="Remove problem"
                className="p-1.5 rounded-lg text-slate-300 dark:text-slate-600 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <h4 className={`text-sm font-bold leading-snug mb-1.5 ${
          isSolved 
            ? 'text-slate-700 dark:text-slate-300 line-through opacity-80 decoration-slate-400' 
            : 'text-slate-900 dark:text-white'
        }`}>
          {problem.title}
        </h4>

        {/* Concept / Pattern */}
        {(problem.patternsRaw || problem.pattern) && (
          <p 
            title={problem.patternsRaw || problem.pattern}
            className="text-xs text-slate-500 dark:text-slate-400 mb-2 line-clamp-2"
          >
            💡 {problem.patternsRaw || problem.pattern}
          </p>
        )}

        {/* Topic Pill */}
        <div className="flex flex-wrap gap-1 mb-3">
          <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {problem.topic}
          </span>
          {problem.companies && problem.companies.slice(0, 2).map((c, i) => (
            <span key={i} className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100/70 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400">
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 mt-2">
        <button
          onClick={() => onOpenNotes(problem)}
          className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg transition-colors ${
            hasNote
              ? 'text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-300 font-semibold'
              : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{hasNote ? 'View Note' : 'Add Note'}</span>
        </button>

        <a
          href={problem.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-sm shadow-blue-500/20 transition-all"
        >
          <span>Solve</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
