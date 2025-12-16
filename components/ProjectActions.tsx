import React, { useEffect, useRef, useState } from 'react';
import { Heart, Share2, Check } from 'lucide-react';

interface ProjectActionsProps {
  projectId: string;
  initialLikes?: number;
  projectTitle?: string;
  className?: string;
}

const ProjectActions: React.FC<ProjectActionsProps> = ({ projectId, initialLikes = 0, projectTitle, className = '' }) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied' | 'shared' | 'error'>('idle');
  const [isPulsing, setIsPulsing] = useState(false);
  const statusTimer = useRef<number | null>(null);
  const pulseTimer = useRef<number | null>(null);

  const LIKE_COUNT_KEY = `project-like-count-${projectId}`;
  const LIKED_STATE_KEY = `project-liked-${projectId}`;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedCount = window.localStorage.getItem(LIKE_COUNT_KEY);
    const storedLiked = window.localStorage.getItem(LIKED_STATE_KEY);
    const hasStoredCount = storedCount !== null && !Number.isNaN(Number(storedCount));
    const shouldUseSeed =
      !hasStoredCount ||
      (storedCount === '0' && storedLiked !== 'true' && initialLikes > 0 && initialLikes !== Number(storedCount));
    const baseCount = shouldUseSeed ? initialLikes : Number(storedCount);
    setLikes(baseCount);
    setLiked(storedLiked === 'true');
    window.localStorage.setItem(LIKE_COUNT_KEY, `${baseCount}`);
    window.localStorage.setItem(LIKED_STATE_KEY, `${storedLiked === 'true'}`);
  }, [LIKE_COUNT_KEY, LIKED_STATE_KEY, initialLikes]);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!liked) {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 1000);
    }

    setLiked(!liked);
    setLikes(prev => {
      const next = liked ? prev - 1 : prev + 1;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(LIKE_COUNT_KEY, `${next}`);
        window.localStorage.setItem(LIKED_STATE_KEY, `${!liked}`);
      }
      return next;
    });
  };

  const scheduleReset = () => {
    if (statusTimer.current) {
      window.clearTimeout(statusTimer.current);
    }
    statusTimer.current = window.setTimeout(() => setShareStatus('idle'), 2000);
  };

  const triggerPulse = () => {
    if (pulseTimer.current) {
      window.clearTimeout(pulseTimer.current);
    }
    setIsPulsing(true);
    pulseTimer.current = window.setTimeout(() => setIsPulsing(false), 600);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    triggerPulse();

    const shareUrl = `${window.location.origin}/?project=${projectId}`;
    const shareText = projectTitle ? `Check out ${projectTitle} on Spatial Dev Portfolio.` : 'Check out this project on Spatial Dev Portfolio.';
    const sharePayload = {
      title: projectTitle ? `${projectTitle} · Spatial Dev Portfolio` : 'Spatial Dev Portfolio',
      text: shareText,
      url: shareUrl,
    };

    const canShare = typeof navigator !== 'undefined' && !!navigator.share;
    const canCopy = typeof navigator !== 'undefined' && !!navigator.clipboard;

    const updateStatus = (status: 'copied' | 'shared' | 'error') => {
      setShareStatus(status);
      scheduleReset();
    };

    try {
      if (canShare) {
        await navigator.share(sharePayload);
        updateStatus('shared');
      } else if (canCopy) {
        await navigator.clipboard.writeText(shareUrl);
        updateStatus('copied');
      } else {
        updateStatus('error');
      }
    } catch (error: any) {
      const errName = error?.name;
      if (errName === 'AbortError' || errName === 'NotAllowedError') {
        return;
      }
      console.error('Share failed', error);
      if (canCopy) {
        await navigator.clipboard.writeText(shareUrl);
        updateStatus('copied');
      } else {
        updateStatus('error');
      }
    }
  };

  useEffect(() => {
    return () => {
      if (statusTimer.current) {
        window.clearTimeout(statusTimer.current);
      }
      if (pulseTimer.current) {
        window.clearTimeout(pulseTimer.current);
      }
    };
  }, []);

  const buttonClasses = [
    'relative overflow-visible flex items-center gap-1.5 rounded px-2 py-1.5 text-xs font-mono transition-colors group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
    shareStatus === 'error'
      ? 'text-amber-400'
      : shareStatus === 'idle'
        ? 'text-secondary hover:text-primary'
        : 'text-accent'
  ].join(' ');

  return (
    <div className={`flex items-center gap-4 ${className}`} onClick={e => e.stopPropagation()}>
      <button 
        onClick={handleLike}
        className={`flex items-center gap-1.5 text-xs font-mono transition-colors group relative ${liked ? 'text-rose-500' : 'text-secondary hover:text-rose-500'}`}
        title={liked ? "Unlike" : "Like"}
      >
        <div className="relative">
            <Heart 
                size={16} 
                className={`transition-all duration-300 ${liked ? 'fill-current scale-110' : 'group-hover:scale-110'}`} 
            />
            {isAnimating && (
                 <span className="absolute inset-0 animate-ping opacity-75 rounded-full bg-rose-400/50" />
            )}
        </div>
        <span className="tabular-nums">{likes}</span>
      </button>

      <button 
        onClick={handleShare}
        className={buttonClasses}
        title={
          shareStatus === 'copied'
            ? 'Link copied'
            : shareStatus === 'shared'
              ? 'Shared successfully'
              : shareStatus === 'error'
                ? 'Share failed'
                : 'Share project'
        }
      >
        {isPulsing && (
          <span className="absolute inset-0 rounded-full bg-accent/30 animate-ping pointer-events-none" />
        )}
        <span className="relative z-10 flex items-center gap-1">
          {(shareStatus === 'copied' || shareStatus === 'shared') ? (
            <Check size={16} className="text-accent animate-pulse" />
          ) : (
            <span className="relative">
              <Share2 size={16} className="group-hover:-translate-y-0.5 transition-transform duration-300" />
              {shareStatus === 'error' && (
                <span className="absolute inset-0 rounded-full bg-amber-500/10 animate-ping" />
              )}
            </span>
          )}
        </span>
      </button>
    </div>
  );
};

export default ProjectActions;
