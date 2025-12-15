import { useState, useEffect } from 'react';
import { useGame } from '../../../context/GameContext';

type LogType = { type: 'race', id: number, rank: number[] } | { type: 'item', msg: string };

const GameHorses = ({ onWin, onFail }: { onWin: (opt: boolean) => void, onFail: () => void }) => {
    const { playSound, showToast, usedItems, idx, setStatusText } = useGame();
    
    // Function to generate horses with Randomized "Collision" logic
    const generateHorses = () => {
        // 1. Create base horses
        let h = Array.from({length: 25}, (_, i) => ({ 
            id: i+1, 
            speed: Math.floor(Math.random() * 500) + 100 // Base speed
        }));

        // 2. Define Top 3 speeds
        const speeds = { top1: 999, top2: 950, top3: 900 };

        // 3. Choose a Collision Scenario (33% chance each)
        const scenario = Math.floor(Math.random() * 3);

        // 4. Select Group for the Pair (0-4)
        const pairGroupIdx = Math.floor(Math.random() * 5);
        const pairBase = pairGroupIdx * 5;

        // 5. Select Group for the Loner (must be different)
        let lonerGroupIdx = Math.floor(Math.random() * 5);
        while (lonerGroupIdx === pairGroupIdx) {
            lonerGroupIdx = Math.floor(Math.random() * 5);
        }
        const lonerBase = lonerGroupIdx * 5;

        // Helper to pick random slot in a group (0-4)
        const pickSlot = (exclude: number[] = []) => {
            let s = Math.floor(Math.random() * 5);
            while (exclude.includes(s)) s = Math.floor(Math.random() * 5);
            return s;
        };

        // 6. Assign Speeds based on Scenario
        if (scenario === 0) {
            // 1 & 2 share
            const s1 = pickSlot();
            const s2 = pickSlot([s1]);
            h[pairBase + s1].speed = speeds.top1;
            h[pairBase + s2].speed = speeds.top2;
            
            h[lonerBase + pickSlot()].speed = speeds.top3;
        } else if (scenario === 1) {
            // 2 & 3 share
            const s2 = pickSlot();
            const s3 = pickSlot([s2]);
            h[pairBase + s2].speed = speeds.top2;
            h[pairBase + s3].speed = speeds.top3;
            
            h[lonerBase + pickSlot()].speed = speeds.top1;
        } else {
            // 1 & 3 share
            const s1 = pickSlot();
            const s3 = pickSlot([s1]);
            h[pairBase + s1].speed = speeds.top1;
            h[pairBase + s3].speed = speeds.top3;
            
            h[lonerBase + pickSlot()].speed = speeds.top2;
        }

        return h;
    };

    const [horses] = useState(generateHorses);
    
    const [track, setTrack] = useState<number[]>([]);
    const [logs, setLogs] = useState<LogType[]>([]);
    const [top3, setTop3] = useState<{first: number|null, second: number|null, third: number|null}>({first: null, second: null, third: null});

    const isGlassUsed = usedItems[idx]?.['glass']; 

    useEffect(() => {
        const raceCount = logs.filter(l => l.type === 'race').length;
        setStatusText(`Cuộc đua #${raceCount + 1}`);
    }, [logs, setStatusText]);

    // Dynamic Hint Calculation
    useEffect(() => {
        if (isGlassUsed) {
            const sorted = [...horses].sort((a,b) => b.speed - a.speed);
            const losers = sorted.slice(3); // All except top 3
            const shownLosers = losers.sort(() => Math.random() - 0.5).slice(0, 4).map(h => h.id).sort((a,b) => a-b);
            
            setLogs(prev => {
                const clean = prev.filter(l => l.type !== 'item');
                return [{ type: 'item', msg: `🔍 Kính Lúp: Rồng #${shownLosers.join(', #')} quá chậm, không thể thắng!` }, ...clean];
            });
        }
    }, [isGlassUsed, horses]); 

    const toggleTrack = (id: number) => {
        if (track.includes(id)) {
            // Remove from track
            setTrack(track.filter(x => x !== id));
        } else {
            // Add to track
            if (track.length >= 5) { showToast("Bệ phóng đã đầy (Max 5)", "warning"); return; }
            setTrack([...track, id]);
        }
        playSound('click');
    };

    const runRace = () => {
        if (track.length < 2) { showToast("Cần ít nhất 2 rồng để đua", "warning"); return; }
        playSound('click');
        const ranking = [...track].sort((a,b) => {
            const sA = horses.find(h => h.id === a)!.speed;
            const sB = horses.find(h => h.id === b)!.speed;
            return sB - sA;
        });

        const raceCount = logs.filter(l => l.type === 'race').length + 1;
        setLogs(prev => [{ type: 'race', id: raceCount, rank: ranking }, ...prev]);
        setTrack([]); 
    };

    const submit = () => {
        const { first, second, third } = top3;
        if (!first || !second || !third) { showToast("Hãy điền đủ Top 3", "warning"); return; }
        const real = [...horses].sort((a,b) => b.speed - a.speed).slice(0,3).map(h => h.id);
        const isCorrect = first === real[0] && second === real[1] && third === real[2];

        if (isCorrect) {
            const raceCount = logs.filter(l => l.type === 'race').length;
            onWin(raceCount <= 7);
        } else {
            showToast("Sai kết quả!", "error");
            onFail();
        }
    };
    
    return (
        <div className="flex flex-col h-full w-full pt-4 px-4 overflow-y-auto custom-scrollbar relative bg-[#020617]">
             <div className="absolute inset-0 bg-slate-900 [mask-image:linear-gradient(to_bottom,transparent,black)] pointer-events-none opacity-20" style={{backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '24px 24px'}}></div>

            {/* TRACK AREA - STICKY TOP */}
            {/* Landscape Optimization: Single line, opacity 0.5 for background */}
            <div className="w-full bg-slate-900/95 landscape:bg-slate-900/50 backdrop-blur border border-rose-900/30 rounded-xl p-4 landscape:py-1 mb-6 flex flex-col md:flex-row landscape:flex-row items-center justify-between gap-4 shrink-0 sticky top-0 z-20 shadow-xl transition-all">
                <div className="flex items-center gap-4 landscape:mr-4">
                     <span className="text-sm md:text-lg landscape:text-sm font-bold text-rose-500 uppercase tracking-widest">BỆ PHÓNG</span>
                </div>
                <div className="flex gap-3 items-center">
                    {/* Render slots from Track Array */}
                    {track.map(id => (
                        <button key={id} onClick={() => toggleTrack(id)} className="w-12 h-12 landscape:w-10 landscape:h-10 bg-rose-600 rounded border border-rose-500 flex items-center justify-center font-bold text-white text-xl landscape:text-lg hover:bg-rose-500 shadow-lg animate-in zoom-in duration-200">
                            {id}
                        </button>
                    ))}
                    {/* Render Empty slots */}
                    {Array.from({length: 5 - track.length}).map((_,i) => (
                        <div key={i} className="w-12 h-12 landscape:w-10 landscape:h-10 border-2 border-dashed border-slate-700 rounded bg-slate-900/50 flex items-center justify-center text-xs text-slate-700">
                            {i+1+track.length}
                        </div>
                    ))}
                </div>
                <button onClick={runRace} className="w-full md:w-auto landscape:w-auto px-8 py-3 landscape:py-2 landscape:ml-4 bg-rose-600 hover:bg-rose-500 text-white font-black rounded uppercase shadow-lg border-b-4 border-rose-800 active:border-b-0 active:translate-y-1 transition-all">
                    ĐUA
                </button>
            </div>

            {/* Main Content - Split for Landscape */}
            <div className="flex flex-col md:flex-row landscape:flex-row gap-6 mb-8 w-full max-w-6xl mx-auto h-full landscape:h-auto">
                {/* STABLE AREA */}
                {/* Optimized to be a strict 5x5 Grid */}
                <div className="w-full md:w-1/2 landscape:w-1/2 bg-slate-900/50 border border-emerald-900/30 rounded-xl p-4 shadow-xl backdrop-blur shrink-0">
                    <div className="text-sm md:text-lg font-bold text-emerald-500 uppercase mb-4 border-b border-emerald-900/30 pb-2 flex items-center gap-2">
                        <span>🐉 TRẠI RỒNG 🐉</span>
                    </div>
                    {/* FIXED: 5x5 Grid Layout */}
                    <div className="grid grid-cols-5 gap-2 justify-items-center">
                        {horses.map(h => {
                            const isSelected = track.includes(h.id);
                             return (
                                 <button 
                                    key={h.id} 
                                    onClick={() => !isSelected && toggleTrack(h.id)}
                                    disabled={isSelected}
                                    className={`w-10 h-10 md:w-12 md:h-12 rounded-lg border font-black flex items-center justify-center text-lg md:text-xl transition-all duration-200
                                        ${isSelected 
                                            ? 'bg-slate-900 border-slate-800 text-slate-700 opacity-30 scale-90 cursor-not-allowed' 
                                            : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-emerald-400 hover:text-white hover:scale-110 hover:bg-slate-700 hover:shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                                        }`}
                                 >
                                     {h.id}
                                 </button>
                             );
                        })}
                    </div>
                </div>

                {/* LOGS & INPUT AREA */}
                <div className="w-full md:w-1/2 landscape:w-1/2 flex flex-col gap-4">
                     {/* Logs */}
                     <div className="flex-1 bg-black border border-slate-800 rounded-xl p-4 shadow-inner min-h-[200px] flex flex-col">
                         <div className="text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-widest flex justify-between">
                             <span>LỊCH SỬ ĐUA</span>
                             <span className="animate-pulse text-emerald-500">● LIVE</span>
                         </div>
                         <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1 font-mono text-sm max-h-[350px] pr-2">
                             {logs.length === 0 && <div className="text-slate-700 italic text-center mt-10">CHƯA CÓ DỮ LIỆU</div>}
                             {logs.map((l, i) => {
                                 if (l.type === 'item') {
                                     return (
                                         <div key={`item-${i}`} className="bg-amber-900/20 text-amber-500 p-2 border-l-2 border-amber-500 mb-1">
                                             &gt; HỆ THỐNG: {l.msg}
                                         </div>
                                     )
                                 }
                                 return (
                                     <div key={l.id} className="flex flex-col border-b border-slate-900 pb-2 mb-2">
                                         <span className="text-indigo-400 font-bold text-lg mb-1 uppercase tracking-wide">ĐUA #{String(l.id).padStart(2,'0')}:</span>
                                         <div className="flex flex-wrap gap-3">
                                             {l.rank.map((id, rank) => (
                                                 <div key={rank} className={`flex flex-col items-center justify-center w-10 ${rank === 0 ? 'text-yellow-400' : rank === 1 ? 'text-slate-300' : rank === 2 ? 'text-amber-700' : 'text-slate-600'}`}>
                                                     <span className="text-2xl font-black">{id}</span>
                                                 </div>
                                             ))}
                                         </div>
                                     </div>
                                 )
                             })}
                         </div>
                    </div>

                    {/* Input */}
                     <div className="bg-slate-900 border border-indigo-500/30 rounded-xl p-4 shadow-lg shrink-0">
                        <div className="text-xs font-bold text-indigo-400 uppercase mb-3 tracking-widest">KẾT QUẢ TOP 3</div>
                        <div className="flex gap-2 mb-3">
                            {(['first', 'second', 'third'] as const).map((k, i) => (
                                <div key={k} className="flex-1">
                                    <input 
                                        type="number" 
                                        className="w-full bg-black border border-slate-700 rounded p-2 text-center text-white font-bold focus:border-indigo-500 outline-none placeholder-slate-700"
                                        value={top3[k] || ''}
                                        placeholder={`#${i+1}`}
                                        onChange={(e) => setTop3({...top3, [k]: parseInt(e.target.value) || null})}
                                    />
                                </div>
                            ))}
                        </div>
                        <button onClick={submit} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded shadow-lg uppercase tracking-wider text-sm">
                            XÁC NHẬN
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameHorses;