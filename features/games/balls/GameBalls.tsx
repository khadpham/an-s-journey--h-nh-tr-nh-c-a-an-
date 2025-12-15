import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useGame } from '../../../context/GameContext';

type LogType = { type: 'weigh', id: number, l: number[], r: number[], res: string } | { type: 'item', msg: string };

export interface GameBallsHandle {
    autoWin: () => void;
}

const GameBalls = forwardRef<GameBallsHandle, { onWin: (opt: boolean) => void, onFail: () => void }>(({ onWin, onFail }, ref) => {
    const { playSound, showToast, usedItems, idx, resetLevelItems, setStatusText } = useGame();
    const isMounted = useRef(true);

    useImperativeHandle(ref, () => ({
        autoWin: () => {
            playSound('win');
            onWin(true);
        }
    }));

    useEffect(() => {
        isMounted.current = true;
        return () => { isMounted.current = false; };
    }, []);
    
    // Config Generator with Bias
    const generateConfig = () => {
        // 80% chance the ball is in range [2, 10]
        // 20% chance it's 1, 11, or 12
        let fakeId;
        if (Math.random() < 0.8) {
            fakeId = Math.floor(Math.random() * 9) + 2; // 2 to 10
        } else {
            const outliers = [1, 11, 12];
            fakeId = outliers[Math.floor(Math.random() * outliers.length)];
        }

        const isHeavy = Math.random() > 0.5;
        return { fakeId, weight: isHeavy ? 1.1 : 0.9 }; 
    };

    const [config, setConfig] = useState(generateConfig);
    const [left, setLeft] = useState<number[]>([]);
    const [right, setRight] = useState<number[]>([]);
    const [logs, setLogs] = useState<LogType[]>([]);
    const [anim, setAnim] = useState(0); 
    const [activePan, setActivePan] = useState<'left' | 'right'>('left');
    const [ansId, setAnsId] = useState('');
    const [ansType, setAnsType] = useState('?');
    const [isBalanced, setIsBalanced] = useState(false);

    const remaining = 3 - logs.filter(l => l.type === 'weigh').length;
    const isMagnetUsed = usedItems[idx]?.['magnet'];

    useEffect(() => {
        setStatusText(`Còn ${remaining} lượt`);
    }, [remaining, setStatusText]);

    // Dynamic Item Logic
    useEffect(() => {
        if (isMagnetUsed) {
            setLogs(prev => {
                const clean = prev.filter(l => l.type !== 'item');
                return [{ type: 'item', msg: `🧲 Nam Châm: Đã hút dính quả bóng số ${config.fakeId} (Sắt từ tính).` }, ...clean];
            });
        }
    }, [isMagnetUsed, config.fakeId]); 

    const handleBallClick = (id: number) => {
        if (isBalanced) setIsBalanced(false); // Reset visual if user clicks
        const weighCount = logs.filter(l => l.type === 'weigh').length;
        if (weighCount >= 3) return;
        playSound('click');

        const inLeft = left.includes(id);
        const inRight = right.includes(id);
        
        if (inLeft) {
            // Return to pool
            setLeft(left.filter(x => x !== id));
        } else if (inRight) {
            // Return to pool
            setRight(right.filter(x => x !== id));
        } else {
            // Add to active pan
            if (activePan === 'left') setLeft([...left, id]);
            else setRight([...right, id]);
        }
    };

    const weigh = () => {
        if (left.length === 0 && right.length === 0) { showToast("Cân đang trống!", "warning"); return; }
        const weighCount = logs.filter(l => l.type === 'weigh').length;
        if (weighCount >= 3) return;

        playSound('click');
        
        const wL = left.reduce((a,c) => a + (c === config.fakeId ? config.weight : 1), 0);
        const wR = right.reduce((a,c) => a + (c === config.fakeId ? config.weight : 1), 0);

        let res = '=';
        if (wL > wR) { res = '>'; setAnim(-10); setIsBalanced(false); } 
        else if (wR > wL) { res = '<'; setAnim(10); setIsBalanced(false); } 
        else { setAnim(0); setIsBalanced(true); }

        setLogs(prev => [{ type: 'weigh', id: weighCount + 1, l: [...left], r: [...right], res }, ...prev]);
        
        setTimeout(() => {
            if (isMounted.current) {
                setAnim(0);
                setIsBalanced(false);
                setLeft([]);
                setRight([]);
            }
        }, 1500);
    };

    const submit = () => {
        if (!ansId || ansType === '?') { showToast("Vui lòng chọn đầy đủ đáp án!", "warning"); return; }
        const id = parseInt(ansId);
        const isHeavy = config.weight > 1;
        
        if (id === config.fakeId && ((isHeavy && ansType === 'heavy') || (!isHeavy && ansType === 'light'))) {
            // WIN Logic - Direct transition
            playSound('win');
            onWin(true);
        } else {
            showToast("Sai rồi! Trái Tim Thời Gian đã vỡ...", "error");
            onFail();
        }
    };
    
    const handleReset = () => {
        setLogs([]);
        setLeft([]);
        setRight([]);
        setAnsId(''); setAnsType('?');
        setIsBalanced(false);
        setConfig(generateConfig());
        resetLevelItems(idx);
        playSound('click');
    }

    // Helper to render balls inside Pans (larger size)
    const renderPanBall = (id: number) => (
        <div key={id} onClick={(e) => { e.stopPropagation(); handleBallClick(id); }} className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-cyan-500 text-black font-black flex items-center justify-center text-sm shadow-[0_0_10px_#22d3ee] cursor-pointer hover:scale-110 transition-transform z-20">
            {id}
        </div>
    );

    return (
        <div className="flex flex-col h-full w-full items-center pt-4 px-4 overflow-y-auto custom-scrollbar bg-[#020617] relative">
            
             <div className="flex justify-between w-full max-w-4xl mb-4 items-end z-10">
                <div className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest">HỆ THỐNG CÂN BẰNG</div>
                <button onClick={handleReset} className="px-4 py-1 bg-slate-900 border border-slate-700 rounded text-xs font-bold text-slate-400">↺ Reset</button>
            </div>

            {/* Scale UI */}
            <div className="relative w-full max-w-2xl h-64 mb-4 shrink-0 mt-8">
                 {/* Scale Arm */}
                 <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[85%] h-2 bg-cyan-500/50 rounded transition-transform duration-1000 ease-in-out z-10" style={{ transform: `translateX(-50%) rotate(${anim}deg)` }}>
                     
                     {/* Center Fulcrum - Visual feedback for Balanced state */}
                     <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full transition-all duration-300 ${isBalanced ? 'bg-emerald-400 shadow-[0_0_25px_#34d399] scale-150' : 'bg-cyan-400 shadow-[0_0_15px_#22d3ee]'}`}></div>

                     {/* Left Pan */}
                     <div 
                        onClick={() => setActivePan('left')}
                        className={`absolute top-0 left-0 -translate-x-1/2 cursor-pointer transition-all group`}
                     >
                         <div className="w-[2px] h-28 bg-gradient-to-b from-cyan-400/50 to-transparent absolute left-0 top-0"></div>
                         {/* Pan Body - Increased Size */}
                         <div className={`w-40 md:w-52 h-16 border-b-4 ${activePan === 'left' ? 'border-cyan-400 bg-cyan-900/30 shadow-[0_0_30px_rgba(34,211,238,0.2)]' : 'border-slate-600 bg-slate-900/40'} absolute top-28 -left-20 md:-left-26 flex flex-wrap content-end justify-center p-2 gap-1 backdrop-blur-sm transition-all rounded-b-3xl z-10`}>
                             {left.map(id => renderPanBall(id))}
                         </div>
                         <div className={`absolute top-[-25px] left-[-40px] w-20 text-center text-[10px] font-bold uppercase tracking-widest ${activePan === 'left' ? 'text-cyan-400' : 'text-slate-600'}`}>ĐĨA TRÁI</div>
                     </div>

                     {/* Right Pan */}
                     <div 
                        onClick={() => setActivePan('right')}
                        className={`absolute top-0 right-0 translate-x-1/2 cursor-pointer transition-all group`}
                     >
                         <div className="w-[2px] h-28 bg-gradient-to-b from-cyan-400/50 to-transparent absolute right-0 top-0"></div>
                         {/* Pan Body - Increased Size */}
                         <div className={`w-40 md:w-52 h-16 border-b-4 ${activePan === 'right' ? 'border-cyan-400 bg-cyan-900/30 shadow-[0_0_30px_rgba(34,211,238,0.2)]' : 'border-slate-600 bg-slate-900/40'} absolute top-28 -right-20 md:-right-26 flex flex-wrap content-end justify-center p-2 gap-1 backdrop-blur-sm transition-all rounded-b-3xl z-10`}>
                              {right.map(id => renderPanBall(id))}
                         </div>
                         <div className={`absolute top-[-25px] right-[-40px] w-20 text-center text-[10px] font-bold uppercase tracking-widest ${activePan === 'right' ? 'text-cyan-400' : 'text-slate-600'}`}>ĐĨA PHẢI</div>
                     </div>
                 </div>

                 {/* Base Stand */}
                 <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-4 bg-slate-800 rounded-full"></div>
                 <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-44 bg-slate-700"></div>
                 <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[60px] border-b-slate-800/50"></div>
                 
                 {/* Balanced Indicator on Base */}
                 {isBalanced && <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-emerald-400 font-bold tracking-widest text-xs animate-pulse">CÂN BẰNG</div>}

                 <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
                    <button onClick={weigh} disabled={remaining <= 0} className="px-10 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-full shadow-[0_0_20px_rgba(99,102,241,0.5)] uppercase text-sm active:scale-95 transition-transform flex items-center gap-2 border border-indigo-400">
                        <span>⚖️</span> CÂN NGAY
                    </button>
                 </div>
            </div>

            <div className="w-full max-w-4xl mt-24 flex flex-col md:flex-row gap-4 mb-8">
                {/* Balls Pool */}
                <div className="flex-1 bg-slate-900/50 border border-slate-700 rounded-xl p-4 backdrop-blur">
                     <div className="text-[10px] font-bold text-slate-500 uppercase mb-4 tracking-widest">KHO NĂNG LƯỢNG</div>
                     {/* Update: justify-start and content-start to align left */}
                     <div className="flex gap-3 justify-start content-start flex-wrap">
                        {Array.from({length:12}, (_,i) => i+1).map(id => {
                            if (left.includes(id) || right.includes(id)) return null;

                            return (
                                <button 
                                    key={id} 
                                    onClick={() => handleBallClick(id)}
                                    className="w-10 h-10 rounded-full font-bold transition-all text-sm bg-slate-800 text-cyan-400 shadow-lg border border-cyan-900 hover:bg-cyan-900 hover:scale-110 hover:shadow-[0_0_10px_#22d3ee]"
                                >
                                    {id}
                                </button>
                            );
                        })}
                     </div>
                </div>

                {/* Answer */}
                <div className="w-full md:w-80 flex flex-col gap-4">
                    <div className="bg-black border border-slate-800 rounded-xl p-4">
                        <div className="text-[10px] font-bold text-emerald-500 uppercase mb-2 tracking-widest">XÁC NHẬN KẾT QUẢ</div>
                        <div className="flex gap-2 mb-2">
                            <select className="bg-slate-900 border border-slate-700 text-white p-2 rounded w-full font-bold text-sm outline-none focus:border-emerald-500" value={ansId} onChange={e=>setAnsId(e.target.value)}>
                                <option value="">ID #</option>
                                {Array.from({length:12},(_,i)=>i+1).map(i=><option key={i} value={i}>{i}</option>)}
                            </select>
                            <select className="bg-slate-900 border border-slate-700 text-white p-2 rounded w-full font-bold text-sm outline-none focus:border-emerald-500" value={ansType} onChange={e=>setAnsType(e.target.value)}>
                                <option value="?">LOẠI</option>
                                <option value="heavy">NẶNG (+)</option>
                                <option value="light">NHẸ (-)</option>
                            </select>
                        </div>
                        <button onClick={submit} className="w-full py-2 bg-emerald-900/50 border border-emerald-600 hover:bg-emerald-800/50 text-emerald-400 font-bold rounded uppercase text-sm shadow-[0_0_10px_rgba(16,185,129,0.2)]">XÁC NHẬN</button>
                    </div>
                </div>
            </div>

            {/* Logs */}
            <div className="w-full max-w-4xl pb-10">
                 <div className="text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-widest">LỊCH SỬ CÂN</div>
                 <div className="flex flex-col gap-2">
                     {logs.map((l, i) => {
                         if (l.type === 'item') {
                             return (
                                 <div key={`item-${i}`} className="bg-amber-900/20 border-l-2 border-amber-500 p-2 text-xs text-amber-200 animate-in fade-in font-mono">
                                     {l.msg}
                                 </div>
                             )
                         }
                         
                         const label = l.res === '=' ? 'CÂN BẰNG' : l.res === '>' ? 'TRÁI NẶNG' : 'PHẢI NẶNG';
                         const color = l.res === '=' ? 'text-emerald-400' : 'text-amber-400';

                         return (
                            <div key={l.id} className="bg-slate-900/80 border-b border-slate-800 p-3 flex justify-between items-center font-mono text-xl">
                                <div className={`font-bold ${color}`}>#{l.id}: {label}</div>
                                <div className="flex items-center gap-4 text-slate-300">
                                    <span className="text-sm text-slate-500">L:</span>
                                    <span>[{l.l.join(',')}]</span>
                                    <span className="text-slate-600">|</span>
                                    <span className="text-sm text-slate-500">R:</span>
                                    <span>[{l.r.join(',')}]</span>
                                </div>
                            </div>
                         )
                     })}
                 </div>
            </div>
        </div>
    );
});

export default GameBalls;