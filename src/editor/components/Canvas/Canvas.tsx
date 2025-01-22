"use client";

import React, { useEffect, useRef } from 'react';
import { useCanvas } from '../../hooks/useCanvas';

export const Canvas: React.FC = () => {
    const canvasElRef = useRef<HTMLCanvasElement>(null);
    const { initCanvas, cleanupCanvas } = useCanvas();
    const initialized = useRef(false);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        if (!initialized.current && canvasElRef.current) {
            // Small delay to ensure DOM is ready
            timeoutId = setTimeout(() => {
                initialized.current = true;
                initCanvas(canvasElRef.current!);
            }, 0);
        }

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            if (initialized.current) {
                initialized.current = false;
                cleanupCanvas();
            }
        };
    }, []);

    return (
        <div className="w-full h-full bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center relative">
            <canvas ref={canvasElRef} />
        </div>
    );
};