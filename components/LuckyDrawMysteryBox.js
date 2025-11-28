'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Ticket, Package, Sparkles, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PREREGISTER_CONFIG } from '@/lib/preregister-config';

export default function LuckyDrawMysteryBox({ ticketCount = 10, onDrawComplete }) {
    const [status, setStatus] = useState('idle'); // idle, shaking, opening, revealed
    const [reward, setReward] = useState(null);

    const handleOpen = () => {
        if (ticketCount <= 0 || status !== 'idle') return;

        setStatus('shaking');

        // Simulate API call
        setTimeout(() => {
            // Determine reward (Mock)
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
            setReward(result);

            // Transition to opening
            setStatus('opening');

            // Reveal
            setTimeout(() => {
                setStatus('revealed');
                if (onDrawComplete) onDrawComplete(result);
            }, 1000);

        }, 2000); // Shake duration
    };

    const reset = () => {
        setStatus('idle');
        setReward(null);
    };

    // Rarity Colors
    const getGlowColor = (rarity) => {
        switch (rarity) {
            case 'LEGENDARY': return 'shadow-[0_0_100px_rgba(234,179,8,0.8)] bg-yellow-500';
            case 'EPIC': return 'shadow-[0_0_80px_rgba(168,85,247,0.8)] bg-purple-500';
            case 'RARE': return 'shadow-[0_0_60px_rgba(59,130,246,0.8)] bg-blue-500';
            default: return 'shadow-[0_0_40px_rgba(255,255,255,0.5)] bg-white';
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[600px] relative perspective-1000">

            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-3xl opacity-20 animate-pulse" />
            </div>

            {/* Main Stage */}
            <div className="relative w-full h-[400px] flex items-center justify-center mb-12">

                <AnimatePresence mode="wait">
                    {status === 'revealed' && reward ? (
                        <motion.div
                            key="reward"
                            initial={{ scale: 0, opacity: 0, rotateY: 180 }}
                            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            className="relative z-20 flex flex-col items-center"
                        >
                            {/* God Rays */}
                            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl -z-10 ${getGlowColor(reward.rarity)} opacity-30`} />

                            <div className="w-48 h-48 mb-6 relative">
                                <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${getGlowColor(reward.rarity)}`} />
                                <div className="relative w-full h-full bg-background/80 backdrop-blur-xl border-2 border-primary/50 rounded-3xl flex items-center justify-center shadow-2xl">
                                    {/* Placeholder Icon */}
                                    <Star className={`w-24 h-24 ${reward.rarity === 'LEGENDARY' ? 'text-yellow-500 fill-yellow-500' :
                                            reward.rarity === 'EPIC' ? 'text-purple-500 fill-purple-500' :
                                                'text-primary'
                                        }`} />
                                </div>
                            </div>

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-center space-y-2"
                            >
                                <Badge variant="outline" className="mb-2 text-lg px-4 py-1 border-primary/50 bg-primary/10">
                                    {reward.rarity}
                                </Badge>
                                <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 drop-shadow-lg">
                                    {reward.name}
                                </h2>
                            </motion.div>

                            <Button onClick={reset} className="mt-8" variant="secondary">
                                Play Again
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="box"
                            className="relative cursor-pointer group"
                            onClick={handleOpen}
                            animate={
                                status === 'shaking' ? {
                                    x: [-5, 5, -5, 5, -3, 3, 0],
                                    y: [-5, 5, -2, 2, 0],
                                    rotate: [-2, 2, -1, 1, 0],
                                    scale: [1, 1.1, 1.05, 1.15, 1.2]
                                } : status === 'opening' ? {
                                    scale: 1.5,
                                    opacity: 0,
                                    filter: "brightness(2)"
                                } : {
                                    y: [0, -20, 0],
                                }
                            }
                            transition={
                                status === 'shaking' ? { duration: 0.5, repeat: 4 } :
                                    status === 'opening' ? { duration: 0.2 } :
                                        { duration: 3, repeat: Infinity, ease: "easeInOut" }
                            }
                        >
                            {/* 3D Box Representation (Simplified with CSS) */}
                            <div className="w-48 h-48 relative transform-style-3d">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-2xl border-4 border-blue-400/50 flex items-center justify-center z-10">
                                    <Package className="w-24 h-24 text-white/80" />
                                </div>
                                {/* Glow effect behind */}
                                <div className="absolute -inset-4 bg-blue-500/30 blur-xl -z-10 rounded-full group-hover:bg-blue-400/50 transition-colors duration-500" />
                            </div>

                            {status === 'idle' && (
                                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-center whitespace-nowrap">
                                    <p className="text-sm font-medium text-muted-foreground animate-bounce">Click to Open</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Controls */}
            {status !== 'revealed' && (
                <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2 px-6 py-3 bg-background/50 backdrop-blur border rounded-full">
                        <Ticket className="w-5 h-5 text-primary" />
                        <span className="text-xl font-bold">{ticketCount} Tickets</span>
                    </div>
                    <Button
                        size="lg"
                        onClick={handleOpen}
                        disabled={status !== 'idle' || ticketCount <= 0}
                        className="w-48 h-14 text-lg font-bold shadow-lg shadow-blue-500/20"
                    >
                        {status === 'idle' ? 'OPEN BOX' : 'OPENING...'}
                    </Button>
                </div>
            )}
        </div>
    );
}
