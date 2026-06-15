/**
 * @fileoverview Formatting utilities for displaying carbon data, numbers, and dates.
 * @module utils/formatters
 */

/**
 * Formats a CO2 amount in kg to a human-readable string with appropriate units.
 * @param kg - Amount in kilograms of CO2
 * @returns Formatted string (e.g., "4.5 tonnes" or "450 kg")
 */
export function formatCO2(kg: number): string {
  if (kg >= 1000) {
    const tonnes = (kg / 1000).toFixed(1);
    return `${tonnes} tonnes`;
  }
  return `${Math.round(kg)} kg`;
}

/**
 * Formats a CO2 amount with unit suffix for compact display.
 * @param kg - Amount in kilograms of CO2
 * @returns Compact formatted string (e.g., "4.5t" or "450kg")
 */
export function formatCO2Compact(kg: number): string {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(1)}t`;
  }
  return `${Math.round(kg)}kg`;
}

/**
 * Formats a decimal value as a percentage string.
 * @param value - Numeric value to format as percentage
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted percentage string (e.g., "42%")
 */
export function formatPercentage(value: number, decimals = 0): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Formats a date to a localized, readable string.
 * @param date - Date object or ISO string to format
 * @returns Formatted date string (e.g., "Jan 15, 2024")
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Calculates and formats the trend between two values.
 * @param current - Current value
 * @param previous - Previous value for comparison
 * @returns Trend direction and formatted percentage change
 */
export function formatTrend(
  current: number,
  previous: number,
): { direction: 'up' | 'down' | 'stable'; percentage: string } {
  if (previous === 0) {
    return { direction: 'stable', percentage: '0%' };
  }
  const change = ((current - previous) / previous) * 100;
  const absChange = Math.abs(change).toFixed(1);

  if (change > 1) {
    return { direction: 'up', percentage: `+${absChange}%` };
  }
  if (change < -1) {
    return { direction: 'down', percentage: `-${absChange}%` };
  }
  return { direction: 'stable', percentage: '0%' };
}

/**
 * Converts a date to a relative time string (e.g., "2 hours ago").
 * @param date - Date to convert
 * @returns Human-readable relative time string
 */
export function getRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) {return 'just now';}
  if (diffMinutes < 60) {return `${diffMinutes}m ago`;}
  if (diffHours < 24) {return `${diffHours}h ago`;}
  if (diffDays < 7) {return `${diffDays}d ago`;}
  return formatDate(dateObj);
}

/**
 * Formats a large number with locale-appropriate separators.
 * @param value - Number to format
 * @returns Formatted number string (e.g., "1,234")
 */
export function formatNumber(value: number): string {
  return value.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

/**
 * Returns a color class name based on a score comparison to averages.
 * @param ratio - Ratio of user score to average (< 1 is good)
 * @returns CSS class suffix for color coding
 */
export function getScoreColor(ratio: number): string {
  if (ratio <= 0.5) {return 'excellent';}
  if (ratio <= 0.8) {return 'good';}
  if (ratio <= 1.2) {return 'average';}
  if (ratio <= 1.5) {return 'high';}
  return 'critical';
}
