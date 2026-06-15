/**
 * @fileoverview Nature-tech interactive canvas background.
 * Spawns green leaves and glowing carbon dots that drift and interact with mouse.
 * @module components/shared/InteractiveBackground
 */

import React, { useEffect, useRef } from 'react';
interface Particle { x: number; y: number; vx: number; vy: number; radius: number; color: string; type: 'leaf' | 'dot'; angle: number; spin: number; }
/**
 * InteractiveBackground renders a canvas-based interactive background with drift particles.
 */
export const InteractiveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {return;}
    const ctx = canvas.getContext('2d');
    if (!ctx) {return;}

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const colors = ['#1D9E75', '#34d399', '#F2A623'];
    const particles: Particle[] = Array.from({ length: 40 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 3 + 2,
      color: colors[Math.floor(Math.random() * colors.length)] || '#1D9E75',
      type: Math.random() > 0.6 ? 'leaf' : 'dot',
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.01,
    }));

    const mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouse.x = mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    let animationId: number;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < 40; i++) {
        const p1 = particles[i];
        if (!p1) {continue;}
        for (let j = i + 1; j < 40; j++) {
          const p2 = particles[j];
          if (!p2) {continue;}
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.strokeStyle = `rgba(163, 191, 176, ${(1 - dist / 120) * 0.12})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        if (mouse.x > -500) {
          const dx = p1.x - mouse.x;
          const dy = p1.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            ctx.strokeStyle = `rgba(29, 158, 117, ${(1 - dist / 180) * 0.25})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      // Move and draw particles
      particles.forEach((p) => {
        p.x = (p.x + p.vx + width) % width;
        p.y = (p.y + p.vy + height) % height;
        p.angle += p.spin;

        if (mouse.x > -500) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            const force = (100 - dist) / 100;
            p.x += (dx / (dist || 1)) * force * 1.5;
            p.y += (dy / (dist || 1)) * force * 1.5;
          }
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        if (p.type === 'leaf') {
          ctx.ellipse(0, 0, p.radius * 2, p.radius, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;
          ctx.fill();
        }
        ctx.restore();
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, pointerEvents: 'none' }}
    />
  );
};

export default InteractiveBackground;
