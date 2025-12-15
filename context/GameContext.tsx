import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { SaveData, ToastType } from '../types/index';
import { STORY } from '../config/gameContent';

interface GameContextType extends SaveData {
  loadGame: () => void;
  saveGame: () => void;
  resetJourney: (skipConfirm?: boolean) => void;
  resetLevelItems: (levelIdx: number) => void;
  goToChapter: (idx: number, force?: boolean) => void;
  completeLevel: (opt: boolean) => void;
  useItem: (itemId: string) => void;
  useSkill: (compId: string) => void;
  showToast: (msg: string, type?: ToastType) => void;
  toast: { msg: string, type: string, id: number } | null;
  toggleSidebar: () => void;
  isSidebarCollapsed: boolean;
  playSound: (type: 'click'|'win'|'fail'|'silent') => void;
  statusText: string;
  setStatusText: (text: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const getInitialState = (): SaveData => ({
  idx: 0,
  gears: 0,
  progress: {},
  visited: {},
  unlockedCompanions: [],
  inventory: [],
  usedSkills: {},
  usedItems: {}
});

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<SaveData>(getInitialState());
  const [toast, setToast] = useState<{ msg: string, type: string, id: number } | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [statusText, setStatusText] = useState("PLAYING");

  useEffect(() => {
    loadGame();
    // eslint-disable-next-line
  }, []);

  // Reset status text when changing levels
  useEffect(() => {
    setStatusText("PLAYING");
  }, [state.idx]);

  const playSound = (type: 'click'|'win'|'fail'|'silent') => {
    if (type === 'silent') return;
    let ctx = audioCtx;
    if (!ctx) {
      ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioCtx(ctx);
    }
    if (ctx && ctx.state === 'suspended') ctx.resume();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.connect(g);
    g.connect(ctx.destination);
    const n = ctx.currentTime;

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, n);
      g.gain.setValueAtTime(0.05, n);
      g.gain.exponentialRampToValueAtTime(0.001, n + 0.1);
      osc.start(n);
      osc.stop(n + 0.1);
    } else if (type === 'win') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523, n);
      osc.frequency.linearRampToValueAtTime(1046, n + 0.3);
      g.gain.setValueAtTime(0.1, n);
      g.gain.linearRampToValueAtTime(0.001, n + 1);
      osc.start(n);
      osc.stop(n + 1);
    } else if (type === 'fail') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, n);
      osc.frequency.linearRampToValueAtTime(100, n + 0.3);
      g.gain.setValueAtTime(0.1, n);
      g.gain.linearRampToValueAtTime(0.001, n + 0.5);
      osc.start(n);
      osc.stop(n + 0.5);
    }
  };

  const showToast = (msg: string, type: ToastType = 'info') => {
    setToast({ msg, type, id: Date.now() });
    setTimeout(() => setToast(null), 4000);
  };

  const loadGame = () => {
    const s = localStorage.getItem('an_v58_save');
    if (s) {
      try {
        const d = JSON.parse(s);
        setState({
            ...getInitialState(),
            ...d,
        });
      } catch (e) {
        console.error("Save corrupted", e);
      }
    }
  };

  const saveGameInternal = (newState: SaveData) => {
    localStorage.setItem('an_v58_save', JSON.stringify(newState));
  };

  const saveGame = () => {
    saveGameInternal(state);
  };

  const resetJourney = (skipConfirm = false) => {
    if (skipConfirm || window.confirm("CẢNH BÁO: Bạn có chắc chắn muốn xóa toàn bộ dữ liệu và chơi lại từ đầu?")) {
      localStorage.removeItem('an_v58_save');
      window.location.href = window.location.href; 
    }
  };

  const resetLevelItems = (levelIdx: number) => {
    setState(prev => {
        const usedItems = { ...prev.usedItems };
        if (usedItems[levelIdx]) {
            delete usedItems[levelIdx];
        }
        const next = { ...prev, usedItems };
        saveGameInternal(next);
        return next;
    });
  };

  const goToChapter = (idx: number, force = false) => {
    const prev = STORY[idx - 1];
    // Check if we can jump:
    // 1. If force is true (system override, e.g. Win Game)
    // 2. If it's the first chapter
    // 3. If we are going back
    // 4. If the previous chapter is done (or is text only)
    const canJump = force || idx === 0 || idx <= state.idx || (prev && (state.progress[prev.id]?.done || prev.type === 'text'));
    
    if (canJump) {
      setState(prev => {
        const next = { ...prev, idx };
        saveGameInternal(next);
        return next;
      });
    }
  };

  const completeLevel = (opt: boolean) => {
    const currentStory = STORY[state.idx];
    const prog = { ...state.progress, [currentStory.id]: { done: true, opt } };
    
    let g = 0;
    Object.values(prog).forEach(v => { if (v.opt) g++; });

    const unlocked = [...state.unlockedCompanions];
    const inv = [...state.inventory];
    
    if (currentStory.id === 'c1' && !unlocked.includes('dog')) { unlocked.push('dog'); showToast("🐕 Chú Chó Vàng đã gia nhập đội!", "event"); }
    if (currentStory.id === 'c2' && !unlocked.includes('robo')) { unlocked.push('robo'); showToast("🤖 Robo Tin-Tin đã được sửa chữa!", "event"); }
    if (currentStory.id === 'c3' && !unlocked.includes('bear')) { unlocked.push('bear'); if(!inv.includes('glass')) inv.push('glass'); showToast("🐻 Giáo Sư Gấu đã gia nhập đội!", "event"); showToast("🔍 Đã tìm thấy Kính Lúp!", "event"); }
    if (currentStory.id === 'c6' && !inv.includes('magnet')) { inv.push('magnet'); showToast("🧲 Đã tìm thấy Nam Châm!", "event"); }

    setState(prev => {
      const next = { 
        ...prev, 
        progress: prog, 
        gears: g, 
        unlockedCompanions: unlocked, 
        inventory: inv 
      };
      saveGameInternal(next);
      return next;
    });
  };

  const useItem = (itemId: string) => {
    setState(prev => {
      const used = { ...prev.usedItems };
      if (!used[prev.idx]) used[prev.idx] = {};
      used[prev.idx][itemId] = true;
      const next = { ...prev, usedItems: used };
      saveGameInternal(next);
      return next;
    });
  };

  const useSkill = (compId: string) => {
     setState(prev => {
      const used = { ...prev.usedSkills };
      if (!used[prev.idx]) used[prev.idx] = {};
      used[prev.idx][compId] = true;
      const next = { ...prev, usedSkills: used };
      saveGameInternal(next);
      return next;
    });
  };

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  return (
    <GameContext.Provider value={{ 
      ...state, loadGame, saveGame, resetJourney, resetLevelItems, goToChapter, completeLevel, 
      useItem, useSkill, showToast, toast, toggleSidebar, isSidebarCollapsed, playSound, statusText, setStatusText
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};