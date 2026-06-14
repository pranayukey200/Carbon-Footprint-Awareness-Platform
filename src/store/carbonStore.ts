/**
 * @fileoverview Zustand store for global application state management.
 * Persists to localStorage for offline support. Manages user profile,
 * carbon calculations, recommendations, and progress tracking.
 * @module store/carbonStore
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AppState,
  AppActions,
  UserProfile,
  TransportProfile,
  DietProfile,
  EnergyProfile,
  ShoppingProfile,
  ProgressEntry,
  TrendDataPoint,
} from '../types';
import { OnboardingStep, DEFAULT_PROFILE } from '../types';
import { calculateTotalFootprint } from '../utils/carbonCalculations';
import { generateRecommendations } from '../services/recommendations';
import { STORAGE_KEYS } from '../utils/storage';

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
        const { userProfile } = get();
        const score = calculateTotalFootprint(userProfile);
        const recommendations = generateRecommendations(userProfile, score);

        const trendPoint: TrendDataPoint = {
          date: new Date().toISOString(),
          totalKgCO2: score.totalAnnualKgCO2,
          transport: score.categories[0]?.annualKgCO2 ?? 0,
          diet: score.categories[1]?.annualKgCO2 ?? 0,
          energy: score.categories[2]?.annualKgCO2 ?? 0,
          shopping: score.categories[3]?.annualKgCO2 ?? 0,
        };

        set((state) => ({
          carbonScore: score,
          recommendations,
          trendData: [...state.trendData.slice(-11), trendPoint],
        }));
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
        set((state) => ({
          recommendations: state.recommendations.map((action) =>
            action.id === actionId ? { ...action, isCompleted: !action.isCompleted } : action,
          ),
        }));
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
