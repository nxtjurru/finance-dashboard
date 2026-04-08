# Ethereal Finance — CLAUDE.md

Project context for Claude Code. Read this before touching any file.

---

## What this project is

A finance dashboard SPA built as a university assignment. It is **frontend-only** — no backend, no real API, all data is mock/static. The evaluator cares about UI quality, RBAC behaviour, state management, responsiveness, and code organisation.

**Stack:** React 19 · TypeScript · Vite 8 · Tailwind CSS v4 · Zustand v5 · Framer Motion v12 · Recharts v3 · React Router v7 · Lucide React

---

## Setup

```bash
cd ethereal-finance
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc -b && vite build (must produce 0 errors)
npm run preview    # serve the production build locally
```

**Always run `npm run build` and confirm 0 errors before considering any task done.**

---

## Directory map

```
src/
  App.tsx                      # Route definitions (all pages are React.lazy)
  main.tsx                     # Entry point, StrictMode
  index.css                    # Tailwind v4 @theme tokens + mesh-gradient keyframes

  store/
    useStore.ts                # Single Zustand store (persist middleware → localStorage)

  data/
    transactions.ts            # 86 mock transactions + Category union + categoryColors map
    pets.ts                    # Pet entries (id / emoji / name) used by PetWidget

  hooks/
    useFilteredTransactions.ts # Derived filtered+sorted transaction list

  components/
    Layout.tsx                 # Shell: Sidebar + <Outlet /> + mobile header
    Sidebar.tsx                # Nav links, role toggle, theme toggle
    AnimatedNumber.tsx         # Countup animation component
    SavingsProgressCard.tsx    # Draggable savings progress bar
    PetWidget.tsx              # Animated emoji pet (idle timer + click-to-play)

  pages/
    Dashboard.tsx              # Overview: KPI cards, charts, savings, recent activity
    Transactions.tsx           # Full transaction table with search/filter/sort + modal
    Analytics.tsx              # Deeper charts: category bar, savings rate, monthly trend
    Profile.tsx                # Financial goals, daily spending logger, identity/pet picker
    Settings.tsx               # Currency, locale, display name, email, theme
```

---

## Store shape (useStore.ts)

| Slice | Key fields | Persisted |
|---|---|---|
| Transactions | `transactions[]`, add/update/delete actions | yes |
| Role | `role: "viewer" \| "admin"`, `setRole` | yes |
| Theme | `theme: "dark" \| "light"`, `toggleTheme` | yes |
| Filters | `filters` (search, category, type, dateRange, sort) | no |
| UserProfile | `monthlyIncome`, `savingsGoal`, `savedThisMonth`, `salaryBonus`, `salaryHike` | yes |
| DailySpending | `dailySpending[]`, add/delete | no |
| CustomCategories | `customCategories[]`, add/remove | yes |
| AppSettings | `currencySymbol`, `userName`, `selectedPet`, locale fields | yes |
| DataAdjustments | `netWorthAdjustment`, `incomeAdjustment`, `expenseAdjustment`, `categoryAdjustments` | no |

Persist key: `"ethereal-finance-storage"` (localStorage).

---

## Role-based behaviour (RBAC)

| Feature | Viewer | Admin |
|---|---|---|
| View all pages + charts | yes | yes |
| Add / edit / delete transactions | no | yes |
| Log daily spending | no | yes |
| Edit financial profile / goals | no | yes |
| Edit identity (name, pet) | no | yes |
| Live-adjust chart values (chevrons, drag bars) | no | yes |
| Export CSV | yes | yes |

Role is toggled via the Viewer / Admin buttons in the Sidebar bottom panel. No authentication — purely a UI simulation as required by the assignment.

---

## Design system

Tailwind v4 config lives in `src/index.css` inside an `@theme {}` block. Key tokens:

| Token | Value |
|---|---|
| `--color-bg` | `#0e0e13` (page background) |
| `--color-primary-dim` | `#a6ef27` (lime green accent) |
| `--color-surface-container-low` | `#16161e` (cards) |
| `--color-error` | `#ff5449` |
| `--color-tertiary-dim` | `#d277ff` |

Light mode is applied via `.light` class on `<body>`. Dark mode is the default.

Custom CSS utilities defined in `index.css`:
- `.mesh-gradient` — animated gradient hero card
- `.mesh-gradient-subtle` — muted version
- `.mesh-gradient-rainbow` — triggers on savings > goal
- `.animate-pulse-glow` — ring glow on goal reached

---

## Performance decisions already in place

- All 5 pages are **React.lazy** → code-split; initial JS ~258 KB
- Vite `manualChunks`: recharts (398 KB), framer-motion (133 KB), lucide (11 KB), vendor each in own chunk
- `DigitalClock` is an isolated `memo` component with its own `setInterval` — never causes Dashboard to re-render
- `ChartTooltip` (Dashboard + Analytics) is module-level `memo` — stable Recharts reference
- `SortIcon` and `TransactionModal` in Transactions are module-level `memo`
- Dashboard has a shared `monthlyBase` useMemo that both `balanceTrend` and `monthlyComparison` consume — no duplicate O(n) traversal
- `PetWidget` animation loop lives inside `useEffect`; play/schedule refs prevent stale closures
- Search input is debounced 300 ms (local state + useEffect in Transactions)
- `@media (prefers-reduced-motion: reduce)` block disables all CSS animations for accessibility

---

## PetWidget (src/components/PetWidget.tsx)

Emoji-based animated companion shown on the Dashboard header and in the Profile pet selector.

- **Idle by default** — sits still between plays
- **Auto-plays every 5–6.5 s** — one animation cycle then returns to rest
- **Click triggers immediate play** — only when `clickable={true}` (passed as `role === "admin"` on Dashboard)
- Props: `petId`, `size`, `clickable`, `idleMin`, `idleMax`, `className`
- Pet options: `cat 🐱`, `dog 🐶`, `bird 🐦`, `fish 🐠` — set in Profile, persisted to store

---

## Conventions

- **No inline component definitions** inside other components — always module level or a separate file (prevents recreation on every render)
- **useMemo / useCallback** for any value derived from store data that is passed as a chart prop or used in a loop
- **Zustand selectors** always select the narrowest slice needed (`useStore((s) => s.theme)` not `useStore()`)
- Class names: Tailwind utility strings are assigned to `const cardBg`, `textPrimary`, `textSecondary` variables at the top of each component — not repeated inline
- All animation variants (`container`, `item`) are module-level constants
- TypeScript `any` is banned — use proper union types or Recharts payload types

---

## What NOT to do

- Do not add a backend, API calls, or auth — this is intentionally frontend-only
- Do not install new heavy libraries without checking bundle impact (`npm run build`)
- Do not commit the `dist/` folder — it is gitignored and regenerated on build
- Do not add docstrings or comments to code that wasn't changed
- Do not add features beyond what was asked — keep scope tight

---

## Assignment requirements checklist

| Requirement | Implementation |
|---|---|
| Summary cards (balance, income, expenses) | Dashboard KPI cards + Hero balance card |
| Time-based visualisation | Balance Evolution area chart (1M / 3M / 6M filter) |
| Categorical visualisation | Spending Breakdown donut chart + category bar in Analytics |
| Transaction list with date/amount/category/type | Transactions page — desktop table + mobile cards |
| Filtering | Category dropdown, type pills, date range in Transactions |
| Search | Debounced text search in Transactions |
| Sorting | Click-to-sort on Date and Amount columns |
| Role-based UI (viewer / admin) | Sidebar toggle; admin unlocks editing across all pages |
| Insights section | Analytics page: highest spend category, monthly comparison, savings rate trend |
| State management | Zustand store with persist middleware |
| Dark mode | Toggle in Sidebar; persisted to localStorage |
| Responsiveness | Tailwind responsive prefixes; mobile sidebar drawer; card→table layout switch |
| Empty / no-data states | All list/table views have illustrated empty states |
| Data persistence | Zustand persist → localStorage |
| Animations / transitions | Framer Motion on page entry, cards, modals, progress bar, PetWidget |
| Export functionality | CSV export button in Transactions |
| Advanced filtering | Date range filter + multi-field sort |
