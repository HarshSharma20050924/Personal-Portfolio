import React, { useRef, useEffect } from 'react';
import './StarryNight.css';

const StarryNight: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let stars: { x: number; y: number; radius: number; alpha: number; deltaAlpha: number }[] = [];
    let animationFrameId: number;

    const setup = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = [];
      const starCount = Math.floor((canvas.width * canvas.height) / 5000);
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.2,
          alpha: Math.random(),
          deltaAlpha: Math.random() * 0.02 - 0.01,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'white';
      
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.globalAlpha = star.alpha;
        ctx.fill();

        star.alpha += star.deltaAlpha;
        if (star.alpha <= 0 || star.alpha >= 1) {
          star.deltaAlpha *= -1;
        }

        star.y -= 0.1;
        if (star.y < 0) {
            star.y = canvas.height;
        }
      });
      animationFrameId = requestAnimationFrame(draw);
    };

    const handleResize = () => {
        cancelAnimationFrame(animationFrameId);
        setup();
        draw();
    }

    setup();
    draw();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="starry-night-container">
      <canvas ref={canvasRef} id="starry-night-canvas" />
    </div>
  );
};

export default StarryNight;
