/**
 * @fileoverview Review Summary component for the onboarding wizard.
 * @module components/Onboarding/ReviewSummary
 */

import React from 'react';
import type { UserProfile } from '../../types';

interface ReviewSummaryProps {
  readonly profile: UserProfile;
}

/**
 * ReviewSummary component displays a read-only list of the user's inputs before completing the onboarding profile.
 */
export const ReviewSummary: React.FC<ReviewSummaryProps> = ({ profile }) => (
  <section className="step-content review-card" aria-label="Review your inputs">
    <h3 className="step-content__title">Review Your Inputs</h3>
    <dl className="review-card__list">
      {profile.name && (
        <>
          <dt>Name</dt>
          <dd>{profile.name}</dd>
        </>
      )}
      <dt>Transport</dt>
      <dd>
        {profile.transport.primaryMode} · {profile.transport.weeklyDistanceKm} km/wk ·{' '}
        {profile.transport.flightsPerYear} flights/yr
      </dd>
      <dt>Diet</dt>
      <dd>
        {profile.diet.dietType} · {profile.diet.localFoodPercentage}% local ·{' '}
        {profile.diet.foodWastePercentage}% waste
      </dd>
      <dt>Energy</dt>
      <dd>
        {profile.energy.monthlyElectricityKwh} kWh · {profile.energy.monthlyGasUsageTherms} therms ·{' '}
        {profile.energy.renewablePercentage}% renewable · {profile.energy.householdSize} people
      </dd>
      <dt>Shopping</dt>
      <dd>
        ${profile.shopping.monthlySpendingUsd}/mo · Fashion: {profile.shopping.fastFashionFrequency}
        · {profile.shopping.electronicsPerYear} electronics/yr · {profile.shopping.recyclingRate}%
        recycled
      </dd>
    </dl>
  </section>
);

export default ReviewSummary;
