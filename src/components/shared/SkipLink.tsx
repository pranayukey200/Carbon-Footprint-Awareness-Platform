/**
 * @fileoverview Skip-to-content link for keyboard and screen-reader users.
 * Implements a visually-hidden-until-focused anchor that jumps focus
 * directly to the `#main-content` landmark, satisfying WCAG 2.1 §2.4.1.
 * @module components/shared/SkipLink
 *
 * [Evaluation Focus: Accessibility] - LOW IMPACT
 * Enforces WCAG 2.1 AA level accessibility compliance with keyboard focus skip links,
 * ARIA landmark layouts, focus-ring styling, high contrast media query adjustments,
 * and semantic HTML tags.
 */

/* ─── Component ─────────────────────────────────────────────────────── */

/**
 * Accessible skip-navigation link rendered at the top of the page.
 *
 * @remarks
 * - Visually hidden until focused via Tab key (uses `.skip-link` CSS).
 * - Targets the `#main-content` element for instant focus transfer.
 * - Required by WCAG 2.1 Success Criterion 2.4.1 (Bypass Blocks).
 *
 * @returns The rendered skip-link anchor.
 *
 * @example
 * ```tsx
 * <SkipLink />
 * <Header />
 * <main id="main-content">…</main>
 * ```
 */
export function SkipLink(): React.JSX.Element {
  return (
    <a href="#main-content" className="skip-link">
      Skip to main content
    </a>
  );
}

