import React, { useRef, useEffect } from 'react';
import type { CyclePhase } from '../types.ts';

// Props for the new ring, it only needs to know the current phase
interface CycleRingProps {
    phase: CyclePhase;
}

// Helper function for linear interpolation
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Particle class adapted from the provided code
class Particle {
    x: number; y: number; z: number;
    vx: number; vy: number; vz: number;
    torusPhi: number; torusTheta: number;

    constructor(width: number, height: number) {
        this.x = (Math.random() - 0.5) * width;
        this.y = (Math.random() - 0.5) * height;
        this.z = (Math.random() - 0.5) * 1000;
        
        // Angles for the torus/ring shape
        this.torusPhi = Math.random() * 2 * Math.PI;
        this.torusTheta = Math.random() * 2 * Math.PI;
        
        this.vx = 0; this.vy = 0; this.vz = 0;
    }
}

export const CycleRing: React.FC<CycleRingProps> = ({ phase }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        const particles: Particle[] = [];
        const particleCount = 700;
        
        let width = 0;
        let height = 0;
        
        const resizeHandler = (entries: ResizeObserverEntry[]) => {
            if (!entries || entries.length === 0) return;
            const entry = entries[0];
            const dpr = window.devicePixelRatio || 1;
            width = entry.contentRect.width;
            height = entry.contentRect.height;
            if (width === 0 || height === 0) return;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.scale(dpr, dpr);
        };
        
        const observer = new ResizeObserver(resizeHandler);
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle(300, 300)); 
        }

        let mouse = { x: 0, y: 0 };
        const handleMouseMove = (e: MouseEvent) => {
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };
        document.addEventListener('mousemove', handleMouseMove);
        
        let time = 0;

        let currentChaos = 0;
        let currentAttraction = 0.02;
        let currentRadius = 100;
        let currentColor = { r: 180, g: 180, b: 220 };
        let currentPulse = { amplitude: 0, frequency: 0 };
        
        const phaseTargets = (p: CyclePhase) => {
            switch(p) {
                case 'menstruation':
                    return { chaos: 2.5, attraction: 0.018, radiusFactor: 0.8, pulse: { amplitude: 2, frequency: 10 }, color: { r: 230, g: 90, b: 120 } };
                case 'follicular':
                    return { chaos: 1.0, attraction: 0.02, radiusFactor: 0.9, pulse: { amplitude: 0.5, frequency: 8 }, color: { r: 90, g: 210, b: 190 } };
                case 'ovulation':
                    return { chaos: 2.0, attraction: 0.015, radiusFactor: 1.0, pulse: { amplitude: 3, frequency: 18 }, color: { r: 255, g: 215, b: 120 } };
                case 'luteal':
                default:
                    return { chaos: 1.5, attraction: 0.017, radiusFactor: 0.85, pulse: { amplitude: -1.5, frequency: 12 }, color: { r: 200, g: 160, b: 240 } };
            }
        };

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            if (width === 0 || height === 0) return;
            
            time += 0.01;
            ctx.clearRect(0, 0, width, height);
            
            const target = phaseTargets(phase);

            const smoothing = 0.08;
            currentChaos = lerp(currentChaos, target.chaos, smoothing);
            currentAttraction = lerp(currentAttraction, target.attraction, smoothing);
            currentRadius = lerp(currentRadius, (Math.min(width, height) / 2.2) * target.radiusFactor, smoothing);
            currentPulse.amplitude = lerp(currentPulse.amplitude, target.pulse.amplitude, smoothing);
            currentPulse.frequency = lerp(currentPulse.frequency, target.pulse.frequency, smoothing);
            currentColor.r = lerp(currentColor.r, target.color.r, smoothing);
            currentColor.g = lerp(currentColor.g, target.color.g, smoothing);
            currentColor.b = lerp(currentColor.b, target.color.b, smoothing);

            particles.forEach(p => {
                const R = currentRadius;
                const r_torus = currentRadius * 0.35;
                const spinAngle = time * 1.2; 

                const targetX = (R + r_torus * Math.cos(p.torusPhi)) * Math.cos(p.torusTheta + spinAngle);
                const targetY = (R + r_torus * Math.cos(p.torusPhi)) * Math.sin(p.torusTheta + spinAngle);
                const targetZ = r_torus * Math.sin(p.torusPhi);
                
                const dxToMouse = p.x - (mouse.x - width / 2);
                const dyToMouse = p.y - (mouse.y - height / 2);
                const distToMouse = Math.hypot(dxToMouse, dyToMouse) || 1;
                const repelForce = Math.max(0, (60 - distToMouse) / 60);

                p.vx += (targetX - p.x) * currentAttraction;
                p.vy += (targetY - p.y) * currentAttraction;
                p.vz += (targetZ - p.z) * currentAttraction;

                p.vx += (Math.random() - 0.5) * currentChaos;
                p.vy += (Math.random() - 0.5) * currentChaos;
                p.vz += (Math.random() - 0.5) * currentChaos;
                
                if (Math.abs(currentPulse.amplitude) > 0.01) {
                     const pulse = Math.sin(time * currentPulse.frequency + p.y * 0.05) * currentPulse.amplitude;
                     p.vy += pulse;
                }

                if (repelForce > 0) {
                    p.vx += (dxToMouse / distToMouse) * repelForce * 5;
                    p.vy += (dyToMouse / distToMouse) * repelForce * 5;
                }

                p.x += p.vx; p.y += p.vy; p.z += p.vz;
                p.vx *= 0.92; p.vy *= 0.92; p.vz *= 0.92;

                const perspective = Math.max(300, width * 0.6) / (Math.max(300, width * 0.6) + p.z);
                const screenX = width / 2 + p.x * perspective;
                const screenY = height / 2 + p.y * perspective;
                const size = Math.max(0.1, 1.8 * perspective);
                const alpha = Math.max(0.1, 1 * perspective);

                const r = Math.round(currentColor.r);
                const g = Math.round(currentColor.g);
                const b = Math.round(currentColor.b);

                ctx.beginPath();
                ctx.arc(screenX, screenY, size, 0, 2 * Math.PI);
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                ctx.fill();
            });
        };

        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
            observer.disconnect();
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, [phase]);

    return (
        <div ref={containerRef} className="absolute inset-0 w-full h-full">
             <canvas ref={canvasRef} />
        </div>
    );
};
