'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Clock, Gift, Crown, Sparkles, Star, Zap } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

// กำหนดรางวัลตาม Rarity (จาก preregister-config.json)
const PRIZE_RARITY = {
    // LEGENDARY (SSR) - สีทอง
    'God Slayer Sword': 'LEGENDARY',
    'Luxury Mansion Key': 'LEGENDARY',
    'Supercar Key (GTR)': 'LEGENDARY',
    // EPIC (SR) - สีม่วง
    'Golden Guardian Sword': 'EPIC',
    'Gang Van Key': 'EPIC',
    'Small House Deed': 'EPIC',
    // RARE (R) - สีฟ้า
    'Iron Sword': 'RARE',
    'Trendy Shirt': 'RARE',
    'Gold Bar (10g)': 'RARE',
    'Premium Gacha Ticket': 'RARE',
    // COMMON (N) - สีเทา
    'Starter Food Pack': 'COMMON',
    'Small Money Bag ($1,000)': 'COMMON',
    'Bandage Box': 'COMMON',
};

const getRarity = (itemName) => {
    return PRIZE_RARITY[itemName] || 'COMMON';
};

const getRarityStyles = (rarity) => {
    switch (rarity) {
        case 'LEGENDARY':
            return {
                border: 'border-yellow-500/50 bg-gradient-to-r from-yellow-500/10 to-amber-500/10',
                text: 'text-yellow-500',
                icon: Crown,
                glow: 'shadow-[0_0_15px_rgba(234,179,8,0.3)]'
            };
        case 'EPIC':
            return {
                border: 'border-purple-500/50 bg-gradient-to-r from-purple-500/10 to-fuchsia-500/10',
                text: 'text-purple-500',
                icon: Sparkles,
                glow: 'shadow-[0_0_15px_rgba(168,85,247,0.3)]'
            };
        case 'RARE':
            return {
                border: 'border-blue-500/50 bg-gradient-to-r from-blue-500/10 to-cyan-500/10',
                text: 'text-blue-500',
                icon: Star,
                glow: ''
            };
        default:
            return {
                border: 'border-border/50 bg-card/50',
                text: 'text-muted-foreground',
                icon: Zap,
                glow: ''
            };
    }
};

export default function LiveWinners() {
    const [winners, setWinners] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchRecentWinners = async () => {
        try {
            const res = await fetch('/api/luckydraw/recent');
            if (res.ok) {
                const data = await res.json();
                setWinners(data.winners || []);
            }
        } catch (error) {
            console.error('Failed to fetch winners:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRecentWinners();
        // Refresh every 10 seconds
        const interval = setInterval(fetchRecentWinners, 10000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'เมื่อสักครู่';
        if (diffMins < 60) return `${diffMins} นาทีที่แล้ว`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours} ชม.`;
        return `${Math.floor(diffHours / 24)} วัน`;
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                        <Trophy className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-foreground">ผู้โชคดีล่าสุด</h3>
                        <p className="text-xs text-muted-foreground">อัพเดททุก 10 วินาที</p>
                    </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-green-500">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    LIVE
                </div>
            </div>

            <div className="space-y-3">
                {isLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="animate-pulse flex items-center gap-3 p-3 rounded-xl bg-card/30">
                                <div className="w-10 h-10 rounded-full bg-muted" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 bg-muted rounded w-24" />
                                    <div className="h-2 bg-muted rounded w-32" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : winners.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <Gift className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>ยังไม่มีผู้โชคดี</p>
                        <p className="text-xs">ลองหมุนเลย!</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {winners.map((winner, index) => {
                            const rarity = getRarity(winner.item_name);
                            const styles = getRarityStyles(rarity);
                            const IconComponent = styles.icon;

                            return (
                                <motion.div
                                    key={`${winner.discord_id}-${winner.created_at}-${index}`}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={cn(
                                        "flex items-center gap-3 p-3 rounded-xl border-2 transition-all hover:scale-[1.02]",
                                        styles.border,
                                        styles.glow
                                    )}
                                >
                                    <Avatar className={cn("h-10 w-10 ring-2", `ring-${styles.text.replace('text-', '')}`)}>
                                        <AvatarImage src={winner.avatar_url} alt={winner.discord_name} />
                                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                            {winner.discord_name?.[0]?.toUpperCase() || '?'}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-foreground text-sm truncate">
                                            {winner.discord_name || 'ผู้เล่น'}
                                        </p>
                                        <div className="flex items-center gap-1">
                                            <IconComponent className={cn("w-3 h-3", styles.text)} />
                                            <p className={cn("text-xs truncate font-medium", styles.text)}>
                                                {winner.item_name}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                                        <Clock className="w-3 h-3" />
                                        {formatTime(winner.created_at)}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}
