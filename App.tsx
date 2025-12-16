
import React, { useState, useEffect } from 'react';
import Canvas from './components/Canvas';
import DocumentView from './components/DocumentView';
import Dock from './components/Dock';
import Preloader, { shouldShowPreloader } from './components/Preloader';
import PolicyOverlay from './components/PolicyOverlay'; // Import PolicyOverlay
import { NODES } from './constants';
import { Shield } from 'lucide-react'; // Import Icon

const VIEW_MODE_KEY = 'portfolio.viewMode';

const dispatchStorageEvent = (key: string, newValue: string | null, oldValue: string | null) => {
  if (typeof window === 'undefined' || typeof StorageEvent === 'undefined') return;
  try {
    const event = new StorageEvent('storage', {
      key,
      newValue,
      oldValue,
      storageArea: window.localStorage
    });
    window.dispatchEvent(event);
  } catch (error) {
    console.warn('[App] failed to dispatch storage event', error);
  }
};

const readViewMode = (): 'spatial' | 'document' => {
  if (typeof window === 'undefined') return 'document';
  const stored = window.localStorage.getItem(VIEW_MODE_KEY);
  return stored === 'spatial' ? 'spatial' : 'document';
};

const App: React.FC = () => {
  const [activeNodeId, setActiveNodeId] = useState<string | null>('hero');
  const [viewMode, setViewMode] = useState<'spatial' | 'document'>(readViewMode);
  const [hasIntroPlayed, setHasIntroPlayed] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [showPolicy, setShowPolicy] = useState(false); // New state for policy view
  
  // Loading state
  const [isLoading, setIsLoading] = useState(() => shouldShowPreloader());

  // Set formatted date on mount
  useEffect(() => {
    const date = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
    setCurrentDate(formatter.format(date).toUpperCase());
  }, []);

  // Clear the initial 'hero' focus after animations play or initial load
  useEffect(() => {
    if (activeNodeId === 'hero' && !isLoading) {
      const timer = setTimeout(() => {
        setActiveNodeId(null);
      }, 1000); 
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const handleNavigate = (nodeId: string) => {
    setActiveNodeId(nodeId);
    setTimeout(() => setActiveNodeId(null), 500);
  };

  // Fire GA page_view/config on internal navigation (SPA)
  useEffect(() => {
    if (typeof window === 'undefined' || typeof (window as any).gtag !== 'function') return;
    const path = activeNodeId ? `/node/${activeNodeId}` : window.location.pathname + window.location.search;
    try {
      (window as any).gtag('event', 'page_view', { page_path: path });
      (window as any).gtag('config', 'G-GFJPNSXCQ4', { page_path: path });
    } catch (e) {
      // swallow errors silently
    }
  }, [activeNodeId, viewMode]);

  const handleToggleView = () => {
    setViewMode(prev => prev === 'spatial' ? 'document' : 'spatial');
  };

  const handleIntroComplete = () => {
    setHasIntroPlayed(true);
  };

  const handlePreloaderComplete = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const oldValue = window.localStorage.getItem(VIEW_MODE_KEY);
    window.localStorage.setItem(VIEW_MODE_KEY, viewMode);
    dispatchStorageEvent(VIEW_MODE_KEY, viewMode, oldValue);
  }, [viewMode]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== VIEW_MODE_KEY || !event.newValue) return;
      if (event.newValue === viewMode) return;
      setViewMode(event.newValue === 'spatial' ? 'spatial' : 'document');
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [viewMode]);

  return (
    <div className="w-full h-screen bg-canvas-bg text-primary overflow-hidden relative selection:bg-accent selection:text-white transition-colors duration-300">
      
      {/* Site-wide Preloader */}
      <Preloader onComplete={handlePreloaderComplete} />

      {/* System Status / Date Indicator / Policy Trigger - Fixed Top Right */}
      <div 
        className={`fixed top-4 right-4 md:top-6 md:right-6 z-50 flex items-center gap-3 pointer-events-auto transition-all duration-1000 delay-500 ${isLoading ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'}`}
      >
        {/* Status Badge */}
        <div className="flex items-center gap-2 font-mono text-[10px] md:text-xs text-secondary/60 select-none backdrop-blur-sm px-3 py-1.5 rounded-full border border-node-border/50 bg-canvas-bg/50 hover:border-node-border transition-all shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="tracking-widest">SYSTEM ONLINE • {currentDate}</span>
        </div>

        {/* Policy Trigger Button */}
        <button
            onClick={() => setShowPolicy(true)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-canvas-bg/50 border border-node-border/50 text-secondary hover:text-primary hover:border-accent hover:bg-accent/10 transition-all shadow-sm group"
            title="Privacy & Policies"
            aria-label="Privacy & Policies"
        >
            <Shield size={14} className="group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* View Container with Transitions */}
      {/* Opacity is controlled by loading state to ensure fade-in reveal */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {viewMode === 'spatial' ? (
             <Canvas 
                nodes={NODES} 
                activeNodeId={activeNodeId} 
                onNavigate={handleNavigate}
                // Only start canvas intro if main loading is done and intro hasn't played yet
                shouldPlayIntro={!isLoading && !hasIntroPlayed}
                onIntroComplete={handleIntroComplete}
            />
        ) : (
            <DocumentView 
                nodes={NODES}
                targetId={activeNodeId}
                viewMode={viewMode}
                isReady={!isLoading}
            />
        )}
      </div>

      <Dock 
        activeId={activeNodeId} 
        onNavigate={handleNavigate}
        viewMode={viewMode}
        onToggleView={handleToggleView}
        isVisible={!isLoading}
      />

      {/* Policy Overlay */}
      {showPolicy && (
          <PolicyOverlay onClose={() => setShowPolicy(false)} />
      )}
    </div>
  );
};

export default App;
