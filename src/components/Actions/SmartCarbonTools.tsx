/**
 * @fileoverview Sustainability utility tools for Carbon platform: Bill Ingest, Green Cart, Route Offsets.
 * @module components/Actions/SmartCarbonTools
 */

import React from 'react';
import { BillIngestCard } from './BillIngestCard';
import { GreenCartScannerCard } from './GreenCartScannerCard';
import { CommuteOffsetCard } from './CommuteOffsetCard';

interface SmartCarbonToolsProps {
  readonly setEnergyProfile: (profile: { monthlyElectricityKwh: number; monthlyGasUsageTherms: number }) => void;
  readonly calculateScore: () => void;
}

/**
 * SmartCarbonTools orchestrator rendering OCR bill scanner, green grocery cart scanner, and route offset cards.
 */
export const SmartCarbonTools: React.FC<SmartCarbonToolsProps> = ({
  setEnergyProfile,
  calculateScore,
}) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 'var(--space-4)',
        marginTop: 'var(--space-4)',
      }}
    >
      <BillIngestCard setEnergyProfile={setEnergyProfile} calculateScore={calculateScore} />
      <GreenCartScannerCard />
      <CommuteOffsetCard />
    </div>
  );
};

export default SmartCarbonTools;
