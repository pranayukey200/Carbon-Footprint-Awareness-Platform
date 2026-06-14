# 🌿 CarbonLens — Carbon Footprint Awareness Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vite.dev/)
[![WCAG 2.1 AA](https://img.shields.io/badge/WCAG_2.1-AA_Compliant-green)](https://www.w3.org/WAI/WCAG21/quickref/)
[![Coverage](https://img.shields.io/badge/Coverage-80%25+-brightgreen)](./coverage/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

> **A production-ready web application that helps individuals understand, track, and reduce their carbon footprint through personalized insights and actionable recommendations.**

<p align="center">
  <strong>Track</strong> your carbon emissions • <strong>Understand</strong> your impact • <strong>Act</strong> on personalized recommendations
</p>

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18.0.0
- **npm** ≥ 9.0.0

### Installation

```bash
# Clone and navigate
cd Carbon_Footprint

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at **http://localhost:5173**

### Available Scripts

| Command              | Description                              |
| -------------------- | ---------------------------------------- |
| `npm run dev`        | Start Vite dev server with HMR           |
| `npm run build`      | TypeScript check + production build      |
| `npm run preview`    | Preview production build locally         |
| `npm run test`       | Run all tests once                       |
| `npm run test:watch` | Run tests in watch mode                  |
| `npm run test:coverage` | Run tests with coverage report       |
| `npm run lint`       | Run ESLint with strict rules             |
| `npm run format`     | Format all source files with Prettier    |
| `npm run type-check` | TypeScript strict mode check             |
| `npm run validate`   | Run type-check + lint + tests            |

---

## ✨ Features

### 🧭 Interactive Onboarding
Multi-step lifestyle assessment capturing:
- **Transport**: commute mode, distance, fuel type, and flight frequency
- **Diet**: dietary pattern, local food sourcing, and food waste habits
- **Energy**: electricity usage, gas consumption, renewable energy percentage
- **Shopping**: spending habits, fast fashion frequency, electronics purchases

### 📊 Real-Time Dashboard
- **Carbon Score**: animated display of total annual CO₂ emissions
- **Category Breakdown**: interactive donut chart (Recharts) with per-category analysis
- **Trend Chart**: area chart tracking emission changes over time
- **Global Comparison**: benchmarking against world (4t), US (16t), and EU (6.5t) averages

### 🎯 Personalized Action Recommendations
- **20+ unique actions** across all emission categories
- **Smart filtering**: irrelevant actions are automatically excluded
- **Impact ranking**: sorted by potential CO₂ savings weighted by user profile
- **Difficulty levels**: Easy, Medium, and Hard indicators

### 📈 Progress Tracker
- Log completed actions and track cumulative CO₂ saved
- View progress history with relative timestamps
- Summary statistics: total actions, total savings, activity streak

### 💾 Offline Support
- Full localStorage persistence via Zustand persist middleware
- Works offline after initial load — no server dependency
- Data survives browser refreshes and tab closures

---

## 🏗️ Architecture

### Technology Stack

| Layer          | Technology              | Purpose                       |
| -------------- | ----------------------- | ----------------------------- |
| **Framework**  | React 19                | UI rendering & component model |
| **Language**   | TypeScript (strict)     | Type safety & developer experience |
| **Build**      | Vite 8                  | Dev server, HMR, & bundling   |
| **State**      | Zustand 5               | Lightweight global state management |
| **Charts**     | Recharts 2              | Data visualization            |
| **Security**   | DOMPurify 3             | XSS prevention                |
| **Testing**    | Vitest + RTL            | Unit & component testing      |
| **Styling**    | Vanilla CSS (custom properties) | Premium dark-mode design system |

### Project Structure

```
src/
├── components/
│   ├── Actions/          # Recommendation cards & list
│   │   ├── ActionCard.tsx
│   │   └── ActionList.tsx
│   ├── Dashboard/        # Main dashboard views
│   │   ├── CarbonScore.tsx
│   │   ├── CategoryBreakdown.tsx
│   │   ├── Dashboard.tsx
│   │   └── TrendChart.tsx
│   ├── Layout/           # App shell
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── Onboarding/       # Multi-step onboarding flow
│   │   ├── DietStep.tsx
│   │   ├── EnergyStep.tsx
│   │   ├── OnboardingForm.tsx
│   │   ├── ShoppingStep.tsx
│   │   ├── StepIndicator.tsx
│   │   └── TransportStep.tsx
│   ├── Progress/         # Progress tracking
│   │   ├── ProgressCard.tsx
│   │   └── ProgressTracker.tsx
│   └── shared/           # Reusable UI primitives
│       ├── Button.tsx
│       ├── Card.tsx
│       └── SkipLink.tsx
├── hooks/                # Custom React hooks
│   ├── useCarbonCalculations.ts
│   └── useLocalStorage.ts
├── services/             # Business logic services
│   └── recommendations.ts
├── store/                # Zustand state management
│   └── carbonStore.ts
├── test/                 # Test files
│   ├── carbonCalculations.test.ts
│   ├── formatters.test.ts
│   ├── recommendations.test.ts
│   ├── sanitize.test.ts
│   ├── setup.ts
│   └── storage.test.ts
├── types/                # TypeScript type definitions
│   └── index.ts
├── utils/                # Pure utility functions
│   ├── carbonCalculations.ts
│   ├── formatters.ts
│   ├── sanitize.ts
│   └── storage.ts
├── App.tsx               # Root component
├── index.css             # Design system & global styles
├── main.tsx              # Entry point
└── vite-env.d.ts         # Vite type declarations
```

### Design Decisions

- **No prop drilling**: Global state via Zustand eliminates prop threading
- **Lazy loading**: Non-critical views loaded via `React.lazy()` + `Suspense`
- **Memoization**: `useMemo` and `useCallback` for expensive chart data transforms
- **CSS custom properties**: Full design token system without CSS-in-JS runtime cost
- **Glassmorphism**: Premium visual style using `backdrop-filter` and transparency

---

## 🧮 Carbon Calculation Methodology

### Data Sources

All emission factors are derived from peer-reviewed scientific sources:

| Source | Organization | Data Used |
| --- | --- | --- |
| [EPA eGRID](https://www.epa.gov/egrid) | U.S. Environmental Protection Agency | Grid electricity emission factors |
| [EPA GHG Calculator](https://www.epa.gov/energy/greenhouse-gas-equivalencies-calculator) | U.S. EPA | Vehicle & fuel emission factors |
| [DEFRA Conversion Factors](https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2023) | UK Government | Transport, food, & shopping factors |
| [IPCC AR6](https://www.ipcc.ch/assessment-report/ar6/) | IPCC | Global emission baselines |
| [Our World in Data](https://ourworldindata.org/co2-emissions) | Global Change Data Lab | Per-capita averages & comparisons |

### Calculation Details

#### 🚗 Transport Emissions
```
Car: weeklyKm × fuelFactor × 52 weeks
  Gasoline: 0.21 kg CO₂/km
  Diesel:   0.24 kg CO₂/km
  Hybrid:   0.12 kg CO₂/km
  Electric: 0.05 kg CO₂/km

Public Transit: weeklyKm × 0.089 kg CO₂/passenger-km × 52

Flights: flightsPerYear × avgHours × 250 kg CO₂/hour
```

#### 🥗 Diet Emissions
```
Base annual emissions by dietary pattern:
  Meat-heavy:  3,300 kg CO₂/year
  Average:     2,500 kg CO₂/year
  Vegetarian:  1,700 kg CO₂/year
  Vegan:       1,500 kg CO₂/year

Adjustments:
  Local food: -10% reduction at 100% local sourcing
  Food waste: +25% increase at 100% waste rate
```

#### ⚡ Energy Emissions
```
Electricity: monthlyKwh × 12 × 0.417 kg CO₂/kWh (US grid avg)
Natural Gas: monthlyTherms × 12 × 5.3 kg CO₂/therm

Adjustments:
  Renewable %: Linear reduction proportional to renewable share
  Per-person:  Total ÷ household size
```

#### 🛍️ Shopping Emissions
```
Consumer spending: monthlyUSD × 12 × 0.7 kg CO₂/USD
Electronics:       count × 300 kg CO₂/device (lifecycle)

Multipliers:
  Fast fashion (never/rarely/sometimes/often): 0.5/0.8/1.0/1.5×
  Recycling: Up to -15% reduction at 100% recycling
```

### Global Averages for Comparison
- **World average**: 4.0 tonnes CO₂/person/year
- **US average**: 16.0 tonnes CO₂/person/year
- **EU average**: 6.5 tonnes CO₂/person/year

---

## 🔒 Security

### Implemented Measures

| Measure | Implementation |
| --- | --- |
| **XSS Prevention** | DOMPurify sanitizes all user text inputs |
| **CSP Headers** | Content-Security-Policy via `<meta>` tag |
| **Input Validation** | Type-safe validators with fallback values |
| **HTML Escaping** | `escapeHtml()` for dynamic content |
| **Data Hashing** | SHA-256 via Web Crypto API for sensitive data |
| **No Sensitive Storage** | Only non-PII lifestyle data in localStorage |
| **Zero CVEs** | All dependencies audited with `npm audit` |
| **Minimal Dependencies** | Only 5 runtime dependencies |

### Dependency Audit

```bash
npm audit  # → found 0 vulnerabilities
```

---

## ♿ Accessibility (WCAG 2.1 AA)

| Requirement | Implementation |
| --- | --- |
| **Skip Navigation** | "Skip to main content" link |
| **Keyboard Navigation** | All interactive elements focusable & operable |
| **ARIA Labels** | Labels on all buttons, inputs, and charts |
| **Focus Indicators** | Visible `:focus-visible` rings |
| **Color Contrast** | Minimum 4.5:1 ratio (tested) |
| **Semantic HTML** | `<main>`, `<nav>`, `<header>`, `<footer>`, `<section>` |
| **Screen Reader** | Meaningful `aria-label`, `role`, and live regions |
| **Reduced Motion** | `prefers-reduced-motion` media query respected |
| **High Contrast** | `forced-colors` mode supported |

---

## 🧪 Testing

### Test Coverage Target: 80%+

```bash
# Run all tests
npm run test

# Run with coverage report
npm run test:coverage
```

### Test Breakdown

| Suite | Type | Tests | Coverage |
| --- | --- | --- | --- |
| Carbon Calculations | Unit | 15+ | Functions, edge cases |
| Sanitize & Validate | Unit | 15+ | XSS vectors, types |
| Formatters | Unit | 15+ | All format functions |
| Storage | Unit | 10+ | CRUD, error handling |
| Recommendations | Unit | 8+ | Filtering, sorting |

---

## ⚡ Performance

### Optimization Strategies

- **Code Splitting**: React.lazy() for Dashboard, Actions, Progress views
- **Memoization**: useMemo/useCallback for chart data transforms
- **Tree Shaking**: Vite + ES modules for dead code elimination
- **Manual Chunks**: Vendor (react), Charts (recharts), State (zustand)
- **CSS Custom Properties**: Zero runtime CSS-in-JS overhead
- **Minimal Runtime Dependencies**: Only 5 packages

### Bundle Target
- **Gzipped size**: < 200KB target
- **Lighthouse Performance**: 95+ target

---

## 📝 Code Quality

- **TypeScript Strict Mode**: `strict: true`, `noUncheckedIndexedAccess`, `noUnusedLocals`
- **Zero `any` types**: Fully typed codebase
- **JSDoc Documentation**: All exports documented
- **Component Size Limit**: < 150 lines per file
- **DRY Principles**: Reusable utilities, hooks, and components
- **ESLint + Prettier**: Consistent formatting enforced
- **Meaningful Names**: No abbreviations, descriptive variables

---

## 📄 License

MIT License — see [LICENSE](./LICENSE) for details.

---

<p align="center">
  Made with 💚 for a greener planet
  <br />
  <sub>CarbonLens — Understand your impact. Take action.</sub>
</p>
