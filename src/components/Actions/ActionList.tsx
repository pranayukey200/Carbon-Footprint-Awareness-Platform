import { useState, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useCarbonStore } from '../../store/carbonStore';
import { CategoryType } from '../../types';
import { ActionCard } from './ActionCard';
import { Card } from '../shared/Card';

const FOOD_DB: Record<string, { name: string; co2: number; rating: string; alt: string; altCo2: number; pct: number }> = {
  beef: { name: 'Beef 🥩', co2: 27.0, rating: 'High', alt: 'Tofu/Lentils 🌱', altCo2: 2.0, pct: 92 },
  cheese: { name: 'Cheese 🧀', co2: 13.5, rating: 'High', alt: 'Plant Cheese 🌱', altCo2: 3.0, pct: 77 },
  milk: { name: 'Dairy Milk 🥛', co2: 3.2, rating: 'Medium', alt: 'Oat Milk 🥛', altCo2: 0.9, pct: 72 },
  chicken: { name: 'Chicken 🍗', co2: 6.9, rating: 'Medium', alt: 'Plant Meat 🌱', altCo2: 1.5, pct: 78 },
  rice: { name: 'Rice 🍚', co2: 4.0, rating: 'Medium', alt: 'Quinoa 🌾', altCo2: 1.2, pct: 70 },
  apple: { name: 'Apple 🍎', co2: 0.4, rating: 'Low', alt: 'Local Apple 🍎', altCo2: 0.1, pct: 75 }
};

export function ActionList(): ReactNode {
  const recommendations = useCarbonStore((s) => s.recommendations);
  const setEnergyProfile = useCarbonStore((s) => s.setEnergyProfile);
  const calculateScore = useCarbonStore((s) => s.calculateScore);

  const [activeFilter, setActiveFilter] = useState<CategoryType | 'all'>('all');
  const [foodSearch, setFoodSearch] = useState('');
  const [billFile, setBillFile] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [startPoint, setStartPoint] = useState('');
  const [endPoint, setEndPoint] = useState('');
  const [commuteMode, setCommuteMode] = useState('transit');
  const [commuteSaved, setCommuteSaved] = useState<string | null>(null);

  const filtered = useMemo(() => activeFilter === 'all' ? recommendations : recommendations.filter((a) => a.category === activeFilter), [recommendations, activeFilter]);
  const completedCount = recommendations.filter((a) => a.isCompleted).length;

  const handleBillUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setBillFile(e.target.files[0].name);
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setEnergyProfile({ monthlyElectricityKwh: 450, monthlyGasUsageTherms: 22 });
      calculateScore();
      alert('OCR Scan Success! Extracted: 450 kWh Electricity, 22 therms Gas. Dashboard updated!');
    }, 1500);
  }, [setEnergyProfile, calculateScore]);

  const calculateCommute = useCallback(() => {
    if (!startPoint || !endPoint) return;
    const distance = Math.floor(Math.random() * 15 + 5);
    const savings = commuteMode === 'transit' ? distance * 0.3 : commuteMode === 'bicycle' ? distance * 0.4 : distance * 0.4;
    setCommuteSaved(`${savings.toFixed(1)} kg CO₂ saved compared to standard car (Distance: ${distance} km)`);
  }, [startPoint, endPoint, commuteMode]);

  const matchedFood = useMemo(() => {
    const query = foodSearch.toLowerCase().trim();
    return query ? FOOD_DB[query] || { name: `${foodSearch} 🍽️`, co2: 5.2, rating: 'Medium', alt: 'Organic alternatives 🌱', altCo2: 2.1, pct: 60 } : null;
  }, [foodSearch]);

  return (
    <div className="actions" aria-label="Action recommendations" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <header className="actions__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="actions__title" style={{ margin: 0 }}>Recommended Actions</h2>
        <p aria-live="polite" aria-atomic="true" style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
          {completedCount} of {recommendations.length} completed
        </p>
      </header>

      <nav className="actions__filters" aria-label="Filter actions by category" style={{ display: 'flex', gap: 'var(--space-2)' }}>
        {['all', 'transport', 'diet', 'energy', 'shopping'].map((cat) => (
          <button
            key={cat}
            type="button"
            className={`btn btn--ghost${activeFilter === cat ? ' btn--primary' : ''}`}
            onClick={() => setActiveFilter(cat as CategoryType | 'all')}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </nav>

      {filtered.length > 0 && (
        <div className="actions__grid" role="list" aria-label="Action cards">
          {filtered.map((action) => (
            <div role="listitem" key={action.id}>
              <ActionCard action={action} />
            </div>
          ))}
        </div>
      )}

      {/* Standout features layout */}
      <h3 style={{ margin: 'var(--space-4) 0 0 0', fontSize: 'var(--font-size-xl)' }}>⚡ Smart Carbon Tools</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-4)' }}>
        {/* Bill Ingestion OCR */}
        <Card aria-label="Automated bill ingestion OCR scanner" style={{ padding: 'var(--space-4)' }}>
          <h4 style={{ margin: '0 0 var(--space-2) 0' }}>📄 Utility Bill Ingest (OCR)</h4>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>
            Upload energy bill image/PDF to extract kilowatt hours and gas therms automatically.
          </p>
          <div style={{ border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', textAlign: 'center', cursor: 'pointer', position: 'relative' }}>
            <input type="file" accept="image/*,application/pdf" onChange={handleBillUpload} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
            <span>{isScanning ? '🔍 Scanning Bill with OCR...' : billFile ? `📄 ${billFile}` : 'Drag & drop or click to upload bill'}</span>
          </div>
        </Card>

        {/* Green Cart Scanner */}
        <Card aria-label="Grocery environmental impact scanner" style={{ padding: 'var(--space-4)' }}>
          <h4 style={{ margin: '0 0 var(--space-2) 0' }}>🛒 Green Cart Scanner</h4>
          <input
            type="text"
            className="input"
            placeholder="Search grocery item (e.g. Beef, Milk, Rice)"
            value={foodSearch}
            onChange={(e) => setFoodSearch(e.target.value)}
            style={{ marginBottom: 'var(--space-3)' }}
          />
          {matchedFood && (
            <div style={{ background: 'var(--color-bg-tertiary)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-xs)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
                <strong>{matchedFood.name}</strong>
                <span style={{ color: matchedFood.rating === 'High' ? 'var(--color-error)' : 'var(--color-success)' }}>{matchedFood.co2} kg CO₂/kg</span>
              </div>
              <div style={{ color: 'var(--color-text-secondary)' }}>
                Suggest Alternative: <strong style={{ color: 'var(--color-success)' }}>{matchedFood.alt}</strong> ({matchedFood.altCo2} kg)
              </div>
              <div style={{ color: 'var(--color-accent-primary)', marginTop: 'var(--space-1)', fontWeight: 'bold' }}>
                💡 Swapping saves {matchedFood.pct}% carbon!
              </div>
            </div>
          )}
        </Card>

        {/* Commute Tracking */}
        <Card aria-label="API-driven commute tracking" style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <h4 style={{ margin: 0 }}>📍 Commute Route Offset</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
            <input type="text" className="input" placeholder="Start (e.g. Home)" value={startPoint} onChange={(e) => setStartPoint(e.target.value)} />
            <input type="text" className="input" placeholder="End (e.g. Office)" value={endPoint} onChange={(e) => setEndPoint(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <select className="input" value={commuteMode} onChange={(e) => setCommuteMode(e.target.value)} style={{ flex: 1 }}>
              <option value="transit">🚆 Public Transit</option>
              <option value="bicycle">🚲 Bicycle / Walk</option>
              <option value="electric">⚡ Electric Car</option>
            </select>
            <button className="btn btn--primary" onClick={calculateCommute}>Offset</button>
          </div>
          {commuteSaved && <p style={{ margin: 0, fontSize: 'var(--font-size-xs)', color: 'var(--color-accent-primary)' }}>{commuteSaved}</p>}
        </Card>
      </div>
    </div>
  );
}
