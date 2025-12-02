'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Save, AlertCircle, Ticket } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const RARITY_COLORS = {
    COMMON: 'bg-slate-500',
    RARE: 'bg-blue-500',
    EPIC: 'bg-purple-500',
    LEGENDARY: 'bg-yellow-500'
};

export default function LuckyDrawEditor({ initialData, onSave }) {
    const [config, setConfig] = useState(initialData || { costPerSpin: 1, items: [] });
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        if (initialData) {
            setConfig(initialData);
        }
    }, [initialData]);

    const items = config.items || [];
    const totalChance = items.reduce((sum, item) => sum + Number(item.chance || 0), 0);

    const updateConfig = (newConfig) => {
        setConfig(newConfig);
    };

    const addItem = () => {
        const newItem = {
            id: `item_${Date.now()}`,
            name: 'New Reward',
            chance: 10,
            rarity: 'COMMON',
            image: '/images/rewards/starter.png'
        };
        const newItems = [...items, newItem];
        updateConfig({ ...config, items: newItems });
        setSelectedIndex(newItems.length - 1);
    };

    const removeItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        updateConfig({ ...config, items: newItems });
        if (selectedIndex >= newItems.length) {
            setSelectedIndex(Math.max(0, newItems.length - 1));
        }
    };

    const updateItem = (index, field, value) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        updateConfig({ ...config, items: newItems });
    };

    const selectedItem = items[selectedIndex];

    return (
        <div className="h-full flex flex-col">
            <div className="p-6 border-b flex items-center justify-between shrink-0 bg-card">
                <div>
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                        <Ticket className="h-6 w-6 text-primary" />
                        Lucky Draw Settings
                    </h3>
                    <p className="text-muted-foreground">จัดการของรางวัลและอัตราการออก</p>
                </div>
                <Button onClick={() => onSave(config)} size="sm" className="rounded-full px-6">
                    <Save className="w-4 h-4 mr-2" />
                    บันทึกการตั้งค่า
                </Button>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar: Item List */}
                <div className="w-80 shrink-0 flex flex-col border-r bg-muted/10">
                    <div className="p-4 space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>โอกาสรวม</span>
                                <span className={totalChance > 100 ? "text-red-500 font-bold" : "text-green-500 font-bold"}>
                                    {totalChance.toFixed(1)}%
                                </span>
                            </div>
                            <Progress value={totalChance} max={100} className={totalChance > 100 ? "bg-red-100 [&>div]:bg-red-500" : ""} />
                            {totalChance > 100 && (
                                <p className="text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" /> โอกาสรวมเกิน 100%
                                </p>
                            )}
                        </div>

                        <div className="space-y-2 pt-2 border-t">
                            <Label>ราคาต่อการหมุน (Points)</Label>
                            <Input
                                type="number"
                                value={config.costPerSpin}
                                onChange={(e) => updateConfig({ ...config, costPerSpin: Number(e.target.value) })}
                                className="bg-background"
                            />
                        </div>

                        <Button onClick={addItem} className="w-full" variant="outline">
                            <Plus className="mr-2 h-4 w-4" /> เพิ่มของรางวัล
                        </Button>
                    </div>

                    <ScrollArea className="flex-1 px-4 pb-4">
                        <div className="space-y-2">
                            {items.map((item, index) => (
                                <div
                                    key={index}
                                    onClick={() => setSelectedIndex(index)}
                                    className={`p-3 rounded-lg cursor-pointer border transition-all flex items-center gap-3 ${selectedIndex === index
                                        ? "bg-background border-primary shadow-sm"
                                        : "hover:bg-muted/50 border-transparent"
                                        }`}
                                >
                                    <div className={`w-2 h-10 rounded-full shrink-0 ${RARITY_COLORS[item.rarity] || 'bg-slate-500'}`} />
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium truncate">{item.name}</div>
                                        <div className="text-xs text-muted-foreground flex justify-between">
                                            <span>{item.chance}%</span>
                                            <span className="uppercase">{item.rarity}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                {/* Right Content: Item Editor */}
                <div className="flex-1 overflow-y-auto p-8 bg-muted/5">
                    {selectedItem ? (
                        <Card className="max-w-2xl mx-auto border-none shadow-lg">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>แก้ไขของรางวัล #{selectedIndex + 1}</CardTitle>
                                    <Button variant="destructive" size="sm" onClick={() => removeItem(selectedIndex)}>
                                        <Trash2 className="mr-2 h-4 w-4" /> ลบ
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>ชื่อของรางวัล</Label>
                                        <Input
                                            value={selectedItem.name}
                                            onChange={(e) => updateItem(selectedIndex, 'name', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Item ID (รหัสไอเทมในเกม / Spawn Name)</Label>
                                        <Input
                                            value={selectedItem.id}
                                            onChange={(e) => updateItem(selectedIndex, 'id', e.target.value)}
                                            placeholder="เช่น weapon_pistol, bread, water"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>โอกาสออก (%)</Label>
                                        <Input
                                            type="number"
                                            step="0.1"
                                            value={selectedItem.chance}
                                            onChange={(e) => updateItem(selectedIndex, 'chance', Number(e.target.value))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>ระดับความหายาก</Label>
                                        <Select
                                            value={selectedItem.rarity}
                                            onValueChange={(value) => updateItem(selectedIndex, 'rarity', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="COMMON">Common (ทั่วไป)</SelectItem>
                                                <SelectItem value="RARE">Rare (หายาก)</SelectItem>
                                                <SelectItem value="EPIC">Epic (ตำนาน)</SelectItem>
                                                <SelectItem value="LEGENDARY">Legendary (เทพเจ้า)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>URL รูปภาพ</Label>
                                    <Input
                                        value={selectedItem.image}
                                        onChange={(e) => updateItem(selectedIndex, 'image', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>ตัวอย่างการแสดงผล</Label>
                                    <div className="flex justify-center p-6 bg-muted/30 rounded-xl border border-dashed">
                                        <div className={`relative w-32 h-32 rounded-xl border-2 flex items-center justify-center bg-background shadow-sm ${selectedItem.rarity === 'COMMON' ? 'border-slate-300' :
                                            selectedItem.rarity === 'RARE' ? 'border-blue-400 shadow-blue-200' :
                                                selectedItem.rarity === 'EPIC' ? 'border-purple-400 shadow-purple-200' :
                                                    'border-yellow-400 shadow-yellow-200'
                                            }`}>
                                            <div className="relative w-20 h-20">
                                                <Image
                                                    src={selectedItem.image}
                                                    alt="Preview"
                                                    fill
                                                    className="object-contain"
                                                    onError={(e) => { e.target.style.display = 'none'; }}
                                                />
                                            </div>
                                            <Badge className={`absolute -top-3 left-1/2 -translate-x-1/2 ${RARITY_COLORS[selectedItem.rarity]}`}>
                                                {selectedItem.rarity}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                            <Ticket className="h-12 w-12 mb-4 opacity-20" />
                            <p>เลือกของรางวัลเพื่อแก้ไข หรือกดเพิ่มรางวัลใหม่</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
