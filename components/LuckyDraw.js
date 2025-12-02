'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Ticket, Sparkles, Gift, Zap, Loader2, History, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useLuckyDraw } from '@/hooks/useLuckyDraw';

// Rarity Colors & Styles (Subtle & Clean for Shadcn)
const getRarityColor = (rarity) => {
    switch (rarity) {
        case 'LEGENDARY': return 'text-yellow-600 bg-yellow-100/50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/20 dark:border-yellow-800';
        case 'EPIC': return 'text-purple-600 bg-purple-100/50 border-purple-200 dark:text-purple-400 dark:bg-purple-900/20 dark:border-purple-800';
        case 'RARE': return 'text-blue-600 bg-blue-100/50 border-blue-200 dark:text-blue-400 dark:bg-blue-900/20 dark:border-blue-800';
        default: return 'text-slate-600 bg-slate-100/50 border-slate-200 dark:text-slate-400 dark:bg-slate-900/20 dark:border-slate-800';
    }
};

const getCardBorderClass = (rarity) => {
    switch (rarity) {
        case 'LEGENDARY': return 'border-2 border-yellow-500/60 shadow-[0_0_12px_rgba(234,179,8,0.2)] bg-yellow-500/5';
        case 'EPIC': return 'border-2 border-purple-500/60 shadow-[0_0_12px_rgba(168,85,247,0.2)] bg-purple-500/5';
        case 'RARE': return 'border-2 border-blue-500/60 shadow-[0_0_12px_rgba(59,130,246,0.2)] bg-blue-500/5';
        default: return 'border border-border/50 bg-card';
    }
};

export default function LuckyDraw({ ticketCount, onDrawComplete }) {
    const {
        isSpinning,
        tapeItems,
        winItem,
        showWinnerModal,
        setShowWinnerModal,
        history,
        tapeRef,
        spin
    } = useLuckyDraw({ onDrawComplete });

    const CARD_GAP = 16;
    const WIN_INDEX = 40; // Needed for rendering logic if we want to highlight the winner during spin, though the hook handles the animation.
    // Actually, the hook handles the ref manipulation, but we need to render the items.
    // The original code used WIN_INDEX in the render loop to add a ring class.
    // We should probably export WIN_INDEX from the hook or just hardcode it here too as it's a visual constant.
    // Let's keep it consistent.

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
                                    <Button className="flex-1" onClick={() => spin(ticketCount)} disabled={ticketCount <= 0}>
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
                <div className="overflow-hidden rounded-3xl bg-muted/10 p-6 sm:p-8">
                    <div className="mb-6">
                        <h3 className="text-xl font-bold mb-1">Lucky Draw</h3>
                        <p className="text-muted-foreground text-sm">หมุนวงล้อเพื่อลุ้นรับรางวัลพิเศษ</p>
                    </div>

                    {/* Tape Container */}
                    <div className="relative h-[180px] sm:h-[200px] w-full overflow-hidden bg-background/50 rounded-2xl border-0 shadow-inner mb-6">
                        {/* Center Marker */}
                        <div className="absolute left-1/2 top-0 bottom-0 z-20 w-[2px] bg-primary shadow-[0_0_10px_rgba(var(--primary),0.8)]">
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
                                    className={`flex h-[130px] w-[130px] sm:h-[140px] sm:w-[140px] shrink-0 flex-col items-center justify-between rounded-xl p-3 sm:p-4 transition-all ${getCardBorderClass(item.rarity)}`}
                                >
                                    <div className={`flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full p-2 ${getRarityColor(item.rarity)}`}>
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

                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-between bg-background/30 p-4 rounded-xl">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Ticket className="h-4 w-4 text-primary" />
                            <span>ตั๋วคงเหลือ: <span className="font-bold text-foreground text-lg ml-1">{ticketCount}</span></span>
                        </div>
                        <Button
                            size="lg"
                            onClick={() => spin(ticketCount)}
                            disabled={isSpinning || ticketCount <= 0}
                            className="w-full sm:w-auto min-w-[160px] shadow-lg shadow-primary/20"
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
                    </div>
                </div>
            </div>

            {/* History Sidebar */}
            <div className="h-[400px] lg:h-auto lg:max-h-[600px] flex flex-col rounded-3xl bg-muted/10 p-6">
                <div className="mb-4 flex items-center gap-2">
                    <History className="h-4 w-4 text-primary" />
                    <h3 className="font-bold">ประวัติการสุ่ม</h3>
                </div>
                <ScrollArea className="flex-1 -mr-4 pr-4">
                    <div className="space-y-3">
                        {history.length > 0 ? (
                            history.map((item, index) => (
                                <div key={index} className="flex items-center justify-between gap-4 text-sm bg-background/40 p-3 rounded-xl">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/50 p-1 ${item.rarity === 'LEGENDARY' ? 'text-yellow-500' :
                                            item.rarity === 'EPIC' ? 'text-purple-500' : 'text-muted-foreground'
                                            }`}>
                                            <Gift className="h-4 w-4" />
                                        </div>
                                        <div className="grid gap-0.5">
                                            <span className="font-medium truncate">{item.reward_name}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(item.created_at).toLocaleString('th-TH', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                    <Badge variant="secondary" className="shrink-0 text-[10px] bg-background/50">
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
            </div>
        </div>
    );
}
