'use client';

import { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function GiftInventory() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const res = await fetch('/api/user/inventory');
            const data = await res.json();
            if (data.items) {
                setItems(data.items);
            }
        } catch (error) {
            console.error("Failed to fetch inventory", error);
        } finally {
            setLoading(false);
        }
    };

    const pendingItems = items.filter(i => i.status === 'pending');
    const claimedItems = items.filter(i => i.status === 'claimed');

    return (
        <div className="space-y-8">
            {/* Pending Items (Ready to Claim) */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <Package className="w-5 h-5 text-primary" />
                            กล่องของขวัญ (รอรับในเกม)
                        </h3>
                        <p className="text-muted-foreground text-sm">
                            เข้าเกมแล้วพิมพ์ <span className="font-mono bg-muted px-1 rounded">/claim</span> เพื่อรับของ
                        </p>
                    </div>
                    <Badge variant={pendingItems.length > 0 ? "default" : "secondary"} className="text-sm px-4 py-1 self-start sm:self-center">
                        {pendingItems.length} รายการ
                    </Badge>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-32 text-muted-foreground bg-muted/10 rounded-3xl">
                        <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                            กำลังโหลด...
                        </div>
                    </div>
                ) : pendingItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {pendingItems.map((item) => (
                            <div key={item.id} className="bg-background rounded-2xl p-4 border border-border/50 shadow-sm hover:shadow-md transition-all flex items-center gap-4 group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-[3rem] -mr-4 -mt-4 transition-transform group-hover:scale-110" />

                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary relative z-10">
                                    <Package className="w-6 h-6" />
                                </div>
                                <div className="relative z-10 min-w-0">
                                    <h4 className="font-bold text-foreground truncate" title={item.item_name}>{item.item_name}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="outline" className="text-xs h-5 bg-background/50">
                                            x{item.amount}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> รอรับ
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground bg-muted/10 rounded-3xl border-2 border-dashed border-muted/50">
                        <Package className="w-10 h-10 mb-3 opacity-20" />
                        <p>ไม่มีของขวัญที่รอรับ</p>
                    </div>
                )}
            </div>

            {/* History Section */}
            <div className="space-y-4 pt-4 border-t border-border/50">
                <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <h3 className="text-lg font-bold text-muted-foreground">ประวัติการรับล่าสุด</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {claimedItems.length > 0 ? (
                        claimedItems.slice(0, 8).map((item) => (
                            <div key={item.id} className="p-3 rounded-xl bg-muted/20 border border-transparent hover:border-border/50 flex items-center justify-between transition-all">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-medium text-sm truncate" title={item.item_name}>{item.item_name}</p>
                                        <p className="text-[10px] text-muted-foreground">
                                            {new Date(item.claimed_at).toLocaleDateString('th-TH')}
                                        </p>
                                    </div>
                                </div>
                                <Badge variant="secondary" className="text-[10px] h-5 px-1.5 ml-2">x{item.amount}</Badge>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center text-muted-foreground text-sm py-8">
                            ยังไม่มีประวัติการรับของ
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
