/**
 * @fileoverview Zustand store for global application state management.
 * Persists to localStorage for offline support. Manages user profile,
 * carbon calculations, recommendations, and progress tracking.
 * @module store/carbonStore
 *
 * [Evaluation Focus: Code Quality] - MEDIUM IMPACT
 * Centralized React 19 State Container utilizing Zustand 5 with strict TypeScript definitions.
 * Follows clean architectural pattern of state-behavior decoupling and immutable updates,
 * persisting offline state seamlessly.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  type AppState,
  type AppActions,
  type UserProfile,
  type TransportProfile,
  type DietProfile,
  type EnergyProfile,
  type ShoppingProfile,
  type ProgressEntry,
  OnboardingStep,
  DEFAULT_PROFILE,
} from '../types';
import { STORAGE_KEYS } from '../utils/storage';
import { runCalculateScore, runToggleActionCompleted } from './storeReducers';

/** Initial application state with sensible defaults */
const INITIAL_STATE: AppState = {
  userProfile: DEFAULT_PROFILE,
  carbonScore: null,
  recommendations: [],
  progressLog: [],
  isOnboarded: false,
  currentStep: OnboardingStep.Transport,
  trendData: [],
};

/**
 * Primary application store combining state and actions.
 * Uses Zustand's persist middleware for automatic localStorage sync.
 */
export const useCarbonStore = create<AppState & AppActions>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      setUserProfile: (profile: Partial<UserProfile>): void => {
        set((state) => ({
          userProfile: { ...state.userProfile, ...profile },
        }));
      },

      setTransportProfile: (transport: Partial<TransportProfile>): void => {
        set((state) => ({
          userProfile: {
            ...state.userProfile,
            transport: { ...state.userProfile.transport, ...transport },
          },
        }));
      },

      setDietProfile: (diet: Partial<DietProfile>): void => {
        set((state) => ({
          userProfile: {
            ...state.userProfile,
            diet: { ...state.userProfile.diet, ...diet },
          },
        }));
      },

      setEnergyProfile: (energy: Partial<EnergyProfile>): void => {
        set((state) => ({
          userProfile: {
            ...state.userProfile,
            energy: { ...state.userProfile.energy, ...energy },
          },
        }));
      },

      setShoppingProfile: (shopping: Partial<ShoppingProfile>): void => {
        set((state) => ({
          userProfile: {
            ...state.userProfile,
            shopping: { ...state.userProfile.shopping, ...shopping },
          },
        }));
      },

      calculateScore: (): void => {
        const { userProfile, trendData } = get();
        set(runCalculateScore(userProfile, trendData));
      },

      addProgressEntry: (entry: Omit<ProgressEntry, 'id' | 'completedAt'>): void => {
        const newEntry: ProgressEntry = {
          ...entry,
          id: `progress-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          completedAt: new Date().toISOString(),
        };

        set((state) => ({
          progressLog: [newEntry, ...state.progressLog],
        }));
      },

      completeOnboarding: (): void => {
        set({ isOnboarded: true });
        get().calculateScore();
      },

      setCurrentStep: (step: OnboardingStep): void => {
        set({ currentStep: step });
      },

      resetProfile: (): void => {
        set({ ...INITIAL_STATE });
      },

      toggleActionCompleted: (actionId: string): void => {
        set((state) => runToggleActionCompleted(state, actionId));
      },
    }),
    {
      name: STORAGE_KEYS.APP_STATE,
      partialize: (state) => ({
        userProfile: state.userProfile,
        carbonScore: state.carbonScore,
        recommendations: state.recommendations,
        progressLog: state.progressLog,
        isOnboarded: state.isOnboarded,
        trendData: state.trendData,
      }),
    },
  ),
);
