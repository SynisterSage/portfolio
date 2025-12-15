
import React, { useEffect, useState } from 'react';
import { X, Shield, Lock, FileText, CheckCircle2 } from 'lucide-react';

interface PolicyOverlayProps {
  onClose: () => void;
}

const PolicyOverlay: React.FC<PolicyOverlayProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation frame
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Match transition duration
  };

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 transition-all duration-300 ease-in-out ${
        isVisible ? 'bg-black/60 backdrop-blur-sm' : 'bg-transparent pointer-events-none'
      }`}
      onClick={handleClose}
    >
      <div 
        className={`w-full max-w-2xl bg-node-bg border border-node-border rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) ${
            isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-8'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="h-14 border-b border-node-border bg-node-header flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-2 text-primary font-bold font-mono tracking-tight">
                <Shield size={16} className="text-accent" />
                <span>SYSTEM PROTOCOLS // PRIVACY</span>
            </div>
            <button 
                onClick={handleClose}
                className="p-1.5 hover:bg-red-500/10 text-secondary hover:text-red-500 rounded-md transition-colors"
            >
                <X size={18} />
            </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto custom-scroll p-6 md:p-8 space-y-8">
            
            {/* Intro */}
            <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg flex gap-4">
                <CheckCircle2 size={24} className="text-accent shrink-0 mt-0.5" />
                <div className="space-y-1">
                    <h3 className="font-bold text-primary text-sm uppercase tracking-wide">Data Minimalist</h3>
                    <p className="text-sm text-secondary leading-relaxed">
                        This site is designed to be a portfolio, not a data harvester. I value your privacy because I value my own.
                    </p>
                </div>
            </div>

            {/* Section 1: Data Collection */}
            <section className="space-y-3">
                <h2 className="flex items-center gap-2 text-lg font-bold text-primary">
                    <Lock size={18} className="text-secondary" />
                    Data Collection
                </h2>
                <div className="pl-7 space-y-3 text-sm text-secondary leading-relaxed">
                    <p>
                        <strong>Contact Form:</strong> If you use the contact form, the name, email, and message you provide are sent directly to my inbox. This data is used solely to reply to your inquiry. It is not stored in a marketing database or sold to third parties.
                    </p>
                    <p>
                        <strong>Analytics:</strong> This site may use basic, anonymous analytics (like Vercel Analytics or plausible.io) to count visits. No personally identifiable information (PII) is tracked.
                    </p>
                </div>
            </section>

             <hr className="border-node-border" />

            {/* Section 3: Terms */}
            <section className="space-y-3">
                <h2 className="flex items-center gap-2 text-lg font-bold text-primary">
                    <FileText size={18} className="text-secondary" />
                    Terms of Use
                </h2>
                <div className="pl-7 text-sm text-secondary leading-relaxed">
                    <p>
                        The code for this portfolio is available for educational viewing. The visual assets (projects, images) remain the property of their respective owners. Please do not clone this site for commercial use without permission.
                    </p>
                </div>
            </section>

        </div>

        {/* Footer */}
        <div className="p-4 bg-node-header border-t border-node-border text-center">
            <p className="text-[10px] font-mono text-secondary uppercase tracking-widest">
                Last Updated: {new Date().getFullYear()}
            </p>
        </div>
      </div>
    </div>
  );
};

export default PolicyOverlay;
