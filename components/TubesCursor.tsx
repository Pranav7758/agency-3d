"use client";
import React, { useEffect, useRef } from 'react';

export default function TubesCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<any>(null);

  const randomColors = (count: number) => {
    return new Array(count)
      .fill(0)
      .map(() => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));
  };

  useEffect(() => {
    // Check periodically for the global script to load
    let checkInterval = setInterval(() => {
      if (typeof window !== 'undefined' && (window as any).TubesCursor) {
        clearInterval(checkInterval);
        
        if (canvasRef.current) {
          const app = (window as any).TubesCursor(canvasRef.current, {
            tubes: {
              colors: ["#4a96e8", "#1950E5", "#0b3178"],
              lights: {
                intensity: 200,
                colors: ["#21d4fd", "#b721ff", "#f4d03f", "#11cdef"]
              }
            }
          });
          appRef.current = app;
        }
      }
    }, 100);

    return () => {
      clearInterval(checkInterval);
      if (appRef.current && typeof appRef.current.dispose === 'function') {
        appRef.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    const handleClick = () => {
      if (appRef.current) {
        appRef.current.tubes.setColors(randomColors(3));
        appRef.current.tubes.setLightsColors(randomColors(4));
      }
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 9999,
        pointerEvents: 'none'
      }} 
    />
  );
}
