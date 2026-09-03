import React, { useRef } from 'react';
import { 
  TrendingUp, 
  CheckCircle2, 
  CircleDot, 
  Download, 
  Upload, 
  RotateCcw, 
  Bookmark, 
  FileText, 
  Building2,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { DIFFICULTY_COLORS, TOPIC_ICONS } from '../utils/theme';

export function ProgressView({
  stats,
  allProblems,
  onNavigateToProblems,
  exportProgress,
  importProgress,
  resetProgress
}) {
  const fileInputRef = useRef(null);
  const { 
    totalProblems, 
    solvedCount, 
    unsolvedCount, 
    overallPercentage, 
    diffStats, 
    topicStats, 
    companyStats, 
    bookmarkedCount, 
    notesCount 
  } = stats;

  const topicsList = Object.keys(topicStats);

  // Top companies sorted by count
  const sortedCompanies = Object.entries(companyStats)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 10);

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
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Completion Rate
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
              {overallPercentage}%
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {solvedCount} of {totalProblems} questions solved
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Remaining Questions
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-200">
              {unsolvedCount}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {Math.round((unsolvedCount / (totalProblems || 1)) * 100)}% left in the sheet
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Bookmarked
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-amber-500">
              {bookmarkedCount}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Flagged for review
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Personal Notes
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-indigo-500">
              {notesCount}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Problems with custom intuition notes
          </p>
        </div>

      </div>

      {/* Difficulty Breakdown Deep-Dive */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
          Difficulty Breakdown
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Detailed completion rates across difficulty levels
        </p>

        <div className="space-y-6">
          {['Easy', 'Medium', 'Hard'].map((diff) => {
            const data = diffStats[diff] || { total: 0, solved: 0, percentage: 0 };
            const theme = DIFFICULTY_COLORS[diff];

            return (
              <div key={diff} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${theme.dot}`}></span>
                    <span className="font-bold text-slate-900 dark:text-white">{diff}</span>
                    <span className="text-xs text-slate-400">({data.total} total)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {data.solved} / {data.total} Solved
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${theme.badge}`}>
                      {data.percentage}%
                    </span>
                  </div>
                </div>

                <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${theme.bar}`}
                    style={{ width: `${data.percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Topic Completion Breakdown */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Topic-Wise Completion (15 Topics)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Detailed tracking of your progress across all DSA categories
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topicsList.map((topicName) => {
            const data = topicStats[topicName] || { total: 0, solved: 0, percentage: 0 };
            const icon = TOPIC_ICONS[topicName] || '📌';

            return (
              <div
                key={topicName}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{icon}</span>
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {topicName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {data.solved}/{data.total}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300">
                      {data.percentage}%
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mt-1">
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-300"
                      style={{ width: `${data.percentage}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => onNavigateToProblems({ topic: topicName })}
                      className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      Practice problems <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Target Companies Breakdown */}
      {sortedCompanies.length > 0 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
            Target Companies Frequency
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Most frequent interview companies represented in your sheet
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {sortedCompanies.map(([comp, countData]) => {
              const compSolvedPercent = countData.total > 0 ? Math.round((countData.solved / countData.total) * 100) : 0;
              return (
                <div
                  key={comp}
                  onClick={() => onNavigateToProblems({ company: comp })}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-blue-400 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                      {comp}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {countData.solved}/{countData.total}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden mt-2">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                      style={{ width: `${compSolvedPercent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Data Management & Backup Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
          Backup & Data Persistence
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          All your solved problems, bookmarks, and notes are saved directly in your browser's local storage. You can export a JSON backup at any time to keep your progress safe.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={exportProgress}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Backup (JSON)</span>
          </button>

          <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Import Backup</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to reset all your progress? This cannot be undone.')) {
                resetProgress();
              }
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset All Progress</span>
          </button>
        </div>
      </div>

    </div>
  );
}
