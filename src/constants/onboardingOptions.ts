/**
 * @fileoverview Option constants for Onboarding form fields.
 * @module constants/onboardingOptions
 */

import { TransportMode, FuelType } from '../types';

export interface TransportOption {
  readonly value: TransportMode;
  readonly label: string;
  readonly icon: string;
}

/**
 * Available options for onboarding transport modes.
 */
export const TRANSPORT_OPTIONS: readonly TransportOption[] = [
  { value: TransportMode.Car, label: 'Car', icon: '🚗' },
  { value: TransportMode.PublicTransit, label: 'Public Transit', icon: '🚌' },
  { value: TransportMode.Bicycle, label: 'Bicycle', icon: '🚲' },
  { value: TransportMode.Walking, label: 'Walking', icon: '🚶' },
  { value: TransportMode.Motorcycle, label: 'Motorcycle', icon: '🏍️' },
  { value: TransportMode.ElectricCar, label: 'Electric Car', icon: '⚡' },
];

/**
 * Fuel type options for motorized vehicles.
 */
export const FUEL_OPTIONS: readonly { value: FuelType; label: string }[] = [
  { value: FuelType.Gasoline, label: 'Gasoline' },
  { value: FuelType.Diesel, label: 'Diesel' },
  { value: FuelType.Hybrid, label: 'Hybrid' },
  { value: FuelType.Electric, label: 'Electric' },
];

/**
 * Set of modes that require specifying fuel types.
 */
export const FUEL_MODES = new Set<TransportMode>([TransportMode.Car, TransportMode.Motorcycle]);
