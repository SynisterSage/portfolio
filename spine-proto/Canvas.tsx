
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { NodeData } from '../types';
import Node from './Node';
import FullScreenView from './FullScreenView';

interface CanvasProps {
  nodes: NodeData[];
  activeNodeId: string | null;
  onNavigate: (id: string) => void;
  shouldPlayIntro: boolean;
  onIntroComplete: () => void;
}

const Canvas: React.FC<CanvasProps> = ({ nodes, activeNodeId, onNavigate, shouldPlayIntro, onIntroComplete }) => {
  const [time, setTime] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [maximizedNodeId, setMaximizedNodeId] = useState<string | null>(null);
  const [initialRect, setInitialRect] = useState<DOMRect | null>(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(performance.now());
  const currentSpeed = useRef<number>(0.12);
  const timeRef = useRef<number>(0);
  const dragStartRef = useRef<{ x: number; time: number } | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const projectNodes = useMemo(() => nodes.filter(n => n.type === 'project'), [nodes]);
  
  // Slightly denser spacing on mobile
  const CARD_SPACING = windowSize.width < 768 ? 220 : 280; 
  const TOTAL_TRACK_WIDTH = projectNodes.length * CARD_SPACING;

  const animate = useCallback((t: number) => {
    const delta = Math.min(t - lastTimeRef.current, 32); 
    lastTimeRef.current = t;

    if (!isDragging) {
      const targetSpeed = maximizedNodeId ? 0 : (isHovered ? 0.04 : 0.12);
      currentSpeed.current += (targetSpeed - currentSpeed.current) * 0.05;

      if (Math.abs(currentSpeed.current) > 0.0001) {
        timeRef.current = (timeRef.current + delta * currentSpeed.current) % TOTAL_TRACK_WIDTH;
        if (timeRef.current < 0) timeRef.current += TOTAL_TRACK_WIDTH;
        setTime(timeRef.current);
      }
    }
    
    requestRef.current = requestAnimationFrame(animate);
  }, [isHovered, isDragging, maximizedNodeId, TOTAL_TRACK_WIDTH]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [animate]);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (maximizedNodeId) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setIsDragging(true);
    dragStartRef.current = { x: clientX, time: timeRef.current };
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !dragStartRef.current || maximizedNodeId) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const dx = clientX - dragStartRef.current.x;
    
    const SENSITIVITY = 1.0;
    let newTime = (dragStartRef.current.time - dx * SENSITIVITY) % TOTAL_TRACK_WIDTH;
    if (newTime < 0) newTime += TOTAL_TRACK_WIDTH;
    
    timeRef.current = newTime;
    setTime(newTime);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  const handleMaximize = (id: string, rect: DOMRect) => {
    setInitialRect(rect);
    setMaximizedNodeId(id);
    setIsDragging(false);
    setIsHovered(false);
  };

  const maximizedNodeData = maximizedNodeId ? nodes.find(n => n.id === maximizedNodeId) : null;

  return (
    <div 
      className={`relative w-full h-full overflow-hidden bg-canvas-bg perspective-stage select-none ${isDragging ? 'cursor-grabbing' : 'cursor-default'}`}
      onMouseLeave={() => { setIsDragging(false); }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
    >
      {/* Glare and ribbon sit deep in background */}
      <div className="glare-overlay" />
      <div className="spine-ribbon" />

      {/* Subtle Integrated Background Typography - Responsive Font Size */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 select-none">
        <h1 className="mega-type text-[40vw] md:text-[30vw] text-primary opacity-[0.03] md:opacity-[0.03] tracking-[-0.05em] translate-y-[-10vh] md:translate-x-[-10vw]">
          2025
        </h1>
      </div>

      {/* 3D Spine Container - Elevated above the ribbon */}
      <div className="absolute inset-0 isometric-world pointer-events-none">
        {projectNodes.map((node, i) => {
          const focusCenter = windowSize.width * (windowSize.width < 768 ? 0.35 : 0.45);
          const OFFSET_BUFFER = 1200; 

          let x = (i * CARD_SPACING - time);
          let xPos = ((x % TOTAL_TRACK_WIDTH) + TOTAL_TRACK_WIDTH) % TOTAL_TRACK_WIDTH;
          xPos -= (OFFSET_BUFFER / 2);

          const distanceFromFocus = Math.abs(xPos - focusCenter);
          
          const position = {
            x: xPos,
            y: xPos * 0.22 + (windowSize.height * (windowSize.width < 768 ? 0.4 : 0.3)), // Responsive slope
            z: -distanceFromFocus * (windowSize.width < 768 ? 0.3 : 0.2) // Increased depth on mobile
          };

          const isVisible = xPos > -OFFSET_BUFFER && xPos < windowSize.width + OFFSET_BUFFER;

          return (
            <Node 
              key={`${node.id}-${i}`} 
              data={node} 
              position={position}
              zIndex={Math.floor(10000 - distanceFromFocus)}
              isActive={isVisible && distanceFromFocus < (windowSize.width < 768 ? 80 : 150)}
              isVisible={isVisible}
              onMaximize={handleMaximize}
              onHoverChange={setIsHovered}
            />
          );
        })}
      </div>

      {/* Overlays */}
      {maximizedNodeId && maximizedNodeData && initialRect && (
          <div className="absolute inset-0 z-100">
              <FullScreenView 
                data={maximizedNodeData} 
                initialRect={initialRect}
                onRestore={() => setMaximizedNodeId(null)}
                onClose={() => setMaximizedNodeId(null)}
              />
          </div>
      )}
    </div>
  );
};

export default Canvas;
