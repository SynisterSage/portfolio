
import React, { useState } from 'react';
import { Folder, FileText, ChevronRight, ChevronDown, Menu, X, Code, Box, Cpu, Moon, Sun } from 'lucide-react';
import { FileNode } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface NavigationProps {
  onNavigate: (nodeId: string | 'overview' | 'projects-overview') => void;
}

// Structure mimicking a dev environment matching constants.ts
const FILE_TREE: FileNode[] = [
  { 
    id: 'root-readme', 
    name: 'README.md', 
    type: 'file', 
    nodeId: 'hero' 
  },
  {
    id: 'folder-projects',
    name: 'projects',
    type: 'folder',
    nodeId: 'projects-overview',
    children: [
      { id: 'p1', name: 'fluid-brand.glsl', type: 'file', nodeId: 'proj-1' },
      { id: 'p2', name: 'poly-dashboard.tsx', type: 'file', nodeId: 'proj-2' },
    ]
  },
  {
    id: 'folder-exp',
    name: 'experience',
    type: 'folder',
    children: [
      { id: 'e-log', name: 'log.json', type: 'file', nodeId: 'experience-hub' },
    ]
  },
  { 
    id: 'file-skills', 
    name: 'stack.yml', 
    type: 'file', 
    nodeId: 'skills' 
  },
  { 
    id: 'file-contact', 
    name: 'contact.sh', 
    type: 'file', 
    nodeId: 'contact' 
  },
];

const FileTreeItem: React.FC<{ 
  item: FileNode; 
  depth: number; 
  onSelect: (id: string) => void 
}> = ({ item, depth, onSelect }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.type === 'folder') {
        setIsOpen(!isOpen);
        if (item.nodeId) onSelect(item.nodeId);
    } else if (item.nodeId) {
        onSelect(item.nodeId);
    }
  };

  const getIcon = (name: string) => {
    if (name.includes('ts') || name.includes('js')) return <Code size={14} className="text-yellow-500" />;
    if (name.includes('glsl')) return <Box size={14} className="text-pink-500" />;
    if (name.includes('json') || name.includes('yml')) return <Cpu size={14} className="text-blue-500" />;
    return <FileText size={14} className="text-secondary" />;
  }

  return (
    <div>
      <div 
        className="flex items-center gap-1 py-1.5 px-2 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer text-sm font-mono transition-colors select-none text-secondary hover:text-primary"
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={handleClick}
      >
        {item.type === 'folder' && (
          <span className="opacity-70">
            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
        )}
        {item.type === 'folder' ? (
          <Folder size={14} className="text-indigo-500" />
        ) : (
          getIcon(item.name)
        )}
        <span className={`${item.type === 'folder' ? 'font-bold text-primary' : ''} truncate`}>
          {item.name}
        </span>
      </div>
      {item.type === 'folder' && isOpen && item.children && (
        <div>
          {item.children.map(child => (
            <FileTreeItem 
              key={child.id} 
              item={child} 
              depth={depth + 1} 
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Navigation: React.FC<NavigationProps> = ({ onNavigate }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleNav = (id: string) => {
    onNavigate(id);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-node-bg/90 backdrop-blur border border-node-border rounded-lg text-primary shadow-lg"
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Container */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-node-bg/95 backdrop-blur-md border-r border-node-border z-40
        transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 flex flex-col shadow-xl
      `}>
        {/* Header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-node-border shrink-0">
          <span className="font-mono font-bold text-primary tracking-tight">EXPLORER</span>
          <button 
            onClick={toggleTheme}
            className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 text-secondary hover:text-primary transition-colors"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        {/* File Tree */}
        <div className="flex-1 overflow-y-auto custom-scroll py-2">
            <div className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-2 px-4 pt-2">Portfolio Workspace</div>
            {FILE_TREE.map(node => (
                <FileTreeItem key={node.id} item={node} depth={0} onSelect={handleNav} />
            ))}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-node-border text-[10px] text-secondary font-mono">
            <div>git branch: main</div>
            <div className="mt-1">© {new Date().getFullYear()} Design Eng.</div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
