import { useState, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';

const STORAGE_KEY_SOLVED = 'my_dsa_solved_v1';
const STORAGE_KEY_BOOKMARKS = 'my_dsa_bookmarks_v1';
const STORAGE_KEY_NOTES = 'my_dsa_notes_v1';
const STORAGE_KEY_GOAL = 'my_dsa_daily_goal_v1';
const STORAGE_KEY_CUSTOM_PROBLEMS = 'my_dsa_custom_problems_v1';
const STORAGE_KEY_DELETED_PROBLEMS = 'my_dsa_deleted_problems_v1';

export function useProgress(baseProblems = []) {
  // Solved state: { [problemId]: timestamp_ms }
  const [solvedMap, setSolvedMap] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SOLVED);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error('Failed to load solved map from localStorage', e);
      return {};
    }
  });

  // Bookmarks state: { [problemId]: boolean }
  const [bookmarkedMap, setBookmarkedMap] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error('Failed to load bookmarks from localStorage', e);
      return {};
    }
  });

  // Personal notes: { [problemId]: string }
  const [notesMap, setNotesMap] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_NOTES);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error('Failed to load notes from localStorage', e);
      return {};
    }
  });

  // Custom added problems
  const [customProblems, setCustomProblems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_PROBLEMS);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load custom problems', e);
      return [];
    }
  });

  // Deleted problem IDs (from base dataset)
  const [deletedProblemIds, setDeletedProblemIds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DELETED_PROBLEMS);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error('Failed to load deleted problems', e);
      return {};
    }
  });

  // Daily goal: default 3
  const [dailyGoal, setDailyGoal] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_GOAL);
      return saved ? parseInt(saved, 10) : 3;
    } catch {
      return 3;
    }
  });

  // Persist Solved
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SOLVED, JSON.stringify(solvedMap));
    } catch (e) {
      console.error('Error saving solved map', e);
    }
  }, [solvedMap]);

  // Persist Bookmarks
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(bookmarkedMap));
    } catch (e) {
      console.error('Error saving bookmarks', e);
    }
  }, [bookmarkedMap]);

  // Persist Notes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notesMap));
    } catch (e) {
      console.error('Error saving notes', e);
    }
  }, [notesMap]);

  // Persist Custom Problems
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CUSTOM_PROBLEMS, JSON.stringify(customProblems));
    } catch (e) {
      console.error('Error saving custom problems', e);
    }
  }, [customProblems]);

  // Persist Deleted Problems
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DELETED_PROBLEMS, JSON.stringify(deletedProblemIds));
    } catch (e) {
      console.error('Error saving deleted problems', e);
    }
  }, [deletedProblemIds]);

  // Persist Goal
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_GOAL, dailyGoal.toString());
    } catch (e) {
      console.error('Error saving daily goal', e);
    }
  }, [dailyGoal]);

  // Confetti helper
  const triggerCelebration = useCallback(() => {
    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899']
      });
    } catch {
      // Ignore if confetti fails
    }
  }, []);

  // Combined active problem list
  const allProblems = useMemo(() => {
    const filteredBase = baseProblems.filter(p => !deletedProblemIds[p.id]);
    return [...filteredBase, ...customProblems];
  }, [baseProblems, deletedProblemIds, customProblems]);

  // Add custom problem
  const addProblem = useCallback((problemData) => {
    const newId = Date.now();
    const newProblem = {
      id: newId,
      lcNo: problemData.lcNo ? problemData.lcNo.toString().trim() : '',
      title: problemData.title.trim(),
      difficulty: problemData.difficulty || 'Medium',
      topic: problemData.topic ? problemData.topic.trim() : 'General',
      pattern: problemData.pattern ? problemData.pattern.trim() : '',
      companies: problemData.companies || [],
      companiesRaw: Array.isArray(problemData.companies) ? problemData.companies.join(', ') : '',
      url: problemData.url && problemData.url.trim().startsWith('http') 
        ? problemData.url.trim() 
        : `https://leetcode.com/problems/${problemData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}/`,
      isCustom: true
    };

    setCustomProblems(prev => [newProblem, ...prev]);
    return newProblem;
  }, []);

  // Delete problem
  const deleteProblem = useCallback((problemId) => {
    // If it's a custom problem, remove from customProblems
    setCustomProblems(prev => prev.filter(p => p.id !== problemId));
    // If it's in base dataset, mark as deleted
    setDeletedProblemIds(prev => ({ ...prev, [problemId]: true }));

    // Clean up associated metadata
    setSolvedMap(prev => {
      const next = { ...prev };
      delete next[problemId];
      return next;
    });
    setBookmarkedMap(prev => {
      const next = { ...prev };
      delete next[problemId];
      return next;
    });
    setNotesMap(prev => {
      const next = { ...prev };
      delete next[problemId];
      return next;
    });
  }, []);

  // Toggle solved
  const toggleSolved = useCallback((problemId) => {
    setSolvedMap(prev => {
      const next = { ...prev };
      if (next[problemId]) {
        delete next[problemId];
      } else {
        next[problemId] = Date.now();
        triggerCelebration();
      }
      return next;
    });
  }, [triggerCelebration]);

  // Set batch solved / unsolved
  const setBatchSolved = useCallback((problemIds, isSolved) => {
    setSolvedMap(prev => {
      const next = { ...prev };
      const now = Date.now();
      problemIds.forEach(id => {
        if (isSolved) {
          if (!next[id]) next[id] = now;
        } else {
          delete next[id];
        }
      });
      return next;
    });
  }, []);

  // Toggle bookmark
  const toggleBookmark = useCallback((problemId) => {
    setBookmarkedMap(prev => {
      const next = { ...prev };
      if (next[problemId]) {
        delete next[problemId];
      } else {
        next[problemId] = true;
      }
      return next;
    });
  }, []);

  // Save note
  const saveNote = useCallback((problemId, text) => {
    setNotesMap(prev => {
      const next = { ...prev };
      if (!text || !text.trim()) {
        delete next[problemId];
      } else {
        next[problemId] = text.trim();
      }
      return next;
    });
  }, []);

  // Statistics calculation
  const stats = useMemo(() => {
    const totalProblems = allProblems.length;
    const solvedIds = Object.keys(solvedMap).map(Number);
    const solvedCount = solvedIds.filter(id => allProblems.some(p => p.id === id)).length;
    const unsolvedCount = Math.max(0, totalProblems - solvedCount);
    const overallPercentage = totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0;

    // Difficulty breakdown
    const diffStats = {
      Easy: { total: 0, solved: 0, percentage: 0 },
      Medium: { total: 0, solved: 0, percentage: 0 },
      Hard: { total: 0, solved: 0, percentage: 0 }
    };

    // Topic breakdown
    const topicStats = {};

    // Company breakdown
    const companyStats = {};

    allProblems.forEach(p => {
      // Difficulty
      const diff = p.difficulty || 'Medium';
      if (!diffStats[diff]) {
        diffStats[diff] = { total: 0, solved: 0, percentage: 0 };
      }
      diffStats[diff].total += 1;
      if (solvedMap[p.id]) {
        diffStats[diff].solved += 1;
      }

      // Topic
      const topic = p.topic || 'General';
      if (!topicStats[topic]) {
        topicStats[topic] = { total: 0, solved: 0, percentage: 0 };
      }
      topicStats[topic].total += 1;
      if (solvedMap[p.id]) {
        topicStats[topic].solved += 1;
      }

      // Companies
      if (p.companies && Array.isArray(p.companies)) {
        p.companies.forEach(comp => {
          if (!companyStats[comp]) {
            companyStats[comp] = { total: 0, solved: 0 };
          }
          companyStats[comp].total += 1;
          if (solvedMap[p.id]) {
            companyStats[comp].solved += 1;
          }
        });
      }
    });

    // Calculate percentages
    Object.keys(diffStats).forEach(d => {
      const s = diffStats[d];
      s.percentage = s.total > 0 ? Math.round((s.solved / s.total) * 100) : 0;
    });

    Object.keys(topicStats).forEach(t => {
      const s = topicStats[t];
      s.percentage = s.total > 0 ? Math.round((s.solved / s.total) * 100) : 0;
    });

    // Solved today calculation
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayMs = today.getTime();
    
    let solvedTodayCount = 0;
    const timestamps = [];
    Object.entries(solvedMap).forEach(([idStr, timestamp]) => {
      if (typeof timestamp === 'number') {
        timestamps.push(timestamp);
        if (timestamp >= todayMs) {
          solvedTodayCount += 1;
        }
      }
    });

    // Streak calculation (consecutive days with at least 1 solved problem)
    let streak = 0;
    if (timestamps.length > 0) {
      const solveDays = new Set(
        timestamps.map(ts => {
          const d = new Date(ts);
          return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
        })
      );

      const checkDate = new Date();
      const todayKey = `${checkDate.getFullYear()}-${checkDate.getMonth() + 1}-${checkDate.getDate()}`;
      let curr = checkDate;
      if (!solveDays.has(todayKey)) {
        curr.setDate(curr.getDate() - 1);
      }

      while (true) {
        const key = `${curr.getFullYear()}-${curr.getMonth() + 1}-${curr.getDate()}`;
        if (solveDays.has(key)) {
          streak += 1;
          curr.setDate(curr.getDate() - 1);
        } else {
          break;
        }
      }
    }

    // Recent solved problems list
    const problemMap = new Map(allProblems.map(p => [p.id, p]));
    const recentSolved = Object.entries(solvedMap)
      .map(([id, ts]) => ({
        problem: problemMap.get(Number(id)),
        timestamp: typeof ts === 'number' ? ts : Date.now()
      }))
      .filter(item => item.problem)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 8);

    return {
      totalProblems,
      solvedCount,
      unsolvedCount,
      overallPercentage,
      diffStats,
      topicStats,
      companyStats,
      solvedTodayCount,
      streak,
      recentSolved,
      bookmarkedCount: Object.keys(bookmarkedMap).length,
      notesCount: Object.keys(notesMap).length
    };
  }, [allProblems, solvedMap, bookmarkedMap, notesMap]);

  // Export progress
  const exportProgress = useCallback(() => {
    const backup = {
      version: 2,
      exportDate: new Date().toISOString(),
      solved: solvedMap,
      bookmarks: bookmarkedMap,
      notes: notesMap,
      customProblems,
      deletedProblemIds,
      dailyGoal
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my-dsa-journey-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [solvedMap, bookmarkedMap, notesMap, customProblems, deletedProblemIds, dailyGoal]);

  // Import progress
  const importProgress = useCallback((jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.solved && typeof data.solved === 'object') {
        setSolvedMap(data.solved);
      }
      if (data.bookmarks && typeof data.bookmarks === 'object') {
        setBookmarkedMap(data.bookmarks);
      }
      if (data.notes && typeof data.notes === 'object') {
        setNotesMap(data.notes);
      }
      if (data.customProblems && Array.isArray(data.customProblems)) {
        setCustomProblems(data.customProblems);
      }
      if (data.deletedProblemIds && typeof data.deletedProblemIds === 'object') {
        setDeletedProblemIds(data.deletedProblemIds);
      }
      if (data.dailyGoal && typeof data.dailyGoal === 'number') {
        setDailyGoal(data.dailyGoal);
      }
      return { success: true };
    } catch (e) {
      console.error('Import failed', e);
      return { success: false, error: e.message };
    }
  }, []);

  // Reset progress
  const resetProgress = useCallback(() => {
    setSolvedMap({});
    setBookmarkedMap({});
    setNotesMap({});
    setCustomProblems([]);
    setDeletedProblemIds({});
    localStorage.removeItem(STORAGE_KEY_SOLVED);
    localStorage.removeItem(STORAGE_KEY_BOOKMARKS);
    localStorage.removeItem(STORAGE_KEY_NOTES);
    localStorage.removeItem(STORAGE_KEY_CUSTOM_PROBLEMS);
    localStorage.removeItem(STORAGE_KEY_DELETED_PROBLEMS);
  }, []);

  return {
    allProblems,
    solvedMap,
    bookmarkedMap,
    notesMap,
    dailyGoal,
    setDailyGoal,
    addProblem,
    deleteProblem,
    toggleSolved,
    setBatchSolved,
    toggleBookmark,
    saveNote,
    stats,
    exportProgress,
    importProgress,
    resetProgress
  };
}
