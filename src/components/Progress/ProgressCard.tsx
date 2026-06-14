/**
 * @fileoverview Card displaying a single progress log entry with
 * category icon, title, relative time, and CO₂ saved.
 * @module components/Progress/ProgressCard
 */

import type { ReactNode } from 'react';
import type { ProgressEntry } from '../../types';
import { getRelativeTime, formatCO2 } from '../../utils/formatters';
import { Card } from '../shared/Card';

/** Props for the {@link ProgressCard} component */
interface ProgressCardProps {
  /** The progress entry to display */
  readonly entry: ProgressEntry;
}

/** Category-to-emoji icon mapping */
const CATEGORY_ICONS: Record<string, string> = {
  transport: '🚗',
  diet: '🥗',
  energy: '⚡',
  shopping: '🛍️',
};

/**
 * Displays a single progress entry showing the category icon,
 * action title, relative completion time, and kilograms of CO₂ saved.
 * @param props - {@link ProgressCardProps}
 * @returns Rendered progress card
 */
export function ProgressCard({ entry }: ProgressCardProps): ReactNode {
  const icon = CATEGORY_ICONS[entry.category] ?? '🌱';
  const relativeTime = getRelativeTime(entry.completedAt);

  return (
    <Card className="progress-card" aria-label={`Progress: ${entry.actionTitle}`}>
      <span
        className={`progress-card__icon progress-card__icon--${entry.category}`}
        aria-hidden="true"
      >
        {icon}
      </span>
      <div className="progress-card__content">
        <p className="progress-card__title">{entry.actionTitle}</p>
        <time className="progress-card__date" dateTime={entry.completedAt}>
          {relativeTime}
        </time>
      </div>
      <span className="progress-card__saved" aria-label={`Saved ${formatCO2(entry.kgCO2Saved)}`}>
        -{formatCO2(entry.kgCO2Saved)}
      </span>
    </Card>
  );
}
