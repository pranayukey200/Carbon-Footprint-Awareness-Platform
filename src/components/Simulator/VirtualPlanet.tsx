/**
 * @fileoverview Environmental visualizer component rendering a 2D Canvas planet simulation.
 * @module components/Simulator/VirtualPlanet
 */

import React, { useEffect, useRef } from 'react';

interface VirtualPlanetProps {
  readonly simulatedScore: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

/**
 * 2D Canvas environmental planet simulator.
 */
export const VirtualPlanet: React.FC<VirtualPlanetProps> = ({ simulatedScore }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 400);
    let height = (canvas.height = 240);

    const handleResize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || 400;
      height = canvas.height = 240;
    };
    window.addEventListener('resize', handleResize);

    const particles: Particle[] = [];
    let animationId: number;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const health = Math.max(0, Math.min(100, (1 - (simulatedScore - 1500) / 10000) * 100));

      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (health > 60) {
        skyGrad.addColorStop(0, '#0284c7');
        skyGrad.addColorStop(1, '#0ea5e9');
      } else if (health > 30) {
        skyGrad.addColorStop(0, '#0369a1');
        skyGrad.addColorStop(1, '#ca8a04');
      } else {
        skyGrad.addColorStop(0, '#334155');
        skyGrad.addColorStop(1, '#1e293b');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Sun
      ctx.beginPath();
      ctx.arc(width - 60, 60, health > 40 ? 30 : 20, 0, Math.PI * 2);
      ctx.fillStyle = health > 40 ? '#f59e0b' : '#64748b';
      if (health > 40) {
        ctx.shadowBlur = 30;
        ctx.shadowColor = '#fbbf24';
      } else {
        ctx.shadowBlur = 0;
      }
      ctx.fill();
      ctx.shadowBlur = 0;

      // Ground
      ctx.beginPath();
      ctx.ellipse(width / 2, height + 80, width * 0.7, 160, 0, 0, Math.PI * 2);
      ctx.fillStyle = health > 60 ? '#15803d' : health > 30 ? '#854d0e' : '#451a03';
      ctx.fill();

      // Particles
      const particleCount = health > 50 ? 15 : 25;
      while (particles.length < particleCount) {
        particles.push({
          x: Math.random() * width,
          y: health > 50 ? -10 : height + 10,
          vx: (Math.random() - 0.5) * 0.5,
          vy: health > 50 ? Math.random() * 0.5 + 0.2 : -(Math.random() * 0.5 + 0.2),
          radius: Math.random() * 3 + 1,
          color: health > 50 ? 'rgba(255,255,255,0.3)' : 'rgba(74,85,104,0.6)',
        });
      }

      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width || p.y < -20 || p.y > height + 20) {
          particles[index] = {
            x: Math.random() * width,
            y: health > 50 ? -10 : height + 10,
            vx: (Math.random() - 0.5) * 0.5,
            vy: health > 50 ? Math.random() * 0.5 + 0.2 : -(Math.random() * 0.5 + 0.2),
            radius: Math.random() * 3 + 1,
            color: health > 50 ? 'rgba(255,255,255,0.3)' : 'rgba(74,85,104,0.6)',
          };
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      // Status text overlays
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`Planet Health: ${Math.round(health)}%`, 16, 24);

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [simulatedScore]);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', width: '100%', height: '240px', borderRadius: 'var(--radius-md)' }}
      aria-label={`Virtual Eco-Planet animation reflecting planet health status at ${simulatedScore} kg footprint`}
    />
  );
};
export default VirtualPlanet;
