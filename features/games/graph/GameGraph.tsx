import { useState, useEffect } from 'react';
import { useGame } from '../../../context/GameContext';

const GameGraph = ({ onWin }: { onWin: (opt: boolean) => void, onFail: () => void }) => {
    const { playSound, showToast, setStatusText } = useGame();
    
    const [current, setCurrent] = useState<number | null>(null);
    const [lines, setLines] = useState<string[]>([]);
    const [path, setPath] = useState<number[]>([]); // Track node history
    const [won, setWon] = useState(false);
    
    // Counter for ALL moves (including backtracks) to determine optimization
    const [totalMoves, setTotalMoves] = useState(0);

    const points = [
        { id: 1, x: 50, y: 15 },
        { id: 2, x: 25, y: 40 }, { id: 3, x: 75, y: 40 },
        { id: 4, x: 25, y: 65 }, { id: 5, x: 75, y: 65 },
        { id: 6, x: 25, y: 90 }, { id: 7, x: 75, y: 90 },
        { id: 8, x: 50, y: 110 },
    ];
    
    const connections = [
        [1,2], [1,3],
        [2,3], [2,4], [2,5],
        [3,4], [3,5],
        [4,5], [4,6], [4,7],
        [5,6], [5,7],
        [6,7], [6,8], [7,8]
    ];
    
    const totalEdges = connections.length;
    
    useEffect(() => {
        setStatusText(`${lines.length}/15 cạnh`);
    }, [lines.length, setStatusText]);
    
    const getLineId = (a: number, b: number) => Math.min(a, b) + '-' + Math.max(a, b);
    
    const isConnected = (a: number, b: number) => {
        return connections.some(c => (c[0] === a && c[1] === b) || (c[0] === b && c[1] === a));
    };

    const handlePointClick = (id: number) => {
        if (won) return;

        if (current === null) {
            setCurrent(id);
            setPath([id]);
            playSound('click');
        } else {
            // BACKTRACK LOGIC: If clicking the immediately previous node, UNDO.
            if (path.length > 1 && path[path.length - 2] === id) {
                const prevNode = id;
                const lineToRemove = getLineId(current, prevNode);
                
                const newLines = [...lines];
                // Remove the last added line if it matches (it should)
                if (newLines[newLines.length - 1] === lineToRemove) {
                    newLines.pop();
                    setLines(newLines);
                    
                    const newPath = [...path];
                    newPath.pop();
                    setPath(newPath);
                    
                    setCurrent(prevNode);
                    
                    // IMPORTANT: Backtracking counts as a move!
                    setTotalMoves(m => m + 1);
                    
                    playSound('click');
                    return;
                }
            }

            if (current === id) return;
            
            if (!isConnected(current, id)) {
                showToast("Không có kết nối!", "warning");
                return;
            }

            const lineId = getLineId(current, id);
            if (lines.includes(lineId)) {
                showToast("Đã vẽ rồi!", "warning");
                return;
            }

            const newLines = [...lines, lineId];
            setLines(newLines);
            setCurrent(id);
            setPath([...path, id]);
            
            // Valid move counts as 1
            setTotalMoves(m => m + 1);
            
            playSound('click');

            if (newLines.length === totalEdges) {
                setWon(true);
                // Optimization: Total moves (actions taken) must equal exactly the number of edges (15).
                // If user backtracked, totalMoves will be > 15.
                // Note: The first click (start node) doesn't increment totalMoves.
                // So totalMoves is exactly the count of edges drawn + backtrack penalties.
                setTimeout(() => onWin(totalMoves + 1 === totalEdges), 500);
            }
        }
    };

    const reset = () => {
        setCurrent(null);
        setLines([]);
        setPath([]);
        setTotalMoves(0);
        setWon(false);
        playSound('click');
    };

    return (
        <div className="flex flex-col items-center justify-center h-full w-full relative pt-4 overflow-y-auto bg-[#0a0a0a]">
             <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-blue-900/10 pointer-events-none"></div>

            <div className="relative w-[340px] h-[440px] mb-8 z-10">
                <svg width="100%" height="100%" viewBox="0 0 100 130" className="drop-shadow-2xl overflow-visible">
                    <defs>
                        <filter id="glow-line" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="2" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* Base Lines (Ghost) */}
                    {connections.map((pair, i) => {
                        const p1 = points.find(p => p.id === pair[0])!;
                        const p2 = points.find(p => p.id === pair[1])!;
                        return (
                            <line 
                                key={i}
                                x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                                stroke="#1e293b" strokeWidth="2"
                                strokeLinecap="round"
                            />
                        );
                    })}

                    {/* Active Lines */}
                    {lines.map((lineStr) => {
                        const [id1, id2] = lineStr.split('-').map(Number);
                        const p1 = points.find(p => p.id === id1)!;
                        const p2 = points.find(p => p.id === id2)!;
                        return (
                            <g key={lineStr}>
                                <line 
                                    x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                                    stroke="#a855f7" strokeWidth="4"
                                    strokeLinecap="round"
                                    filter="url(#glow-line)"
                                    className="animate-in fade-in duration-300 opacity-60"
                                />
                                <line 
                                    x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                                    stroke="#d8b4fe" strokeWidth="1"
                                    strokeLinecap="round"
                                />
                            </g>
                        );
                    })}

                    {/* Nodes */}
                    {points.map((p) => {
                        const isActive = current === p.id;
                        return (
                            <g key={p.id} onClick={() => handlePointClick(p.id)} className="cursor-pointer group">
                                {isActive && (
                                    <circle cx={p.x} cy={p.y} r="12" className="fill-none stroke-purple-500 stroke-[1px] animate-ping opacity-50" />
                                )}
                                {/* Outer Ring */}
                                <circle 
                                    cx={p.x} cy={p.y} r="6" 
                                    className={`transition-all duration-300 stroke-[1px] ${isActive ? 'fill-slate-900 stroke-purple-400' : 'fill-slate-900 stroke-slate-600 group-hover:stroke-purple-300'}`}
                                />
                                {/* Inner Core */}
                                <circle 
                                    cx={p.x} cy={p.y} r="3" 
                                    className={`transition-all duration-300 ${isActive ? 'fill-purple-400' : 'fill-slate-600'}`}
                                />
                            </g>
                        );
                    })}
                </svg>
            </div>

            <div className="pb-8 z-10">
                <button onClick={reset} className="px-6 py-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-600 rounded text-purple-300 font-bold text-sm flex items-center gap-2 backdrop-blur">
                    <span>↺</span> THIẾT LẬP LẠI
                </button>
            </div>
        </div>
    );
};

export default GameGraph;