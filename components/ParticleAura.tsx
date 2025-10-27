import React, { useEffect, useRef } from 'react';
import type { CyclePhase } from '../types.ts';

// Interpolación lineal
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export interface ParticleAuraProps {
  phase: CyclePhase;
  intensity?: number; // 0..1, modula caos/pulso
  particleCount?: number; // por defecto 700
  background?: string; // mantiene el estilo del proyecto
}

type RGB = { r: number; g: number; b: number };

class Particle {
  x = 0; y = 0; z = 0;
  vx = 0; vy = 0; vz = 0;
  phi: number; theta: number;
  constructor(width: number, height: number) {
    this.x = (Math.random() - 0.5) * width;
    this.y = (Math.random() - 0.5) * height;
    this.z = (Math.random() - 0.5) * 1000;
    this.phi = Math.acos(-1 + (2 * Math.random()));
    this.theta = Math.random() * 2 * Math.PI;
  }
}

export const ParticleAura: React.FC<ParticleAuraProps> = ({
  phase,
  intensity = 0.4,
  particleCount = 700,
  background = '#0a0a0f', // usa el fondo del proyecto si aplica
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationId = 0;

    // Tamaño / DPR
    const resize = () => {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      const { innerWidth: w, innerHeight: h } = window;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // Partículas
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) particles.push(new Particle(canvas.width, canvas.height));

    // Mouse
    const mouse = { x: 0, y: 0 };
    const onMouse = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    document.addEventListener('mousemove', onMouse);

    // Parámetros animados
    let t = 0;
    let rotation = 0;

    let currentChaos = 0;
    let currentAttraction = 0.02;
    let currentRadius = 200;
    let currentPulseAmp = 0;
    let currentPulseFreq = 0;
    let color: RGB = { r: 180, g: 180, b: 220 };

    const phaseTargets = (p: CyclePhase, intens: number) => {
      // intens en 0..1
      switch (p) {
        case 'menstruation':
          return {
            chaos: 1.2 + intens * 1.8,
            attraction: 0.018,
            radius: 180 - intens * 30,
            pulseAmp: 1.5 + intens * 2.5,
            pulseFreq: 8 + intens * 6,
            color: { r: 230, g: 90, b: 120 } as RGB,
          };
        case 'follicular':
          return {
            chaos: 0.8 + intens * 1.0,
            attraction: 0.02,
            radius: 200 + intens * 20,
            pulseAmp: 0.5 + intens * 1.0,
            pulseFreq: 6 + intens * 5,
            color: { r: 90, g: 210, b: 190 } as RGB,
          };
        case 'ovulation':
          return {
            chaos: 1.5 + intens * 1.5,
            attraction: 0.015,
            radius: 220 + intens * 30,
            pulseAmp: 2.0 + intens * 2.0,
            pulseFreq: 14 + intens * 8,
            color: { r: 255, g: 215, b: 120 } as RGB,
          };
        case 'luteal':
        default:
          return {
            chaos: 1.0 + intens * 1.0,
            attraction: 0.017,
            radius: 190 - intens * 10,
            pulseAmp: 1.0 + intens * 1.5,
            pulseFreq: 10 + intens * 5,
            color: { r: 200, g: 160, b: 240 } as RGB,
          };
      }
    };

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      t += 0.01;
      rotation += 0.001;

      const { width: Wcss, height: Hcss } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, Wcss, Hcss);
      // Fondo respetando estilo del proyecto
      if (background) {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, Wcss, Hcss);
      }

      // Objetivos por fase
      const target = phaseTargets(phase, Math.max(0, Math.min(1, intensity)));

      // Interpolaciones suaves
      const s = 0.08;
      currentChaos = lerp(currentChaos, target.chaos, s);
      currentAttraction = lerp(currentAttraction, target.attraction, s);
      currentRadius = lerp(currentRadius, target.radius, s);
      currentPulseAmp = lerp(currentPulseAmp, target.pulseAmp, s);
      currentPulseFreq = lerp(currentPulseFreq, target.pulseFreq, s);
      color.r = lerp(color.r, target.color.r, s);
      color.g = lerp(color.g, target.color.g, s);
      color.b = lerp(color.b, target.color.b, s);

      // Actualizar/dibujar
      particles.forEach((p) => {
        const dxToMouse = p.x - (mouse.x - Wcss / 2);
        const dyToMouse = p.y - (mouse.y - Hcss / 2);
        const distToMouse = Math.hypot(dxToMouse, dyToMouse) || 1;
        const repel = Math.max(0, (100 - distToMouse) / 100);

        // Objetivo en esfera 3D
        const tx = currentRadius * Math.sin(p.phi) * Math.cos(p.theta);
        const ty = currentRadius * Math.sin(p.phi) * Math.sin(p.theta);
        const tz = currentRadius * Math.cos(p.phi);

        const txR = tx * Math.cos(rotation) - tz * Math.sin(rotation);
        const tzR = tx * Math.sin(rotation) + tz * Math.cos(rotation);

        // Atracción
        p.vx += (txR - p.x) * currentAttraction;
        p.vy += (ty - p.y) * currentAttraction;
        p.vz += (tzR - p.z) * currentAttraction;

        // Caos
        p.vx += (Math.random() - 0.5) * currentChaos;
        p.vy += (Math.random() - 0.5) * currentChaos;
        p.vz += (Math.random() - 0.5) * currentChaos;

        // Pulso por fase
        const pulse = Math.sin(t * currentPulseFreq + p.y * 0.05) * currentPulseAmp;
        p.vy += pulse;

        // Repulsión mouse
        if (repel > 0) {
          p.vx += (dxToMouse / distToMouse) * repel * 5;
          p.vy += (dyToMouse / distToMouse) * repel * 5;
        }

        // Integración + amortiguación
        p.x += p.vx; p.y += p.vy; p.z += p.vz;
        p.vx *= 0.9; p.vy *= 0.9; p.vz *= 0.9;

        // Límites suaves
        const bf = 0.001, pad = 1.8;
        if (p.x > Wcss / pad) p.vx -= (p.x - Wcss / pad) * bf;
        if (p.x < -Wcss / pad) p.vx -= (p.x + Wcss / pad) * bf;
        if (p.y > Hcss / pad) p.vy -= (p.y - Hcss / pad) * bf;
        if (p.y < -Hcss / pad) p.vy -= (p.y + Hcss / pad) * bf;

        // Proyección 3D→2D
        const perspective = 500 / (500 + p.z);
        const sx = Wcss / 2 + p.x * perspective;
        const sy = Hcss / 2 + p.y * perspective;
        const size = Math.max(0.1, 2 * perspective);
        const alpha = Math.max(0.1, 1 * perspective);

        // Variación sutil por fase
        const r = Math.round(color.r);
        const g = Math.round(color.g);
        const b = Math.round(color.b + (phase === 'ovulation' ? Math.cos(t * 12 + p.x * 0.01) * 10 : 0));

        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.fill();
      });
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('mousemove', onMouse);
    };
  }, [phase, intensity, particleCount, background]);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
};

export default ParticleAura;