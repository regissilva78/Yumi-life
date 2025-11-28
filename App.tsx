import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Scene } from './components/Scene';
import { GameState, LocationDef, ActionDef, DialogState, DialogOption, WardrobeItem } from './types';
import { LOCATIONS, WARDROBE, STUDENTS } from './constants';

// --- CONFIGURAÇÃO DE VERSÃO ---
const GAME_VERSION = "5.3";

// --- SERVICE: Image Generation Wrapper ---
const getImageUrl = (type: 'bg' | 'npc' | 'yumi', keyword: string) => {
  let prompt = "";
  if (type === 'bg') prompt = `photorealistic ${keyword} 8k cinematic lighting detailed background`;
  if (type === 'npc') prompt = `photorealistic japanese person ${keyword} portrait looking at camera 8k`;
  if (type === 'yumi') prompt = `photorealistic japanese girl portrait beautiful face slanted eyes black hair ${keyword} 8k realism full body shot`;
  
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${type === 'bg' ? 1024 : 512}&height=${type === 'bg' ? 768 : 1024}&nologo=true`;
};

// --- INITIAL STATE ---
const INITIAL_STATE: GameState = {
  tempo: { dia: 1, diaSemana: 1, hora: 8, min: 0 },
  local: 'quarto',
  roupaAtual: 'pijama',
  dinheiro: 50,
  status: {
    ingenuidade: 95,
    sensualidade: 5,
    trauma: 5,
    inteligencia: 15,
    energia: 100,
    confianca: 5
  },
  inventario: ['celular'],
  roupasAdquiridas: ['pijama', 'chinelo', 'uniforme', 'saia_camisa', 'sandalia', 'vestido', 'jeans_camisa', 'lingerie_branca'],
  flags: { conheceuJulio: false, primeiroTrabalho: false }
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [dialog, setDialog] = useState<DialogState>({ isOpen: false, speaker: '', text: '', image: '', options: [] });
  const [notification, setNotification] = useState<string | null>(null);
  const [flashEffect, setFlashEffect] = useState(false);
  const [customActions, setCustomActions] = useState<ActionDef[] | null>(null); // For sub-menus (Wardrobe, Interactions)

  // --- HELPERS ---
  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  };

  const updateStat = (stat: keyof GameState['status'], val: number) => {
    setGameState(prev => {
      let newVal = prev.status[stat] + val;
      if (newVal > 100) newVal = 100;
      if (newVal < 0) newVal = 0;
      return { ...prev, status: { ...prev.status, [stat]: newVal } };
    });
  };

  const passTime = (minutes: number) => {
    setGameState(prev => {
      let newMin = prev.tempo.min + minutes;
      let newHora = prev.tempo.hora;
      let newDia = prev.tempo.dia;
      let newDiaSemana = prev.tempo.diaSemana;

      while (newMin >= 60) {
        newMin -= 60;
        newHora++;
      }
      if (newHora >= 24) {
        newHora -= 24;
        newDia++;
        newDiaSemana++;
        if (newDiaSemana > 6) newDiaSemana = 0;
      }
      return {
        ...prev,
        tempo: { ...prev.tempo, min: newMin, hora: newHora, dia: newDia, diaSemana: newDiaSemana }
      };
    });
  };

  const closeDialog = () => setDialog(prev => ({ ...prev, isOpen: false }));

  // --- GAMEPLAY ACTIONS ---

  const handleNavigate = (target: string) => {
    setCustomActions(null); // Reset any sub-menus
    
    // Logic for leaving house in lingerie
    if (target === 'rua' && gameState.roupaAtual.includes('lingerie')) {
      // We need a confirmation dialog technically, but for simplicity in this structure:
      updateStat('sensualidade', 5);
      showNotification("Você saiu de lingerie! Que ousadia.");
    }
    
    setGameState(prev => ({ ...prev, local: target }));
  };

  const handleWardrobeMenu = () => {
    const clothes = gameState.roupasAdquiridas.map(id => {
      const item = WARDROBE[id];
      return {
        txt: item.nome,
        type: 'ACTION',
        payload: { type: 'CHANGE_CLOTHES', id: id }
      } as ActionDef;
    });
    
    setCustomActions([
      ...clothes,
      { txt: "🔙 Fechar", type: 'ACTION', payload: 'CLOSE_SUBMENU', style: 'danger' }
    ]);
  };

  const handleInteractionMenu = () => {
    // Determine who is in the brothers' room
    const isHome = gameState.tempo.diaSemana >= 1 && gameState.tempo.diaSemana <= 5 && gameState.tempo.hora >= 8 && gameState.tempo.hora < 13;
    
    if (isHome) { // Actually logic is reversed in original: School time = NOT home.
       showNotification("Ninguém aqui.");
       return;
    }

    const interactActions: ActionDef[] = [
      { txt: "🗣️ Conversar", type: 'ACTION', payload: 'talk_bros' },
      { txt: "🎮 Apostar (¥100)", type: 'ACTION', payload: 'gamble_bros' },
      { txt: "🎲 Apostar Roupa", type: 'ACTION', payload: 'strip_gamble' },
      { txt: "🔙 Voltar", type: 'ACTION', payload: 'CLOSE_SUBMENU', style: 'danger' }
    ];

    if (gameState.status.sensualidade > 30) {
       interactActions.splice(2, 0, { txt: "💋 Provocar", type: 'ACTION', payload: 'provoke_bros' });
    }

    setCustomActions(interactActions);
  };

  const runGenericAction = (payload: any) => {
    if (payload === 'CLOSE_SUBMENU') {
      setCustomActions(null);
      return;
    }

    if (typeof payload === 'object' && payload.type === 'CHANGE_CLOTHES') {
      setGameState(prev => ({ ...prev, roupaAtual: payload.id }));
      // Outfit reaction logic could go here
      return;
    }

    switch (payload) {
      case 'sleep':
        updateStat('energia', 100);
        passTime(480);
        showNotification("Zzz... Dormiu bem.");
        break;
      case 'tv':
        passTime(60);
        showNotification("Você assistiu TV.");
        break;
      case 'eat':
        updateStat('energia', 20);
        passTime(20);
        showNotification("Nhac! Estava bom.");
        break;
      case 'shower':
        setFlashEffect(true);
        setTimeout(() => setFlashEffect(false), 2000);
        passTime(20);
        showNotification("Banho tomado.");
        break;
      case 'study':
        updateStat('inteligencia', 5);
        updateStat('energia', -10);
        passTime(60);
        showNotification("Estudou bastante.");
        break;
      case 'work':
         if (gameState.tempo.hora < 14) {
           showNotification("O bar só abre às 14h.");
         } else {
           setGameState(prev => ({ ...prev, dinheiro: prev.dinheiro + 50 }));
           passTime(60);
           showNotification("Trabalhou duro. +¥50");
         }
         break;
      case 'observe_bros':
         // Simplified logic check
         setDialog({
           isOpen: true,
           speaker: 'Pensamento',
           text: 'O ar está pesado com cheiro de fumaça e suor. Mike e Jim estão largados jogando.',
           image: getImageUrl('bg', 'japanese boys bedroom messy dark chaotic video games smoke two boys sitting'),
           options: [{ txt: "Ok", action: closeDialog }]
         });
         break;
      case 'interact_students':
         const student = STUDENTS[Math.floor(Math.random() * STUDENTS.length)];
         setDialog({
           isOpen: true,
           speaker: student.nome,
           text: student.fala,
           image: getImageUrl('npc', `japanese student ${student.tipo} portrait`),
           options: [
             { txt: "Conversar", action: () => { showNotification("Papo legal."); closeDialog(); } },
             { txt: "Ignorar", action: () => { showNotification("Ignorado."); closeDialog(); } }
           ]
         });
         break;
      // ... Add more cases for other actions if needed
      default:
        passTime(10);
        showNotification("Ação realizada.");
    }
  };

  const handleActionClick = (action: ActionDef) => {
    if (action.type === 'NAVIGATE' && action.target) handleNavigate(action.target);
    if (action.type === 'WARDROBE_MENU') handleWardrobeMenu();
    if (action.type === 'INTERACT_MENU') handleInteractionMenu();
    if (action.type === 'WORK') runGenericAction('work');
    if (action.type === 'ACTION') runGenericAction(action.payload);
  };

  // --- SAFE SAVE SYSTEM WITH MIGRATION ---
  
  const migrateSaveData = (data: any): GameState => {
    // This function ensures old save data is compatible with current code
    const migrated = { ...INITIAL_STATE, ...data };
    
    // Example Migration: If we add new stats in the future, ensure they exist
    // if (!migrated.status.newStat) migrated.status.newStat = 0;
    
    return migrated;
  };

  const saveGame = () => {
    const saveObj = {
      version: GAME_VERSION,
      data: gameState,
      timestamp: Date.now()
    };
    localStorage.setItem('myfamilylife_react_save', JSON.stringify(saveObj));
    showNotification("Jogo Salvo no Navegador!");
  };

  const loadGame = () => {
    const saved = localStorage.getItem('myfamilylife_react_save');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        
        // Check if it's a legacy save (direct object) or new safe save (wrapper)
        let dataToLoad;
        if (parsed.version) {
          console.log(`Carregando save versão ${parsed.version}`);
          dataToLoad = parsed.data;
        } else {
          console.log("Detectado save legado (pré-v5.3). Migrando...");
          dataToLoad = parsed;
        }

        const cleanState = migrateSaveData(dataToLoad);
        setGameState(cleanState);
        showNotification("Jogo Carregado!");
      } catch (e) {
        console.error(e);
        showNotification("Erro ao carregar save. Arquivo corrompido.");
      }
    } else {
      showNotification("Nenhum save encontrado.");
    }
  };

  const resetGame = () => {
    if (window.confirm("Reiniciar o jogo? Todo progresso não salvo será perdido.")) {
      setGameState(INITIAL_STATE);
      setCustomActions(null);
      setDialog({ isOpen: false, speaker: '', text: '', image: '', options: [] });
    }
  };

  const exportSave = () => {
    const saveObj = {
      version: GAME_VERSION,
      data: gameState,
      timestamp: Date.now()
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(saveObj));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `yumi_save_v${GAME_VERSION}_dia${gameState.tempo.dia}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    showNotification("Save exportado!");
  };

  const importSave = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        if (e.target?.result) {
          const parsed = JSON.parse(e.target.result as string);
          
          let dataToLoad;
          if (parsed.version) {
             dataToLoad = parsed.data;
          } else {
             dataToLoad = parsed;
          }

          if (dataToLoad && dataToLoad.tempo && dataToLoad.status) {
            const cleanState = migrateSaveData(dataToLoad);
            setGameState(cleanState);
            showNotification("Save importado com sucesso!");
          } else {
             showNotification("Arquivo inválido.");
          }
        }
      } catch (error) {
        showNotification("Erro ao ler arquivo.");
      }
    };
    reader.readAsText(file);
  };

  // --- RENDER HELPERS ---
  const currentLocation = LOCATIONS[gameState.local];
  
  // Resolve dynamic background
  let bgPrompt = currentLocation.bgPrompt;
  // Special case for empty bros room
  const isBrosHome = !(gameState.tempo.diaSemana >= 1 && gameState.tempo.diaSemana <= 5 && gameState.tempo.hora >= 8 && gameState.tempo.hora < 13);
  if (gameState.local === 'quarto_irmaos' && !isBrosHome) bgPrompt = "japanese boys bedroom tidy empty clean";
  
  const bgUrl = getImageUrl('bg', bgPrompt);
  
  // Resolve Avatar
  const currentOutfit = WARDROBE[gameState.roupaAtual] || WARDROBE['pijama'];
  const avatarUrl = getImageUrl('yumi', currentOutfit.prompt);

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-game-dark">
      {/* Main Scene Area */}
      <Scene 
        bgUrl={bgUrl}
        actions={customActions || currentLocation.acoes}
        onActionClick={handleActionClick}
        dialog={dialog}
        onDialogOptionClick={(cb) => cb()}
        notification={notification}
        flashEffect={flashEffect}
      />
      
      {/* Sidebar Stats */}
      <Sidebar 
        state={gameState}
        onSave={saveGame}
        onLoad={loadGame}
        onReset={resetGame}
        onExport={exportSave}
        onImport={importSave}
        avatarUrl={avatarUrl}
      />
    </div>
  );
}