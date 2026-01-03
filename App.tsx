
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DocumentView from './components/DocumentView';
import Dock from './components/Dock';
import Preloader, { shouldShowPreloader } from './components/Preloader';
import PolicyOverlay from './components/PolicyOverlay'; // Import PolicyOverlay
import { NODES } from './constants';
import { Shield } from 'lucide-react'; // Import Icon
import FullScreenView from './components/FullScreenView';
import { NodeData } from './types';
import NotFound from './components/NotFound';
import Canvas from './components/Canvas';

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
  const location = useLocation();
  const navigate = useNavigate();
  const [activeNodeId, setActiveNodeId] = useState<string | null>('hero');
  const [viewMode, setViewMode] = useState<'spatial' | 'document'>(readViewMode);
  const [hasIntroPlayed, setHasIntroPlayed] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [showPolicy, setShowPolicy] = useState(false); // New state for policy view
  const [routeProjectId, setRouteProjectId] = useState<string | null>(null);
  const [routeAboutOpen, setRouteAboutOpen] = useState(false);
  const [autoLayoutTick, setAutoLayoutTick] = useState(0);
  const lastDocumentPathRef = useRef<string>('/');
  const [notFound, setNotFound] = useState(false);
  const [spatialOverlay, setSpatialOverlay] = useState<{ id: string; rect: DOMRect } | null>(null);
  
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

  // --- Routing sync ---
  useEffect(() => {
    const rawPath = location.pathname.replace(/\/+$/, '') || '/';
    const path = rawPath === '' ? '/' : rawPath;
    const cleaned = path === '/index.html' ? '/' : path;
    const locationState = location.state as { fullscreenId?: string } | null;

    const isKnownStatic = (p: string) => {
      return (
        p === '/' ||
        p === '/spatial' ||
        p === '/projects' ||
        p === '/experience' ||
        p === '/stack' ||
        p === '/skills' || // legacy alias
        p === '/about' ||
        p === '/contact'
      );
    };

    const matchProject = cleaned.startsWith('/projects/') ? decodeURIComponent(cleaned.replace('/projects/', '')) : null;
    const projectNode = matchProject ? nodeById[matchProject] : null;

    let nextView: 'spatial' | 'document' = 'document';
    let nextTarget: string | null = null;
    let projectId: string | null = null;
    let aboutOpen = false;
    let is404 = false;

    if (cleaned === '/spatial') {
      nextView = 'spatial';
    } else if (cleaned === '/projects') {
      nextTarget = 'projects-hub';
      const fullscreenId = locationState?.fullscreenId;
      if (fullscreenId && nodeById[fullscreenId]) {
        projectId = fullscreenId;
      }
    } else if (matchProject) {
      if (projectNode && projectNode.type === 'project') {
        nextTarget = 'projects-hub';
        projectId = matchProject;
      } else {
        is404 = true;
      }
    } else if (cleaned === '/experience') {
      nextTarget = 'experience-hub';
    } else if (cleaned === '/stack' || cleaned === '/skills') {
      nextTarget = 'skills';
    } else if (cleaned === '/about') {
      nextTarget = null;
      aboutOpen = true;
    } else if (cleaned === '/contact') {
      nextTarget = 'contact';
    } else if (cleaned === '/') {
      nextTarget = null;
    } else if (!isKnownStatic(cleaned)) {
      is404 = true;
    }

    if (nextView === 'document') {
      lastDocumentPathRef.current = cleaned === '/spatial' ? lastDocumentPathRef.current : cleaned || '/';
    }

    setViewMode(nextView);
    setActiveNodeId(nextTarget);
    setRouteProjectId(projectId);
    setRouteAboutOpen(aboutOpen);
    setNotFound(is404);
  }, [location.pathname, location.key]);

  const nodeById = useMemo<Record<string, NodeData>>(() => {
    return NODES.reduce((acc, node) => {
      acc[node.id] = node;
      return acc;
    }, {} as Record<string, NodeData>);
  }, []);

  const pathForNode = (id: string | null, mode: 'spatial' | 'document' = viewMode): string => {
    if (mode === 'spatial') return '/spatial';
    if (!id) return '/';
    const node = nodeById[id];
    if (node?.type === 'project') return `/projects/${id}`;
    switch (id) {
      case 'projects-hub':
        return '/projects';
      case 'experience-hub':
        return '/experience';
      case 'skills':
        return '/stack';
      case 'contact':
        return '/contact';
      case 'about':
        return '/about';
      case 'hero':
        return '/';
      default:
        return '/';
    }
  };

  const handleNavigate = (nodeId: string) => {
    setActiveNodeId(nodeId);
    const targetPath = pathForNode(nodeId);
    const shouldReplace = location.pathname === targetPath;
    navigate(targetPath, { replace: shouldReplace });
    if (viewMode === 'spatial') {
      setTimeout(() => setActiveNodeId(null), 500);
    }
  };

  const handleProjectRoute = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  const handleRouteFullscreenNavigate = (id: string) => {
    if (id === 'projects-hub') {
      navigate('/projects', { state: { fullscreenId: 'projects-hub' } });
      return;
    }
    handleProjectRoute(id);
  };

  const handleAboutRoute = () => {
    navigate('/about');
  };

  const handleAutoLayout = () => {
    setAutoLayoutTick(prev => prev + 1);
  };

  // Fire GA page_view/config on internal navigation (SPA)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const gtag = (window as any).gtag;
    const path = window.location.pathname + window.location.search;
    try {
      if (typeof gtag === 'function') {
        gtag('event', 'page_view', { page_path: path });
        gtag('config', 'G-GFJPNSXCQ4', { page_path: path });
      }
    } catch (e) {
      // ignore GA failures to reduce console noise
    }
  }, [location.pathname, viewMode]);

  const handleToggleView = () => {
    const next = viewMode === 'spatial' ? 'document' : 'spatial';
    const target = next === 'document' ? (lastDocumentPathRef.current || '/') : '/spatial';
    const shouldReplace = location.pathname === target;
    setViewMode(next);
    navigate(target, { replace: shouldReplace });
  };

  const handleIntroComplete = () => {
    setHasIntroPlayed(true);
  };

  const handlePreloaderComplete = () => {
    setIsLoading(false);
  };

  const closeRouteProject = () => navigate('/projects');
  const closeRouteAbout = () => navigate('/');

  const routeProjectNode = routeProjectId ? nodeById[routeProjectId] : null;
  const routeAboutNode = routeAboutOpen ? nodeById['about'] : null;
  const fullscreenRect = useMemo(() => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1280;
    const height = typeof window !== 'undefined' ? window.innerHeight : 720;
    return new DOMRect(0, 0, width, height);
  }, [routeProjectId, routeAboutOpen]);

  const handleGoHome = () => navigate('/', { replace: false });
  const handleGoProjects = () => navigate('/projects', { replace: false });
  const handleGoSpatial = () => navigate('/spatial', { replace: false });

  const handleOpenSpatialProject = (projectId: string, rect: DOMRect) => {
    setSpatialOverlay({ id: projectId, rect });
  };

  const closeSpatialOverlay = () => setSpatialOverlay(null);

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
        className={`system-status fixed top-4 right-4 md:top-6 md:right-6 z-50 flex items-center gap-3 pointer-events-auto transition-all duration-1000 delay-500 ${isLoading ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'}`}
      >
        {/* Status Badge */}
        <div className="flex items-center gap-2 font-mono text-[10px] md:text-xs text-secondary/60 select-none backdrop-blur-sm px-3 py-1.5 rounded-full border border-node-border/50 bg-canvas-bg/50 hover:border-node-border transition-all shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="tracking-widest">{currentDate}</span>
        </div>

        {/* Policy Trigger Button */}
        <button
            onClick={() => setShowPolicy(true)}
            className="policy-toggle w-8 h-8 flex items-center justify-center rounded-full bg-canvas-bg/50 border border-node-border/50 text-secondary hover:text-primary hover:border-accent hover:bg-accent/10 transition-all shadow-sm group"
            title="Privacy & Policies"
            aria-label="Privacy & Policies"
        >
            <Shield size={14} className="group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* View Container with Transitions */}
      {/* Opacity is controlled by loading state to ensure fade-in reveal */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
          {notFound ? (
            <NotFound onGoHome={handleGoHome} onGoProjects={handleGoProjects} onGoSpatial={handleGoSpatial} />
          ) : (
            <>
              <div
                className={`absolute inset-0 transition-opacity duration-500 ease-out ${
                  viewMode === 'spatial' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                aria-hidden={viewMode !== 'spatial'}
              >
                <Canvas
                  nodes={NODES}
                  activeNodeId={activeNodeId}
                  onNavigate={handleNavigate}
                  shouldPlayIntro={!hasIntroPlayed}
                  onIntroComplete={handleIntroComplete}
                  autoLayoutTick={autoLayoutTick}
                />
              </div>
              <div
                className={`absolute inset-0 transition-opacity duration-500 ease-out ${
                  viewMode === 'document' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                aria-hidden={viewMode !== 'document'}
              >
                <DocumentView 
                    nodes={NODES}
                    targetId={activeNodeId}
                    viewMode={viewMode}
                    isReady={!isLoading}
                    onProjectRoute={handleProjectRoute}
                    onAboutRoute={handleAboutRoute}
                />
              </div>
            </>
          )}
        </div>

      <Dock 
        activeId={activeNodeId} 
        onNavigate={handleNavigate}
        viewMode={viewMode}
        onToggleView={handleToggleView}
        onAutoLayout={handleAutoLayout}
        isVisible={!isLoading && !notFound}
      />

      {/* Route-driven Project Fullscreen */}
      {routeProjectNode && (
        <div className="fixed inset-0 z-400">
          <FullScreenView
            key={routeProjectNode.id}
            data={routeProjectNode}
            initialRect={fullscreenRect}
            onRestore={closeRouteProject}
            onClose={closeRouteProject}
            onMaximize={handleRouteFullscreenNavigate}
            snapToFull
          />
        </div>
      )}

      {/* Route-driven About Fullscreen */}
      {routeAboutNode && (
        <div className="fixed inset-0 z-400">
          <FullScreenView
            key={routeAboutNode.id}
            data={routeAboutNode}
            initialRect={fullscreenRect}
            onRestore={closeRouteAbout}
            onClose={closeRouteAbout}
            snapToFull
          />
        </div>
      )}

      {/* Spatial Project Fullscreen (no routing) */}
      {spatialOverlay && (
        <div className="fixed inset-0 z-400">
          <FullScreenView
            key={spatialOverlay.id}
            data={nodeById[spatialOverlay.id]}
            initialRect={spatialOverlay.rect}
            onRestore={closeSpatialOverlay}
            onClose={closeSpatialOverlay}
            onMaximize={(id) => setSpatialOverlay({ id, rect: fullscreenRect })}
            snapToFull={false}
          />
        </div>
      )}

      {/* Policy Overlay */}
      {showPolicy && (
          <PolicyOverlay onClose={() => setShowPolicy(false)} />
      )}
    </div>
  );
};

export default App;
