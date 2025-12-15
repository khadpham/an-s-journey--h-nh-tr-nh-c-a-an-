import { useState, useEffect } from 'react';
import { useGame } from '../../../context/GameContext';

type Char = 'dog' | 'an' | 'guest' | 'bear' | 'robo';

interface Character {
    id: Char;
    icon: string;
    speed: number;
    color: string;
    neon: string;
}

const CHARS: Character[] = [
    { id: 'dog', icon: '🐕', speed: 1, color: 'text-yellow-400', neon: 'border-yellow-400 shadow-[0_0_10px_#facc15]' },
    { id: 'an', icon: '🏃', speed: 3, color: 'text-blue-400', neon: 'border-blue-400 shadow-[0_0_10px_#60a5fa]' },
    { id: 'guest', icon: '🥷', speed: 6, color: 'text-rose-400', neon: 'border-rose-400 shadow-[0_0_10px_#fb7185]' },
    { id: 'bear', icon: '🐻', speed: 8, color: 'text-amber-700', neon: 'border-amber-700 shadow-[0_0_10px_#b45309]' },
    { id: 'robo', icon: '🤖', speed: 12, color: 'text-cyan-400', neon: 'border-cyan-400 shadow-[0_0_10px_#22d3ee]' }
];

const GameRiver = ({ onWin, onFail }: { onWin: (opt: boolean) => void, onFail: () => void }) => {
    const { playSound, showToast, setStatusText } = useGame();
    const [left, setLeft] = useState<Char[]>(['dog', 'an', 'guest', 'bear', 'robo']);
    const [right, setRight] = useState<Char[]>([]);
    const [lampLeft, setLampLeft] = useState(true);
    const [time, setTime] = useState(0);
    const [selected, setSelected] = useState<Char[]>([]);
    const [moving, setMoving] = useState(false);
    const [won, setWon] = useState(false);

    useEffect(() => {
        setStatusText(`${time}/30s`);
    }, [time, setStatusText]);

    useEffect(() => {
        if (won) return;
        if (right.length === 5 && time <= 30) {
            setWon(true);
            setTimeout(() => onWin(true), 800);
        } else if (time > 30) {
            onFail();
        }
    }, [right, time, onWin, onFail, won]);

    const toggleSelect = (id: Char) => {
        if (moving || won) return;

        const isLeft = left.includes(id);
        if (isLeft !== lampLeft) {
            showToast("Cần có đèn để đi!", "warning");
            return;
        }

        if (selected.includes(id)) {
            setSelected(selected.filter(c => c !== id));
        } else {
            if (selected.length >= 2) return;
            setSelected([...selected, id]);
        }
        playSound('click');
    };

    const go = () => {
        if (selected.length === 0) return;
        setMoving(true);
        playSound('click');
        
        const cost = Math.max(...selected.map(id => CHARS.find(c => c.id === id)!.speed));

        setTimeout(() => {
            setTime(t => t + cost);
            if (lampLeft) {
                setLeft(l => l.filter(c => !selected.includes(c)));
                setRight(r => [...r, ...selected]);
            } else {
                setRight(r => r.filter(c => !selected.includes(c)));
                setLeft(l => [...l, ...selected]);
            }
            setLampLeft(!lampLeft);
            setSelected([]);
            setMoving(false);
        }, 1000);
    };

    const renderChar = (id: Char, isOnBridge: boolean = false) => {
        const char = CHARS.find(c => c.id === id)!;
        const isSel = selected.includes(id);
        return (
            <div 
                key={id}
                onClick={() => toggleSelect(id)}
                className={`
                    relative flex flex-col items-center justify-center 
                    w-12 h-12 md:w-16 md:h-20 rounded-lg border-2 cursor-pointer transition-all duration-300
                    ${isOnBridge 
                        ? `bg-black/50 ${char.neon}` 
                        : isSel ? `bg-slate-800 ${char.neon} scale-105` : 'bg-slate-900 border-slate-700 hover:border-slate-500'}
                `}
            >
                <div className="text-xl md:text-3xl mb-1">{char.icon}</div>
                <div className={`text-[9px] md:text-[10px] font-bold ${char.color}`}>{char.speed}s</div>
            </div>
        );
    };

    const renderGoButton = () => (
        !moving && selected.length > 0 ? (
            <button 
                onClick={go}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-orange-600 hover:bg-orange-500 border-4 border-orange-400 shadow-[0_0_30px_rgba(249,115,22,0.6)] flex flex-col items-center justify-center text-white font-black text-sm active:scale-95 transition-transform animate-in fade-in zoom-in"
            >
                <span className="text-xl">⚡</span>
                GO
            </button>
        ) : (
             <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-slate-800 bg-black/50 flex items-center justify-center text-[10px] text-slate-600 text-center p-2 italic font-bold">
                 CHỌN NGƯỜI
             </div>
        )
    );

    return (
        <div className="flex flex-col items-center h-full w-full pt-4 px-2 select-none overflow-y-auto pb-4 bg-black">
            <div className="flex justify-between w-full max-w-4xl mb-4 items-center shrink-0 z-10 landscape:mb-1">
                 {/* Removed old time display since it's now in header */}
                 <div className="text-[10px] text-slate-500 font-bold uppercase">CÂY CẦU NĂNG LƯỢNG</div>
                <button onClick={() => { setTime(0); setLeft(['dog','an','guest','bear','robo']); setRight([]); setLampLeft(true); setMoving(false); setSelected([]); setWon(false); }} className="px-4 py-2 bg-slate-900 border border-slate-700 rounded text-xs font-bold text-slate-400">
                    ↺ RESET
                </button>
            </div>

            {/* Container - Landscape Mode logic applied here via landscape: class */}
            <div className="flex flex-col landscape:flex-row md:flex-row w-full max-w-5xl md:h-[340px] landscape:h-[300px] bg-[#050b14] rounded-2xl border border-slate-800 overflow-hidden relative min-h-[500px] landscape:min-h-0 md:min-h-0 shadow-2xl">
                
                {/* Left Bank */}
                <div className="flex-1 landscape:flex-none md:flex-none md:w-1/3 landscape:w-1/3 border-b landscape:border-b-0 md:border-b-0 md:border-r landscape:border-r border-slate-800 bg-slate-900/50 p-2 flex flex-col relative min-h-[120px]">
                    <div className="text-[10px] font-bold text-slate-500 uppercase mb-2 text-center">BỜ VỰC (START)</div>
                    <div className="flex flex-wrap content-start gap-2 justify-center">
                        {left.map(id => !selected.includes(id) && renderChar(id))}
                    </div>
                </div>

                {/* Abyss / Bridge Area */}
                <div className="flex-[2] bg-black relative flex flex-row landscape:flex-col md:flex-col min-h-[220px] overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-black to-black opacity-80"></div>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>

                    {/* The Bridge - Laser Beam */}
                    <div className="absolute w-1 h-full landscape:w-full landscape:h-1 md:w-full md:h-1 bg-cyan-500/20 left-1/2 -translate-x-1/2 landscape:left-0 landscape:translate-x-0 landscape:top-1/2 landscape:-translate-y-1/2 md:left-0 md:translate-x-0 md:top-1/2 md:-translate-y-1/2 blur-sm"></div>
                    <div className="absolute w-[2px] h-full landscape:w-full landscape:h-[2px] md:w-full md:h-[2px] bg-cyan-400 left-1/2 -translate-x-1/2 landscape:left-0 landscape:translate-x-0 landscape:top-1/2 landscape:-translate-y-1/2 md:left-0 md:translate-x-0 md:top-1/2 md:-translate-y-1/2 shadow-[0_0_15px_#22d3ee]"></div>

                    {/* Bridge Lane */}
                    <div className="flex-1 relative flex flex-col landscape:flex-row md:flex-row items-center justify-center z-10">
                        
                        {/* Lamp Indicator */}
                        {!moving && (
                            <div className={`absolute transition-all duration-300 z-10
                                landscape:top-1/3 landscape:left-auto landscape:right-auto md:top-1/3 md:left-auto md:right-auto
                                ${lampLeft 
                                    ? 'top-4 landscape:top-auto landscape:left-4 md:top-auto md:left-4 left-1/2 -translate-x-1/2 landscape:translate-x-0 md:translate-x-0' 
                                    : 'bottom-4 landscape:bottom-auto landscape:right-4 md:bottom-auto md:right-4 left-1/2 -translate-x-1/2 landscape:translate-x-0 md:translate-x-0'}
                            `}>
                                <div className="text-2xl animate-bounce bg-black rounded-full p-1 border border-amber-500 shadow-[0_0_20px_#f59e0b]">🏮</div>
                            </div>
                        )}

                        {/* Moving Group */}
                        <div className={`absolute flex items-center gap-2 transition-all duration-1000 ease-linear z-30
                            ${moving ? 'opacity-100' : 'opacity-0'}
                            ${lampLeft 
                                ? (moving ? 'landscape:translate-x-[150%] md:translate-x-[150%] translate-y-[150%] landscape:translate-y-0 md:translate-y-0' : 'translate-x-0 translate-y-0') 
                                : (moving ? 'landscape:-translate-x-[150%] md:-translate-x-[150%] -translate-y-[150%] landscape:translate-y-0 md:translate-y-0' : 'translate-x-0 translate-y-0')}
                        `}>
                             <div className="text-2xl bg-black rounded-full border border-amber-500">🏮</div>
                             {selected.map(id => <div key={id} className="text-3xl filter drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">{CHARS.find(c=>c.id===id)?.icon}</div>)}
                        </div>
                        
                        {/* Static Selection Display on Bridge */}
                        {!moving && selected.length > 0 && (
                            <div className={`absolute flex gap-1 transition-all duration-300 items-center justify-center z-20
                                 ${lampLeft 
                                    ? 'landscape:top-1/2 landscape:-translate-y-1/2 landscape:left-16 md:top-1/2 md:-translate-y-1/2 md:left-16 top-16 left-1/2 -translate-x-1/2 flex-col landscape:flex-row md:flex-row' 
                                    : 'landscape:top-1/2 landscape:-translate-y-1/2 landscape:right-16 md:top-1/2 md:-translate-y-1/2 md:right-16 bottom-16 left-1/2 -translate-x-1/2 flex-col-reverse landscape:flex-row-reverse md:flex-row-reverse'}
                            `}>
                                {selected.map(id => renderChar(id, true))}
                            </div>
                        )}
                    </div>

                    {/* Button Container */}
                    <div className="w-24 landscape:w-full md:w-full landscape:h-auto md:h-auto shrink-0 flex items-center justify-center bg-slate-900/80 p-2 border-l landscape:border-l-0 md:border-l-0 landscape:border-t md:border-t border-slate-800 z-20 backdrop-blur">
                         {renderGoButton()}
                    </div>
                </div>

                {/* Right Bank */}
                <div className="flex-1 landscape:flex-none md:flex-none md:w-1/3 landscape:w-1/3 border-t landscape:border-t-0 md:border-t-0 landscape:border-l md:border-l border-slate-800 bg-slate-900/50 p-2 flex flex-col relative min-h-[120px]">
                    <div className="text-[10px] font-bold text-slate-500 uppercase mb-2 text-center">BỜ ĐÍCH (GOAL)</div>
                    <div className="flex flex-wrap content-start gap-2 justify-center">
                        {right.map(id => !selected.includes(id) && renderChar(id))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameRiver;