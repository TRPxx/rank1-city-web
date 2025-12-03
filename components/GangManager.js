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
import GangDesignShowcase from './GangDesignShowcase';

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
    // Using Design Showcase to let user choose
    return (
        <GangDesignShowcase
            joinCode={joinCode}
            setJoinCode={setJoinCode}
            createName={createName}
            setCreateName={setCreateName}
            handleAction={handleAction}
            isActionLoading={isActionLoading}
            error={error}
        />
    );
}
