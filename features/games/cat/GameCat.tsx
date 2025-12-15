import { useState, useEffect } from 'react';
import { useGame } from '../../../context/GameContext';

const GameCat = ({ onWin, onFail }: { onWin: (opt: boolean) => void, onFail: () => void }) => {
    const { playSound, setStatusText } = useGame();
    // Logic "Quantum Cat" / "Rigged":
    const [validPaths, setValidPaths] = useState<number[][]>(() => [1,2,3,4,5].map(p => [p]));
    const [history, setHistory] = useState<{box: number, result: string}[]>([]); 
    const [turn, setTurn] = useState(1);
    const [gameOver, setGameOver] = useState(false);
    const [revealPath, setRevealPath] = useState<number[]>([]); 

    // Calculate Unique Current Positions
    const currentUniquePositions = new Set(validPaths.map(p => p[p.length - 1])).size;

    useEffect(() => {
        const remaining = 10 - turn + 1;
        setStatusText(`Còn ${remaining} lần`);
    }, [turn, setStatusText]);

    const check = (boxIdx: number) => {
        if (gameOver) return;
        playSound('click');
        const box = boxIdx + 1;

        // 1. Filter paths that are NOT at 'box' currently
        const currentPaths = validPaths.filter(path => {
            const currentPos = path[path.length - 1];
            return currentPos !== box;
        });

        const caught = currentPaths.length === 0;

        if (caught) {
            // WIN!
            const winningPath = validPaths.find(p => p[p.length-1] === box) || [];
            setHistory([...history, { box, result: 'BẮT ĐƯỢC!' }]);
            setRevealPath(winningPath);
            setGameOver(true);
            setTimeout(() => onWin(turn <= 6), 1000); // Optimized if caught in 6 turns or less
        } else {
            // CONTINUE
            const nextPaths: number[][] = [];
            currentPaths.forEach(path => {
                const currentPos = path[path.length - 1];
                const candidates = [];
                if (currentPos > 1) candidates.push(currentPos - 1);
                if (currentPos < 5) candidates.push(currentPos + 1);
                
                candidates.forEach(nextPos => {
                    nextPaths.push([...path, nextPos]);
                });
            });

            setHistory([...history, { box, result: 'TRỐNG' }]);
            
            if (turn >= 10) {
                // FAIL
                setGameOver(true);
                const survivor = nextPaths[0]; 
                setRevealPath(survivor.slice(0, turn)); 
                onFail();
            } else {
                setValidPaths(nextPaths);
                setTurn(turn + 1);
            }
        }
    };

    const reset = () => {
        setValidPaths([1,2,3,4,5].map(p => [p]));
        setHistory([]);
        setTurn(1);
        setGameOver(false);
        setRevealPath([]);
        playSound('click');
    };

    return (
        <div className="flex flex-col items-center h-full w-full pt-8 px-4 overflow-y-auto bg-[#020617] font-mono">
             <div className="flex justify-between w-full max-w-4xl mb-6 items-end border-b border-indigo-900/50 pb-2">
                <div>
                    <h3 className="text-xl font-bold text-indigo-400 uppercase tracking-widest">SCANNER SYSTEM</h3>
                </div>
                <div>
                    <button onClick={reset} className="px-4 py-1 bg-slate-900 border border-slate-700 rounded text-xs font-bold text-slate-400 hover:text-white">REBOOT</button>
                </div>
            </div>

            <div className="flex gap-4 mb-6 justify-center w-full">
                {[1, 2, 3, 4, 5].map(i => (
                    <button 
                        key={i} 
                        onClick={() => check(i-1)}
                        disabled={gameOver}
                        className={`
                            relative w-16 h-24 md:w-24 md:h-32 rounded bg-slate-900/80 border-2 flex flex-col items-center justify-center transition-all group overflow-hidden
                            ${gameOver ? 'opacity-50 cursor-not-allowed border-slate-800' : 'border-indigo-500/50 hover:border-indigo-400 hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] active:scale-95'}
                        `}
                    >
                        {/* Tech lines decoration */}
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-indigo-500"></div>
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-indigo-500"></div>
                        
                        <span className="text-4xl font-bold text-indigo-500/50 group-hover:text-indigo-400 transition-colors">?</span>
                        <div className="absolute bottom-2 text-xs font-bold text-slate-500">BOX-{i}</div>
                    </button>
                ))}
            </div>

            <div className="text-center text-slate-500 text-xs mb-6 uppercase tracking-widest bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800">
                KHẢ NĂNG TỒN TẠI: <span className="text-white font-bold text-lg mx-1">{currentUniquePositions}</span> VỊ TRÍ
            </div>

            <div className="w-full max-w-2xl bg-black rounded border border-indigo-900/30 p-0 flex-1 overflow-hidden flex flex-col min-h-[200px] mb-8 shadow-2xl">
                <div className="bg-slate-900/80 p-2 text-[10px] font-bold text-indigo-400 uppercase tracking-widest border-b border-indigo-900/30">TERMINAL_HISTORY_LOG</div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-1 font-mono text-sm">
                    {/* If Game Over, show the path first */}
                    {gameOver && (
                        <div className="p-2 bg-indigo-900/20 border-l-2 border-indigo-500 mb-4 animate-in fade-in">
                            <div className="text-indigo-300 font-bold mb-1">&gt;&gt; SYSTEM_REVEAL: TARGET_PATH</div>
                            <div className="text-white tracking-widest">
                                {revealPath.join(' > ')}
                            </div>
                        </div>
                    )}

                    {/* Check History */}
                    {[...history].reverse().map((h, i) => (
                        <div key={i} className="flex gap-4 border-b border-slate-800/50 pb-1 last:border-0 opacity-80 hover:opacity-100 transition-opacity">
                            <span className="text-slate-500">[{history.length - i}]:</span>
                            <span className="text-slate-300">SCAN_BOX_<span className="text-indigo-400">{h.box}</span></span>
                            <span className="text-slate-600">&gt;&gt;</span>
                            <span className={h.result.includes('BẮT') ? 'text-emerald-400 font-bold' : 'text-rose-400'}>{h.result}</span>
                        </div>
                    ))}
                    {history.length === 0 && <div className="text-slate-600 italic">&gt;&gt; WAITING FOR INPUT...</div>}
                </div>
            </div>
        </div>
    );
};

export default GameCat;