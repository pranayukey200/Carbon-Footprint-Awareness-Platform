/**
 * @fileoverview Dialog modal to log a progressive sustainability action.
 * @module components/Progress/LogActionModal
 */

import React, { useState, useEffect, useCallback } from 'react';
import type { Action } from '../../types';
import { sanitizeInput } from '../../utils/sanitize';

interface LogActionModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly recommendations: readonly Action[];
  readonly onSubmit: (actionId: string, quantity: number, notes: string) => void;
}

/**
 * LogActionModal component displays a dialog window allowing the user to select an action, set its quantity, and add personal notes.
 */
export const LogActionModal: React.FC<LogActionModalProps> = ({ isOpen, onClose, recommendations, onSubmit }) => {
  const [selectedActionId, setSelectedActionId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const modalRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const first = recommendations.find((a) => a.isCompleted);
      setSelectedActionId(first ? first.id : (recommendations[0]?.id || ''));
      setQuantity(1);
      setNotes('');
    }
  }, [isOpen, recommendations]);

  useEffect(() => {
    if (!isOpen) {return;}
    const select = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const modal = modalRef.current;
    if (!modal) {return;}
    const elms = Array.from(modal.querySelectorAll<HTMLElement>(select));
    const first = elms[0], last = elms[elms.length - 1];
    if (first) {first.focus();}

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first && last) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last && first) {
          first.focus();
          e.preventDefault();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = useCallback(() => {
    if (selectedActionId) {onSubmit(selectedActionId, quantity, sanitizeInput(notes));}
  }, [selectedActionId, quantity, notes, onSubmit]);

  if (!isOpen) {return null;}

  return (
    <div ref={modalRef} className="modal-overlay" role="dialog" aria-modal="true" aria-label="Log Action Modal">
      <div className="modal-content glass" style={{ maxWidth: '480px', width: '90%' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
          <h3 style={{ margin: 0 }}>Log Action</h3>
          <button type="button" onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer' }} aria-label="Close dialog">✕</button>
        </header>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="input-group">
            <label htmlFor="modal-action-select" className="input-group__label">Select Action</label>
            <select id="modal-action-select" className="input" value={selectedActionId} onChange={(e) => setSelectedActionId(e.target.value)} aria-label="Select committed action">
              {recommendations.map((a) => (
                <option key={a.id} value={a.id}>{a.icon} {a.title} ({a.potentialSavingKgCO2} kg CO₂)</option>
              ))}
            </select>
          </div>
          <div className="slider-group">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label htmlFor="modal-quantity-slider" className="slider-group__label">Quantity Multiplier</label>
              <span>x{quantity}</span>
            </div>
            <input id="modal-quantity-slider" type="range" min="1" max="10" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value, 10))} aria-label="Select multiplier count" />
          </div>
          <div className="input-group">
            <label htmlFor="modal-notes-area" className="input-group__label">Personal Notes (Sanitized)</label>
            <textarea id="modal-notes-area" className="input" rows={3} placeholder="E.g., Took the metro today instead of my gasoline car." value={notes} onChange={(e) => setNotes(e.target.value)} aria-label="Action description notes" />
          </div>
          <footer style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
            <button type="button" className="btn btn--secondary" onClick={onClose} aria-label="Cancel action logging and close modal">Cancel</button>
            <button type="button" className="btn btn--primary" onClick={handleSubmit} aria-label="Submit and save action to progress log">Log Action</button>
          </footer>
        </div>
      </div>
    </div>
  );
};
