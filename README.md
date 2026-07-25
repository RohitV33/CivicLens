# CivicLens AI — Frontend

A modern, premium, production-ready frontend for an AI-powered civic issue reporting platform.
Built with **React 18 + Vite + Tailwind CSS + Framer Motion + Lucide React**.

## Getting started

```bash
npm install
npm run dev       # start dev server at http://localhost:5173
npm run build     # production build -> /dist
npm run preview   # preview the production build
```

## Project structure

```
src/
  components/       Reusable UI building blocks
    AppLayout.jsx      Sidebar + Topbar shell for authenticated pages
    Button.jsx         Primary/secondary/ghost/danger button variants
    Card.jsx            Base surface card with optional hover-lift
    EmptyState.jsx      EmptyState, Loader, SkeletonCard, SkeletonLine
    FilterDrawer.jsx    Mobile filter drawer + FilterSection + CheckOption
    ImageUploader.jsx   Drag-and-drop uploader with camera capture
    IssueThumb.jsx       Flat-style SVG illustrations standing in for photo evidence
    Logo.jsx            CivicLens AI wordmark + icon
    MapCard.jsx         Abstract, dependency-free map visualization
    Modal.jsx           Accessible modal dialog
    Navbar.jsx          Public/marketing site navigation
    PageTransition.jsx  Fade transition wrapper for route changes
    ReportCard.jsx      Report summary card used across pages
    SearchBar.jsx       Search input with clear button
    Sidebar.jsx          App shell navigation sidebar
    StatusChip.jsx       StatusChip, SeverityChip, Badge
    ThemeToggle.jsx      Light/dark mode switch
    Timeline.jsx         Vertical status timeline
    Topbar.jsx            App shell top bar (search, notifications, profile)
  pages/
    Landing.jsx          Marketing landing page
    Login.jsx / Signup.jsx
    Dashboard.jsx         Authenticated user dashboard
    ReportIssue.jsx       AI-assisted issue reporting flow
    ComplaintDetails.jsx  Single report detail view
    MapExplorer.jsx       Full-screen filterable map
    Profile.jsx           User profile & achievements
    NotFound.jsx
  context/
    ThemeContext.jsx      Light/dark theme (persisted to localStorage)
    ToastContext.jsx      Toast notification system
  data/
    mockData.js           Mock reports, stats, leaderboard, timeline, achievements
  hooks/
    useCountUp.js          Animated number counting on scroll into view
```

## Design system

- **Palette** — exact tokens from the brief, wired into `tailwind.config.js`
  (`bg`, `surface`, `card`, `primary`, `success`, `warning`, `danger`, `text.primary/secondary`, `border`),
  each with a `dark:` variant.
- **Typography** — Inter for UI, JetBrains Mono for IDs/coordinates/data.
- **Spacing** — 8px grid via Tailwind's default spacing scale.
- **Radius** — 16–20px (`rounded-xl` / `rounded-2xl`) on cards, inputs, buttons.
- **Shadows** — soft, layered shadows (`shadow-soft`, `shadow-card`, `shadow-lift`) instead of harsh drop shadows.
- **Motion** — Framer Motion for fade-ins, hover lift, spring-based popups/toasts, skeleton shimmer,
  and scroll-triggered count-up numbers. `prefers-reduced-motion` is respected globally.
- **Maps** — a custom, dependency-free abstract map component (`MapCard`) is used instead of a tile provider,
  keeping the app fully self-contained with no external API keys or network calls required.

## Notes

- All data is mocked in `src/data/mockData.js` — swap in real API calls where indicated.
- Forms (login, signup, report) include client-side validation and simulated async submission states.
- Dark mode toggles the `dark` class on `<html>` and persists the choice in `localStorage`.
