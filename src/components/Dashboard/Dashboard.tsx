/**
 * @fileoverview Main dashboard view showing score gauges, charts, equivalencies, and weekly insights.
 * @module components/Dashboard/Dashboard
 */

import React, { useMemo, useState } from 'react';
import { useCarbonStore } from '../../store/carbonStore';
import { CarbonScore } from './CarbonScore';
import { CategoryBreakdown } from './CategoryBreakdown';
import { TrendChart } from './TrendChart';
import { Card } from '../shared/Card';
import { EquivalencyCard } from './EquivalencyCard';
import { GridScheduler } from './GridScheduler';
import { ResetConfirmModal } from './ResetConfirmModal';

interface DashboardProps {
  readonly onNavigate: (view: 'dashboard' | 'simulator' | 'actions' | 'progress' | 'comparison') => void;
}

/**
 * Main application dashboard showing carbon footprints, comparative trends, and localized insights.
 *
 * @returns The rendered dashboard page.
 */
export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const carbonScore = useCarbonStore((s) => s.carbonScore);
  const progressLog = useCarbonStore((s) => s.progressLog);
  const resetProfile = useCarbonStore((s) => s.resetProfile);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const totalSaved = useMemo(() => {
    return progressLog.reduce((sum, e) => sum + e.kgCO2Saved, 0);
  }, [progressLog]);

  const scoreValue = useMemo(() => {
    return carbonScore ? Math.max(0, carbonScore.totalAnnualKgCO2 - totalSaved) : 0;
  }, [carbonScore, totalSaved]);

  // Compute Weekly Insight based on largest emission category
  const weeklyInsight = useMemo(() => {
    if (!carbonScore || carbonScore.categories.length === 0) {
      return 'Complete onboarding to receive your weekly eco insight!';
    }
    const sorted = [...carbonScore.categories].sort((a, b) => b.annualKgCO2 - a.annualKgCO2);
    const topCat = sorted[0]?.category;

    switch (topCat) {
      case 'transport':
        return '✈️ Commuting and flights are your largest emission source this week. Swapping short drives for cycling or walking is your best reduction opportunity.';
      case 'diet':
        return '🥗 Diet represents your biggest carbon footprint. Choosing vegan meals or sourcing local produce will cut your emissions significantly.';
      case 'energy':
        return '⚡ Home energy is your leading emission source. Switching to a clean energy tariff or replacing bulbs with LEDs offers the fastest savings.';
      case 'shopping':
        return '🛒 Shopping and consumption dominate your carbon score. Opting for refurbished devices and thrifting garments will make the most impact.';
      default:
        return 'Keep logging actions to cut your footprint and improve your day streak!';
    }
  }, [carbonScore]);

  const handleReset = () => {
    setShowResetConfirm(true);
  };

  return (
    <div
      className="dashboard"
      role="main"
      aria-label="Carbon footprint dashboard"
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}
    >
      <header
        className="dashboard__header"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}
      >
        <div>
          <h1 className="dashboard__title">Your Dashboard</h1>
          <p className="dashboard__subtitle">Track, understand, and reduce your carbon footprint</p>
        </div>
        <button
          className="btn btn--secondary"
          onClick={handleReset}
          style={{ padding: 'var(--space-2) var(--space-4)', fontSize: 'var(--font-size-sm)' }}
          aria-label="Restart onboarding questionnaire"
        >
          🔄 Restart Onboarding
        </button>
      </header>

      {/* Weekly Insight Alert Banner */}
      <Card style={{ padding: 'var(--space-4)', background: 'rgba(29, 158, 117, 0.1)', border: '1px solid var(--color-accent-primary)' }}>
        <h3 style={{ margin: '0 0 var(--space-1) 0', fontSize: 'var(--font-size-base)', color: 'var(--color-accent-primary)' }}>💡 Weekly Insight</h3>
        <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height-relaxed)' }}>{weeklyInsight}</p>
      </Card>

      <div className="dashboard__grid">
        <div className="dashboard__full-width">
          <CarbonScore />
        </div>
        <CategoryBreakdown />
        <TrendChart />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-4)' }}>
        <EquivalencyCard scoreValue={scoreValue} />
        <GridScheduler />
        <Card
          aria-label="Interactive Footprint Simulator Card"
          style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', justifyContent: 'space-between' }}
        >
          <div>
            <h3 style={{ margin: '0 0 var(--space-2) 0', fontSize: 'var(--font-size-lg)' }}>🔬 Interactive Simulator</h3>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--line-height-relaxed)', marginBottom: 'var(--space-4)' }}>
              Simulate changes to your lifestyle (commute distance, diet, clean energy, recycling) and witness the real-time visual evolution of your virtual planet.
            </p>
          </div>
          <button
            className="btn btn--primary btn--full"
            onClick={() => onNavigate('simulator')}
            style={{ padding: '10px' }}
            aria-label="Launch Interactive Carbon Footprint Simulator"
          >
            Launch Simulator 🚀
          </button>
        </Card>
      </div>

      {showResetConfirm && (
        <ResetConfirmModal
          onClose={() => setShowResetConfirm(false)}
          onConfirm={() => {
            resetProfile();
            window.location.reload();
          }}
        />
      )}
    </div>
  );
};

