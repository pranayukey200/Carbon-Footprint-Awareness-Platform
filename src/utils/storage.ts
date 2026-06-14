/**
 * @fileoverview localStorage persistence utilities with error handling and data hashing.
 * Provides type-safe read/write operations with SHA-256 hashing for sensitive data.
 * @module utils/storage
 */

/** Storage key constants to prevent key collisions */
export const STORAGE_KEYS = {
  USER_PROFILE: 'carbonlens_user_profile',
  CARBON_SCORE: 'carbonlens_carbon_score',
  PROGRESS_LOG: 'carbonlens_progress_log',
  IS_ONBOARDED: 'carbonlens_is_onboarded',
  TREND_DATA: 'carbonlens_trend_data',
  APP_STATE: 'carbonlens_app_state',
} as const;

/**
 * Saves data to localStorage with JSON serialization.
 * @param key - Storage key identifier
 * @param data - Data to persist
 * @returns True if saved successfully, false otherwise
 */
export function saveState<T>(key: string, data: T): boolean {
  try {
    const serialized = JSON.stringify(data);
    window.localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error(`[Storage] Failed to save key "${key}":`, error);
    return false;
  }
}

/**
 * Loads and parses data from localStorage with type safety.
 * @param key - Storage key identifier
 * @returns Parsed data or null if not found/invalid
 */
export function loadState<T>(key: string): T | null {
  try {
    const serialized = window.localStorage.getItem(key);
    if (serialized === null) {
      return null;
    }
    return JSON.parse(serialized) as T;
  } catch (error) {
    console.error(`[Storage] Failed to load key "${key}":`, error);
    return null;
  }
}

/**
 * Removes a stored item from localStorage.
 * @param key - Storage key identifier
 */
export function clearState(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`[Storage] Failed to clear key "${key}":`, error);
  }
}

/**
 * Clears all CarbonLens data from localStorage.
 */
export function clearAllState(): void {
  Object.values(STORAGE_KEYS).forEach(clearState);
}

/**
 * Hashes sensitive data using SHA-256 via the Web Crypto API.
 * @param data - String data to hash
 * @returns Hex-encoded SHA-256 hash
 */
export async function hashSensitiveData(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Checks if localStorage is available and functional.
 * @returns True if localStorage is accessible
 */
export function isStorageAvailable(): boolean {
  try {
    const testKey = '__carbonlens_storage_test__';
    window.localStorage.setItem(testKey, 'test');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}
