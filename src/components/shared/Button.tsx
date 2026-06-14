/**
 * @fileoverview Reusable, accessible button component with variant theming.
 * Supports primary, secondary, and ghost variants, optional icon, and
 * full-width layout. Forwards refs for parent DOM access.
 * @module components/shared/Button
 */

import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

/* ─── Types ─────────────────────────────────────────────────────────── */

/** Visual style variant for the button */
type ButtonVariant = 'primary' | 'secondary' | 'ghost';

/** Size presets for the button */
type ButtonSize = 'default' | 'lg';

/** Props for the {@link Button} component */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant — controls colours and emphasis. @defaultValue `'primary'` */
  readonly variant?: ButtonVariant;
  /** Size preset. @defaultValue `'default'` */
  readonly size?: ButtonSize;
  /** Whether the button stretches to fill its container. @defaultValue `false` */
  readonly fullWidth?: boolean;
  /** Optional icon element rendered before the label */
  readonly icon?: ReactNode;
  /** Accessible label — forwarded to `aria-label` */
  readonly 'aria-label'?: string;
}

/* ─── Helpers ───────────────────────────────────────────────────────── */

/**
 * Builds the BEM class string from button props.
 *
 * @param variant  - Visual variant
 * @param size     - Size preset
 * @param fullWidth - Whether the button is full-width
 * @param extra    - Additional class names from consumers
 * @returns The composed class string
 */
function buildClassName(
  variant: ButtonVariant,
  size: ButtonSize,
  fullWidth: boolean,
  extra?: string,
): string {
  const classes: string[] = ['btn', `btn--${variant}`];

  if (size === 'lg') {
    classes.push('btn--lg');
  }

  if (fullWidth) {
    classes.push('btn--full');
  }

  if (extra) {
    classes.push(extra);
  }

  return classes.join(' ');
}

/* ─── Component ─────────────────────────────────────────────────────── */

/**
 * Accessible, polymorphic button with variant styling and icon support.
 *
 * @remarks
 * - Forwards a ref to the underlying `<button>` element.
 * - Inherits all native button attributes via `ButtonHTMLAttributes`.
 * - Keyboard accessible by default (Enter / Space).
 *
 * @param props - {@link ButtonProps}
 * @returns The rendered button element.
 *
 * @example
 * ```tsx
 * <Button variant="secondary" size="lg" icon={<PlusIcon />}>
 *   Add Action
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'default',
    fullWidth = false,
    icon,
    className,
    children,
    type = 'button',
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={buildClassName(variant, size, fullWidth, className)}
      {...rest}
    >
      {icon && (
        <span className="btn__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </button>
  );
});

export default Button;
export type { ButtonProps, ButtonVariant, ButtonSize };
