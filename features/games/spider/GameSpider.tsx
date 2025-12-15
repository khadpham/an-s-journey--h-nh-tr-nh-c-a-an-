import React, { useState, useRef, useEffect } from 'react';
import { useGame } from '../../../context/GameContext';

const GameSpider = ({ onWin, onFail }: { onWin: (opt: boolean) => void, onFail: () => void }) => {
    const { playSound, setStatusText } = useGame();
    
    const [player, setPlayer] = useState(18); 
    const [spider, setSpider] = useState(20); 
    const [turn, setTurn] = useState(1);
    const [won, setWon] = useState(false);
    
    // Pan & Zoom State
    const [scale, setScale] = useState(1.1); 
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const isDragging = useRef(false);
    const lastPos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const remaining = 15 - turn + 1;
        // If turn > 15, show negative or 0
        setStatusText(remaining > 0 ? `Còn ${remaining} bước` : `Đã hết bước!`);
    }, [turn, setStatusText]);

    // Build Adjacency
    const ADJ: number[][] = Array.from({length: 21}, () => []);
    const addEdge = (u: number, v: number) => {
        if (!ADJ[u].includes(v)) ADJ[u].push(v);
        if (!ADJ[v].includes(u)) ADJ[v].push(u);
    };

    // Radial (From O outwards)
    [1,2,3,4,5].forEach(i => addEdge(0, i));
    [1,2,3,4,5].forEach(i => addEdge(i, i+5));
    [6,7,8,9,10].forEach(i => addEdge(i, i+5));
    [11,12,13,14,15].forEach(i => addEdge(i, i+5));

    // Lateral (Arcs)
    addEdge(1,2); addEdge(2,3); addEdge(3,4); addEdge(4,5);
    addEdge(6,7); addEdge(7,8); addEdge(8,9); addEdge(9,10);
    addEdge(11,12); addEdge(12,13); addEdge(13,14); addEdge(14,15);
    addEdge(16,17); addEdge(17,18); addEdge(18,19); addEdge(19,20);

    // Coordinates Generation
    const points: {id:number, x:number, y:number}[] = [];
    points.push({id:0, x:50, y:95}); 
    
    const radii = [20, 40, 60, 80];
    const angles = [-60, -30, 0, 30, 60]; 

    radii.forEach((r, rIdx) => {
        angles.forEach((deg, aIdx) => {
            const id = 1 + (rIdx * 5) + aIdx;
            const rad = deg * (Math.PI / 180);
            points.push({
                id: id,
                x: 50 + r * Math.sin(rad),
                y: 95 - r * Math.cos(rad)
            });
        });
    });

    const handleMove = (node: number) => {
        if(won) return;
        if(!ADJ[player].includes(node)) return;
        
        playSound('click');
        setPlayer(node);
        
        // Immediate win check
        if(node === spider) {
            setWon(true);
            setTimeout(() => onWin(turn <= 10), 500);
            return;
        }

        // Fail Trigger but CONTINUE logic
        if(turn === 15) {
            onFail();
        }

        // Spider AI Move
        setTimeout(() => {
            const getDist = (start: number, target: number) => {
                const q = [[start, 0]];
                const vis = new Set([start]);
                while(q.length) {
                    const [curr, d] = q.shift()!;
                    if(curr === target) return d;
                    for(const n of ADJ[curr]) {
                        if(!vis.has(n)) { vis.add(n); q.push([n, d+1]); }
                    }
                }
                return 99;
            }

            let best = spider;
            let maxDist = -1;
            
            // AI tries to maximize distance from new player position
            for(const n of ADJ[spider]) {
                if (n === node) continue; // Don't run into player
                const d = getDist(n, node);
                if (d > maxDist) { maxDist = d; best = n; }
                else if (d === maxDist && Math.random() > 0.5) best = n;
            }
            // If trapped or no better move, stay or move randomly (but here just best)
            if (maxDist === -1) best = spider;
            
            setSpider(best);
            setTurn(turn + 1);

            // If spider stupidly moves into player (rare/impossible with logic above but safe check)
             if(best === node) {
                setWon(true);
                setTimeout(() => onWin(turn <= 10), 500);
            }
        }, 300);
    };

    // Pan Handlers
    const handlePointerDown = (e: React.PointerEvent) => {
        isDragging.current = true;
        lastPos.current = { x: e.clientX, y: e.clientY };
        (e.target as Element).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging.current) return;
        const dx = e.clientX - lastPos.current.x;
        const dy = e.clientY - lastPos.current.y;
        setPan(p => ({ x: p.x + dx, y: p.y + dy }));
        lastPos.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        isDragging.current = false;
        (e.target as Element).releasePointerCapture(e.pointerId);
    };

    const handleWheel = (e: React.WheelEvent) => {
        e.stopPropagation();
        const delta = e.deltaY * -0.001;
        const newScale = Math.min(Math.max(0.5, scale + delta), 4);
        setScale(newScale);
    };

    const resetView = () => {
        setPan({x:0, y:0});
        setScale(1.1);
    };

    return (
        <div className="flex flex-col h-full w-full overflow-hidden relative bg-[#050b14]">
            {/* Map Container */}
            <div 
                className="flex-1 w-full h-full touch-none cursor-move relative overflow-hidden"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                onWheel={handleWheel}
            >
                {/* Background Grid - "Radar" Effect */}
                <svg width="100%" height="100%" className="absolute inset-0 pointer-events-none opacity-20">
                     <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#06b6d4" strokeWidth="0.5"/>
                        </pattern>
                     </defs>
                     <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>

                <svg 
                    width="100%" 
                    height="100%" 
                    viewBox="-50 -50 200 200" 
                    preserveAspectRatio="xMidYMid meet"
                    className="overflow-visible"
                    style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`, transformOrigin: 'center' }}
                >
                    <defs>
                         <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                        <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
                          <path d="M0,0 L0,6 L6,3 z" fill="#334155" />
                        </marker>
                    </defs>

                    {/* Radar Background Circles - Very Faint */}
                    <circle cx="50" cy="95" r="20" fill="none" stroke="#0e7490" strokeWidth="0.5" strokeDasharray="4 2" className="opacity-10"/>
                    <circle cx="50" cy="95" r="40" fill="none" stroke="#0e7490" strokeWidth="0.5" strokeDasharray="4 2" className="opacity-10"/>
                    <circle cx="50" cy="95" r="60" fill="none" stroke="#0e7490" strokeWidth="0.5" strokeDasharray="4 2" className="opacity-10"/>
                    <circle cx="50" cy="95" r="80" fill="none" stroke="#0e7490" strokeWidth="0.5" strokeDasharray="4 2" className="opacity-10"/>

                    {/* Connections */}
                    {ADJ.map((neighbors, u) => 
                        neighbors.map(v => {
                            if (u < v) {
                                const p1 = points.find(p=>p.id===u);
                                const p2 = points.find(p=>p.id===v);
                                if (!p1 || !p2) return null;
                                
                                const isConnectedToPlayer = u === player || v === player;
                                
                                // STYLE UPDATE: Faint lines, Slate color
                                let strokeColor = "#334155"; // slate-700
                                let strokeWidth = "0.5";
                                
                                if (isConnectedToPlayer) {
                                    strokeColor = "#475569"; // slate-600 slightly brighter
                                    strokeWidth = "0.8";
                                }

                                return (
                                    <g key={`${u}-${v}`}>
                                        <line 
                                            x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} 
                                            stroke={strokeColor} 
                                            strokeWidth={strokeWidth} 
                                            className="transition-colors duration-300"
                                        />
                                        {/* Arrows */}
                                        {u === player && (
                                            <line x1={p1.x} y1={p1.y} x2={(p1.x+p2.x)/2} y2={(p1.y+p2.y)/2} stroke="transparent" markerEnd="url(#arrow)" />
                                        )}
                                        {v === player && (
                                            <line x1={p2.x} y1={p2.y} x2={(p2.x+p1.x)/2} y2={(p2.y+p1.y)/2} stroke="transparent" markerEnd="url(#arrow)" />
                                        )}
                                    </g>
                                );
                            }
                            return null;
                        })
                    )}

                    {/* Nodes */}
                    {points.map(p => {
                        const isNeighbor = ADJ[player].includes(p.id);
                        const isPlayer = p.id === player;
                        const isSpider = p.id === spider;

                        return (
                            <g key={p.id} onClick={(e) => { e.stopPropagation(); handleMove(p.id); }} className="transition-all duration-300">
                                {/* Invisible larger hit area */}
                                <circle cx={p.x} cy={p.y} r="8" fill="transparent" className={isNeighbor ? 'cursor-pointer' : ''} />
                                
                                {/* Glow Effect for active nodes */}
                                {(isPlayer || isSpider) && (
                                    <circle 
                                        cx={p.x} cy={p.y} r="8" 
                                        className={`animate-pulse ${isPlayer ? 'fill-cyan-500/20' : 'fill-rose-500/20'}`} 
                                        filter="url(#neon-glow)"
                                    />
                                )}

                                {/* Main Node Body */}
                                <circle 
                                    cx={p.x} cy={p.y} r={isPlayer || isSpider ? 3 : 2} 
                                    className={`transition-all duration-300 pointer-events-none
                                        ${isPlayer ? 'fill-cyan-400 stroke-cyan-200 stroke-[0.5]' : 
                                          isSpider ? 'fill-rose-500 stroke-rose-300 stroke-[0.5]' : 
                                          isNeighbor ? 'fill-yellow-400 stroke-yellow-200' : 'fill-slate-800 stroke-slate-700'}` // Highlight neighbor with yellow
                                    }
                                />
                                
                                {/* Neighbor Indicator Ring */}
                                {isNeighbor && !isSpider && (
                                     <circle cx={p.x} cy={p.y} r="4" fill="none" stroke="#facc15" strokeWidth="0.5" className="animate-pulse opacity-50" />
                                )}
                            </g>
                        );
                    })}
                    
                    {/* Origin Label */}
                    <text x="50" y="105" textAnchor="middle" className="text-[3px] fill-cyan-900 font-bold select-none opacity-50">CORE</text>
                </svg>
            </div>
            
            {/* Bottom Controls (Legend + Zoom) */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20 pointer-events-none w-full px-6 justify-between md:justify-center">
                 <div className="flex gap-4 bg-[#0f172a]/80 backdrop-blur px-4 py-2 rounded-full border border-slate-700 pointer-events-auto">
                     <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></div> 
                         <span className="text-[10px] font-bold text-cyan-200">BẠN</span>
                     </div>
                     <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_10px_#f43f5e]"></div> 
                         <span className="text-[10px] font-bold text-rose-200">NHỆN</span>
                     </div>
                 </div>

                 <div className="flex bg-[#0f172a]/80 rounded-full backdrop-blur border border-slate-700 p-1 pointer-events-auto">
                    <button onClick={resetView} className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors font-bold">✜</button>
                    <div className="w-[1px] bg-slate-700 my-1"></div>
                    <button onClick={() => setScale(s => Math.min(4, s + 0.2))} className="w-8 h-8 flex items-center justify-center rounded-full text-cyan-400 hover:bg-slate-700 transition-colors font-bold text-lg">+</button>
                    <div className="w-[1px] bg-slate-700 my-1"></div>
                    <button onClick={() => setScale(s => Math.max(0.5, s - 0.2))} className="w-8 h-8 flex items-center justify-center rounded-full text-cyan-400 hover:bg-slate-700 transition-colors font-bold text-lg">-</button>
                 </div>
            </div>
        </div>
    );
};

export default GameSpider;