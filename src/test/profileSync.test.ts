/**
 * @fileoverview Unit tests for profile synchronization utility.
 * @module test/profileSync.test
 */

import { describe, it, expect } from 'vitest';
import { syncProfileWithAction } from '../utils/profileSync';
import {
  DEFAULT_PROFILE,
  TransportMode,
  FuelType,
  DietType,
} from '../types';

describe('syncProfileWithAction', () => {
  it('does not change profile if isCompleted is false', () => {
    const updated = syncProfileWithAction(DEFAULT_PROFILE, 't1', false);
    expect(updated).toEqual(DEFAULT_PROFILE);
  });

  it('updates transport mode to PublicTransit for t1', () => {
    const updated = syncProfileWithAction(DEFAULT_PROFILE, 't1', true);
    expect(updated.transport.primaryMode).toBe(TransportMode.PublicTransit);
  });

  it('updates transport mode to ElectricCar and fuel to Electric for t3', () => {
    const updated = syncProfileWithAction(DEFAULT_PROFILE, 't3', true);
    expect(updated.transport.primaryMode).toBe(TransportMode.ElectricCar);
    expect(updated.transport.fuelType).toBe(FuelType.Electric);
  });

  it('updates transport mode to Bicycle for t4', () => {
    const updated = syncProfileWithAction(DEFAULT_PROFILE, 't4', true);
    expect(updated.transport.primaryMode).toBe(TransportMode.Bicycle);
  });

  it('decrements flightsPerYear for t5', () => {
    const updated = syncProfileWithAction(DEFAULT_PROFILE, 't5', true);
    expect(updated.transport.flightsPerYear).toBe(
      Math.max(0, DEFAULT_PROFILE.transport.flightsPerYear - 1),
    );
  });

  it('bounds flightsPerYear to minimum 0 for t5', () => {
    const zeroFlightProfile = {
      ...DEFAULT_PROFILE,
      transport: {
        ...DEFAULT_PROFILE.transport,
        flightsPerYear: 0,
      },
    };
    const updated = syncProfileWithAction(zeroFlightProfile, 't5', true);
    expect(updated.transport.flightsPerYear).toBe(0);
  });

  it('updates diet type to Vegetarian for d2', () => {
    const updated = syncProfileWithAction(DEFAULT_PROFILE, 'd2', true);
    expect(updated.diet.dietType).toBe(DietType.Vegetarian);
  });

  it('updates diet type to Vegan for d3', () => {
    const updated = syncProfileWithAction(DEFAULT_PROFILE, 'd3', true);
    expect(updated.diet.dietType).toBe(DietType.Vegan);
  });

  it('updates renewable energy to 100% for e1', () => {
    const updated = syncProfileWithAction(DEFAULT_PROFILE, 'e1', true);
    expect(updated.energy.renewablePercentage).toBe(100);
  });

  it('increases renewable energy to at least 80% for e5', () => {
    const lowRenewableProfile = {
      ...DEFAULT_PROFILE,
      energy: {
        ...DEFAULT_PROFILE.energy,
        renewablePercentage: 20,
      },
    };
    const updated = syncProfileWithAction(lowRenewableProfile, 'e5', true);
    expect(updated.energy.renewablePercentage).toBe(80);

    const highRenewableProfile = {
      ...DEFAULT_PROFILE,
      energy: {
        ...DEFAULT_PROFILE.energy,
        renewablePercentage: 90,
      },
    };
    const updatedHigh = syncProfileWithAction(highRenewableProfile, 'e5', true);
    expect(updatedHigh.energy.renewablePercentage).toBe(90);
  });

  it('updates recycling rate to 100% for s7', () => {
    const updated = syncProfileWithAction(DEFAULT_PROFILE, 's7', true);
    expect(updated.shopping.recyclingRate).toBe(100);
  });

  it('ignores unknown actions', () => {
    const updated = syncProfileWithAction(DEFAULT_PROFILE, 'unknown_action', true);
    expect(updated).toEqual(DEFAULT_PROFILE);
  });
});
