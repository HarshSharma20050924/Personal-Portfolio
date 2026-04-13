import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

const TOTAL_FRAMES = 192;

export const HeroScrollSequence = ({ fallbackImage }: { fallbackImage: string }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    
    const { scrollYProgress } = useScroll({
        offset: ["start start", "end center"]
    });

    const frameIndex = useTransform(scrollYProgress, [0, 0.4], [1, TOTAL_FRAMES]);

    useEffect(() => {
        let loadedCount = 0;
        const tempImages: HTMLImageElement[] = [];

        for (let i = 1; i <= TOTAL_FRAMES; i++) {
            const img = new Image();
            img.src = `/intro/${String(i).padStart(5, '0')}.png`;
            tempImages[i] = img;
            img.onload = () => {
                loadedCount++;
                if (loadedCount === TOTAL_FRAMES) {
                    setImages(tempImages);
                    setIsLoaded(true);
                    // Draw first frame immediately
                    const canvas = canvasRef.current;
                    const ctx = canvas?.getContext('2d');
                    if (canvas && ctx && tempImages[1]) {
                        const img = tempImages[1];
                        canvas.width = canvas.parentElement?.clientWidth || 800;
                        canvas.height = canvas.parentElement?.clientHeight || 800;
                        const ratio = Math.max(canvas.width / img.width, canvas.height / img.height);
                        ctx.drawImage(img, 0, 0, img.width, img.height, (canvas.width - img.width * ratio) / 2, (canvas.height - img.height * ratio) / 2, img.width * ratio, img.height * ratio);
                    }
                }
            };
        }
    }, []);

    const drawFrame = (index: number|null) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx || !images[index || 1]) return;

        const img = images[index || 1];
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        
        const imgRatio = img.width / img.height;
        const canvasRatio = canvasWidth / canvasHeight;
        
        let drawWidth, drawHeight, offsetX, offsetY;
        
        if (imgRatio > canvasRatio) {
            drawHeight = canvasHeight;
            drawWidth = canvasHeight * imgRatio;
            offsetX = (canvasWidth - drawWidth) / 2;
            offsetY = 0;
        } else {
            drawWidth = canvasWidth;
            drawHeight = canvasWidth / imgRatio;
            offsetX = 0;
            offsetY = (canvasHeight - drawHeight) / 2;
        }

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    useMotionValueEvent(frameIndex, "change", (latest) => {
        drawFrame(Math.floor(latest));
    });

    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                const canvas = canvasRef.current;
                const parent = canvas.parentElement;
                if (!parent) return;

                const dpr = window.devicePixelRatio || 1;
                const width = parent.clientWidth;
                const height = parent.clientHeight;

                canvas.width = width * dpr;
                canvas.height = height * dpr;
                canvas.style.width = `${width}px`;
                canvas.style.height = `${height}px`;

                const ctx = canvas.getContext('2d');
                if (ctx) ctx.scale(dpr, dpr);

                drawFrame(Math.floor(frameIndex.get()));
            }
        };

        window.addEventListener('resize', handleResize);
        setTimeout(handleResize, 100);
        return () => window.removeEventListener('resize', handleResize);
    }, [isLoaded]);

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <canvas
                ref={canvasRef}
                className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
            {!isLoaded && fallbackImage && (
                <img 
                    src={fallbackImage} 
                    className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale" 
                />
            )}
        </div>
    );
};

