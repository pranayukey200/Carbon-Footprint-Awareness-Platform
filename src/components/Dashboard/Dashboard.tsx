/**
 * @fileoverview Main dashboard layout composing CarbonScore, CategoryBreakdown,
 * and TrendChart into a responsive grid.
 * @module components/Dashboard/Dashboard
 */

import type { ReactNode } from 'react';
import { CarbonScore } from './CarbonScore';
import { CategoryBreakdown } from './CategoryBreakdown';
import { TrendChart } from './TrendChart';

/**
 * Main dashboard view arranging the three core visualisation panels.
 *
 * Layout:
 * - **Row 1 (full width):** {@link CarbonScore} — hero score card
 * - **Row 2 (two columns):** {@link CategoryBreakdown} + {@link TrendChart}
 *
 * All child components are eagerly imported since this is the primary view
 * that users land on after onboarding.
 * @returns Rendered dashboard page
 */
export function Dashboard(): ReactNode {
  return (
    <div className="dashboard" role="main" aria-label="Carbon footprint dashboard">
      <header className="dashboard__header">
        <h1 className="dashboard__title">Your Dashboard</h1>
        <p className="dashboard__subtitle">Track, understand, and reduce your carbon footprint</p>
      </header>

      <div className="dashboard__grid">
        <div className="dashboard__full-width">
          <CarbonScore />
        </div>
        <CategoryBreakdown />
        <TrendChart />
      </div>
    </div>
  );
}
