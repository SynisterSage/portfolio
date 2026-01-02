import React, { CSSProperties, forwardRef, useEffect, useState } from 'react';
import { NodeData } from '../types';

interface SpineNodeProps {
  data: NodeData;
  onHoverChange?: (isHovered: boolean) => void;
  onMaximize?: (id: string, rect: DOMRect) => void;
}

const SpineNode = forwardRef<HTMLDivElement, SpineNodeProps>(
  ({ data, onHoverChange, onMaximize }, ref) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      setIsMobile(window.innerWidth < 768);
    }, []);

    const handlePointerEnter = () => {
      if (isMobile) return;
      onHoverChange?.(true);
    };

    const handlePointerLeave = () => {
      if (isMobile) return;
      onHoverChange?.(false);
    };

    const handleMaximize = (e: React.MouseEvent) => {
      e.stopPropagation();
      const rect =
        (e.currentTarget as HTMLDivElement | null)?.getBoundingClientRect() ??
        ((ref as any)?.current?.getBoundingClientRect?.() as DOMRect | undefined);
      if (onMaximize && rect) {
        onMaximize(data.id, rect);
      }
    };

    const handleMouseEnter = () => {
      if (isMobile) return;
      onHoverChange?.(true);
    };

    const handleMouseLeave = () => {
      if (isMobile) return;
      onHoverChange?.(false);
    };

    return (
      <div
        ref={ref}
        className="absolute pointer-events-auto spine-node"
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={handleMaximize}
        style={{ willChange: 'transform', pointerEvents: 'auto' }}
      >
        <div 
          className="inner-card w-full h-full standing-panel glass-card border rounded-xl overflow-hidden group cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] border-white/10"
          style={{
            transformOrigin: 'center bottom',
            willChange: 'transform, box-shadow',
            pointerEvents: 'auto'
          }}
        >
          {/* Visual Content */}
          <div className="absolute inset-0 bg-neutral-100 dark:bg-zinc-950 pointer-events-none">
            {data.media?.url ? (
              <img
                src={data.media.url}
                alt={data.title}
                className="w-full h-full object-cover opacity-80 dark:opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-secondary text-xs font-mono">
                {data.title}
              </div>
            )}
            <div className="absolute inset-0 bg-linear-to from-white/80 dark:from-black via-transparent to-transparent opacity-80" />
          </div>

          {/* Info Overlay */}
          <div className="absolute inset-0 p-3 md:p-4 flex flex-col justify-end pointer-events-none">
            <div className="space-y-0.5 md:space-y-1 transition-transform duration-700">
              <div className="flex items-center gap-1.5 opacity-80">
                <span className="text-[6px] md:text-[7px] font-mono font-bold tracking-[0.4em] uppercase text-emerald-500 dark:text-emerald-400">
                  MOD_{data.id.split('-')[1] || '0X'}
                </span>
              </div>
              <h3 className="text-xs md:text-sm font-black uppercase leading-tight text-neutral-900 dark:text-white group-hover:text-emerald-500 transition-colors tracking-tight">
                {data.title}
              </h3>
            </div>
          </div>

          <div className="absolute inset-0 border border-black/5 dark:border-white/10 pointer-events-none" />
        </div>
      </div>
    );
  }
);

SpineNode.displayName = 'SpineNode';

export default SpineNode;
