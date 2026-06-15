/**
 * @fileoverview Shared enums for the Carbon Footprint Awareness Platform.
 * @module types/common
 */

/** Categories of carbon emission sources tracked by the platform */
export enum CategoryType {
  Transport = 'transport',
  Diet = 'diet',
  Energy = 'energy',
  Shopping = 'shopping',
}

/** Primary transport modes with emission factors */
export enum TransportMode {
  Car = 'car',
  PublicTransit = 'publicTransit',
  Bicycle = 'bicycle',
  Walking = 'walking',
  Motorcycle = 'motorcycle',
  ElectricCar = 'electricCar',
}

/** Fuel types for motor vehicles */
export enum FuelType {
  Gasoline = 'gasoline',
  Diesel = 'diesel',
  Hybrid = 'hybrid',
  Electric = 'electric',
}

/** Dietary patterns ranked by emissions impact */
export enum DietType {
  MeatHeavy = 'meatHeavy',
  Average = 'average',
  Vegetarian = 'vegetarian',
  Vegan = 'vegan',
}

/** Household energy source types */
export enum EnergySource {
  Electricity = 'electricity',
  NaturalGas = 'naturalGas',
  HeatingOil = 'heatingOil',
  Solar = 'solar',
  Wind = 'wind',
}

/** Difficulty levels for recommended actions */
export enum Difficulty {
  Easy = 'easy',
  Medium = 'medium',
  Hard = 'hard',
}

/** Steps in the onboarding form flow */
export enum OnboardingStep {
  Personal = 0,
  Transport = 1,
  Diet = 2,
  Energy = 3,
  Shopping = 4,
  Review = 5,
}
