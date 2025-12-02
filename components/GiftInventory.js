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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Left Column: Pending Items (Ready to Claim) */}
            <div className="lg:col-span-2 space-y-6">
                <div className="rounded-3xl bg-muted/10 p-8 min-h-[400px]">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold flex items-center gap-2 mb-1">
                                <Package className="w-5 h-5 text-primary" />
                                กล่องของขวัญ (รอรับในเกม)
                            </h3>
                            <p className="text-muted-foreground text-sm">
                                รายการไอเทมที่รอคุณอยู่ เข้าเกมแล้วพิมพ์ /claim เพื่อรับของได้เลย!
                            </p>
                        </div>
                        <Badge variant="secondary" className="text-base px-3 py-1">
                            {pendingItems.length} รายการ
                        </Badge>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center h-40 text-muted-foreground">
                            กำลังโหลดข้อมูล...
                        </div>
                    ) : pendingItems.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {pendingItems.map((item) => (
                                <div key={item.id} className="bg-background/50 backdrop-blur-sm p-4 rounded-2xl border border-primary/10 flex items-center gap-4 relative overflow-hidden group hover:border-primary/30 transition-colors">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150" />

                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                                        <Package className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-foreground">{item.item_name}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="outline" className="text-xs bg-primary/5 border-primary/20 text-primary">
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
                        <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground bg-background/20 rounded-2xl border-2 border-dashed border-muted">
                            <Package className="w-12 h-12 mb-4 opacity-20" />
                            <p>ไม่มีของขวัญที่รอรับ</p>
                            <p className="text-sm opacity-70">ไปสุ่มกาชาหรือชวนเพื่อนเพื่อรับรางวัลสิ!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Column: History */}
            <div className="rounded-3xl bg-muted/10 p-8 h-full flex flex-col">
                <div className="mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2 mb-1">
                        <Clock className="w-5 h-5 text-muted-foreground" />
                        ประวัติการรับ
                    </h3>
                    <p className="text-muted-foreground text-sm">รายการที่รับไปแล้วล่าสุด</p>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {claimedItems.length > 0 ? (
                        <div className="space-y-3">
                            {claimedItems.slice(0, 10).map((item) => (
                                <div key={item.id} className="p-4 rounded-2xl bg-background/30 flex items-center justify-between opacity-70 hover:opacity-100 transition-opacity">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        <div>
                                            <p className="font-medium text-sm">{item.item_name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(item.claimed_at).toLocaleDateString('th-TH')}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant="secondary" className="text-xs">x{item.amount}</Badge>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-muted-foreground text-sm py-8">ยังไม่มีประวัติการรับของ</p>
                    )}
                </div>
            </div>
        </div>
    );
}
