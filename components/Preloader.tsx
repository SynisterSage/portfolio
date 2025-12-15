
import React, { useState, useEffect } from 'react';
import { Cpu, Zap } from 'lucide-react';

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [status, setStatus] = useState('INITIALIZING_CORE');

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

    if (progress === 100) {
      // Small delay at 100% before fading out
      setTimeout(() => {
        setIsVisible(false);
        // Wait for fade out animation to complete before triggering parent callback
        setTimeout(onComplete, 500); 
      }, 500);
    }
  }, [progress, onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[100] bg-canvas-bg flex flex-col items-center justify-center transition-opacity duration-500 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="w-64 md:w-80 space-y-6">
        {/* Logo / Icon Area */}
        <div className="flex justify-center mb-8">
            <div className="relative">
                <Cpu size={48} className="text-primary animate-pulse" />
                <div className="absolute -top-1 -right-1">
                    <Zap size={16} className="text-accent fill-accent animate-bounce" />
                </div>
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
                <span className="uppercase">{status}</span>
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
