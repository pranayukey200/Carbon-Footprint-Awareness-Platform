/**
 * @fileoverview Dialog component prompting the user to confirm resetting their profile.
 * @module components/Dashboard/ResetConfirmModal
 */

import React from 'react';
import { Card } from '../shared/Card';

interface ResetConfirmModalProps {
  /** Callback to close the modal without resetting */
  readonly onClose: () => void;
  /** Callback to execute the profile reset */
  readonly onConfirm: () => void;
}

/**
 * ResetConfirmModal component displays a glassmorphic overlay to confirm profile resets.
 */
export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({ onClose, onConfirm }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <Card
        style={{
          padding: 'var(--space-6)',
          maxWidth: '400px',
          width: '90%',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
        }}
        aria-label="Confirm profile reset"
      >
        <h3 style={{ margin: 0, fontSize: 'var(--font-size-lg)' }}>⚠️ Reset Profile?</h3>
        <p
          style={{
            margin: 0,
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-secondary)',
            lineHeight: 'var(--line-height-relaxed)',
          }}
        >
          Are you sure you want to reset your profile and restart the onboarding questionnaire? All
          logged progress will be cleared.
        </p>
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-3)',
            justifyContent: 'flex-end',
            marginTop: 'var(--space-2)',
          }}
        >
          <button
            className="btn btn--secondary"
            onClick={onClose}
            type="button"
            aria-label="Cancel reset"
          >
            Cancel
          </button>
          <button
            className="btn btn--primary"
            onClick={onConfirm}
            style={{ backgroundColor: '#ef4444', color: 'white', border: 'none' }}
            type="button"
            aria-label="Confirm reset"
          >
            Reset
          </button>
        </div>
      </Card>
    </div>
  );
};
