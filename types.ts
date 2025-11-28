export type StatName = 'ingenuidade' | 'sensualidade' | 'trauma' | 'inteligencia' | 'energia' | 'confianca';

export interface GameStats {
  ingenuidade: number;
  sensualidade: number;
  trauma: number;
  inteligencia: number;
  energia: number;
  confianca: number;
}

export interface GameTime {
  dia: number;
  diaSemana: number; // 0-6
  hora: number;
  min: number;
}

export interface WardrobeItem {
  id: string;
  nome: string;
  nivel: number;
  prompt: string;
}

export interface GameState {
  tempo: GameTime;
  local: string;
  roupaAtual: string;
  dinheiro: number;
  status: GameStats;
  inventario: string[];
  roupasAdquiridas: string[];
  flags: Record<string, boolean>;
}

export interface ActionDef {
  txt: string;
  type: 'NAVIGATE' | 'ACTION' | 'DIALOG' | 'SHOP_MENU' | 'WARDROBE_MENU' | 'INTERACT_MENU' | 'WORK';
  target?: string;
  payload?: any;
  condition?: (state: GameState) => boolean;
  style?: 'default' | 'danger' | 'gold' | 'interaction';
}

export interface LocationDef {
  id: string;
  nome: string;
  bgPrompt: string;
  acoes: ActionDef[];
  getDynamicBg?: (state: GameState) => string;
}

export interface DialogOption {
  txt: string;
  action: () => void;
}

export interface DialogState {
  isOpen: boolean;
  speaker: string;
  text: string;
  image: string;
  options: DialogOption[];
}
