import React, { useEffect, useState } from 'react';
import { ActionDef, DialogState, GameState } from '../types';
import { ChevronRight, MessageCircle } from 'lucide-react';

interface SceneProps {
  bgUrl: string;
  actions: ActionDef[];
  onActionClick: (action: ActionDef) => void;
  dialog: DialogState;
  onDialogOptionClick: (action: () => void) => void;
  notification: string | null;
  flashEffect: boolean;
}

export const Scene: React.FC<SceneProps> = ({ 
  bgUrl, 
  actions, 
  onActionClick, 
  dialog, 
  onDialogOptionClick,
  notification,
  flashEffect
}) => {
  const [showBg, setShowBg] = useState(false);

  useEffect(() => {
    setShowBg(false);
    const img = new Image();
    img.src = bgUrl;
    img.onload = () => setShowBg(true);
  }, [bgUrl]);

  return (
    <div className="flex-1 relative bg-black overflow-hidden select-none">
      
      {/* Background Layer */}
      <div 
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${showBg ? 'opacity-90' : 'opacity-0'}`}
        style={{ backgroundImage: `url(${bgUrl})` }}
      />

      {/* Steam/Flash Effect Overlay */}
      {flashEffect && (
        <div className="absolute inset-0 bg-white/30 animate-pulse pointer-events-none z-20" />
      )}

      {/* Notification Toast */}
      <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${notification ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="bg-game-accent/90 backdrop-blur text-white px-8 py-3 rounded-full shadow-2xl font-bold border border-white/20">
          {notification}
        </div>
      </div>

      {/* Action Menu (Top Right) */}
      {!dialog.isOpen && (
        <div className="absolute top-6 right-6 flex flex-col gap-2 z-30 max-h-[80vh] overflow-y-auto w-64 pr-1">
          {actions.map((action, idx) => {
             let borderClass = "border-r-4 border-slate-400"; // Default
             if (action.style === 'danger') borderClass = "border-r-4 border-game-danger";
             if (action.style === 'gold') borderClass = "border-r-4 border-game-gold";
             if (action.style === 'interaction') borderClass = "border-r-4 border-game-secondary";

             return (
               <button 
                 key={idx}
                 onClick={() => onActionClick(action)}
                 className={`
                   group bg-black/70 backdrop-blur-sm hover:bg-game-accent 
                   text-white text-right py-3 px-4 rounded-l-lg 
                   transition-all duration-300 transform hover:-translate-x-2
                   border-y border-l border-white/10 shadow-lg flex items-center justify-end gap-3
                   ${borderClass}
                 `}
               >
                 <span className="font-medium text-sm">{action.txt}</span>
                 {action.style === 'interaction' ? <MessageCircle size={16} /> : <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
               </button>
             );
          })}
        </div>
      )}

      {/* NPC/Character Sprite Layer */}
      {dialog.isOpen && dialog.image && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 h-[85%] transition-all duration-500 animate-fade-in filter drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]">
             <img src={dialog.image} alt="Character" className="h-full object-contain" />
        </div>
      )}

      {/* Dialog Overlay */}
      {dialog.isOpen && (
        <div className="absolute bottom-8 left-4 right-4 md:left-8 md:right-8 lg:right-[26rem] z-40">
          <div className="bg-[#0f0f23]/95 border-2 border-game-accent rounded-xl p-6 shadow-[0_0_30px_rgba(236,72,153,0.3)] backdrop-blur-md">
            <h3 className="text-game-accent text-xl font-bold uppercase tracking-wider mb-2 drop-shadow-md">
              {dialog.speaker}
            </h3>
            <p className="text-slate-100 text-lg leading-relaxed min-h-[3rem] mb-6">
              {dialog.text}
            </p>
            
            <div className="flex flex-wrap gap-3">
              {dialog.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => onDialogOptionClick(opt.action)}
                  className="flex-grow bg-gradient-to-r from-game-primary to-purple-900 border border-game-secondary hover:from-game-accent hover:to-pink-600 text-white font-bold py-3 px-6 rounded transition-transform transform hover:scale-[1.02] shadow-lg"
                >
                  {opt.txt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Dark Gradient Overlay at bottom for text readability */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-10" />
    </div>
  );
};
