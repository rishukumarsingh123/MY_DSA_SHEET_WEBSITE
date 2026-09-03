# 🚀 Rishu's DSA Journey - Personal DSA Tracker & Practice Platform

> **"Practice. Solve. Improve."**  
> Developed for **Rishu Kumar Singh** • **B.Tech in CSE (AI)**

A modern, fast, responsive personal DSA practice platform built with 22 core topics and 100+ sub-patterns (740 unique LeetCode problems).

---

## 💎 Brand Identity & Logo
- **Custom Vector Brand Logo**: A modern, futuristic squircle emblem with an electric-blue / indigo gradient, stylized geometric **"R"** fused with code brackets `< / >` and AI neural node accents.
- **Adaptive Contrast**: Razor-sharp vector rendering that looks crisp and vibrant on both **Dark** and **Light** themes.
- **Identity Details**: **Rishu Kumar Singh** • **B.Tech in CSE (AI)** • **"Practice. Solve. Improve."**

---

## 🌟 Key Features

1. **740 Unique Problems Across 22 Topics & 100+ Subtopics**:
   - Binary Search, Two Pointers, Sorting, Prefix Sum, Sliding Window, Strings, Hashing, Linked List, Stack, Queue, Heap, Recursion, Trees, Graph, Dynamic Programming, Greedy, Backtracking, Trie, Disjoint Set Union (DSU), Segment Tree, Bit Manipulation, Math & Number System.
   - Zero duplicates with multi-pattern tagging.
   - Easy (145), Medium (491), Hard (104).

2. **Topic & Subtopic Roadmap**:
   - Each topic is broken down into clean, numbered subtopic modules (e.g. `01. Basic Binary Search`, `02. Boundary Search`, `03. Search in Rotated Sorted Array`).
   - Subtopic filters are strictly scoped to the active topic, preventing confusion.
   - Accordion view with individual progress tracking and collapsible sections.

3. **Direct LeetCode Integration**:
   - Every question links directly to LeetCode with verified problem numbers and difficulties.

4. **Interactive Problem Management**:
   - **➕ Add Custom Problems**: Add any question directly from the UI with custom topics, LeetCode links, concepts, and companies.
   - **🗑️ Remove / Delete Problems**: Easily delete any problem with a single click and confirmation.
   - **⭐ Bookmarks & 📝 Notes**: Save personal solution intuition, time/space complexity notes, and edge cases.

5. **Progress & Analytics Dashboard**:
   - Overall Progress % and remaining question counter.
   - Difficulty Breakdown (Easy, Medium, Hard).
   - 22 Topic Completion Cards with pattern counts and direct practice links.
   - Active daily streak & daily goal tracker.
   - **"Pick Next Problem"** random problem picker with smart filters.
   - Recently solved activity feed.

6. **Local Persistence & Zero-Risk Backups**:
   - All interactions saved automatically in browser `localStorage`.
   - **Export / Import JSON Backup**: Download a full backup of all solved problems, custom problems, notes, and bookmarks to keep your progress safe offline.

---

## 📁 Clean Codebase & Project Structure

```
my-dsa-website/
├── public/
│   └── logo.svg                  # High-resolution vector brand logo
├── src/
│   ├── components/
│   │   ├── BrandLogo.jsx         # Custom vector brand logo & emblem
│   │   ├── Header.jsx            # Header with navigation, streak, logo, & data menu
│   │   ├── DashboardView.jsx     # Hero profile banner, stats, & 22-topic grid
│   │   ├── ProblemsView.jsx      # Topic pills, subtopic accordions, search, filters
│   │   ├── ProgressView.jsx      # Deep-dive analytics & backup management
│   │   ├── ProblemRow.jsx        # Table row with solve link, notes, delete
│   │   ├── ProblemCard.jsx       # Grid card with solve link, notes, delete
│   │   ├── AddProblemModal.jsx   # Interactive modal to add custom problems
│   │   ├── NotesModal.jsx        # Personal solution intuition popup
│   │   └── RandomProblemModal.jsx# Smart random problem recommender
│   ├── hooks/
│   │   └── useProgress.js        # State, streak engine, & localStorage sync
│   ├── data/
│   │   ├── dsaProblems.json      # Curated 740 unique problems dataset
│   │   └── metadata.json         # Summary topic and difficulty metrics
│   ├── utils/
│   │   └── theme.js              # Difficulty colors, 22 topic icons, formatters
│   ├── App.jsx                   # Root application container & modal router
│   ├── main.jsx                  # React 19 entry point
│   └── index.css                 # Tailwind CSS styles & glassmorphism
├── .gitignore                    # Standard Git ignore for node_modules & dist
├── index.html                    # HTML entry point with vector favicon
├── package.json                  # Dependencies & scripts
├── tailwind.config.js            # Tailwind custom difficulty themes
└── vite.config.js                # Vite bundler configuration
```

---

## 🚀 Running the Project

### Start Development Server
```bash
npm run dev
```
Open **http://localhost:5173** in your browser.

### Build for Production
```bash
npm run build
```
