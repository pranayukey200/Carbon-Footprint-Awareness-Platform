import {
  type UserProfile,
  type CarbonScore,
  type Action,
  Difficulty,
  CategoryType,
  TransportMode,
  FuelType,
  DietType,
} from '../types/index.ts';

/** Internal blueprint for a recommendation before relevance filtering. */
interface RecommendationSeed {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly category: CategoryType;
  readonly potentialSavingKgCo2: number;
  readonly difficulty: Difficulty;
  /** Returns true if this recommendation is relevant to the profile. */
  readonly isRelevant: (profile: UserProfile) => boolean;
}

/** Master catalogue of 24 actionable recommendations. */
const RECOMMENDATION_SEEDS: readonly RecommendationSeed[] = [
  // ── Transport ─────────────────────────────────────────────────
  {
    id: 't1',
    title: 'Switch to public transit',
    description: 'Replace car commutes with bus or rail to cut per-km emissions by 60%.',
    category: CategoryType.Transport,
    potentialSavingKgCo2: 2200,
    difficulty: Difficulty.Medium,
    isRelevant: (p) => p.transport.primaryMode === TransportMode.Car,
  },
  {
    id: 't2',
    title: 'Carpool to work',
    description: 'Sharing rides with one colleague halves your commute emissions.',
    category: CategoryType.Transport,
    potentialSavingKgCo2: 1100,
    difficulty: Difficulty.Easy,
    isRelevant: (p) => p.transport.primaryMode === TransportMode.Car,
  },
  {
    id: 't3',
    title: 'Switch to an electric vehicle',
    description: 'EVs produce ~75% fewer lifecycle emissions than petrol cars.',
    category: CategoryType.Transport,
    potentialSavingKgCo2: 3000,
    difficulty: Difficulty.Hard,
    isRelevant: (p) =>
      p.transport.primaryMode === TransportMode.Car && p.transport.fuelType !== FuelType.Electric,
  },
  {
    id: 't4',
    title: 'Cycle for short commutes',
    description: 'Trips under 8 km are faster by bike in most cities—and zero-emission.',
    category: CategoryType.Transport,
    potentialSavingKgCo2: 800,
    difficulty: Difficulty.Easy,
    isRelevant: (p) => p.transport.weeklyDistanceKm < 60 && p.transport.weeklyDistanceKm > 0,
  },
  {
    id: 't5',
    title: 'Reduce flights by one per year',
    description: 'A single round-trip domestic flight emits ~800 kg CO₂.',
    category: CategoryType.Transport,
    potentialSavingKgCo2: 816,
    difficulty: Difficulty.Medium,
    isRelevant: (p) => p.transport.flightsPerYear > 0,
  },
  {
    id: 't6',
    title: 'Choose direct flights',
    description: 'Layovers add takeoff fuel burn. Direct routes cut flight emissions ~20%.',
    category: CategoryType.Transport,
    potentialSavingKgCo2: 400,
    difficulty: Difficulty.Easy,
    isRelevant: (p) => p.transport.flightsPerYear >= 2,
  },

  // ── Diet ──────────────────────────────────────────────────────
  {
    id: 'd1',
    title: 'Try Meatless Mondays',
    description: 'Skipping meat one day a week saves ~350 kg CO₂/year.',
    category: CategoryType.Diet,
    potentialSavingKgCo2: 350,
    difficulty: Difficulty.Easy,
    isRelevant: (p) =>
      p.diet.dietType === DietType.MeatHeavy || p.diet.dietType === DietType.Average,
  },
  {
    id: 'd2',
    title: 'Shift to a vegetarian diet',
    description: 'Cutting meat entirely reduces food emissions by up to 50%.',
    category: CategoryType.Diet,
    potentialSavingKgCo2: 800,
    difficulty: Difficulty.Medium,
    isRelevant: (p) =>
      p.diet.dietType === DietType.MeatHeavy || p.diet.dietType === DietType.Average,
  },
  {
    id: 'd3',
    title: 'Adopt a vegan diet',
    description: 'Plant-based diets have the lowest food carbon footprint.',
    category: CategoryType.Diet,
    potentialSavingKgCo2: 1200,
    difficulty: Difficulty.Hard,
    isRelevant: (p) => p.diet.dietType !== DietType.Vegan,
  },
  {
    id: 'd4',
    title: 'Buy local and seasonal produce',
    description: 'Locally grown food travels fewer food-miles, cutting ~150 kg CO₂/year.',
    category: CategoryType.Diet,
    potentialSavingKgCo2: 150,
    difficulty: Difficulty.Easy,
    isRelevant: () => true,
  },
  {
    id: 'd5',
    title: 'Reduce food waste',
    description: 'The average household wastes 30% of food—plan meals to save ~200 kg CO₂.',
    category: CategoryType.Diet,
    potentialSavingKgCo2: 200,
    difficulty: Difficulty.Easy,
    isRelevant: () => true,
  },

  // ── Energy ────────────────────────────────────────────────────
  {
    id: 'e1',
    title: 'Switch to a green energy tariff',
    description: 'Renewable electricity reduces grid emissions to near zero.',
    category: CategoryType.Energy,
    potentialSavingKgCo2: 2500,
    difficulty: Difficulty.Easy,
    isRelevant: (p) => p.energy.monthlyElectricityKwh > 0 && p.energy.renewablePercentage < 100,
  },
  {
    id: 'e2',
    title: 'Install a smart thermostat',
    description: 'Optimised heating schedules cut gas use by ~15%.',
    category: CategoryType.Energy,
    potentialSavingKgCo2: 500,
    difficulty: Difficulty.Medium,
    isRelevant: (p) => p.energy.monthlyGasUsageTherms > 0,
  },
  {
    id: 'e3',
    title: 'Upgrade to LED lighting',
    description: 'LEDs use 75% less energy than incandescents across your home.',
    category: CategoryType.Energy,
    potentialSavingKgCo2: 200,
    difficulty: Difficulty.Easy,
    isRelevant: () => true,
  },
  {
    id: 'e4',
    title: 'Insulate your home',
    description: 'Proper insulation reduces heating/cooling energy by up to 40%.',
    category: CategoryType.Energy,
    potentialSavingKgCo2: 1200,
    difficulty: Difficulty.Hard,
    isRelevant: (p) => p.energy.monthlyGasUsageTherms > 20,
  },
  {
    id: 'e5',
    title: 'Install solar panels',
    description: 'Rooftop solar can offset 80%+ of household electricity emissions.',
    category: CategoryType.Energy,
    potentialSavingKgCo2: 3000,
    difficulty: Difficulty.Hard,
    isRelevant: (p) => p.energy.monthlyElectricityKwh > 0 && p.energy.renewablePercentage < 80,
  },
  {
    id: 'e6',
    title: 'Air-dry laundry',
    description: 'Skipping the dryer saves ~200 kWh/year—easy and free.',
    category: CategoryType.Energy,
    potentialSavingKgCo2: 80,
    difficulty: Difficulty.Easy,
    isRelevant: () => true,
  },

  // ── Shopping ──────────────────────────────────────────────────
  {
    id: 's1',
    title: 'Buy second-hand clothing',
    description: 'Thrifting avoids the ~10 kg CO₂ embedded in each new garment.',
    category: CategoryType.Shopping,
    potentialSavingKgCo2: 400,
    difficulty: Difficulty.Easy,
    isRelevant: (p) => p.shopping.monthlySpendingUsd > 100,
  },
  {
    id: 's2',
    title: 'Repair instead of replace',
    description: 'Extending product life by a year cuts lifecycle emissions significantly.',
    category: CategoryType.Shopping,
    potentialSavingKgCo2: 300,
    difficulty: Difficulty.Easy,
    isRelevant: () => true,
  },
  {
    id: 's3',
    title: 'Choose durable goods',
    description: 'Investing in quality products reduces replacement frequency.',
    category: CategoryType.Shopping,
    potentialSavingKgCo2: 250,
    difficulty: Difficulty.Medium,
    isRelevant: (p) => p.shopping.monthlySpendingUsd > 200,
  },
  {
    id: 's4',
    title: 'Cancel unused subscriptions',
    description: 'Digital services have data-centre footprints—keep only what you use.',
    category: CategoryType.Shopping,
    potentialSavingKgCo2: 50,
    difficulty: Difficulty.Easy,
    isRelevant: () => true,
  },
  {
    id: 's5',
    title: 'Reduce impulse purchases',
    description: 'A 48-hour rule before buying cuts unnecessary consumption by ~30%.',
    category: CategoryType.Shopping,
    potentialSavingKgCo2: 350,
    difficulty: Difficulty.Easy,
    isRelevant: (p) => p.shopping.monthlySpendingUsd > 150,
  },
  {
    id: 's6',
    title: 'Buy refurbished electronics',
    description: 'Refurb devices avoid ~80% of manufacturing emissions.',
    category: CategoryType.Shopping,
    potentialSavingKgCo2: 500,
    difficulty: Difficulty.Medium,
    isRelevant: (p) => p.shopping.monthlySpendingUsd > 100,
  },
  {
    id: 's7',
    title: 'Use reusable bags and containers',
    description: 'Eliminates single-use packaging waste and its production footprint.',
    category: CategoryType.Shopping,
    potentialSavingKgCo2: 30,
    difficulty: Difficulty.Easy,
    isRelevant: () => true,
  },
];

/**
 * Generate personalised, impact-ranked recommendations.
 *
 * Filters the master catalogue to actions relevant to the user's
 * profile, then sorts descending by potential CO₂ savings.
 *
 * @param profile - The user's lifestyle profile.
 * @param score - The user's calculated carbon score.
 * @returns Sorted array of relevant {@link Action} items.
 */
export function generateRecommendations(profile: UserProfile, score: CarbonScore): Action[] {
  const dominantCategory = [...score.categories].sort((a, b) => b.annualKgCO2 - a.annualKgCO2)[0]
    ?.category;

  return RECOMMENDATION_SEEDS.filter((seed) => seed.isRelevant(profile))
    .map((seed) => {
      let icon = '💡';
      if (seed.category === CategoryType.Transport) {
        if (seed.id === 't4') icon = '🚲';
        else if (seed.id === 't5' || seed.id === 't6') icon = '✈️';
        else icon = '🚗';
      } else if (seed.category === CategoryType.Diet) {
        if (seed.id === 'd3') icon = '🌱';
        else if (seed.id === 'd2') icon = '🥗';
        else if (seed.id === 'd1') icon = '🥦';
        else icon = '🍎';
      } else if (seed.category === CategoryType.Energy) {
        if (seed.id === 'e2') icon = '🌡️';
        else if (seed.id === 'e3') icon = '💡';
        else if (seed.id === 'e5') icon = '☀️';
        else icon = '⚡';
      } else if (seed.category === CategoryType.Shopping) {
        if (seed.id === 's1') icon = '👕';
        else if (seed.id === 's2') icon = '🛠️';
        else if (seed.id === 's7') icon = '♻️';
        else icon = '🛒';
      }

      return {
        id: seed.id,
        title: seed.title,
        description: seed.description,
        category: seed.category,
        potentialSavingKgCO2: seed.potentialSavingKgCo2,
        difficulty: seed.difficulty,
        icon,
        isCompleted: false,
      };
    })
    .sort((a, b) => {
      // Boost recommendations that target the user's largest category
      const aBoost = a.category === dominantCategory ? 1.5 : 1;
      const bBoost = b.category === dominantCategory ? 1.5 : 1;
      return b.potentialSavingKgCO2 * bBoost - a.potentialSavingKgCO2 * aBoost;
    });
}
