import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { NodeData } from '../types';
import SpineNode from './SpineNode';

interface SpineCanvasProps {
  nodes: NodeData[];
  onOpenProject: (id: string, rect: DOMRect) => void;
}

const SpineCanvas: React.FC<SpineCanvasProps> = ({ nodes, onOpenProject }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 1280, height: 720 });
  const [hoverId, setHoverId] = useState<string | null>(null);
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const innerRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(performance.now());
  const currentSpeed = useRef<number>(0.12);
  const timeRef = useRef<number>(0);
  // disable pointer-drag scrolling to avoid click conflicts

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const projectNodes = useMemo(() => nodes.filter(n => n.type === 'project'), [nodes]);

  const isMobile = windowSize.width < 640;
  const isTablet = windowSize.width < 1024;

  const CARD_SPACING = isMobile ? 200 : 260;
  const TOTAL_TRACK_WIDTH = Math.max(1, projectNodes.length * CARD_SPACING);
  const perspective = 2600;
  const baseRotateX = 32;
  const depthFactor = isMobile ? 0.26 : 0.2;
  const slopeFactor = isMobile ? 0.12 : isTablet ? 0.14 : 0.16;
  const baseYFactor = isMobile ? 0.5 : isTablet ? 0.46 : 0.44;
  const baseY = windowSize.height * baseYFactor;
  const stageTranslateY = `${windowSize.height * (isMobile ? -0.12 : isTablet ? -0.2 : -0.28)}px`;
  const focusCenter = windowSize.width * (isMobile ? 0.38 : 0.42);
  const OFFSET_BUFFER = 1200;
  const focusThreshold = isMobile ? 90 : 170;
  
  const animate = useCallback(
    (t: number) => {
      const delta = Math.min(t - lastTimeRef.current, 32);
      lastTimeRef.current = t;

      const targetSpeed = isHovered ? 0.04 : 0.12;
      currentSpeed.current += (targetSpeed - currentSpeed.current) * 0.05;

      if (Math.abs(currentSpeed.current) > 0.0001) {
        timeRef.current = (timeRef.current + delta * currentSpeed.current) % TOTAL_TRACK_WIDTH;
        if (timeRef.current < 0) timeRef.current += TOTAL_TRACK_WIDTH;
      }

      // Imperative transform updates for performance
      projectNodes.forEach((node, i) => {
        const el = nodeRefs.current[node.id];
        if (!el) return;

        let x = i * CARD_SPACING - timeRef.current;
        let xPos = ((x % TOTAL_TRACK_WIDTH) + TOTAL_TRACK_WIDTH) % TOTAL_TRACK_WIDTH;
        xPos -= OFFSET_BUFFER / 2;

        const distanceFromFocus = Math.abs(xPos - focusCenter);
        const position = {
          x: xPos,
          y: baseY + xPos * slopeFactor,
          z: -distanceFromFocus * depthFactor
        };

        const isHoveredLocal = hoverId === node.id;
        const isActive = distanceFromFocus < focusThreshold;

        const rotateY = isHoveredLocal ? -18 : -24;
        const rotateX = isHoveredLocal ? -4 : -8;
        const rotateZ = isHoveredLocal ? -10 : -12;
        const scale = isHoveredLocal ? 1.035 : 0.97;

        el.style.transformOrigin = 'center bottom';
        el.style.transform = `translate3d(${position.x.toFixed(2)}px, ${position.y.toFixed(2)}px, ${position.z.toFixed(2)}px) rotateZ(${rotateZ}deg) rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(${scale})`;
        el.style.zIndex = isHoveredLocal ? '30000' : `${Math.floor(10000 - distanceFromFocus)}`;
        const inner = innerRefs.current[node.id];
        if (inner) {
          inner.style.boxShadow = isHoveredLocal || isActive
            ? '0 16px 40px rgba(0,0,0,0.18)'
            : '0 6px 18px rgba(0,0,0,0.1)';
          inner.style.borderColor = isActive ? 'rgba(16,185,129,0.5)' : 'rgba(255,255,255,0.12)';
        }
      });

      requestRef.current = requestAnimationFrame(animate);
    },
    [isHovered, TOTAL_TRACK_WIDTH, windowSize, projectNodes, CARD_SPACING, hoverId, focusThreshold]
  );

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [animate]);

  return (
    <div
      className="relative w-full h-full overflow-hidden bg-canvas-bg perspective-stage select-none cursor-default"
    >
      <div className="glare-overlay" />
      <div className="spine-ribbon" />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 select-none">
        <h1 className="mega-type text-[40vw] md:text-[30vw] text-primary opacity-[0.03] md:opacity-[0.03] tracking-[-0.05em] translate-y-[-15vh] md:translate-x-[-10vw]">
          2025
        </h1>
      </div>

      <div
        className="absolute inset-0 isometric-world pointer-events-auto"
        style={{ perspective: `${perspective}px`, transform: `translateY(${stageTranslateY}) rotateX(${baseRotateX}deg)` }}
      >
        {projectNodes.map((node, i) => {
          let x = i * CARD_SPACING - timeRef.current;
          let xPos = ((x % TOTAL_TRACK_WIDTH) + TOTAL_TRACK_WIDTH) % TOTAL_TRACK_WIDTH;
          xPos -= OFFSET_BUFFER / 2;

          const distanceFromFocus = Math.abs(xPos - focusCenter);

          const position = {
            x: xPos,
            y: baseY + xPos * slopeFactor,
            z: -distanceFromFocus * depthFactor
          };

          const width = isMobile ? 140 : 210;
          const height = isMobile ? 260 : 380;
          const isHoveredLocal = hoverId === node.id;
          const rotateY = isHoveredLocal ? -18 : -24;
          const rotateX = isHoveredLocal ? -4 : -8;
          const rotateZ = isHoveredLocal ? -10 : -12;
          const scale = isHoveredLocal ? 1.04 : 0.97;

          const initialTransform = `translate3d(${position.x.toFixed(2)}px, ${position.y.toFixed(2)}px, ${position.z.toFixed(2)}px) rotateZ(${rotateZ}deg) rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(${scale})`;
          const initialZ = hoverId === node.id ? 30000 : Math.floor(10000 - distanceFromFocus);

          return (
            <SpineNode
              key={`${node.id}-${i}`}
              ref={(el) => {
                if (el) {
                  nodeRefs.current[node.id] = el;
                  el.style.transform = initialTransform;
                  el.style.width = `${width}px`;
                  el.style.height = `${height}px`;
                  el.style.zIndex = `${initialZ}`;
                  const inner = el.querySelector('.inner-card') as HTMLDivElement | null;
                  if (inner) innerRefs.current[node.id] = inner;
                } else {
                  delete nodeRefs.current[node.id];
                  delete innerRefs.current[node.id];
                }
              }}
              data={node}
              onMaximize={(id, rect) => onOpenProject(id, rect)}
              onHoverChange={(state) => {
                setIsHovered(state);
                setHoverId(state ? node.id : null);
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SpineCanvas;
