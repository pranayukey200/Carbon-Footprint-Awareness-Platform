/**
 * @fileoverview Conversational AI engine for the EcoLens assistant.
 * Incorporates localized Indian benchmarks and relatable carbon comparisons.
 * @module services/assistantEngine
 */

import { type UserProfile, type CarbonScore } from '../types';
import { INDIA_AVG_KG } from '../constants/emissionFactors';

/**
 * Generates a dynamic, contextual response based on the user's carbon footprint profile and query.
 *
 * @param input - The raw search or conversational query from the user.
 * @param profile - User profile state.
 * @param score - Calculated carbon score details.
 * @returns Conversational markdown string responding to the user.
 * @example
 * ```ts
 * const reply = getAssistantResponse("How can I cut energy?", userProfile, carbonScore);
 * ```
 */
export function getAssistantResponse(
  input: string,
  profile: UserProfile,
  score: CarbonScore | null,
): string {
  const query = input.toLowerCase().trim();

  if (!score) {
    return "I don't have your carbon score yet! Please complete the onboarding questionnaire so I can analyze your footprint and give you custom recommendations.";
  }

  // Calculate relatable comparisons
  const totalKg = score.totalAnnualKgCO2;
  const numMumbaiDelhiFlights = Math.round(totalKg / 200); // 1 flight ~200 kg CO2
  const numBangaloreTrees = Math.round(totalKg / 22);       // 1 tree absorbs ~22 kg CO2/year

  if (
    query.includes('analyze') ||
    query.includes('report') ||
    query.includes('summary') ||
    query.includes('all')
  ) {
    const highest = [...score.categories].sort((a, b) => b.annualKgCO2 - a.annualKgCO2)[0];
    const comparisonPct = Math.round((totalKg / INDIA_AVG_KG) * 100);

    let benchmarkComparison = '';
    if (totalKg > INDIA_AVG_KG) {
      benchmarkComparison = `This is ${comparisonPct}% higher than the average Indian per-capita carbon footprint (${(INDIA_AVG_KG / 1000).toFixed(1)} tonnes/year).`;
    } else {
      benchmarkComparison = `Excellent! You are ${100 - comparisonPct}% below the average Indian per-capita footprint (${(INDIA_AVG_KG / 1000).toFixed(1)} tonnes/year).`;
    }

    return `Your annual carbon footprint is **${totalKg.toLocaleString()} kg CO₂e** (${(totalKg / 1000).toFixed(1)} tonnes). ${benchmarkComparison} 
    
This footprint is equivalent to **${numMumbaiDelhiFlights} round-trip flights between Mumbai and Delhi**, or requires planting **${numBangaloreTrees} mature trees in Bangalore** to absorb it annually.
    
Your highest emission source is **${highest?.category}** at **${highest?.annualKgCO2.toLocaleString()} kg CO₂e** (${highest?.percentageOfTotal}% of your total). I recommend starting with actions in that category!`;
  }

  if (
    query.includes('transport') ||
    query.includes('car') ||
    query.includes('flight') ||
    query.includes('travel') ||
    query.includes('commute')
  ) {
    const transport = score.categories.find((c) => c.category === 'transport');
    const mode = profile.transport.primaryMode;
    return `Your transport footprint is **${transport?.annualKgCO2.toLocaleString()} kg CO₂e**. Since your primary commute is by **${mode}**, you could save ~1,100 kg CO₂ by carpooling or ~2,200 kg CO₂ by switching to public transit. Cutting one flight saves ~816 kg CO₂! (Equivalent to saving 4 Mumbai-Delhi flights)`;
  }

  if (
    query.includes('diet') ||
    query.includes('food') ||
    query.includes('meat') ||
    query.includes('vegan') ||
    query.includes('vegetarian')
  ) {
    const diet = score.categories.find((c) => c.category === 'diet');
    return `Your diet footprint is **${diet?.annualKgCO2.toLocaleString()} kg CO₂e**. Adopting Meatless Mondays saves ~350 kg CO₂/year. Going fully vegetarian cuts diet emissions by up to 50% (~800 kg CO₂/year), equivalent to offsetting 36 Bangalore trees!`;
  }

  if (
    query.includes('energy') ||
    query.includes('electricity') ||
    query.includes('gas') ||
    query.includes('solar') ||
    query.includes('heating')
  ) {
    const energy = score.categories.find((c) => c.category === 'energy');
    return `Your home energy footprint is **${energy?.annualKgCO2.toLocaleString()} kg CO₂e**. Installing a smart thermostat cuts natural gas usage by 15%, while upgrading to LEDs saves ~200 kg CO₂. Rooftop solar panels can offset up to 80% of your electricity!`;
  }

  if (
    query.includes('shopping') ||
    query.includes('spend') ||
    query.includes('fashion') ||
    query.includes('recycle') ||
    query.includes('electronics')
  ) {
    const shopping = score.categories.find((c) => c.category === 'shopping');
    return `Your consumption footprint is **${shopping?.annualKgCO2.toLocaleString()} kg CO₂e**. Thrifting clothing avoids the ~10 kg CO₂ embedded in each new garment, while refurbished electronics avoid 80% of manufacturing emissions. High recycling rates shave off 15% of shopping waste!`;
  }

  if (
    query.includes('offset') ||
    query.includes('compensate') ||
    query.includes('tree') ||
    query.includes('neutral')
  ) {
    return `To offset your total emissions of **${totalKg.toLocaleString()} kg CO₂e** naturally, you would need **${numBangaloreTrees} mature trees** growing in Bangalore (assuming an average absorption rate of 22 kg CO₂ per tree per year). While offsetting helps, direct reduction is always the most effective path.`;
  }

  return "I'm not sure about that, but I can tell you about your transport, diet, energy, or shopping footprint, or give you a complete analysis of your score! Try asking: 'Analyze my footprint' or 'How can I cut energy?'";
}
