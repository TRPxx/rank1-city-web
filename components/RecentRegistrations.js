'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Clock, Sparkles } from 'lucide-react';
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
        <div className="w-full max-w-md flex flex-col gap-4">
            <div className="flex items-center gap-2 px-2">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                    <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                </div>
                <h3 className="font-bold text-lg text-foreground/90">
                    ชาวเมืองล่าสุด
                </h3>
            </div>

            <div className="relative h-[400px] overflow-hidden mask-gradient-b">
                {/* Fade masks removed for transparency */}

                <div className="space-y-3 py-4">
                    {registrations.length === 0 ? (
                        <div className="text-center text-muted-foreground py-10 text-sm">
                            กำลังโหลดข้อมูล...
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout" initial={false}>
                            {registrations.map((user) => (
                                <motion.div
                                    layout
                                    key={`${user.discord_name}-${user.created_at}`}
                                    initial={{ opacity: 0, scale: 0.9, y: -20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-muted/40 transition-colors duration-300"
                                >
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 flex items-center justify-center shrink-0 border border-white/5 group-hover:border-primary/30 transition-colors overflow-hidden">
                                            {/* Use real avatar if available, otherwise DiceBear */}
                                            <img
                                                src={user.avatar_url || `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.discord_name}`}
                                                alt={user.discord_name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-baseline justify-between gap-2">
                                            <p className="text-sm font-semibold truncate text-foreground/90 group-hover:text-primary transition-colors">
                                                {user.discord_name || 'Unknown'}
                                            </p>
                                            <span className="text-[10px] text-muted-foreground/60 font-medium uppercase tracking-wider">
                                                New Citizen
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                            <Clock className="w-3 h-3 opacity-70" />
                                            <span>ลงทะเบียนเมื่อ {formatDistanceToNow(new Date(user.created_at), { addSuffix: true, locale: th })}</span>
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            </div>
        </div>
    );
}
