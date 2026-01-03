
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { User, Layers, Terminal, Cpu, Hash, Sun, Moon, LayoutGrid, FileText, LayoutDashboard } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface DockProps {
  activeId: string | null;
  onNavigate: (id: string) => void;
  viewMode: 'spatial' | 'document';
  onToggleView: () => void;
  onAutoLayout?: () => void;
  isVisible?: boolean;
}

// Internal component for buttons with custom tooltips
const DockIconButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  resetSignal?: string | number;
}> = ({ icon, label, onClick, resetSignal }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setIsHovered(false);
    setPos(null);
  }, [resetSignal]);

  useEffect(() => {
    if (!isHovered) return;
    const update = () => {
      // Anchor tooltip to the hovered button center (viewport coords)
      const rect = btnRef.current?.getBoundingClientRect();
      if (!rect) return;
      const left = rect.left + rect.width / 2;
      // place tooltip just above the button; we'll offset via transform for crisp arrow placement
      const top = rect.top;
      setPos({ left, top });
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [isHovered]);

  // Render tooltip into body so it's not clipped by overflow
  const Tooltip = () => {
    if (!isHovered || !pos || typeof document === 'undefined') return null;
    const leftPx = `${Math.round(pos.left)}px`;
    const topPx = `${Math.round(pos.top)}px`;
    return createPortal(
      <div
        className="hidden md:inline-flex items-center px-2 py-1 bg-node-bg border border-node-border text-primary text-[11px] font-sans font-medium rounded-sm whitespace-nowrap z-9999 pointer-events-none shadow-sm"
        style={{
          position: 'fixed',
          left: leftPx,
          top: topPx,
          transform: 'translate(-50%, -110%)',
          transition: 'opacity 120ms ease, transform 160ms cubic-bezier(.2,.9,.2,1)',
          opacity: 1,
        }}
        aria-hidden
      >
        <span className="relative z-10">{label}</span>
      </div>,
      document.body
    );
  };

  const clearFocus = (e: React.SyntheticEvent) => {
    const target = e.currentTarget as HTMLElement;
    target?.blur?.();
  };

  return (
    <div className="relative flex items-center justify-center">
      <Tooltip />
      <button
        ref={btnRef}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseUp={clearFocus}
        onTouchEnd={clearFocus}
        className="flex items-center gap-2 px-2 py-2 md:px-3 rounded-lg text-secondary hover:text-primary active:scale-95 focus:outline-none focus-visible:outline-none focus-visible:ring-0"
        style={{ WebkitTapHighlightColor: 'transparent' }}
        aria-label={label}
      >
        {icon}
      </button>
    </div>
  );
};

const Dock: React.FC<DockProps> = ({ activeId, onNavigate, viewMode, onToggleView, onAutoLayout, isVisible = true }) => {
  const { theme, toggleTheme } = useTheme();
  const [localActive, setLocalActive] = useState<string | null>(null);

  useEffect(() => {
    // Only update when a real activeId is provided; ignore null to preserve local highlight.
    if (activeId) {
      setLocalActive(activeId);
    }
  }, [activeId]);

  const navItems = [
    { id: 'hero', label: 'Home', icon: <User size={14} /> },
    { id: 'projects-hub', label: 'Projects', icon: <Layers size={14} /> },
    { id: 'experience-hub', label: 'Experience', icon: <Terminal size={14} /> },
    { id: 'skills', label: 'Stack', icon: <Cpu size={14} /> },
    { id: 'contact', label: 'Contact', icon: <Hash size={14} /> },
  ];

  const showNav = viewMode === 'document';
  const tooltipReset = `${viewMode}-${isVisible}`;

  return (
    <div
      className={`fixed inset-x-0 bottom-4 md:bottom-6 z-40 transition-all duration-1000 delay-300 ease-out flex justify-center px-3 ${
        isVisible ? 'translate-y-0 opacity-100 pointer-events-none' : 'translate-y-24 opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-node-bg/90 backdrop-blur-md border border-node-border p-1.5 rounded-xl flex items-center gap-1 shadow-2xl overflow-hidden no-scrollbar ring-1 ring-black/5 dark:ring-white/5 max-w-[95vw] md:max-w-max pointer-events-auto">
        <div
          className="flex items-center gap-1 overflow-hidden"
          style={{
            maxWidth: showNav ? '600px' : '0px',
            transitionProperty: 'max-width',
            transitionDuration: '300ms',
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            transitionDelay: showNav ? '0ms' : '120ms'
          }}
          aria-hidden={!showNav}
        >
          <div
            className={`flex items-center gap-1 transition-[opacity,transform] duration-300 ease-out ${
              showNav ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
            }`}
            style={{ transitionDelay: showNav ? '120ms' : '0ms' }}
          >
            {navItems.map(item => {
              const isActive = (activeId ?? localActive) === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setLocalActive(item.id);
                    onNavigate(item.id);
                  }}
                  onMouseUp={(e) => (e.currentTarget as HTMLButtonElement).blur()}
                  onTouchEnd={(e) => (e.currentTarget as HTMLButtonElement).blur()}
                  aria-current={isActive ? 'page' : undefined}
                className={`relative overflow-visible flex items-center gap-2 px-2 py-2 md:px-3 rounded-lg active:scale-95 whitespace-nowrap border focus:outline-none focus-visible:outline-none focus-visible:ring-0 ${
                    isActive
                      ? 'bg-black/10 dark:bg-white/10 text-primary font-semibold border-transparent'
                      : 'border-transparent text-secondary'
                  }`}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  {/* No glow for active state; keep clean gray card */}
                  <span className="relative z-10 flex items-center gap-2">
                    {item.icon}
                    {/* On very small screens, hide labels if needed, but flex-shrink might handle it. Using text-[10px] for mobile. */}
                    <span className="font-mono text-[10px] md:text-xs font-medium hidden sm:block">{item.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div
          className={`w-px h-5 mx-1 shrink-0 transition-all duration-300 ease-out bg-black/30 dark:bg-white/25 ${
            showNav ? 'opacity-70 scale-100' : 'opacity-70 scale-75'
          }`}
          style={{ transitionDelay: showNav ? '120ms' : '0ms' }}
          aria-hidden={!showNav}
        />

        {viewMode === 'spatial' && onAutoLayout && (
          <DockIconButton
            icon={<LayoutDashboard size={14} />}
            label="Auto Layout"
            onClick={onAutoLayout}
            resetSignal={tooltipReset}
          />
        )}

        {/* View Toggle */}
        <DockIconButton 
            icon={viewMode === 'spatial' ? <FileText size={14} /> : <LayoutGrid size={14} />}
            label={viewMode === 'spatial' ? 'Document View' : 'Spatial View'}
            onClick={onToggleView}
            resetSignal={tooltipReset}
        />

        {/* Theme Toggle */}
        <DockIconButton 
            icon={theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            label={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            onClick={toggleTheme}
            resetSignal={tooltipReset}
        />
      </div>
    </div>
  );
};

export default Dock;
