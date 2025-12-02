'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Save, MoveUp, MoveDown, MapPin } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';

export default function RoadmapEditor({ siteConfig, setSiteConfig, onSave }) {
    const roadmap = siteConfig?.roadmap || [];
    const [selectedIndex, setSelectedIndex] = useState(0);

    const updateRoadmap = (newRoadmap) => {
        setSiteConfig({ ...siteConfig, roadmap: newRoadmap });
    };

    const addMilestone = () => {
        const newMilestone = {
            id: Date.now(),
            phase: `PHASE ${roadmap.length + 1}`,
            title: 'เป้าหมายใหม่',
            date: 'TBA',
            desc: 'รายละเอียด...',
            status: 'upcoming',
            image: ''
        };
        const newRoadmap = [...roadmap, newMilestone];
        updateRoadmap(newRoadmap);
        setSelectedIndex(newRoadmap.length - 1);
    };

    const removeMilestone = (index) => {
        const newRoadmap = roadmap.filter((_, i) => i !== index);
        updateRoadmap(newRoadmap);
        if (selectedIndex >= newRoadmap.length) {
            setSelectedIndex(Math.max(0, newRoadmap.length - 1));
        }
    };

    const updateMilestone = (index, field, value) => {
        const newRoadmap = [...roadmap];
        newRoadmap[index] = { ...newRoadmap[index], [field]: value };
        updateRoadmap(newRoadmap);
    };

    const moveMilestone = (index, direction) => {
        if (direction === 'up' && index > 0) {
            const newRoadmap = [...roadmap];
            [newRoadmap[index], newRoadmap[index - 1]] = [newRoadmap[index - 1], newRoadmap[index]];
            updateRoadmap(newRoadmap);
            setSelectedIndex(index - 1);
        } else if (direction === 'down' && index < roadmap.length - 1) {
            const newRoadmap = [...roadmap];
            [newRoadmap[index], newRoadmap[index + 1]] = [newRoadmap[index + 1], newRoadmap[index]];
            updateRoadmap(newRoadmap);
            setSelectedIndex(index + 1);
        }
    };

    const selectedMilestone = roadmap[selectedIndex];

    return (
        <Card className="h-full flex flex-col border-0 shadow-none rounded-none">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>ไทม์ไลน์แผนงาน</CardTitle>
                        <CardDescription>จัดการเป้าหมายแผนงานของเซิร์ฟเวอร์</CardDescription>
                    </div>
                    <Button onClick={() => onSave('site', siteConfig)} size="sm">
                        <Save className="w-4 h-4 mr-2" />
                        บันทึกการเปลี่ยนแปลง
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="flex-1 flex gap-6 overflow-hidden pt-0">
                {/* Left Sidebar: List of Milestones */}
                <div className="w-72 shrink-0 flex flex-col border-r pr-6">
                    <Button onClick={addMilestone} className="w-full mb-4" variant="outline">
                        <Plus className="mr-2 h-4 w-4" /> เพิ่มเป้าหมาย
                    </Button>
                    <ScrollArea className="flex-1">
                        <div className="space-y-2">
                            {roadmap.map((item, index) => (
                                <div key={item.id || index} className="flex items-center gap-2">
                                    <div className="flex flex-col gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={() => moveMilestone(index, 'up')}
                                            disabled={index === 0}
                                        >
                                            <MoveUp className="w-3 h-3" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={() => moveMilestone(index, 'down')}
                                            disabled={index === roadmap.length - 1}
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
                                                <div className={`w-2 h-2 rounded-full shrink-0 ${item.status === 'completed' ? 'bg-green-500' :
                                                    item.status === 'current' ? 'bg-blue-500' : 'bg-zinc-500'
                                                    }`} />
                                                <span className="font-semibold truncate text-xs uppercase text-muted-foreground">{item.phase}</span>
                                            </div>
                                            <span className="truncate w-full text-left">{item.title || "ไม่มีชื่อ"}</span>
                                        </div>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                {/* Right Content: Editor */}
                <div className="flex-1 overflow-y-auto pr-2">
                    {selectedMilestone ? (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <MapPin className="w-5 h-5" />
                                    แก้ไขเป้าหมาย #{selectedIndex + 1}
                                </h3>
                                <Button variant="destructive" size="sm" onClick={() => removeMilestone(selectedIndex)}>
                                    <Trash2 className="mr-2 h-4 w-4" /> ลบเป้าหมาย
                                </Button>
                            </div>

                            <div className="grid gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>ชื่อเฟส</Label>
                                        <Input
                                            value={selectedMilestone.phase}
                                            onChange={(e) => updateMilestone(selectedIndex, 'phase', e.target.value)}
                                            placeholder="e.g. PHASE 1"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>วัน / เวลา</Label>
                                        <Input
                                            value={selectedMilestone.date}
                                            onChange={(e) => updateMilestone(selectedIndex, 'date', e.target.value)}
                                            placeholder="e.g. Q1 2024"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>หัวข้อ</Label>
                                    <Input
                                        value={selectedMilestone.title}
                                        onChange={(e) => updateMilestone(selectedIndex, 'title', e.target.value)}
                                        placeholder="ชื่อเป้าหมาย"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>คำอธิบาย</Label>
                                    <Textarea
                                        value={selectedMilestone.desc}
                                        onChange={(e) => updateMilestone(selectedIndex, 'desc', e.target.value)}
                                        placeholder="รายละเอียดของเป้าหมายนี้..."
                                        className="min-h-[100px]"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>สถานะ</Label>
                                        <Select
                                            value={selectedMilestone.status}
                                            onValueChange={(value) => updateMilestone(selectedIndex, 'status', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="upcoming">กำลังจะมาถึง</SelectItem>
                                                <SelectItem value="current">กำลังดำเนินการ (ปัจจุบัน)</SelectItem>
                                                <SelectItem value="completed">เสร็จสิ้น</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>URL รูปภาพ (ไม่บังคับ)</Label>
                                        <Input
                                            value={selectedMilestone.image || ''}
                                            onChange={(e) => updateMilestone(selectedIndex, 'image', e.target.value)}
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>

                                {selectedMilestone.image && (
                                    <div className="space-y-2">
                                        <Label>ตัวอย่างรูปภาพ</Label>
                                        <div className="relative h-48 w-full rounded-md overflow-hidden border bg-muted/50">
                                            <Image
                                                src={selectedMilestone.image}
                                                alt="Preview"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground">
                            เลือกเป้าหมายเพื่อแก้ไข หรือกดเพิ่มเป้าหมายใหม่
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
