/**
 * @fileoverview React error boundary component for graceful error handling.
 * Catches rendering errors in child components and displays a user-friendly
 * fallback UI instead of crashing the entire application.
 * @module components/shared/ErrorBoundary
 */

import React from 'react';

/** Props accepted by the ErrorBoundary component */
interface ErrorBoundaryProps {
  /** Child components to render within the boundary */
  readonly children: React.ReactNode;
  /** Optional custom fallback UI to display on error */
  readonly fallback?: React.ReactNode;
}

/** Internal state tracking for error boundary */
interface ErrorBoundaryState {
  /** Whether an error has been caught */
  readonly hasError: boolean;
  /** The caught error message, if any */
  readonly errorMessage: string;
}

/**
 * Error boundary component that catches JavaScript errors in child
 * component trees, logs them, and displays a fallback UI.
 * Must be a class component — React does not support error boundaries via hooks.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorMessage: error.message };
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <section
          className="empty-state"
          role="alert"
          aria-live="assertive"
          aria-label="Application error"
        >
          <div className="empty-state__icon">⚠️</div>
          <h2 className="empty-state__title">Something went wrong</h2>
          <p className="empty-state__subtitle">
            {this.state.errorMessage || 'An unexpected error occurred.'}
          </p>
          <button
            className="btn btn--primary"
            onClick={this.handleReset}
            type="button"
            aria-label="Retry loading the application"
          >
            Try Again
          </button>
        </section>
      );
    }

    return this.props.children;
  }
}
