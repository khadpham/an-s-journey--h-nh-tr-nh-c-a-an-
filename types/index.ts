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
  tutorialSeen: Record<string, boolean>;
  achievements: string[];
}

export type ToastType = 'info'|'event'|'error'|'success'|'warning';

export interface Achievement {
  id: string;
  icon: string;
  name: string;
  description: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_gear', icon: '⚙️', name: 'Khởi đầu', description: 'Thu thập Bánh Răng đầu tiên' },
  { id: 'all_gears', icon: '👑', name: 'Huyền Thoại', description: 'Thu thập tất cả 8 Bánh Răng' },
  { id: 'perfect_8', icon: '🌟', name: 'Hoàn Hảo', description: 'Hoàn thành tất cả 8 màn ở chế độ tối ưu' },
  { id: 'quick_thinker', icon: '🧠', name: 'Suy nghĩ nhanh', description: 'Hoàn thành Game 8 trong 1 lần cân' },
  { id: 'speedrunner', icon: '⚡', name: 'Tốc độ', description: 'Hoàn thành Game 4 trong 20 giây' },
  { id: 'companion_1', icon: '🐕', name: 'Bạn đồng hành', description: 'Mở khóa Chú Chó Vàng' },
  { id: 'companion_2', icon: '🤖', name: 'Kỹ thuật', description: 'Mở khóa Robo Tin-Tin' },
  { id: 'companion_3', icon: '🐻', name: 'Học giả', description: 'Mở khóa Giáo Sư Gấu' },
];
