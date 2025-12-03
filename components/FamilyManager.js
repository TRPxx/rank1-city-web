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

export default function FamilyManager() {
    const [familyData, setFamilyData] = useState(null);
    const [members, setMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isMembersLoading, setIsMembersLoading] = useState(false);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [joinCode, setJoinCode] = useState('');
    const [createName, setCreateName] = useState('');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const fetchFamily = async () => {
        try {
            const res = await fetch('/api/family');
            const data = await res.json();
            if (data.hasFamily) {
                setFamilyData(data.Family);
            } else {
                setFamilyData(null);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMembers = async (familyCode) => {
        setIsMembersLoading(true);
        try {
            const res = await fetch(`/api/family/members?familyCode=${familyCode}`);
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
        fetchFamily();
    }, []);

    useEffect(() => {
        if (familyData?.Family_code) {
            fetchMembers(familyData.Family_code);
        }
    }, [familyData]);

    const handleAction = async (action) => {
        setError('');
        setIsActionLoading(true);
        try {
            const res = await fetch('/api/family', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action,
                    name: createName,
                    familyCode: joinCode
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            fetchFamily(); // Refresh data
            setCreateName('');
            setJoinCode('');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsActionLoading(false);
        }
    };

    const copyFamilyCode = () => {
        if (familyData?.Family_code) {
            navigator.clipboard.writeText(familyData.Family_code);
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

    // View: Already in Family
    if (familyData) {
        return (
            <div className="h-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
                    {/* Left Column: Family Info */}
                    <div className="lg:col-span-4 flex flex-col gap-6 h-full">
                        <Card className="h-full flex flex-col border-border/50 shadow-sm">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                            {familyData.name}
                                            <Badge variant="secondary" className="text-xs font-normal">Level 1</Badge>
                                        </CardTitle>
                                        <CardDescription>
                                            ข้อมูลและสถานะของครอบครัว
                                        </CardDescription>
                                    </div>
                                    <div className="h-12 w-12 rounded-full bg-rose-500/10 flex items-center justify-center">
                                        <Users className="w-6 h-6 text-rose-500" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6 flex-1">
                                <div className="p-4 rounded-lg bg-muted/50 border border-border/50 space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">รหัสครอบครัว</span>
                                        <div className="flex items-center gap-2">
                                            <code className="bg-background px-2 py-1 rounded border font-mono text-xs font-bold">
                                                {familyData.Family_code}
                                            </code>
                                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyFamilyCode}>
                                                {copied ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                                            </Button>
                                        </div>
                                    </div>
                                    <Separator />
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">สมาชิก</span>
                                        <span className="font-medium">{familyData.member_count} / {familyData.max_members}</span>
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
                                        <CardDescription>สมาชิกทั้งหมดในครอบครัวของคุณ</CardDescription>
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
                                                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs ${idx < 3 ? 'bg-rose-500/10 text-rose-600 font-bold' : 'text-muted-foreground'
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
                                                                            <Badge variant="secondary" className="h-4 px-1 text-[10px] bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 border-rose-500/20">
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
        <div className="h-full flex items-center justify-center p-4">
            <Card className="w-full max-w-md border-border/50 shadow-lg">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto w-12 h-12 bg-rose-500/10 rounded-full flex items-center justify-center mb-4">
                        <Users className="w-6 h-6 text-rose-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold">ระบบครอบครัว</CardTitle>
                    <CardDescription>
                        เข้าร่วมหรือสร้างครอบครัวเพื่อเริ่มต้นการผจญภัย
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <Tabs defaultValue="join" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger value="join">เข้าร่วม</TabsTrigger>
                            <TabsTrigger value="create">สร้างใหม่</TabsTrigger>
                        </TabsList>

                        <TabsContent value="join" className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    รหัสครอบครัว
                                </label>
                                <Input
                                    placeholder="FAM-XXXXXX"
                                    value={joinCode}
                                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                    className="font-mono uppercase text-center tracking-widest"
                                />
                            </div>
                            <Button
                                className="w-full bg-rose-600 hover:bg-rose-700 text-white"
                                onClick={() => handleAction('join')}
                                disabled={!joinCode || isActionLoading}
                            >
                                {isActionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
                                เข้าร่วมครอบครัว
                            </Button>
                        </TabsContent>

                        <TabsContent value="create" className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    ชื่อครอบครัว
                                </label>
                                <Input
                                    placeholder="ตั้งชื่อครอบครัวของคุณ"
                                    value={createName}
                                    onChange={(e) => setCreateName(e.target.value)}
                                    maxLength={20}
                                />
                                <p className="text-[10px] text-muted-foreground text-right">
                                    {createName.length}/20
                                </p>
                            </div>
                            <Button
                                className="w-full bg-rose-600 hover:bg-rose-700 text-white"
                                onClick={() => handleAction('create')}
                                disabled={!createName || isActionLoading}
                            >
                                {isActionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                                สร้างครอบครัว
                            </Button>
                        </TabsContent>
                    </Tabs>

                    {error && (
                        <div className="mt-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
