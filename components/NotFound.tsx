import React from 'react';
import { AlertTriangle, Compass, Home, LayoutGrid } from 'lucide-react';

interface NotFoundProps {
  onGoHome: () => void;
  onGoProjects: () => void;
  onGoSpatial: () => void;
}

const NotFound: React.FC<NotFoundProps> = ({ onGoHome, onGoProjects, onGoSpatial }) => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-canvas-bg text-primary relative">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(circle at 20% 20%, rgba(52,211,153,0.12), transparent 38%), radial-gradient(circle at 80% 10%, rgba(52,211,153,0.1), transparent 33%), radial-gradient(circle at 60% 60%, rgba(52,211,153,0.08), transparent 34%)'
        }}
      />
      <div className="relative w-full max-w-3xl mx-auto px-6 py-16 md:py-20">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-node-border/60 bg-node-bg/80 backdrop-blur text-[11px] font-mono uppercase tracking-[0.25em] text-secondary mb-6">
          <AlertTriangle size={14} className="text-accent" />
          <span>404 / Not Found</span>
        </div>

        <div className="bg-node-bg/95 border border-node-border rounded-2xl shadow-2xl overflow-hidden">
          <div className="border-b border-node-border bg-node-header px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-secondary font-mono text-xs">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="pl-3 text-primary/80">/system/404</span>
            </div>
            <span className="text-[10px] font-mono text-secondary uppercase tracking-[0.2em]">Unavailable</span>
          </div>

          <div className="p-8 md:p-12 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">
              Page not found.
            </h1>
            <p className="text-secondary text-lg leading-relaxed max-w-2xl">
              The path you tried doesn’t exist in this workspace. Jump to a known location below.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
              <button
                onClick={onGoHome}
                className="group flex items-center gap-3 px-4 py-3 rounded-xl border border-node-border bg-black/5 dark:bg-white/5 hover:border-accent/40 hover:-translate-y-0.5 transition-all text-left"
              >
                <Home size={18} className="text-secondary group-hover:text-accent" />
                <div>
                  <div className="text-sm font-semibold text-primary">Home</div>
                  <div className="text-xs text-secondary">Return to document view</div>
                </div>
              </button>

              <button
                onClick={onGoProjects}
                className="group flex items-center gap-3 px-4 py-3 rounded-xl border border-node-border bg-black/5 dark:bg-white/5 hover:border-accent/40 hover:-translate-y-0.5 transition-all text-left"
              >
                <LayoutGrid size={18} className="text-secondary group-hover:text-accent" />
                <div>
                  <div className="text-sm font-semibold text-primary">Projects</div>
                  <div className="text-xs text-secondary">Browse the archive</div>
                </div>
              </button>

              <button
                onClick={onGoSpatial}
                className="group flex items-center gap-3 px-4 py-3 rounded-xl border border-node-border bg-black/5 dark:bg-white/5 hover:border-accent/40 hover:-translate-y-0.5 transition-all text-left"
              >
                <Compass size={18} className="text-secondary group-hover:text-accent" />
                <div>
                  <div className="text-sm font-semibold text-primary">Spatial</div>
                  <div className="text-xs text-secondary">Open the canvas</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
