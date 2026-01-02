
import React, { useState, useMemo } from 'react';
import { Search, Layers, PenTool, Cpu, Box, ExternalLink, ArrowRight, LayoutGrid, List } from 'lucide-react';
import { PROJECTS_LIST, NODES } from '../constants';
import { ProjectItem } from '../types';
import ProjectActions from './ProjectActions';

interface ProjectListProps {
  onNavigate?: (id: string) => void;
  onOpenProject?: (id: string) => void;
  onMaximize?: (id: string, rect: DOMRect) => void;
  variant?: 'list' | 'grid';
}

const isVideoSource = (value?: string) => !!value && /\.(mp4|mov|webm|ogg)$/i.test(value);

const isImageAsset = (value?: string) => !!value && /\.(png|jpe?g|gif|svg|webp)$/i.test(value);

const ProjectList: React.FC<ProjectListProps> = ({ onNavigate, onOpenProject, onMaximize, variant = 'grid' }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'design' | 'engineering' | 'hybrid'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>(variant);

  const filteredProjects = useMemo(() => {
    const term = search.toLowerCase();
    return PROJECTS_LIST.filter(p => {
      const matchesSearch = term.length === 0
        ? true
        : p.title.toLowerCase().includes(term) || p.tags.some(t => t.toLowerCase().includes(term));
      const matchesFilter = filter === 'all' || p.category === filter;
      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  const handleProjectClick = (e: React.MouseEvent, project: ProjectItem) => {
    e.stopPropagation();

    if (onOpenProject) {
      onOpenProject(project.id);
      return;
    }

    if (project.linkedNodeId) {
        if (onMaximize) {
             const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
             onMaximize(project.linkedNodeId, rect);
        } else if (onNavigate) {
             onNavigate(project.linkedNodeId);
        }
    } else if (project.link) {
      window.open(project.link, '_blank');
    }
  };

  const getProjectThumbnail = (project: ProjectItem) => {
      if (project.linkedNodeId) {
           const node = NODES.find(n => n.id === project.linkedNodeId);
           if (node?.media?.type === 'image' && node.media.url) return node.media.url;
          const galleryImage = node?.gallery?.find(isImageAsset);
          if (galleryImage) return galleryImage;
          if (node?.gallery?.[0]) return node.gallery[0];
      }
      return project.thumbnail || null;
  };

  return (
    <div className="flex flex-col h-full bg-node-bg">
      {/* Controls */}
      <div className="p-4 border-b border-node-border space-y-3 shrink-0">
        {/* Search */}
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-accent transition-colors" size={14} />
          <input 
            type="text" 
            placeholder="Search projects..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/5 dark:bg-black/20 border border-node-border rounded-md py-2 pl-9 pr-4 text-sm text-primary focus:outline-none focus:border-accent/50 focus:bg-black/10 dark:focus:bg-black/40 transition-all font-mono placeholder:text-secondary"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
            {[
                { id: 'all', label: 'All', icon: <Box size={12} /> },
                { id: 'engineering', label: 'Eng', icon: <Cpu size={12} /> },
                { id: 'design', label: 'Design', icon: <PenTool size={12} /> },
                { id: 'hybrid', label: 'Hybrid', icon: <LayoutGrid size={12} /> },
            ].map(f => (
                <button
                key={f.id}
                onClick={() => setFilter(f.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium transition-all ${
                    filter === f.id 
                    ? 'bg-accent/10 text-accent border border-accent/20' 
                    : 'bg-black/5 dark:bg-white/5 text-secondary hover:text-primary hover:bg-black/10 dark:hover:bg-white/10'
                }`}
                >
                {f.icon}
                {f.label}
                </button>
            ))}
            </div>

            {/* View Toggle */}
            <div className="flex gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-lg border border-node-border/50 flex-shrink-0 w-full sm:w-auto">
                <button 
                    onClick={() => setViewMode('grid')}
                    className={`flex-1 sm:flex-none px-3 py-1.5 rounded-md inline-flex items-center justify-center gap-2 ${viewMode === 'grid' ? 'bg-node-bg text-primary' : 'text-secondary'}`}
                    title="Grid View"
                >
                    <LayoutGrid size={14} />
                    <span className="text-[11px] font-semibold sm:hidden">Grid</span>
                </button>
                <button 
                    onClick={() => setViewMode('list')}
                    className={`flex-1 sm:flex-none px-3 py-1.5 rounded-md inline-flex items-center justify-center gap-2 ${viewMode === 'list' ? 'bg-node-bg text-primary' : 'text-secondary'}`}
                    title="List View"
                >
                    <List size={14} />
                    <span className="text-[11px] font-semibold sm:hidden">List</span>
                </button>
            </div>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto custom-scroll p-3" style={{ willChange: 'transform' }}>
        {filteredProjects.length === 0 ? (
            <div className="p-8 text-center text-secondary text-sm font-mono italic">
                No modules found.
            </div>
        ) : (
            <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-4 pb-4" : "space-y-3 pb-4"}>
                {filteredProjects.map(project => {
                    const thumb = getProjectThumbnail(project);
                    const thumbIsVideo = isVideoSource(thumb);
                    
                    if (viewMode === 'grid') {
                        return (
                            <div 
                                key={project.id}
                                onClick={(e) => handleProjectClick(e, project)}
                                className="group flex flex-col bg-black/5 dark:bg-white/5 border border-transparent hover:border-node-border rounded-xl overflow-hidden cursor-pointer"
                            >
                                {/* Large Image */}
                                <div className="w-full aspect-video relative overflow-hidden bg-black/10 border-b border-node-border/50">
                                    {thumb ? (
                                        thumbIsVideo ? (
                                          <video
                                            src={thumb}
                                            loop
                                            muted
                                            autoPlay
                                            playsInline
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                          />
                                        ) : (
                                          <img
                                            src={thumb}
                                            alt={project.title}
                                            loading="lazy"
                                            decoding="async"
                                            fetchpriority="low"
                                            className="w-full h-full object-cover"
                                          />
                                        )
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-secondary/30">
                                            <Box size={32} />
                                        </div>
                                    )}
                                    {/* Category Overlay */}
                                    <div className="absolute top-2 left-2">
                                        <span className="px-2 py-1 bg-node-bg/90 backdrop-blur text-[10px] uppercase font-bold tracking-wider rounded border border-node-border shadow-sm">
                                            {project.category}
                                        </span>
                                    </div>
                                    {/* Type Overlay */}
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                         <span className="px-4 py-2 bg-node-bg/90 backdrop-blur rounded-full text-xs font-bold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                            View Project
                                         </span>
                                    </div>
                                </div>
                                
                                <div className="p-4 flex flex-col flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-primary group-hover:text-accent transition-colors truncate pr-2 text-sm">
                                            {project.title}
                                        </h3>
                                        {project.linkedNodeId ? <ArrowRight size={14} className="text-accent opacity-0 group-hover:opacity-100 transition-opacity" /> : <ExternalLink size={14} className="text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />}
                                    </div>
                                    <p className="text-xs text-secondary mb-4 leading-relaxed">
                                        {project.description}
                                    </p>
                            <div className="mt-auto flex flex-wrap gap-1.5 items-start justify-start">
                                {project.tags.slice(0, 3).map((tag, index) => (
                                            <span key={`${project.id}-${tag}-${index}`} className="text-[10px] px-1.5 py-0.5 rounded bg-node-bg border border-node-border/50 text-secondary text-left">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    }

                    // Compact / List View
                    return (
                        <div 
                            key={project.id}
                            onClick={(e) => handleProjectClick(e, project)}
                            className="group flex gap-4 p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 border border-transparent hover:border-node-border cursor-pointer transition-all items-center"
                        >
                            {/* Thumbnail */}
                                <div className="w-20 h-14 md:w-24 md:h-16 shrink-0 rounded-lg overflow-hidden bg-black/10 border border-node-border relative">
                                {thumb ? (
                                    thumbIsVideo ? (
                                      <video
                                        src={thumb}
                                        loop
                                        muted
                                        autoPlay
                                        playsInline
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                      />
                                    ) : (
                                      <img src={thumb} alt={project.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    )
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-secondary">
                                        <Box size={20} />
                                    </div>
                                )}
                                {project.category === 'design' && <div className="absolute inset-0 bg-purple-500/10 mix-blend-overlay" />}
                                {project.category === 'engineering' && <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay" />}
                            </div>

                            {/* Content */}
                                <div className="flex-1 min-w-0 flex flex-col">
                                <div className="flex justify-between items-start mb-0.5">
                                    <span className="font-bold text-primary text-sm group-hover:text-accent transition-colors flex items-center gap-2 truncate">
                                        {project.title}
                                    </span>
                                    {project.link && !project.linkedNodeId && <ExternalLink size={12} className="text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />}
                                    {project.linkedNodeId && <ArrowRight size={12} className="text-accent opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 transform" />}
                                </div>
                                
                                <p className="text-xs text-secondary line-clamp-2 mb-2 leading-relaxed">
                                    {project.description}
                                </p>
                                
                                <div className="flex items-center gap-2 flex-wrap mt-auto">
                                    {project.tags.slice(0, 2).map((tag, index) => (
                                        <span key={`${project.id}-${tag}-${index}`} className="text-[10px] px-1.5 py-0.5 rounded bg-black/5 dark:bg-black/30 text-secondary border border-node-border/50">
                                        {tag}
                                        </span>
                                    ))}
                                    {project.tags.length > 2 && <span className="text-[10px] text-secondary">+{project.tags.length - 2}</span>}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        )}
      </div>
    </div>
  );
};

export default ProjectList;
