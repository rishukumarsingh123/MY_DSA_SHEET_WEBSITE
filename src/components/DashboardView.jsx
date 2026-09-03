import React from 'react';
import { 
  CheckCircle2, 
  CircleDot, 
  Dices, 
  ArrowRight, 
  Flame, 
  Target, 
  Zap, 
  ExternalLink,
  BookOpen,
  Sparkles,
  TrendingUp,
  GraduationCap
} from 'lucide-react';
import { DIFFICULTY_COLORS, TOPIC_ICONS, formatTimeAgo } from '../utils/theme';

import { BrandLogo } from './BrandLogo';

export function DashboardView({
  stats,
  allProblems,
  onNavigateToProblems,
  onOpenRandomModal,
  onOpenNotes
}) {
  const { 
    totalProblems, 
    solvedCount, 
    unsolvedCount, 
    overallPercentage, 
    diffStats, 
    topicStats, 
    streak, 
    solvedTodayCount,
    recentSolved 
  } = stats;

  const topicsList = Object.keys(topicStats);

  const patternCountsByTopic = React.useMemo(() => {
    const map = {};
    (allProblems || []).forEach(p => {
      if (!map[p.topic]) map[p.topic] = new Set();
      if (p.pattern) map[p.topic].add(p.pattern);
    });
    const res = {};
    Object.keys(map).forEach(t => {
      res[t] = map[t].size;
    });
    return res;
  }, [allProblems]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Hero Motivational Banner featuring Rishu's Brand Logo & Profile */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 text-white p-6 sm:p-8 lg:p-10 shadow-2xl border border-slate-800/80">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-blue-500/15 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-16 w-60 h-60 rounded-full bg-indigo-500/15 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          
          <BrandLogo size="lg" />

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap gap-3">
            <button
              onClick={onOpenRandomModal}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold bg-white text-slate-950 hover:bg-blue-50 transition-all shadow-lg hover:shadow-blue-500/25 active:scale-95"
            >
              <Dices className="w-4 h-4 text-blue-600" />
              <span>Pick Next Problem</span>
            </button>

            <button
              onClick={() => onNavigateToProblems()}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold bg-blue-600/30 hover:bg-blue-600/50 text-white border border-blue-500/40 transition-all active:scale-95"
            >
              <span>Explore Problems ({totalProblems})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Progress Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Progress
            </span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {overallPercentage}%
            </span>
            <span className="text-xs font-medium text-slate-400">
              ({solvedCount}/{totalProblems})
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${overallPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Solved Problems */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Solved
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {solvedCount}
            </span>
            <span className="text-xs text-slate-400 font-medium">completed</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {unsolvedCount} questions remaining to conquer
          </p>
        </div>

        {/* Solved Today */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Solved Today
            </span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">
              {solvedTodayCount}
            </span>
            <span className="text-xs text-slate-400 font-medium">problems</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Target: {stats.dailyGoal || 3} daily solutions
          </p>
        </div>

        {/* Streak */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Active Streak
            </span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500">
              <Flame className="w-4 h-4 fill-amber-500" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-extrabold text-amber-500">
              {streak} {streak === 1 ? 'Day' : 'Days'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {streak > 0 ? 'Keep the momentum going! 🔥' : 'Solve a problem today to build streak!'}
          </p>
        </div>

      </div>

      {/* Difficulty Breakdown Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Difficulty Breakdown
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track your mastery across Easy, Medium, and Hard tiers
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Easy', 'Medium', 'Hard'].map((diff) => {
            const data = diffStats[diff] || { total: 0, solved: 0, percentage: 0 };
            const theme = DIFFICULTY_COLORS[diff];

            return (
              <div
                key={diff}
                onClick={() => onNavigateToProblems({ difficulty: diff })}
                className={`p-5 rounded-2xl border bg-white dark:bg-slate-900 transition-all hover:shadow-md cursor-pointer group ${theme.border}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${theme.dot}`}></span>
                    <h4 className="font-bold text-base text-slate-900 dark:text-white">
                      {diff}
                    </h4>
                  </div>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${theme.badge}`}>
                    {data.percentage}%
                  </span>
                </div>

                <div className="flex items-baseline justify-between mb-3">
                  <span className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
                    {data.solved} <span className="text-sm font-normal text-slate-400">/ {data.total}</span>
                  </span>
                  <span className="text-xs text-blue-600 dark:text-blue-400 group-hover:underline flex items-center gap-1 font-medium">
                    Filter <ArrowRight className="w-3 h-3" />
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
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

      {/* Topic-Wise Progress Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Topic & Pattern Roadmaps
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              22 structured DSA topics organized across 100+ patterns
            </p>
          </div>
          <button
            onClick={() => onNavigateToProblems()}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            View All in Sheet <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {topicsList.map((topicName) => {
            const data = topicStats[topicName] || { total: 0, solved: 0, percentage: 0 };
            const icon = TOPIC_ICONS[topicName] || '📌';
            const patternCount = patternCountsByTopic[topicName] || 0;

            return (
              <div
                key={topicName}
                onClick={() => onNavigateToProblems({ topic: topicName })}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-700/60 transition-all hover:shadow-sm cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xl flex-shrink-0">{icon}</span>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                          {topicName}
                        </h4>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500">
                          {patternCount} {patternCount === 1 ? 'pattern' : 'patterns'}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 flex-shrink-0">
                      {data.solved}/{data.total}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 mt-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">{data.percentage}% done</span>
                    <span className="text-blue-600 dark:text-blue-400 font-medium group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      Practice <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${data.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Feed */}
      {recentSolved && recentSolved.length > 0 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Recently Solved
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Problems you've marked solved recently
          </p>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentSolved.map(({ problem, timestamp }) => {
              const diffTheme = DIFFICULTY_COLORS[problem.difficulty] || DIFFICULTY_COLORS.Medium;
              return (
                <div
                  key={problem.id}
                  className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-slate-400">#{problem.lcNo}</span>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {problem.title}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span>{problem.topic}</span>
                        <span>•</span>
                        <span className={diffTheme.text}>{problem.difficulty}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-slate-400 hidden sm:inline">
                      {formatTimeAgo(timestamp)}
                    </span>
                    <a
                      href={problem.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Open on LeetCode"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
