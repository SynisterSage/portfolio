
import React, { useState, useEffect } from 'react';
import Canvas from './components/Canvas';
import DocumentView from './components/DocumentView';
import Dock from './components/Dock';
import Preloader from './components/Preloader';
import PolicyOverlay from './components/PolicyOverlay';
import { ALL_NODES } from './constants';
import { Shield } from 'lucide-react';

const App: React.FC = () => {
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'spatial' | 'document'>('document');
  const [hasIntroPlayed, setHasIntroPlayed] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [showPolicy, setShowPolicy] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const date = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
    setCurrentDate(formatter.format(date).toUpperCase());
  }, []);

  const handleNavigate = (nodeId: string) => {
    setActiveNodeId(nodeId);
    // Switch to document view if navigating from dock to a specific section
    if (viewMode === 'spatial') setViewMode('document');
  };

  const handleToggleView = () => {
    setViewMode(prev => prev === 'spatial' ? 'document' : 'spatial');
  };

  return (
    <div className="w-full h-screen bg-canvas-bg text-primary overflow-hidden relative selection:bg-accent selection:text-white transition-colors duration-300">
      
      <Preloader onComplete={() => setIsLoading(false)} />

      {/* Header Info */}
      <div 
        className={`fixed top-4 right-4 md:top-6 md:right-6 z-50 flex items-center gap-3 pointer-events-auto transition-all duration-1000 ${isLoading ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'}`}
      >
        <div className="flex items-center gap-2 font-mono text-[10px] md:text-xs text-accent/60 select-none backdrop-blur-sm px-3 py-1.5 rounded-full border border-accent/20 bg-canvas-bg/50">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="tracking-widest italic">ARCHIVE_SPINE • {currentDate}</span>
        </div>

        <button
            onClick={() => setShowPolicy(true)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-canvas-bg/50 border border-node-border/50 text-secondary hover:text-accent hover:border-accent transition-all"
        >
            <Shield size={14} />
        </button>
      </div>

      <div className={`absolute inset-0 transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {viewMode === 'spatial' ? (
             <Canvas 
                nodes={ALL_NODES} 
                activeNodeId={activeNodeId} 
                onNavigate={handleNavigate}
                shouldPlayIntro={!hasIntroPlayed}
                onIntroComplete={() => setHasIntroPlayed(true)}
            />
        ) : (
            <DocumentView 
                nodes={ALL_NODES}
                targetId={activeNodeId}
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

      {showPolicy && <PolicyOverlay onClose={() => setShowPolicy(false)} />}
    </div>
  );
};

export default App;