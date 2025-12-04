'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LogOut, Settings, Search, Filter, Trophy, Loader2, Shield, Hexagon, ChevronDown, Copy, Users, Star, ArrowRight, Plus, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FamilyManager({ userData }) {
    const { data: session } = useSession();
    const [family, setFamily] = useState(null);
    const [loading, setLoading] = useState(true);
    const [members, setMembers] = useState([]);
    const [inviteCode, setInviteCode] = useState('');
    const [joinCode, setJoinCode] = useState('');
    const [createName, setCreateName] = useState('');
    const [createLogo, setCreateLogo] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [isJoining, setIsJoining] = useState(false);
    const [logoUrl, setLogoUrl] = useState('');
    const [isEditingLogo, setIsEditingLogo] = useState(false);

    // Theme Configuration (Royal Blue)
    const theme = {
        from: 'from-blue-600',
        to: 'to-indigo-600',
        text: 'text-blue-400',
        bg: 'bg-blue-500',
        border: 'border-blue-500/20',
        ring: 'ring-blue-500',
        glass: 'bg-zinc-900/60 backdrop-blur-md border-white/10'
    };

    useEffect(() => {
        fetchFamilyData();
    }, []);

    const fetchFamilyData = async () => {
        try {
            const res = await fetch('/api/family');
            const data = await res.json();

            if (data.family) {
                setFamily(data.family);
                setInviteCode(data.family.invite_code);
                setMembers(data.members || []);
                setLogoUrl(data.family.logo_url || '');
            } else {
                setFamily(null);
            }
        } catch (error) {
            console.error('Error fetching family:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateFamily = async (e) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            const res = await fetch('/api/family', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'create',
                    name: createName,
                    logoUrl: createLogo
                }),
            });

            const data = await res.json();
            if (res.ok) {
                toast.success('Family created successfully!');
                fetchFamilyData();
            } else {
                toast.error(data.error || 'Failed to create family');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setIsCreating(false);
        }
    };

    const handleJoinFamily = async (e) => {
        e.preventDefault();
        setIsJoining(true);
        try {
            const res = await fetch('/api/family', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'join', inviteCode: joinCode }),
            });

            const data = await res.json();
            if (res.ok) {
                toast.success('Joined family successfully!');
                fetchFamilyData();
            } else {
                toast.error(data.error || 'Failed to join family');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setIsJoining(false);
        }
    };

    const handleUpdateLogo = async () => {
        setIsEditingLogo(true);
        try {
            const res = await fetch('/api/family', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'update_logo', logoUrl }),
            });

            if (res.ok) {
                toast.success('Logo updated successfully!');
                fetchFamilyData();
            } else {
                const data = await res.json();
                toast.error(data.error || 'Failed to update logo');
            }
        } catch (error) {
            toast.error('Failed to update logo');
        } finally {
            setIsEditingLogo(false);
        }
    };

    const copyInviteCode = () => {
        navigator.clipboard.writeText(inviteCode);
        toast.success('Invite code copied!');
    };

    const isLeader = members.find(m => m.discord_id === userData?.discordId)?.is_leader;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (!family) {
        return (
            <div className="h-full w-full p-4 lg:p-8 flex items-center justify-center">
                <div className="w-full h-full max-h-[800px] overflow-hidden rounded-[2rem] border border-border/50 bg-background shadow-2xl grid lg:grid-cols-2">

                    {/* Left Side: Hero Section */}
                    <div className="relative hidden lg:flex flex-col justify-between bg-zinc-900 p-10 text-white dark:border-r">
                        <div className="absolute inset-0 bg-[url('/images/family-hero.png')] bg-cover bg-center opacity-40" />
                        <div className="relative z-20 flex items-center text-lg font-medium">
                            <Users className="mr-2 h-6 w-6 text-rose-500" />
                            Rank1 City Families
                        </div>
                        <div className="relative z-20 mt-auto">
                            <blockquote className="space-y-2">
                                <p className="text-lg">
                                    &ldquo;ครอบครัวไม่ใช่แค่เรื่องของสายเลือด แต่คือคนที่พร้อมจะจับมือคุณในวันที่คุณต้องการที่สุด สร้างบ้านของคุณในเมืองแห่งนี้&rdquo;
                                </p>
                                <footer className="text-sm text-zinc-400">เดอะ แมทริอาร์ค</footer>
                            </blockquote>
                        </div>
                    </div>

                    {/* Right Side: Form Section */}
                    <div className="flex flex-col justify-center p-8 lg:p-12 bg-background/50 backdrop-blur-sm">
                        <div className="mx-auto w-full max-w-[400px] flex flex-col justify-center space-y-6">
                            <div className="flex flex-col space-y-2 text-center">
                                <h1 className="text-3xl font-bold tracking-tight">ลงทะเบียนล่วงหน้า สำหรับครอบครัว</h1>
                                <p className="text-sm text-muted-foreground">
                                    เข้าร่วมบ้านที่อบอุ่น หรือเริ่มต้นตระกูลของคุณเอง
                                </p>
                            </div>

                            <Tabs defaultValue="join" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 mb-6">
                                    <TabsTrigger value="join">เข้าร่วมครอบครัว</TabsTrigger>
                                    <TabsTrigger value="create">สร้างครอบครัว</TabsTrigger>
                                </TabsList>

                                <TabsContent value="join" className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            รหัสเชิญ
                                        </label>
                                        <Input
                                            placeholder="FAM-XXXXXX"
                                            value={joinCode}
                                            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                            className="font-mono uppercase text-center tracking-widest h-11"
                                        />
                                    </div>
                                    <Button
                                        className="w-full h-11 bg-rose-600 hover:bg-rose-700 text-white"
                                        onClick={handleJoinFamily}
                                        disabled={!joinCode || isJoining}
                                    >
                                        {isJoining ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
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
                                            className="h-11"
                                        />
                                        <p className="text-[10px] text-muted-foreground text-right">
                                            {createName.length}/20
                                        </p>
                                    </div>
                                    <Button
                                        className="w-full h-11 bg-rose-600 hover:bg-rose-700 text-white"
                                        onClick={handleCreateFamily}
                                        disabled={!createName || isCreating}
                                    >
                                        {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                                        สร้างครอบครัว
                                    </Button>
                                </TabsContent>
                            </Tabs>

                            <p className="px-8 text-center text-sm text-muted-foreground">
                                การสร้างครอบครัวถือว่าคุณยอมรับ{" "}
                                <span className="underline underline-offset-4 hover:text-primary cursor-pointer">
                                    แนวทางปฏิบัติของชุมชน
                                </span>
                                ของเรา
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto pt-4 px-6 pb-6 font-sans">
            <div className="grid grid-cols-12 gap-8">

                {/* Left Sidebar (Profile) */}
                <div className="col-span-12 lg:col-span-3 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`${theme.glass} p-8 rounded-[2rem] text-center border shadow-xl relative overflow-hidden group`}
                    >
                        {/* Glow Effect */}
                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-tr ${theme.from} ${theme.to} rounded-full blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />

                        <div className="relative mb-6 inline-block group/avatar">
                            <div className={`w-28 h-28 rounded-2xl p-1 bg-gradient-to-br ${theme.from} ${theme.to}`}>
                                <Avatar className="w-full h-full rounded-xl border-4 border-black/50">
                                    <AvatarImage src={family.logo_url} className="object-cover" />
                                    <AvatarFallback className="bg-zinc-900 text-blue-400 text-2xl font-bold">
                                        {family.name.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            {isLeader && (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            size="icon"
                                            variant="secondary"
                                            className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full shadow-lg opacity-0 group-hover/avatar:opacity-100 transition-opacity"
                                        >
                                            <Settings className="w-4 h-4" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="bg-zinc-900 border-zinc-800">
                                        <DialogHeader>
                                            <DialogTitle>Update Family Logo</DialogTitle>
                                            <DialogDescription>Enter a new URL for your family's logo.</DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="flex justify-center">
                                                <Avatar className="h-24 w-24 border-2 border-zinc-700">
                                                    <AvatarImage src={logoUrl} />
                                                    <AvatarFallback>Preview</AvatarFallback>
                                                </Avatar>
                                            </div>
                                            <Input
                                                value={logoUrl}
                                                onChange={(e) => setLogoUrl(e.target.value)}
                                                placeholder="https://example.com/logo.png"
                                                className="bg-black/50"
                                            />
                                        </div>
                                        <DialogFooter>
                                            <Button onClick={handleUpdateLogo} disabled={isEditingLogo} className="bg-blue-600 hover:bg-blue-700">
                                                {isEditingLogo ? 'Updating...' : 'Save Changes'}
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">{family.name}</h2>
                        <div
                            onClick={copyInviteCode}
                            className="flex items-center justify-center gap-2 text-zinc-400 text-sm mb-6 bg-black/20 py-1 px-3 rounded-full mx-auto w-fit border border-white/5 cursor-pointer hover:bg-black/40 transition-colors"
                        >
                            <span className="font-mono">{family.invite_code}</span>
                            <Copy className="w-3 h-3" />
                        </div>

                        <div className="grid grid-cols-1 gap-3 mb-6">
                            <div className="bg-black/20 rounded-xl p-3 border border-white/5">
                                <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Members</div>
                                <div className="text-lg font-bold">{members.length}</div>
                            </div>
                        </div>

                        {isLeader ? (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className={`w-full rounded-xl bg-gradient-to-r ${theme.from} ${theme.to} text-white font-semibold shadow-lg shadow-black/20 hover:opacity-90 transition-opacity`}>
                                        จัดการครอบครัว
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-zinc-950/95 backdrop-blur-xl border-white/10 max-w-2xl max-h-[85vh] overflow-hidden flex flex-col p-0">
                                    <div className="p-6 border-b border-white/10">
                                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                                            <Settings className="w-6 h-6 text-zinc-400" />
                                            ศูนย์บัญชาการ
                                        </DialogTitle>
                                        <DialogDescription>
                                            จัดการการตั้งค่าครอบครัว
                                        </DialogDescription>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                        <div className="space-y-4">
                                            <div className="grid gap-2">
                                                <Label>ชื่อครอบครัว</Label>
                                                <Input defaultValue={family.name} className="bg-black/20 border-white/10" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>ประกาศครอบครัว (MOTD)</Label>
                                                <Textarea placeholder="เขียนข้อความถึงสมาชิกของคุณ..." className="bg-black/20 border-white/10 min-h-[100px]" />
                                                <p className="text-xs text-zinc-500">ข้อความนี้จะถูกปักหมุดไว้ด้านบนของแชทสมาชิก</p>
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 space-y-3">
                                            <h4 className="text-red-400 font-bold flex items-center gap-2">
                                                <Shield className="w-4 h-4" /> เขตอันตราย
                                            </h4>
                                            <p className="text-xs text-zinc-400">การกระทำที่ไม่สามารถย้อนกลับได้</p>
                                            <Button variant="destructive" size="sm" className="w-full">ยุบครอบครัว</Button>
                                        </div>
                                    </div>

                                </DialogContent>
                            </Dialog>
                        ) : (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full rounded-xl border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white mb-6">
                                        ดูรายละเอียด
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-zinc-950/95 backdrop-blur-xl border-white/10">
                                    <DialogHeader>
                                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                            <Shield className="w-5 h-5 text-blue-400" />
                                            ข้อมูลครอบครัว
                                        </DialogTitle>
                                        <DialogDescription>
                                            รายละเอียดและประกาศจากหัวหน้าครอบครัว
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-6 py-4">
                                        <div className="space-y-2">
                                            <Label className="text-zinc-400">ชื่อครอบครัว</Label>
                                            <div className="text-lg font-bold text-white">{family.name}</div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-zinc-400">ประกาศ (MOTD)</Label>
                                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-zinc-300 min-h-[100px] text-sm leading-relaxed whitespace-pre-wrap">
                                                {family.motd || "ยังไม่มีประกาศจากหัวหน้าครอบครัว"}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-3 rounded-lg bg-black/20 border border-white/5">
                                                <div className="text-xs text-zinc-500 uppercase">สมาชิก</div>
                                                <div className="text-lg font-bold">{members.length} คน</div>
                                            </div>
                                            <div className="p-3 rounded-lg bg-black/20 border border-white/5">
                                                <div className="text-xs text-zinc-500 uppercase">รหัสเชิญ</div>
                                                <div className="text-lg font-mono font-bold text-zinc-400">Hidden</div>
                                            </div>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        )}
                    </motion.div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 gap-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`${theme.glass} p-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/5 transition-colors group text-red-400 hover:text-red-300`}
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Leave Family</span>
                        </motion.button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="col-span-12 lg:col-span-9">

                    {/* Reward Progression Button & Dialog */}
                    <div className="mb-6">
                        <Dialog>
                            <DialogTrigger asChild>
                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    className={`${theme.glass} w-full p-4 rounded-2xl border shadow-lg flex items-center justify-between group hover:bg-white/5 transition-all`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500 group-hover:scale-110 transition-transform">
                                            <Trophy className="w-6 h-6" />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors">รางวัลครอบครัว</h3>
                                            <p className="text-zinc-400 text-sm">เลเวล {family.level || 1} • {members.length}/{family.max_members || 25} สมาชิก</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 pr-2">
                                        <div className="text-right hidden sm:block">
                                            <div className="text-xs text-zinc-500 uppercase font-bold">รางวัลถัดไป</div>
                                            <div className="text-sm font-medium text-white">15 สมาชิก</div>
                                        </div>
                                        <ChevronDown className="w-5 h-5 text-zinc-500 -rotate-90 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </motion.button>
                            </DialogTrigger>
                            <DialogContent className="bg-zinc-900/95 backdrop-blur-xl border-white/10 max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                                        <Trophy className="w-6 h-6 text-yellow-500" />
                                        ความคืบหน้ารางวัลครอบครัว
                                    </DialogTitle>
                                    <DialogDescription>
                                        รับสมาชิกเพิ่มเพื่อปลดล็อกสิทธิพิเศษและรางวัลของครอบครัว
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="py-12 px-4">
                                    <div className="flex items-center justify-between mb-12">
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-white">{members.length}</div>
                                            <div className="text-xs text-zinc-500 uppercase tracking-wider">สมาชิกปัจจุบัน</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-zinc-500">{family.max_members || 25}</div>
                                            <div className="text-xs text-zinc-500 uppercase tracking-wider">เป้าหมายสูงสุด</div>
                                        </div>
                                    </div>

                                    {/* Progress Bar Container */}
                                    <div className="relative h-4 bg-black/40 rounded-full mb-8 mx-4">
                                        {/* Progress Fill */}
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(members.length / (family.max_members || 25)) * 100}%` }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className={`absolute top-0 left-0 h-full rounded-full bg-gradient-to-r ${theme.from} ${theme.to} shadow-[0_0_15px_rgba(59,130,246,0.5)]`}
                                        />

                                        {/* Milestones */}
                                        {[10, 15, 20, 25].map((milestone) => {
                                            const isUnlocked = members.length >= milestone;
                                            const position = (milestone / (family.max_members || 25)) * 100;

                                            return (
                                                <div
                                                    key={milestone}
                                                    className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center group"
                                                    style={{ left: `${position}%` }}
                                                >
                                                    {/* Dot on line */}
                                                    <div className={`w-4 h-4 rounded-full border-2 transition-all duration-500 z-10 ${isUnlocked ? `${theme.bg} border-white shadow-[0_0_10px_white]` : 'bg-zinc-900 border-zinc-700'}`} />

                                                    {/* Label */}
                                                    <div className={`absolute top-6 whitespace-nowrap text-xs font-bold transition-colors duration-500 ${isUnlocked ? 'text-white' : 'text-zinc-600'}`}>
                                                        {milestone}
                                                    </div>

                                                    {/* Reward Box Icon */}
                                                    <div className={`absolute bottom-6 p-2 rounded-lg border transition-all duration-500 ${isUnlocked ? `${theme.glass} border-yellow-500/50 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.2)]` : 'bg-black/40 border-white/5 text-zinc-700'}`}>
                                                        <Hexagon className="w-5 h-5" />
                                                    </div>

                                                    {/* Tooltip (Hover) */}
                                                    <div className="absolute bottom-16 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 border border-white/10 px-3 py-1 rounded-lg text-xs text-white whitespace-nowrap pointer-events-none transform translate-y-2 group-hover:translate-y-0 z-20">
                                                        รางวัลระดับ {milestone}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Members Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className={`${theme.glass} rounded-[2rem] overflow-hidden border shadow-xl flex flex-col h-[450px]`}
                    >
                        {/* Toolbar */}
                        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    Family Members
                                    <Badge variant="secondary" className="bg-white/10 text-zinc-300 hover:bg-white/20 border-0">{members.length}</Badge>
                                </h3>
                                <p className="text-zinc-500 text-sm mt-1">Family hierarchy and roster</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="bg-black/20 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-white/10 w-40 sm:w-64 transition-all"
                                    />
                                </div>
                                <Button size="icon" variant="ghost" className="rounded-xl hover:bg-white/5 text-zinc-400">
                                    <Filter className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Content with ScrollArea */}
                        <div className="flex-1 bg-black/20 overflow-hidden relative">
                            <ScrollArea className="h-full w-full">
                                <div className="p-6 pb-12">
                                    <div className="space-y-2">
                                        <div className="grid grid-cols-12 text-xs font-bold text-zinc-500 uppercase tracking-wider px-4 pb-2 sticky top-0 bg-black/40 backdrop-blur-md z-10 rounded-lg mb-2 py-2">
                                            <div className="col-span-6 md:col-span-6">Member</div>
                                            <div className="col-span-4 md:col-span-4">Role</div>
                                            <div className="col-span-2 md:col-span-2 text-right">Joined</div>
                                        </div>
                                        <AnimatePresence>
                                            {members.map((m, i) => (
                                                <motion.div
                                                    key={m.discord_id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.05 }}
                                                    className="grid grid-cols-12 items-center p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer border border-transparent hover:border-white/5"
                                                >
                                                    <div className="col-span-6 md:col-span-6 flex items-center gap-4">
                                                        <div className="relative">
                                                            <Avatar className={`h-10 w-10 ring-2 ring-transparent group-hover:${theme.ring} transition-all`}>
                                                                <AvatarImage src={m.avatar_url} />
                                                                <AvatarFallback className="bg-zinc-800 text-zinc-400 font-bold">
                                                                    {m.discord_name[0]}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                        </div>
                                                        <div className="overflow-hidden">
                                                            <div className="font-bold text-zinc-200 group-hover:text-white transition-colors truncate">{m.discord_name}</div>
                                                            <div className="text-xs text-zinc-500 font-mono truncate">ID: {m.discord_id}</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-span-4 md:col-span-4">
                                                        <Badge variant="outline" className={`${m.is_leader ? `${theme.bg}/20 ${theme.text} ${theme.border}` : 'bg-zinc-800/50 text-zinc-400 border-zinc-700/50'}`}>
                                                            {m.is_leader ? 'Leader' : 'Member'}
                                                        </Badge>
                                                    </div>
                                                    <div className="col-span-2 md:col-span-2 text-right text-zinc-500 text-xs font-mono">
                                                        {new Date(m.joined_at).toLocaleDateString()}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </ScrollArea>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div >
    );
}
