import type { KeyboardEvent } from 'react';
import type { Action } from '../../types';
import { useCarbonStore } from '../../store/carbonStore';
import { formatCO2 } from '../../utils/formatters';
import { Card } from '../shared/Card';
import { burstConfetti } from '../../utils/confetti';

/** Props for the {@link ActionCard} component */
interface ActionCardProps {
  /** The action recommendation to display */
  readonly action: Action;
}

/** Maps difficulty levels to display labels */
const DIFFICULTY_LABELS: Record<string, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

/**
 * Displays a single action recommendation with icon, title, description,
 * potential CO₂ saving, and a difficulty badge. Toggles the action's
 * completion state via click or Enter/Space keyboard events.
 * @param props - {@link ActionCardProps}
 * @returns Rendered action card
 */
export function ActionCard({ action }: ActionCardProps): React.JSX.Element {
  const toggleActionCompleted = useCarbonStore((s) => s.toggleActionCompleted);

  const handleToggle = (): void => {
    if (!action.isCompleted) {
      burstConfetti();
    }
    toggleActionCompleted(action.id);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  };

  const cardClasses = [
    'action-card',
    'card--interactive',
    action.isCompleted ? 'card--completed' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Card className={cardClasses} aria-label={`Action: ${action.title}`}>
      <div
        role="button"
        tabIndex={0}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-pressed={action.isCompleted}
        aria-label={`${action.title} — ${action.isCompleted ? 'committed' : 'not committed'}. Press to toggle.`}
        style={{ cursor: 'pointer', outline: 'none' }}
      >
        <div className="action-card__header">
          <span className="action-card__icon" aria-hidden="true">
            {action.icon}
          </span>
          <div className="action-card__info">
            <h3 className="action-card__title">{action.title}</h3>
            <p className="action-card__desc">{action.description}</p>
          </div>
        </div>

        <div
          className="action-card__footer"
          style={{
            display: 'flex',
            gap: 'var(--space-2)',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span className="action-card__saving">
            Save {formatCO2(action.potentialSavingKgCO2)}/yr
          </span>
          <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
            <span
              className={`action-card__difficulty action-card__difficulty--${action.difficulty}`}
            >
              {DIFFICULTY_LABELS[action.difficulty] ?? action.difficulty}
            </span>
            <span
              className="action-card__commit-btn"
              style={{
                fontSize: 'var(--font-size-xs)',
                fontWeight: 'var(--font-weight-bold)',
                padding: 'var(--space-1) var(--space-3)',
                borderRadius: 'var(--radius-full)',
                background: action.isCompleted
                  ? 'var(--color-bg-tertiary)'
                  : 'var(--color-accent-primary)',
                color: action.isCompleted
                  ? 'var(--color-text-secondary)'
                  : 'var(--color-text-inverse)',
                transition: 'all var(--transition-fast)',
              }}
            >
              {action.isCompleted ? '✓ Committed' : 'Commit'}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
