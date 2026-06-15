/**
 * @fileoverview Utility calculations for user action streaks.
 * @module utils/streak
 */

/**
 * Calculates the consecutive day streak of logged actions.
 *
 * @param dates - ISO string timestamps of completed actions.
 * @returns The count of consecutive active days.
 * @example
 * ```ts
 * const streakCount = calculateStreak(['2026-06-14T12:00:00Z', '2026-06-13T12:00:00Z']);
 * ```
 */
export function calculateStreak(dates: readonly string[]): number {
  if (dates.length === 0) {return 0;}
  let streak = 0;
  const today = new Date().setHours(0, 0, 0, 0);
  const uniqueDays = Array.from(new Set(dates.map((d) => new Date(d).setHours(0, 0, 0, 0)))).sort(
    (a, b) => b - a,
  );

  const newestDay = uniqueDays[0];
  if (newestDay && (today - newestDay) / 86400000 <= 1) {
    streak = 1;
    for (let i = 1; i < uniqueDays.length; i++) {
      const prevDay = uniqueDays[i - 1];
      const currDay = uniqueDays[i];
      if (prevDay !== undefined && currDay !== undefined && (prevDay - currDay) / 86400000 <= 1) {
        streak++;
      } else {
        break;
      }
    }
  }
  return streak;
}
export default calculateStreak;
