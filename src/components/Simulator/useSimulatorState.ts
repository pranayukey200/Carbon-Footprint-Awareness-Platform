import { useState, useMemo } from 'react';
import { useCarbonStore } from '../../store/carbonStore';
import { calculateTotalFootprint } from '../../utils/carbonCalculations';
import type { SimState } from './types';

/**
 * Custom hook managing the simulator's state, data projection computations, and profile changes.
 */
export const useSimulatorState = () => {
  const userProfile = useCarbonStore((s) => s.userProfile);
  const carbonScore = useCarbonStore((s) => s.carbonScore);
  const setTransportProfile = useCarbonStore((s) => s.setTransportProfile);
  const setDietProfile = useCarbonStore((s) => s.setDietProfile);
  const setEnergyProfile = useCarbonStore((s) => s.setEnergyProfile);
  const setShoppingProfile = useCarbonStore((s) => s.setShoppingProfile);
  const calculateScore = useCarbonStore((s) => s.calculateScore);

  const baselineScore = carbonScore ? carbonScore.totalAnnualKgCO2 : 6000;

  const [activeCategoryTab, setActiveCategoryTab] = useState<'transport' | 'diet' | 'energy' | 'shopping'>('transport');
  const [successMessage, setSuccessMessage] = useState('');

  const [simState, setSimState] = useState<SimState>({
    dist: userProfile.transport.weeklyDistanceKm,
    mode: userProfile.transport.primaryMode,
    flights: userProfile.transport.flightsPerYear,
    flightHours: userProfile.transport.averageFlightHours,
    fuel: userProfile.transport.fuelType,
    diet: userProfile.diet.dietType,
    localFood: userProfile.diet.localFoodPercentage,
    foodWaste: userProfile.diet.foodWastePercentage,
    elec: userProfile.energy.monthlyElectricityKwh,
    gas: userProfile.energy.monthlyGasUsageTherms,
    renew: userProfile.energy.renewablePercentage,
    houseSize: userProfile.energy.householdSize,
    spend: userProfile.shopping.monthlySpendingUsd,
    fashion: userProfile.shopping.fastFashionFrequency,
    electronics: userProfile.shopping.electronicsPerYear,
    recycle: userProfile.shopping.recyclingRate,
  });

  const updateSimState = <K extends keyof SimState>(key: K, val: SimState[K]) => {
    setSimState((prev) => ({ ...prev, [key]: val }));
  };

  const simulatedProfile = useMemo(() => {
    return {
      transport: {
        primaryMode: simState.mode,
        fuelType: simState.fuel,
        weeklyDistanceKm: simState.dist,
        flightsPerYear: simState.flights,
        averageFlightHours: simState.flightHours,
      },
      diet: {
        dietType: simState.diet,
        localFoodPercentage: simState.localFood,
        foodWastePercentage: simState.foodWaste,
      },
      energy: {
        monthlyElectricityKwh: simState.elec,
        monthlyGasUsageTherms: simState.gas,
        renewablePercentage: simState.renew,
        householdSize: simState.houseSize,
      },
      shopping: {
        monthlySpendingUsd: simState.spend,
        fastFashionFrequency: simState.fashion,
        electronicsPerYear: simState.electronics,
        recyclingRate: simState.recycle,
      },
    };
  }, [simState]);

  const simulatedScore = useMemo(() => {
    return calculateTotalFootprint(simulatedProfile).totalAnnualKgCO2;
  }, [simulatedProfile]);

  const savings = baselineScore - simulatedScore;

  const chartData = useMemo(() => {
    const baselineCats = carbonScore ? carbonScore.categories : [];
    const simulatedCats = calculateTotalFootprint(simulatedProfile).categories;

    return ['transport', 'diet', 'energy', 'shopping'].map((cat) => {
      const baseVal = baselineCats.find((c) => c.category === cat)?.annualKgCO2 || 0;
      const simVal = simulatedCats.find((c) => c.category === cat)?.annualKgCO2 || 0;
      return {
        name: cat.charAt(0).toUpperCase() + cat.slice(1),
        Baseline: baseVal,
        Simulated: simVal,
      };
    });
  }, [simulatedProfile, carbonScore]);

  const pieData = useMemo(() => {
    const simulatedCats = calculateTotalFootprint(simulatedProfile).categories;
    const colorsMap: Record<string, string> = {
      transport: '#3b82f6',
      diet: '#1d9e75',
      energy: '#f2a623',
      shopping: '#8b5cf6',
    };

    return simulatedCats.map((c) => ({
      name: c.category.charAt(0).toUpperCase() + c.category.slice(1),
      value: c.annualKgCO2,
      fill: colorsMap[c.category] || '#1d9e75',
    }));
  }, [simulatedProfile]);

  const handleApply = () => {
    setTransportProfile(simulatedProfile.transport);
    setDietProfile(simulatedProfile.diet);
    setEnergyProfile(simulatedProfile.energy);
    setShoppingProfile(simulatedProfile.shopping);

    setTimeout(() => {
      calculateScore();
      setSuccessMessage('Successfully applied simulation inputs to your profile!');
      setTimeout(() => setSuccessMessage(''), 4000);
    }, 100);
  };

  return {
    activeCategoryTab,
    setActiveCategoryTab,
    simState,
    updateSimState,
    simulatedScore,
    savings,
    chartData,
    pieData,
    successMessage,
    handleApply,
  };
};
