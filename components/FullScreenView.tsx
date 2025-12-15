
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { NodeData } from '../types';
import { X, Minimize2, ExternalLink, Calendar, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
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

const isVideoSource = (value: string) => /\.(mp4|mov|webm|ogg)$/i.test(value);

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
    // Faster animation (300ms)
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
  const carouselImages = useMemo(() => {
    const images: string[] = [];
    if (data.media?.url) {
        images.push(data.media.url);
    }
    if (data.gallery && data.gallery.length > 0) {
        images.push(...data.gallery);
    }
    return images;
  }, [data]);

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (carouselImages.length <= 1) return;
    setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (carouselImages.length <= 1) return;
    setCurrentImageIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
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
  }, [carouselImages]);


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

  const renderMedia = () => {
    if (carouselImages.length > 0) {
        const currentUrl = carouselImages[currentImageIndex];
        const isVideo = isVideoSource(currentUrl);
        const { caption, aspectRatio = 'video' } = data.media || {};
        const aspectClass = aspectRatio === 'square' ? 'aspect-square' : 
                   aspectRatio === 'portrait' ? 'aspect-[3/4]' : 
                   aspectRatio === 'wide' ? 'aspect-[21/9]' : 'aspect-video';
        return (
            <div className="w-full mb-6 md:mb-8 rounded-xl overflow-hidden shadow-2xl bg-node-bg border border-node-border relative group select-none">
                <div className={`relative w-full bg-black ${aspectClass}`}>
                    {isVideo ? (
                        <video
                            src={currentUrl}
                            controls
                            preload="metadata"
                            className="w-full h-full object-contain bg-black"
                        />
                    ) : (
                        <img 
                            src={currentUrl} 
                            alt={`${data.title} slide ${currentImageIndex + 1}`} 
                            className="w-full h-full object-contain transition-opacity duration-300"
                        />
                    )}
                    {carouselImages.length > 1 && (
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
                                {carouselImages.map((_, idx) => (
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
                {caption && currentImageIndex === 0 && (
                     <div className="p-3 bg-node-header text-center text-secondary font-mono text-sm border-t border-node-border">
                        {caption}
                     </div>
                )}
            </div>
        );
    }

    if (!data.media) return null;
    const { type, url, caption, aspectRatio = 'video' } = data.media;
    const aspectClass = aspectRatio === 'square' ? 'aspect-square' : 
                        aspectRatio === 'portrait' ? 'aspect-[3/4]' : 
                        aspectRatio === 'wide' ? 'aspect-[21/9]' : 'aspect-video';

    return (
      <div className="w-full mb-8 rounded-xl overflow-hidden shadow-2xl bg-node-bg border border-node-border">
         <div className={`relative w-full ${aspectClass}`}>
            {type === 'iframe' && <iframe src={url} className="w-full h-full border-0" allowFullScreen />}
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
         {caption && <div className="p-3 bg-node-header text-center text-secondary font-mono text-sm border-t border-node-border">{caption}</div>}
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
                <div className="max-w-3xl mx-auto pb-20">
                    {/* Meta Header */}
                    <div className="mb-6 md:mb-8 flex flex-wrap items-center justify-between gap-4 text-sm font-mono text-secondary">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-1.5">
                                <Calendar size={14} />
                                <span>Updated recently</span>
                            </div>
                            {data.tags && (
                                <div className="flex gap-2">
                                    {data.tags.map(tag => {
                                        const isActive = tag.includes('●');
                                        return (
                                            <div key={tag} className={`flex items-center gap-1 px-2 py-0.5 rounded border transition-colors ${
                                                isActive 
                                                ? 'text-accent bg-accent/5 border-accent/20' 
                                                : 'text-secondary bg-black/5 dark:bg-white/5 border-transparent'
                                            }`}>
                                                <Tag size={12} />
                                                <span>{isActive ? tag.replace('●', '● ') : tag}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                        {/* Project Actions for FullScreen View */}
                        {data.type === 'project' && <ProjectActions projectId={data.id} />}
                    </div>

                    {renderMedia()}
                    
                    {/* Prose Content */}
                    <article className="prose prose-invert prose-lg max-w-none">
                        {renderContent(data.content)}
                    </article>

                    {/* Contact Form Injection */}
                    {data.type === 'contact' && (
                        <div className="mt-8 md:mt-12 w-full max-w-lg mx-auto bg-node-bg border border-node-border rounded-2xl p-6 md:p-8 shadow-2xl">
                            <ContactForm />
                        </div>
                    )}

                    {/* Footer Links */}
                    {data.links && (
                        <div className="mt-12 md:mt-16 pt-8 border-t border-node-border flex flex-wrap gap-4">
                            {data.links.map(link => (
                                <a 
                                    key={link.label}
                                    href={link.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 px-6 py-3 bg-node-header border border-node-border text-primary font-bold rounded-lg hover:bg-node-bg hover:scale-105 transition-all"
                                >
                                    {link.label}
                                    <ExternalLink size={16} />
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    </div>
  );
};

export default FullScreenView;
