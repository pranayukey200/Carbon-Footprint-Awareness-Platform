/**
 * @fileoverview Reusable card container with interactive and completed states.
 * Provides a semantic `<section>` wrapper with BEM-based class modifiers
 * and keyboard-focusable support for interactive cards.
 * @module components/shared/Card
 */

import type { ReactNode, HTMLAttributes, KeyboardEvent } from 'react';

/* ─── Types ─────────────────────────────────────────────────────────── */

/** Props for the {@link Card} component */
interface CardProps extends HTMLAttributes<HTMLElement> {
  /** Card content */
  readonly children: ReactNode;
  /** Whether the card is clickable / hoverable. @defaultValue `false` */
  readonly interactive?: boolean;
  /** Whether the card represents a completed item. @defaultValue `false` */
  readonly completed?: boolean;
  /** Additional CSS class names */
  readonly className?: string;
  /** Callback invoked when an interactive card is activated (click or Enter/Space) */
  readonly onActivate?: () => void;
}

/* ─── Helpers ───────────────────────────────────────────────────────── */

/**
 * Builds the BEM class string from card props.
 *
 * @param interactive - Whether the card is interactive
 * @param completed   - Whether the card is completed
 * @param extra       - Additional class names from consumers
 * @returns The composed class string
 */
function buildClassName(interactive: boolean, completed: boolean, extra?: string): string {
  const classes: string[] = ['card'];

  if (interactive) {
    classes.push('card--interactive');
  }

  if (completed) {
    classes.push('card--completed');
  }

  if (extra) {
    classes.push(extra);
  }

  return classes.join(' ');
}

/* ─── Component ─────────────────────────────────────────────────────── */

/**
 * Semantic card container with optional interactivity and completion styling.
 *
 * @remarks
 * - Interactive cards receive `tabIndex={0}` and respond to Enter / Space.
 * - Uses `role="button"` when interactive for correct screen-reader semantics.
 * - Completed state adds a visual indicator class.
 *
 * @param props - {@link CardProps}
 * @returns The rendered card section.
 *
 * @example
 * ```tsx
 * <Card interactive completed={false} onActivate={handleClick}>
 *   <h3>Switch to LED Bulbs</h3>
 *   <p>Save up to 75% energy on lighting.</p>
 * </Card>
 * ```
 */
export function Card({
  children,
  interactive = false,
  completed = false,
  className,
  onActivate,
  ...rest
}: CardProps): React.JSX.Element {
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>): void => {
    if (interactive && onActivate && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onActivate();
    }
  };

  return (
    <section
      className={buildClassName(interactive, completed, className)}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? (rest['aria-label'] ?? 'Interactive card') : rest['aria-label']}
      onClick={interactive ? onActivate : undefined}
      onKeyDown={interactive ? handleKeyDown : undefined}
      {...rest}
    >
      {children}
    </section>
  );
}

export default Card;
export type { CardProps };
