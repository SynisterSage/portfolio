
import React, { useState, useEffect } from 'react';
// Replaced lucide icons with an inline SVG logo (styled green)
import { PRELOAD_ASSETS } from '../constants';

export const PRELOADER_KEY = 'portfolio.preloader.lastSeen';
export const PRELOADER_HIDE_DURATION = 1000 * 60 * 60 * 24; // 24 hours
const PRELOAD_TIMEOUT = 8000;
const imageCache = new Map<string, HTMLImageElement>();

export const shouldShowPreloader = () => {
  if (typeof window === 'undefined') return true;
  const stored = window.localStorage.getItem(PRELOADER_KEY);
  if (!stored) return true;
  const timestamp = Number(stored);
  if (Number.isNaN(timestamp)) return true;
  return Date.now() - timestamp > PRELOADER_HIDE_DURATION;
};

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [shouldDisplayPreloader] = useState(shouldShowPreloader);
  const [isVisible, setIsVisible] = useState(shouldDisplayPreloader);
  const [status, setStatus] = useState('INITIALIZING_CORE');
  const [fallbackStatus, setFallbackStatus] = useState<string | null>(null);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [hasLoggedEvent, setHasLoggedEvent] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        const increment = Math.random() * 15;
        const next = Math.min(prev + increment, 100);
        
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return next;
      });
    }, 150);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress < 30) setStatus('LOADING_MODULES');
    else if (progress < 60) setStatus('VERIFYING_INTEGRITY');
    else if (progress < 90) setStatus('ESTABLISHING_LINK');
    else setStatus('SYSTEM_READY');

    if (progress === 100 && !assetsLoaded) {
      setStatus('PRIMING_ASSETS');
    }
  }, [progress, assetsLoaded]);

  useEffect(() => {
    if (!PRELOAD_ASSETS.length) {
      setAssetsLoaded(true);
      return;
    }

    let cancelled = false;
    let settled = false;
    const settleAssets = () => {
      if (settled) return;
      settled = true;
      if (!cancelled) setAssetsLoaded(true);
    };

    const timeout = setTimeout(() => {
      console.warn('[Preloader] asset preload timed out.');
      settleAssets();
    }, PRELOAD_TIMEOUT);

    const loaders = PRELOAD_ASSETS.map(src => {
      if (imageCache.has(src)) {
        return Promise.resolve();
      }
      return new Promise<void>(resolve => {
        const img = new Image();
        imageCache.set(src, img);
        img.onload = img.onerror = () => resolve();
        img.src = src;
      });
    });

    Promise.all(loaders).then(() => {
      clearTimeout(timeout);
      settleAssets();
    });

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (!shouldDisplayPreloader || hasLoggedEvent) return;
    if (typeof window === 'undefined') return;
    const now = Date.now();
    const oldValue = window.localStorage.getItem(PRELOADER_KEY);
    try {
      window.localStorage.setItem(PRELOADER_KEY, now.toString());
      if (typeof StorageEvent !== 'undefined') {
        const storageEvent = new StorageEvent('storage', {
          key: PRELOADER_KEY,
          newValue: now.toString(),
          oldValue,
          storageArea: window.localStorage
        });
        window.dispatchEvent(storageEvent);
      }
      console.info('[Preloader] shown', { timestamp: now });
    } catch (error) {
      console.warn('[Preloader] unable to log display', error);
    }
    setHasLoggedEvent(true);
  }, [shouldDisplayPreloader, hasLoggedEvent]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== PRELOADER_KEY) return;
      console.info('[Preloader] storage update', event.newValue);
      setIsVisible(false);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    if (progress === 100 && assetsLoaded) {
      const timer = setTimeout(() => {
        // Mark the app as ready so entrance animations are allowed consistently
        if (typeof window !== 'undefined' && document?.documentElement) {
          try {
            document.documentElement.classList.add('app-ready');
          } catch (err) {
            // ignore
          }
        }

        setIsVisible(false);
        setTimeout(onComplete, 500);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [progress, assetsLoaded, onComplete]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (shouldDisplayPreloader) return;
    // If preloader is skipped, mark app-ready immediately so animations behave consistently
    if (document?.documentElement) {
      try {
        document.documentElement.classList.add('app-ready');
      } catch (err) {}
    }
    const timer = window.setTimeout(onComplete, 0);
    return () => window.clearTimeout(timer);
  }, [shouldDisplayPreloader, onComplete]);

  // Failsafe: surface a friendly message if things run long, and force-complete if needed
  useEffect(() => {
    if (!shouldDisplayPreloader) return;
    const softTimeout = window.setTimeout(() => {
      setFallbackStatus('ALMOST THERE — finalizing assets');
    }, 4000);

    const hardTimeout = window.setTimeout(() => {
      setFallbackStatus('Wrapping up…');
      setProgress(100);
      setAssetsLoaded(true);
    }, 8000);

    return () => {
      window.clearTimeout(softTimeout);
      window.clearTimeout(hardTimeout);
    };
  }, [shouldDisplayPreloader]);

  const displayStatus = fallbackStatus || status;

  if (!shouldDisplayPreloader) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] bg-canvas-bg flex flex-col items-center justify-center transition-opacity duration-500 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="w-64 md:w-80 space-y-6">
        {/* Logo / Icon Area */}
        <div className="flex justify-center mb-8">
          <div className="relative flex items-center justify-center">
            {/* Use the repo's logo.svg and recolor it via currentColor. */}
            <img
              src="/icons/logo.svg"
              alt="Logo"
              className="w-20 h-20 text-emerald-500 transform transition-transform duration-500 hover:scale-105 animate-[pulse_1.4s_ease-in-out_infinite]"
              style={{ willChange: 'transform' }}
            />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
            <div className="h-1 w-full bg-node-border/30 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-accent transition-all duration-200 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    style={{ width: `${progress}%` }}
                />
            </div>
            
            <div className="flex justify-between items-center text-[10px] font-mono font-medium tracking-widest text-secondary">
                <span className="uppercase">{displayStatus}</span>
                <span>{Math.floor(progress)}%</span>
            </div>
        </div>
      </div>

      {/* Footer Decoration */}
      <div className="absolute bottom-8 text-[10px] font-mono text-secondary/40">
        v2.5.0-RC1
      </div>
    </div>
  );
};

export default Preloader;
