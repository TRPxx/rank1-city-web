'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Save, MoveUp, MoveDown, Gift, Settings, Trophy } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import Image from 'next/image';

export default function RewardsEditor({ config, setConfig, onSave }) {
    const rewards = config?.rewards?.global || [];
    const [selectedIndex, setSelectedIndex] = useState(-1); // -1 = Settings, 0+ = Rewards

    const updateRewards = (newRewards) => {
        setConfig({
            ...config,
            rewards: {
                ...config.rewards,
                global: newRewards
            }
        });
    };

    const addReward = () => {
        const newReward = {
            count: 0,
            name: 'รางวัลใหม่',
            image: ''
        };
        const newRewards = [...rewards, newReward];
        updateRewards(newRewards);
        setSelectedIndex(newRewards.length - 1);
    };

    const removeReward = (index) => {
        const newRewards = rewards.filter((_, i) => i !== index);
        updateRewards(newRewards);
        if (selectedIndex >= newRewards.length) {
            setSelectedIndex(Math.max(-1, newRewards.length - 1));
        }
    };

    const updateReward = (index, field, value) => {
        const newRewards = [...rewards];
        newRewards[index] = { ...newRewards[index], [field]: value };
        if (field === 'count') {
            newRewards[index][field] = parseInt(value) || 0;
        }
        updateRewards(newRewards);
    };

    const moveReward = (index, direction) => {
        if (direction === 'up' && index > 0) {
            const newRewards = [...rewards];
            [newRewards[index], newRewards[index - 1]] = [newRewards[index - 1], newRewards[index]];
            updateRewards(newRewards);
            setSelectedIndex(index - 1);
        } else if (direction === 'down' && index < rewards.length - 1) {
            const newRewards = [...rewards];
            [newRewards[index], newRewards[index + 1]] = [newRewards[index + 1], newRewards[index]];
            updateRewards(newRewards);
            setSelectedIndex(index + 1);
        }
    };

    const selectedReward = selectedIndex >= 0 ? rewards[selectedIndex] : null;

    return (
        <Card className="h-full flex flex-col border-0 shadow-none rounded-none">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>ตั้งค่ากิจกรรม</CardTitle>
                        <CardDescription>จัดการระบบเกมและของรางวัล</CardDescription>
                    </div>
                    <Button onClick={() => onSave('preregister', config)} size="sm">
                        <Save className="w-4 h-4 mr-2" />
                        บันทึกการเปลี่ยนแปลง
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="flex-1 flex gap-6 overflow-hidden pt-0">
                {/* Left Sidebar */}
                <div className="w-72 shrink-0 flex flex-col border-r pr-6">
                    <div className="space-y-2 mb-4">
                        <Button
                            variant={selectedIndex === -1 ? "secondary" : "ghost"}
                            className="w-full justify-start font-normal"
                            onClick={() => setSelectedIndex(-1)}
                        >
                            <Settings className="mr-2 h-4 w-4" />
                            ตั้งค่าทั่วไป
                        </Button>
                    </div>

                    <div className="flex items-center justify-between mb-2 px-2">
                        <span className="text-sm font-medium text-muted-foreground">รายการรางวัล</span>
                        <Button onClick={addReward} variant="ghost" size="icon" className="h-6 w-6">
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    <ScrollArea className="flex-1">
                        <div className="space-y-2">
                            {rewards.map((item, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div className="flex flex-col gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={() => moveReward(index, 'up')}
                                            disabled={index === 0}
                                        >
                                            <MoveUp className="w-3 h-3" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={() => moveReward(index, 'down')}
                                            disabled={index === rewards.length - 1}
                                        >
                                            <MoveDown className="w-3 h-3" />
                                        </Button>
                                    </div>
                                    <Button
                                        variant={selectedIndex === index ? "secondary" : "ghost"}
                                        className="flex-1 justify-start font-normal h-auto py-3"
                                        onClick={() => setSelectedIndex(index)}
                                    >
                                        <div className="flex flex-col items-start gap-1 overflow-hidden">
                                            <div className="flex items-center gap-2 w-full">
                                                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px] shrink-0">
                                                    #{index + 1}
                                                </div>
                                                <span className="font-semibold truncate text-xs">{item.count.toLocaleString()}</span>
                                            </div>
                                            <span className="truncate w-full text-left text-xs text-muted-foreground">{item.name || "ไม่มีชื่อ"}</span>
                                        </div>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                {/* Right Content */}
                <div className="flex-1 overflow-y-auto pr-2">
                    {selectedIndex === -1 ? (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Settings className="w-5 h-5" />
                                การตั้งค่าทั่วไป
                            </h3>
                            <div className="grid gap-6">
                                <div className="flex items-center justify-between space-x-2 border p-4 rounded-lg">
                                    <Label htmlFor="gang-mode" className="flex flex-col space-y-1">
                                        <span>เปิดระบบแก๊ง</span>
                                        <span className="font-normal text-xs text-muted-foreground">อนุญาตให้ผู้ใช้สร้างและเข้าร่วมแก๊ง</span>
                                    </Label>
                                    <Switch
                                        id="gang-mode"
                                        checked={config?.features?.enableGang}
                                        onCheckedChange={(checked) => setConfig({
                                            ...config,
                                            features: { ...config.features, enableGang: checked }
                                        })}
                                    />
                                </div>
                                <div className="flex items-center justify-between space-x-2 border p-4 rounded-lg">
                                    <Label htmlFor="lucky-draw" className="flex flex-col space-y-1">
                                        <span>เปิดระบบวงล้อเสี่ยงโชค</span>
                                        <span className="font-normal text-xs text-muted-foreground">อนุญาตให้ผู้ใช้หมุนวงล้อเพื่อรับรางวัล</span>
                                    </Label>
                                    <Switch
                                        id="lucky-draw"
                                        checked={config?.features?.enableLuckyDraw}
                                        onCheckedChange={(checked) => setConfig({
                                            ...config,
                                            features: { ...config.features, enableLuckyDraw: checked }
                                        })}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : selectedReward ? (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Gift className="w-5 h-5" />
                                    แก้ไขรางวัล #{selectedIndex + 1}
                                </h3>
                                <Button variant="destructive" size="sm" onClick={() => removeReward(selectedIndex)}>
                                    <Trash2 className="mr-2 h-4 w-4" /> ลบรางวัล
                                </Button>
                            </div>

                            <div className="grid gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>จำนวนเป้าหมาย (Users)</Label>
                                        <Input
                                            type="number"
                                            value={selectedReward.count}
                                            onChange={(e) => updateReward(selectedIndex, 'count', e.target.value)}
                                            placeholder="e.g. 1000"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>ชื่อรางวัล</Label>
                                        <Input
                                            value={selectedReward.name}
                                            onChange={(e) => updateReward(selectedIndex, 'name', e.target.value)}
                                            placeholder="ชื่อรางวัล"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>URL รูปภาพ</Label>
                                    <div className="flex gap-4">
                                        <Input
                                            value={selectedReward.image || ''}
                                            onChange={(e) => updateReward(selectedIndex, 'image', e.target.value)}
                                            placeholder="/images/rewards/..."
                                            className="flex-1"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>ตัวอย่างรูปภาพ</Label>
                                    <div className="relative h-48 w-full rounded-md border bg-muted flex items-center justify-center overflow-hidden">
                                        {selectedReward.image ? (
                                            <Image
                                                src={selectedReward.image}
                                                alt="Preview"
                                                fill
                                                className="object-contain p-2"
                                                onError={(e) => { e.target.style.display = 'none'; }}
                                            />
                                        ) : (
                                            <Gift className="w-12 h-12 text-muted-foreground opacity-20" />
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t">
                                    <div className="flex items-center justify-between">
                                        <Label>รายการไอเทมในรางวัลนี้</Label>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                const currentItems = selectedReward.items || [];
                                                updateReward(selectedIndex, 'items', [...currentItems, { name: 'New Item', amount: 1, image: '' }]);
                                            }}
                                        >
                                            <Plus className="w-3 h-3 mr-1" /> เพิ่มไอเทม
                                        </Button>
                                    </div>

                                    <div className="space-y-3">
                                        {(selectedReward.items || []).map((item, itemIndex) => (
                                            <div key={itemIndex} className="flex gap-2 items-start p-3 bg-muted/30 rounded-lg border">
                                                <div className="grid gap-2 flex-1">
                                                    <div className="flex gap-2">
                                                        <Input
                                                            placeholder="ชื่อไอเทม (Display Name)"
                                                            value={item.name}
                                                            onChange={(e) => {
                                                                const newItems = [...(selectedReward.items || [])];
                                                                newItems[itemIndex] = { ...item, name: e.target.value };
                                                                updateReward(selectedIndex, 'items', newItems);
                                                            }}
                                                            className="h-8 text-sm flex-1"
                                                        />
                                                        <Input
                                                            placeholder="Item ID (e.g. money)"
                                                            value={item.id || ''}
                                                            onChange={(e) => {
                                                                const newItems = [...(selectedReward.items || [])];
                                                                newItems[itemIndex] = { ...item, id: e.target.value };
                                                                updateReward(selectedIndex, 'items', newItems);
                                                            }}
                                                            className="h-8 text-sm w-32"
                                                        />
                                                        <Input
                                                            type="number"
                                                            placeholder="จำนวน"
                                                            value={item.amount}
                                                            onChange={(e) => {
                                                                const newItems = [...(selectedReward.items || [])];
                                                                newItems[itemIndex] = { ...item, amount: parseInt(e.target.value) || 0 };
                                                                updateReward(selectedIndex, 'items', newItems);
                                                            }}
                                                            className="w-20 h-8 text-sm"
                                                        />
                                                    </div>
                                                    <Input
                                                        placeholder="URL รูปภาพไอเทม (Optional)"
                                                        value={item.image || ''}
                                                        onChange={(e) => {
                                                            const newItems = [...(selectedReward.items || [])];
                                                            newItems[itemIndex] = { ...item, image: e.target.value };
                                                            updateReward(selectedIndex, 'items', newItems);
                                                        }}
                                                        className="h-8 text-sm"
                                                    />
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                    onClick={() => {
                                                        const newItems = (selectedReward.items || []).filter((_, i) => i !== itemIndex);
                                                        updateReward(selectedIndex, 'items', newItems);
                                                    }}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                        {(!selectedReward.items || selectedReward.items.length === 0) && (
                                            <div className="text-center py-4 text-sm text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                                                ยังไม่มีไอเทมในรางวัลนี้
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground">
                            เลือกรายการเพื่อแก้ไข
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
