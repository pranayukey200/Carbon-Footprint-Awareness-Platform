/**
 * @fileoverview Filterable list of action recommendations with category
 * filter buttons and a completed/total counter.
 * @module components/Actions/ActionList
 */

import { useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useCarbonStore } from '../../store/carbonStore';
import { CategoryType } from '../../types';
import { ActionCard } from './ActionCard';

/** Filter option definition */
interface FilterOption {
  readonly label: string;
  readonly value: CategoryType | 'all';
}

/** Available category filters */
const FILTERS: readonly FilterOption[] = [
  { label: 'All', value: 'all' },
  { label: 'Transport', value: CategoryType.Transport },
  { label: 'Diet', value: CategoryType.Diet },
  { label: 'Energy', value: CategoryType.Energy },
  { label: 'Shopping', value: CategoryType.Shopping },
] as const;

/**
 * Lists all action recommendations from the store with category filter
 * buttons and a completed vs total progress counter.
 * @returns Rendered action list with filters
 */
export function ActionList(): ReactNode {
  const recommendations = useCarbonStore((s) => s.recommendations);
  const [activeFilter, setActiveFilter] = useState<CategoryType | 'all'>('all');

  const filtered = useMemo(
    () =>
      activeFilter === 'all'
        ? [...recommendations]
        : recommendations.filter((a) => a.category === activeFilter),
    [recommendations, activeFilter],
  );

  const completedCount = recommendations.filter((a) => a.isCompleted).length;

  return (
    <div className="actions" aria-label="Action recommendations">
      <div className="actions__header">
        <h2 className="actions__title">Recommended Actions</h2>
        <p aria-live="polite" aria-atomic="true">
          {completedCount} of {recommendations.length} completed
        </p>
      </div>

      <nav className="actions__filters" aria-label="Filter actions by category">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            className={`btn btn--ghost${activeFilter === f.value ? ' btn--primary' : ''}`}
            onClick={() => setActiveFilter(f.value)}
            aria-pressed={activeFilter === f.value}
            aria-label={`Filter by ${f.label}`}
          >
            {f.label}
          </button>
        ))}
      </nav>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state__icon" aria-hidden="true">
            🔍
          </p>
          <p className="empty-state__desc">No recommendations for this category yet.</p>
        </div>
      ) : (
        <div className="actions__grid" role="list" aria-label="Action cards">
          {filtered.map((action) => (
            <div role="listitem" key={action.id}>
              <ActionCard action={action} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
