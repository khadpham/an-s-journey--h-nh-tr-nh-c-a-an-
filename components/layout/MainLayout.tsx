import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { STORY, ITEMS } from '../../config/gameContent';

export const Sidebar = () => {
  const {
    progress, idx, gears, inventory, resetJourney, goToChapter,
    toggleSidebar, isSidebarCollapsed, usedItems, setPendingItem, pendingItems,
    soundEnabled, toggleSound
  } = useGame();

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Calculate stats
  const totalChapters = STORY.filter(s => s.type === 'game').length;
  const completedChapters = Object.values(progress).filter(p => p.done).length;
  const optimizedChapters = Object.values(progress).filter(p => p.opt).length;
  const completionPercent = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;

  let lastPart = '';
    
    // UPDATED: Mobile collapsed state now forces w-0, no border.
    // Desktop: w-72 or w-[80px].
    const widthClass = isSidebarCollapsed ? 'w-0 border-none md:w-[80px] md:border-r' : 'w-72 border-r';
    const translateClass = isSidebarCollapsed ? '-translate-x-full md:translate-x-0' : 'translate-x-0';

    return (
        <>
            {/* Mobile Overlay (Portrait only) */}
            {!isSidebarCollapsed && (
                <div 
                    className="fixed inset-0 bg-black/80 z-40 md:hidden landscape:hidden backdrop-blur-sm"
                    onClick={toggleSidebar}
                ></div>
            )}
            
            {/* Reset Confirm Modal */}
            {showResetConfirm && (
                <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur flex items-center justify-center p-4 modal-enter">
                    <div className="bg-slate-900 border border-red-500/50 rounded-xl p-6 max-w-sm w-full text-center shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                        <div className="text-4xl mb-4">⚠️</div>
                        <h3 className="text-xl font-bold text-red-500 mb-2">CẢNH BÁO</h3>
                        <p className="text-slate-300 text-sm mb-6">Bạn có chắc chắn muốn xóa toàn bộ hành trình và chơi lại từ đầu không? Hành động này không thể hoàn tác.</p>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setShowResetConfirm(false)}
                                className="flex-1 py-3 bg-slate-800 text-slate-300 font-bold rounded hover:bg-slate-700"
                            >
                                HỦY
                            </button>
                            <button 
                                onClick={() => { resetJourney(true); setShowResetConfirm(false); }}
                                className="flex-1 py-3 bg-red-600 text-white font-bold rounded hover:bg-red-500 shadow-lg"
                            >
                                ĐỒNG Ý
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Sidebar Container: removed overflow-hidden here to let the toggle button stick out */}
            <aside className={`fixed inset-y-0 left-0 h-full z-50 transition-all duration-300 flex flex-col ${widthClass} ${translateClass} md:relative md:translate-x-0`}>
                
                {/* Inner Content Wrapper: This handles the background and scrolling */}
                <div className="flex-1 flex flex-col w-full h-full bg-slate-900 overflow-hidden relative border-r border-slate-800">
                    
                    {/* Header Section with Icon */}
                    <div className={`p-4 border-b border-slate-800 flex items-center h-[70px] md:h-[90px] shrink-0 ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
                        <div className="flex items-center gap-3 overflow-hidden">
                            {/* Icon - Always visible */}
                            <img 
                                src="/Icon512.png" 
                                alt="Logo" 
                                className="w-10 h-10 md:w-12 md:h-12 rounded-xl shadow-lg shadow-indigo-500/20 shrink-0 object-cover border border-slate-700" 
                            />
                            
                            {/* Text - Hidden when collapsed */}
                            <div className={`${isSidebarCollapsed ? 'hidden' : 'block'} overflow-hidden transition-all duration-300`}>
                                <h1 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 whitespace-nowrap uppercase">Hành Trình của An</h1>
                                <div className="text-[10px] text-slate-500 font-bold mt-1 tracking-widest">v58.0 APP</div>
                            </div>
                        </div>
                        {/* Close button: Mobile only */}
                        <button onClick={toggleSidebar} className="md:hidden text-slate-400 text-2xl">&times;</button>
                    </div>

                    <nav className="flex-1 overflow-y-auto pb-4 p-2 custom-scrollbar">
                        {STORY.map((d, i) => {
                            const showHeader = d.part !== lastPart;
                            if (showHeader) lastPart = d.part;

                            const isDone = progress[d.id]?.done;
                            const isOpt = progress[d.id]?.opt;
                            const isCurrent = i === idx;
                            const prevStory = i > 0 ? STORY[i-1] : null;
                            const isPrevDone = prevStory ? (progress[prevStory.id]?.done || prevStory.type === 'text') : true;
                            const isLocked = !isPrevDone && i > idx;
                            
                            let st = 'text-slate-500 cursor-not-allowed';
                            let ic = '🔒';
                            
                            if (!isLocked) st = 'text-slate-300 hover:bg-slate-800 cursor-pointer';
                            if (isCurrent) st = 'text-indigo-400 bg-indigo-950/30 border-r-2 border-indigo-500 font-bold';
                            if (isDone) { st = 'text-emerald-400'; ic = '✅'; }
                            if (isOpt) { st = 'text-amber-400 font-bold'; ic = '⚙️'; }

                            if (d.id === 'intro') {
                                ic = isCurrent ? '📖' : '📜';
                                if (isCurrent) st = 'text-indigo-400 font-bold';
                                else st = 'text-slate-400 hover:text-white cursor-pointer';
                            }

                            const shortTitle = d.title.includes(':') ? d.title.split(':')[1].trim() : d.title;

                            const handleClick = () => {
                                if (!isLocked) {
                                    goToChapter(i);
                                    if (window.innerWidth < 768 && window.innerHeight > window.innerWidth) {
                                        toggleSidebar();
                                    }
                                }
                            };
                            
                            const gameIndex = i > 0 ? i : '';

                            return (
                                <React.Fragment key={d.id}>
                                    {showHeader && !isSidebarCollapsed && (
                                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-4 mb-2 px-3">
                                            {d.part}
                                        </div>
                                    )}
                                    <div onClick={handleClick} className={`flex items-center px-3 py-3 md:py-2 rounded-md transition-all mb-1 gap-3 ${st} ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                                        <div className="flex items-center gap-1 min-w-[24px] justify-center">
                                            <span className="text-xl md:text-lg">{ic}</span>
                                            {gameIndex && !isSidebarCollapsed && <span className="text-[10px] font-bold opacity-70 translate-y-1">{gameIndex}.</span>}
                                        </div>
                                        <span className={`truncate text-sm ${isSidebarCollapsed ? 'hidden' : 'block'}`}>{shortTitle}</span>
                                    </div>
                                </React.Fragment>
                            );
                        })}
                    </nav>

                    {/* Inventory Section */}
                    <div className={`p-4 border-t border-slate-800 bg-slate-900/50 shrink-0 ${isSidebarCollapsed ? 'px-0 md:px-2' : ''}`}>
                        <div className={`text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ${isSidebarCollapsed ? 'hidden' : 'block'}`}>KHO VẬT PHẨM</div>
                        
<div className={`grid gap-2 mb-4 ${isSidebarCollapsed ? 'grid-cols-1 justify-items-center' : 'grid-cols-4'}`}>
            {ITEMS.map(it => {
              if (!inventory.includes(it.id)) return null;
              const currentStory = STORY[idx];
              const isUsable = currentStory && currentStory.game === it.gameId;
              const isUsed = usedItems[idx]?.[it.id];
              const isPending = pendingItems[idx] === it.id;
              const cls = `w-10 h-10 rounded border flex items-center justify-center text-xl transition-all ${
                isUsed ? 'bg-slate-800 border-slate-700 opacity-50 grayscale' :
                isPending ? 'bg-amber-600 border-amber-400 cursor-pointer shadow-[0_0_10px_rgba(245,158,11,0.5)]' :
                (isUsable ? 'bg-indigo-600 border-indigo-400 cursor-pointer animate-pulse hover:scale-105 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-slate-800 border-slate-700 opacity-50')
              }`;
              return (
                <button key={it.id} className={cls} title={it.name} onClick={() => isUsable && !isUsed && !isPending && setPendingItem(it.id)}>
                  {it.icon}
                </button>
              );
            })}
          </div>
                        
                        <div className={`flex items-center bg-slate-800 p-3 rounded-lg border border-slate-700 shadow-inner mb-3 ${isSidebarCollapsed ? 'flex-col justify-center p-2 gap-1' : 'justify-between'}`}>
                            {isSidebarCollapsed ? (
                                <>
                                    <span className="text-xs font-bold text-amber-400">⚙️</span>
                                    <span className="text-xs font-black text-white">{gears}/8</span>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center space-x-2"><span className="text-xl">⚙️</span><span className="text-xs font-bold text-amber-400 uppercase">Bánh Răng</span></div>
                                    <span className="text-xl font-black text-white">{gears}/8</span>
                                </>
)}
  </div>

  {/* Stats Section */}
  {!isSidebarCollapsed && (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-3 mb-3">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] text-slate-500 font-bold uppercase">Tiến Độ</span>
        <span className="text-xs font-bold text-emerald-400">{completionPercent}%</span>
      </div>
      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden mb-2">
        <div
          className="h-full bg-gradient-to-r from-emerald-600 to-cyan-500 transition-all duration-500 rounded-full"
          style={{ width: `${completionPercent}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-slate-500">
        <span>Hoàn thành: <span className="text-emerald-400 font-bold">{completedChapters}/{totalChapters}</span></span>
        <span>Tối ưu: <span className="text-amber-400 font-bold">{optimizedChapters}/{totalChapters}</span></span>
      </div>
    </div>
  )}

  <button
  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowResetConfirm(true); }}
  className={`w-full py-2 bg-red-900/30 hover:bg-red-900/50 border border-red-800 text-red-400 text-[10px] font-bold rounded uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer ${isSidebarCollapsed ? 'px-0' : ''}`}
  title="Xóa hành trình"
>
  <span>🗑️</span> <span className={isSidebarCollapsed ? 'hidden' : 'inline'}>XÓA HÀNH TRÌNH</span>
</button>

    <button
  onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleSound(); }}
  className={`w-full py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 text-[10px] font-bold rounded uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer ${isSidebarCollapsed ? 'px-0' : ''}`}
  title={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
>
  <span>{soundEnabled ? '🔊' : '🔇'}</span> <span className={isSidebarCollapsed ? 'hidden' : 'inline'}>{soundEnabled ? 'TẮT ÂM' : 'BẬT ÂM'}</span>
</button>
                    </div>
                </div>
                
                {/* Desktop Toggle Button: Positioned absolutely relative to <aside>, outside of the inner content flow */}
                {/* Updated z-index to z-[100] to appear above SuccessScreen */}
                <button 
                    onClick={toggleSidebar} 
                    className="hidden md:flex absolute top-1/2 -translate-y-1/2 -right-4 bg-slate-800 border-y border-r border-slate-600 rounded-r-lg w-4 h-16 hover:w-6 hover:bg-slate-700 transition-all z-[100] shadow-lg text-slate-400 items-center justify-center cursor-pointer group"
                    title={isSidebarCollapsed ? "Mở rộng" : "Thu gọn"}
                >
                    <span className="group-hover:text-white font-bold">{isSidebarCollapsed ? '›' : '‹'}</span>
                </button>
            </aside>
        </>
    );
};

export const HeaderMobile = ({ chapterTitle, toggleStoryPanel, toggleHelp }: { chapterTitle?: string, toggleStoryPanel?: () => void, toggleHelp?: () => void }) => {
  const { gears, inventory, toggleSidebar, soundEnabled, toggleSound } = useGame();

  return (
    <div className="md:hidden fixed top-0 w-full h-14 landscape:h-10 landscape:min-h-0 bg-slate-900/95 backdrop-blur border-b border-slate-800 z-50 flex items-center justify-between px-4 shadow-lg shrink-0">
      <div className="flex items-center gap-2 overflow-hidden mr-2 cursor-pointer" onClick={toggleStoryPanel}>
        <img src="/Icon512.png" alt="Icon" className="w-6 h-6 rounded-md shadow-sm" />
        <span className="font-bold text-indigo-400 text-sm landscape:text-xs truncate uppercase whitespace-nowrap">Hành Trình của An</span>
        {chapterTitle && (
          <>
            <span className="hidden landscape:inline text-slate-600">|</span>
            <span className="hidden landscape:inline text-white text-xs truncate font-serif italic hover:text-indigo-300 transition-colors">
              {chapterTitle}
            </span>
            <span className="hidden landscape:inline text-indigo-500 text-[10px] animate-pulse">▼</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <div className="flex gap-1">
          {ITEMS.map(it => inventory.includes(it.id) && <div key={it.id} className="text-sm landscape:text-xs">{it.icon}</div>)}
        </div>
        <button onClick={toggleSound} className="text-lg p-1 active:scale-95 transition-transform" title={soundEnabled ? "Tắt âm" : "Bật âm"}>
          {soundEnabled ? '🔊' : '🔇'}
        </button>
        {toggleHelp && (
          <button onClick={toggleHelp} className="w-7 h-7 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-bold flex items-center justify-center active:scale-95 transition-transform" title="Hướng dẫn">
            i
          </button>
        )}
        <span className="text-amber-400 text-xs font-bold">{gears} ⚙️</span>
        <button onClick={toggleSidebar} className="text-2xl landscape:text-lg p-2 active:scale-95 transition-transform">☰</button>
      </div>
    </div>
  );
};