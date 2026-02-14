
import React, { useEffect, useRef } from 'react';

interface GlobeRendererProps {
    isHovered: boolean;
    isActive: boolean;
    isMobile: boolean;
    isChatOpen: boolean;
}

export const GlobeRenderer: React.FC<GlobeRendererProps> = ({ isHovered, isActive, isMobile, isChatOpen }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<{ x: number, y: number, z: number, r: number }[]>([]);
    const rotationRef = useRef({ x: 0, y: 0 });
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        // Explicitly request alpha channel for transparency
        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        const resizeCanvas = () => {
            if (canvas.parentElement) {
                canvas.width = canvas.parentElement.offsetWidth;
                canvas.height = canvas.parentElement.offsetHeight;
            }
        };
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        if (particlesRef.current.length === 0) {
            // OPTIMIZATION: Particle count
            const particleCount = isMobile ? 40 : 80;
            for (let i = 0; i < particleCount; i++) {
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos((Math.random() * 2) - 1);
                const r = 100;
                particlesRef.current.push({
                    x: r * Math.sin(phi) * Math.cos(theta),
                    y: r * Math.sin(phi) * Math.sin(theta),
                    z: r * Math.cos(phi),
                    r: Math.random() * 1.5 + 0.5,
                });
            }
        }

        const handleGlobalMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            // Reduce sensitivity
            mouseRef.current.x = (e.clientX - centerX) * 0.00005;
            mouseRef.current.y = (e.clientY - centerY) * 0.00005;
        };

        window.addEventListener('mousemove', handleGlobalMouseMove);

        let animId: number;

        const animate = () => {
            // CRITICAL: Clear with full transparency
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;

            // FIX: Ultra slow rotation
            const baseRotation = 0.0001; 
            const targetRotY = baseRotation + (mouseRef.current.x * 2); // Reduced influence
            const targetRotX = mouseRef.current.y * 2;

            rotationRef.current.y += (targetRotY - rotationRef.current.y) * 0.05;
            rotationRef.current.x += (targetRotX - rotationRef.current.x) * 0.05;

            const rotX = rotationRef.current.x;
            const rotY = rotationRef.current.y;

            // Update positions
            particlesRef.current.forEach(p => {
                const x1 = p.x * Math.cos(rotY) - p.z * Math.sin(rotY);
                const z1 = p.z * Math.cos(rotY) + p.x * Math.sin(rotY);
                const y1 = p.y * Math.cos(rotX) - z1 * Math.sin(rotX);
                const z2 = z1 * Math.cos(rotX) + p.y * Math.sin(rotX);

                p.x = x1; p.y = y1; p.z = z2;

                const scale = 250 / (250 + p.z);
                const alpha = Math.max(0.1, (p.z + 100) / 200);

                ctx.beginPath();
                const screenX = p.x * scale + cx;
                const screenY = p.y * scale + cy;

                ctx.arc(screenX, screenY, p.r * scale, 0, Math.PI * 2);

                // Force blue color if active (tapped) or open
                if (isChatOpen || isHovered || isActive) {
                    ctx.fillStyle = `rgba(59, 130, 246, ${alpha})`;
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = 'rgba(59, 130, 246, 0.5)';
                } else {
                    ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.5})`;
                    ctx.shadowBlur = 0;
                }

                ctx.fill();
                ctx.shadowBlur = 0;
            });

            // Connections - Only draw if active to save FPS
            if (isChatOpen || isHovered || isActive) {
                ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)';
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                
                const step = isMobile ? 3 : 2;
                for (let i = 0; i < particlesRef.current.length; i += step) {
                    for (let j = i + 1; j < particlesRef.current.length; j += step) {
                        const p1 = particlesRef.current[i];
                        const p2 = particlesRef.current[j];
                        const dx = p1.x - p2.x;
                        const dy = p1.y - p2.y;
                        const dz = p1.z - p2.z;
                        const distSq = dx * dx + dy * dy + dz * dz;

                        if (distSq < 1200) {
                            const scale1 = 250 / (250 + p1.z);
                            const scale2 = 250 / (250 + p2.z);
                            ctx.moveTo(p1.x * scale1 + cx, p1.y * scale1 + cy);
                            ctx.lineTo(p2.x * scale2 + cx, p2.y * scale2 + cy);
                        }
                    }
                }
                ctx.stroke();
            }

            animId = requestAnimationFrame(animate);
        };
        animId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('mousemove', handleGlobalMouseMove);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [isChatOpen, isHovered, isActive, isMobile]);

    // Ensure style background is transparent to avoid black box issues
    return <canvas ref={canvasRef} className="w-full h-full block" style={{ background: 'transparent' }} />;
};
