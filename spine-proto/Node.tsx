
import React, { useRef, useState, useEffect } from 'react';
import { NodeData } from '../types';

interface NodeProps {
  data: NodeData;
  position: { x: number; y: number; z: number };
  zIndex: number;
  isActive: boolean;
  isVisible?: boolean; 
  onMaximize?: (id: string, rect: DOMRect) => void;
  onHoverChange?: (isHovered: boolean) => void;
}

const Node: React.FC<NodeProps> = ({ 
  data, 
  position, 
  zIndex,
  isActive,
  isVisible = true,
  onMaximize,
  onHoverChange
}) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const handleMaximize = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onMaximize && nodeRef.current) {
        const rect = nodeRef.current.getBoundingClientRect();
        onMaximize(data.id, rect);
    }
  };

  const handleMouseEnter = () => {
    if (isMobile) return;
    setIsHovered(true);
    onHoverChange?.(true);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    setIsHovered(false);
    onHoverChange?.(false);
  };

  if (!isVisible) return null;

  // Isometric rotations
  const baseRotationY = -48;
  const baseRotationX = 0;
  
  const hoverRotationY = -25; 
  const hoverRotationX = -8;
  const hoverScale = 1.05;

  const currentRotationY = isHovered ? hoverRotationY : baseRotationY;
  const currentRotationX = isHovered ? hoverRotationX : baseRotationX;
  const currentScale = isHovered ? hoverScale : 1;

  // Responsive sizing
  const width = isMobile ? 150 : 190;
  const height = isMobile ? 240 : 300;

  return (
    <div 
      ref={nodeRef}
      className={`absolute standing-panel glass-card border rounded-none transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden group cursor-pointer pointer-events-auto ${
        isActive ? 'border-accent/60' : 'border-node-border/20'
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        width,
        height,
        transformOrigin: 'center bottom', 
        transform: `translate3d(${position.x.toFixed(2)}px, ${position.y.toFixed(2)}px, ${position.z.toFixed(2)}px) rotateY(${currentRotationY}deg) rotateX(${currentRotationX}deg) scale(${currentScale})`,
        zIndex: isHovered ? 20000 : zIndex,
        boxShadow: isHovered || isActive
            ? `0 40px 80px rgba(0, 0, 0, 0.3), 0 0 30px rgba(16, 185, 129, 0.1)`
            : `5px 5px 25px rgba(0, 0, 0, 0.05)`,
      }}
      onClick={handleMaximize}
    >
      {/* Visual Content */}
      <div className="absolute inset-0 bg-neutral-100 dark:bg-zinc-950 pointer-events-none">
        <img 
          src={data.media?.url} 
          alt={data.title} 
          className="w-full h-full object-cover opacity-80 dark:opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-linear-to from-white dark:from-black via-transparent to-transparent opacity-90" />
      </div>

      {/* Info Overlay */}
      <div className="absolute inset-0 p-3 md:p-4 flex flex-col justify-end pointer-events-none">
        <div className={`space-y-0.5 md:space-y-1 transition-transform duration-700 ${isHovered ? '-translate-y-1' : ''}`}>
          <div className="flex items-center gap-1.5 opacity-80">
            <span className="text-[6px] md:text-[7px] font-mono font-bold tracking-[0.4em] uppercase text-accent">
              MOD_{data.id.split('-')[1] || '0X'}
            </span>
          </div>
          <h3 className="text-xs md:text-sm font-black uppercase leading-tight text-neutral-900 dark:text-white group-hover:text-accent transition-colors tracking-tight">
            {data.title}
          </h3>
        </div>
      </div>

      {/* Shine Sweep on Hover */}
      <div className={`absolute inset-0 bg-linear-to from-transparent via-white/20 dark:via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none`} />
      
      {/* Sharp Border Overlay */}
      <div className="absolute inset-0 border border-black/5 dark:border-white/10 pointer-events-none" />
    </div>
  );
};

export default React.memo(Node);
