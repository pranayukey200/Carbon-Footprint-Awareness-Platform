/**
 * @fileoverview Utility helper to synchronize committed actions with the user's permanent profile.
 * @module utils/profileSync
 */

import { type UserProfile, TransportMode, FuelType, DietType } from '../types';

/**
 * Synchronizes a completed action with the user profile state.
 *
 * @param profile - User's current profile.
 * @param actionId - ID of the completed recommendation.
 * @param isCompleted - Whether the action was committed/completed.
 * @returns A new, updated profile object.
 * @example
 * ```ts
 * const updated = syncProfileWithAction(userProfile, 't3', true);
 * ```
 */
export function syncProfileWithAction(
  profile: UserProfile,
  actionId: string,
  isCompleted: boolean,
): UserProfile {
  let transport = { ...profile.transport };
  let diet = { ...profile.diet };
  let energy = { ...profile.energy };
  let shopping = { ...profile.shopping };

  if (isCompleted) {
    switch (actionId) {
      case 't1':
        transport = {
          ...transport,
          primaryMode: TransportMode.PublicTransit,
        };
        break;
      case 't3':
        transport = {
          ...transport,
          primaryMode: TransportMode.ElectricCar,
          fuelType: FuelType.Electric,
        };
        break;
      case 't4':
        transport = {
          ...transport,
          primaryMode: TransportMode.Bicycle,
        };
        break;
      case 't5':
        transport = {
          ...transport,
          flightsPerYear: Math.max(0, transport.flightsPerYear - 1),
        };
        break;
      case 'd2':
        diet = {
          ...diet,
          dietType: DietType.Vegetarian,
        };
        break;
      case 'd3':
        diet = {
          ...diet,
          dietType: DietType.Vegan,
        };
        break;
      case 'e1':
        energy = {
          ...energy,
          renewablePercentage: 100,
        };
        break;
      case 'e5':
        energy = {
          ...energy,
          renewablePercentage: Math.max(80, energy.renewablePercentage),
        };
        break;
      case 's7':
        shopping = {
          ...shopping,
          recyclingRate: 100,
        };
        break;
      default:
        break;
    }
  }

  return {
    ...profile,
    transport,
    diet,
    energy,
    shopping,
  };
}
