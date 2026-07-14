'use client';

import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import type { Application } from '@splinetool/runtime';

const Spline = lazy(() => import('@splinetool/react-spline'));

interface InteractiveRobotSplineProps {
  scene: string;
  className?: string;
}

function Spinner({ className }: { className?: string }) {
  return (
    <div className={`w-full h-full flex items-center justify-center ${className ?? ''}`}>
      <svg className="animate-spin h-5 w-5 text-white/70" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l2-2.647z"></path>
      </svg>
    </div>
  );
}

export function InteractiveRobotSpline({ scene, className }: InteractiveRobotSplineProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  // Defer mounting the WebGL runtime until the browser is idle so hydration,
  // fonts, and first paint never wait on the robot.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const w = window as typeof window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setReady(true), { timeout: 1500 });
      return () => w.cancelIdleCallback?.(id);
    }
    const id = setTimeout(() => setReady(true), 300);
    return () => clearTimeout(id);
  }, []);

  // Pause the Spline render loop while the hero is offscreen so scrolling
  // the rest of the page stays smooth.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const app = appRef.current as (Application & { play?: () => void; stop?: () => void }) | null;
        if (!app) return;
        if (entry.isIntersecting) app.play?.();
        else app.stop?.();
      },
      { threshold: 0.02 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ready]);

  return (
    <div ref={wrapRef} className="h-full w-full">
      {ready ? (
        <Suspense fallback={<Spinner className={className} />}>
          <Spline
            scene={scene}
            className={className}
            onLoad={(app: Application) => {
              appRef.current = app;
            }}
          />
        </Suspense>
      ) : (
        <Spinner className={className} />
      )}
    </div>
  );
}
