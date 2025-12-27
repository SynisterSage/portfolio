
import React, { useEffect, useRef, useState } from 'react';
import { NodeData } from '../types';
import { EXPERIENCE_LIST, NODES } from '../constants';
import { Briefcase, Github, Code, Layers, Calendar, ArrowUpRight, Cpu, Database, Layout, PenTool, Mail, Send, Maximize2 } from 'lucide-react';
import ContactForm from './ContactForm';
import FullScreenView from './FullScreenView';
import ProjectList from './ProjectList';

interface DocumentViewProps {
  nodes: NodeData[];
  targetId: string | null;
  viewMode: 'spatial' | 'document';
  isReady?: boolean; // New prop to coordinate with Preloader
}

// Reusable FadeIn Component for Scroll Animations
const FadeIn: React.FC<{
    children: React.ReactNode;
    id?: string;
    className?: string;
    delay?: number;
    threshold?: number;
    setRef?: (el: HTMLElement | null) => void;
}> = ({ children, id, className = "", delay = 0, threshold = 0.1, setRef }) => {
  const [isVisible, setIsVisible] = useState(false);
  const internalRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
            // Small timeout to decouple from main thread slightly for smoothness
            setTimeout(() => setIsVisible(true), 100);
            observer.disconnect();
        }
      },
      { 
        threshold: threshold, 
        rootMargin: '0px 0px -50px 0px' // Trigger just before it's fully in view
      } 
    );

    if (internalRef.current) {
      observer.observe(internalRef.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

    return (
        <section
            id={id}
            ref={(el) => {
                    internalRef.current = el;
                    if (setRef) setRef(el);
            }}
            className={`${className} transition-all duration-1000 ease-out ${
                isVisible
                        ? 'opacity-100 translate-y-0 blur-0'
                        : 'opacity-0 translate-y-12 blur-sm'
            }`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </section>
    );
};

const DocumentView: React.FC<DocumentViewProps> = ({ nodes, targetId, viewMode, isReady = true }) => {
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const [heroVisible, setHeroVisible] = useState(false);
  const [viewReady, setViewReady] = useState(false);
  const [overlayStack, setOverlayStack] = useState<{ id: string; rect: DOMRect }[]>([]);
  const selectedProject = overlayStack[overlayStack.length - 1] || null;

  const handleOverlayMaximize = (id: string, rect: DOMRect) => {
    // Always replace the overlay with the newly selected item;
    // closing should exit, not return to previous items.
    setOverlayStack([{ id, rect }]);
  };

  const closeOverlay = () => setOverlayStack([]);

    // Trigger Hero animation only when the document view itself is ready
    // (this ensures the hero animates in sync with the view fade-in on reload)
    useEffect(() => {
        let t: number | undefined;
        if (viewReady) {
            // small stagger so the root fade has started
            t = window.setTimeout(() => setHeroVisible(true), 120);
        } else {
            setHeroVisible(false);
        }
        return () => { if (t) clearTimeout(t); };
    }, [viewReady]);

  useEffect(() => {
    setViewReady(false);
    if (!isReady) return;
    const timer = setTimeout(() => setViewReady(true), 80);
    return () => clearTimeout(timer);
  }, [isReady, viewMode]);

  // Scroll to target section when targetId changes
  useEffect(() => {
    if (targetId && sectionRefs.current[targetId]) {
      sectionRefs.current[targetId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [targetId]);

  const heroNode = nodes.find(n => n.id === 'hero');
  const skillsNode = nodes.find(n => n.id === 'skills');
  const contactNode = nodes.find(n => n.id === 'contact');
  
  // Parse skills content into categories
  const skillCategories = skillsNode ? skillsNode.content.split('\n\n').map(group => {
      const lines = group.trim().split('\n');
      return {
          title: lines[0].replace(':', ''),
          skills: lines.slice(1).map(s => s.replace('- ', ''))
      };
  }) : [];

  const selectedNodeData = selectedProject ? NODES.find(n => n.id === selectedProject.id) : null;

  // Custom renderer for Hero with Staggered Animation
  const renderHeroContent = () => {
    if (!heroNode) return null;
    const lines = heroNode.content.split('\n').filter(l => l.trim() !== '');
    const title = lines.find(l => l.startsWith('# '))?.replace('# ', '') || '';
    const bodyLines = lines.filter(l => !l.startsWith('# '));

    return (
        <div className="max-w-4xl">
             {/* Staggered load for Title */}
             <div className="overflow-visible">
                <h1 className={`text-5xl sm:text-6xl md:text-8xl font-bold tracking-tighter mb-6 md:mb-8 text-primary leading-[0.9] transition-all duration-1000 ease-out transform ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                    {title.split(' ').map((word, i) => (
                        <span key={i} className={i === 1 ? 'text-accent block' : 'block'} style={i === 1 ? { textShadow: '0 0 20px rgba(16,185,129,0.55)' } : undefined}>{word}</span>
                    ))}
                </h1>
             </div>

             {/* Staggered load for Body */}
             <div className={`space-y-4 md:space-y-6 transition-all duration-1000 delay-300 ease-out transform ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                {bodyLines.map((line, i) => (
                     <p key={i} className="text-lg md:text-xl lg:text-2xl text-secondary max-w-2xl leading-relaxed font-light">
                        {line.split('**').map((part, idx) => 
                            idx % 2 === 1 ? <span key={idx} className="text-primary font-medium">{part}</span> : part
                        )}
                     </p>
                ))}
             </div>

             {/* Staggered load for Tags */}
            <div className={`flex flex-wrap items-center gap-2 md:gap-3 mt-8 md:mt-12 transition-all duration-1000 delay-500 ease-out transform ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                {heroNode.tags?.map(tag => (
                    <span key={tag} className="px-2.5 py-1.5 border border-node-border rounded text-[10px] md:text-xs font-mono text-secondary uppercase tracking-widest bg-black/5 dark:bg-white/5">
                        {tag}
                    </span>
                ))}
                <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded border border-emerald-400 text-[10px] md:text-xs font-mono uppercase tracking-widest bg-gradient-to-b from-emerald-400/80 to-emerald-500 text-white shadow-[0_0_25px_rgba(16,185,129,0.3)] transition hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(16,185,129,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
                    style={{ filter: 'drop-shadow(0 0 15px rgba(16,185,129,0.35))' }}
                >
                    Download Resume
                </a>
            </div>
        </div>
    );
  };

    return (
        <div
            className={`w-full h-full overflow-y-auto overflow-x-hidden bg-canvas-bg custom-scroll scroll-smooth relative transition-opacity duration-800 ease-out ${
                viewReady ? 'opacity-100' : 'opacity-0'
            }`}
        >
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(circle at 20% 20%, rgba(52,211,153,0.12), transparent 38%), radial-gradient(circle at 80% 10%, rgba(52,211,153,0.1), transparent 33%), radial-gradient(circle at 60% 60%, rgba(52,211,153,0.08), transparent 34%)'
        }}
      />
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-16 md:py-24 flex flex-col gap-20 md:gap-32">
        
        {/* HERO SECTION - Uses special animation internal to renderHeroContent for immediate impact */}
        {heroNode && (
          <section 
            id="hero" 
            ref={el => { sectionRefs.current['hero'] = el; }}
            className="min-h-[60vh] md:min-h-[75vh] flex flex-col justify-center"
          >
            {renderHeroContent()}
          </section>
        )}

        {/* PROJECTS SECTION */}
        <FadeIn 
            id="projects-hub" 
            setRef={el => { sectionRefs.current['projects-hub'] = el; }}
            className="flex flex-col min-h-[500px] md:min-h-[600px]"
        >
            <div className="flex items-end justify-between mb-6 md:mb-8 border-b border-node-border pb-4">
                <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">
                    Project Archives
                </h2>
                <div className="flex items-center gap-4">
                    <span className="text-secondary font-mono text-sm hidden md:block">Index 01</span>
                    <button 
                        onClick={(e) => {
                            const section = sectionRefs.current['projects-hub'];
                            const rect = section?.getBoundingClientRect() || new DOMRect();
                            handleOverlayMaximize('projects-hub', rect);
                        }}
                        className="p-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-accent hover:text-white text-secondary transition-all"
                        aria-label="Maximize Project View"
                        title="Enter Full Screen"
                    >
                        <Maximize2 size={20} />
                    </button>
                </div>
            </div>

            <div className="bg-node-bg border border-node-border rounded-2xl overflow-hidden flex flex-col h-[600px] md:h-[800px] shadow-2xl transition-all duration-500 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)]">
                <div className="flex-1 overflow-hidden">
                    <ProjectList 
                        onMaximize={handleOverlayMaximize}
                        variant="grid"
                    />
                </div>
            </div>
        </FadeIn>

        {/* EXPERIENCE SECTION */}
        <FadeIn 
            id="experience-hub" 
            setRef={el => { sectionRefs.current['experience-hub'] = el; }} 
        >
            <div className="flex items-end justify-between mb-12 md:mb-16 border-b border-node-border pb-4">
                <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">Experience Log</h2>
                <span className="text-secondary font-mono text-sm hidden md:block">Index 02</span>
            </div>

            <div className="relative border-l border-node-border ml-2 md:ml-6 space-y-16 md:space-y-20 pb-4">
                {EXPERIENCE_LIST.map((item, i) => (
                    <FadeIn key={item.id} delay={i * 100} className="relative pl-6 md:pl-16">
                        {/* Timeline Dot */}
                        <div className="absolute -left-[5px] md:-left-[6.5px] top-3 w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-canvas-bg border-2 border-accent z-10 shadow-[0_0_0_4px_rgba(var(--bg-canvas))]" />
                        
                        <div className="flex flex-col gap-4 md:gap-6">
                            {/* Header */}
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 md:gap-4">
                                <div className="space-y-1">
                                    <h3 className="text-xl md:text-2xl font-bold text-primary leading-tight">{item.role}</h3>
                                    <div className="text-base md:text-lg text-secondary font-medium flex items-center gap-2">
                                        {item.company}
                                    </div>
                                </div>
                                <div className="font-mono text-[10px] md:text-xs font-bold text-accent border border-accent/20 bg-accent/5 px-2 md:px-3 py-1 md:py-1.5 rounded uppercase tracking-wider self-start sm:self-auto">
                                    {item.period}
                                </div>
                            </div>

                            {/* Card Content with Glow Effect */}
                            <div className="bg-node-bg border border-node-border rounded-xl p-5 md:p-8 transition-all duration-300 hover:border-accent/50 hover:shadow-[0_8px_30px_-5px_rgba(16,185,129,0.15)] group shadow-sm">
                                 <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                                    {item.description.trim().split('\n').map((line, idx) => {
                                        if (line.startsWith('-')) {
                                            return (
                                                <li key={idx} className="flex items-start gap-3 md:gap-4 text-sm md:text-base leading-relaxed text-secondary/90">
                                                    <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-accent/40 shrink-0" />
                                                    <span>
                                                        {line.replace('- ', '').split('**').map((part, pIdx) => 
                                                            pIdx % 2 === 1 ? <strong key={pIdx} className="text-primary font-medium">{part}</strong> : part
                                                        )}
                                                    </span>
                                                </li>
                                            );
                                        }
                                        return null;
                                    })}
                                </ul>

                                <div className="flex flex-wrap gap-2 pt-6 border-t border-node-border/50">
                                    {item.tags.map(tag => (
                                        <span key={tag} className="text-[10px] md:text-xs font-mono text-secondary hover:text-primary transition-colors cursor-default px-2 py-1 bg-black/5 dark:bg-white/5 rounded">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                ))}
            </div>
        </FadeIn>

        {/* SKILLS SECTION */}
        {skillsNode && (
            <FadeIn 
                id="skills" 
                setRef={el => { sectionRefs.current['skills'] = el; }}
            >
                <div className="flex items-end justify-between mb-8 md:mb-12 border-b border-node-border pb-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">Technical Stack</h2>
                    <span className="text-secondary font-mono text-sm hidden md:block">Index 03</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {skillCategories.map((cat, i) => {
                        let Icon = Code;
                        const titleLower = cat.title.toLowerCase();
                        if (titleLower.includes('frontend')) Icon = Layout;
                        else if (titleLower.includes('backend') || titleLower.includes('data')) Icon = Database;
                        else if (titleLower.includes('design')) Icon = PenTool;
                        else if (titleLower.includes('core')) Icon = Cpu;

                        return (
                            <div key={i} className="bg-node-bg border border-node-border rounded-xl p-6 md:p-8 hover:border-accent/50 transition-all duration-300 shadow-sm hover:shadow-[0_8px_30px_-5px_rgba(16,185,129,0.15)] group h-full">
                                <h4 className="text-xs md:text-sm font-bold uppercase tracking-widest text-secondary mb-4 md:mb-6 flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-canvas-bg border border-node-border text-accent group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                        <Icon size={18} />
                                    </div>
                                    {cat.title.replace('_', ' ')}
                                </h4>
                                
                                <div className="flex flex-wrap gap-2.5">
                                    {cat.skills.map(skill => (
                                        <div 
                                            key={skill} 
                                            className="px-2.5 py-1.5 bg-canvas-bg/60 border border-node-border rounded-md text-xs md:text-sm text-primary/90 font-mono hover:text-accent hover:border-accent/40 transition-all cursor-default"
                                        >
                                            {skill}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </FadeIn>
        )}

        {/* CONTACT SECTION */}
        {contactNode && (
            <FadeIn 
                id="contact" 
                setRef={el => { sectionRefs.current['contact'] = el; }}
                className="pb-24 border-t border-node-border pt-12 md:pt-16"
            >
                <div className="relative overflow-visible">
                  <div
                    className="pointer-events-none absolute inset-x-[-25vw] inset-y-[-25%] opacity-55 blur-3xl"
                    style={{
                      background:
                        'radial-gradient(circle at 25% 70%, rgba(52,211,153,0.12), transparent 48%), radial-gradient(circle at 75% 90%, rgba(52,211,153,0.1), transparent 45%), radial-gradient(circle at 50% 110%, rgba(52,211,153,0.08), transparent 50%)'
                    }}
                  />
                  <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="flex flex-col justify-center">
                        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 leading-tight">
                            Let's Build <br/> <span className="text-accent">Something New.</span>
                        </h2>
                        <p className="text-lg md:text-xl text-secondary leading-relaxed mb-8 max-w-md">
                            {contactNode.content.replace('I am currently available for freelance projects and open to full-time opportunities.', '')}
                             Always interested in working on ambitious projects with positive people.
                        </p>
                        
                        <div className="flex flex-col gap-4">
                            {/* Status Badge */}
                            <div className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-medium tracking-wide">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                AVAILABLE FOR NEW PROJECTS
                            </div>

                            {/* Email Link */}
                             <a 
                                href="mailto:afergyy@gmail.com" 
                                className="flex items-center gap-3 text-secondary hover:text-primary transition-colors font-mono text-sm group mt-2"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="p-2 rounded-lg bg-black/5 dark:bg-white/5 group-hover:bg-primary group-hover:text-canvas-bg transition-colors">
                                    <Mail size={16} />
                                </div>
                                <span>afergyy@gmail.com</span>
                            </a>
                        </div>
                    </div>
                    
                    <div className="bg-node-bg p-6 md:p-8 rounded-xl border border-node-border shadow-sm hover:shadow-[0_8px_30px_-5px_rgba(16,185,129,0.15)] transition-all duration-300 group">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-secondary mb-6 flex items-center gap-2">
                           <Send size={12} className="text-accent" /> 
                           Send a Message
                        </h3>
                        <ContactForm />
                    </div>
                  </div>
                </div>
            </FadeIn>
        )}
    </div>

      {/* FULL SCREEN OVERLAY */}
      {selectedProject && selectedNodeData && (
          <div className="fixed inset-0 z-50">
             <FullScreenView 
                 key={selectedProject.id}
                 data={selectedNodeData}
                 initialRect={selectedProject.rect}
                 onRestore={closeOverlay}
                 onClose={closeOverlay}
                 onMaximize={handleOverlayMaximize}
             />
          </div>
      )}
    </div>
  );
};

export default DocumentView;
