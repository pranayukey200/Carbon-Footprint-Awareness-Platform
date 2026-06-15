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
    return query
      ? FOOD_DB[query] || {
          name: `${foodSearch} 🍽️`,
          co2: 5.2,
          rating: 'Medium' as const,
          alt: 'Organic alternatives 🌱',
          altCo2: 2.1,
          pct: 60,
        }
      : null;
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
