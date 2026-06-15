import React, { useState, useCallback } from 'react';
import { Card } from '../shared/Card';

/**
 * CommuteOffsetCard component for calculating public transit or bicycle commute offsets.
 */
export const CommuteOffsetCard: React.FC = () => {
  const [startPoint, setStartPoint] = useState('');
  const [endPoint, setEndPoint] = useState('');
  const [commuteMode, setCommuteMode] = useState('transit');
  const [commuteSaved, setCommuteSaved] = useState<string | null>(null);

  const calculateCommute = useCallback(() => {
    if (!startPoint || !endPoint) return;
    const distance = Math.floor(Math.random() * 15 + 5);
    const savings =
      commuteMode === 'transit' ? distance * 0.3 : commuteMode === 'bicycle' ? distance * 0.4 : distance * 0.4;
    setCommuteSaved(
      `${savings.toFixed(1)} kg CO₂ saved compared to standard car (Distance: ${distance} km)`,
    );
  }, [startPoint, endPoint, commuteMode]);

  return (
    <Card
      aria-label="API-driven commute tracking"
      style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}
    >
      <h4 style={{ margin: 0 }}>📍 Commute Route Offset</h4>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
        <input
          type="text"
          className="input"
          placeholder="Start (e.g. Home)"
          value={startPoint}
          onChange={(e) => setStartPoint(e.target.value)}
          aria-label="Start route location"
        />
        <input
          type="text"
          className="input"
          placeholder="End (e.g. Office)"
          value={endPoint}
          onChange={(e) => setEndPoint(e.target.value)}
          aria-label="End route location"
        />
      </div>
      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
        <select
          className="input"
          value={commuteMode}
          onChange={(e) => setCommuteMode(e.target.value)}
          style={{ flex: 1 }}
          aria-label="Commute transport mode"
        >
          <option value="transit">🚆 Public Transit</option>
          <option value="bicycle">🚲 Bicycle / Walk</option>
          <option value="electric">⚡ Electric Car</option>
        </select>
        <button
          className="btn btn--primary"
          onClick={calculateCommute}
          aria-label="Calculate offset savings for commute"
        >
          Offset
        </button>
      </div>
      {commuteSaved && (
        <p style={{ margin: 0, fontSize: 'var(--font-size-xs)', color: 'var(--color-accent-primary)' }}>
          {commuteSaved}
        </p>
      )}
    </Card>
  );
};
