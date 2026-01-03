
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { NodeData, Media, ProjectItem } from '../types';
import { X, Minimize2, ExternalLink, Calendar, Tag, ChevronLeft, ChevronRight, Maximize2, ArrowRight, Download } from 'lucide-react';
import { PROJECTS_LIST, NODES } from '../constants';
import ContactForm from './ContactForm';
import ProjectActions from './ProjectActions';
import ExperienceList from './ExperienceList';
import ProjectList from './ProjectList';
import VelkroTypeLab from './VelkroTypeLab';

interface FullScreenViewProps {
  data: NodeData;
  initialRect: DOMRect;
  onRestore: () => void; // Minimize back to window
  onClose: () => void;   // Close project entirely
  onMaximize?: (id: string, rect: DOMRect) => void;
  snapToFull?: boolean;
}

const isVideoSource = (value?: string) => !!value && /\.(mp4|mov|webm|ogg)$/i.test(value);

const toMediaItem = (url: string): Media => ({
  type: isVideoSource(url) ? 'video' : 'image',
  url
});

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

const FullScreenView: React.FC<FullScreenViewProps> = ({ data, initialRect, onRestore, onClose, onMaximize, snapToFull }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const projectMeta = useMemo(
    () => (data.type === 'project' ? PROJECTS_LIST.find(p => p.id === data.id) || null : null),
    [data.id, data.type]
  );

  const stackItems = useMemo(() => {
    if (projectMeta?.tools?.length) return projectMeta.tools.filter(Boolean);
    if (data.type === 'project' && data.tags?.length) {
      return data.tags.filter(tag => !tag.includes('●')).slice(0, 6);
    }
    return [];
  }, [projectMeta, data]);

  const displayTags = useMemo(() => {
    if (!data.tags) return [];
    if (data.type !== 'project') return data.tags;
    const stackSet = new Set(stackItems.map(t => t.toLowerCase()));
    return data.tags.filter(tag => !stackSet.has(tag.toLowerCase()));
  }, [data.tags, data.type, stackItems]);

  const projectLinks = data.type === 'project' ? data.links || [] : [];
  const hasInlineLinks = projectLinks.length > 0;
  const targetStyle = useMemo<React.CSSProperties>(() => {
    const transitionDuration = isMobile ? '220ms' : '320ms';
    const transitionTimingFunction = 'cubic-bezier(0.25, 1, 0.5, 1)';
    return {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      minWidth: '100vw',
      maxWidth: '100vw',
      height: '100vh',
      minHeight: '100vh',
      maxHeight: '100dvh',
      borderRadius: '0.75rem',
      opacity: 1,
      transform: 'translateZ(0)',
      zIndex: 300,
      transitionDuration,
      transitionTimingFunction,
      willChange: 'transform, width, height, opacity',
    };
  }, [isMobile]);

  const [style, setStyle] = useState<React.CSSProperties>(() => ({
    position: 'fixed',
    top: initialRect.top,
    left: initialRect.left,
    width: initialRect.width,
    height: initialRect.height,
    borderRadius: '0.75rem',
    opacity: 0,
    transform: 'translateZ(0)',
    zIndex: 300,
    transitionDuration: targetStyle.transitionDuration,
    transitionTimingFunction: targetStyle.transitionTimingFunction,
    willChange: targetStyle.willChange,
  }));

  // Carousel State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const contentRef = useRef<HTMLDivElement>(null);
  const mediaContainerRef = useRef<HTMLDivElement>(null);
  const viewAllButtonRef = useRef<HTMLButtonElement>(null);
  const [lightboxItem, setLightboxItem] = useState<Media | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    const common = {
      transitionDuration: targetStyle.transitionDuration,
      transitionTimingFunction: targetStyle.transitionTimingFunction,
      willChange: targetStyle.willChange,
    };

    // If we are swapping projects while already fullscreen, snap directly
    if (snapToFull || (style.width === '100vw' && style.height === '100vh')) {
      setStyle(targetStyle);
      return;
    }

    // Start from the source rect so open mirrors the close animation
    setStyle({
      position: 'fixed',
      top: initialRect.top,
      left: initialRect.left,
      width: initialRect.width,
      height: initialRect.height,
      borderRadius: '0.75rem',
      opacity: 1,
      transform: 'translateZ(0)',
      zIndex: 300,
      ...common,
    });

    requestAnimationFrame(() => {
      setStyle(targetStyle);
    });

    // Failsafe for throttled RAF on mobile/incognito: snap to full-screen after a beat
    const fallback = window.setTimeout(() => {
      setStyle(targetStyle);
    }, 400);

    return () => {
      window.clearTimeout(fallback);
    };
  }, [data.id, initialRect, targetStyle, style.width, style.height, snapToFull]);

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

  const blurActiveElement = () => {
    if (typeof document === 'undefined') return;
    const active = document.activeElement as HTMLElement | null;
    if (active && typeof active.blur === 'function') {
      active.blur();
    }
  };

  const handleClose = (event?: React.MouseEvent | React.TouchEvent) => {
     event?.stopPropagation();
     blurActiveElement();
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
    if (Array.isArray(data.figmaEmbeds) && data.figmaEmbeds.length) {
      items.push(...data.figmaEmbeds.filter(Boolean).map(url => ({ type: 'iframe' as const, url })));
    }
    if (data.figmaEmbed) {
      items.push({ type: 'iframe' as const, url: data.figmaEmbed });
    }
    if (data.type === 'project' && data.id === 'velkro') {
      items.push({ type: 'demo', url: 'velkro-type-lab' });
    }
    // dedupe on url to avoid duplicates between figmaEmbed and figmaEmbeds[0]
    const seen = new Set<string>();
    return items.filter(item => {
      if (seen.has(item.url)) return false;
      seen.add(item.url);
      return true;
    });
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

  useEffect(() => {
    if (!carouselItems.length) return;
    setIsFading(true);
    const id = requestAnimationFrame(() => setIsFading(false));
    return () => cancelAnimationFrame(id);
  }, [currentImageIndex, carouselItems.length]);


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

  const getContentWithoutStack = useMemo(() => {
    if (data.type !== 'project') return data.content;
    const lower = data.content.toLowerCase();
    const marker = lower.lastIndexOf('stack:');
    if (marker === -1) return data.content;
    const trimmed = data.content.slice(0, marker).trim().replace(/[\s.,;:-]+$/, '');
    return trimmed || data.content;
  }, [data]);

  // Add a global flag to suppress policy UI while fullscreen is open
  useEffect(() => {
    if (typeof document === 'undefined') return;
    // Make controls hide instantly when entering fullscreen
    requestAnimationFrame(() => {
      document.documentElement.classList.add('fullscreen-active');
    });
    document.documentElement.classList.add('fullscreen-active');
    return () => {
      document.documentElement.classList.remove('fullscreen-active');
    };
  }, []);

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

  const renderPlayer = (item: Media, altSuffix?: string, isActive?: boolean) => {
    if (item.type === 'video') {
      return (
        <video
          key={item.url}
          controls
          autoPlay
          muted
          loop
          playsInline
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
          loading="lazy"
          allow="fullscreen; clipboard-read; clipboard-write; autoplay"
          allowFullScreen
        />
      );
    }
    if (item.type === 'demo') {
      return <VelkroTypeLab key={item.url} />;
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

  // Responsive height clamps to keep the frame large without leaving excess space.
  // Demo (Velkro) needs a bit more vertical room for the input field.
  const getMediaStyle = (type?: Media['type']) => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1280;
    const isDemo = type === 'demo';
    if (isMobile) {
      return {
        height: isDemo ? 'clamp(320px, 78vw, 520px)' : 'clamp(260px, 72vw, 420px)'
      } as const;
    }
    if (width < 1024) {
      return {
        height: isDemo ? 'clamp(420px, 68vw, 640px)' : 'clamp(340px, 60vw, 520px)'
      } as const;
    }
    return {
      height: isDemo ? 'clamp(500px, 50vw, 780px)' : 'clamp(420px, 52vw, 680px)'
    } as const;
  };

  const renderMedia = () => {
    if (!carouselItems.length) return null;
    const currentItem = carouselItems[currentImageIndex];
    if (!currentItem) return null;
    const renderCurrent = () => {
      const isActive = true;
      return renderPlayer(currentItem, `slide ${currentImageIndex + 1}`, isActive);
    };
    const canLightbox = true; // allow lightbox even for demo

    const handleTouchStart = (event: React.TouchEvent) => {
      touchStartX.current = event.touches[0]?.clientX ?? null;
      touchEndX.current = null;
    };

    const handleTouchMove = (event: React.TouchEvent) => {
      touchEndX.current = event.touches[0]?.clientX ?? null;
    };

    const handleTouchEnd = () => {
      if (touchStartX.current === null || touchEndX.current === null) return;
      const delta = touchEndX.current - touchStartX.current;
      const threshold = 40;
      if (Math.abs(delta) < threshold) return;
      if (delta < 0) {
        nextImage();
      } else {
        prevImage();
      }
      touchStartX.current = null;
      touchEndX.current = null;
    };

    return (
      <div
        ref={mediaContainerRef}
        className="w-full mb-6 md:mb-8 rounded-3xl overflow-hidden shadow-2xl bg-node-bg border border-node-border relative group select-none max-w-300 mx-auto"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: 'pan-y', ...getMediaStyle(currentItem.type) }}
      >
        <div className="relative w-full h-full">
          <div className={`h-full w-full transition-opacity duration-300 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
            {renderCurrent()}
          </div>
          {carouselItems
            .map((item, idx) => ({ item, idx }))
            .filter(({ item, idx }) => item.type !== 'iframe' && Math.abs(idx - currentImageIndex) === 1)
            .map(({ item, idx }) => (
              <div key={`${item.url}-preload`} className="hidden">
                {renderPlayer(item, `slide ${idx + 1}`, false)}
              </div>
            ))}
          {canLightbox && (
            <button
              onClick={handleMediaFullscreen}
              className="absolute top-4 left-4 p-2 rounded-full bg-black/30 text-white hover:bg-white hover:text-black transition-all shadow-lg backdrop-blur z-20"
              title="Open lightbox"
              aria-label="Open lightbox"
            >
              <Maximize2 size={18} />
            </button>
          )}
          {carouselItems.length > 1 && (
            <>
              <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              
              <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
                  <button 
                      onClick={prevImage}
                      className="pointer-events-auto p-3 rounded-full bg-black/30 text-white backdrop-blur hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0"
                  >
                      <ChevronLeft size={24} />
                  </button>
                  <button 
                      onClick={nextImage}
                      className="pointer-events-auto p-3 rounded-full bg-black/30 text-white backdrop-blur hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0"
                  >
                      <ChevronRight size={24} />
                  </button>
              </div>

              <div className="absolute bottom-4 inset-x-0 flex items-center justify-center px-3">
                <div className="flex gap-2 px-3 py-2 rounded-full bg-black/40 backdrop-blur-sm shadow-lg">
                  {carouselItems.map((_, idx) => (
                      <button
                          key={idx}
                          onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                          className={`h-2.5 w-2.5 rounded-full transition-all shadow-[0_0_0_1px_rgba(0,0,0,0.35)] ${
                              idx === currentImageIndex 
                              ? 'bg-white w-4'
                              : 'bg-white/60 hover:bg-white/90'
                          }`}
                      />
                  ))}
                </div>
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

  const handleViewAllProjects = () => {
    const rect =
      viewAllButtonRef.current?.getBoundingClientRect() ||
      mediaContainerRef.current?.getBoundingClientRect() ||
      contentRef.current?.getBoundingClientRect() ||
      new DOMRect(0, 0, window.innerWidth, 80);
    const anchorRect = new DOMRect(rect.x, rect.y, rect.width || 1, rect.height || 1);

    if (onMaximize) {
      onMaximize('projects-hub', anchorRect);
      return;
    }

    window.location.href = '/projects-hub';
  };


  const renderLightbox = () => {
    if (!lightboxItem) return null;
    const isDemo = lightboxItem.type === 'demo';
    return (
      <div className="fixed inset-0 z-200 bg-black/80 flex items-center justify-center p-6">
        <div
          className={`relative w-full max-w-[min(1100px,calc(100%-48px))] ${isDemo ? 'max-h-[85vh] h-auto' : 'h-[clamp(320px,80vh,720px)]'}`}
        >
          <button
            onClick={() => setLightboxItem(null)}
            className="absolute top-4 right-4 z-20 rounded-full bg-black/60 text-white p-2 hover:bg-white hover:text-black transition-all shadow-lg"
            aria-label="Close lightbox"
          >
            <X size={18} />
          </button>
          <div className={`w-full ${isDemo ? 'max-h-[85vh]' : 'h-full'} rounded-3xl overflow-hidden bg-node-bg border border-node-border shadow-2xl`}>
            {renderPlayer(lightboxItem)}
          </div>
        </div>
      </div>
    );
  };

  // Special renderer for hub types (Experience Hub / Project Hub)
  const isHub = data.type === 'experience-hub' || data.type === 'project-hub';
  const isAbout = data.id === 'about';
  
  return (
    <div 
      className={`bg-canvas-bg/95 ${isMobile ? 'backdrop-blur-lg shadow-xl duration-200' : 'backdrop-blur-xl shadow-2xl duration-300'} transition-all cubic-bezier(0.16, 1, 0.3, 1) overflow-hidden flex flex-col`}
      style={style}
    >
        {/* Header */}
        <div className={`flex items-center justify-between px-4 md:px-6 h-14 md:h-16 border-b border-node-border bg-node-bg/50 shrink-0 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
            <div className="flex items-center gap-3 overflow-hidden">
                <span className="font-mono text-secondary text-xs md:text-sm bg-black/5 dark:bg-white/5 px-2 py-1 rounded shrink-0">
                    {data.id}
                </span>
                <span className="text-secondary text-sm hidden md:inline-block">/</span>
                <span className="font-mono text-primary text-sm font-medium truncate max-w-37.5 md:max-w-md">
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
            className={`relative flex-1 overflow-y-auto custom-scroll transition-opacity duration-300 delay-75 ${isClosing ? 'opacity-0' : 'opacity-100'} ${isHub ? 'p-0' : 'p-4 md:p-12'}`}
        >
            {/* Render Hub Views directly if applicable */}
            {data.type === 'experience-hub' && <ExperienceList />}
            {data.type === 'project-hub' && <ProjectList onMaximize={onMaximize} />}

            {/* Render Standard Content if NOT a hub */}
            {!isHub && (
            <div className={`relative z-10 max-w-300 w-full mx-auto ${isAbout ? 'pb-12 md:pb-16' : 'pb-20'}`}>
                    {/* Meta Header */}
                    <div className="mb-6 md:mb-8 flex flex-col gap-3 text-sm font-mono text-secondary">
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-secondary/70">
                                <Calendar size={14} />
                                <span>Updated recently</span>
                            </div>
                            {data.type === 'project' && (
                                <div className="shrink-0">
                                    <ProjectActions projectId={data.id} projectTitle={data.title} className="text-xs" initialLikes={data.likes ?? 0} />
                                </div>
                            )}
                        </div>
                        {(displayTags.length > 0) || hasInlineLinks ? (
                          <div className="flex items-center justify-between gap-3 flex-wrap">
                            {displayTags.length > 0 && (
                              <div className="relative flex-1 min-w-0">
                                  <div className="flex items-center overflow-x-auto no-scrollbar py-1 [mask-image:linear-gradient(to_right,transparent,black_20px,black_calc(100%_-_20px),transparent)]">
                                      <div className="flex gap-2 whitespace-nowrap px-5">
                                          {displayTags.map(tag => {
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
                              </div>
                            )}
                            {((data.type === 'project' && hasInlineLinks) || isAbout) && (
                              <div className="flex items-center gap-2 flex-wrap justify-end">
                                {data.type === 'project' && projectLinks.map(link => (
                                  <div key={link.label} className="inline-flex items-center gap-2">
                                    <a
                                      href={link.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1.5 rounded-full border border-node-border px-3 py-1.5 text-[12px] font-semibold text-primary transition-all bg-node-bg shadow-sm hover:-translate-y-0.5 hover:shadow-xl"
                                    >
                                      {link.label}
                                      <ExternalLink size={12} />
                                    </a>
                                  </div>
                                ))}
                                {isAbout && (
                                  <button
                                    type="button"
                                    onClick={() => setShowResume(true)}
                                    className="px-3 py-1.5 rounded border border-emerald-400 text-[10px] md:text-xs font-mono uppercase tracking-widest bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.25)] transition hover:shadow-[0_0_20px_rgba(16,185,129,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
                                    style={{
                                      background: 'linear-gradient(135deg, rgba(16,185,129,0.95), rgba(16,185,129,0.8))',
                                      filter: 'drop-shadow(0 0 8px rgba(16,185,129,0.2))'
                                    }}
                                    aria-label="View resume"
                                  >
                                    View Resume
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        ) : null}
                    </div>

                    {renderMedia()}

                    {/* Prose Content */}
                    <div className="mt-6 md:mt-8 relative">
                        <div className="relative space-y-4 text-base leading-relaxed text-secondary md:text-lg">
                            {renderContent(getContentWithoutStack)}
                        </div>
                        {data.type === 'project' && stackItems.length > 0 && (
                          <div className="mt-6 flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-secondary/80">
                              <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_0_2px_rgba(16,185,129,0.18)]" />
                              <span>Stack</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {stackItems.map(tool => (
                                <span
                                  key={tool}
                                  className="px-2.5 py-1 rounded-md bg-white/70 dark:bg-white/10 text-[12px] font-semibold text-secondary border border-node-border/60 shadow-sm"
                                >
                                  {tool}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>

                    {/* Links (Figma / external) */}
                    {data.links && data.links.length > 0 && data.type !== 'project' && (
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
                                <button
                                  type="button"
                                  ref={viewAllButtonRef}
                                  onClick={handleViewAllProjects}
                                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-node-border/70 bg-node-bg/80 backdrop-blur text-[11px] uppercase tracking-[0.25em] font-semibold text-secondary transition-all hover:-translate-y-0.5 hover:shadow-lg hover:text-primary focus:outline-none focus:ring-2 focus:ring-accent/40"
                                >
                                  View all
                                  <ArrowRight size={14} />
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                {relatedProjects.map(project => (
                                    <button
                                        key={project.id}
                                        type="button"
                                        onClick={() => handleRelatedClick(project)}
                                    className="group flex flex-col overflow-hidden rounded-2xl border border-node-border bg-node-bg transition-all hover:-translate-y-0.5 hover:shadow-xl text-left"
                                    >
                                        <div className="relative h-40 md:h-44 overflow-hidden bg-black/5">
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
                                        <div className="p-4 space-y-2">
                                            <p className="text-sm font-semibold text-primary line-clamp-1 text-left">{project.title}</p>
                                            <p className="text-xs text-secondary/70 leading-snug line-clamp-2 text-left">{project.description}</p>
                                            <div className="flex flex-wrap gap-1 mt-3">
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
        {showResume && (
          <div className="fixed inset-0 z-320 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4 py-8">
            <div className="relative w-full max-w-5xl h-[80vh] bg-node-bg border border-node-border rounded-2xl shadow-2xl overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b border-node-border bg-node-header">
                <div className="flex items-center gap-2 text-secondary font-mono text-xs uppercase tracking-[0.25em]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_0_2px_rgba(16,185,129,0.25)]" />
                  <span>resume.pdf</span>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="/resume.pdf"
                    download
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-node-border text-secondary hover:text-primary hover:border-accent transition-colors text-[12px] font-semibold"
                  >
                    <Download size={14} />
                    Download
                  </a>
                  <button
                    onClick={() => setShowResume(false)}
                    className="p-2 rounded-md hover:bg-red-500/10 text-secondary hover:text-red-500 transition-colors"
                    aria-label="Close resume"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
              <div className="flex-1 bg-black/5">
                <iframe
                  src="/resume.pdf#view=FitH"
                  title="Resume PDF"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default FullScreenView;
