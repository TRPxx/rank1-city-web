'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { th } from 'date-fns/locale';

export default function RecentRegistrations() {
    const [registrations, setRegistrations] = useState([]);

    useEffect(() => {
        const fetchRecent = async () => {
            try {
                const res = await fetch('/api/preregister/recent');
                const data = await res.json();
                if (data.recent) {
                    setRegistrations(data.recent);
                }
            } catch (error) {
                console.error("Failed to fetch recent registrations", error);
            }
        };

        fetchRecent();
        const interval = setInterval(fetchRecent, 30000); // Refresh every 30s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full max-w-xs md:max-w-sm lg:max-w-md aspect-square bg-card/40 backdrop-blur-md rounded-3xl border border-border/50 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border/50 bg-muted/20">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    ผู้ลงทะเบียนล่าสุด
                </h3>
                <p className="text-xs text-muted-foreground">ยินดีต้อนรับชาวเมืองใหม่สู่ Rank1 City</p>
            </div>

            <div className="flex-1 overflow-hidden relative p-4">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/20 pointer-events-none z-10" />

                <div className="space-y-3 animate-marquee-vertical hover:pause">
                    {registrations.length === 0 ? (
                        <div className="text-center text-muted-foreground py-10">
                            กำลังโหลดข้อมูล...
                        </div>
                    ) : (
                        // Duplicate list for seamless loop if needed, but simple map is fine for now
                        // Actually, let's just show a list. If it overflows, it scrolls.
                        // But user wants "ticker" feel? "คุณ xxxx ได้ลงทะเบียนไปแล้ว เมื่อ 1 นาที"
                        registrations.map((user, index) => (
                            <motion.div
                                key={`${index}-${user.created_at}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center gap-3 p-3 rounded-xl bg-background/60 border border-border/30 shadow-sm"
                            >
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <User className="w-5 h-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">
                                        คุณ <span className="text-primary">{user.discord_name || 'Unknown'}</span>
                                    </p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        ลงทะเบียนเมื่อ {formatDistanceToNow(new Date(user.created_at), { addSuffix: true, locale: th })}
                                    </p>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
