/**
 * @fileoverview Custom hook for syncing React state with localStorage.
 * Provides a useState-like API with automatic persistence.
 * @module hooks/useLocalStorage
 */

import { useState, useCallback } from 'react';
import { saveState, loadState } from '../utils/storage';

/**
 * React hook that syncs state with localStorage.
 * Falls back to initialValue when no stored data exists.
 *
 * @typeParam T - Type of the stored value
 * @param key - localStorage key
 * @param initialValue - Default value when no stored data exists
 * @returns Tuple of [storedValue, setValue, removeValue]
 *
 * @example
 * ```tsx
 * const [name, setName, removeName] = useLocalStorage('user_name', '');
 * ```
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const stored = loadState<T>(key);
    return stored !== null ? stored : initialValue;
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)): void => {
      setStoredValue((prevValue) => {
        const nextValue = value instanceof Function ? value(prevValue) : value;
        saveState(key, nextValue);
        return nextValue;
      });
    },
    [key],
  );

  const removeValue = useCallback((): void => {
    setStoredValue(initialValue);
    window.localStorage.removeItem(key);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}
