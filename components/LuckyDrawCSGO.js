'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Ticket, Sparkles, Gift, Zap, Loader2 } from 'lucide-react';
import { motion, useAnimation, useSpring } from 'framer-motion';
import { PREREGISTER_CONFIG } from '@/lib/preregister-config';

// Helper for rarity styles
const getRarityColor = (rarity) => {
    switch (rarity) {
        case 'LEGENDARY': return 'from-yellow-500/20 to-yellow-600/20 border-yellow-500 text-yellow-500';
        case 'EPIC': return 'from-purple-500/20 to-purple-600/20 border-purple-500 text-purple-500';
        case 'RARE': return 'from-blue-500/20 to-blue-600/20 border-blue-500 text-blue-500';
        default: return 'from-slate-500/20 to-slate-600/20 border-slate-500 text-slate-400';
    }
};

const getRarityBg = (rarity) => {
    switch (rarity) {
        case 'LEGENDARY': return 'bg-yellow-500';
        case 'EPIC': return 'bg-purple-500';
        case 'RARE': return 'bg-blue-500';
        default: return 'bg-slate-500';
    }
};

export default function LuckyDrawCSGO({ ticketCount = 10, onDrawComplete }) {
    const [isSpinning, setIsSpinning] = useState(false);
    const [tapeItems, setTapeItems] = useState([]);
    const [winItem, setWinItem] = useState(null);
    const tapeRef = useRef(null);
    const CARD_WIDTH = 160; // Width of each item card
    const CARD_GAP = 12;    // Gap between cards
    const WIN_INDEX = 65;   // Index where the winning item will land

    // Initialize with some random items for display
    useEffect(() => {
        const initialItems = Array(10).fill(null).map(() => getRandomItem());
        setTapeItems(initialItems);
    }, []);

    const getRandomItem = () => {
        const items = PREREGISTER_CONFIG.luckyDraw.items;
        // Simple weighted random for visual filler
        const rand = Math.random() * 100;
        let cumulative = 0;
        for (const item of items) {
            cumulative += item.chance;
            if (rand <= cumulative) return item;
        }
        return items[0];
    };

    const spin = () => {
        if (isSpinning) return;
        setIsSpinning(true);
        setWinItem(null);

        // 1. Determine Result (Mocking backend logic here for demo)
        // In real app, you would fetch this from API first
        const items = PREREGISTER_CONFIG.luckyDraw.items;
        const rand = Math.random() * 100;
        let cumulative = 0;
        let result = items[0];
        for (const item of items) {
            cumulative += item.chance;
            if (rand <= cumulative) {
                result = item;
                break;
            }
        }

        // 2. Generate Tape
        // We need enough items before the win index to scroll through
        const newTape = [];
        for (let i = 0; i < WIN_INDEX + 5; i++) {
            if (i === WIN_INDEX) {
                newTape.push(result);
            } else {
                newTape.push(getRandomItem());
            }
        }
        setTapeItems(newTape);

        // 3. Calculate Scroll Position
        // Center the WIN_INDEX item
        // Container center = (ContainerWidth / 2)
        // Item center = (WIN_INDEX * (WIDTH + GAP)) + (WIDTH / 2)
        // Offset = Item center - Container center
        // We add some random offset within the card width to make it look natural (not always dead center)
        const randomOffset = (Math.random() * 0.8 - 0.4) * CARD_WIDTH; // +/- 40% of card width

        // We need to wait a tick for the DOM to update with new items before scrolling
        setTimeout(() => {
            if (tapeRef.current) {
                const containerWidth = tapeRef.current.parentElement.offsetWidth;
                const itemTotalWidth = CARD_WIDTH + CARD_GAP;
                const targetPosition = (WIN_INDEX * itemTotalWidth) - (containerWidth / 2) + (CARD_WIDTH / 2) + randomOffset;

                // Reset position first (instant)
                tapeRef.current.style.transition = 'none';
                tapeRef.current.style.transform = 'translateX(0px)';

                // Force reflow
                tapeRef.current.offsetHeight;

                // Start Animation
                // CSS Transition for smooth high-performance animation
                tapeRef.current.style.transition = 'transform 6s cubic-bezier(0.15, 0.85, 0.15, 1.0)'; // Custom ease-out
                tapeRef.current.style.transform = `translateX(-${targetPosition}px)`;

                // 4. Handle Finish
                setTimeout(() => {
                    setIsSpinning(false);
                    setWinItem(result);
                    if (onDrawComplete) onDrawComplete(result);
                }, 6000); // Must match transition duration
            }
        }, 50);
    };

    return (
        <div className="w-full max-w-5xl mx-auto space-y-8 p-4">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-black tracking-tighter uppercase italic">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-600">
                        CS:GO Style
                    </span> Lucky Draw
                </h1>
                <p className="text-muted-foreground">ทดสอบระบบสุ่มรางวัลแบบ Case Opening</p>
            </div>

            {/* Main Case Opening Window */}
            <div className="relative w-full bg-black/40 border-y-4 border-primary/20 backdrop-blur-md h-[280px] flex items-center overflow-hidden shadow-2xl">

                {/* Center Marker (The Red Line) */}
                <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-yellow-500 z-30 shadow-[0_0_20px_rgba(234,179,8,0.8)]">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-yellow-500">▼</div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-yellow-500">▲</div>
                </div>

                {/* Glass Reflection Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none z-20" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80 pointer-events-none z-20" />

                {/* The Tape */}
                <div
                    ref={tapeRef}
                    className="flex items-center gap-[12px] px-[50%] will-change-transform"
                    style={{ transform: 'translateX(0px)' }}
                >
                    {tapeItems.map((item, index) => (
                        <div
                            key={index}
                            className={`relative shrink-0 w-[160px] h-[200px] rounded-lg border-b-4 bg-gradient-to-b ${getRarityColor(item.rarity)} flex flex-col items-center justify-between p-4 shadow-lg transition-opacity duration-300 ${isSpinning && index === WIN_INDEX ? 'brightness-110' : ''}`}
                            style={{
                                backgroundColor: 'rgba(30, 41, 59, 0.9)', // Dark slate bg
                            }}
                        >
                            {/* Rarity Bar Top */}
                            <div className={`w-full h-1 rounded-full mb-2 ${getRarityBg(item.rarity)}`} />

                            {/* Icon/Image */}
                            <div className="flex-1 flex items-center justify-center">
                                {item.rarity === 'LEGENDARY' ? (
                                    <Sparkles className={`w-16 h-16 ${item.rarity === 'LEGENDARY' ? 'text-yellow-500 animate-pulse' : ''}`} />
                                ) : item.rarity === 'EPIC' ? (
                                    <Zap className="w-16 h-16 text-purple-500" />
                                ) : (
                                    <Gift className={`w-14 h-14 ${item.rarity === 'RARE' ? 'text-blue-500' : 'text-slate-400'}`} />
                                )}
                            </div>

                            {/* Name */}
                            <div className="text-center w-full">
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{item.rarity}</p>
                                <p className="text-sm font-semibold leading-tight line-clamp-2 min-h-[2.5em] flex items-center justify-center">
                                    {item.name}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center justify-center gap-6">
                {winItem && !isSpinning && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center p-6 bg-primary/10 rounded-2xl border border-primary/20"
                    >
                        <p className="text-muted-foreground mb-2">ยินดีด้วย! คุณได้รับ</p>
                        <h2 className={`text-3xl font-bold mb-4 ${winItem.rarity === 'LEGENDARY' ? 'text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]' :
                            winItem.rarity === 'EPIC' ? 'text-purple-500' :
                                'text-foreground'
                            }`}>
                            {winItem.name}
                        </h2>
                        <Badge variant="outline" className={`${getRarityColor(winItem.rarity)} bg-transparent`}>
                            {winItem.rarity} ITEM
                        </Badge>
                    </motion.div>
                )}

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full border">
                        <Ticket className="w-5 h-5 text-primary" />
                        <span className="font-bold">{ticketCount} Tickets</span>
                    </div>
                    <Button
                        size="lg"
                        onClick={spin}
                        disabled={isSpinning || ticketCount <= 0}
                        className="min-w-[200px] h-14 text-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                    >
                        {isSpinning ? (
                            <>
                                <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Rolling...
                            </>
                        ) : (
                            'OPEN CASE'
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
