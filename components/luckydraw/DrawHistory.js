'use client';

import { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { History, Gift, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export default function DrawHistory({ refreshTrigger }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/luckydraw');
            const data = await res.json();
            if (data.history) setHistory(data.history);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch only when dialog opens (lazy load)
    useEffect(() => {
        if (isOpen) {
            fetchHistory();
        }
    }, [isOpen]);

    // Also refetch when refreshTrigger changes AND dialog is already open
    useEffect(() => {
        if (isOpen && refreshTrigger > 0) {
            fetchHistory();
        }
    }, [refreshTrigger]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-3 gap-2 bg-card/40 border border-border/50 hover:bg-accent hover:text-accent-foreground text-foreground backdrop-blur-sm">
                <History className="w-4 h-4 text-primary" />
                ประวัติการสุ่ม
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-card border-border text-card-foreground">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <History className="w-5 h-5 text-primary" />
                        ประวัติการสุ่มของคุณ
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        รายการไอเทมที่คุณได้รับจากการสุ่มล่าสุด
                    </DialogDescription>
                </DialogHeader>

                <div className="flex justify-end mb-2">
                    <Button variant="ghost" size="sm" onClick={fetchHistory} disabled={loading} className="h-8 gap-2 text-muted-foreground hover:text-foreground">
                        <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                        รีเฟรช
                    </Button>
                </div>

                <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-3">
                        {history.length > 0 ? (
                            history.map((item, index) => (
                                <div key={index} className="flex items-center justify-between gap-3 text-sm bg-muted/30 p-3 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background p-1 ${item.rarity === 'LEGENDARY' ? 'text-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.2)]' :
                                            item.rarity === 'EPIC' ? 'text-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.2)]' :
                                                'text-muted-foreground'
                                            }`}>
                                            <Gift className="h-4 w-4" />
                                        </div>
                                        <div className="grid gap-0.5 min-w-0">
                                            <span className="font-medium truncate text-foreground">{item.reward_name}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(item.created_at).toLocaleString('th-TH', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                    <Badge variant="secondary" className={`shrink-0 text-[10px] border-0 ${item.rarity === 'LEGENDARY' ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400' :
                                        item.rarity === 'EPIC' ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400' :
                                            'bg-slate-500/20 text-slate-600 dark:text-slate-400'
                                        }`}>
                                        {item.rarity}
                                    </Badge>
                                </div>
                            ))
                        ) : (
                            <div className="flex h-40 flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
                                <History className="h-8 w-8 opacity-20" />
                                <p>ยังไม่มีประวัติการสุ่ม</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
