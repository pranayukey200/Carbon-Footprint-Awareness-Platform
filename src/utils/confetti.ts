/**
 * @fileoverview Zero-dependency canvas-based confetti burst utility.
 * Dynamically creates a temporary fullscreen canvas overlay, spawns colorful particle physics,
 * and cleans up resources after animation completion.
 * @module utils/confetti
 */

interface Particle {
  x: number;
  y: number;
  readonly size: number;
  readonly color: string;
  readonly speedX: number;
  speedY: number;
  readonly rotation: number;
  readonly rotationSpeed: number;
  readonly gravity: number;
}

const COLORS = ['#1D9E75', '#F2A623', '#E85D24', '#3B82F6', '#8B5CF6', '#34D399'];

/**
 * Trigger a fullscreen confetti burst celebration.
 */
export function burstConfetti(): void {
  if (typeof window === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles: Particle[] = [];
  const particleCount = 120;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: width / 2,
      y: height / 2 + 50,
      size: Math.random() * 8 + 6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)] || '#1D9E75',
      speedX: (Math.random() - 0.5) * 15,
      speedY: (Math.random() - 0.7) * 22,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      gravity: 0.45,
    });
  }

  let active = true;

  function updateAndRender(): void {
    if (!active || !ctx) return;
    ctx.clearRect(0, 0, width, height);

    let finished = true;

    particles.forEach((p) => {
      p.speedY += p.gravity;
      p.x += p.speedX;
      p.y += p.speedY;
      const rot = p.rotation + p.rotationSpeed;
      Object.assign(p, { rotation: rot });

      if (p.y < height + 50) {
        finished = false;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    });

    if (finished) {
      active = false;
      canvas.remove();
    } else {
      requestAnimationFrame(updateAndRender);
    }
  }

  requestAnimationFrame(updateAndRender);

  // Fallback safety cleanup after 3 seconds
  setTimeout(() => {
    if (active) {
      active = false;
      canvas.remove();
    }
  }, 3000);
}
