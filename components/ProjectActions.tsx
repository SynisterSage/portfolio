import React, { useState } from 'react';
import { Heart, Share2, Check } from 'lucide-react';

interface ProjectActionsProps {
  projectId: string;
  initialLikes?: number;
  className?: string;
}

const ProjectActions: React.FC<ProjectActionsProps> = ({ projectId, initialLikes = 0, className = '' }) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes || Math.floor(Math.random() * 50) + 10);
  const [copied, setCopied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!liked) {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 1000);
    }

    setLiked(!liked);
    setLikes(prev => liked ? prev - 1 : prev + 1);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Mock share functionality - copy current URL with project ID
    try {
        const url = `${window.location.origin}/?project=${projectId}`;
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    } catch (err) {
        console.error("Share failed", err);
    }
  };

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
        className={`flex items-center gap-1.5 text-xs font-mono transition-colors group ${copied ? 'text-accent' : 'text-secondary hover:text-primary'}`}
        title="Copy Link"
      >
        {copied ? (
            <Check size={16} className="animate-in zoom-in duration-200" />
        ) : (
            <Share2 size={16} className="group-hover:-translate-y-0.5 transition-transform duration-300" />
        )}
      </button>
    </div>
  );
};

export default ProjectActions;