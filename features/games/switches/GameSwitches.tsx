import { useState, useEffect } from 'react';
import { useGame } from '../../../context/GameContext';

const GameSwitches = ({ onWin, onFail }: { onWin: (opt: boolean) => void, onFail: () => void }) => {
    const { playSound, setStatusText } = useGame();
    const [switches, setSwitches] = useState<Record<string, { on: boolean, heat: number }>>({
        A: { on: false, heat: 0 }, B: { on: false, heat: 0 }, C: { on: false, heat: 0 }, D: { on: false, heat: 0 }
    });
    const [mapping] = useState(() => {
        const m: Record<number, string> = {};
        const s = ['A', 'B', 'C', 'D'].sort(() => Math.random() - 0.5);
        [1, 2, 3, 4].forEach((n, i) => m[n] = s[i]);
        return m;
    });
    const [entered, setEntered] = useState(false);
    const [time, setTime] = useState(0);
    const [guesses, setGuesses] = useState<Record<number, string>>({ 1: '', 2: '', 3: '', 4: '' });
    const [result, setResult] = useState<boolean | null>(null);

    useEffect(() => {
        if (!entered) {
            setStatusText(time === 0 ? "0 phút" : `${time} phút`);
        } else {
            setStatusText("KIỂM TRA");
        }
    }, [time, entered, setStatusText]);

    const toggle = (k: string) => {
        if (entered) return;
        playSound('click');
        setSwitches(prev => ({ ...prev, [k]: { ...prev[k], on: !prev[k].on } }));
    };

    const wait = () => {
        if (entered) return;
        playSound('click');
        setTime(prev => prev + 10);
        setSwitches(prev => {
            const next = { ...prev };
            Object.keys(next).forEach(k => {
                if (next[k].on) next[k].heat += 10;
            });
            return next;
        });
    };

    const enterRoom = () => {
        setEntered(true);
        playSound('click');
    };

    const check = () => {
        let correct = 0;
        [1, 2, 3, 4].forEach(n => {
            if (guesses[n] === mapping[n]) correct++;
        });

        if (correct === 4) {
            onWin(time <= 20);
        } else {
            setResult(false);
            onFail();
        }
    };

    if (!entered) {
        return (
            <div className="flex flex-col items-center w-full h-full justify-start pt-6 overflow-y-auto pb-20 custom-scrollbar bg-[#050b14]">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-black text-slate-400 uppercase tracking-widest border-b border-slate-700 pb-2">HỆ THỐNG ĐIỆN ÁP</h2>
                </div>
                {/* Updated Grid Layout: Mobile 2 cols, Desktop 4 cols, Landscape Mobile 4 cols */}
                <div className="grid grid-cols-2 md:grid-cols-4 landscape:grid-cols-4 gap-6 w-full max-w-5xl mb-8 px-8">
                    {['A', 'B', 'C', 'D'].map(k => {
                        const isOn = switches[k].on;
                        return (
                            <div key={k} className="relative flex flex-col items-center group">
                                <div 
                                    onClick={() => toggle(k)}
                                    className={`relative w-28 h-48 rounded-xl shadow-[inset_0_2px_15px_rgba(0,0,0,0.8)] border-4 flex flex-col items-center justify-between p-3 cursor-pointer transition-all duration-200 
                                        ${isOn ? 'bg-slate-800 border-emerald-500/80 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-slate-900 border-slate-600'}`}
                                >
                                    <div className="w-full flex justify-between px-1 opacity-50"><div className="w-2 h-2 rounded-full bg-slate-500 flex items-center justify-center text-[5px] text-black"></div><div className="w-2 h-2 rounded-full bg-slate-500 flex items-center justify-center text-[5px] text-black"></div></div>
                                    
                                    {/* Toggle Track */}
                                    <div className="w-16 h-28 bg-black rounded-full relative shadow-inner overflow-hidden border border-slate-700">
                                        {/* Toggle Thumb */}
                                        <div className={`absolute left-0 w-full h-1/2 rounded-full shadow-lg transition-transform duration-200 ease-out border-t border-slate-500 z-10 flex items-center justify-center
                                            ${isOn ? 'top-0 bg-gradient-to-b from-slate-600 to-slate-700' : 'top-1/2 bg-gradient-to-b from-slate-700 to-slate-800'}
                                        `}>
                                            <div className={`w-8 h-8 rounded-full shadow-lg transition-all duration-300 border-2 border-black/20
                                                ${isOn ? 'bg-emerald-400 shadow-[0_0_15px_#34d399]' : 'bg-rose-500 shadow-[0_0_15px_#f43f5e]'}`}>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Text Label */}
                                    <div className={`font-black text-sm uppercase tracking-widest transition-colors ${isOn ? 'text-emerald-400' : 'text-rose-500'}`}>
                                        {isOn ? 'BẬT' : 'TẮT'}
                                    </div>

                                    <div className="w-full flex justify-between px-1 opacity-50"><div className="w-2 h-2 rounded-full bg-slate-500 flex items-center justify-center text-[5px] text-black"></div><div className="w-2 h-2 rounded-full bg-slate-500 flex items-center justify-center text-[5px] text-black"></div></div>
                                </div>
                                <div className="mt-4 font-mono text-2xl font-black text-slate-300 bg-slate-900 px-6 py-2 rounded border border-slate-700 shadow-lg">
                                    {k}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl px-4 mt-auto">
                    <button onClick={wait} className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 rounded font-bold text-amber-500 text-lg shadow-lg border border-slate-600 active:scale-95 transition-transform flex items-center justify-center gap-2">
                        <span>⏳</span>
                        <span>CHỜ 10 PHÚT</span>
                    </button>
                    <button onClick={enterRoom} className="flex-1 py-4 bg-emerald-900/50 hover:bg-emerald-800/50 rounded font-bold text-emerald-400 text-lg uppercase shadow-[0_0_15px_rgba(16,185,129,0.2)] border border-emerald-600 active:scale-95 transition-transform flex items-center justify-center gap-2">
                        <span>🚪</span>
                        <span>VÀO PHÒNG</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center w-full h-full justify-start pt-6 overflow-y-auto pb-10 custom-scrollbar bg-[#050b14]">
            {/* Updated Grid Layout here too */}
            <div className="grid grid-cols-1 md:grid-cols-4 landscape:grid-cols-4 gap-6 w-full max-w-6xl mb-8 px-4">
                {[1, 2, 3, 4].map(n => {
                    const st = switches[mapping[n]];
                    
                    // Logic Update: Cold/Off bulbs are darker
                    let bulbColor = 'text-slate-800 drop-shadow-none'; // Dark grey for off
                    let glassEffect = 'bg-slate-950 border-slate-800'; // Dark background
                    let heatEffect = '';
                    let statusText = 'TỐI - LẠNH';
                    let statusColor = 'text-slate-600';

                    if (st.on) {
                        bulbColor = 'text-yellow-200 drop-shadow-[0_0_20px_rgba(253,224,71,0.8)]';
                        glassEffect = 'bg-yellow-500/10 border-yellow-500/50';
                        statusText = 'SÁNG - NÓNG';
                        statusColor = 'text-yellow-400';
                    } else if (st.heat >= 15) {
                        // Off but Hot -> Red tint but dark bulb
                        bulbColor = 'text-red-900 drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]';
                        glassEffect = 'bg-red-950/50 border-red-900/50';
                        heatEffect = 'animate-pulse';
                        statusText = 'TỐI - NÓNG';
                        statusColor = 'text-red-500';
                    } else if (st.heat > 0) {
                        bulbColor = 'text-orange-900';
                        glassEffect = 'bg-orange-950/50 border-orange-900/50';
                        statusText = 'TỐI - ẤM';
                        statusColor = 'text-orange-600';
                    }

                    return (
                        <div key={n} className={`flex flex-col gap-4 w-full p-4 rounded-xl border border-slate-700 items-center bg-slate-900/50 backdrop-blur`}>
                             <div className={`relative w-full aspect-square rounded-full border-4 ${glassEffect} flex items-center justify-center shadow-inner transition-colors duration-500`}>
                                 <span className={`text-6xl md:text-8xl transition-all duration-1000 ${bulbColor} ${heatEffect}`}>💡</span>
                                 <div className="absolute bottom-2 font-mono text-xs text-slate-500 font-bold">L-{n}</div>
                             </div>
                             
                             {/* Added Status Text */}
                             <div className={`font-mono font-bold text-sm uppercase ${statusColor} tracking-widest border border-slate-700 px-3 py-1 rounded bg-black/40`}>
                                 {statusText}
                             </div>

                             <div className="w-full">
                                <label className="text-[10px] uppercase text-slate-500 font-bold mb-1 block">NGUỒN CẤP:</label>
                                <select 
                                    value={result === false ? mapping[n] : guesses[n]} 
                                    onChange={(e) => setGuesses({ ...guesses, [n]: e.target.value })}
                                    disabled={result === false}
                                    className={`w-full p-3 bg-black border rounded text-white font-mono cursor-pointer outline-none text-center appearance-none transition-colors
                                    ${result === false 
                                        ? 'border-red-500 text-red-500' 
                                        : 'border-slate-600 focus:border-cyan-500'}`}
                                >
                                    <option value="">-- CHỌN --</option>
                                    <option value="A">CÔNG TẮC A</option>
                                    <option value="B">CÔNG TẮC B</option>
                                    <option value="C">CÔNG TẮC C</option>
                                    <option value="D">CÔNG TẮC D</option>
                                </select>
                             </div>
                        </div>
                    );
                })}
            </div>
            
            <div className="w-full px-4 pb-8 flex justify-center mt-auto">
                 <button onClick={check} className="w-full max-w-md py-4 bg-cyan-700 hover:bg-cyan-600 hover:scale-105 text-white font-black rounded text-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all uppercase tracking-widest border border-cyan-400">
                    Xác nhận kết nối
                </button>
            </div>
        </div>
    );
};

export default GameSwitches;