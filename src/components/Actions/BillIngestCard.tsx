import React, { useState, useCallback } from 'react';
import { Card } from '../shared/Card';

interface BillIngestCardProps {
  readonly setEnergyProfile: (profile: { monthlyElectricityKwh: number; monthlyGasUsageTherms: number }) => void;
  readonly calculateScore: () => void;
}

/**
 * BillIngestCard component for uploading and scanning utility bills using OCR simulation.
 */
export const BillIngestCard: React.FC<BillIngestCardProps> = ({
  setEnergyProfile,
  calculateScore,
}) => {
  const [billFile, setBillFile] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleBillUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files?.[0]) return;
      setBillFile(e.target.files[0].name);
      setIsScanning(true);
      setTimeout(() => {
        setIsScanning(false);
        setEnergyProfile({ monthlyElectricityKwh: 450, monthlyGasUsageTherms: 22 });
        calculateScore();
        alert('OCR Scan Success! Extracted: 450 kWh Electricity, 22 therms Gas. Dashboard updated!');
      }, 1500);
    },
    [setEnergyProfile, calculateScore],
  );

  return (
    <Card aria-label="Automated bill ingestion OCR scanner" style={{ padding: 'var(--space-4)' }}>
      <h4 style={{ margin: '0 0 var(--space-2) 0' }}>📄 Utility Bill Ingest (OCR)</h4>
      <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>
        Upload energy bill image/PDF to extract kilowatt hours and gas therms automatically.
      </p>
      <div
        style={{
          border: '2px dashed var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-4)',
          textAlign: 'center',
          cursor: 'pointer',
          position: 'relative',
        }}
      >
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={handleBillUpload}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: 'pointer',
          }}
          aria-label="Upload utility bill image or pdf"
        />
        <span>
          {isScanning
            ? '🔍 Scanning Bill with OCR...'
            : billFile
              ? `📄 ${billFile}`
              : 'Drag & drop or click to upload bill'}
        </span>
      </div>
    </Card>
  );
};
