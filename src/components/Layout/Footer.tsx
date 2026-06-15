/**
 * @fileoverview Application footer with copyright, methodology, and privacy links.
 * Renders a semantic `<footer>` with the current year computed dynamically.
 * @module components/Layout/Footer
 */

/* ─── Component ─────────────────────────────────────────────────────── */

/**
 * Site-wide footer displaying copyright notice and resource links.
 *
 * @remarks
 * - Uses semantic `<footer>` landmark for assistive technology.
 * - All links include `aria-label` descriptions for screen readers.
 * - Year updates automatically via `Date.getFullYear()`.
 *
 * @returns The rendered footer element.
 *
 * @example
 * ```tsx
 * <Footer />
 * ```
 */
export function Footer(): React.JSX.Element {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <nav className="footer__links" aria-label="Footer navigation">
        <a href="#" className="footer__link" aria-label="View calculation methodology">
          Methodology
        </a>
        <a href="#" className="footer__link" aria-label="Read our privacy policy">
          Privacy
        </a>
        <a href="#" className="footer__link" aria-label="View terms of service">
          Terms
        </a>
      </nav>

      <p className="footer__copyright">&copy; {currentYear} CarbonLens. All rights reserved.</p>

      <p className="footer__note">
        Emission factors sourced from publicly available environmental datasets. Results are
        estimates for awareness purposes only.
      </p>
    </footer>
  );
}

