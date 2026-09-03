import React, { useState, useMemo } from 'react';
import { X, Dices, ExternalLink, Sparkles, CheckCircle2, Bookmark, ArrowRight } from 'lucide-react';
import { DIFFICULTY_COLORS } from '../utils/theme';

export function RandomProblemModal({
  isOpen,
  onClose,
  allProblems,
  solvedMap,
  onToggleSolved,
  onOpenNotes
}) {
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [onlyUnsolved, setOnlyUnsolved] = useState(true);
  const [pickedProblem, setPickedProblem] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const topics = useMemo(() => {
    return Array.from(new Set(allProblems.map(p => p.topic))).sort();
  }, [allProblems]);

  const candidatePool = useMemo(() => {
    return allProblems.filter(p => {
      if (onlyUnsolved && solvedMap[p.id]) return false;
      if (selectedDifficulty !== 'All' && p.difficulty !== selectedDifficulty) return false;
      if (selectedTopic !== 'All' && p.topic !== selectedTopic) return false;
      return true;
    });
  }, [allProblems, solvedMap, onlyUnsolved, selectedDifficulty, selectedTopic]);

  const handlePickRandom = () => {
    if (candidatePool.length === 0) {
      setPickedProblem(null);
      return;
    }
    setIsSpinning(true);
    let counter = 0;
    const interval = setInterval(() => {
      const randIdx = Math.floor(Math.random() * candidatePool.length);
      setPickedProblem(candidatePool[randIdx]);
      counter++;
      if (counter > 8) {
        clearInterval(interval);
        setIsSpinning(false);
      }
    }, 60);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Dices className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Pick a Practice Problem
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {candidatePool.length} problems match your criteria
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter options */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Difficulty
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Topic
              </label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Topics</option>
                {topics.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <label className="flex items-center space-x-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={onlyUnsolved}
              onChange={(e) => setOnlyUnsolved(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
            />
            <span>Only pick from Unsolved problems</span>
          </label>

          {/* Picked Card Result */}
          {pickedProblem ? (
            <div className={`p-4 rounded-xl border transition-all ${
              isSpinning ? 'opacity-50 scale-98' : 'opacity-100 scale-100'
            } bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700`}>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                  LC #{pickedProblem.lcNo}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  DIFFICULTY_COLORS[pickedProblem.difficulty]?.badge
                }`}>
                  {pickedProblem.difficulty}
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                {pickedProblem.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                📂 {pickedProblem.topic} {pickedProblem.pattern ? `• 💡 ${pickedProblem.pattern}` : ''}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700/80">
                <button
                  onClick={() => onToggleSolved(pickedProblem.id)}
                  className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-emerald-600 flex items-center gap-1"
                >
                  <CheckCircle2 className={`w-4 h-4 ${solvedMap[pickedProblem.id] ? 'text-emerald-500 fill-emerald-500/20' : ''}`} />
                  <span>{solvedMap[pickedProblem.id] ? 'Solved' : 'Mark Solved'}</span>
                </button>

                <a
                  href={pickedProblem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                >
                  <span>Solve on LeetCode</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              <Sparkles className="w-8 h-8 text-indigo-400 mx-auto mb-2 opacity-60" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {candidatePool.length > 0 
                  ? 'Click "Roll the Dice" below to pick your next challenge!' 
                  : 'No problems match the current filter criteria.'}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
          
          <button
            disabled={candidatePool.length === 0 || isSpinning}
            onClick={handlePickRandom}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white shadow-md shadow-indigo-500/25 transition-all"
          >
            <Dices className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>{pickedProblem ? 'Roll Again' : 'Roll the Dice'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
