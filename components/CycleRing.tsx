import React, { useRef, useEffect } from 'react';
import type { CyclePhase } from '../types.ts';

// Props for the cycle ring
interface CycleRingProps {
    phase: CyclePhase;
    cycleDay?: number;
}

// Helper function for linear interpolation
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Particle class for the torus/donut shape
class Particle {
    x: number;
    y: number;
    z: number;
    vx: number;
    vy: number;
    vz: number;
    torusPhi: number;
    torusTheta: number;

    constructor(width: number, height: number) {
        this.x = (Math.random() - 0.5) * width;
        this.y = (Math.random() - 0.5) * height;
        this.z = (Math.random() - 0.5) * 1000;
        
        // Angles for the torus geometry
        this.torusPhi = Math.random() * 2 * Math.PI;   // Angle of tube cross-section
        this.torusTheta = Math.random() * 2 * Math.PI; // Angle around main circle
        
        this.vx = 0;
        this.vy = 0;
        this.vz = 0;
    }
}

export const CycleRing: React.FC<CycleRingProps> = ({ phase, cycleDay }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Detect prefers-reduced-motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
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
            // Make canvas larger than container to avoid visible boundaries
            const baseWidth = entry.contentRect.width;
            const baseHeight = entry.contentRect.height;
            width = baseWidth * 2;  // 2x larger
            height = baseHeight * 2;
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

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle(300, 300)); 
        }

        // Mouse tracking relative to canvas
        let mouse = { x: 0, y: 0 };
        const handleMouseMove = (e: MouseEvent) => {
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', () => {
            mouse.x = width / 2;
            mouse.y = height / 2;
        });
        
        let time = 0;

        // Animated parameters
        let currentAttraction = 0.02;
        let currentRadius = 100;
        let currentFlowSpeed = 1.5;
        let currentColor = { r: 180, g: 180, b: 220 };
        
        // Adjust parameters for reduced motion
        const motionMultiplier = prefersReducedMotion ? 0.1 : 1;
        
        // Phase-specific targets
        const phaseTargets = (p: CyclePhase) => {
            switch(p) {
                case 'menstruation':
                    return { 
                        attraction: 0.018, 
                        radiusFactor: 0.8, 
                        flowSpeed: 1.8 * motionMultiplier, 
                        color: { r: 230, g: 90, b: 120 } 
                    };
                case 'follicular':
                    return { 
                        attraction: 0.02, 
                        radiusFactor: 0.9, 
                        flowSpeed: 1.2 * motionMultiplier, 
                        color: { r: 90, g: 210, b: 190 } 
                    };
                case 'ovulation':
                    return { 
                        attraction: 0.015, 
                        radiusFactor: 1.0, 
                        flowSpeed: 2.2 * motionMultiplier, 
                        color: { r: 255, g: 215, b: 120 } 
                    };
                case 'luteal':
                default:
                    return { 
                        attraction: 0.017, 
                        radiusFactor: 0.85, 
                        flowSpeed: 1.5 * motionMultiplier, 
                        color: { r: 200, g: 160, b: 240 } 
                    };
            }
        };

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            if (width === 0 || height === 0) return;
            
            time += 0.01;
            ctx.clearRect(0, 0, width, height);
            
            const target = phaseTargets(phase);

            // Smooth interpolation
            const smoothing = 0.08;
            currentAttraction = lerp(currentAttraction, target.attraction, smoothing);
            // Use a larger radius since canvas is bigger
            currentRadius = lerp(currentRadius, 150 * target.radiusFactor, smoothing);
            currentFlowSpeed = lerp(currentFlowSpeed, target.flowSpeed, smoothing);
            currentColor.r = lerp(currentColor.r, target.color.r, smoothing);
            currentColor.g = lerp(currentColor.g, target.color.g, smoothing);
            currentColor.b = lerp(currentColor.b, target.color.b, smoothing);

            // Update and draw particles
            particles.forEach(p => {
                // Torus (donut) parametric equations
                const R = currentRadius;                    // Major radius
                const r_torus = currentRadius / 2.5;        // Minor radius (tube)
                const spinAngle = time * currentFlowSpeed;  // Flow animation

                // Calculate target position on torus surface
                const targetX = (R + r_torus * Math.cos(p.torusPhi)) * Math.cos(p.torusTheta + spinAngle);
                const targetY = (R + r_torus * Math.cos(p.torusPhi)) * Math.sin(p.torusTheta + spinAngle);
                const targetZ = r_torus * Math.sin(p.torusPhi);
                
                // Attraction to target position
                p.vx += (targetX - p.x) * currentAttraction;
                p.vy += (targetY - p.y) * currentAttraction;
                p.vz += (targetZ - p.z) * currentAttraction;

                // Mouse repulsion force
                if (!prefersReducedMotion) {
                    // Convert mouse position to particle coordinate space (centered)
                    const mouseParticleX = mouse.x - width / 2;
                    const mouseParticleY = mouse.y - height / 2;
                    
                    // Calculate distance from particle to mouse
                    const dxToMouse = p.x - mouseParticleX;
                    const dyToMouse = p.y - mouseParticleY;
                    const distToMouse = Math.sqrt(dxToMouse * dxToMouse + dyToMouse * dyToMouse) || 1;
                    const repelForce = Math.max(0, (100 - distToMouse) / 100);
                    
                    // Apply repulsion force away from mouse
                    if (repelForce > 0) {
                        p.vx += (dxToMouse / distToMouse) * repelForce * 3;
                        p.vy += (dyToMouse / distToMouse) * repelForce * 3;
                    }
                }

                // Update position with damping
                p.x += p.vx;
                p.y += p.vy;
                p.z += p.vz;
                p.vx *= 0.9;
                p.vy *= 0.9;
                p.vz *= 0.9;

                // 3D to 2D projection with perspective
                const perspective = 500 / (500 + p.z);
                const screenX = width / 2 + p.x * perspective;
                const screenY = height / 2 + p.y * perspective;
                const size = Math.max(0.1, 2 * perspective);
                const alpha = Math.max(0.1, 1 * perspective);

                const r = Math.round(currentColor.r);
                const g = Math.round(currentColor.g);
                const b = Math.round(currentColor.b);

                // Draw particle
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
            canvas.removeEventListener('mousemove', handleMouseMove);
        };
    }, [phase, cycleDay]);

    // Generate descriptive aria-label
    const phaseLabels: Record<CyclePhase, string> = {
        menstruation: 'Fase de menstruación',
        follicular: 'Fase folicular',
        ovulation: 'Fase de ovulación',
        luteal: 'Fase lútea'
    };
    
    const ariaLabel = cycleDay
        ? `Visualización del ciclo: Día ${cycleDay}, ${phaseLabels[phase]}`
        : `Visualización del ciclo: ${phaseLabels[phase]}`;

    return (
        <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-visible">
             <canvas 
                ref={canvasRef} 
                aria-label={ariaLabel} 
                role="img" 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
             />
        </div>
    );
};
