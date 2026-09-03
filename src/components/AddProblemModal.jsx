import React, { useState } from 'react';
import { X, Plus, Sparkles, Link, Tag, Building2, BookOpen } from 'lucide-react';

export function AddProblemModal({
  isOpen,
  onClose,
  onAddProblem,
  existingTopics = []
}) {
  const [title, setTitle] = useState('');
  const [lcNo, setLcNo] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [topic, setTopic] = useState(existingTopics[0] || 'Arrays');
  const [customTopic, setCustomTopic] = useState('');
  const [pattern, setPattern] = useState('');
  const [companies, setCompanies] = useState('');
  const [url, setUrl] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a problem title.');
      return;
    }

    const finalTopic = topic === 'NEW_TOPIC' ? (customTopic.trim() || 'General') : topic;
    const companyList = companies
      .split(',')
      .map(c => c.trim())
      .filter(Boolean);

    onAddProblem({
      title: title.trim(),
      lcNo: lcNo.trim(),
      difficulty,
      topic: finalTopic,
      pattern: pattern.trim(),
      companies: companyList,
      url: url.trim()
    });

    // Reset & close
    setTitle('');
    setLcNo('');
    setDifficulty('Medium');
    setTopic(existingTopics[0] || 'Arrays');
    setCustomTopic('');
    setPattern('');
    setCompanies('');
    setUrl('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Add Custom Problem
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Add any new problem directly to your personal tracker
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          
          {/* Title & LC Number */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Problem Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Trapping Rain Water"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                LeetCode #
              </label>
              <input
                type="text"
                value={lcNo}
                onChange={(e) => setLcNo(e.target.value)}
                placeholder="e.g. 42"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>

          {/* Difficulty & Topic */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Topic
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {existingTopics.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
                <option value="NEW_TOPIC">+ Create New Topic...</option>
              </select>
            </div>
          </div>

          {/* Custom Topic Input if selected */}
          {topic === 'NEW_TOPIC' && (
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                New Topic Name
              </label>
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="e.g. Bitmask DP"
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* LeetCode URL */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              LeetCode URL (Optional)
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://leetcode.com/problems/... (leave blank to auto-generate)"
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Core Concept / Pattern */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Core Sub-Pattern / Concept (Optional)
            </label>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="e.g. Monotonic Stack, Two Pointers (Converging)"
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Target Companies */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Target Companies (Comma separated, optional)
            </label>
            <input
              type="text"
              value={companies}
              onChange={(e) => setCompanies(e.target.value)}
              placeholder="e.g. Google, Amazon, Meta"
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Problem</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
