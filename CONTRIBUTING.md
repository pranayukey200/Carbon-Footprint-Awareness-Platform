# Contributing to CarbonLens

Thank you for your interest in contributing to CarbonLens! This document provides guidelines and standards for contributing to this project.

## 📋 Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- Familiarity with TypeScript, React 19, and modern web development

## 🚀 Getting Started

1. **Fork** the repository
2. **Clone** your fork locally:
   ```bash
   git clone <your-fork-url>
   cd Carbon_Footprint
   ```
3. **Install** dependencies:
   ```bash
   npm install
   ```
4. **Run** the development server:
   ```bash
   npm run dev
   ```

## 📐 Code Standards

### TypeScript
- Strict mode is enabled (`strict: true` in tsconfig.json)
- No `any` types — use proper type annotations
- All exports must include JSDoc documentation
- Use `readonly` properties for immutable data structures
- Use `type` imports for type-only imports (`import type { ... }`)

### React Components
- Use named exports (not default exports) for all components
- Keep components under 150 lines of code
- Include `@fileoverview` JSDoc at the top of every file
- Use semantic HTML elements and ARIA attributes
- All interactive elements must be keyboard accessible

### CSS
- Use CSS custom properties (design tokens) defined in `index.css`
- No inline styles — use class-based styling
- Support `prefers-reduced-motion` and `forced-colors` media queries

### Testing
- Write unit tests for all utility functions and services
- Tests live in `src/test/` directory
- Use Vitest with JSDOM environment
- Run the full validation suite before submitting:
  ```bash
  npm run validate
  ```

## 🔒 Security

- Sanitize all user text inputs through DOMPurify
- Clamp all numeric inputs with `sanitizeNumber` / `clampNumber`
- Never use `dangerouslySetInnerHTML` without sanitization
- Review the [SECURITY.md](./SECURITY.md) policy

## 🧪 Validation Commands

| Command | Purpose |
| --- | --- |
| `npm run type-check` | TypeScript strict compilation |
| `npm run lint` | ESLint code quality checks |
| `npm run test` | Run all 124 automated tests |
| `npm run validate` | Run all three checks sequentially |
| `npm run format` | Auto-format with Prettier |
| `npm run format:check` | Check formatting without modifying |

## 📝 Commit Convention

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <description>

Examples:
feat(simulator): add water usage controls
fix(calculator): correct aviation emission factor
docs(readme): update deployment instructions
test(sanitize): add XSS injection edge cases
```

## 🏗️ Project Architecture

```
src/
├── components/       # React UI components (grouped by feature)
│   ├── Actions/      # Recommendation action cards
│   ├── Assistant/    # EcoAssistant conversational widget
│   ├── Comparison/   # Benchmark comparison view
│   ├── Dashboard/    # Main dashboard with charts and gauges
│   ├── Landing/      # Landing page
│   ├── Layout/       # Header and Footer
│   ├── Onboarding/   # Multi-step onboarding wizard
│   ├── Progress/     # Progress tracking and logging
│   ├── Simulator/    # Interactive emissions simulator
│   └── shared/       # Reusable UI primitives (Button, Card, etc.)
├── constants/        # Emission factors, seeds, and static data
├── hooks/            # Custom React hooks
├── services/         # Business logic (recommendations, assistant)
├── store/            # Zustand state management
├── test/             # Unit and integration tests
├── types/            # TypeScript type definitions
└── utils/            # Pure utility functions
```

## 📄 License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).
