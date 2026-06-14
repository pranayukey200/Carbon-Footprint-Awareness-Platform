/**
 * @fileoverview Landing page for the CarbonLens Platform.
 * Displays animated particle leaves, a display counter, glassmorphic CTA,
 * and an animated pulsing SVG earth layout.
 * @module components/Landing/Landing
 */

import React, { useEffect, useState, useMemo } from 'react';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';

interface LandingProps {
  /** Callback to transition to the onboarding questionnaire */
  readonly onStartOnboarding: () => void;
}

interface ParticleLeaf {
  readonly id: number;
  readonly char: string;
  readonly left: string;
  readonly delay: string;
  readonly duration: string;
}

const LEAVES = ['🌿', '🍃', '🍁', '🍂'];

/**
 * Landing page hero component.
 * Respects prefers-reduced-motion media query by rendering static backgrounds.
 */
export const Landing: React.FC<LandingProps> = ({ onStartOnboarding }) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Generate 12 random leaf particles for the drift animation
  const particles = useMemo<readonly ParticleLeaf[]>(() => {
    if (prefersReducedMotion) return [];
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      char: LEAVES[Math.floor(Math.random() * LEAVES.length)] || '🌿',
      left: `${Math.random() * 90}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${Math.random() * 8 + 8}s`,
    }));
  }, [prefersReducedMotion]);

  return (
    <div className="landing-hero" role="banner" aria-label="CarbonLens Landing Screen">
      {/* Background drift particles */}
      {!prefersReducedMotion &&
        particles.map((p) => (
          <span
            key={p.id}
            className="leaf-particle"
            style={{
              left: p.left,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
            aria-hidden="true"
          >
            {p.char}
          </span>
        ))}

      <div className="landing-hero__layout">
        <div className="landing-hero__text-panel">
          <h1 className="landing-hero__title">
            Understand, Track, and <span className="highlight">Reduce</span> Your Carbon Footprint
          </h1>
          <p className="landing-hero__desc">
            Join the journey toward a hope-filled, zero-emission future. CarbonLens helps you
            identify your primary emission sources and take small, daily actions with personalized,
            dynamic insights.
          </p>

          <Card className="glass-cta-card" aria-label="Quick Action Card">
            <h2 className="glass-cta-card__title">Empower Your Climate Actions</h2>
            <p className="glass-cta-card__desc">
              Calculate your personalized carbon score in 3 minutes.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={onStartOnboarding}
              aria-label="Start carbon footprint calculation wizard"
            >
              Calculate mine →
            </Button>
          </Card>
        </div>

        <div className="landing-hero__visual-panel" aria-hidden="true">
          <div className="pulsing-globe-wrapper">
            <div className="pulsing-globe-ring pulsing-globe-ring--1" />
            <div className="pulsing-globe-ring pulsing-globe-ring--2" />
            <svg
              className="animated-globe-svg"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="globeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1D9E75" />
                  <stop offset="100%" stopColor="#0F1A14" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="40" fill="url(#globeGrad)" />
              {/* Abstract continents */}
              <path
                d="M30,38 C35,35 40,42 45,40 C50,38 52,30 58,32 C64,34 70,25 72,30 C74,35 70,45 65,48 C60,51 55,42 50,46 C45,50 38,55 35,52 C32,49 28,42 30,38 Z"
                fill="#34D399"
                opacity="0.85"
              />
              <path
                d="M40,68 C45,65 48,72 52,70 C56,68 58,62 64,65 C70,68 65,75 60,78 C55,81 48,78 40,75 C35,72 38,70 40,68 Z"
                fill="#34D399"
                opacity="0.85"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
