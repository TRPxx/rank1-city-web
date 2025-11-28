'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Ticket, Loader2, Sparkles, Gift, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PREREGISTER_CONFIG } from '@/lib/preregister-config';

export default function LuckyDraw({ ticketCount, onDrawComplete }) {
    const [isSpinning, setIsSpinning] = useState(false);
    const [reward, setReward] = useState(null);
    const [history, setHistory] = useState([]);
    const [error, setError] = useState('');
    const [currentSlotItem, setCurrentSlotItem] = useState(PREREGISTER_CONFIG.luckyDraw.items[0]);

    // Slot machine effect
    useEffect(() => {
        let interval;
        if (isSpinning) {
            interval = setInterval(() => {
                const items = PREREGISTER_CONFIG.luckyDraw.items;
                const randomItem = items[Math.floor(Math.random() * items.length)];
                setCurrentSlotItem(randomItem);
            }, 100); // Change item every 100ms
        }
        return () => clearInterval(interval);
    }, [isSpinning]);

    const fetchHistory = async () => {
        try {
            const res = await fetch('/api/luckydraw');
            const data = await res.json();
            if (data.history) {
                setHistory(data.history);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleDraw = async () => {
        if (ticketCount <= 0) return;
        setIsSpinning(true);
        setError('');
        setReward(null);

        try {
            // Simulate network delay + spin time (at least 3 seconds)
            const minSpinTime = 3000;
            const startTime = Date.now();

            const res = await fetch('/api/luckydraw', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();

            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, minSpinTime - elapsedTime);

            setTimeout(() => {
                setIsSpinning(false);
                if (data.reward) {
                    setReward(data.reward);
                    fetchHistory();
                    if (onDrawComplete) onDrawComplete();
                } else {
                    setError(data.error || 'เกิดข้อผิดพลาดในการสุ่ม');
                }
            }, remainingTime);

        } catch (err) {
            setIsSpinning(false);
            setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
        }
    };

    // Helper to get rarity color
    const getRarityColor = (rarity) => {
        switch (rarity) {
            case 'LEGENDARY': return 'text-yellow-500 border-yellow-500/50 bg-yellow-500/10';
            case 'EPIC': return 'text-purple-500 border-purple-500/50 bg-purple-500/10';
            case 'RARE': return 'text-blue-500 border-blue-500/50 bg-blue-500/10';
            default: return 'text-slate-500 border-slate-500/50 bg-slate-500/10';
        }
    };

    const getRarityGlow = (rarity) => {
        switch (rarity) {
            case 'LEGENDARY': return 'shadow-[0_0_50px_rgba(234,179,8,0.5)]';
            case 'EPIC': return 'shadow-[0_0_50px_rgba(168,85,247,0.5)]';
            case 'RARE': return 'shadow-[0_0_50px_rgba(59,130,246,0.5)]';
            default: return '';
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto h-auto lg:h-full">
            {/* Left Column: Slot Machine */}
            <Card className="lg:col-span-2 border-border shadow-sm flex flex-col relative overflow-hidden shrink-0">
                <CardHeader className="text-center pb-2 z-10">
                    <CardTitle className="text-2xl flex items-center justify-center gap-2">
                        <Sparkles className="w-6 h-6 text-yellow-500" />
                        สุ่มรางวัล
                    </CardTitle>
                    <CardDescription>ใช้ตั๋วของคุณเพื่อลุ้นรับไอเทมในเกมสุดพิเศษ!</CardDescription>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col items-center justify-center py-4 z-10">
                    {/* Slot Window */}
                    <div className="relative w-48 h-48 mb-6">
                        {/* Background Glow - Added pointer-events-none */}
                        <div className={`absolute inset-0 rounded-full blur-3xl transition-all duration-500 pointer-events-none ${reward ? getRarityGlow(reward.rarity) : 'bg-primary/5'
                            }`} />

                        <div className="relative w-full h-full bg-background border-4 border-muted rounded-3xl flex items-center justify-center shadow-inner overflow-hidden">
                            <AnimatePresence mode="wait">
                                {reward ? (
                                    <motion.div
                                        key="reward"
                                        initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                        className="text-center p-4"
                                    >
                                        <div className="text-5xl mb-3 animate-bounce">🎁</div>
                                        <div className={`text-sm font-bold px-3 py-1 rounded-full border mb-2 inline-block ${getRarityColor(reward.rarity)}`}>
                                            {reward.rarity}
                                        </div>
                                        <h3 className="text-lg font-bold line-clamp-2">{reward.name}</h3>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="slot"
                                        className="text-center opacity-80"
                                        animate={isSpinning ? { y: [0, -20, 0] } : {}}
                                        transition={{ repeat: Infinity, duration: 0.1 }}
                                    >
                                        <div className="text-5xl mb-3">❓</div>
                                        <div className="text-base font-medium text-muted-foreground">
                                            {isSpinning ? currentSlotItem.name : 'พร้อมสุ่ม?'}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Ticket Counter & Button */}
                    <div className="flex flex-col items-center gap-4 w-full max-w-xs z-20">
                        <div className="flex items-center gap-2 text-lg font-medium">
                            <Ticket className="w-5 h-5 text-primary" />
                            ตั๋วของคุณ: <span className="text-2xl font-bold text-primary">{ticketCount}</span>
                        </div>

                        <Button
                            size="lg"
                            className="w-full text-lg h-12 relative overflow-hidden group cursor-pointer"
                            onClick={handleDraw}
                            disabled={isSpinning || ticketCount <= 0}
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                            {isSpinning ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    กำลังสุ่ม...
                                </>
                            ) : ticketCount > 0 ? (
                                <>
                                    <Sparkles className="mr-2 h-5 w-5" />
                                    สุ่มเลย (ใช้ 1 ตั๋ว)
                                </>
                            ) : (
                                'ไม่มีตั๋ว'
                            )}
                        </Button>

                        {ticketCount === 0 && (
                            <p className="text-xs text-muted-foreground text-center animate-pulse">
                                ต้องการตั๋วเพิ่ม? เชิญเพื่อนเพื่อรับตั๋วเพิ่มเลย!
                            </p>
                        )}

                        {error && (
                            <p className="text-sm text-destructive font-medium">{error}</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Right Column: History */}
            <Card className="h-[300px] lg:h-full flex flex-col overflow-hidden">
                <CardHeader className="shrink-0">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <History className="w-5 h-5" />
                        ประวัติการสุ่ม
                    </CardTitle>
                    <CardDescription>รายการไอเทมที่คุณได้รับล่าสุด</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto pr-2 min-h-0">
                    {history.length > 0 ? (
                        <div className="space-y-2">
                            {history.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-2 rounded-lg border bg-muted/20">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-lg shrink-0">
                                            🎁
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium line-clamp-1">{item.reward_name}</p>
                                            <p className="text-[10px] text-muted-foreground">
                                                {new Date(item.created_at).toLocaleDateString('th-TH')}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className={`text-[10px] px-1 h-5 ${getRarityColor(item.rarity)}`}>
                                        {item.rarity}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                            <History className="w-12 h-12 mb-2" />
                            <p>ยังไม่มีประวัติ</p>
                            <p className="text-xs">เริ่มสุ่มเพื่อรับรางวัลเลย!</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
