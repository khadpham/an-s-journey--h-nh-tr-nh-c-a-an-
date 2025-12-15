import { useState, useEffect } from 'react';
import { useGame } from '../../../context/GameContext';

const GameJugs = ({ onWin }: { onWin: (opt: boolean) => void, onFail: () => void }) => {
    const { playSound, showToast, setStatusText } = useGame();
    // [8L, 5L, 3L] current values
    const [jugs, setJugs] = useState<number[]>([8, 0, 0]);
    const caps = [8, 5, 3];
    const [selected, setSelected] = useState<number | null>(null);
    const [history, setHistory] = useState<number[][]>([[8, 0, 0]]);
    const [won, setWon] = useState(false);

    useEffect(() => {
        setStatusText("Mục tiêu: 4L");
    }, [setStatusText]);

    useEffect(() => {
        if (won) return;
        if (jugs.includes(4)) {
            setWon(true);
            setTimeout(() => onWin(history.length <= 8), 500);
        }
    }, [jugs, onWin, history.length, won]);

    const handleSelect = (idx: number) => {
        if (won) return;
        if (selected === null) {
            if (jugs[idx] === 0) {
                showToast("Bình rỗng!", "warning");
                return;
            }
            setSelected(idx);
            playSound('click');
        } else {
            if (selected === idx) {
                setSelected(null);
            } else {
                pour(selected, idx);
                setSelected(null);
            }
        }
    };

    const pour = (from: number, to: number) => {
        const amount = Math.min(jugs[from], caps[to] - jugs[to]);
        
        if (amount === 0) {
            showToast("Đã đầy!", "warning");
            return;
        }

        const newJugs = [...jugs];
        newJugs[from] -= amount;
        newJugs[to] += amount;

        setJugs(newJugs);
        setHistory(prev => [...prev, newJugs]);
        playSound('click');
    };

    const undo = () => {
        if (history.length > 1 && !won) {
            const newHist = [...history];
            newHist.pop();
            setHistory(newHist);
            setJugs(newHist[newHist.length - 1]);
            setSelected(null);
            playSound('click');
        }
    };

    const unitHeight = 40; // 40px per Liter

    return (
        <div className="flex flex-col items-center justify-center h-full w-full p-4 bg-[#050b14] relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                 style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            </div>

            <div className="flex items-end justify-center gap-4 md:gap-12 mb-12 w-full max-w-3xl z-10">
                {jugs.map((level, i) => {
                    const capacity = caps[i];
                    const percent = (level / capacity) * 100;
                    const isSelected = selected === i;
                    
                    return (
                        <div key={i} className="flex flex-col items-center gap-4 group">
                            <div 
                                onClick={() => handleSelect(i)}
                                className={`relative rounded-lg cursor-pointer transition-all duration-300 w-24 md:w-32 bg-slate-800/30 backdrop-blur overflow-hidden border-2 flex flex-col-reverse
                                    ${isSelected 
                                        ? 'border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.2)] scale-105' 
                                        : 'border-slate-600 hover:border-slate-500'
                                    }`}
                                style={{ height: `${capacity * unitHeight}px` }}
                            >
                                {/* Measurement Lines - Flex column reverse to stack from bottom */}
                                <div className="absolute inset-0 w-full h-full flex flex-col-reverse z-20 pointer-events-none opacity-40">
                                    {Array.from({length: capacity}).map((_, idx) => (
                                        <div key={idx} className="w-full border-t border-white/50 box-border" style={{height: `${unitHeight}px`}}></div>
                                    ))}
                                </div>

                                {/* Liquid */}
                                <div 
                                    className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-amber-700 via-amber-600 to-amber-500 transition-all duration-700 ease-out jug-water opacity-90"
                                    style={{ height: `${percent}%` }}
                                >
                                    <div className="w-full h-2 bg-amber-300/50 absolute top-0 blur-[2px]"></div>
                                    <div className="w-full h-full animate-pulse opacity-20 bg-white/10"></div>
                                </div>
                                
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                                    <span className="text-3xl font-black text-white drop-shadow-md">{level}</span>
                                </div>
                            </div>
                            
                            <div className="font-mono text-xs text-slate-500 font-bold">
                                MAX: {capacity}L
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex gap-4 z-10">
                <button 
                    onClick={undo} 
                    disabled={history.length <= 1 || won}
                    className="w-12 h-12 rounded-full border border-slate-600 bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-700 disabled:opacity-50"
                >
                    ↩
                </button>
                <div className="h-12 px-6 bg-slate-900 border border-slate-700 rounded flex items-center font-mono text-cyan-400">
                    BƯỚC: {String(history.length - 1).padStart(2, '0')}
                </div>
                <button 
                    onClick={() => { setJugs([8,0,0]); setHistory([[8,0,0]]); setSelected(null); setWon(false); }}
                    className="w-12 h-12 rounded-full border border-slate-600 bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-700"
                >
                    ↺
                </button>
            </div>
        </div>
    );
};

export default GameJugs;