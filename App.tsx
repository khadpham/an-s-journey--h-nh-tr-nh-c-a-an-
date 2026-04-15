import { useState, useEffect, useRef, Component, ReactNode } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { STORY, COMPANIONS } from './config/gameContent';
import GameSwitches from './features/games/switches/GameSwitches';
import GameJugs from './features/games/jugs/GameJugs';
import GameGraph from './features/games/graph/GameGraph';
import GameRiver from './features/games/river/GameRiver';
import GameCat from './features/games/cat/GameCat';
import GameSpider from './features/games/spider/GameSpider';
import GameHorses from './features/games/horses/GameHorses';
import GameBalls from './features/games/balls/GameBalls';

import { Sidebar, HeaderMobile } from './components/layout/MainLayout';
import { TutorialModal } from './components/TutorialModal';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Game Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center h-screen bg-slate-950 text-white p-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-red-400 mb-2">Đã xảy ra lỗi!</h1>
          <p className="text-slate-400 mb-4 text-center">{this.state.error?.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg"
          >
            Tải lại trang
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-slate-950 text-white">
    <div className="text-6xl mb-8 animate-bounce">⚙️</div>
    <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 uppercase tracking-widest mb-2">
      Hành Trình của An
    </h1>
    <p className="text-slate-500 text-sm">Đang tải...</p>
    <div className="mt-8 flex gap-2">
      <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
      <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
      <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
    </div>
  </div>
);

interface StoryAccordionProps {
    expanded: boolean;
    setExpanded: (v: boolean) => void;
}

const StoryAccordion = ({ expanded, setExpanded }: StoryAccordionProps) => {
    const { idx, goToChapter, progress } = useGame();
    const story = STORY[idx];
    
    if (!story) return null;

    const isLevelDone = progress[story.id]?.done;

    // Use effect to auto-expand only on new levels if needed (state is now controlled by parent)
    useEffect(() => {
        if (!story) return;
        // Logic to auto open new text-only chapters or unfinished levels
        if (story.type === 'text' || !progress[story.id]?.done) {
            setExpanded(true);
        }
    }, [idx, story?.id, story?.type, progress, setExpanded]);

    const startGame = () => {
        setExpanded(false);
        if (story.type === 'text') {
          const nextIdx = idx + 1;
          goToChapter(nextIdx);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (expanded && e.key === 'Enter') {
                e.preventDefault(); 
                startGame();
            }
        };

        if (expanded) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [expanded, idx]);

    const getButtonText = () => {
        if (story.id === 'intro') return 'BẮT ĐẦU';
        if (story.type === 'text') return 'TIẾP TỤC';
        return 'BẮT ĐẦU (Enter)';
    }

    const getPartLabel = () => {
        if (story.id === 'intro' || story.part === 'MỞ ĐẦU') return 'MỞ ĐẦU';
        if (story.part.includes('PHẦN')) return 'PHẦN ' + story.part.split('PHẦN ')[1].split(':')[0];
        return story.part;
    };

    return (
        <div className={`bg-slate-900 border-b border-slate-800 shrink-0 z-40 shadow-md relative transition-all duration-300 ${expanded ? '' : 'overflow-hidden'}`}>
            {/* Header Bar 
                - Desktop & Mobile Portrait: Visible (flex)
                - Mobile Landscape Only (<768px width): HIDDEN (max-md:landscape:hidden)
            */}
            <div className="flex justify-between items-center p-4 max-md:landscape:hidden bg-slate-800 border-b border-slate-700 cursor-pointer hover:bg-slate-750 transition" onClick={() => setExpanded(!expanded)}>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest border border-indigo-500/30 px-2 py-0.5 rounded bg-indigo-500/10">
                        {getPartLabel()}
                    </span>
                    <h3 className="text-xl font-serif font-bold text-white truncate">{story.title}</h3>
                </div>
                <div className="flex items-center gap-4">
                    {isLevelDone && <span className="text-emerald-400 text-xs font-bold border border-emerald-500/30 px-2 py-0.5 rounded bg-emerald-500/10">ĐÃ HOÀN THÀNH</span>}
                    <span className="text-slate-400 hover:text-white transition text-sm">{expanded ? '▲ Thu gọn' : '▼ Mở rộng'}</span>
                </div>
            </div>
            
            {/* Content Area 
                - Desktop & Mobile Portrait: Normal Flow (max-h, p-6)
                - Mobile Landscape Only: Fixed Overlay (top-10 to clear header, z-40 to sit above game controls but below header)
            */}
            <div className={`overflow-hidden transition-all duration-300 ${expanded 
                ? 'max-h-[800px] p-6 max-md:landscape:fixed max-md:landscape:left-0 max-md:landscape:right-0 max-md:landscape:bottom-0 max-md:landscape:top-10 max-md:landscape:z-40 max-md:landscape:bg-slate-900/95 max-md:landscape:overflow-y-auto max-md:landscape:p-4 max-md:landscape:max-h-none md:static md:bg-transparent md:border-none md:shadow-none md:p-6 md:w-auto md:z-auto' 
                : 'max-h-0'}`
            }>
                <div className="max-w-4xl mx-auto relative">
                    {/* Close button: Only visible on Mobile Landscape */}
                    <button onClick={() => setExpanded(false)} className="hidden max-md:landscape:block absolute top-0 right-0 text-slate-400 hover:text-white text-2xl">&times;</button>
                    
                    <div className="text-slate-300 text-sm leading-relaxed mb-4 font-light">{story.text}</div>
                    {story.rules && (
                        <div className="mb-6 p-4 bg-slate-950/50 rounded-xl border border-slate-800">
                            <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest mb-2">HƯỚNG DẪN NHIỆM VỤ</h4>
                            <div className="text-sm text-slate-400 leading-relaxed space-y-2" dangerouslySetInnerHTML={{__html: story.rules}} />
                        </div>
                    )}
                    <button onClick={startGame} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-lg shadow-lg transition-transform active:scale-95">
                        {getButtonText()}
                    </button>
                </div>
            </div>
        </div>
    );
};

interface HighScoreEntry {
  gears: number;
  rank: string;
  date: string;
}

const HighScores = ({ gears, rank }: { gears: number, rank: string }) => {
  const [scores, setScores] = useState<HighScoreEntry[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('an_v59_scores');
    if (saved) {
      try {
        setScores(JSON.parse(saved));
      } catch { setScores([]); }
    }
  }, []);

  useEffect(() => {
    if (gears > 0) {
      const entry: HighScoreEntry = { gears, rank, date: new Date().toLocaleDateString('vi-VN') };
      const existing = scores.findIndex(s => s.gears === gears);
      let newScores = [...scores];
      if (existing >= 0) {
        if (rank > newScores[existing].rank) {
          newScores[existing] = entry;
        }
      } else {
        newScores.push(entry);
      }
      newScores.sort((a, b) => b.gears - a.gears);
      newScores = newScores.slice(0, 5);
      setScores(newScores);
      localStorage.setItem('an_v59_scores', JSON.stringify(newScores));
    }
  }, [gears]);

  if (scores.length === 0) {
    return <div className="text-slate-500 text-xs italic">Chưa có dữ liệu</div>;
  }

  return (
    <div className="space-y-2">
      {scores.map((s, i) => (
        <div key={i} className={`flex justify-between items-center p-2 rounded ${i === 0 ? 'bg-amber-900/30 border border-amber-600/30' : 'bg-slate-800/30'}`}>
          <div className="flex items-center gap-2">
            <span className={`font-black ${i === 0 ? 'text-amber-400' : 'text-slate-500'}`}>#{i + 1}</span>
            <span className="text-amber-400 font-bold">{s.gears} ⚙️</span>
            <span className={`font-black ${s.rank === 'S+' ? 'text-amber-300' : s.rank === 'S' ? 'text-yellow-400' : s.rank === 'A+' || s.rank === 'A' ? 'text-emerald-400' : 'text-slate-400'}`}>{s.rank}</span>
          </div>
          <span className="text-slate-600 text-[10px]">{s.date}</span>
        </div>
      ))}
    </div>
  );
};

const SuccessScreen = ({ onNext, opt, isEnding }: { onNext: () => void, opt: boolean, isEnding: boolean }) => {
  const { gears, resetJourney, progress } = useGame();

  if (isEnding) {
    const optimizedGames = Object.values(progress).filter(p => p.opt).length;
    let r = 'B', i = '🌱';
        let rClass = "text-3xl landscape:text-2xl font-black text-slate-400 mt-1";
        let tClass = "text-3xl md:text-5xl landscape:text-2xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-500 mb-2";
        let tText = "BÌNH MINH CHƯA TRỌN";
        let sText = "NORMAL ENDING";
        let desc = "";
        
        if(gears === 8) {
            r = 'S+'; rClass = "text-4xl landscape:text-3xl font-black text-amber-400 mt-1 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]";
            i = '👑'; tClass = "text-3xl md:text-5xl landscape:text-2xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 mb-2";
            tText = "HUYỀN THOẠI ÁNH SÁNG"; sText = "TRUE ENDING - HOÀN HẢO";
            desc = `"Không thể tin được!" - Hắc Pháp Sư Muội Than thốt lên khi ánh sáng từ 8 Bánh Răng Vàng hợp nhất thành một luồng năng lượng thuần khiết, xuyên thủng màn đêm vĩnh cửu. <br><br>Cha của An bước ra từ khối pha lê vỡ vụn, không một vết xước. Cây Đèn Chân Lý không chỉ soi sáng con đường, mà còn thanh tẩy tâm hồn đen tối của kẻ thù. Muội Than, giờ đây đã được giải thoát khỏi lời nguyền bóng tối, cúi đầu kính phục trí tuệ và lòng dũng cảm của An.<br><br>Vương Quốc Logic bước vào kỷ nguyên thịnh vượng nhất lịch sử. An trở thành Thợ Đồng Hồ Hoàng Gia trẻ tuổi nhất, người nắm giữ chìa khóa của Thời Gian và Sự Thật. Một cái kết viên mãn không tì vết!`;
        } else {
            if (gears >= 6) {
                r = 'S'; rClass = "text-4xl landscape:text-3xl font-black text-yellow-300 mt-1";
                i = '⚔️'; tText = "HIỆP SĨ THỜI GIAN";
            } else if (gears === 5) {
                r = 'A+'; rClass = "text-3xl landscape:text-2xl font-black text-emerald-400 mt-1";
                i = '🛡️'; tText = "HỘ VỆ TÀI BA";
            } else if (gears === 4) {
                r = 'A'; rClass = "text-3xl landscape:text-2xl font-black text-emerald-500 mt-1";
                i = '🕯️'; tText = "NGƯỜI DẪN ĐƯỜNG";
            } else {
                r = 'B'; i = '🌱'; tText = "TẬP SỰ";
            }
            desc = `Với số lượng Bánh Răng thu thập được (${gears}/8), Cây Đèn Chân Lý lóe lên một tia sáng mạnh mẽ, đủ để phá vỡ khối pha lê và giải thoát cho Cha. Tuy nhiên, năng lượng đó chưa đủ để thanh tẩy hoàn toàn bóng tối.<br><br>Hắc Pháp Sư Muội Than, dù bị thương, đã kịp thời hóa thành một làn khói đen và trốn thoát về phía Bắc. "Ta sẽ trở lại...", tiếng cười của hắn vọng lại trong gió.<br><br>An dìu cha trở về nhà. Dù gia đình đoàn tụ, nhưng An biết rằng, chừng nào chưa thu thập đủ 8 Bánh Răng Vàng để khôi phục toàn bộ sức mạnh của Cây Đèn, Vương Quốc Logic vẫn còn nằm trong mối đe dọa tiềm tàng. Hành trình tạm kết thúc, nhưng thử thách vẫn còn đó.`;
        }

return (
    <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-start pt-10 p-4 animate-in fade-in duration-500 overflow-y-auto">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({length: 50}).map((_, idx) => (
          <div key={idx} className="absolute animate-fall" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 2}s`, animationDuration: `${2 + Math.random() * 2}s`, top: '-20px' }}>
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: ['#fbbf24', '#22d3ee', '#a855f7', '#10b981', '#f472b6'][idx % 5] }} />
          </div>
        ))}
      </div>

      <div className="w-full max-w-2xl flex flex-col items-center min-h-full pb-10 relative z-10">
        <div className="text-6xl md:text-8xl landscape:text-5xl mb-4 animate-bounce">{i}</div>
        <h2 className={tClass}>{tText}</h2>
        <p className="text-slate-400 text-sm mb-6 uppercase tracking-widest">{sText}</p>

        <div className="bg-slate-900/80 border border-slate-700 p-6 rounded-2xl w-full mb-6">
          <div className="flex justify-around items-center mb-4">
            <div className="text-center">
              <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-1">Xếp Hạng</p>
              <div className={rClass}>{r}</div>
            </div>
            <div className="text-center">
              <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-1">Bánh Răng</p>
              <div className="text-2xl font-black text-amber-400">{gears}/8 ⚙️</div>
            </div>
            <div className="text-center">
              <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-1">Tối Ưu</p>
              <div className="text-2xl font-black text-emerald-400">{optimizedGames}/8</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full text-center shadow-2xl mb-6">
          <div className="text-slate-300 text-sm leading-relaxed text-justify" dangerouslySetInnerHTML={{__html: desc}} />
        </div>

        <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 p-4 rounded-xl w-full text-center mb-6">
          <p className="text-indigo-300 text-sm font-medium mb-2">✨ Cảm ơn bạn đã trải nghiệm Hành Trình Của An! ✨</p>
          <p className="text-slate-400 text-xs">Nếu bạn thích game này, hãy chia sẻ với bạn bè nhé!</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-700 p-4 rounded-xl w-full mb-6">
          <div className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-3">📊 Thành Tích Của Bạn</div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-800/50 rounded-lg p-2">
              <div className="text-lg font-black text-emerald-400">{Object.values(progress).filter(p => p.done).length}</div>
              <div className="text-[10px] text-slate-500">Màn Hoàn Thành</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-2">
              <div className="text-lg font-black text-amber-400">{optimizedGames}</div>
              <div className="text-[10px] text-slate-500">Màn Tối Ưu</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-2">
              <div className="text-lg font-black text-cyan-400">{gears}</div>
              <div className="text-[10px] text-slate-500">Bánh Răng</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-700 p-4 rounded-xl w-full mb-6">
          <div className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-3">🏆 Bảng Xếp Hạng</div>
          <HighScores gears={gears} rank={r} />
        </div>

        <button
          onClick={() => resetJourney(true)}
          className="px-10 py-4 landscape:py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black rounded-full text-lg hover:scale-105 transition shadow-[0_0_30px_rgba(99,102,241,0.4)] shrink-0"
        >
          CHƠI LẠI TỪ ĐẦU
        </button>
      </div>
    </div>
  )
  }

    const { idx } = useGame();
    // Safety check: When winning the last game, idx increments, potentially going out of bounds.
    // However, this component handles 'isEnding' (the state after last game) above.
    // If we are here, isEnding is FALSE, so we are showing a normal win screen.
    // nextStory is for the 'Next Chapter' preview.
    const nextStory = STORY[idx + 1];

    return (
        <div className="absolute inset-0 z-50 bg-[#020617] flex items-center justify-center p-4 animate-in zoom-in duration-300">
            {/* Main Container: Flex Col on Portrait, Row on Landscape */}
            <div className="flex flex-col landscape:flex-row items-center justify-center landscape:justify-between w-full h-full max-w-6xl gap-6 landscape:gap-12 landscape:px-10">
                
                {/* 
                  UPDATED LAYOUT FOR LANDSCAPE: 
                  Left Side (Landscape) = Next Story (Larger)
                  Right Side (Landscape) = Victory Info (Smaller)
                */}

                {/* 1. NEXT CHAPTER PREVIEW (Portrait: Bottom / Landscape: Left) */}
                {nextStory && (
                    <div className="order-2 landscape:order-1 bg-slate-800/50 border border-slate-700 p-6 rounded-2xl w-full landscape:w-2/3 landscape:h-auto backdrop-blur-sm relative overflow-hidden group flex flex-col max-h-[40vh] landscape:max-h-[80vh] shadow-2xl">
                        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                        <div className="shrink-0 mb-4 border-b border-slate-700 pb-2">
                            <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">CHƯƠNG TIẾP THEO</div>
                            <h3 className="text-2xl landscape:text-3xl font-serif font-bold text-white">{nextStory.title}</h3>
                        </div>
                        <div className="text-slate-300 text-sm landscape:text-lg leading-relaxed overflow-y-auto custom-scrollbar pr-2 flex-1">
                            {nextStory.text}
                        </div>
                    </div>
                )}

                {/* 2. VICTORY STATUS (Portrait: Top / Landscape: Right) */}
                <div className="order-1 landscape:order-2 flex flex-col items-center justify-center landscape:items-center landscape:w-1/3 shrink-0 text-center">
                    {/* Icon: mb-10 default, landscape:mb-2 to bring it closer/lower */}
                    <div className="text-6xl landscape:text-7xl mb-10 landscape:mb-2 animate-bounce">🎉</div>
                    
                    {/* Text: increased line-height to 2.2 (leading-[2.2]) to separate lines */}
                    <h2 className="text-4xl landscape:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-4 drop-shadow-lg leading-[2.2] py-4">
                        CHIẾN THẮNG!
                    </h2>
                    
                    {/* Updated text size for mobile landscape: max-md:landscape:text-[10px] and whitespace-nowrap */}
                    <p className="text-slate-400 font-medium mb-8 text-lg max-md:landscape:text-[10px] md:landscape:text-xl whitespace-nowrap">
                        {opt ? "Hoàn thành xuất sắc! (Đã nhận Bánh Răng)" : "Hoàn thành! (Chưa tối ưu)"}
                    </p>
                    
                    <button 
                        onClick={onNext} 
                        autoFocus
                        className="group relative px-10 py-4 bg-white text-slate-900 font-black rounded-full text-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center gap-2"
                    >
                        TIẾP TỤC 
                        <span className="group-hover:translate-x-1 transition-transform">➜</span>
                    </button>
                    <div className="mt-4 text-slate-600 text-xs font-mono">Nhấn Enter để tiếp tục</div>
                </div>

            </div>
        </div>
    );
};

const GameArea = () => {
    const { idx, completeLevel, showToast, toast, unlockedCompanions, usedSkills, useSkill, goToChapter, playSound, resetLevelItems, statusText } = useGame();
    const story = STORY[idx];
    const [hintModalOpen, setHintModalOpen] = useState(false);
    const [gameKey, setGameKey] = useState(0); 
    
    // Ref no longer needed for skip logic since we use handleWin(false) directly
    const gameRef = useRef<any>(null);

    const [successState, setSuccessState] = useState<{ opt: boolean } | null>(null);
    const soundPlayed = useRef<number>(-1);

    useEffect(() => {
        setGameKey(0);
        setSuccessState(null); 
    }, [idx]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (successState && e.key === 'Enter') {
                handleNextLevel();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [successState, idx]);

    const handleWin = (opt: boolean) => {
        if (soundPlayed.current !== idx) {
            playSound('win');
            soundPlayed.current = idx;
        }

        // SPECIAL CASE FOR GAME 8 (Balls)
        // If we win the last game, do NOT show the normal success overlay.
        // Instead, complete the level and immediately jump to the ending.
        if (story.id === 'c8') {
            completeLevel(opt);
            // Force jump to next chapter immediately (idx + 1), bypassing state validation check delay
            // Pass true to force the jump
            setTimeout(() => {
                goToChapter(idx + 1, true); 
            }, 100);
            return; 
        }

        completeLevel(opt); 
        setSuccessState({ opt }); 
    };

    const handleSkip = () => {
        // Simplified Skip Logic: Just force a non-optimized win.
        // This solves the Game 8 double-click issue and ensures no gear is awarded.
        showToast("Đã bỏ qua màn chơi!", "warning");
        handleWin(false); 
    };

    const handleFail = () => {
        playSound('fail');
        showToast("Thất bại! Đang reset...", "error");
        setTimeout(() => {
            resetLevelItems(idx);
            setGameKey(prev => prev + 1); 
        }, 2000);
    };

    const handleReset = () => {
        playSound('click');
        resetLevelItems(idx); 
        setGameKey(prev => prev + 1);
    };

    const handleNextLevel = () => {
        playSound('click');
        goToChapter(idx + 1);
    };

    const isEnding = !story; 

    const renderGame = () => {
        if (isEnding) return null;

        // NEW: Show Cover Art for Intro Chapter
        if (story.id === 'intro') {
             return (
                 <div className="flex items-center justify-center h-full w-full p-6 animate-in fade-in duration-1000">
                     <div className="relative w-full max-w-[500px] aspect-square rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(79,70,229,0.15)] border border-slate-800/80 group">
                         <img 
                             src="/Icon512.png" 
                             alt="Hành Trình Của An Art" 
                             className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-in-out" 
                         />
                         {/* Subtle overlay */}
                         <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent pointer-events-none"></div>
                     </div>
                 </div>
             );
        }
        
        switch(story.game) {
            case 'switches': return <GameSwitches onWin={handleWin} onFail={handleFail} />;
            case 'jugs': return <GameJugs onWin={handleWin} onFail={handleFail} />;
            case 'graph': return <GameGraph onWin={handleWin} onFail={handleFail} />;
            case 'river': return <GameRiver onWin={handleWin} onFail={handleFail} />;
            case 'cat': return <GameCat onWin={handleWin} onFail={handleFail} />;
            case 'spider': return <GameSpider onWin={handleWin} onFail={handleFail} />;
            case 'horses': return <GameHorses onWin={handleWin} onFail={handleFail} />;
            // Pass ref to GameBalls (optional now, but kept for future use)
            case 'balls': return <GameBalls ref={gameRef} onWin={handleWin} onFail={handleFail} />;
            default: return <div className="p-10 text-center text-slate-500 italic">...</div>;
        }
    };

    return (
        <div className="flex-1 bg-[#020617] relative overflow-hidden flex flex-col w-full">
            {story && (
                <div className="flex justify-between items-center p-2 px-4 landscape:py-1 landscape:px-4 border-b border-slate-800 bg-slate-900 z-30 shrink-0 h-14 landscape:h-10 landscape:min-h-0">
                    <div className="flex items-center gap-3">
                        <span className="text-[9px] text-slate-500 font-bold uppercase">Trạng thái</span>
                        <span className="font-mono text-2xl landscape:text-lg text-emerald-400 font-black">{statusText}</span>
                    </div>
                    {story.game && (
                        <div className="flex gap-2">
                            <button onClick={handleReset} className="px-3 py-1.5 landscape:py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 rounded text-xs font-bold transition">↺ Reset</button>
                            <button onClick={() => setHintModalOpen(true)} className="px-3 py-1.5 landscape:py-1 bg-amber-900/30 hover:bg-amber-800 text-amber-200 border border-amber-700/50 rounded text-xs font-bold transition">💡 Gợi ý</button>
                            <button onClick={handleSkip} className="px-3 py-1.5 landscape:py-1 bg-rose-900/20 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded text-xs font-bold transition">⏩ SKIP</button>
                        </div>
                    )}
                </div>
            )}
            
            <div className="flex-1 overflow-y-auto w-full relative">
                <div key={gameKey} className="h-full">
                    {renderGame()}
                </div>
                
                {(successState || isEnding) && (
                    <SuccessScreen 
                        onNext={handleNextLevel} 
                        opt={successState ? successState.opt : false} 
                        isEnding={isEnding}
                    />
                )}
            </div>
            
            {/* Hint Modal - Fixed Scrolling & Layout */}
            {hintModalOpen && story && (
                <div className="fixed z-50 inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 modal-enter" onClick={() => setHintModalOpen(false)}>
                    {/* Added max-h and flex-col for internal scrolling */}
                    <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center p-4 border-b border-slate-700 bg-slate-800 shrink-0">
                            <h3 className="text-lg font-bold text-amber-500">Trung Tâm Chiến Thuật</h3>
                            <button onClick={() => setHintModalOpen(false)} className="text-slate-400 hover:text-white text-2xl">&times;</button>
                        </div>
                        {/* Internal Scrolling Content */}
                        <div className="p-4 space-y-4 overflow-y-auto custom-scrollbar">
                            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                                <div className="text-xs font-bold text-slate-400 uppercase mb-2">GỢI Ý CƠ BẢN</div>
                                <p className="text-slate-300 text-sm italic">{story.hint || 'Không có gợi ý.'}</p>
                            </div>
                            <div className="space-y-2">
                                {Object.entries(COMPANIONS).map(([key, comp]) => {
                                    const isUnlocked = unlockedCompanions.includes(key);
                                    const isUsed = usedSkills[idx]?.[key];
                                    
                                    return (
                                        <div key={key} className={`bg-slate-800 p-4 rounded-lg border border-slate-700 ${!isUnlocked ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xl">{comp.icon}</span>
                                                    <div className="flex flex-col">
                                                        <span className={`font-bold text-sm ${!isUnlocked ? 'text-slate-500' : comp.color}`}>{comp.name}</span>
                                                        <span className="text-[10px] text-slate-500 uppercase">{isUnlocked ? 'Sẵn sàng' : 'Chưa mở khóa'}</span>
                                                    </div>
                                                </div>
                                                {!isUnlocked && <span className="text-xs font-bold text-slate-600 bg-slate-900 px-2 py-1 rounded">LOCKED</span>}
                                            </div>
                                            {isUnlocked ? (
                                                <>
                                                    <button 
                                                        onClick={() => useSkill(key)}
                                                        disabled={isUsed}
                                                        className={`w-full py-2 rounded-lg font-bold text-sm ${isUsed ? 'bg-slate-700 text-slate-500' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}
                                                    >
                                                        {isUsed ? 'Đã sử dụng' : 'KÍCH HOẠT (1 Lần)'}
                                                    </button>
                                                    {isUsed && (
                                                        <div className={`mt-2 p-2 bg-slate-950 rounded text-sm ${comp.color} visible animate-in fade-in`}>
                                                            {key === 'dog' && (story.hint2 || "Gâu! Gâu!")}
                                                            {key === 'bear' && (story.guide || "Hãy suy nghĩ kỹ.")}
                                                            {key === 'robo' && (story.math || "Đang tính toán...")}
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="text-[10px] text-slate-600 italic mt-1 border-t border-slate-700/50 pt-1">
                                                    Hoàn thành các chương trước để mở khóa nhân vật này.
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
<div className="fixed top-5 right-5 z-[200] flex flex-col gap-2 pointer-events-none">
        {toast && (
          <div className={`toast-enter pointer-events-auto px-6 py-3 rounded-lg shadow-xl text-white font-bold text-sm flex items-center gap-3 border-l-4 bg-slate-800 ${
            toast.type === 'error' ? 'border-rose-500' :
            toast.type === 'event' ? 'border-amber-400 bg-gradient-to-r from-indigo-950 to-slate-900' :
            toast.type === 'warning' ? 'border-orange-500' :
            'border-indigo-500'
          }`}>
            {toast.msg}
          </div>
        )}
      </div>

      {/* Tutorial Modal - Shows on first time playing each game */}
      {story?.game && <TutorialModal gameId={story.game} />}
    </div>
  );
};

const Main = () => {
  // Lift state for Story Panel to control it from HeaderMobile
  const [storyExpanded, setStoryExpanded] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const { idx, toggleSound } = useGame();
  const story = STORY[idx];

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case '?':
          e.preventDefault();
          setShowHelp(prev => !prev);
          break;
        case 'm':
          e.preventDefault();
          toggleSound();
          break;
        case 's':
          e.preventDefault();
          setStoryExpanded(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSound]);

  const helpShortcuts = [
    { key: '?', description: 'Hiện/Ẩn phím tắt' },
    { key: 'M', description: 'Bật/Tắt âm thanh' },
    { key: 'S', description: 'Thu gọn/Mở rộng cốt truyện' },
    { key: 'Enter', description: 'Tiếp tục (khi đã hoàn thành màn)' },
    { key: 'R', description: 'Reset màn chơi (trong game)' },
  ];

  return (
        <div className="flex h-screen bg-slate-950 text-slate-200">
            <Sidebar />
            <div className="flex-1 flex flex-col relative pt-14 md:pt-0 overflow-hidden h-full">
                {/* Pass Story Title and Toggle function to HeaderMobile for Landscape mode */}
                <HeaderMobile 
                    chapterTitle={story?.title}
                    toggleStoryPanel={() => setStoryExpanded(prev => !prev)}
                />
                
                <StoryAccordion 
                    expanded={storyExpanded}
                    setExpanded={setStoryExpanded}
                />
<GameArea />

      {/* Help Modal - Keyboard Shortcuts */}
      {showHelp && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setShowHelp(false)}>
          <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-indigo-900/50 to-slate-900 p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">⌨️</div>
                <div>
                  <div className="text-[10px] text-indigo-400 uppercase tracking-widest font-bold">Phím tắt</div>
                  <div className="text-white font-bold">Keyboard Shortcuts</div>
                </div>
              </div>
              <button onClick={() => setShowHelp(false)} className="text-slate-400 hover:text-white text-2xl leading-none">&times;</button>
            </div>
            <div className="p-4 space-y-3">
              {helpShortcuts.map((shortcut, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <span className="text-slate-400 text-sm">{shortcut.description}</span>
                  <kbd className="px-3 py-1.5 bg-slate-700 border border-slate-600 rounded text-indigo-300 font-mono text-sm font-bold shadow-inner">
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-slate-800 text-center">
              <p className="text-slate-500 text-xs">Nhấn ? hoặc click bên ngoài để đóng</p>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
  );
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <GameProvider>
        <Main />
      </GameProvider>
    </ErrorBoundary>
  );
};

export default App;