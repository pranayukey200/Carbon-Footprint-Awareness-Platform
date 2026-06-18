/**
 * @fileoverview Accessibility and semantic validation tests.
 * Ensures ARIA patterns, keyboard utilities, and semantic helpers
 * conform to WCAG 2.1 AA requirements.
 * @module test/accessibility
 */

import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import { Button } from '../components/shared/Button';
import { SkipLink } from '../components/shared/SkipLink';
import { InteractiveBackground } from '../components/shared/InteractiveBackground';

/**
 * Validates that a string is a valid ARIA role.
 * @param role - The role attribute value to validate
 * @returns true if the role is a recognized WAI-ARIA role
 */
function isValidAriaRole(role: string): boolean {
  const validRoles = new Set([
    'alert', 'alertdialog', 'application', 'article', 'banner',
    'button', 'cell', 'checkbox', 'columnheader', 'combobox',
    'complementary', 'contentinfo', 'definition', 'dialog',
    'directory', 'document', 'feed', 'figure', 'form', 'grid',
    'gridcell', 'group', 'heading', 'img', 'link', 'list',
    'listbox', 'listitem', 'log', 'main', 'marquee', 'math',
    'menu', 'menubar', 'menuitem', 'menuitemcheckbox',
    'menuitemradio', 'meter', 'navigation', 'none', 'note',
    'option', 'presentation', 'progressbar', 'radio',
    'radiogroup', 'region', 'row', 'rowgroup', 'rowheader',
    'scrollbar', 'search', 'searchbox', 'separator', 'slider',
    'spinbutton', 'status', 'switch', 'tab', 'table', 'tablist',
    'tabpanel', 'term', 'textbox', 'timer', 'toolbar', 'tooltip',
    'tree', 'treegrid', 'treeitem',
  ]);
  return validRoles.has(role);
}

/**
 * Simulates keyboard event handler for accessibility.
 * Returns true if the key should trigger an action (Enter or Space).
 * @param key - The keyboard event key value
 */
function isActivationKey(key: string): boolean {
  return key === 'Enter' || key === ' ';
}

/**
 * Generates a unique, descriptive ID for interactive elements.
 * @param prefix - Component or section prefix
 * @param label - Descriptive label
 */
function generateAccessibleId(prefix: string, label: string): string {
  return `${prefix}-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;
}

/**
 * Validates contrast ratio meets WCAG AA minimum (4.5:1 for normal text).
 * @param ratio - The contrast ratio to validate
 * @param isLargeText - Whether the text is large (>= 18pt or 14pt bold)
 */
function meetsContrastRequirement(ratio: number, isLargeText = false): boolean {
  const threshold = isLargeText ? 3.0 : 4.5;
  return ratio >= threshold;
}

describe('Accessibility: ARIA role validation', () => {
  it('accepts valid landmark roles', () => {
    expect(isValidAriaRole('main')).toBe(true);
    expect(isValidAriaRole('navigation')).toBe(true);
    expect(isValidAriaRole('banner')).toBe(true);
    expect(isValidAriaRole('contentinfo')).toBe(true);
    expect(isValidAriaRole('complementary')).toBe(true);
  });

  it('accepts valid widget roles', () => {
    expect(isValidAriaRole('button')).toBe(true);
    expect(isValidAriaRole('slider')).toBe(true);
    expect(isValidAriaRole('dialog')).toBe(true);
    expect(isValidAriaRole('tablist')).toBe(true);
    expect(isValidAriaRole('progressbar')).toBe(true);
    expect(isValidAriaRole('alert')).toBe(true);
    expect(isValidAriaRole('status')).toBe(true);
  });

  it('rejects invalid or misspelled roles', () => {
    expect(isValidAriaRole('navgation')).toBe(false);
    expect(isValidAriaRole('buton')).toBe(false);
    expect(isValidAriaRole('container')).toBe(false);
    expect(isValidAriaRole('')).toBe(false);
    expect(isValidAriaRole('div')).toBe(false);
  });
});

describe('Accessibility: Keyboard interaction', () => {
  it('identifies Enter as an activation key', () => {
    expect(isActivationKey('Enter')).toBe(true);
  });

  it('identifies Space as an activation key', () => {
    expect(isActivationKey(' ')).toBe(true);
  });

  it('rejects non-activation keys', () => {
    expect(isActivationKey('Tab')).toBe(false);
    expect(isActivationKey('Escape')).toBe(false);
    expect(isActivationKey('ArrowDown')).toBe(false);
    expect(isActivationKey('a')).toBe(false);
  });
});

describe('Accessibility: Unique ID generation', () => {
  it('generates valid HTML IDs from labels', () => {
    expect(generateAccessibleId('nav', 'Dashboard View')).toBe('nav-dashboard-view');
    expect(generateAccessibleId('btn', 'Submit Form')).toBe('btn-submit-form');
  });

  it('strips special characters from generated IDs', () => {
    expect(generateAccessibleId('input', 'CO₂ Emissions!')).toBe('input-co-emissions');
    expect(generateAccessibleId('card', 'Item #3 (active)')).toBe('card-item-3-active');
  });

  it('avoids leading or trailing hyphens', () => {
    expect(generateAccessibleId('sec', '---test---')).toBe('sec-test');
  });
});

describe('Accessibility: Contrast ratio validation', () => {
  it('passes WCAG AA for normal text at 4.5:1 ratio', () => {
    expect(meetsContrastRequirement(4.5)).toBe(true);
    expect(meetsContrastRequirement(7.0)).toBe(true);
  });

  it('fails WCAG AA for normal text below 4.5:1', () => {
    expect(meetsContrastRequirement(4.4)).toBe(false);
    expect(meetsContrastRequirement(3.0)).toBe(false);
  });

  it('passes WCAG AA for large text at 3:1 ratio', () => {
    expect(meetsContrastRequirement(3.0, true)).toBe(true);
    expect(meetsContrastRequirement(4.5, true)).toBe(true);
  });

  it('fails WCAG AA for large text below 3:1', () => {
    expect(meetsContrastRequirement(2.9, true)).toBe(false);
  });
});

describe('Accessibility: DOM Components Rendering', () => {
  it('renders skip link with correct href and screen reader text', () => {
    const { getByRole } = render(React.createElement(SkipLink));
    const link = getByRole('link', { name: /skip to main content/i });
    expect(link).toBeInTheDocument();
    expect(link.getAttribute('href')).toBe('#main-content');
  });

  it('renders button with custom aria-label', () => {
    const { getByRole } = render(
      React.createElement(
        Button,
        { 'aria-label': 'custom-accessible-button' },
        'Click Me'
      )
    );
    const btn = getByRole('button', { name: /custom-accessible-button/i });
    expect(btn).toBeInTheDocument();
    expect(btn.classList.contains('btn')).toBe(true);
  });

  it('hides button icon from screen readers using aria-hidden', () => {
    const { getByRole } = render(
      React.createElement(
        Button,
        { icon: React.createElement('span', null, '🌟') },
        'Star'
      )
    );
    const btn = getByRole('button', { name: /star/i });
    expect(btn).toBeInTheDocument();
    const iconContainer = btn.querySelector('.btn__icon');
    expect(iconContainer).not.toBeNull();
    expect(iconContainer?.getAttribute('aria-hidden')).toBe('true');
  });

  it('hides interactive background canvas from screen readers using aria-hidden', () => {
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = (function () {
      return {
        clearRect: () => {},
        beginPath: () => {},
        moveTo: () => {},
        lineTo: () => {},
        stroke: () => {},
        save: () => {},
        restore: () => {},
        translate: () => {},
        rotate: () => {},
        ellipse: () => {},
        arc: () => {},
        fill: () => {},
      } as unknown as CanvasRenderingContext2D;
    } as unknown as typeof HTMLCanvasElement.prototype.getContext);
    try {
      const { container } = render(React.createElement(InteractiveBackground));
      const canvas = container.querySelector('canvas');
      expect(canvas).not.toBeNull();
      expect(canvas?.getAttribute('aria-hidden')).toBe('true');
    } finally {
      HTMLCanvasElement.prototype.getContext = originalGetContext;
    }
  });
});
