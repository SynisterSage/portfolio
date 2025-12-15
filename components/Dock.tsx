
import React, { useState } from 'react';
import { User, Layers, Terminal, Cpu, Hash, Sun, Moon, LayoutGrid, FileText } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface DockProps {
  activeId: string | null;
  onNavigate: (id: string) => void;
  viewMode: 'spatial' | 'document';
  onToggleView: () => void;
  isVisible?: boolean;
}

// Internal component for buttons with custom tooltips
const DockIconButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}> = ({ icon, label, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative flex items-center justify-center">
      {isHovered && (
        <div className="hidden md:block absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-node-bg border border-node-border text-primary text-[10px] font-mono font-bold uppercase tracking-wider rounded-md shadow-xl whitespace-nowrap z-50 animate-in fade-in slide-in-from-bottom-2 duration-200 pointer-events-none">
          {label}
          {/* Subtle Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[5px] w-2 h-2 bg-node-bg border-r border-b border-node-border rotate-45" />
        </div>
      )}
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex items-center gap-2 px-2 py-2 md:px-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-secondary hover:text-primary transition-all active:scale-95"
        aria-label={label}
      >
        {icon}
      </button>
    </div>
  );
};

const Dock: React.FC<DockProps> = ({ activeId, onNavigate, viewMode, onToggleView, isVisible = true }) => {
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { id: 'hero', label: 'Home', icon: <User size={14} /> },
    { id: 'projects-hub', label: 'Projects', icon: <Layers size={14} /> },
    { id: 'experience-hub', label: 'Experience', icon: <Terminal size={14} /> },
    { id: 'skills', label: 'Stack', icon: <Cpu size={14} /> },
    { id: 'contact', label: 'Contact', icon: <Hash size={14} /> },
  ];

  return (
    <div 
      className={`fixed bottom-4 md:bottom-6 left-1/2 z-40 max-w-[95vw] md:max-w-max transition-all duration-1000 delay-300 ease-out transform -translate-x-1/2 ${
        isVisible 
          ? 'translate-y-0 opacity-100' 
          : 'translate-y-24 opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-node-bg/90 backdrop-blur-md border border-node-border p-1.5 rounded-xl flex items-center gap-1 shadow-2xl overflow-x-auto no-scrollbar ring-1 ring-black/5 dark:ring-white/5 max-w-full">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex items-center gap-2 px-2 py-2 md:px-3 rounded-lg transition-all active:scale-95 whitespace-nowrap ${
              activeId === item.id 
                ? 'bg-primary/10 text-primary font-medium' 
                : 'hover:bg-black/5 dark:hover:bg-white/10 text-secondary hover:text-primary'
            }`}
          >
            {item.icon}
            {/* On very small screens, hide labels if needed, but flex-shrink might handle it. Using text-[10px] for mobile. */}
            <span className="font-mono text-[10px] md:text-xs font-medium hidden sm:block">{item.label}</span>
          </button>
        ))}

        {/* Divider */}
        <div className="w-px h-5 bg-node-border mx-1 opacity-50 shrink-0" />

        {/* View Toggle */}
        <DockIconButton 
            icon={viewMode === 'spatial' ? <FileText size={14} /> : <LayoutGrid size={14} />}
            label={viewMode === 'spatial' ? 'Document View' : 'Spatial View'}
            onClick={onToggleView}
        />

        {/* Theme Toggle */}
        <DockIconButton 
            icon={theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            label={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            onClick={toggleTheme}
        />
      </div>
    </div>
  );
};

export default Dock;
