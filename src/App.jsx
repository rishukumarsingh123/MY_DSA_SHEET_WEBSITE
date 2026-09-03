import React, { useState, useEffect } from 'react';
import dsaProblems from './data/dsaProblems.json';
import { useProgress } from './hooks/useProgress';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { ProblemsView } from './components/ProblemsView';
import { ProgressView } from './components/ProgressView';
import { NotesModal } from './components/NotesModal';
import { RandomProblemModal } from './components/RandomProblemModal';
import { AddProblemModal } from './components/AddProblemModal';
import { BrandIcon } from './components/BrandLogo';

export function App() {
  // Navigation: 'dashboard' | 'problems' | 'progress'
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Quick pre-selected filters when navigating from Dashboard / Progress to Problems
  const [filterTopic, setFilterTopic] = useState('All');
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const [filterCompany, setFilterCompany] = useState('All');

  // Search in header
  const [globalSearch, setGlobalSearch] = useState('');

  // Theme Management (Light / Dark)
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('my_dsa_theme_v1');
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('my_dsa_theme_v1', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error('Error setting theme', e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Progress Hook (Syncs with LocalStorage, handles custom & deleted problems)
  const {
    allProblems,
    solvedMap,
    bookmarkedMap,
    notesMap,
    dailyGoal,
    setDailyGoal,
    addProblem,
    deleteProblem,
    toggleSolved,
    toggleBookmark,
    saveNote,
    stats,
    exportProgress,
    importProgress,
    resetProgress
  } = useProgress(dsaProblems);

  // Modals state
  const [activeNotesProblem, setActiveNotesProblem] = useState(null);
  const [isRandomModalOpen, setIsRandomModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Navigation Helper
  const navigateToProblemsWithFilter = (options = {}) => {
    if (options.topic) setFilterTopic(options.topic);
    else setFilterTopic('All');

    if (options.difficulty) setFilterDifficulty(options.difficulty);
    else setFilterDifficulty('All');

    if (options.company) setFilterCompany(options.company);
    else setFilterCompany('All');

    setActiveTab('problems');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Extract unique topic list
  const existingTopics = Array.from(new Set(allProblems.map(p => p.topic))).sort();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Sticky Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
        stats={stats}
        searchQuery={globalSearch}
        setSearchQuery={setGlobalSearch}
        exportProgress={exportProgress}
        importProgress={importProgress}
        resetProgress={resetProgress}
        onOpenRandomModal={() => setIsRandomModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            stats={stats}
            allProblems={allProblems}
            onNavigateToProblems={navigateToProblemsWithFilter}
            onOpenRandomModal={() => setIsRandomModalOpen(true)}
            onOpenNotes={(problem) => setActiveNotesProblem(problem)}
          />
        )}

        {activeTab === 'problems' && (
          <ProblemsView
            key={`${filterTopic}-${filterDifficulty}-${filterCompany}-${allProblems.length}`}
            allProblems={allProblems}
            solvedMap={solvedMap}
            bookmarkedMap={bookmarkedMap}
            notesMap={notesMap}
            onToggleSolved={toggleSolved}
            onToggleBookmark={toggleBookmark}
            onOpenNotes={(problem) => setActiveNotesProblem(problem)}
            onDeleteProblem={deleteProblem}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            initialTopic={filterTopic}
            initialDifficulty={filterDifficulty}
            onOpenRandomModal={() => setIsRandomModalOpen(true)}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressView
            stats={stats}
            allProblems={allProblems}
            onNavigateToProblems={navigateToProblemsWithFilter}
            exportProgress={exportProgress}
            importProgress={importProgress}
            resetProgress={resetProgress}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <BrandIcon className="w-6 h-6" />
            <p className="font-medium">
              <span className="font-bold text-slate-800 dark:text-slate-200">Rishu Kumar Singh</span> • B.Tech in CSE (AI) • <span className="text-blue-600 dark:text-blue-400 font-semibold">Practice. Solve. Improve.</span>
            </p>
          </div>
          <p className="text-slate-400">
            {allProblems.length} Problems • Stored locally in your browser
          </p>
        </div>
      </footer>

      {/* Notes & Key Takeaways Modal */}
      {activeNotesProblem && (
        <NotesModal
          problem={activeNotesProblem}
          isOpen={Boolean(activeNotesProblem)}
          onClose={() => setActiveNotesProblem(null)}
          savedNote={notesMap[activeNotesProblem.id]}
          onSaveNote={saveNote}
          isSolved={Boolean(solvedMap[activeNotesProblem.id])}
          onToggleSolved={toggleSolved}
          isBookmarked={Boolean(bookmarkedMap[activeNotesProblem.id])}
          onToggleBookmark={toggleBookmark}
        />
      )}

      {/* Pick Random Problem Modal */}
      <RandomProblemModal
        isOpen={isRandomModalOpen}
        onClose={() => setIsRandomModalOpen(false)}
        allProblems={allProblems}
        solvedMap={solvedMap}
        onToggleSolved={toggleSolved}
        onOpenNotes={(problem) => {
          setIsRandomModalOpen(false);
          setActiveNotesProblem(problem);
        }}
      />

      {/* Add Custom Problem Modal */}
      <AddProblemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProblem={addProblem}
        existingTopics={existingTopics}
      />

    </div>
  );
}

export default App;
