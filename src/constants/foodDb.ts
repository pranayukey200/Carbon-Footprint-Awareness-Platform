/**
 * @fileoverview Grocery carbon impact databases.
 * @module constants/foodDb
 */

export interface FoodDbEntry {
  readonly name: string;
  readonly co2: number;
  readonly rating: 'High' | 'Medium' | 'Low';
  readonly alt: string;
  readonly altCo2: number;
  readonly pct: number;
}

/**
 * Database of food items and their carbon footprints, along with eco-friendly alternatives.
 */
export const FOOD_DB: Record<string, FoodDbEntry> = {
  beef: { name: 'Beef 🥩', co2: 27.0, rating: 'High', alt: 'Tofu/Lentils 🌱', altCo2: 2.0, pct: 92 },
  cheese: { name: 'Cheese 🧀', co2: 13.5, rating: 'High', alt: 'Plant Cheese 🌱', altCo2: 3.0, pct: 77 },
  milk: { name: 'Dairy Milk 🥛', co2: 3.2, rating: 'Medium', alt: 'Oat Milk 🥛', altCo2: 0.9, pct: 72 },
  chicken: { name: 'Chicken 🍗', co2: 6.9, rating: 'Medium', alt: 'Plant Meat 🌱', altCo2: 1.5, pct: 78 },
  rice: { name: 'Rice 🍚', co2: 4.0, rating: 'Medium', alt: 'Quinoa 🌾', altCo2: 1.2, pct: 70 },
  apple: { name: 'Apple 🍎', co2: 0.4, rating: 'Low', alt: 'Local Apple 🍎', altCo2: 0.1, pct: 75 },
};
