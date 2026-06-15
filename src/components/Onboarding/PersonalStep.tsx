/**
 * @fileoverview Onboarding step for capturing the user's name and email.
 * Validates inputs client-side and hashes the email for secure offline storage.
 * @module components/Onboarding/PersonalStep
 */

import React, { useState, useCallback } from 'react';
import { useCarbonStore } from '../../store/carbonStore';
import { hashEmail, validateEmail } from '../../utils/sanitize';

/**
 * Onboarding step for personal profile attributes.
 *
 * @returns Renders form inputs for Name and Email.
 */
export const PersonalStep: React.FC = () => {
  const userProfile = useCarbonStore((s) => s.userProfile);
  const setUserProfile = useCarbonStore((s) => s.setUserProfile);

  const [rawEmail, setRawEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setUserProfile({ name: e.target.value });
    },
    [setUserProfile],
  );

  const handleEmailChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const emailVal = e.target.value;
      setRawEmail(emailVal);

      if (!emailVal) {
        setEmailError('');
        setUserProfile({ emailHash: '' });
        return;
      }

      if (!validateEmail(emailVal)) {
        setEmailError('Invalid email format. E.g., user@example.com');
        setUserProfile({ emailHash: '' });
      } else {
        setEmailError('');
        const hash = await hashEmail(emailVal);
        setUserProfile({ emailHash: hash });
      }
    },
    [setUserProfile],
  );

  return (
    <fieldset className="step-content" aria-label="Personal details">
      <legend className="step-content__title">Welcome! Let's personalize your co-pilot</legend>

      <div className="input-group">
        <label htmlFor="onboard-name" className="input-group__label">
          First Name
        </label>
        <input
          id="onboard-name"
          type="text"
          className="input"
          placeholder="Enter your first name (e.g. Pranay)"
          value={userProfile.name || ''}
          onChange={handleNameChange}
          aria-label="First name input"
        />
      </div>

      <div className="input-group" style={{ marginTop: 'var(--space-4)' }}>
        <label htmlFor="onboard-email" className="input-group__label">
          Email Address (PII Protection: Stored only as SHA-256 Hash)
        </label>
        <input
          id="onboard-email"
          type="email"
          className="input"
          placeholder="Enter your email address"
          value={rawEmail}
          onChange={handleEmailChange}
          aria-label="Email address input"
          aria-invalid={!!emailError}
          aria-describedby={emailError ? 'onboard-email-error' : undefined}
        />
        {emailError && (
          <p
            id="onboard-email-error"
            style={{ color: 'var(--color-error)', fontSize: 'var(--font-size-xs)', marginTop: '4px' }}
            role="alert"
          >
            {emailError}
          </p>
        )}
      </div>
    </fieldset>
  );
};

export default PersonalStep;
