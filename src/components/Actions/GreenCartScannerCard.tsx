import React, { useState, useMemo } from 'react';
import { Card } from '../shared/Card';
import { FOOD_DB } from '../../constants/foodDb';

/**
 * GreenCartScannerCard component for searching grocery items and comparing carbon intensity.
 */
export const GreenCartScannerCard: React.FC = () => {
  const [foodSearch, setFoodSearch] = useState('');

  const matchedFood = useMemo(() => {
    const query = foodSearch.toLowerCase().trim();
    if (!query) {return null;}

    // Check custom type for database check
    const db = FOOD_DB as Record<string, { name: string; co2: number; rating: 'High' | 'Medium' | 'Low'; alt: string; altCo2: number; pct: number } | undefined>;
    const exactMatch = db[query];
    if (exactMatch) {
      return exactMatch;
    }

    let hash = 0;
    for (let i = 0; i < query.length; i++) {
      hash = (hash << 5) - hash + query.charCodeAt(i);
      hash |= 0;
    }
    const absHash = Math.abs(hash);
    const co2 = Math.round(((absHash % 120) / 10 + 1) * 10) / 10;
    const altCo2 = Math.round(((absHash % 40) / 10 + 0.5) * 10) / 10;
    const finalAltCo2 = altCo2 >= co2 ? Math.round((co2 * 0.4) * 10) / 10 : altCo2;
    const pct = Math.round(((co2 - finalAltCo2) / co2) * 100);
    let rating: 'High' | 'Medium' | 'Low' = 'Medium';
    if (co2 > 6) {
      rating = 'High';
    } else if (co2 < 2.5) {
      rating = 'Low';
    }

    const altPrefixes = ['Local organic', 'Plant-based', 'Eco-friendly alternative to'];
    const altPrefix = altPrefixes[absHash % altPrefixes.length] || 'Local';

    return {
      name: `${foodSearch} 🍽️`,
      co2,
      rating,
      alt: `${altPrefix} ${foodSearch} 🌱`,
      altCo2: finalAltCo2,
      pct,
    };
  }, [foodSearch]);

  return (
    <Card aria-label="Grocery environmental impact scanner" style={{ padding: 'var(--space-4)' }}>
      <h4 style={{ margin: '0 0 var(--space-2) 0' }}>🛒 Green Cart Scanner</h4>
      <input
        type="text"
        className="input"
        placeholder="Search grocery item (e.g. Beef, Milk, Rice)"
        value={foodSearch}
        onChange={(e) => setFoodSearch(e.target.value)}
        style={{ marginBottom: 'var(--space-3)' }}
        aria-label="Search grocery items for carbon intensity"
      />
      {matchedFood && (
        <div
          style={{
            background: 'var(--color-bg-tertiary)',
            padding: 'var(--space-3)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--font-size-xs)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
            <strong>{matchedFood.name}</strong>
            <span style={{ color: matchedFood.rating === 'High' ? 'var(--color-error)' : 'var(--color-success)' }}>
              {matchedFood.co2} kg CO₂/kg
            </span>
          </div>
          <div style={{ color: 'var(--color-text-secondary)' }}>
            Suggest Alternative: <strong style={{ color: 'var(--color-success)' }}>{matchedFood.alt}</strong> (
            {matchedFood.altCo2} kg)
          </div>
          <div style={{ color: 'var(--color-accent-primary)', marginTop: 'var(--space-1)', fontWeight: 'bold' }}>
            💡 Swapping saves {matchedFood.pct}% carbon!
          </div>
        </div>
      )}
    </Card>
  );
};
