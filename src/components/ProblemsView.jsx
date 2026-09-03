import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  Grid, 
  List, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  ChevronDown,
  ChevronUp,
  CheckCircle2, 
  CircleDot, 
  Bookmark, 
  FileText, 
  Building2, 
  ArrowUpDown,
  Sparkles,
  Dices,
  Plus,
  Layers,
  FolderOpen
} from 'lucide-react';
import { ProblemRow } from './ProblemRow';
import { ProblemCard } from './ProblemCard';
import { DIFFICULTY_COLORS, TOPIC_ICONS } from '../utils/theme';

export function ProblemsView({
  allProblems,
  solvedMap,
  bookmarkedMap,
  notesMap,
  onToggleSolved,
  onToggleBookmark,
  onOpenNotes,
  onDeleteProblem,
  onOpenAddModal,
  initialTopic = 'All',
  initialDifficulty = 'All',
  onOpenRandomModal
}) {
  // Filters State
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(initialTopic);
  const [selectedPattern, setSelectedPattern] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState(initialDifficulty);
  const [selectedStatus, setSelectedStatus] = useState('All'); // All | Solved | Unsolved | Bookmarked | HasNotes
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [sortBy, setSortBy] = useState('roadmap'); // roadmap | lcNo_asc | lcNo_desc | title_asc | diff_asc | diff_desc | status
  const [viewMode, setViewMode] = useState('subtopic'); // 'subtopic' | 'table' | 'card'
  const [collapsedSubtopics, setCollapsedSubtopics] = useState({});
  const [pageSize, setPageSize] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);

  // Sync initialTopic when props change
  useEffect(() => {
    if (initialTopic) {
      setSelectedTopic(initialTopic);
      setSelectedPattern('All');
      setCurrentPage(1);
    }
  }, [initialTopic]);

  useEffect(() => {
    if (initialDifficulty) {
      setSelectedDifficulty(initialDifficulty);
      setCurrentPage(1);
    }
  }, [initialDifficulty]);

  // Topic order definition
  const topicOrder = useMemo(() => [
    "Binary Search", "Two Pointers", "Sorting", "Prefix Sum", "Sliding Window",
    "Strings", "Hashing", "Linked List", "Stack", "Queue", "Heap",
    "Recursion", "Trees", "Graph", "Dynamic Programming", "Greedy",
    "Backtracking", "Trie", "Disjoint Set Union (DSU)", "Segment Tree",
    "Bit Manipulation", "Math & Number System"
  ], []);

  // Extract unique topics in roadmap order
  const topics = useMemo(() => {
    const existing = new Set(allProblems.map(p => p.topic));
    const ordered = topicOrder.filter(t => existing.has(t));
    allProblems.forEach(p => {
      if (!ordered.includes(p.topic)) ordered.push(p.topic);
    });
    return ordered;
  }, [allProblems, topicOrder]);

  // Subtopics strictly scoped to the selected topic!
  // If selectedTopic is 'All', return empty so the user is prompted to pick a topic first.
  const availablePatterns = useMemo(() => {
    if (selectedTopic === 'All') return [];
    const pool = allProblems.filter(p => p.topic === selectedTopic);
    const patMap = new Map();
    pool.forEach(p => {
      const pats = p.patterns && p.patterns.length > 0 ? p.patterns : [p.pattern];
      pats.forEach(pat => {
        if (pat && !patMap.has(pat)) {
          patMap.set(pat, p.patternIndex || 999);
        }
      });
    });
    return Array.from(patMap.entries())
      .sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0]))
      .map(entry => entry[0]);
  }, [allProblems, selectedTopic]);

  const companies = useMemo(() => {
    const compSet = new Set();
    allProblems.forEach(p => {
      if (p.companies && Array.isArray(p.companies)) {
        p.companies.forEach(c => compSet.add(c));
      }
    });
    return Array.from(compSet).sort();
  }, [allProblems]);

  // Filter & Sort Logic
  const filteredProblems = useMemo(() => {
    return allProblems.filter(p => {
      // Search query
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchLc = p.lcNo ? p.lcNo.toString().includes(q) : false;
        const matchTopic = p.topic.toLowerCase().includes(q);
        const matchPattern = p.patternsRaw 
          ? p.patternsRaw.toLowerCase().includes(q) 
          : (p.pattern ? p.pattern.toLowerCase().includes(q) : false);
        const matchCompanies = p.companiesRaw ? p.companiesRaw.toLowerCase().includes(q) : false;
        if (!matchTitle && !matchLc && !matchTopic && !matchPattern && !matchCompanies) {
          return false;
        }
      }

      // Topic Filter
      if (selectedTopic !== 'All' && p.topic !== selectedTopic) {
        return false;
      }

      // Pattern / Subtopic Filter (only applies when a topic is selected)
      if (selectedTopic !== 'All' && selectedPattern !== 'All') {
        const matchPrimary = p.pattern === selectedPattern;
        const matchAny = Array.isArray(p.patterns) && p.patterns.includes(selectedPattern);
        if (!matchPrimary && !matchAny) {
          return false;
        }
      }

      // Difficulty Filter
      if (selectedDifficulty !== 'All' && p.difficulty !== selectedDifficulty) {
        return false;
      }

      // Status Filter
      if (selectedStatus === 'Solved' && !solvedMap[p.id]) return false;
      if (selectedStatus === 'Unsolved' && solvedMap[p.id]) return false;
      if (selectedStatus === 'Bookmarked' && !bookmarkedMap[p.id]) return false;
      if (selectedStatus === 'HasNotes' && !notesMap[p.id]) return false;

      // Company Filter
      if (selectedCompany !== 'All') {
        if (!p.companies || !p.companies.includes(selectedCompany)) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'roadmap') {
        if (a.topic !== b.topic) {
          const rankA = topicOrder.indexOf(a.topic);
          const rankB = topicOrder.indexOf(b.topic);
          return (rankA === -1 ? 999 : rankA) - (rankB === -1 ? 999 : rankB);
        }
        const pA = a.patternIndex || 999;
        const pB = b.patternIndex || 999;
        if (pA !== pB) return pA - pB;
        const numA = parseInt(a.lcNo, 10) || a.id;
        const numB = parseInt(b.lcNo, 10) || b.id;
        return numA - numB;
      }
      if (sortBy === 'lcNo_asc') {
        const numA = parseInt(a.lcNo, 10) || a.id;
        const numB = parseInt(b.lcNo, 10) || b.id;
        return numA - numB;
      }
      if (sortBy === 'lcNo_desc') {
        const numA = parseInt(a.lcNo, 10) || a.id;
        const numB = parseInt(b.lcNo, 10) || b.id;
        return numB - numA;
      }
      if (sortBy === 'title_asc') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'diff_asc') {
        const rank = { Easy: 1, Medium: 2, Hard: 3 };
        return (rank[a.difficulty] || 2) - (rank[b.difficulty] || 2);
      }
      if (sortBy === 'diff_desc') {
        const rank = { Easy: 1, Medium: 2, Hard: 3 };
        return (rank[b.difficulty] || 2) - (rank[a.difficulty] || 2);
      }
      if (sortBy === 'status') {
        const solvedA = solvedMap[a.id] ? 1 : 0;
        const solvedB = solvedMap[b.id] ? 1 : 0;
        return solvedA - solvedB;
      }
      return 0;
    });
  }, [
    allProblems, 
    search, 
    selectedTopic, 
    selectedPattern,
    selectedDifficulty, 
    selectedStatus, 
    selectedCompany, 
    sortBy, 
    solvedMap, 
    bookmarkedMap, 
    notesMap,
    topicOrder
  ]);

  // Hierarchical Data: Grouped strictly as Topic -> Subtopics -> Questions
  const hierarchicalData = useMemo(() => {
    const topicRank = new Map(topicOrder.map((t, idx) => [t, idx]));
    const topicMap = new Map();

    filteredProblems.forEach(p => {
      if (!topicMap.has(p.topic)) {
        topicMap.set(p.topic, {
          topic: p.topic,
          topicIndex: topicRank.get(p.topic) ?? 999,
          subtopicsMap: new Map(),
          totalProblems: 0,
          solvedProblems: 0
        });
      }
      const tObj = topicMap.get(p.topic);
      tObj.totalProblems += 1;
      if (solvedMap[p.id]) tObj.solvedProblems += 1;

      const subName = p.pattern || 'General';
      if (!tObj.subtopicsMap.has(subName)) {
        tObj.subtopicsMap.set(subName, {
          pattern: subName,
          patternIndex: p.patternIndex || 999,
          problems: []
        });
      }
      tObj.subtopicsMap.get(subName).problems.push(p);
    });

    return Array.from(topicMap.values())
      .sort((a, b) => a.topicIndex - b.topicIndex || a.topic.localeCompare(b.topic))
      .map(tObj => {
        const subtopics = Array.from(tObj.subtopicsMap.values())
          .sort((a, b) => a.patternIndex - b.patternIndex || a.pattern.localeCompare(b.pattern));
        return {
          topic: tObj.topic,
          totalProblems: tObj.totalProblems,
          solvedProblems: tObj.solvedProblems,
          subtopics
        };
      });
  }, [filteredProblems, solvedMap, topicOrder]);

  // Collapse / Expand handlers
  const toggleSubtopic = (key) => {
    setCollapsedSubtopics(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const expandAll = () => setCollapsedSubtopics({});

  const collapseAll = () => {
    const all = {};
    hierarchicalData.forEach(tg => {
      tg.subtopics.forEach(sub => {
        all[`${tg.topic}_${sub.pattern}`] = true;
      });
    });
    setCollapsedSubtopics(all);
  };

  // Reset pagination on filter change
  const totalItems = filteredProblems.length;
  const totalPages = pageSize === 0 ? 1 : Math.ceil(totalItems / pageSize);

  const paginatedProblems = useMemo(() => {
    if (pageSize === 0) return filteredProblems;
    const start = (currentPage - 1) * pageSize;
    return filteredProblems.slice(start, start + pageSize);
  }, [filteredProblems, currentPage, pageSize]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const clearAllFilters = () => {
    setSearch('');
    setSelectedTopic('All');
    setSelectedPattern('All');
    setSelectedDifficulty('All');
    setSelectedStatus('All');
    setSelectedCompany('All');
    setSortBy('roadmap');
    setCurrentPage(1);
  };

  const hasActiveFilters = 
    search !== '' || 
    selectedTopic !== 'All' || 
    selectedPattern !== 'All' ||
    selectedDifficulty !== 'All' || 
    selectedStatus !== 'All' || 
    selectedCompany !== 'All';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Quick Topic Pills Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
        <button
          onClick={() => {
            setSelectedTopic('All');
            setSelectedPattern('All');
            setCurrentPage(1);
          }}
          className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            selectedTopic === 'All'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <span>All Topics</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${selectedTopic === 'All' ? 'bg-blue-700 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>
            {allProblems.length}
          </span>
        </button>

        {topics.map(t => {
          const icon = TOPIC_ICONS[t] || '📌';
          const isSelected = selectedTopic === t;
          const count = allProblems.filter(p => p.topic === t).length;
          return (
            <button
              key={t}
              onClick={() => {
                setSelectedTopic(t);
                setSelectedPattern('All');
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <span>{icon}</span>
              <span>{t}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isSelected ? 'bg-blue-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Search & Controls Section */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        
        {/* Top search & view toggles */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          
          {/* Main Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={selectedTopic !== 'All' ? `Search inside ${selectedTopic}...` : "Search by problem name, #LC, subtopic, or company..."}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Action buttons: Add Problem, Random, View Toggle */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end flex-wrap sm:flex-nowrap">
            
            {/* Add Problem Button */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/25 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Problem</span>
            </button>

            {/* Random Button */}
            <button
              onClick={onOpenRandomModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors"
            >
              <Dices className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Random</span>
            </button>

            {/* View Mode (Subtopics / Flat Table / Grid) */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewMode('subtopic')}
                title="Subtopics Roadmap View"
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  viewMode === 'subtopic'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Subtopics</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                title="Flat Table View"
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('card')}
                title="Cards Grid View"
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'card'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Filter Rows: Topic, Subtopic, Difficulty, Status, Company, Sort */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          
          {/* Topic Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Topic
            </label>
            <select
              value={selectedTopic}
              onChange={(e) => {
                setSelectedTopic(e.target.value);
                setSelectedPattern('All');
                setCurrentPage(1);
              }}
              className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Topics ({allProblems.length})</option>
              {topics.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Subtopic Selector: STRICTLY scoped to selectedTopic */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Subtopic {selectedTopic !== 'All' ? `(${selectedTopic})` : ''}
            </label>
            <select
              value={selectedPattern}
              disabled={selectedTopic === 'All'}
              onChange={(e) => {
                setSelectedPattern(e.target.value);
                setCurrentPage(1);
              }}
              className={`w-full text-xs p-2 rounded-lg border text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                selectedTopic === 'All'
                  ? 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {selectedTopic === 'All' ? (
                <option value="All">👈 Select a topic first</option>
              ) : (
                <>
                  <option value="All">All {selectedTopic} Subtopics ({availablePatterns.length})</option>
                  {availablePatterns.map(pat => (
                    <option key={pat} value={pat}>{pat}</option>
                  ))}
                </>
              )}
            </select>
          </div>

          {/* Difficulty Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Difficulty
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => {
                setSelectedDifficulty(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Status Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Solved">Solved</option>
              <option value="Unsolved">Unsolved</option>
              <option value="Bookmarked">Bookmarked ⭐</option>
              <option value="HasNotes">Has Notes 📝</option>
            </select>
          </div>

          {/* Target Company Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Company
            </label>
            <select
              value={selectedCompany}
              onChange={(e) => {
                setSelectedCompany(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Companies</option>
              {companies.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Sort By Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="roadmap">Roadmap Subtopic Order</option>
              <option value="lcNo_asc">LC # (Ascending)</option>
              <option value="lcNo_desc">LC # (Descending)</option>
              <option value="title_asc">Title (A - Z)</option>
              <option value="diff_asc">Difficulty (Easy → Hard)</option>
              <option value="diff_desc">Difficulty (Hard → Easy)</option>
              <option value="status">Status (Unsolved First)</option>
            </select>
          </div>

        </div>

        {/* Results summary & Expand/Collapse / Clear Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 text-xs text-slate-500 dark:text-slate-400 gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span>
              Showing <strong className="text-slate-900 dark:text-white">{filteredProblems.length}</strong> of {allProblems.length} problems
              {selectedTopic !== 'All' && <span> in <strong className="text-blue-600 dark:text-blue-400">{selectedTopic}</strong></span>}
            </span>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 font-medium ml-2"
              >
                <X className="w-3.5 h-3.5" />
                Clear Filters
              </button>
            )}
          </div>

          {/* Expand/Collapse All buttons in subtopic view */}
          {viewMode === 'subtopic' ? (
            <div className="flex items-center gap-2">
              <button
                onClick={expandAll}
                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                Expand All
              </button>
              <span>•</span>
              <button
                onClick={collapseAll}
                className="text-xs font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:underline"
              >
                Collapse All
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span>Show:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="text-xs p-1 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={0}>All ({filteredProblems.length})</option>
              </select>
            </div>
          )}
        </div>

      </div>

      {/* 3. Main Problem Display */}
      {filteredProblems.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <CircleDot className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-50" />
          <h4 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
            No problems found
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Try adjusting your search terms or clearing active filters.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl hover:bg-slate-300 transition-colors"
            >
              Reset All Filters
            </button>
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              + Add a Problem
            </button>
          </div>
        </div>
      ) : viewMode === 'subtopic' ? (
        
        /* Subtopics Roadmap View */
        <div className="space-y-6">
          {hierarchicalData.map((topicGroup) => {
            const topicIcon = TOPIC_ICONS[topicGroup.topic] || '📂';
            const topicPct = topicGroup.totalProblems > 0 
              ? Math.round((topicGroup.solvedProblems / topicGroup.totalProblems) * 100) 
              : 0;

            return (
              <div key={topicGroup.topic} className="space-y-4">
                
                {/* Topic Header banner (prominent when viewing All Topics or focused) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-blue-900/10 via-slate-100 to-indigo-900/10 dark:from-blue-950/40 dark:via-slate-900 dark:to-indigo-950/40 border border-slate-200 dark:border-slate-800 gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{topicIcon}</span>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{topicGroup.topic}</span>
                        {selectedTopic !== 'All' && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-normal">
                            Active Topic
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {topicGroup.subtopics.length} Subtopics • {topicGroup.totalProblems} Questions
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {topicGroup.solvedProblems}/{topicGroup.totalProblems} Solved
                      </span>
                      <span className="text-[11px] text-slate-400 ml-1">({topicPct}%)</span>
                    </div>
                    <div className="w-24 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                        style={{ width: `${topicPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Subtopics of this Topic */}
                <div className="space-y-3">
                  {topicGroup.subtopics.map((sub) => {
                    const subKey = `${topicGroup.topic}_${sub.pattern}`;
                    const isCollapsed = Boolean(collapsedSubtopics[subKey]);
                    const subSolved = sub.problems.filter(p => solvedMap[p.id]).length;
                    const subTotal = sub.problems.length;
                    const subPct = subTotal > 0 ? Math.round((subSolved / subTotal) * 100) : 0;

                    return (
                      <div
                        key={subKey}
                        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm transition-all"
                      >
                        {/* Subtopic Accordion Header */}
                        <div
                          onClick={() => toggleSubtopic(subKey)}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 bg-slate-50/70 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800/80 gap-2.5 cursor-pointer hover:bg-slate-100/70 dark:hover:bg-slate-800/80 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold font-mono shrink-0">
                              {sub.patternIndex < 10 ? `0${sub.patternIndex}` : sub.patternIndex}
                            </span>
                            <div className="min-w-0">
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 truncate">
                                <span>{sub.pattern}</span>
                              </h4>
                              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                {subTotal} {subTotal === 1 ? 'problem' : 'problems'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                              {subSolved}/{subTotal} solved ({subPct}%)
                            </span>
                            <div className="w-20 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                              <div
                                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                                style={{ width: `${subPct}%` }}
                              />
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSubtopic(subKey);
                              }}
                              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                              aria-label={isCollapsed ? 'Expand subtopic' : 'Collapse subtopic'}
                            >
                              {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Questions inside this Subtopic */}
                        {!isCollapsed && (
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm border-collapse">
                              <thead>
                                <tr className="border-b border-slate-200/70 dark:border-slate-800/70 bg-slate-50/40 dark:bg-slate-800/30 text-slate-500 dark:text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                                  <th className="py-2.5 pl-4 pr-2 text-center w-12">Status</th>
                                  <th className="py-2.5 px-3 w-16">#LC</th>
                                  <th className="py-2.5 px-3 min-w-[220px]">Problem</th>
                                  <th className="py-2.5 px-3">Difficulty</th>
                                  <th className="py-2.5 px-3 hidden lg:table-cell">Target Companies</th>
                                  <th className="py-2.5 px-3 text-right">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                {sub.problems.map((problem) => (
                                  <ProblemRow
                                    key={problem.id}
                                    problem={problem}
                                    isSolved={Boolean(solvedMap[problem.id])}
                                    isBookmarked={Boolean(bookmarkedMap[problem.id])}
                                    hasNote={Boolean(notesMap[problem.id])}
                                    onToggleSolved={onToggleSolved}
                                    onToggleBookmark={onToggleBookmark}
                                    onOpenNotes={onOpenNotes}
                                    onDeleteProblem={onDeleteProblem}
                                  />
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

              </div>
            );
          })}
        </div>

      ) : viewMode === 'table' ? (
        
        /* Flat Table View */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-3 pl-4 pr-2 text-center w-12">Status</th>
                  <th className="py-3 px-3 w-16">#LC</th>
                  <th className="py-3 px-3 min-w-[220px]">Problem & Subtopic</th>
                  <th className="py-3 px-3">Topic</th>
                  <th className="py-3 px-3">Difficulty</th>
                  <th className="py-3 px-3 hidden lg:table-cell">Target Companies</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {paginatedProblems.map((problem) => (
                  <ProblemRow
                    key={problem.id}
                    problem={problem}
                    isSolved={Boolean(solvedMap[problem.id])}
                    isBookmarked={Boolean(bookmarkedMap[problem.id])}
                    hasNote={Boolean(notesMap[problem.id])}
                    onToggleSolved={onToggleSolved}
                    onToggleBookmark={onToggleBookmark}
                    onOpenNotes={onOpenNotes}
                    onDeleteProblem={onDeleteProblem}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

      ) : (
        
        /* Flat Card Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedProblems.map((problem) => (
            <ProblemCard
              key={problem.id}
              problem={problem}
              isSolved={Boolean(solvedMap[problem.id])}
              isBookmarked={Boolean(bookmarkedMap[problem.id])}
              hasNote={Boolean(notesMap[problem.id])}
              onToggleSolved={onToggleSolved}
              onToggleBookmark={onToggleBookmark}
              onOpenNotes={onOpenNotes}
              onDeleteProblem={onDeleteProblem}
            />
          ))}
        </div>

      )}

      {/* Pagination Controls (Only in flat mode) */}
      {viewMode !== 'subtopic' && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            Page <strong className="text-slate-900 dark:text-white">{currentPage}</strong> of {totalPages} ({totalItems} total problems)
          </span>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
              title="First Page"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 font-semibold text-slate-800 dark:text-slate-200">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
              title="Last Page"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

