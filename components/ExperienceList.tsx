
import React, { useState } from 'react';
import { Calendar, Briefcase, ChevronRight, Tag } from 'lucide-react';
import { EXPERIENCE_LIST } from '../constants';

const ExperienceList: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>(EXPERIENCE_LIST[0].id);

  const selectedItem = EXPERIENCE_LIST.find(item => item.id === selectedId) || EXPERIENCE_LIST[0];

  const renderContent = (content: string) => {
    return content.trim().split('\n').map((line, i) => {
      const trimLine = line.trim();
      if (trimLine.startsWith('- ')) {
        return (
            <li key={i} className="ml-4 mb-2 text-secondary list-disc text-sm leading-relaxed">
                {line.replace('- ', '')}
            </li>
        );
      }
      if (trimLine.startsWith('**')) {
         return <p key={i} className="mb-2 text-primary font-bold">{trimLine.replace(/\*\*/g, '')}</p>
      }
      return <p key={i} className="mb-2 text-secondary text-sm">{line}</p>;
    });
  };

  return (
    <div className="flex flex-row h-full w-full bg-node-bg overflow-hidden">
      {/* Sidebar List - Fixed Width for Desktop feel */}
      <div className="w-[200px] h-full border-r border-node-border flex flex-col bg-black/5 dark:bg-white/5 shrink-0">
         <div className="p-3 border-b border-node-border text-[10px] font-bold uppercase text-secondary tracking-widest bg-black/5 dark:bg-white/5">
            Timeline
         </div>
         <div className="flex-1 overflow-y-auto custom-scroll p-2 space-y-1">
            {EXPERIENCE_LIST.map((item) => (
                <button
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={`w-full text-left px-3 py-3 rounded-md transition-all border border-transparent flex flex-col gap-1 group ${
                        selectedId === item.id 
                        ? 'bg-node-bg shadow-sm border-node-border/50' 
                        : 'hover:bg-node-bg/50 hover:border-node-border/50 text-secondary'
                    }`}
                >
                    <div className="flex items-center justify-between">
                         <span className={`text-xs font-bold font-mono ${selectedId === item.id ? 'text-accent' : 'text-primary'}`}>
                            {item.period.split(' - ')[0]}
                         </span>
                         {selectedId === item.id && <ChevronRight size={12} className="text-accent" />}
                    </div>
                    <div className="font-bold text-sm text-primary group-hover:text-accent transition-colors truncate">
                        {item.company}
                    </div>
                    <div className="text-xs text-secondary truncate">
                        {item.role}
                    </div>
                </button>
            ))}
         </div>
      </div>

      {/* Detail View */}
      <div className="flex-1 flex flex-col bg-node-bg animate-in fade-in slide-in-from-right-4 duration-300 min-h-0">
         {/* Header */}
         <div className="p-5 border-b border-node-border bg-node-bg shrink-0">
             <div className="flex flex-col gap-1 mb-2">
                 <h3 className="text-lg font-bold text-primary leading-tight">{selectedItem.role}</h3>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-secondary text-sm font-medium">
                        <Briefcase size={14} />
                        <span>{selectedItem.company}</span>
                    </div>
                    <span className="text-xs font-mono text-accent bg-accent/10 px-2 py-1 rounded border border-accent/20">
                        {selectedItem.period}
                    </span>
                 </div>
             </div>
         </div>

         {/* Body */}
         <div className="flex-1 p-5 overflow-y-auto custom-scroll bg-node-bg">
            <ul className="space-y-2">
                {renderContent(selectedItem.description)}
            </ul>
         </div>
         
         {/* Footer Tags */}
         <div className="p-4 border-t border-node-border bg-node-bg shrink-0">
            <div className="flex flex-wrap gap-2">
                {selectedItem.tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-secondary border border-node-border px-2 py-1 rounded bg-black/5 dark:bg-white/5">
                        <Tag size={10} /> {tag}
                    </span>
                ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default ExperienceList;
