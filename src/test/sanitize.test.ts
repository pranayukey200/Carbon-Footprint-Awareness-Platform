/**
 * @fileoverview Unit tests for sanitization and validation utilities.
 * @module test/sanitize.test
 */

import { describe, it, expect } from 'vitest';
import {
  sanitizeInput,
  sanitizeNumber,
  validateEmail,
  escapeHtml,
  clampNumber,
} from '../utils/sanitize';

describe('sanitizeInput', () => {
  it('removes script tags from input', () => {
    const result = sanitizeInput('<script>alert("xss")</script>Hello');
    expect(result).toBe('Hello');
    expect(result).not.toContain('<script>');
  });

  it('removes event handlers from HTML', () => {
    const result = sanitizeInput('<div onmouseover="alert(1)">Test</div>');
    expect(result).not.toContain('onmouseover');
  });

  it('returns plain text unchanged', () => {
    expect(sanitizeInput('Hello World')).toBe('Hello World');
  });

  it('strips all HTML tags', () => {
    const result = sanitizeInput('<b>Bold</b> and <i>italic</i>');
    expect(result).toBe('Bold and italic');
  });

  it('trims whitespace', () => {
    expect(sanitizeInput('  hello  ')).toBe('hello');
  });

  it('handles empty string', () => {
    expect(sanitizeInput('')).toBe('');
  });
});

describe('sanitizeNumber', () => {
  it('returns valid number as-is', () => {
    expect(sanitizeNumber(42)).toBe(42);
  });

  it('parses numeric strings', () => {
    expect(sanitizeNumber('3.14')).toBeCloseTo(3.14);
  });

  it('returns fallback for NaN', () => {
    expect(sanitizeNumber(NaN, 10)).toBe(10);
  });

  it('returns fallback for non-numeric strings', () => {
    expect(sanitizeNumber('abc', 5)).toBe(5);
  });

  it('returns fallback for undefined', () => {
    expect(sanitizeNumber(undefined, 0)).toBe(0);
  });

  it('returns fallback for null', () => {
    expect(sanitizeNumber(null, 0)).toBe(0);
  });

  it('handles Infinity as invalid', () => {
    expect(sanitizeNumber(Infinity, 0)).toBe(0);
  });

  it('returns 0 as default fallback', () => {
    expect(sanitizeNumber('not-a-number')).toBe(0);
  });
});

describe('validateEmail', () => {
  it('accepts valid email', () => {
    expect(validateEmail('user@example.com')).toBe(true);
  });

  it('accepts email with subdomain', () => {
    expect(validateEmail('user@mail.example.com')).toBe(true);
  });

  it('rejects email without @', () => {
    expect(validateEmail('userexample.com')).toBe(false);
  });

  it('rejects email without domain', () => {
    expect(validateEmail('user@')).toBe(false);
  });

  it('rejects empty string', () => {
    expect(validateEmail('')).toBe(false);
  });
});

describe('escapeHtml', () => {
  it('escapes angle brackets', () => {
    expect(escapeHtml('<div>')).toBe('&lt;div&gt;');
  });

  it('escapes ampersand', () => {
    expect(escapeHtml('a & b')).toBe('a &amp; b');
  });

  it('escapes quotes', () => {
    expect(escapeHtml('"hello"')).toBe('&quot;hello&quot;');
  });

  it('escapes single quotes', () => {
    expect(escapeHtml("it's")).toBe('it&#x27;s');
  });

  it('returns plain text unchanged', () => {
    expect(escapeHtml('Hello World')).toBe('Hello World');
  });
});

describe('clampNumber', () => {
  it('returns value within range', () => {
    expect(clampNumber(5, 0, 10)).toBe(5);
  });

  it('clamps to minimum', () => {
    expect(clampNumber(-5, 0, 10)).toBe(0);
  });

  it('clamps to maximum', () => {
    expect(clampNumber(15, 0, 10)).toBe(10);
  });

  it('handles edge case at boundaries', () => {
    expect(clampNumber(0, 0, 10)).toBe(0);
    expect(clampNumber(10, 0, 10)).toBe(10);
  });
});
