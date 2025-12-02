'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Users, Shield, Copy, LogOut, Crown, Plus, ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GangManager() {
    const [gangData, setGangData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [joinCode, setJoinCode] = useState('');
    const [createName, setCreateName] = useState('');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const fetchGang = async () => {
        try {
            const res = await fetch('/api/gang');
            const data = await res.json();
            if (data.hasGang) {
                setGangData(data.gang);
            } else {
                setGangData(null);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGang();
    }, []);

    const handleAction = async (action) => {
        setError('');
        setIsActionLoading(true);
        try {
            const res = await fetch('/api/gang', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action,
                    name: createName,
                    gangCode: joinCode
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            fetchGang(); // Refresh data
            setCreateName('');
            setJoinCode('');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsActionLoading(false);
        }
    };

    const copyGangCode = () => {
        if (gangData?.gang_code) {
            navigator.clipboard.writeText(gangData.gang_code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    // View: Already in Gang
    if (gangData) {
        return (
            <div className="max-w-6xl mx-auto h-full">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">

                    {/* Left Column: Gang Info (Compact) */}
                    <div className="lg:col-span-1 overflow-hidden flex flex-col rounded-3xl bg-muted/10">
                        <div className="h-24 bg-gradient-to-r from-slate-900 to-slate-800 relative shrink-0">
                            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                                <div className="w-20 h-20 rounded-2xl bg-background border-4 border-background shadow-xl flex items-center justify-center text-3xl">
                                    👑
                                </div>
                            </div>
                        </div>
                        <div className="pt-12 px-6 pb-6 flex-1 flex flex-col items-center text-center">
                            <h2 className="text-2xl font-bold tracking-tight mb-1">{gangData.name}</h2>
                            <div className="flex items-center gap-2 text-muted-foreground mb-4">
                                <Shield className="w-3 h-3" />
                                <span className="text-xs">เลเวล 1</span>
                                <Badge variant="secondary" className="text-[10px] px-1.5 h-5 bg-background/50">ทางการ</Badge>
                            </div>

                            <div className="w-full space-y-4 mt-2">
                                {/* Gang Code */}
                                <div className="bg-background/50 rounded-2xl p-4">
                                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">รหัสแก๊ง</div>
                                    <div className="flex items-center justify-center gap-2">
                                        <code className="text-lg font-mono font-bold text-primary">{gangData.gang_code}</code>
                                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={copyGangCode}>
                                            {copied ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                                        </Button>
                                    </div>
                                </div>

                                {/* Members Count */}
                                <div className="bg-background/50 rounded-2xl p-4">
                                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">สมาชิก</div>
                                    <div className="text-2xl font-bold flex items-baseline justify-center gap-1">
                                        {gangData.member_count}
                                        <span className="text-sm font-normal text-muted-foreground">/ {gangData.max_members}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Member List (Expanded) */}
                    <div className="lg:col-span-2 flex flex-col rounded-3xl bg-muted/10 overflow-hidden">
                        <div className="p-6 border-b border-border/10 bg-muted/5">
                            <div className="flex items-center justify-between">
                                <h3 className="flex items-center gap-2 text-base font-bold">
                                    <Users className="w-4 h-4 text-primary" /> รายชื่อสมาชิก
                                </h3>
                                <div className="text-xs text-muted-foreground">
                                    จัดการสมาชิกในแก๊งของคุณ
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 p-0">
                            <div className="flex flex-col items-center justify-center h-[300px] text-center">
                                <div className="w-12 h-12 rounded-2xl bg-muted/30 flex items-center justify-center mb-4">
                                    <Users className="w-6 h-6 text-muted-foreground" />
                                </div>
                                <h3 className="text-sm font-medium">รายชื่อสมาชิกเร็วๆ นี้</h3>
                                <p className="text-xs text-muted-foreground max-w-xs mt-1 px-4">
                                    เรากำลังพัฒนาระบบแสดงรายชื่อสมาชิก โปรดติดตามตอนต่อไป!
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }

    // View: Create or Join
    return (
        <div className="max-w-2xl mx-auto py-8">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold tracking-tight mb-2">ระบบแก๊ง</h2>
                <p className="text-muted-foreground">สร้างตำนานของคุณเองหรือเข้าร่วมกับผู้อื่น</p>
            </div>

            <Tabs defaultValue="join" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="join">เข้าร่วมแก๊ง</TabsTrigger>
                    <TabsTrigger value="create">สร้างแก๊ง</TabsTrigger>
                </TabsList>

                <TabsContent value="join">
                    <div className="rounded-3xl bg-muted/10 p-8">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold mb-1">เข้าร่วมแก๊งที่มีอยู่</h3>
                            <p className="text-muted-foreground text-sm">
                                กรอกรหัสแก๊งที่ได้รับจากหัวหน้าแก๊ง
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">รหัสแก๊ง</label>
                                <Input
                                    placeholder="เช่น G-123456"
                                    value={joinCode}
                                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                    className="text-lg font-mono uppercase placeholder:normal-case h-12 rounded-xl bg-background/50 border-transparent focus:bg-background"
                                />
                            </div>
                            {error && (
                                <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-xl">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}
                        </div>
                        <div className="mt-8">
                            <Button
                                className="w-full h-12 text-base shadow-lg shadow-primary/20 rounded-xl"
                                onClick={() => handleAction('join')}
                                disabled={!joinCode || isActionLoading}
                            >
                                {isActionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Users className="mr-2 h-4 w-4" />}
                                เข้าร่วมแก๊ง
                            </Button>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="create">
                    <div className="rounded-3xl bg-muted/10 p-8">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold mb-1">สร้างแก๊งใหม่</h3>
                            <p className="text-muted-foreground text-sm">
                                ก่อตั้งแก๊งของคุณเองและรับสมัครสมาชิกเพื่อครองเมือง
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">ชื่อแก๊ง</label>
                                <Input
                                    placeholder="ระบุชื่อแก๊ง"
                                    value={createName}
                                    onChange={(e) => setCreateName(e.target.value)}
                                    maxLength={20}
                                    className="h-12 rounded-xl bg-background/50 border-transparent focus:bg-background"
                                />
                                <p className="text-xs text-muted-foreground text-right">
                                    {createName.length}/20 ตัวอักษร
                                </p>
                            </div>
                            {error && (
                                <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-xl">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}
                        </div>
                        <div className="mt-8">
                            <Button
                                className="w-full h-12 text-base shadow-lg shadow-primary/20 rounded-xl"
                                onClick={() => handleAction('create')}
                                disabled={!createName || isActionLoading}
                            >
                                {isActionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Crown className="mr-2 h-4 w-4" />}
                                สร้างแก๊ง
                            </Button>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
