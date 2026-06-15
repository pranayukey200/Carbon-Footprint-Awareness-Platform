/**
 * @fileoverview Primary navigation header for the Carbon Footprint Platform.
 * Provides logo branding and view-switching navigation with full
 * keyboard support and ARIA current-page semantics.
 * @module components/Layout/Header
 */

import { useCallback } from 'react';

/* ─── Types ─────────────────────────────────────────────────────────── */

/** Views the header can navigate to */
type View = 'dashboard' | 'simulator' | 'actions' | 'progress' | 'comparison';

/** Props for the {@link Header} component */
interface HeaderProps {
  /** The currently active view */
  readonly currentView: View;
  /** Callback fired when the user selects a different view */
  readonly onViewChange: (view: View) => void;
}

/** Navigation item descriptor */
interface NavItem {
  readonly id: View;
  readonly label: string;
}

/** Ordered list of navigation destinations */
const NAV_ITEMS: readonly NavItem[] = [
  { id: 'dashboard', label: '🏠 Dashboard' },
  { id: 'simulator', label: '🔬 Simulator' },
  { id: 'actions', label: '⚡ Actions' },
  { id: 'progress', label: '📈 Progress' },
  { id: 'comparison', label: '📊 Comparison' },
] as const;

/* ─── Component ─────────────────────────────────────────────────────── */

/**
 * Application header with logo and primary navigation.
 *
 * @remarks
 * - Active nav button receives `aria-current="page"` for screen readers.
 * - All buttons are fully keyboard-navigable (Tab + Enter/Space).
 *
 * @param props - {@link HeaderProps}
 * @returns The rendered header element.
 *
 * @example
 * ```tsx
 * <Header currentView="dashboard" onViewChange={setView} />
 * ```
 */
export function Header({ currentView, onViewChange }: HeaderProps): React.JSX.Element {
  const handleNavClick = useCallback(
    (view: View) => () => {
      onViewChange(view);
    },
    [onViewChange],
  );

  return (
    <header className="header" role="banner">
      <div
        className="header__logo"
        role="button"
        tabIndex={0}
        onClick={() => onViewChange('dashboard')}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onViewChange('dashboard');
          }
        }}
        style={{ cursor: 'pointer' }}
        aria-label="CarbonLens Logo, Go to Home Page"
      >
        <span className="header__logo-icon" aria-hidden="true">
          🌿
        </span>
        <span className="header__title">CarbonLens</span>
      </div>

      <nav aria-label="Primary navigation">
        <ul className="header__nav" role="list">
          {NAV_ITEMS.map((item) => {
            const isActive = currentView === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={`header__nav-btn${isActive ? ' header__nav-btn--active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={`Navigate to ${item.label}`}
                  onClick={handleNavClick(item.id)}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}

export type { HeaderProps, View };
