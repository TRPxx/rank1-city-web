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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Users, Shield, Copy, LogOut, Crown, Plus, ArrowRight, Loader2, CheckCircle2, AlertCircle, Search, ImageIcon, Edit, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function FamilyManager({ userData }) {
    const [familyData, setFamilyData] = useState(null);
    const [members, setMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isMembersLoading, setIsMembersLoading] = useState(false);
    const [isActionLoading, setIsActionLoading] = useState(false);

    // Forms
    const [joinCode, setJoinCode] = useState('');
    const [createName, setCreateName] = useState('');
    const [createLogoUrl, setCreateLogoUrl] = useState('');
    const [editLogoUrl, setEditLogoUrl] = useState('');
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const fetchFamily = async () => {
        try {
            const res = await fetch('/api/family');
            const data = await res.json();
            if (data.hasFamily) {
                setFamilyData(data.family);
                setEditLogoUrl(data.family.logo_url || '');
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
        if (familyData?.family_code) {
            fetchMembers(familyData.family_code);
        }
    }, [familyData]);

    const handleAction = async (action) => {
        setError('');
        setIsActionLoading(true);
        try {
            const payload = {
                action,
                name: createName,
                familyCode: joinCode,
                logoUrl: action === 'create' ? createLogoUrl : undefined
            };

            const res = await fetch('/api/family', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            fetchFamily(); // Refresh data
            setCreateName('');
            setJoinCode('');
            setCreateLogoUrl('');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleUpdateLogo = async () => {
        setError('');
        setIsActionLoading(true);
        try {
            const res = await fetch('/api/family', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'update_logo',
                    logoUrl: editLogoUrl
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setIsEditDialogOpen(false);
            fetchFamily(); // Refresh data
        } catch (err) {
            setError(err.message);
        } finally {
            setIsActionLoading(false);
        }
    };

    const copyFamilyCode = () => {
        if (familyData?.family_code) {
            navigator.clipboard.writeText(familyData.family_code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const isLeader = familyData?.leader_discord_id === userData?.discordId;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
            </div>
        );
    }

    // View: Already in Family
    if (familyData) {
        return (
            <div className="h-full p-1 space-y-6">
                {/* Hero / Header Section */}
                <div className="relative overflow-hidden rounded-3xl bg-card border border-border/50 shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 via-transparent to-transparent opacity-50" />
                    <div className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 sm:gap-8">

                        {/* Logo */}
                        <div className="relative group shrink-0">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-muted border-2 border-border flex items-center justify-center overflow-hidden shadow-xl">
                                {familyData.logo_url ? (
                                    <Image
                                        src={familyData.logo_url}
                                        alt={familyData.name}
                                        width={128}
                                        height={128}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <Heart className="w-12 h-12 text-muted-foreground/50" />
                                )}
                            </div>
                            {isLeader && (
                                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button size="icon" variant="secondary" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>แก้ไขโลโก้ครอบครัว</DialogTitle>
                                            <DialogDescription>
                                                ใส่ URL ของรูปภาพที่ต้องการใช้เป็นโลโก้ (แนะนำขนาด 512x512)
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Logo URL</label>
                                                <Input
                                                    placeholder="https://example.com/logo.png"
                                                    value={editLogoUrl}
                                                    onChange={(e) => setEditLogoUrl(e.target.value)}
                                                />
                                            </div>
                                            {editLogoUrl && (
                                                <div className="flex justify-center p-4 bg-muted/50 rounded-lg">
                                                    <div className="w-24 h-24 relative rounded-lg overflow-hidden border">
                                                        <img src={editLogoUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>ยกเลิก</Button>
                                            <Button onClick={handleUpdateLogo} disabled={isActionLoading} className="bg-rose-600 hover:bg-rose-700">
                                                {isActionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                บันทึก
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 text-center sm:text-left space-y-2">
                            <div className="flex items-center justify-center sm:justify-start gap-3">
                                <h2 className="text-3xl font-bold tracking-tight text-foreground">{familyData.name}</h2>
                                <Badge variant="secondary" className="bg-rose-500/10 text-rose-500 border-rose-500/20">Level 1</Badge>
                            </div>

                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2 bg-muted/50 px-3 py-1 rounded-lg border border-border/50">
                                    <Users className="w-4 h-4" />
                                    <span>สมาชิก: <span className="text-foreground font-medium">{familyData.member_count} / {familyData.max_members}</span></span>
                                </div>
                                <div className="flex items-center gap-2 bg-muted/50 px-3 py-1 rounded-lg border border-border/50 cursor-pointer hover:bg-muted transition-colors" onClick={copyFamilyCode}>
                                    <span className="font-mono font-bold text-foreground tracking-wider">{familyData.family_code}</span>
                                    {copied ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100%-200px)]">
                    {/* Member List */}
                    <div className="lg:col-span-12 h-full">
                        <Card className="h-full flex flex-col border-border/50 shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
                            <CardHeader className="pb-3 border-b border-border/50">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Users className="w-5 h-5 text-rose-500" />
                                            รายชื่อสมาชิก
                                        </CardTitle>
                                        <CardDescription>สมาชิกทั้งหมดในครอบครัวของคุณ</CardDescription>
                                    </div>
                                    <div className="relative w-64 hidden sm:block">
                                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input placeholder="ค้นหาสมาชิก..." className="pl-8 h-9 bg-background/50" />
                                    </div>
                                </div>
                            </CardHeader>
                            <div className="flex-1 overflow-hidden">
                                <ScrollArea className="h-full">
                                    <Table>
                                        <TableHeader className="bg-muted/50 sticky top-0 z-10">
                                            <TableRow className="hover:bg-transparent border-border/50">
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
                                                    <TableRow key={member.discord_id} className="hover:bg-muted/30 border-border/50">
                                                        <TableCell className="font-medium">
                                                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs ${idx < 3 ? 'bg-rose-500/10 text-rose-500 font-bold' : 'text-muted-foreground'
                                                                }`}>
                                                                #{idx + 1}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-3">
                                                                <Avatar className="h-8 w-8 border border-border/50">
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
                                                                                LEADER
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
            <div className="w-full h-full max-h-[800px] overflow-hidden rounded-[2rem] border border-border/50 bg-card shadow-2xl grid lg:grid-cols-2">

                {/* Left Side: Hero Section */}
                <div className="relative hidden lg:flex flex-col justify-between bg-zinc-950 p-10 text-white dark:border-r border-border/50">
                    <div className="absolute inset-0 bg-[url('/images/family-hero.png')] bg-cover bg-center opacity-40 mix-blend-overlay" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-950/90" />

                    <div className="relative z-20 flex items-center text-lg font-medium">
                        <Heart className="mr-2 h-6 w-6 text-rose-500" />
                        Rank1 City Families
                    </div>
                    <div className="relative z-20 mt-auto">
                        <blockquote className="space-y-2">
                            <p className="text-lg font-light italic">
                                &ldquo;ครอบครัวไม่ใช่แค่เรื่องของสายเลือด แต่คือคนที่พร้อมจะจับมือคุณในวันที่คุณต้องการที่สุด สร้างบ้านของคุณในเมืองแห่งนี้&rdquo;
                            </p>
                            <footer className="text-sm text-zinc-400 font-medium">— The Matriarch</footer>
                        </blockquote>
                    </div>
                </div>

                {/* Right Side: Form Section */}
                <div className="flex flex-col justify-center p-8 lg:p-12 bg-background/50 backdrop-blur-sm">
                    <div className="mx-auto w-full max-w-[400px] flex flex-col justify-center space-y-6">
                        <div className="flex flex-col space-y-2 text-center">
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">ระบบครอบครัว</h1>
                            <p className="text-sm text-muted-foreground">
                                เข้าร่วมบ้านที่อบอุ่น หรือเริ่มต้นตระกูลของคุณเอง
                            </p>
                        </div>

                        <Tabs defaultValue="join" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50 p-1">
                                <TabsTrigger value="join" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">เข้าร่วม</TabsTrigger>
                                <TabsTrigger value="create" className="data-[state=active]:bg-background data-[state=active]:shadow-sm">สร้างใหม่</TabsTrigger>
                            </TabsList>

                            <TabsContent value="join" className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none">
                                        รหัสเชิญ (Invite Code)
                                    </label>
                                    <div className="relative">
                                        <Input
                                            placeholder="FAM-XXXXXX"
                                            value={joinCode}
                                            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                            className="font-mono uppercase text-center tracking-widest h-12 text-lg bg-background/50"
                                        />
                                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-muted-foreground">
                                            <Users className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    className="w-full h-12 text-base font-medium bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-500/20"
                                    onClick={() => handleAction('join')}
                                    disabled={!joinCode || isActionLoading}
                                >
                                    {isActionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
                                    เข้าร่วมครอบครัว
                                </Button>
                            </TabsContent>

                            <TabsContent value="create" className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none">
                                        ชื่อครอบครัว
                                    </label>
                                    <Input
                                        placeholder="ตั้งชื่อครอบครัวของคุณ"
                                        value={createName}
                                        onChange={(e) => setCreateName(e.target.value)}
                                        maxLength={20}
                                        className="h-11 bg-background/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none flex items-center justify-between">
                                        <span>ลิงก์โลโก้ (Optional)</span>
                                        <span className="text-[10px] text-muted-foreground">URL รูปภาพ</span>
                                    </label>
                                    <div className="relative">
                                        <Input
                                            placeholder="https://..."
                                            value={createLogoUrl}
                                            onChange={(e) => setCreateLogoUrl(e.target.value)}
                                            className="h-11 bg-background/50 pl-9"
                                        />
                                        <ImageIcon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                    </div>
                                </div>
                                <Button
                                    className="w-full h-12 text-base font-medium bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-500/20"
                                    onClick={() => handleAction('create')}
                                    disabled={!createName || isActionLoading}
                                >
                                    {isActionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                                    สร้างครอบครัว
                                </Button>
                            </TabsContent>
                        </Tabs>

                        {error && (
                            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2 justify-center border border-destructive/20">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
