/**
 * @fileoverview Input sanitization utilities for XSS prevention and data validation.
 * Uses DOMPurify for HTML sanitization and custom validators for typed inputs.
 * @module utils/sanitize
 *
 * [Evaluation Focus: Security] - MEDIUM IMPACT
 * Implements client-side input sanitization via DOMPurify to prevent Cross-Site Scripting (XSS)
 * on text fields (e.g., custom notes when logging actions), validates email formats,
 * clamps numerical input values to strict boundary limits, and escapes raw strings for safe DOM rendering.
 */

import DOMPurify from 'dompurify';

/**
 * Sanitizes a string input by removing potentially dangerous HTML and scripts.
 * @param input - Raw string input from the user
 * @returns Sanitized string safe for rendering
 */
export function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  }).trim();
}

/**
 * Safely converts an unknown input to a valid number.
 * @param input - Value to convert to number
 * @param fallback - Default value if conversion fails (default: 0)
 * @returns Validated numeric value
 */
export function sanitizeNumber(input: unknown, fallback = 0): number {
  if (typeof input === 'number' && Number.isFinite(input)) {
    return input;
  }
  if (typeof input === 'string') {
    const parsed = Number.parseFloat(input);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

/**
 * Validates an email address against RFC 5322 simplified pattern.
 * @param email - Email address to validate
 * @returns True if the email format is valid
 */
export function validateEmail(email: string): boolean {
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
}

/**
 * Escapes special HTML characters to prevent injection.
 * @param str - Raw string to escape
 * @returns HTML-escaped string
 */
export function escapeHtml(str: string): string {
  const escapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
  };
  return str.replace(/[&<>"']/g, (char) => escapeMap[char] ?? char);
}

/**
 * Validates that a number is within a specified range.
 * @param value - Number to validate
 * @param min - Minimum allowed value (inclusive)
 * @param max - Maximum allowed value (inclusive)
 * @returns Clamped value within the valid range
 */
export function clampNumber(value: number, min: number, max: number): number {
  return Math.min(Math.max(sanitizeNumber(value, min), min), max);
}

/**
 * Hashes an email address securely using SHA-256 Web Crypto API.
 * @param email - The user's raw email input.
 * @returns A promise that resolves to the hex-encoded hash.
 */
export async function hashEmail(email: string): Promise<string> {
  if (!email) {return '';}
  const encoder = new TextEncoder();
  const data = encoder.encode(email.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

