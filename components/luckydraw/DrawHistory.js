'use client';

import { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { History, Gift, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DrawHistory({ refreshTrigger }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

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

    useEffect(() => {
        fetchHistory();
    }, [refreshTrigger]);

    return (
        <div className="flex flex-col h-full bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-2 text-white">
                    <History className="w-4 h-4 text-primary" />
                    <h3 className="font-bold">ประวัติการสุ่มของคุณ</h3>
                </div>
                <Button variant="ghost" size="icon" onClick={fetchHistory} disabled={loading} className="h-8 w-8 hover:bg-white/10">
                    <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                </Button>
            </div>

            <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                    {history.length > 0 ? (
                        history.map((item, index) => (
                            <div key={index} className="flex items-center justify-between gap-3 text-sm bg-white/5 p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black/40 p-1 ${item.rarity === 'LEGENDARY' ? 'text-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.2)]' :
                                            item.rarity === 'EPIC' ? 'text-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.2)]' :
                                                'text-muted-foreground'
                                        }`}>
                                        <Gift className="h-4 w-4" />
                                    </div>
                                    <div className="grid gap-0.5 min-w-0">
                                        <span className="font-medium truncate text-white/90">{item.reward_name}</span>
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
                                <Badge variant="secondary" className={`shrink-0 text-[10px] border-0 ${item.rarity === 'LEGENDARY' ? 'bg-yellow-500/20 text-yellow-400' :
                                        item.rarity === 'EPIC' ? 'bg-purple-500/20 text-purple-400' :
                                            'bg-slate-500/20 text-slate-400'
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
        </div>
    );
}
