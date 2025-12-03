'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Users, Shield, Copy, LogOut, Crown, Plus, ArrowRight, Loader2, CheckCircle2, AlertCircle, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GangManager() {
    const [gangData, setGangData] = useState(null);
    const [members, setMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isMembersLoading, setIsMembersLoading] = useState(false);
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

    const fetchMembers = async (gangCode) => {
        setIsMembersLoading(true);
        try {
            const res = await fetch(`/api/gang/members?gangCode=${gangCode}`);
            const data = await res.json();
            if (data.members) {
                setMembers(data.members);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsMembersLoading(false);
        }
    };

    useEffect(() => {
        fetchGang();
    }, []);

    useEffect(() => {
        if (gangData?.gang_code) {
            fetchMembers(gangData.gang_code);
        }
    }, [gangData]);

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
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    // View: Already in Gang
    if (gangData) {
        return (
            <div className="h-full p-1">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
                    {/* Left Column: Gang Info */}
                    <div className="lg:col-span-4 flex flex-col gap-6 h-full">
                        <Card className="h-full flex flex-col border-border/50 shadow-sm">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                            {gangData.name}
                                            <Badge variant="secondary" className="text-xs font-normal">Level 1</Badge>
                                        </CardTitle>
                                        <CardDescription>
                                            ข้อมูลและสถานะของแก๊ง
                                        </CardDescription>
                                    </div>
                                    <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                                        <Crown className="w-6 h-6 text-amber-500" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6 flex-1">
                                <div className="p-4 rounded-lg bg-muted/50 border border-border/50 space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">รหัสแก๊ง</span>
                                        <div className="flex items-center gap-2">
                                            <code className="bg-background px-2 py-1 rounded border font-mono text-xs font-bold">
                                                {gangData.gang_code}
                                            </code>
                                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyGangCode}>
                                                {copied ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                                            </Button>
                                        </div>
                                    </div>
                                    <Separator />
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">สมาชิก</span>
                                        <span className="font-medium">{gangData.member_count} / {gangData.max_members}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">สถานะ</span>
                                        <Badge variant="outline" className="text-green-500 border-green-500/20 bg-green-500/10">Active</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Member List */}
                    <div className="lg:col-span-8 h-full">
                        <Card className="h-full flex flex-col border-border/50 shadow-sm overflow-hidden">
                            <CardHeader className="pb-3 border-b">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg">รายชื่อสมาชิก</CardTitle>
                                        <CardDescription>สมาชิกทั้งหมดในแก๊งของคุณ</CardDescription>
                                    </div>
                                    <div className="relative w-64 hidden sm:block">
                                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input placeholder="ค้นหาสมาชิก..." className="pl-8 h-9" />
                                    </div>
                                </div>
                            </CardHeader>
                            <div className="flex-1 overflow-hidden">
                                <ScrollArea className="h-full">
                                    <Table>
                                        <TableHeader className="bg-muted/50 sticky top-0 z-10">
                                            <TableRow>
                                                <TableHead className="w-[80px]">ลำดับ</TableHead>
                                                <TableHead>ชื่อสมาชิก</TableHead>
                                                <TableHead>Discord ID</TableHead>
                                                <TableHead className="text-right">วันที่เข้าร่วม</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {isMembersLoading ? (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="h-24 text-center">
                                                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                            กำลังโหลดข้อมูล...
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ) : members.length > 0 ? (
                                                members.map((member, idx) => (
                                                    <TableRow key={member.discord_id}>
                                                        <TableCell className="font-medium">
                                                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs ${idx < 3 ? 'bg-amber-500/10 text-amber-600 font-bold' : 'text-muted-foreground'
                                                                }`}>
                                                                #{idx + 1}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-3">
                                                                <Avatar className="h-8 w-8 border">
                                                                    <AvatarImage src={member.avatar_url} />
                                                                    <AvatarFallback>
                                                                        {member.discord_name?.substring(0, 2).toUpperCase()}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div className="flex flex-col">
                                                                    <span className="font-medium text-sm flex items-center gap-2">
                                                                        {member.discord_name}
                                                                        {member.is_leader && (
                                                                            <Badge variant="secondary" className="h-4 px-1 text-[10px] bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/20">
                                                                                HEAD
                                                                            </Badge>
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-muted-foreground font-mono text-xs">
                                                            {member.discord_id}
                                                        </TableCell>
                                                        <TableCell className="text-right text-muted-foreground text-xs">
                                                            {new Date(member.joined_at).toLocaleDateString('th-TH', {
                                                                day: 'numeric',
                                                                month: 'short',
                                                                year: '2-digit'
                                                            })}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                                        ไม่พบสมาชิก
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </ScrollArea>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    // View: Create or Join
    return (
        <div className="h-full w-full p-4 lg:p-8 flex items-center justify-center">
            <div className="w-full h-full max-h-[800px] overflow-hidden rounded-[2rem] border border-border/50 bg-background shadow-2xl grid lg:grid-cols-2">

                {/* Left Side: Hero Section (Shadcn Style) */}
                <div className="relative hidden lg:flex flex-col justify-between bg-zinc-900 p-10 text-white dark:border-r">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1605218427306-635ba2439af2?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
                    <div className="relative z-20 flex items-center text-lg font-medium">
                        <Shield className="mr-2 h-6 w-6 text-amber-500" />
                        Rank1 City Gangs
                    </div>
                    <div className="relative z-20 mt-auto">
                        <blockquote className="space-y-2">
                            <p className="text-lg">
                                &ldquo;อำนาจไม่ใช่สิ่งที่ใครจะมอบให้ คุณต้องคว้ามันมาเอง สร้างตำนาน รวบรวมพรรคพวก และปกครองถนนแห่ง Rank1 City&rdquo;
                            </p>
                            <footer className="text-sm text-zinc-400">เดอะ ก็อดฟาเธอร์</footer>
                        </blockquote>
                    </div>
                </div>

                {/* Right Side: Form Section */}
                <div className="flex flex-col justify-center p-8 lg:p-12 bg-background/50 backdrop-blur-sm">
                    <div className="mx-auto w-full max-w-[400px] flex flex-col justify-center space-y-6">
                        <div className="flex flex-col space-y-2 text-center">
                            <h1 className="text-3xl font-bold tracking-tight">ลงทะเบียนล่วงหน้า สำหรับแก๊ง</h1>
                            <p className="text-sm text-muted-foreground">
                                กรอกรหัสเชิญเพื่อเข้าร่วม หรือก่อตั้งองค์กรใหม่
                            </p>
                        </div>

                        <Tabs defaultValue="join" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="join">เข้าร่วมแก๊ง</TabsTrigger>
                                <TabsTrigger value="create">สร้างแก๊ง</TabsTrigger>
                            </TabsList>

                            <TabsContent value="join" className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        รหัสเชิญ
                                    </label>
                                    <Input
                                        placeholder="G-XXXXXX"
                                        value={joinCode}
                                        onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                        className="font-mono uppercase text-center tracking-widest h-11"
                                    />
                                </div>
                                <Button
                                    className="w-full h-11 bg-amber-600 hover:bg-amber-700 text-white"
                                    onClick={() => handleAction('join')}
                                    disabled={!joinCode || isActionLoading}
                                >
                                    {isActionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Users className="mr-2 h-4 w-4" />}
                                    เข้าร่วมแก๊ง
                                </Button>
                            </TabsContent>

                            <TabsContent value="create" className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        ชื่อแก๊ง
                                    </label>
                                    <Input
                                        placeholder="ตั้งชื่อแก๊งของคุณ"
                                        value={createName}
                                        onChange={(e) => setCreateName(e.target.value)}
                                        maxLength={20}
                                        className="h-11"
                                    />
                                    <p className="text-[10px] text-muted-foreground text-right">
                                        {createName.length}/20
                                    </p>
                                </div>
                                <Button
                                    className="w-full h-11 bg-amber-600 hover:bg-amber-700 text-white"
                                    onClick={() => handleAction('create')}
                                    disabled={!createName || isActionLoading}
                                >
                                    {isActionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                                    สร้างแก๊ง
                                </Button>
                            </TabsContent>
                        </Tabs>

                        {error && (
                            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2 justify-center">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        <p className="px-8 text-center text-sm text-muted-foreground">
                            การสร้างแก๊งถือว่าคุณยอมรับ{" "}
                            <span className="underline underline-offset-4 hover:text-primary cursor-pointer">
                                กฎของเซิร์ฟเวอร์
                            </span>{" "}
                            และ{" "}
                            <span className="underline underline-offset-4 hover:text-primary cursor-pointer">
                                นโยบายแก๊ง
                            </span>
                            ของเรา
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
