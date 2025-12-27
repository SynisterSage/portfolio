
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CanvasState, NodeData } from '../types';
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
  // Camera State
  const [camera, setCamera] = useState<CanvasState>({ x: 0, y: 0, scale: 1 });
  
  // Intro State
  const [bootState, setBootState] = useState<'idle' | 'scanning' | 'complete'>(shouldPlayIntro ? 'scanning' : 'complete');
  const [bootedIds, setBootedIds] = useState<Set<string>>(new Set());

  // Refs for high-frequency updates
  const cameraRef = useRef(camera);
  const nodePositionsRef = useRef<Record<string, { x: number, y: number }>>({}); 
  
  const clampScale = (value: number) => Math.min(Math.max(value, 0.1), 6);

  const dragRef = useRef({
    isDragging: false,
    isDraggingNode: false,
    draggedNodeId: null as string | null,
    startX: 0,
    startY: 0,
    initialNodeX: 0,
    initialNodeY: 0,
    initialCameraX: 0,
    initialCameraY: 0,
    hasMoved: false
  });
  const pinchRef = useRef({
    isPinching: false,
    initialDistance: 0,
    initialScale: 1
  });
  
  // Sync Ref with State
  useEffect(() => {
    cameraRef.current = camera;
  }, [camera]);

  const [isAnimating, setIsAnimating] = useState(false);

  // Window Manager State
  const [openNodes, setOpenNodes] = useState<string[]>([]);
  const [closingNodes, setClosingNodes] = useState<Set<string>>(new Set());
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number, y: number }>>({});
  const [nodeZIndices, setNodeZIndices] = useState<Record<string, number>>({});
  const [highestZ, setHighestZ] = useState(10);
  
  // Full Screen State
  const [maximizedNode, setMaximizedNode] = useState<{ id: string; initialRect: DOMRect } | null>(null);
  const maximizedStackRef = useRef<{ id: string; initialRect: DOMRect }[]>([]);
  const [restoringId, setRestoringId] = useState<string | null>(null);

  // Sync nodePositionsRef
  useEffect(() => {
    nodePositionsRef.current = nodePositions;
  }, [nodePositions]);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const initialMount = useRef(true);

  // Initialize & Boot Sequence
  useEffect(() => {
    if (initialMount.current) {
        const isMobile = window.innerWidth < 768;
        const isTablet = window.innerWidth >= 768 && window.innerWidth < 1280;

        // Initialize positions using the constants (Desktop Layout)
        const initialPos: Record<string, { x: number, y: number }> = {};
        nodes.forEach(node => {
            initialPos[node.id] = { ...node.position };
        });
        setNodePositions(initialPos);

        let initialX = 0;
        let initialY = 0;
        let initialScale = 1;

        if (isMobile || isTablet) {
            // --- Mobile/Tablet Strategy: Focus on Hero Node ---
            const heroNode = nodes.find(n => n.id === 'hero') || nodes[0];
            const heroPos = initialPos[heroNode.id];
            
            // Estimated dimensions for centering
            const heroW = heroNode.width || 400;
            const heroH = 550; // Approx visual height
            
            // Start zoomed in significantly so text is readable
            // Hero width is 650. Mobile width ~375.
            // 0.8 scale = ~520px visual width. User pans slightly to read.
            // This is better than fitting 100% and text being tiny.
            const targetScale = isMobile ? 0.8 : 0.9;
            
            const centerX = heroPos.x + (heroW / 2);
            const centerY = heroPos.y + (heroH / 2);
            
            initialX = (window.innerWidth / 2) - (centerX * targetScale);
            initialY = (window.innerHeight / 2) - (centerY * targetScale);
            initialScale = targetScale;
        } else {
            // --- Desktop Strategy: Fit Content Grid ---
            const visibleNodes = nodes.filter(n => !n.hidden);
            let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

            visibleNodes.forEach(node => {
                const x = node.position.x;
                const y = node.position.y;
                const w = node.width || 400;
                let h = 400; 
                if (node.type === 'project-hub' || node.type === 'experience-hub') h = 500;
                if (node.type === 'bio') h = 600; 

                if (x < minX) minX = x;
                if (y < minY) minY = y;
                if ((x + w) > maxX) maxX = x + w;
                if ((y + h) > maxY) maxY = y + h;
            });

            // Fallback
            if (minX === Infinity) { minX = 0; maxX = 1000; minY = 0; maxY = 800; }

            const gridCenterX = (minX + maxX) / 2;
            const gridCenterY = (minY + maxY) / 2;

            const padding = 100;
            const availableWidth = window.innerWidth - (padding * 2);
            const availableHeight = window.innerHeight - (padding * 2);
            const contentWidth = maxX - minX;
            const contentHeight = maxY - minY;

            let calculatedScale = Math.min(availableWidth / contentWidth, availableHeight / contentHeight);
            initialScale = Math.min(Math.max(calculatedScale, 0.45), 0.9);

            initialX = (window.innerWidth / 2) - (gridCenterX * initialScale);
            initialY = (window.innerHeight / 2) - (gridCenterY * initialScale);
        }

        if (!shouldPlayIntro) {
            setCamera({ x: initialX, y: initialY, scale: initialScale });
            initialMount.current = false;
            return;
        }

        // Run Intro Sequence
        setIsAnimating(true);
        setBootState('scanning');
        setBootedIds(new Set()); 

        const sequence = [
            { id: 'hero', label: 'IDENTITY_CORE' },
            { id: 'skills', label: 'TECH_STACK' },
            { id: 'projects-hub', label: 'PROJECT_INDEX' },
            { id: 'experience-hub', label: 'EXPERIENCE_LOGS' },
            { id: 'contact', label: 'COMM_LINK' },
        ];

        let step = 0;
        
        const flyToNode = (id: string) => {
             const node = nodes.find(n => n.id === id);
             const pos = initialPos[id];
             if (node && pos) {
                 const nodeWidth = node.width || 400;
                 const nodeHeight = 400; 
                 // Zoom in closer during tour on mobile to read the specific card
                 const scale = isMobile ? 0.85 : 1.1;
                 const targetX = (window.innerWidth / 2) - ((pos.x + nodeWidth/2) * scale);
                 const targetY = (window.innerHeight / 2) - ((pos.y + nodeHeight/2) * scale);
                 setCamera({ x: targetX, y: targetY, scale });
             }
        };

        const runStep = () => {
            if (step >= sequence.length) {
                // Final Step: Zoom out to the calculated Initial State (Hero focus on mobile, Grid on desktop)
                setCamera({ x: initialX, y: initialY, scale: initialScale });
                
                setTimeout(() => {
                    setBootState('complete');
                    setIsAnimating(false);
                    onIntroComplete();
                }, 800);
                return;
            }

            const target = sequence[step];
            
            setBootedIds(prev => {
                const next = new Set(prev);
                next.add(target.id);
                return next;
            });

            flyToNode(target.id);
            
            step++;
            setTimeout(runStep, 600);
        };
        
        runStep();
        initialMount.current = false;
    }
  }, [nodes, shouldPlayIntro, onIntroComplete]);

  // --- Window Management ---

  const handleFocusNode = useCallback((id: string) => {
    setHighestZ(prevHigh => {
        const newHigh = prevHigh + 1;
        setNodeZIndices(prevIndices => ({ 
            ...prevIndices, 
            [id]: newHigh 
        }));
        return newHigh;
    });
  }, []);

  const handleOpenProject = useCallback((id: string) => {
    if (!openNodes.includes(id)) {
        setOpenNodes(prev => [...prev, id]);
        
        const targetNode = nodes.find(n => n.id === id);
        
        if (targetNode?.hidden) {
             const hubId = 'projects-hub';
             const hubPos = nodePositionsRef.current[hubId] || nodes.find(n => n.id === hubId)?.position || { x: 0, y: 0 };
             
             const randomX = 40 + (Math.random() * 40); 
             const randomY = 40 + (Math.random() * 40);
             
             setNodePositions(prev => ({
                 ...prev,
                 [id]: {
                     x: hubPos.x + randomX,
                     y: hubPos.y + randomY
                 }
             }));
        }
    }
    handleFocusNode(id);
  }, [openNodes, handleFocusNode, nodes]);

  const popPreviousMaximized = useCallback(() => {
    const stack = maximizedStackRef.current;
    const previous = stack[stack.length - 1] || null;
    maximizedStackRef.current = previous ? stack.slice(0, -1) : [];
    return previous;
  }, []);

  const handleCloseProject = useCallback((id: string) => {
    const node = nodes.find(n => n.id === id);
    const isPermanent = !node?.hidden;

    // Remove any stale references in the stack
    maximizedStackRef.current = maximizedStackRef.current.filter(item => item.id !== id);

    if (isPermanent) {
        setOpenNodes(prev => prev.filter(n => n !== id));

        if (maximizedNode?.id === id) {
            const previous = popPreviousMaximized();
            if (previous) {
                setMaximizedNode(previous);
                return;
            }
        }

        setMaximizedNode(prev => prev?.id === id ? null : prev);
        return;
    }

    // For project overlays, closing should exit fully (no reopening the last item)
    maximizedStackRef.current = [];

    setClosingNodes(prev => new Set(prev).add(id));
    
    setTimeout(() => {
        setOpenNodes(prev => prev.filter(n => n !== id));
        setClosingNodes(prev => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });
        
        if (maximizedNode?.id === id) {
            setMaximizedNode(null);
        } else {
            setMaximizedNode(prev => prev?.id === id ? null : prev);
        }
    }, 300);
  }, [nodes, maximizedNode, popPreviousMaximized]);

  const handleMaximize = useCallback((id: string, rect: DOMRect) => {
    handleOpenProject(id);
    setMaximizedNode(prev => {
      if (prev && prev.id !== id) {
        maximizedStackRef.current = [...maximizedStackRef.current.filter(item => item.id !== id), prev];
      }
      return { id, initialRect: rect };
    });
  }, [handleOpenProject]);

  const handleRestore = useCallback(() => {
    if (!maximizedNode) return;
    
    const previous = popPreviousMaximized();
    setRestoringId(maximizedNode.id);
    setMaximizedNode(previous || null);
    setTimeout(() => setRestoringId(null), 100);
  }, [maximizedNode, popPreviousMaximized]);


  // --- Fly To Animation ---

  useEffect(() => {
    if (!activeNodeId) return;
    if (bootState === 'scanning') return; 

    const targetNode = nodes.find(n => n.id === activeNodeId);
    if (targetNode?.hidden && !openNodes.includes(activeNodeId)) {
        handleOpenProject(activeNodeId);
        return; 
    }

    const currentPos = nodePositionsRef.current[activeNodeId] || targetNode?.position || { x: 0, y: 0 };
    
    const isMobile = window.innerWidth < 768;
    // On mobile, zoom in closer to read the specific node
    let targetScale = isMobile ? 0.8 : 1; 

    if (activeNodeId === 'projects-hub' || activeNodeId === 'experience-hub') {
        targetScale = isMobile ? 0.75 : 0.85;
    }

    const nodeWidth = targetNode?.width || 400;
    let nodeHeight = 400;
    if (targetNode?.type === 'project-hub') nodeHeight = 500;
    if (targetNode?.type === 'experience-hub') nodeHeight = 500;
    if (targetNode?.type === 'bio') nodeHeight = 600;
    if (targetNode?.type === 'project') nodeHeight = 500;

    const nodeCenterX = currentPos.x + (nodeWidth / 2);
    const nodeCenterY = currentPos.y + (nodeHeight / 2);

    const targetX = (window.innerWidth / 2) - (nodeCenterX * targetScale);
    const targetY = (window.innerHeight / 2) - (nodeCenterY * targetScale);

    setIsAnimating(true);
    setCamera({ x: targetX, y: targetY, scale: targetScale });
    handleFocusNode(activeNodeId);
    
    const timer = setTimeout(() => setIsAnimating(false), 800);
    return () => clearTimeout(timer);

  }, [activeNodeId, nodes, openNodes, handleOpenProject, handleFocusNode, bootState]);

  // --- Interaction Logic ---

  const handleStart = (clientX: number, clientY: number, nodeId?: string) => {
    if (maximizedNode || bootState === 'scanning') return;

    dragRef.current.isDragging = true;
    dragRef.current.startX = clientX;
    dragRef.current.startY = clientY;
    dragRef.current.hasMoved = false;
    setIsAnimating(false);

    if (nodeId) {
        setDraggingId(nodeId);
        dragRef.current.isDraggingNode = true;
        dragRef.current.draggedNodeId = nodeId;
        handleFocusNode(nodeId);
        
        const nodePos = nodePositionsRef.current[nodeId] || nodes.find(n => n.id === nodeId)?.position || { x: 0, y: 0 };
        dragRef.current.initialNodeX = nodePos.x;
        dragRef.current.initialNodeY = nodePos.y;
    } else {
        dragRef.current.isDraggingNode = false;
        dragRef.current.draggedNodeId = null;
        
        dragRef.current.initialCameraX = cameraRef.current.x;
        dragRef.current.initialCameraY = cameraRef.current.y;
    }
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!dragRef.current.isDragging) return;

    const dx = clientX - dragRef.current.startX;
    const dy = clientY - dragRef.current.startY;

    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        dragRef.current.hasMoved = true;
    }

    if (dragRef.current.isDraggingNode && dragRef.current.draggedNodeId) {
        const nodeId = dragRef.current.draggedNodeId;
        const currentScale = cameraRef.current.scale;
        
        const newX = dragRef.current.initialNodeX + (dx / currentScale);
        const newY = dragRef.current.initialNodeY + (dy / currentScale);

        setNodePositions(prev => ({
            ...prev,
            [nodeId]: { x: newX, y: newY }
        }));
    } else {
        setCamera({
            ...cameraRef.current,
            scale: cameraRef.current.scale,
            x: dragRef.current.initialCameraX + dx,
            y: dragRef.current.initialCameraY + dy
        });
    }
  };

  const handleEnd = () => {
    if (dragRef.current.isDraggingNode && !dragRef.current.hasMoved && dragRef.current.draggedNodeId) {
        onNavigate(dragRef.current.draggedNodeId);
    }
    
    setDraggingId(null);

    dragRef.current.isDragging = false;
    dragRef.current.isDraggingNode = false;
    dragRef.current.draggedNodeId = null;
  };

  type TouchListLike = ArrayLike<{ clientX: number; clientY: number }>;

  const getDistanceBetweenTouches = (touches: TouchListLike) => {
    if (touches.length < 2) return 0;
    const touchA = touches[0];
    const touchB = touches[1];
    const dx = touchA.clientX - touchB.clientX;
    const dy = touchA.clientY - touchB.clientY;
    return Math.hypot(dx, dy);
  };

  const cancelPinch = () => {
    pinchRef.current.isPinching = false;
    pinchRef.current.initialDistance = 0;
  };

  const handlePinchStart = (touches: TouchListLike) => {
    if (touches.length < 2) return;
    pinchRef.current.isPinching = true;
    pinchRef.current.initialDistance = getDistanceBetweenTouches(touches);
    pinchRef.current.initialScale = cameraRef.current.scale;
  };

  const handlePinchMove = (touches: TouchListLike) => {
    if (!pinchRef.current.isPinching || touches.length < 2) return;
    const distance = getDistanceBetweenTouches(touches);
    if (pinchRef.current.initialDistance === 0) return;

    const scaleFactor = distance / pinchRef.current.initialDistance;
    const targetScale = clampScale(pinchRef.current.initialScale * scaleFactor);

    const focusX = (touches[0].clientX + touches[1].clientX) / 2;
    const focusY = (touches[0].clientY + touches[1].clientY) / 2;

    const currentCam = cameraRef.current;
    const worldFocusX = (focusX - currentCam.x) / currentCam.scale;
    const worldFocusY = (focusY - currentCam.y) / currentCam.scale;

    const nextX = focusX - worldFocusX * targetScale;
    const nextY = focusY - worldFocusY * targetScale;

    setCamera({
      x: nextX,
      y: nextY,
      scale: targetScale
    });
  };

  const handleWheel = useCallback((e: WheelEvent) => {
    if (maximizedNode || bootState === 'scanning') return;

    if (e.ctrlKey || e.metaKey) {
      e.preventDefault(); 
      
      const currentScale = cameraRef.current.scale;
      let sensitivity = 0.001;
      if (e.deltaMode === 0) {
        sensitivity = 0.01;
      } else {
        sensitivity = 0.002;
      }
      
      const delta = -e.deltaY * sensitivity;
      const newScale = clampScale(currentScale + delta);
      
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;
          
          const worldX = (mouseX - cameraRef.current.x) / currentScale;
          const worldY = (mouseY - cameraRef.current.y) / currentScale;

          const newCamX = mouseX - worldX * newScale;
          const newCamY = mouseY - worldY * newScale;

          setCamera({ x: newCamX, y: newCamY, scale: newScale });
      }
      return;
    }

    const target = e.target as HTMLElement;
    if (target.closest('.custom-scroll')) {
        return;
    }

    e.preventDefault();
    setCamera(prev => ({
        ...prev,
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY
    }));
  }, [maximizedNode, bootState]); 

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
        container.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => container?.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  const handleTouchStartWrapper = (e: React.TouchEvent<HTMLDivElement>) => {
    if (maximizedNode || bootState === 'scanning') return;
    if (e.touches.length === 2) {
      e.preventDefault();
      handlePinchStart(e.touches);
      return;
    }
    if (e.touches.length === 1) {
      cancelPinch();
      const touch = e.touches[0];
      handleStart(touch.clientX, touch.clientY);
    }
  };

  const handleTouchMoveWrapper = (e: React.TouchEvent<HTMLDivElement>) => {
    if (maximizedNode || bootState === 'scanning') return;
    if (e.touches.length >= 2) {
      e.preventDefault();
      handlePinchMove(e.touches);
      return;
    }
    if (e.touches.length === 1) {
      e.preventDefault();
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    }
  };

  const handleTouchEndWrapper = (e: React.TouchEvent<HTMLDivElement>) => {
    if (pinchRef.current.isPinching && e.touches.length < 2) {
      cancelPinch();
    }
    if (e.touches.length === 0) {
      handleEnd();
    }
  };

  const handleTouchCancelWrapper = (e: React.TouchEvent<HTMLDivElement>) => {
    if (pinchRef.current.isPinching) {
      cancelPinch();
    }
    handleEnd();
  };

  const onNodeDragStart = (id: string, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    let clientX, clientY;
    if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = (e as React.MouseEvent).clientX;
        clientY = (e as React.MouseEvent).clientY;
    }
    handleStart(clientX, clientY, id);
  };

  const visibleNodes = nodes.filter(n => !n.hidden || openNodes.includes(n.id));
  const maximizedNodeData = maximizedNode ? nodes.find(n => n.id === maximizedNode.id) : null;

  return (
    <div 
      ref={containerRef}
    className={`relative w-full h-full overflow-hidden bg-canvas-bg cursor-grab active:cursor-grabbing touch-none transition-colors duration-300`}
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleTouchStartWrapper}
      onTouchMove={handleTouchMoveWrapper}
      onTouchEnd={handleTouchEndWrapper}
      onTouchCancel={handleTouchCancelWrapper}
    >
      {/* Background Dot Pattern */}
      <div 
        className="absolute inset-0 grid-pattern pointer-events-none opacity-40"
        style={{
          backgroundPosition: `${camera.x}px ${camera.y}px`,
          backgroundSize: `${24 * camera.scale}px ${24 * camera.scale}`
        }}
      />

      {/* World Content */}
      <div 
        className={`absolute origin-top-left will-change-transform ${isAnimating ? 'transition-transform duration-500 cubic-bezier(0.25, 1, 0.5, 1)' : ''}`}
        style={{
          transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.scale})`
        }}
      >
        {visibleNodes.map(node => (
          <Node 
            key={node.id} 
            data={node} 
            scale={camera.scale}
            position={nodePositions[node.id] || node.position}
            zIndex={nodeZIndices[node.id] || 1}
            isActive={nodeZIndices[node.id] === highestZ}
            isMaximized={maximizedNode?.id === node.id}
            isVisible={bootState === 'complete' || bootedIds.has(node.id)}
            isClosing={closingNodes.has(node.id)}
            isDragging={draggingId === node.id}
            isRestoring={restoringId === node.id}
            onNavigate={onNavigate}
            onOpenProject={handleOpenProject}
            onClose={handleCloseProject}
            onDragStart={onNodeDragStart}
            onFocus={handleFocusNode}
            onMaximize={handleMaximize}
          />
        ))}
        
        {/* Decorative lines */}
        <svg 
            className={`absolute top-0 left-0 w-0 h-0 overflow-visible pointer-events-none opacity-10 dark:opacity-20 transition-opacity duration-1000 ${bootState === 'complete' ? 'opacity-10 dark:opacity-20' : 'opacity-0'}`}
        >
            <path d={`M 300 300 L 800 -200`} stroke="currentColor" className="text-accent" strokeWidth="2" fill="none" />
            <path d={`M 300 300 L 1500 500`} stroke="currentColor" className="text-accent" strokeWidth="2" fill="none" />
            <path d={`M 300 300 L -200 800`} stroke="currentColor" className="text-accent" strokeWidth="2" fill="none" />
        </svg>
      </div>

      {/* Full Screen Overlay */}
      {maximizedNode && maximizedNodeData && (
          <div className="absolute inset-0 z-50">
              <FullScreenView 
                key={maximizedNode.id} 
                data={maximizedNodeData} 
                initialRect={maximizedNode.initialRect}
                onRestore={handleRestore}
                onClose={() => handleCloseProject(maximizedNode.id)}
                onMaximize={handleMaximize}
              />
          </div>
      )}
    </div>
  );
};

export default Canvas;
