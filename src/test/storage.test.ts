/**
 * @fileoverview Unit tests for localStorage storage utilities.
 * @module test/storage.test
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  saveState,
  loadState,
  clearState,
  clearAllState,
  isStorageAvailable,
  STORAGE_KEYS,
} from '../utils/storage';

describe('Storage Utilities', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('saveState', () => {
    it('saves data to localStorage', () => {
      const data = { name: 'test', value: 42 };
      const result = saveState('test_key', data);
      expect(result).toBe(true);
      expect(localStorage.getItem('test_key')).toBe(JSON.stringify(data));
    });

    it('saves string data', () => {
      saveState('str_key', 'hello');
      expect(localStorage.getItem('str_key')).toBe('"hello"');
    });

    it('saves arrays', () => {
      const arr = [1, 2, 3];
      saveState('arr_key', arr);
      expect(localStorage.getItem('arr_key')).toBe('[1,2,3]');
    });
  });

  describe('loadState', () => {
    it('loads stored data with correct type', () => {
      localStorage.setItem('typed_key', JSON.stringify({ count: 5 }));
      const result = loadState<{ count: number }>('typed_key');
      expect(result).toEqual({ count: 5 });
    });

    it('returns null for missing key', () => {
      expect(loadState('nonexistent')).toBeNull();
    });

    it('returns null for invalid JSON', () => {
      localStorage.setItem('bad_json', '{invalid}');
      expect(loadState('bad_json')).toBeNull();
    });
  });

  describe('clearState', () => {
    it('removes a stored item', () => {
      localStorage.setItem('to_clear', 'data');
      clearState('to_clear');
      expect(localStorage.getItem('to_clear')).toBeNull();
    });
  });

  describe('clearAllState', () => {
    it('clears all CarbonLens keys', () => {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.setItem(key, 'data');
      });
      clearAllState();
      Object.values(STORAGE_KEYS).forEach((key) => {
        expect(localStorage.getItem(key)).toBeNull();
      });
    });
  });

  describe('isStorageAvailable', () => {
    it('returns true when localStorage is available', () => {
      expect(isStorageAvailable()).toBe(true);
    });
  });

  describe('STORAGE_KEYS', () => {
    it('has all required keys', () => {
      expect(STORAGE_KEYS).toHaveProperty('USER_PROFILE');
      expect(STORAGE_KEYS).toHaveProperty('CARBON_SCORE');
      expect(STORAGE_KEYS).toHaveProperty('PROGRESS_LOG');
      expect(STORAGE_KEYS).toHaveProperty('IS_ONBOARDED');
      expect(STORAGE_KEYS).toHaveProperty('APP_STATE');
    });

    it('keys have carbonlens prefix', () => {
      Object.values(STORAGE_KEYS).forEach((key) => {
        expect(key).toMatch(/^carbonlens_/);
      });
    });
  });
});
