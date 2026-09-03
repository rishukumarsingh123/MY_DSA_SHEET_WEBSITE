import React from 'react';
import { ExternalLink, Bookmark, FileText, Check, Trash2 } from 'lucide-react';
import { DIFFICULTY_COLORS } from '../utils/theme';

export function ProblemRow({
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
    <tr className={`border-b border-slate-200/80 dark:border-slate-800/80 transition-colors group ${
      isSolved 
        ? 'bg-emerald-50/30 dark:bg-emerald-950/15 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/25' 
        : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
    }`}>
      
      {/* Solved Checkbox */}
      <td className="py-3.5 pl-4 pr-2 text-center w-12">
        <button
          onClick={() => onToggleSolved(problem.id)}
          aria-label={isSolved ? 'Mark as unsolved' : 'Mark as solved'}
          className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
            isSolved
              ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30 scale-105'
              : 'border-2 border-slate-300 dark:border-slate-600 hover:border-emerald-500 dark:hover:border-emerald-400 bg-white dark:bg-slate-900'
          }`}
        >
          {isSolved && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>
      </td>

      {/* LC Number */}
      <td className="py-3.5 px-3 font-mono text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap w-16">
        #{problem.lcNo || '-'}
      </td>

      {/* Title & Concept / Pattern */}
      <td className="py-3.5 px-3 min-w-[220px]">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className={`font-semibold text-sm transition-colors ${
              isSolved 
                ? 'text-slate-800 dark:text-slate-200 line-through opacity-80 decoration-slate-400' 
                : 'text-slate-900 dark:text-white'
            }`}>
              {problem.title}
            </span>
            {problem.isCustom && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                Custom
              </span>
            )}
          </div>

          {(problem.patternsRaw || problem.pattern) && (
            <span 
              title={problem.patternsRaw || problem.pattern}
              className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1"
            >
              💡 {problem.patternsRaw || problem.pattern}
            </span>
          )}
        </div>
      </td>

      {/* Topic */}
      <td className="py-3.5 px-3 whitespace-nowrap">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60">
          {problem.topic}
        </span>
      </td>

      {/* Difficulty */}
      <td className="py-3.5 px-3 whitespace-nowrap">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${diffTheme.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${diffTheme.dot}`}></span>
          {problem.difficulty}
        </span>
      </td>

      {/* Target Companies */}
      <td className="py-3.5 px-3 hidden lg:table-cell max-w-[200px]">
        {problem.companies && problem.companies.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {problem.companies.slice(0, 2).map((comp, idx) => (
              <span
                key={idx}
                className="px-1.5 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              >
                {comp}
              </span>
            ))}
            {problem.companies.length > 2 && (
              <span className="px-1 py-0.5 rounded text-[10px] text-slate-400">
                +{problem.companies.length - 2}
              </span>
            )}
          </div>
        ) : (
          <span className="text-slate-400 text-xs">-</span>
        )}
      </td>

      {/* Actions: Notes, Bookmark, Delete, Solve Button */}
      <td className="py-3.5 px-3 text-right whitespace-nowrap">
        <div className="flex items-center justify-end space-x-1.5">
          
          {/* Notes Button */}
          <button
            onClick={() => onOpenNotes(problem)}
            title={hasNote ? 'Edit note' : 'Add note'}
            className={`p-1.5 rounded-lg transition-colors ${
              hasNote
                ? 'text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
          </button>

          {/* Bookmark Button */}
          <button
            onClick={() => onToggleBookmark(problem.id)}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark problem'}
            className={`p-1.5 rounded-lg transition-colors ${
              isBookmarked
                ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/60'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
          </button>

          {/* Delete Problem Button */}
          {onDeleteProblem && (
            <button
              onClick={handleDelete}
              title="Remove problem from tracker"
              className="p-1.5 rounded-lg text-slate-300 dark:text-slate-600 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          {/* Solve LeetCode Button */}
          <a
            href={problem.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 active:scale-95 text-white transition-all shadow-sm shadow-blue-500/20"
          >
            <span>Solve</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

        </div>
      </td>

    </tr>
  );
}
