/**
 * @fileoverview Root application component. Manages top-level view routing
 * between landing page, onboarding flow, and the main dashboard experience.
 * Uses Zustand store for global state and React.lazy for code splitting.
 * @module App
 */

import React, { useState, useCallback, Suspense, lazy } from 'react';
import { useCarbonStore } from './store/carbonStore';
import { SkipLink } from './components/shared/SkipLink';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { OnboardingForm } from './components/Onboarding/OnboardingForm';
import { EcoAssistant } from './components/Assistant/EcoAssistant';
import { InteractiveBackground } from './components/shared/InteractiveBackground';

/** Lazy-loaded views for code splitting and performance */
const Landing = lazy(() =>
  import('./components/Landing/Landing').then((m) => ({ default: m.Landing })),
);
const Dashboard = lazy(() =>
  import('./components/Dashboard/Dashboard').then((m) => ({ default: m.Dashboard })),
);
const ActionList = lazy(() =>
  import('./components/Actions/ActionList').then((m) => ({ default: m.ActionList })),
);
const ProgressTracker = lazy(() =>
  import('./components/Progress/ProgressTracker').then((m) => ({ default: m.ProgressTracker })),
);
const ComparisonView = lazy(() =>
  import('./components/Comparison/ComparisonView').then((m) => ({ default: m.ComparisonView })),
);

/** Available main application views */
type AppView = 'dashboard' | 'actions' | 'progress' | 'comparison';

/** Loading fallback component */
function LoadingFallback(): React.JSX.Element {
  return (
    <div className="empty-state" role="status" aria-label="Loading content">
      <div className="empty-state__icon">⏳</div>
      <p className="empty-state__title">Loading...</p>
    </div>
  );
}

/**
 * Root application component that handles view routing and layout.
 * Shows landing/onboarding for new users, dashboard for returning users.
 */
export function App(): React.JSX.Element {
  const isOnboarded = useCarbonStore((state) => state.isOnboarded);
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [showWizard, setShowWizard] = useState(false);

  const handleViewChange = useCallback((view: AppView): void => {
    setCurrentView(view);
  }, []);

  const handleStartOnboarding = useCallback((): void => {
    setShowWizard(true);
  }, []);

  /** Renders the current view based on navigation state */
  const renderView = (): React.JSX.Element => {
    switch (currentView) {
      case 'actions':
        return <ActionList />;
      case 'progress':
        return <ProgressTracker />;
      case 'comparison':
        return <ComparisonView />;
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <SkipLink />
      <InteractiveBackground />
      {isOnboarded && <Header currentView={currentView} onViewChange={handleViewChange} />}
      <main id="main-content" className="main" role="main" aria-label="Main content">
        {isOnboarded ? (
          <Suspense fallback={<LoadingFallback />}>{renderView()}</Suspense>
        ) : showWizard ? (
          <OnboardingForm />
        ) : (
          <Suspense fallback={<LoadingFallback />}>
            <Landing onStartOnboarding={handleStartOnboarding} />
          </Suspense>
        )}
      </main>
      <Footer />
      <EcoAssistant />
    </>
  );
}
