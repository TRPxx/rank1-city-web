'use client';

import { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

            if (data.items && Array.isArray(data.items)) {
                setItems(data.items);
            } else {
                setItems([]);
            }
        } catch (error) {
            console.error("Failed to fetch inventory", error);
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    const pendingItems = items.filter(i => i.status === 'pending');
    const claimedItems = items.filter(i => i.status === 'claimed');

    return (
        <div className="w-full">
            <Tabs defaultValue="pending" className="w-full">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <TabsList className="bg-muted/50 p-1 rounded-full h-auto">
                        <TabsTrigger value="pending" className="rounded-full px-6 py-2 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                            <Package className="w-4 h-4" />
                            รอรับ
                            <Badge variant="secondary" className="ml-1 h-5 px-1.5 bg-primary/10 text-primary hover:bg-primary/20">{pendingItems.length}</Badge>
                        </TabsTrigger>
                        <TabsTrigger value="history" className="rounded-full px-6 py-2 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                            <Clock className="w-4 h-4" />
                            ประวัติการรับ
                        </TabsTrigger>
                    </TabsList>

                    <div className="text-sm text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        เข้าเกมพิมพ์ <span className="font-mono font-bold text-primary">/claim</span> เพื่อรับของ
                    </div>
                </div>

                <TabsContent value="pending" className="mt-0 focus-visible:ring-0">
                    {loading ? (
                        <div className="flex items-center justify-center h-64 text-muted-foreground bg-muted/10 rounded-[2.5rem]">
                            <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                กำลังโหลด...
                            </div>
                        </div>
                    ) : pendingItems.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar p-2">
                            {pendingItems.map((item) => (
                                <div key={item.id} className="bg-background rounded-3xl p-4 border border-border/50 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center gap-3 group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-[2rem] -mr-4 -mt-4 transition-transform group-hover:scale-110" />

                                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 text-primary relative z-10 mt-2">
                                        <Package className="w-7 h-7" />
                                    </div>
                                    <div className="relative z-10 min-w-0 w-full">
                                        <h4 className="font-bold text-foreground truncate text-sm" title={item.item_name}>{item.item_name}</h4>
                                        <div className="flex items-center justify-center gap-2 mt-2">
                                            <Badge variant="outline" className="text-[10px] h-5 bg-background/50 border-primary/20 text-primary">
                                                x{item.amount}
                                            </Badge>
                                        </div>
                                        <div className="mt-2 text-[10px] text-muted-foreground flex items-center justify-center gap-1">
                                            <Clock className="w-3 h-3" /> รอรับ
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground bg-muted/10 rounded-[2.5rem] border-2 border-dashed border-muted/50">
                            <Package className="w-12 h-12 mb-4 opacity-20" />
                            <p>ไม่มีของขวัญที่รอรับ</p>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="history" className="mt-0 focus-visible:ring-0">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar p-2">
                        {claimedItems.length > 0 ? (
                            claimedItems.map((item) => (
                                <div key={item.id} className="bg-muted/20 rounded-3xl p-4 border border-transparent hover:border-border/50 transition-all flex flex-col items-center text-center gap-3 shrink-0">
                                    <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center shrink-0 text-green-500 mt-2">
                                        <CheckCircle2 className="w-6 h-6" />
                                    </div>
                                    <div className="min-w-0 w-full">
                                        <h4 className="font-bold text-foreground truncate text-sm" title={item.item_name}>{item.item_name}</h4>
                                        <div className="flex items-center justify-center gap-2 mt-2">
                                            <Badge variant="secondary" className="text-[10px] h-5 px-1.5">x{item.amount}</Badge>
                                        </div>
                                        <div className="mt-2 text-[10px] text-muted-foreground">
                                            {new Date(item.claimed_at).toLocaleDateString('th-TH')}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full flex flex-col items-center justify-center h-64 text-center text-muted-foreground bg-muted/10 rounded-[2.5rem] border-2 border-dashed border-muted/50">
                                <Clock className="w-12 h-12 mb-4 opacity-20" />
                                <p>ยังไม่มีประวัติการรับของ</p>
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
