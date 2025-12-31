'use client';
import React, { useEffect, useRef, useState } from 'react';

const DotGrid = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [grid, setGrid] = useState({ rows: 0, cols: 0 });
    const [pulsingDots, setPulsingDots] = useState(new Set());
    const dotSpacing = 100;

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const resizeObserver = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;
            setGrid({
                rows: Math.floor(height / dotSpacing),
                cols: Math.floor(width / dotSpacing),
            });
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => {
            resizeObserver.unobserve(container);
        };
    }, []);

    useEffect(() => {
        const total = grid.rows * grid.cols;
        if (total === 0) return;

        const interval = setInterval(() => {
            setPulsingDots((prev) => {
                const newPulsing = new Set(prev);

                // Remove some dots that were pulsing (30% chance each)
                prev.forEach((dotIndex) => {
                    if (Math.random() < 0.3) {
                        newPulsing.delete(dotIndex);
                    }
                });

                // Add new random dots to pulse (5-15% of total dots)
                const numNewDots = Math.floor(Math.random() * (total * 0.1)) + Math.floor(total * 0.05);
                for (let i = 0; i < numNewDots; i++) {
                    const randomIndex = Math.floor(Math.random() * total);
                    newPulsing.add(randomIndex);
                }

                return newPulsing;
            });
        }, 400 + Math.random() * 500); // Random interval between 400-900ms

        return () => clearInterval(interval);
    }, [grid.rows, grid.cols]);

    const total = grid.rows * grid.cols;
    const dots = Array.from({ length: total });

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 pointer-events-none "
        >
            <div
                className="w-full h-full grid"
                style={{
                    gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
                    gridTemplateRows: `repeat(${grid.rows}, 1fr)`,
                }}
            >
                {dots.map((_, i) => {
                    const isPulsing = pulsingDots.has(i);
                    return (
                        <div
                            key={i}
                            className={`w-2 h-2 rounded-full bg-primary/50 dark:bg-primary/20 justify-self-center self-center transition-all duration-500 ${
                                isPulsing
                                    ? 'opacity-100 scale-150 shadow-lg shadow-blue-400/50'
                                    : 'opacity-40 scale-100'
                            }`}
                            style={{
                                animationDelay: isPulsing ? `${Math.random() * 500}ms` : '0ms',
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default DotGrid;
