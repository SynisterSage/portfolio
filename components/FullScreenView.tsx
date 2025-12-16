
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { NodeData, Media, ProjectItem } from '../types';
import { X, Minimize2, ExternalLink, Calendar, Tag, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { PROJECTS_LIST, NODES } from '../constants';
import ContactForm from './ContactForm';
import ProjectActions from './ProjectActions';
import ExperienceList from './ExperienceList';
import ProjectList from './ProjectList';

interface FullScreenViewProps {
  data: NodeData;
  initialRect: DOMRect;
  onRestore: () => void; // Minimize back to window
  onClose: () => void;   // Close project entirely
  onMaximize?: (id: string, rect: DOMRect) => void;
}

const isVideoSource = (value?: string) => !!value && /\.(mp4|mov|webm|ogg)$/i.test(value);

const toMediaItem = (url: string): Media => ({
  type: isVideoSource(url) ? 'video' : 'image',
  url
});

const getMediaHeightClass = () => 'h-[clamp(280px,40vw,460px)]';

const isImageAsset = (value?: string) => /\.(png|jpe?g|gif|svg|webp)$/i.test(value || '');

const resolveProjectThumbnail = (project: ProjectItem) => {
  const node = NODES.find(n => n.id === project.linkedNodeId);
  if (node?.media?.type === 'image' && node.media.url) {
    return node.media.url;
  }
  const galleryImage = node?.gallery?.find(isImageAsset);
  if (galleryImage) return galleryImage;
  if (project.thumbnail && isImageAsset(project.thumbnail)) return project.thumbnail;
  const assetImage = project.images?.find(isImageAsset);
  if (assetImage) return assetImage;
  return project.images?.[0] || null;
};

const FullScreenView: React.FC<FullScreenViewProps> = ({ data, initialRect, onRestore, onClose, onMaximize }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [style, setStyle] = useState<React.CSSProperties>({
    position: 'fixed',
    top: initialRect.top,
    left: initialRect.left,
    width: initialRect.width,
    height: initialRect.height,
    borderRadius: '0.75rem', 
    opacity: 0, 
    transform: 'translateZ(0)', 
    zIndex: 100,
  });

  // Carousel State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const contentRef = useRef<HTMLDivElement>(null);
  const mediaContainerRef = useRef<HTMLDivElement>(null);
  const [lightboxItem, setLightboxItem] = useState<Media | null>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      setStyle(prev => ({ ...prev, opacity: 1 }));
      requestAnimationFrame(() => {
        setStyle({
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          borderRadius: '0px',
          opacity: 1,
          transform: 'translateZ(0)',
          zIndex: 100,
        });
      });
    });
  }, []);

  const handleRestore = () => {
    setLightboxItem(null);
    setIsClosing(true);
    setStyle({
      position: 'fixed',
      top: initialRect.top,
      left: initialRect.left,
      width: initialRect.width,
      height: initialRect.height,
      borderRadius: '0.75rem',
      opacity: 1,
      zIndex: 100,
    });
    setTimeout(onRestore, 300);
  };

  const handleClose = () => {
     // If it's a permanent node (like Hubs/Bio), treat Close as Restore/Minimize
     // This prevents the "disappear then reappear" glitch by shrinking back to place
     if (!data.hidden) {
         handleRestore();
         return;
     }

     setIsClosing(true);
     setStyle(prev => ({
         ...prev,
         opacity: 0,
         scale: '0.9'
     }));
     // Faster animation (300ms)
     setTimeout(onClose, 300);
  }

  // Carousel Logic
  const carouselItems = useMemo<Media[]>(() => {
    const items: Media[] = [];
    if (data.media?.url) {
      items.push(data.media);
    }
    if (data.gallery && data.gallery.length > 0) {
      items.push(...data.gallery.map(toMediaItem));
    }
    if (data.figmaEmbed) {
      items.push({ type: 'iframe', url: data.figmaEmbed });
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

  // Keyboard navigation for carousel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [carouselItems]);

  useEffect(() => {
    if (!carouselItems.length) {
      setCurrentImageIndex(0);
      return;
    }
    if (currentImageIndex >= carouselItems.length) {
      setCurrentImageIndex(0);
    }
  }, [carouselItems.length, currentImageIndex]);

  // Reset carousel index when switching projects
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [data.id]);


  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      const trimLine = line.trim();
      if (trimLine.startsWith('# ')) return <h1 key={i} className="text-3xl md:text-5xl font-bold mb-6 md:mb-8 text-primary tracking-tight">{line.replace('# ', '')}</h1>;
      if (trimLine.startsWith('## ')) return <h2 key={i} className="text-xl md:text-3xl font-bold mb-3 md:mb-4 mt-6 md:mt-8 text-primary/90">{line.replace('## ', '')}</h2>;
      if (trimLine.startsWith('### ')) return <h3 key={i} className="text-lg md:text-xl font-bold mb-2 md:mb-3 mt-4 md:mt-6 text-primary/80">{line.replace('### ', '')}</h3>;
      if (trimLine.startsWith('- ')) return <li key={i} className="ml-4 md:ml-6 mb-2 text-secondary list-disc text-base md:text-lg leading-relaxed">{line.replace('- ', '')}</li>;
      if (trimLine.startsWith('> ')) return <blockquote key={i} className="border-l-4 border-accent pl-4 md:pl-6 italic text-secondary my-6 md:my-8 text-lg md:text-xl font-serif">{line.replace('> ', '')}</blockquote>;
      return <p key={i} className="mb-4 text-secondary text-base md:text-lg leading-loose">{line}</p>;
    });
  };

  const handleMediaFullscreen = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const item = carouselItems[currentImageIndex];
    if (!item) return;
    setLightboxItem(item);
  };

  useEffect(() => {
    if (!lightboxItem) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLightboxItem(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxItem]);

  const renderPlayer = (item: Media, altSuffix?: string) => {
    if (item.type === 'video') {
      return (
        <video
          key={item.url}
          controls
          preload="metadata"
          className="w-full h-full object-cover"
        >
          <source src={item.url} />
        </video>
      );
    }
    if (item.type === 'iframe') {
      return (
        <iframe
          key={item.url}
          src={item.url}
          className="w-full h-full border-0"
          title={`${data.title} prototype`}
          allowFullScreen
        />
      );
    }
    return (
      <img
        key={item.url}
        src={item.url}
        alt={`${data.title} ${altSuffix || ''}`}
        className="w-full h-full object-cover transition-opacity duration-300"
      />
    );
  };

  const renderMedia = () => {
    if (!carouselItems.length) return null;
    const currentItem = carouselItems[currentImageIndex];
    if (!currentItem) return null;
    const heightClass = getMediaHeightClass();
    const renderCurrent = () => renderPlayer(currentItem, `slide ${currentImageIndex + 1}`);
    return (
      <div
        ref={mediaContainerRef}
        className="w-full mb-6 md:mb-8 rounded-[1.5rem] overflow-hidden shadow-2xl bg-node-bg border border-node-border relative group select-none max-w-[min(1100px,90vw)] mx-auto"
      >
        <div className={`relative w-full ${heightClass}`}>
          {renderCurrent()}
          <button
            onClick={handleMediaFullscreen}
            className="absolute top-4 left-4 p-2 rounded-full bg-black/30 text-white hover:bg-white hover:text-black transition-all shadow-lg backdrop-blur z-20"
            title="Open lightbox"
            aria-label="Open lightbox"
          >
            <Maximize2 size={18} />
          </button>
          {carouselItems.length > 1 && (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              
              <button 
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/30 text-white backdrop-blur hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0"
              >
                  <ChevronLeft size={24} />
              </button>
              <button 
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/30 text-white backdrop-blur hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0"
              >
                  <ChevronRight size={24} />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {carouselItems.map((_, idx) => (
                      <button
                          key={idx}
                          onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                          className={`w-2 h-2 rounded-full transition-all ${
                              idx === currentImageIndex 
                              ? 'bg-white w-4' 
                              : 'bg-white/40 hover:bg-white/80'
                          }`}
                      />
                  ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  const seededIndex = (id: string) => [...id].reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const relatedProjects = useMemo<ProjectItem[]>(() => {
    if (data.type !== 'project') return [];
    const eligible = PROJECTS_LIST.filter(project => project.id !== data.id);
    if (!eligible.length) return [];
    const start = seededIndex(data.id) % eligible.length;
    const picks: ProjectItem[] = [];
    for (let i = 0; i < 3; i += 1) {
      const project = eligible[(start + i) % eligible.length];
      picks.push(project);
    }
    return picks;
  }, [data.id, data.type]);

  const getRelatedThumbnail = (project: ProjectItem) => resolveProjectThumbnail(project);

  const handleRelatedClick = (project: ProjectItem) => {
    if (!onMaximize) {
      if (project.link) window.open(project.link, '_blank');
      return;
    }
    if (project.linkedNodeId) {
      const rect = mediaContainerRef.current?.getBoundingClientRect() || initialRect;
      onMaximize(project.linkedNodeId, rect);
    } else if (project.link) {
      window.open(project.link, '_blank');
    }
  };


  const renderLightbox = () => {
    if (!lightboxItem) return null;
    return (
      <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-6">
        <div className="relative w-full max-w-[min(1100px,calc(100%_-_48px))] h-[clamp(320px,80vh,720px)]">
          <button
            onClick={() => setLightboxItem(null)}
            className="absolute top-4 right-4 z-20 rounded-full bg-black/60 text-white p-2 hover:bg-white hover:text-black transition-all shadow-lg"
            aria-label="Close lightbox"
          >
            <X size={18} />
          </button>
          <div className="w-full h-full rounded-[1.5rem] overflow-hidden bg-node-bg border border-node-border shadow-2xl">
            {renderPlayer(lightboxItem)}
          </div>
        </div>
      </div>
    );
  };

  // Special renderer for hub types (Experience Hub / Project Hub)
  const isHub = data.type === 'experience-hub' || data.type === 'project-hub';
  
  return (
    <div 
      className="bg-canvas-bg/95 backdrop-blur-xl transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) overflow-hidden flex flex-col shadow-2xl"
      style={style}
    >
        {/* Header */}
        <div className={`flex items-center justify-between px-4 md:px-6 h-14 md:h-16 border-b border-node-border bg-node-bg/50 shrink-0 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
            <div className="flex items-center gap-3 overflow-hidden">
                <span className="font-mono text-secondary text-xs md:text-sm bg-black/5 dark:bg-white/5 px-2 py-1 rounded shrink-0">
                    {data.id}
                </span>
                <span className="text-secondary text-sm hidden md:inline-block">/</span>
                <span className="font-mono text-primary text-sm font-medium truncate max-w-[150px] md:max-w-md">
                    {data.title}
                </span>
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
                <button 
                    onClick={handleClose}
                    className="p-2 hover:bg-red-500/20 rounded-full text-secondary hover:text-red-500 transition-colors group ml-1 md:ml-2"
                    title={data.hidden ? "Close Project" : "Minimize Window"}
                >
                    {data.hidden ? <X size={20} className="group-hover:rotate-90 transition-transform" /> : <Minimize2 size={20} />}
                </button>
            </div>
        </div>

        {/* Content Area */}
        <div 
            ref={contentRef}
            className={`flex-1 overflow-y-auto custom-scroll transition-opacity duration-300 delay-75 ${isClosing ? 'opacity-0' : 'opacity-100'} ${isHub ? 'p-0' : 'p-4 md:p-12'}`}
        >
            {/* Render Hub Views directly if applicable */}
            {data.type === 'experience-hub' && <ExperienceList />}
            {data.type === 'project-hub' && <ProjectList onMaximize={onMaximize} />}

            {/* Render Standard Content if NOT a hub */}
            {!isHub && (
            <div className="max-w-[1200px] w-full mx-auto pb-20">
                    {/* Meta Header */}
                    <div className="mb-6 md:mb-8 flex flex-col gap-3 text-sm font-mono text-secondary">
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-secondary/70">
                                <Calendar size={14} />
                                <span>Updated recently</span>
                            </div>
                            {data.type === 'project' && (
                                <div className="flex-shrink-0">
                                    <ProjectActions projectId={data.id} projectTitle={data.title} className="text-xs" initialLikes={data.likes ?? 0} />
                                </div>
                            )}
                        </div>
                        {data.tags && data.tags.length > 0 && (
                            <div className="relative overflow-hidden">
                                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-1 py-1">
                                    <div className="flex gap-2 whitespace-nowrap min-w-0">
                                        {data.tags.map(tag => {
                                            const isActive = tag.includes('●');
                                            return (
                                                <div
                                                    key={tag}
                                                    className={`flex items-center gap-1 px-3 py-1 rounded-2xl text-[11px] ${
                                                        isActive
                                                            ? 'text-accent bg-accent/10 border border-accent/20'
                                                            : 'text-secondary bg-black/5 dark:bg-white/5 border border-node-border/40'
                                                    }`}
                                                >
                                                    <Tag size={12} />
                                                    <span>{isActive ? tag.replace('●', '● ') : tag}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-canvas-bg to-transparent" />
                                <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-canvas-bg to-transparent" />
                            </div>
                        )}
                    </div>

                    {renderMedia()}

                    {/* Prose Content */}
                    <div className="mt-6 space-y-4 text-base leading-relaxed text-secondary">
                        {renderContent(data.content)}
                    </div>

                    {/* Links (Figma / external) */}
                    {data.links && data.links.length > 0 && (
                        <div className="mt-6 flex flex-wrap gap-3">
                            {data.links.map(link => (
                                <a
                                    key={link.label}
                                    href={link.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex w-full md:w-auto items-center gap-2 rounded-full border border-node-border px-5 py-2 text-sm font-semibold text-primary transition-all bg-node-bg shadow-sm hover:-translate-y-0.5 hover:shadow-xl justify-center"
                                >
                                    {link.label}
                                    <ExternalLink size={14} />
                                </a>
                            ))}
                        </div>
                    )}

                    {data.type === 'project' && relatedProjects.length > 0 && (
                        <section className="mt-10">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs uppercase tracking-[0.4em] text-secondary/80 font-semibold">More Projects</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                {relatedProjects.map(project => (
                                    <button
                                        key={project.id}
                                        type="button"
                                        onClick={() => handleRelatedClick(project)}
                                        className="group flex flex-col overflow-hidden rounded-2xl border border-node-border bg-node-bg transition-all hover:-translate-y-0.5 hover:shadow-xl text-left"
                                    >
                                        <div className="relative h-32 overflow-hidden bg-black/5">
                                            {getRelatedThumbnail(project) ? (
                                                <img
                                                    src={getRelatedThumbnail(project)}
                                                    alt={project.title}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-secondary">
                                                    <Tag size={28} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4 space-y-3">
                                            <p className="text-sm font-semibold text-primary line-clamp-1 text-left">{project.title}</p>
                                            <p className="text-xs text-secondary/70 leading-snug line-clamp-2 text-left">{project.description}</p>
                                            <div className="flex flex-wrap gap-1 mt-4">
                                                {project.tags.slice(0, 2).map(tag => (
                                                    <span
                                                        key={tag}
                                                        className="text-[10px] px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/5 border border-node-border/50 text-secondary"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Contact Form Injection */}
                    {data.type === 'contact' && (
                        <div className="mt-8 md:mt-12 w-full max-w-lg mx-auto bg-node-bg border border-node-border rounded-2xl p-6 md:p-8 shadow-2xl">
                            <ContactForm />
                        </div>
                    )}

                </div>
            )}
        </div>
        {renderLightbox()}
    </div>
  );
};

export default FullScreenView;
