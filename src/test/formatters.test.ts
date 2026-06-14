/**
 * @fileoverview Unit tests for formatting utilities.
 * @module test/formatters.test
 */

import { describe, it, expect } from 'vitest';
import {
  formatCO2,
  formatCO2Compact,
  formatPercentage,
  formatDate,
  formatTrend,
  getRelativeTime,
  formatNumber,
  getScoreColor,
} from '../utils/formatters';

describe('formatCO2', () => {
  it('formats small amounts in kg', () => {
    expect(formatCO2(500)).toBe('500 kg');
  });

  it('formats large amounts in tonnes', () => {
    expect(formatCO2(4500)).toBe('4.5 tonnes');
  });

  it('handles exactly 1000 kg', () => {
    expect(formatCO2(1000)).toBe('1.0 tonnes');
  });

  it('handles zero', () => {
    expect(formatCO2(0)).toBe('0 kg');
  });
});

describe('formatCO2Compact', () => {
  it('formats small amounts compactly', () => {
    expect(formatCO2Compact(500)).toBe('500kg');
  });

  it('formats tonnes compactly', () => {
    expect(formatCO2Compact(4500)).toBe('4.5t');
  });
});

describe('formatPercentage', () => {
  it('formats with default decimals', () => {
    expect(formatPercentage(42)).toBe('42%');
  });

  it('formats with specified decimals', () => {
    expect(formatPercentage(42.567, 1)).toBe('42.6%');
  });
});

describe('formatDate', () => {
  it('formats Date object', () => {
    const date = new Date('2024-01-15T12:00:00Z');
    const result = formatDate(date);
    expect(result).toContain('Jan');
    expect(result).toContain('15');
    expect(result).toContain('2024');
  });

  it('formats ISO string', () => {
    const result = formatDate('2024-06-20T12:00:00Z');
    expect(result).toContain('Jun');
    expect(result).toContain('20');
    expect(result).toContain('2024');
  });
});

describe('formatTrend', () => {
  it('detects upward trend', () => {
    const result = formatTrend(110, 100);
    expect(result.direction).toBe('up');
    expect(result.percentage).toContain('+');
  });

  it('detects downward trend', () => {
    const result = formatTrend(90, 100);
    expect(result.direction).toBe('down');
    expect(result.percentage).toContain('-');
  });

  it('detects stable trend for small changes', () => {
    const result = formatTrend(100.5, 100);
    expect(result.direction).toBe('stable');
  });

  it('handles zero previous value', () => {
    const result = formatTrend(100, 0);
    expect(result.direction).toBe('stable');
    expect(result.percentage).toBe('0%');
  });
});

describe('getRelativeTime', () => {
  it('shows "just now" for recent times', () => {
    expect(getRelativeTime(new Date())).toBe('just now');
  });

  it('handles string dates', () => {
    const result = getRelativeTime(new Date(Date.now() - 3600000).toISOString());
    expect(result).toContain('h ago');
  });
});

describe('formatNumber', () => {
  it('formats with separators', () => {
    expect(formatNumber(1234)).toBe('1,234');
  });

  it('handles small numbers', () => {
    expect(formatNumber(42)).toBe('42');
  });
});

describe('getScoreColor', () => {
  it('returns excellent for very low ratio', () => {
    expect(getScoreColor(0.3)).toBe('excellent');
  });

  it('returns good for low ratio', () => {
    expect(getScoreColor(0.7)).toBe('good');
  });

  it('returns average for near-average ratio', () => {
    expect(getScoreColor(1.0)).toBe('average');
  });

  it('returns high for above-average ratio', () => {
    expect(getScoreColor(1.3)).toBe('high');
  });

  it('returns critical for very high ratio', () => {
    expect(getScoreColor(2.0)).toBe('critical');
  });
});
