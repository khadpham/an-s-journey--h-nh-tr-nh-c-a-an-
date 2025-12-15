export interface StoryPart {
  id: string;
  type: 'text' | 'game';
  game?: string;
  part: string;
  title: string;
  text: string;
  hint?: string;
  hint2?: string;
  guide?: string;
  math?: string;
  rules?: string;
}

export interface GameProgress {
  done: boolean;
  opt: boolean; // optimized win (gear obtained)
}

export interface InventoryItem {
  id: string;
  icon: string;
  name: string;
  gameId: string; // The game ID where this item is useful
}

export interface SaveData {
  idx: number;
  gears: number;
  progress: Record<string, GameProgress>;
  visited: Record<string, boolean>;
  unlockedCompanions: string[];
  inventory: string[];
  usedSkills: Record<number, Record<string, boolean>>;
  usedItems: Record<number, Record<string, boolean>>;
}

export type ToastType = 'info'|'event'|'error'|'success'|'warning';
