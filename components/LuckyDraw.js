'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Ticket, Sparkles, Gift, Zap, Loader2, History, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { PREREGISTER_CONFIG } from '@/lib/preregister-config';

// Rarity Colors & Styles (Subtle & Clean for Shadcn)
const getRarityColor = (rarity) => {
    switch (rarity) {
        case 'LEGENDARY': return 'text-yellow-600 bg-yellow-100/50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/20 dark:border-yellow-800';
        case 'EPIC': return 'text-purple-600 bg-purple-100/50 border-purple-200 dark:text-purple-400 dark:bg-purple-900/20 dark:border-purple-800';
        case 'RARE': return 'text-blue-600 bg-blue-100/50 border-blue-200 dark:text-blue-400 dark:bg-blue-900/20 dark:border-blue-800';
        default: return 'text-slate-600 bg-slate-100/50 border-slate-200 dark:text-slate-400 dark:bg-slate-900/20 dark:border-slate-800';
    }
};

export default function LuckyDraw({ ticketCount, onDrawComplete }) {
    const [isSpinning, setIsSpinning] = useState(false);
    const [tapeItems, setTapeItems] = useState([]);
    const [winItem, setWinItem] = useState(null);
    const [showWinnerModal, setShowWinnerModal] = useState(false);
    const [history, setHistory] = useState([]);
    const tapeRef = useRef(null);

    // Config for tape animation
    const CARD_WIDTH = 140;
    const CARD_GAP = 16;
    const WIN_INDEX = 40;

    useEffect(() => {
        const initialItems = Array(15).fill(null).map(() => getRandomItem());
        setTapeItems(initialItems);
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await fetch('/api/luckydraw');
            const data = await res.json();
            if (data.history) setHistory(data.history);
        } catch (err) {
            console.error(err);
        }
    };

    const getRandomItem = () => {
        const items = PREREGISTER_CONFIG.luckyDraw.items;
        const rand = Math.random() * 100;
        let cumulative = 0;
        for (const item of items) {
            cumulative += item.chance;
            if (rand <= cumulative) return item;
        }
        return items[0];
    };

    const spin = async () => {
        if (isSpinning || ticketCount <= 0) return;
        setIsSpinning(true);
        setWinItem(null);
        setShowWinnerModal(false);

        try {
            const res = await fetch('/api/luckydraw', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();
            if (!data.reward) throw new Error(data.error);

            const result = data.reward;
            const newTape = [];
            for (let i = 0; i < WIN_INDEX + 5; i++) {
                newTape.push(i === WIN_INDEX ? result : getRandomItem());
            }
            setTapeItems(newTape);

            // Calculate random offset for "natural" feel
            const randomOffset = (Math.random() * 0.6 - 0.3) * CARD_WIDTH;

            setTimeout(() => {
                if (tapeRef.current) {
                    // Dynamic calculation based on current container width (Responsive!)
                    const containerWidth = tapeRef.current.parentElement.offsetWidth;
                    const itemTotalWidth = CARD_WIDTH + CARD_GAP;

                    // Calculate exact position to center the winning item
                    const targetPosition = (WIN_INDEX * itemTotalWidth) - (containerWidth / 2) + (CARD_WIDTH / 2) + randomOffset;

                    // Reset position instantly
                    tapeRef.current.style.transition = 'none';
                    tapeRef.current.style.transform = 'translateX(0px)';
                    tapeRef.current.offsetHeight; // Force reflow

                    // Start animation
                    tapeRef.current.style.transition = 'transform 5s cubic-bezier(0.2, 0.8, 0.2, 1)';
                    tapeRef.current.style.transform = `translateX(-${targetPosition}px)`;

                    setTimeout(() => {
                        setIsSpinning(false);
                        setWinItem(result);
                        setShowWinnerModal(true);
                        fetchHistory();
                        if (onDrawComplete) onDrawComplete();
                    }, 5000);
                }
            }, 50);

        } catch (err) {
            console.error(err);
            setIsSpinning(false);
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-4 space-y-6 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-6">

            {/* Winner Dialog (Responsive) */}
            <AnimatePresence>
                {showWinnerModal && winItem && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowWinnerModal(false)}
                            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="relative w-full max-w-sm sm:max-w-md rounded-lg border bg-background p-6 shadow-lg"
                        >
                            {/* Close Button */}
                            <div className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                                <X className="h-4 w-4 cursor-pointer" onClick={() => setShowWinnerModal(false)} />
                                <span className="sr-only">ปิด</span>
                            </div>

                            <div className="flex flex-col items-center text-center space-y-6">
                                {/* Header */}
                                <div className="space-y-2">
                                    <h2 className="text-lg font-semibold leading-none tracking-tight">ยินดีด้วย!</h2>
                                    <p className="text-sm text-muted-foreground">
                                        คุณได้รับไอเทมใหม่
                                    </p>
                                </div>

                                {/* Item Display */}
                                <div className="relative flex flex-col items-center justify-center py-6">
                                    {/* Subtle Glow Background */}
                                    <div className={`absolute inset-0 rounded-full blur-3xl opacity-20 ${winItem.rarity === 'LEGENDARY' ? 'bg-yellow-500' :
                                            winItem.rarity === 'EPIC' ? 'bg-purple-500' :
                                                winItem.rarity === 'RARE' ? 'bg-blue-500' : 'bg-slate-500'
                                        }`} />

                                    {/* Item Icon/Image */}
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 20 }}
                                        className="relative z-10"
                                    >
                                        <div className={`flex h-32 w-32 items-center justify-center rounded-2xl border-2 bg-card shadow-sm ${getRarityColor(winItem.rarity)}`}>
                                            {winItem.image ? (
                                                <div className="relative w-24 h-24">
                                                    <Image
                                                        src={winItem.image}
                                                        alt={winItem.name}
                                                        fill
                                                        className="object-contain"
                                                    />
                                                </div>
                                            ) : (
                                                winItem.rarity === 'LEGENDARY' ? <Sparkles className="h-16 w-16" /> :
                                                    winItem.rarity === 'EPIC' ? <Zap className="h-16 w-16" /> :
                                                        <Gift className="h-16 w-16" />
                                            )}
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Item Details */}
                                <div className="space-y-2 w-full">
                                    <h3 className="font-medium text-xl break-words">{winItem.name}</h3>
                                    <div className="flex justify-center">
                                        <Badge variant="secondary" className="px-3 py-1 text-xs font-medium uppercase tracking-wider">
                                            {winItem.rarity}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Footer Actions */}
                                <div className="flex w-full gap-3 pt-4 flex-col-reverse sm:flex-row">
                                    <Button variant="outline" className="flex-1" onClick={() => setShowWinnerModal(false)}>
                                        ปิด
                                    </Button>
                                    <Button className="flex-1" onClick={spin} disabled={ticketCount <= 0}>
                                        สุ่มอีกครั้ง
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Main Game Area */}
            <div className="lg:col-span-2 space-y-6">
                <Card className="overflow-hidden border-none shadow-none bg-transparent sm:border sm:shadow-sm sm:bg-card">
                    <CardHeader className="px-4 sm:px-6">
                        <CardTitle>Lucky Draw</CardTitle>
                        <CardDescription>หมุนวงล้อเพื่อลุ้นรับรางวัลพิเศษ</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 sm:p-6">
                        {/* Tape Container */}
                        <div className="relative h-[180px] sm:h-[200px] w-full overflow-hidden bg-muted/30 sm:rounded-xl border-y sm:border">
                            {/* Center Marker */}
                            <div className="absolute left-1/2 top-0 bottom-0 z-20 w-[2px] bg-primary">
                                <div className="absolute -top-1 -left-[5px] border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-primary" />
                                <div className="absolute -bottom-1 -left-[5px] border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-primary" />
                            </div>

                            {/* Gradient Fade */}
                            <div className="absolute inset-0 z-10 bg-gradient-to-r from-background via-transparent to-background pointer-events-none" />

                            {/* Tape */}
                            <div
                                ref={tapeRef}
                                className="flex h-full items-center px-[50%]"
                                style={{ gap: CARD_GAP }}
                            >
                                {tapeItems.map((item, index) => (
                                    <div
                                        key={index}
                                        className={`flex h-[130px] w-[130px] sm:h-[140px] sm:w-[140px] shrink-0 flex-col items-center justify-between rounded-lg border bg-card p-3 sm:p-4 shadow-sm transition-all ${isSpinning && index === WIN_INDEX ? 'ring-2 ring-primary ring-offset-2' : ''
                                            }`}
                                    >
                                        <div className={`flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-muted/50 p-2 ${item.rarity === 'LEGENDARY' ? 'text-yellow-500' :
                                                item.rarity === 'EPIC' ? 'text-purple-500' : 'text-muted-foreground'
                                            }`}>
                                            {item.image ? (
                                                <div className="relative w-full h-full">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fill
                                                        className="object-contain drop-shadow-sm"
                                                    />
                                                </div>
                                            ) : (
                                                item.rarity === 'LEGENDARY' ? <Sparkles className="h-6 w-6 sm:h-8 sm:w-8" /> :
                                                    item.rarity === 'EPIC' ? <Zap className="h-6 w-6 sm:h-8 sm:w-8" /> :
                                                        <Gift className="h-6 w-6 sm:h-8 sm:w-8" />
                                            )}
                                        </div>
                                        <div className="text-center w-full">
                                            <p className="line-clamp-2 text-[10px] sm:text-xs font-medium leading-tight h-8 flex items-center justify-center">{item.name}</p>
                                            <p className="mt-1 text-[9px] sm:text-[10px] text-muted-foreground uppercase">{item.rarity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col items-center justify-center gap-4 border-t bg-muted/50 p-4 sm:p-6 sm:flex-row sm:justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Ticket className="h-4 w-4" />
                            <span>ตั๋วคงเหลือ: <span className="font-medium text-foreground">{ticketCount}</span></span>
                        </div>
                        <Button
                            size="lg"
                            onClick={spin}
                            disabled={isSpinning || ticketCount <= 0}
                            className="w-full sm:w-auto min-w-[160px]"
                        >
                            {isSpinning ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> กำลังหมุน...
                                </>
                            ) : (
                                <>
                                    หมุนเลย
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            {/* History Sidebar */}
            <Card className="h-[400px] lg:h-auto lg:max-h-[600px] flex flex-col">
                <CardHeader className="px-4 py-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <History className="h-4 w-4" /> ประวัติการสุ่ม
                    </CardTitle>
                </CardHeader>
                <Separator />
                <ScrollArea className="flex-1">
                    <div className="p-4 space-y-4">
                        {history.length > 0 ? (
                            history.map((item, index) => (
                                <div key={index} className="flex items-center justify-between gap-4 text-sm">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border bg-muted/50 p-1 ${item.rarity === 'LEGENDARY' ? 'text-yellow-500 border-yellow-500/20' :
                                                item.rarity === 'EPIC' ? 'text-purple-500 border-purple-500/20' : 'text-muted-foreground'
                                            }`}>
                                            <Gift className="h-4 w-4" />
                                        </div>
                                        <div className="grid gap-0.5">
                                            <span className="font-medium truncate">{item.reward_name}</span>
                                            <span className="text-xs text-muted-foreground">{new Date(item.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="shrink-0 text-[10px]">
                                        {item.rarity}
                                    </Badge>
                                </div>
                            ))
                        ) : (
                            <div className="flex h-32 flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
                                <History className="h-8 w-8 opacity-20" />
                                <p>ยังไม่มีประวัติ</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </Card>
        </div>
    );
}
