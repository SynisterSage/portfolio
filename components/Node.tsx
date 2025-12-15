
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { NodeData } from '../types';
import { FileCode, Terminal, Layers, User, ExternalLink, Hash, Database, Image as ImageIcon, Mail, History, ChevronLeft, ChevronRight } from 'lucide-react';
import ProjectList from './ProjectList';
import ContactForm from './ContactForm';
import ProjectActions from './ProjectActions';
import ExperienceList from './ExperienceList';

interface NodeProps {
  data: NodeData;
  scale: number;
  position: { x: number; y: number };
  zIndex: number;
  isActive: boolean;
  isMaximized?: boolean;
  isVisible?: boolean; 
  isClosing?: boolean;
  isDragging?: boolean;
  isRestoring?: boolean; // New prop for restore animation
  onNavigate?: (id: string) => void;
  onOpenProject?: (id: string) => void;
  onClose?: (id: string) => void;
  onDragStart?: (id: string, e: React.MouseEvent | React.TouchEvent) => void;
  onFocus?: (id: string) => void;
  onMaximize?: (id: string, rect: DOMRect) => void; 
}

const Node: React.FC<NodeProps> = ({ 
  data, 
  scale, 
  position, 
  zIndex,
  isActive,
  isMaximized,
  isVisible = true,
  isClosing = false,
  isDragging = false,
  isRestoring = false,
  onNavigate, 
  onOpenProject,
  onClose,
  onDragStart,
  onFocus,
  onMaximize
}) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Trigger animation frame to ensure DOM is ready for transition
    requestAnimationFrame(() => {
        setIsMounted(true);
    });
  }, []);

  // Determine icon based on type
  const getIcon = () => {
    switch (data.type) {
      case 'bio': return <User size={16} className="text-blue-500" />;
      case 'project': return <Layers size={16} className="text-accent" />;
      case 'project-hub': return <Database size={16} className="text-emerald-500" />;
      case 'experience': return <Terminal size={16} className="text-purple-500" />;
      case 'experience-hub': return <History size={16} className="text-purple-500" />;
      case 'skill': return <FileCode size={16} className="text-yellow-500" />;
      case 'contact': return <Mail size={16} className="text-rose-500" />;
      default: return <Hash size={16} className="text-secondary" />;
    }
  };

  // Get raw RGB values for glow effects
  const getNodeColor = () => {
    switch (data.type) {
      case 'bio': return '59, 130, 246'; // blue-500
      case 'project': 
      case 'project-hub': return '16, 185, 129'; // emerald-500
      case 'experience': 
      case 'experience-hub': return '168, 85, 247'; // purple-500
      case 'skill': return '234, 179, 8'; // yellow-500
      case 'contact': return '244, 63, 94'; // rose-500
      default: return '148, 163, 184'; // slate-400
    }
  };

  const nodeColor = getNodeColor();

  const borderColorClass = () => {
    switch (data.type) {
      case 'bio': return 'border-blue-500/50';
      case 'project': return 'border-emerald-500/50';
      case 'project-hub': return 'border-emerald-500/50';
      case 'experience': return 'border-purple-500/50';
      case 'experience-hub': return 'border-purple-500/50';
      case 'skill': return 'border-yellow-500/50';
      case 'contact': return 'border-rose-500/50';
      default: return 'border-node-border';
    }
  };

  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      const trimLine = line.trim();
      if (trimLine.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold mb-4 text-primary leading-tight">{line.replace('# ', '')}</h1>;
      if (trimLine.startsWith('## ')) return <h2 key={i} className="text-xl font-bold mb-3 text-primary/90">{line.replace('## ', '')}</h2>;
      if (trimLine.startsWith('- ')) return <li key={i} className="ml-4 mb-1 text-secondary list-disc text-base">{line.replace('- ', '')}</li>;
      if (trimLine.startsWith('> ')) return <blockquote key={i} className="border-l-2 border-accent pl-4 italic text-secondary my-4 text-base">{line.replace('> ', '')}</blockquote>;
      return <p key={i} className="mb-2 min-h-[1rem] text-primary/80 text-base leading-relaxed">{line}</p>;
    });
  };

  const isVideoSource = (value: string) => /\.(mp4|mov|webm|ogg)$/i.test(value);

  const carouselItems = useMemo(() => {
    const items: string[] = [];
    if (data.media?.url) {
      items.push(data.media.url);
    }
    if (data.gallery) {
      items.push(...data.gallery);
    }
    return items;
  }, [data]);

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (carouselItems.length <= 1) return;
    setCurrentImageIndex((prev) => (prev + 1) % carouselItems.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (carouselItems.length <= 1) return;
    setCurrentImageIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  const renderMedia = () => {
    // If we have carousel images (Main Image + Gallery), use Carousel
    if (carouselItems.length > 0) {
        const { caption, aspectRatio = 'video' } = data.media || {};
        const aspectClass = aspectRatio === 'square' ? 'aspect-square' : 
                   aspectRatio === 'portrait' ? 'aspect-[3/4]' : 
                   aspectRatio === 'wide' ? 'aspect-[21/9]' : 'aspect-video';
        return (
            <div className="w-full relative bg-black/5 dark:bg-black/40 border-b border-node-border group shrink-0 select-none">
               <div className={`w-full ${aspectClass} relative overflow-hidden group/carousel`}>
                   {isVideoSource(carouselItems[currentImageIndex]) ? (
                       <video
                          src={carouselItems[currentImageIndex]}
                          controls
                          preload="metadata"
                          className="w-full h-full object-contain"
                       />
                   ) : (
                       <img 
                           src={carouselItems[currentImageIndex]} 
                           alt={caption || data.title} 
                           className="w-full h-full object-cover transition-transform duration-700" 
                       />
                   )}
                  
                   {/* Overlay Controls */}
                   {carouselItems.length > 1 && (
                       <>
                           <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover/carousel:opacity-100 transition-opacity pointer-events-none" />
                           
                           <button 
                               onClick={prevImage}
                               className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/30 text-white backdrop-blur hover:bg-white hover:text-black transition-all opacity-0 group-hover/carousel:opacity-100 transform -translate-x-2 group-hover/carousel:translate-x-0"
                           >
                               <ChevronLeft size={16} />
                           </button>
                           <button 
                               onClick={nextImage}
                               className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/30 text-white backdrop-blur hover:bg-white hover:text-black transition-all opacity-0 group-hover/carousel:opacity-100 transform translate-x-2 group-hover/carousel:translate-x-0"
                           >
                               <ChevronRight size={16} />
                           </button>

                           {/* Dots */}
                           <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                               {carouselItems.map((_, idx) => (
                                   <button
                                       key={idx}
                                       onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                                       className={`w-1.5 h-1.5 rounded-full transition-all ${
                                           idx === currentImageIndex 
                                           ? 'bg-white w-3' 
                                           : 'bg-white/40 hover:bg-white/80'
                                       }`}
                                   />
                               ))}
                           </div>
                       </>
                   )}
               </div>
               {(caption && currentImageIndex === 0) && (
                   <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 pointer-events-none">
                       <span className="text-xs font-mono text-gray-300">{caption}</span>
                   </div>
               )}
            </div>
        );
    }

    // Fallback for non-image media types (Video/Iframe) or empty media
    if (!data.media) return null;

    const { type, url, caption, aspectRatio = 'video' } = data.media;
    const aspectClass = aspectRatio === 'square' ? 'aspect-square' : 
                        aspectRatio === 'portrait' ? 'aspect-[3/4]' : 
                        aspectRatio === 'wide' ? 'aspect-[21/9]' : 'aspect-video';

    return (
      <div className="w-full relative bg-black/5 dark:bg-black/40 border-b border-node-border group shrink-0">
        <div className={`w-full ${aspectClass} relative overflow-hidden`}>
          {type === 'iframe' && (
             <iframe src={url} className="w-full h-full border-0" title={caption || 'Embedded content'} allowFullScreen />
          )}
          {type === 'video' && (
            <video
              controls
              preload="metadata"
              className="w-full h-full object-contain bg-black"
            >
              <source src={url} />
            </video>
          )}
        </div>
        {caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 pointer-events-none">
             <span className="text-xs font-mono text-gray-300">{caption}</span>
          </div>
        )}
      </div>
    );
  };

  const handleHeaderMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (onFocus) onFocus(data.id);
    if (onDragStart) onDragStart(data.id, e);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClose) onClose(data.id);
  };

  const handleMaximize = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onMaximize && nodeRef.current) {
        const rect = nodeRef.current.getBoundingClientRect();
        onMaximize(data.id, rect);
    }
  };
  
  const stopPropagation = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
  };

  // Logic for display transition
  const showNode = isVisible && isMounted && !isClosing;
  const transitionClass = (isDragging || isRestoring) ? 'duration-0' : 'duration-500';

  return (
    <div 
      ref={nodeRef}
      className={`absolute flex flex-col bg-node-bg/95 backdrop-blur-sm border ${borderColorClass()} rounded-lg transition-all ${transitionClass} overflow-hidden node-container`}
      style={{
        width: data.width || 400,
        // Removed maxWidth override to preserve desktop dimensions
        height: (data.type === 'project-hub' || data.type === 'experience-hub') ? 500 : 'auto',
        transform: `translate(${position.x}px, ${position.y}px) scale(${showNode ? 1 : 0.95})`,
        willChange: isActive ? 'transform' : 'auto', 
        zIndex: zIndex,
        // Dynamic Glow + Depth Shadow
        boxShadow: isActive 
            ? `0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 40px -10px rgba(${nodeColor}, 0.3)`
            : `0 10px 20px -5px rgba(0, 0, 0, 0.2), 0 0 15px -5px rgba(${nodeColor}, 0.1)`,
        borderColor: isActive ? `rgba(${nodeColor}, 0.7)` : undefined,
        opacity: (isMaximized || !showNode) ? 0 : 1, 
        pointerEvents: (isMaximized || !showNode) ? 'none' : 'auto',
      }}
      onClick={() => onFocus && onFocus(data.id)}
    >
      {/* Header (Drag Handle) */}
      <div 
        className={`h-10 border-b border-node-border flex items-center justify-between px-4 bg-node-header select-none shrink-0 z-10 cursor-grab active:cursor-grabbing ${isActive ? 'bg-black/5 dark:bg-white/5' : ''}`}
        onMouseDown={handleHeaderMouseDown}
        onTouchStart={handleHeaderMouseDown}
      >
        <div className="flex items-center gap-2 pointer-events-none truncate mr-2">
          {getIcon()}
          <span className="font-mono text-sm text-secondary truncate">{data.title}</span>
        </div>
        
        {/* Window Controls */}
        <div 
            className="flex gap-1.5 group shrink-0"
            onMouseDown={stopPropagation}
            onTouchStart={stopPropagation}
        >
          <div 
            onClick={handleClose}
            className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50 hover:bg-red-500 transition-colors cursor-pointer" 
            title="Close"
          />
          <div 
            className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50 hover:bg-yellow-500 transition-colors cursor-pointer" 
            title="Minimize"
          />
          <div 
            onClick={handleMaximize}
            className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50 hover:bg-green-500 transition-colors cursor-pointer" 
            title="Expand Content"
          />
        </div>
      </div>

      {/* Content Area */}
      <div 
        className="flex-1 flex flex-col min-h-0 relative"
        onMouseDown={stopPropagation} 
        onTouchStart={stopPropagation}
      >
        {data.type === 'project-hub' ? (
            <ProjectList 
                onNavigate={onOpenProject || onNavigate} 
                onMaximize={onMaximize}
            />
        ) : data.type === 'experience-hub' ? (
            <ExperienceList />
        ) : (
            <>
                {renderMedia()}
                <div className="flex-1 p-6 font-mono text-sm leading-relaxed custom-scroll overflow-y-auto max-h-[500px]">
                    {renderContent(data.content)}

                    {/* Contact Form Injection */}
                    {data.type === 'contact' && <ContactForm />}
                </div>

                {/* Sticky Footer for Tags, Links & Actions */}
                {(data.tags || data.links || data.type === 'project') && (
                    <div className="shrink-0 px-4 py-3 border-t border-node-border bg-node-bg/95 backdrop-blur-md z-10 flex flex-col gap-3">
                        
                        {/* Tags Section */}
                        {data.tags && (
                            <div className="flex flex-wrap gap-2">
                                {data.tags.map(tag => {
                                    const isActiveTag = tag.includes('●');
                                    return (
                                        <span 
                                            key={tag} 
                                            className={`px-2 py-1 rounded text-[10px] font-medium border uppercase tracking-wider ${
                                                isActiveTag 
                                                ? 'bg-accent/10 border-accent/20 text-accent' 
                                                : 'bg-black/5 dark:bg-white/5 border-transparent text-secondary'
                                            }`}
                                        >
                                            {isActiveTag ? tag.replace('●', '● ') : tag}
                                        </span>
                                    );
                                })}
                            </div>
                        )}

                        {/* Links & Actions Section */}
                        {(data.links || data.type === 'project') && (
                            <div className={`flex items-center justify-between gap-4 w-full ${data.tags ? 'pt-2 border-t border-node-border/50' : ''}`}>
                                <div className="flex items-center gap-2 flex-wrap">
                                     {data.links?.map(link => (
                                        <a 
                                            key={link.label}
                                            href={link.url}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-canvas-bg hover:bg-accent text-xs font-bold transition-all shadow-sm active:scale-95 border border-transparent"
                                            onClick={(e) => e.stopPropagation()} 
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {link.label} <ExternalLink size={10} />
                                        </a>
                                     ))}
                                </div>
                                
                                {data.type === 'project' && (
                                    <ProjectActions projectId={data.id} projectTitle={data.title} />
                                )}
                            </div>
                        )}
                    </div>
                )}
            </>
        )}
      </div>
    </div>
  );
};

export default React.memo(Node);
