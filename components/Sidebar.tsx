import React, { useRef } from 'react';
import { GameState, WardrobeItem } from '../types';
import { WARDROBE, DAYS_OF_WEEK } from '../constants';
import { Save, FolderOpen, RotateCcw, Download, Upload } from 'lucide-react';

interface SidebarProps {
  state: GameState;
  onSave: () => void;
  onLoad: () => void;
  onReset: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
  avatarUrl: string;
}

const StatBar: React.FC<{ label: string; value: number; colorClass: string }> = ({ label, value, colorClass }) => (
  <div className="mb-3">
    <div className="flex justify-between text-xs text-slate-300 mb-1">
      <span className="capitalize">{label}</span>
      <span>{value}%</span>
    </div>
    <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
      <div 
        className={`h-full transition-all duration-700 ease-out ${colorClass}`} 
        style={{ width: `${value}%`, boxShadow: `0 0 10px currentColor` }}
      />
    </div>
  </div>
);

export const Sidebar: React.FC<SidebarProps> = ({ state, onSave, onLoad, onReset, onExport, onImport, avatarUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentOutfit: WardrobeItem = WARDROBE[state.roupaAtual] || WARDROBE['pijama'];

  const getOutfitLevelText = (level: number) => {
    if (level <= 20) return "Baixa";
    if (level <= 55) return "Média";
    return "Alta";
  };

  const formatTime = () => {
    const h = state.tempo.hora.toString().padStart(2, '0');
    const m = state.tempo.min.toString().padStart(2, '0');
    const dayName = DAYS_OF_WEEK[state.tempo.diaSemana];
    return `${dayName} • ${h}:${m}`;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImport(file);
    }
    // Reset input value so same file can be selected again
    if (event.target) event.target.value = '';
  };

  return (
    <div className="w-full md:w-80 lg:w-96 bg-game-card border-l-2 border-game-primary flex flex-col h-full overflow-y-auto shrink-0 shadow-2xl z-20">
      
      {/* System Buttons */}
      <div className="flex flex-col gap-2 p-4 border-b border-slate-700/50">
        <div className="flex gap-2">
            <button onClick={onSave} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 px-2 rounded text-xs flex items-center justify-center gap-1 transition-colors" title="Salvar no Navegador">
            <Save size={14} /> Salvar
            </button>
            <button onClick={onLoad} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 px-2 rounded text-xs flex items-center justify-center gap-1 transition-colors" title="Carregar do Navegador">
            <FolderOpen size={14} /> Carregar
            </button>
            <button onClick={onReset} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 px-2 rounded text-xs flex items-center justify-center gap-1 transition-colors" title="Reiniciar Jogo">
            <RotateCcw size={14} /> Reset
            </button>
        </div>
        
        {/* Advanced Save Options (File) */}
        <div className="flex gap-2 mt-1">
            <button onClick={onExport} className="flex-1 bg-indigo-900/50 hover:bg-indigo-800 border border-indigo-500/30 text-indigo-200 py-1.5 px-2 rounded text-[10px] flex items-center justify-center gap-1 transition-colors">
                <Download size={12} /> Exportar Save
            </button>
            <button onClick={() => fileInputRef.current?.click()} className="flex-1 bg-indigo-900/50 hover:bg-indigo-800 border border-indigo-500/30 text-indigo-200 py-1.5 px-2 rounded text-[10px] flex items-center justify-center gap-1 transition-colors">
                <Upload size={12} /> Importar Save
            </button>
            <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
            />
        </div>
      </div>

      <div className="p-6 flex flex-col items-center">
        {/* Avatar */}
        <div className="relative group">
          <div className="w-40 h-40 rounded-full border-4 border-game-accent overflow-hidden shadow-[0_0_20px_rgba(236,72,153,0.4)] mb-4 bg-black">
             <img src={avatarUrl} alt="Yumi" className="w-full h-full object-cover" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-100 mb-1">Yumi</h2>
        <p className="text-sm text-slate-400 mb-6">{formatTime()}</p>

        {/* Money */}
        <div className="w-full bg-gradient-to-r from-indigo-950 to-indigo-900 border border-game-gold/50 rounded-lg p-3 text-center mb-6 shadow-lg">
          <span className="text-game-gold font-bold text-2xl drop-shadow-md">¥ {state.dinheiro}</span>
        </div>

        {/* Stats */}
        <div className="w-full space-y-1">
           <StatBar label="Ingenuidade" value={state.status.ingenuidade} colorClass="bg-yellow-400" />
           <StatBar label="Sensualidade" value={state.status.sensualidade} colorClass="bg-pink-500" />
           <StatBar label="Trauma" value={state.status.trauma} colorClass="bg-red-500" />
           <StatBar label="Inteligência" value={state.status.inteligencia} colorClass="bg-blue-500" />
           <StatBar label="Energia" value={state.status.energia} colorClass="bg-emerald-500" />
           <StatBar label="Confiança" value={state.status.confianca} colorClass="bg-violet-500" />
        </div>

        {/* Outfit Info */}
        <div className="w-full mt-6 p-4 bg-black/20 rounded-lg border border-white/5">
          <h4 className="text-game-secondary text-xs font-bold uppercase tracking-wider mb-1">Roupa Atual</h4>
          <p className="text-slate-200 text-sm font-medium">{currentOutfit.nome}</p>
          <p className="text-game-accent text-xs mt-1">Sensualidade: {getOutfitLevelText(currentOutfit.nivel)}</p>
        </div>

        <div className="mt-auto pt-8 text-center">
           <p className="text-[10px] text-slate-600">v5.3.1 - Backup System</p>
        </div>
      </div>
    </div>
  );
};