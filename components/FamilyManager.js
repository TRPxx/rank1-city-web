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
import { LogOut, Settings, Search, Filter, Trophy, Loader2, Shield, Hexagon, ChevronDown, Copy, Users, Star, ArrowRight, Plus, AlertCircle, Crown } from 'lucide-react';
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
    const [isLeaving, setIsLeaving] = useState(false);
    const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);
    const [isDissolving, setIsDissolving] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [isKicking, setIsKicking] = useState(false);
    const [isTransferring, setIsTransferring] = useState(false);
    const [settingsName, setSettingsName] = useState('');
    const [settingsMotd, setSettingsMotd] = useState('');
    const [showCreateConfirm, setShowCreateConfirm] = useState(false);

    useEffect(() => {
        if (family) {
            setSettingsName(family.name);
            setSettingsMotd(family.motd || '');
        }
    }, [family]);

    // Dynamic Theme based on member count milestones
    const getFamilyTierTheme = (memberCount) => {
        if (memberCount >= 25) {
            // 🔴 Legendary - Red/Crimson
            return {
                from: 'from-red-500',
                to: 'to-rose-600',
                shadow: 'shadow-red-500/40',
                tierName: 'มหาตระกูล',
                tierColor: 'text-red-400'
            };
        } else if (memberCount >= 20) {
            // 🟠 Epic - Orange/Gold
            return {
                from: 'from-amber-500',
                to: 'to-orange-600',
                shadow: 'shadow-amber-500/40',
                tierName: 'มั่นคง',
                tierColor: 'text-amber-400'
            };
        } else if (memberCount >= 15) {
            // 🟣 Rare - Purple
            return {
                from: 'from-purple-500',
                to: 'to-violet-600',
                shadow: 'shadow-purple-500/40',
                tierName: 'เติบโต',
                tierColor: 'text-purple-400'
            };
        } else if (memberCount >= 10) {
            // 🟢 Uncommon - Green
            return {
                from: 'from-emerald-500',
                to: 'to-green-600',
                shadow: 'shadow-emerald-500/40',
                tierName: 'รากฐาน',
                tierColor: 'text-emerald-400'
            };
        }
        // 🔵 Common - Blue (Default)
        return {
            from: 'from-blue-600',
            to: 'to-indigo-600',
            shadow: 'shadow-blue-500/30',
            tierName: 'เริ่มต้น',
            tierColor: 'text-blue-400'
        };
    };

    const tierTheme = getFamilyTierTheme(members.length);

    // Theme Configuration
    const theme = {
        from: tierTheme.from,
        to: tierTheme.to,
        text: 'text-primary',
        bg: 'bg-primary',
        border: 'border-primary/20',
        ring: 'ring-primary',
        glass: 'bg-muted/10 backdrop-blur-md border-white/5',
        shadow: tierTheme.shadow,
        tierName: tierTheme.tierName,
        tierColor: tierTheme.tierColor
    };

    useEffect(() => {
        fetchFamilyData();
        const interval = setInterval(fetchFamilyData, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchFamilyData = async () => {
        try {
            const res = await fetch(`/api/family?_=${Date.now()}`, { cache: 'no-store' });
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
                toast.success('สร้างครอบครัวสำเร็จ!');
                setLoading(true); // Reset loading to trigger re-render
                await fetchFamilyData();
            } else {
                toast.error(data.error || 'สร้างครอบครัวไม่สำเร็จ');
            }
        } catch (error) {
            toast.error('เกิดข้อผิดพลาดบางอย่าง');
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
                toast.success('เข้าร่วมครอบครัวสำเร็จ!');
                fetchFamilyData();
            } else {
                toast.error(data.error || 'เข้าร่วมครอบครัวไม่สำเร็จ');
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
                toast.success('อัพเดทโลโก้สำเร็จ!');
                fetchFamilyData();
            } else {
                const data = await res.json();
                toast.error(data.error || 'อัพเดทโลโก้ไม่สำเร็จ');
            }
        } catch (error) {
            toast.error('อัพเดทโลโก้ไม่สำเร็จ');
        } finally {
            setIsEditingLogo(false);
        }
    };

    const handleLeaveFamily = async () => {
        setIsLeaving(true);
        try {
            const res = await fetch('/api/family', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'leave' }),
            });

            const data = await res.json();
            if (res.ok) {
                toast.success('ออกจากครอบครัวสำเร็จ');
                fetchFamilyData();
            } else {
                toast.error(data.error || 'ออกจากครอบครัวไม่สำเร็จ');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setIsLeaving(false);
        }
    };

    const handleUpdateSettings = async () => {
        setIsUpdatingSettings(true);
        try {
            const res = await fetch('/api/family', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'update_settings',
                    name: settingsName,
                    motd: settingsMotd
                }),
            });

            const data = await res.json();
            if (res.ok) {
                toast.success('บันทึกการตั้งค่าสำเร็จ');
                fetchFamilyData();
            } else {
                toast.error(data.error || 'บันทึกการตั้งค่าไม่สำเร็จ');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setIsUpdatingSettings(false);
        }
    };

    const handleDissolveFamily = async () => {
        setIsDissolving(true);
        try {
            const res = await fetch('/api/family', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'dissolve' }),
            });

            const data = await res.json();
            if (res.ok) {
                toast.success('ยุบครอบครัวสำเร็จ');
                fetchFamilyData();
            } else {
                toast.error(data.error || 'ยุบครอบครัวไม่สำเร็จ');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setIsDissolving(false);
        }
    };

    const copyInviteCode = () => {
        if (family?.invite_code) {
            navigator.clipboard.writeText(family.invite_code);
            toast.success('คัดลอกรหัสเชิญแล้ว!');
        }
    };

    const handleTransferLeadership = async (targetDiscordId) => {
        setIsTransferring(true);
        try {
            const res = await fetch('/api/family', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'transfer_leadership', targetDiscordId }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || data.error);

            toast.success(data.message);
            setSelectedMember(null);
            fetchFamilyData(); // Reload to reflect changes (user might no longer be leader)
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsTransferring(false);
        }
    };

    const handleKickMember = async (targetDiscordId) => {
        setIsKicking(true);
        try {
            const res = await fetch('/api/family', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'kick_member', targetDiscordId }),
            });

            const data = await res.json();
            if (res.ok) {
                toast.success('สมาชิกถูกเตะออกจากครอบครัวแล้ว');
                setSelectedMember(null);
                setLoading(true);
                await fetchFamilyData();
            } else {
                toast.error(data.error || 'เตะสมาชิกไม่สำเร็จ');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setIsKicking(false);
        }
    };

    const isLeader = members.find(m => m.discord_id === userData?.discord_id)?.is_leader;

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
                    <div className="relative hidden lg:flex flex-col justify-between bg-muted/10 p-10 text-foreground dark:border-r">
                        <div className="absolute inset-0 bg-[url('/images/family-hero.png')] bg-cover bg-center opacity-40" />
                        <div className="relative z-20 flex items-center text-lg font-medium">
                            <Users className="mr-2 h-6 w-6 text-primary" />
                            Rank1 City Families
                        </div>
                        <div className="relative z-20 mt-auto">
                            <blockquote className="space-y-2">
                                <p className="text-lg">
                                    &ldquo;ครอบครัวไม่ใช่แค่เรื่องของสายเลือด แต่คือคนที่พร้อมจะจับมือคุณในวันที่คุณต้องการที่สุด สร้างบ้านของคุณในเมืองแห่งนี้&rdquo;
                                </p>
                                <footer className="text-sm text-muted-foreground">เดอะ แมทริอาร์ค</footer>
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
                                        className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
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
                                        className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                                        onClick={() => setShowCreateConfirm(true)}
                                        disabled={!createName || isCreating}
                                    >
                                        {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                                        สร้างครอบครัว
                                    </Button>

                                    <Dialog open={showCreateConfirm} onOpenChange={setShowCreateConfirm}>
                                        <DialogContent className="bg-background border-border sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle className="text-xl flex items-center gap-2">
                                                    <Users className="w-5 h-5 text-primary" />
                                                    ยืนยันการก่อตั้งครอบครัว
                                                </DialogTitle>
                                                <DialogDescription>
                                                    กรุณาตรวจสอบรายละเอียดก่อนยืนยัน
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="py-4 space-y-4">
                                                <div className="space-y-2">
                                                    <Label className="text-muted-foreground">ชื่อครอบครัวของคุณ</Label>
                                                    <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-center">
                                                        <span className="text-xl font-bold text-primary">{createName}</span>
                                                    </div>
                                                </div>

                                                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                                                    <h4 className="text-amber-500 font-bold flex items-center gap-2 text-sm">
                                                        <AlertCircle className="w-4 h-4" /> ข้อควรระวัง
                                                    </h4>
                                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                                        หากคุณทำการยุบครอบครัวในอนาคต คุณจะติดสถานะ <span className="text-amber-500 font-bold">Cooldown 7 วัน</span> ซึ่งจะทำให้ไม่สามารถสร้างครอบครัวใหม่ได้จนกว่าจะครบกำหนด
                                                    </p>
                                                </div>

                                                <p className="text-xs text-center text-muted-foreground">
                                                    การกดปุ่มยืนยันแสดงว่าคุณยอมรับกฎและนโยบายของเซิร์ฟเวอร์
                                                </p>
                                            </div>
                                            <DialogFooter className="gap-2 sm:gap-0">
                                                <Button variant="ghost" onClick={() => setShowCreateConfirm(false)}>
                                                    ยกเลิก
                                                </Button>
                                                <Button
                                                    onClick={(e) => {
                                                        setShowCreateConfirm(false);
                                                        handleCreateFamily(e);
                                                    }}
                                                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                                >
                                                    {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Users className="mr-2 h-4 w-4" />}
                                                    ยืนยันสร้างครอบครัว
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
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
                            {/* Logo Container */}
                            <div className={`relative w-28 h-28 rounded-2xl p-[3px] bg-gradient-to-br ${theme.from} ${theme.to} shadow-lg ${theme.shadow} group-hover/avatar:shadow-xl transition-all duration-300`}>
                                {/* Inner Glow */}
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300" />

                                <div className="relative w-full h-full rounded-xl overflow-hidden bg-zinc-900">
                                    {family.logo_url ? (
                                        <img
                                            src={family.logo_url}
                                            alt={family.name}
                                            className="w-full h-full object-cover group-hover/avatar:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${theme.from}/20 ${theme.to}/20`}>
                                            <span className="text-3xl font-bold text-white/80">
                                                {family.name.substring(0, 2).toUpperCase()}
                                            </span>
                                        </div>
                                    )}

                                    {/* Overlay Shine Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300" />
                                </div>
                            </div>

                            {/* Tier Badge */}
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-10">
                                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r ${theme.from} ${theme.to} text-white shadow-lg`}>
                                    {theme.tierName}
                                </div>
                            </div>

                            {/* Leader Star Badge */}
                            {isLeader && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-pink-500/50 blur-md rounded-full" />
                                        <div className="relative bg-gradient-to-r from-pink-400 to-rose-500 text-white p-1.5 rounded-full shadow-lg">
                                            <Star className="w-4 h-4 fill-current" />
                                        </div>
                                    </div>
                                </div>
                            )}
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
                                    <DialogContent className="bg-background border-border">
                                        <DialogHeader>
                                            <DialogTitle>อัพเดทโลโก้ครอบครัว</DialogTitle>
                                            <DialogDescription>ใส่ลิงก์รูปภาพสำหรับโลโก้ครอบครัวของคุณ</DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="flex justify-center">
                                                <Avatar className="h-24 w-24 border-2 border-border">
                                                    <AvatarImage src={logoUrl} />
                                                    <AvatarFallback>Preview</AvatarFallback>
                                                </Avatar>
                                            </div>
                                            <Input
                                                value={logoUrl}
                                                onChange={(e) => setLogoUrl(e.target.value)}
                                                placeholder="https://example.com/logo.png"
                                                className="bg-muted/50 border-input"
                                            />
                                            <p className="text-xs text-muted-foreground text-center">
                                                แนะนำขนาด: 512x512px (Square Ratio) เพื่อความสวยงาม
                                            </p>
                                        </div>
                                        <DialogFooter>
                                            <Button onClick={handleUpdateLogo} disabled={isEditingLogo} className="bg-blue-600 hover:bg-blue-700 text-white">
                                                {isEditingLogo ? 'กำลังอัพเดท...' : 'บันทึกการเปลี่ยนแปลง'}
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>

                        <h2 className="text-2xl font-bold text-foreground mb-1 tracking-tight">{family.name}</h2>
                        <div
                            onClick={copyInviteCode}
                            className="relative z-10 flex items-center justify-center gap-2 text-muted-foreground text-sm mb-6 bg-background/30 py-1 px-3 rounded-full mx-auto w-fit border border-white/5 cursor-pointer hover:bg-background/50 transition-colors"
                        >
                            <span className="font-mono">{family.invite_code}</span>
                            <Copy className="w-3 h-3" />
                        </div>

                        <div className="grid grid-cols-1 gap-3 mb-6">
                            <div className="bg-background/30 rounded-xl p-3 border border-white/5">
                                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">สมาชิก</div>
                                <div className="text-lg font-bold text-foreground">{members.length}</div>
                            </div>
                        </div>

                        {isLeader ? (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className={`w-full rounded-xl bg-gradient-to-r ${theme.from} ${theme.to} text-white font-semibold shadow-lg shadow-black/20 hover:opacity-90 transition-opacity`}>
                                        จัดการครอบครัว
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-background/95 backdrop-blur-xl border-border max-w-2xl max-h-[85vh] overflow-hidden flex flex-col p-0">
                                    <div className="p-6 border-b border-border">
                                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                                            <Settings className="w-6 h-6 text-muted-foreground" />
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
                                                <Input
                                                    value={settingsName}
                                                    onChange={(e) => setSettingsName(e.target.value)}
                                                    className="bg-muted/50 border-input"
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>ประกาศครอบครัว (MOTD)</Label>
                                                <Textarea
                                                    value={settingsMotd}
                                                    onChange={(e) => setSettingsMotd(e.target.value)}
                                                    placeholder="เขียนข้อความถึงสมาชิกของคุณ..."
                                                    className="bg-muted/50 border-input min-h-[100px]"
                                                />
                                                <p className="text-xs text-muted-foreground">ข้อความนี้จะถูกปักหมุดไว้ด้านบนของแชทสมาชิก</p>
                                            </div>
                                            <Button
                                                onClick={handleUpdateSettings}
                                                disabled={isUpdatingSettings}
                                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                                            >
                                                {isUpdatingSettings ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                                บันทึกการเปลี่ยนแปลง
                                            </Button>
                                        </div>
                                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 space-y-3">
                                            <h4 className="text-red-400 font-bold flex items-center gap-2">
                                                <Shield className="w-4 h-4" /> เขตอันตราย
                                            </h4>
                                            <p className="text-xs text-muted-foreground">การกระทำที่ไม่สามารถย้อนกลับได้</p>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        className="w-full"
                                                        disabled={isDissolving}
                                                    >
                                                        {isDissolving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                                        ยุบครอบครัว
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="bg-background border-red-500/20">
                                                    <DialogHeader>
                                                        <DialogTitle className="text-red-500 flex items-center gap-2">
                                                            <AlertCircle className="w-5 h-5" />
                                                            ยืนยันการยุบครอบครัว
                                                        </DialogTitle>
                                                        <DialogDescription className="text-muted-foreground">
                                                            การกระทำนี้ไม่สามารถย้อนกลับได้ สมาชิกทั้งหมดจะถูกเตะออกและข้อมูลครอบครัวจะถูกลบถาวร
                                                            คุณแน่ใจหรือไม่ที่จะดำเนินการต่อ?
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <DialogFooter className="gap-2 sm:gap-0">
                                                        <DialogTrigger asChild>
                                                            <Button variant="ghost">ยกเลิก</Button>
                                                        </DialogTrigger>
                                                        <Button
                                                            variant="destructive"
                                                            onClick={handleDissolveFamily}
                                                            disabled={isDissolving}
                                                        >
                                                            {isDissolving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                                            ยืนยันยุบครอบครัว
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
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
                                <DialogContent className="bg-background/95 backdrop-blur-xl border-border">
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
                                            <Label className="text-muted-foreground">ชื่อครอบครัว</Label>
                                            <div className="text-lg font-bold text-foreground">{family.name}</div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-muted-foreground">ประกาศ (MOTD)</Label>
                                            <div className="p-4 rounded-xl bg-muted/30 border border-muted text-foreground min-h-[100px] text-sm leading-relaxed whitespace-pre-wrap">
                                                {family.motd || "ยังไม่มีประกาศจากหัวหน้าครอบครัว"}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-3 rounded-lg bg-muted/20 border border-muted">
                                                <div className="text-xs text-muted-foreground uppercase">สมาชิก</div>
                                                <div className="text-lg font-bold text-foreground">{members.length} คน</div>
                                            </div>
                                            <div className="p-3 rounded-lg bg-muted/20 border border-muted">
                                                <div className="text-xs text-muted-foreground uppercase">รหัสเชิญ</div>
                                                <div className="text-lg font-mono font-bold text-muted-foreground">Hidden</div>
                                            </div>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        )}
                    </motion.div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 gap-4">
                        <Dialog>
                            <DialogTrigger asChild>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={isLeaving}
                                    className={`${theme.glass} p-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/5 transition-colors group text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {isLeaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5" />}
                                    <span className="font-medium">ออกจากครอบครัว</span>
                                </motion.button>
                            </DialogTrigger>
                            <DialogContent className="bg-background border-border">
                                <DialogHeader>
                                    <DialogTitle className="text-foreground flex items-center gap-2">
                                        <LogOut className="w-5 h-5 text-red-400" />
                                        ออกจากครอบครัว
                                    </DialogTitle>
                                    <DialogDescription className="text-muted-foreground">
                                        คุณแน่ใจหรือไม่ที่จะออกจากครอบครัวนี้? คุณจะต้องได้รับเชิญใหม่หากต้องการกลับเข้ามาอีกครั้ง
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="gap-2 sm:gap-0">
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" className="text-muted-foreground hover:text-foreground">ยกเลิก</Button>
                                    </DialogTrigger>
                                    <Button
                                        variant="destructive"
                                        onClick={handleLeaveFamily}
                                        disabled={isLeaving}
                                    >
                                        {isLeaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                        ยืนยันออกจากครอบครัว
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
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
                                            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">รางวัลครอบครัว</h3>
                                            <p className="text-muted-foreground text-sm">เลเวล {family.level || 1} • {members.length}/{family.max_members || 25} สมาชิก</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 pr-2">
                                        <div className="text-right hidden sm:block">
                                            <div className="text-xs text-muted-foreground uppercase font-bold">รางวัลถัดไป</div>
                                            <div className="text-sm font-medium text-foreground">15 สมาชิก</div>
                                        </div>
                                        <ChevronDown className="w-5 h-5 text-zinc-500 -rotate-90 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </motion.button>
                            </DialogTrigger>
                            <DialogContent className="bg-background/95 backdrop-blur-xl border-border max-w-2xl">
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
                                            <div className="text-3xl font-bold text-foreground">{members.length}</div>
                                            <div className="text-xs text-muted-foreground uppercase tracking-wider">สมาชิกปัจจุบัน</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-muted-foreground">{family.max_members || 25}</div>
                                            <div className="text-xs text-muted-foreground uppercase tracking-wider">เป้าหมายสูงสุด</div>
                                        </div>
                                    </div>

                                    {/* Progress Bar Container */}
                                    <div className="relative h-4 bg-muted/50 rounded-full mb-8 mx-4">
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
                                                    <div className={`w-4 h-4 rounded-full border-2 transition-all duration-500 z-10 ${isUnlocked ? `${theme.bg} border-white shadow-[0_0_10px_white]` : 'bg-muted border-zinc-500'}`} />

                                                    {/* Label */}
                                                    <div className={`absolute top-6 whitespace-nowrap text-xs font-bold transition-colors duration-500 ${isUnlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                        {milestone}
                                                    </div>

                                                    {/* Reward Box Icon */}
                                                    <div className={`absolute bottom-6 p-2 rounded-lg border transition-all duration-500 ${isUnlocked ? `${theme.glass} border-yellow-500/50 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.2)]` : 'bg-muted/50 border-white/5 text-muted-foreground'}`}>
                                                        <Hexagon className="w-5 h-5" />
                                                    </div>

                                                    {/* Tooltip (Hover) */}
                                                    <div className="absolute bottom-16 opacity-0 group-hover:opacity-100 transition-opacity bg-popover border border-border px-3 py-1 rounded-lg text-xs text-popover-foreground whitespace-nowrap pointer-events-none transform translate-y-2 group-hover:translate-y-0 z-20 shadow-md">
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

                    {/* Member Detail Dialog */}
                    <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
                        <DialogContent className="bg-background/95 backdrop-blur-xl border-border max-w-md">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                                    <Users className="w-6 h-6 text-primary" />
                                    ข้อมูลสมาชิก
                                </DialogTitle>
                                <DialogDescription>
                                    รายละเอียดและการจัดการสมาชิกในครอบครัว
                                </DialogDescription>
                            </DialogHeader>

                            {selectedMember && (
                                <div className="space-y-6 py-4">
                                    {/* Member Avatar & Name */}
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-20 w-20 ring-2 ring-primary/20">
                                            <AvatarImage src={selectedMember.avatar_url} />
                                            <AvatarFallback className="bg-muted text-muted-foreground text-2xl font-bold">
                                                {selectedMember.discord_name[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-foreground">
                                                {selectedMember.firstname && selectedMember.lastname
                                                    ? `${selectedMember.firstname} ${selectedMember.lastname}`
                                                    : selectedMember.discord_name}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">@{selectedMember.discord_name}</p>
                                            <Badge variant="outline" className={`mt-1 ${selectedMember.is_leader ? `${theme.bg}/20 ${theme.text} ${theme.border}` : 'bg-background/30 text-muted-foreground border-white/5'}`}>
                                                {selectedMember.is_leader ? 'หัวหน้า' : 'สมาชิก'}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Member Info */}
                                    <div className="space-y-3">
                                        <div className="p-3 rounded-lg bg-muted/20 border border-border">
                                            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">ชื่อผู้ใช้ Discord</div>
                                            <div className="text-sm text-foreground">@{selectedMember.discord_name}</div>
                                            <div className="text-xs text-muted-foreground font-mono mt-1">ID: {selectedMember.discord_id}</div>
                                        </div>
                                        <div className="p-3 rounded-lg bg-muted/20 border border-border">
                                            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">วันที่เข้าร่วม</div>
                                            <div className="text-sm text-foreground">{new Date(selectedMember.joined_at).toLocaleString('th-TH')}</div>
                                        </div>
                                    </div>

                                    {/* Leader Actions */}
                                    {isLeader && !selectedMember.is_leader && (
                                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 space-y-3">
                                            <h4 className="text-red-400 font-bold flex items-center gap-2 text-sm">
                                                <Shield className="w-4 h-4" /> การจัดการสมาชิก
                                            </h4>

                                            {/* Transfer Leadership Button */}
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="w-full text-yellow-500 border-yellow-500/50 hover:bg-yellow-500/10 mb-2"
                                                        disabled={isTransferring}
                                                    >
                                                        {isTransferring ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Crown className="mr-2 h-4 w-4" />}
                                                        โอนตำแหน่งหัวหน้า
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="bg-background border-yellow-500/20">
                                                    <DialogHeader>
                                                        <DialogTitle className="text-yellow-500 flex items-center gap-2">
                                                            <AlertCircle className="w-5 h-5" />
                                                            ยืนยันโอนตำแหน่งหัวหน้า
                                                        </DialogTitle>
                                                        <DialogDescription className="text-muted-foreground">
                                                            คุณแน่ใจหรือไม่ที่จะโอนตำแหน่งหัวหน้าครอบครัวให้ <span className="font-bold text-foreground">{selectedMember.discord_name}</span>?
                                                            <br /><br />
                                                            <span className="text-red-400 font-bold">คำเตือน:</span> คุณจะเสียสิทธิ์การจัดการครอบครัวทั้งหมด และกลายเป็นสมาชิกธรรมดาทันที
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <DialogFooter className="gap-2 sm:gap-0">
                                                        <DialogTrigger asChild>
                                                            <Button variant="ghost">ยกเลิก</Button>
                                                        </DialogTrigger>
                                                        <Button
                                                            className="bg-yellow-600 hover:bg-yellow-700 text-white border-none"
                                                            onClick={() => handleTransferLeadership(selectedMember.discord_id)}
                                                            disabled={isTransferring}
                                                        >
                                                            {isTransferring ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                                            ยืนยันโอนตำแหน่ง
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>

                                            <div className="h-px bg-white/5 my-2" />
                                            <p className="text-xs text-muted-foreground">เตะสมาชิกออกจากครอบครัว (ไม่สามารถย้อนกลับได้)</p>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        className="w-full"
                                                        disabled={isKicking}
                                                    >
                                                        {isKicking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
                                                        เตะออกจากครอบครัว
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="bg-background border-red-500/20">
                                                    <DialogHeader>
                                                        <DialogTitle className="text-red-500 flex items-center gap-2">
                                                            <AlertCircle className="w-5 h-5" />
                                                            ยืนยันการเตะสมาชิก
                                                        </DialogTitle>
                                                        <DialogDescription className="text-muted-foreground">
                                                            คุณแน่ใจหรือไม่ที่จะเตะ <span className="font-bold text-foreground">{selectedMember.discord_name}</span> ออกจากครอบครัว?
                                                            สมาชิกจะต้องถูกเชิญใหม่หากต้องการกลับเข้ามา
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <DialogFooter className="gap-2 sm:gap-0">
                                                        <DialogTrigger asChild>
                                                            <Button variant="ghost">ยกเลิก</Button>
                                                        </DialogTrigger>
                                                        <Button
                                                            variant="destructive"
                                                            onClick={() => handleKickMember(selectedMember.discord_id)}
                                                            disabled={isKicking}
                                                        >
                                                            {isKicking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                                            ยืนยันเตะสมาชิก
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    )}
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>

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
                                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                                    รายชื่อสมาชิก
                                    <Badge variant="secondary" className="bg-background/30 text-muted-foreground hover:bg-background/50 border-0">{members.length}</Badge>
                                </h3>
                                <p className="text-muted-foreground text-sm mt-1">โครงสร้างและรายชื่อสมาชิกในครอบครัว</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                    <input
                                        type="text"
                                        placeholder="ค้นหา..."
                                        className="bg-black/20 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-white/10 w-40 sm:w-64 transition-all"
                                    />
                                </div>
                                <Button size="icon" variant="ghost" className="rounded-xl hover:bg-white/5 text-zinc-400">
                                    <Filter className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Content with ScrollArea */}
                        <div className="flex-1 bg-background/20 overflow-hidden relative">
                            <ScrollArea className="h-full w-full">
                                <div className="p-6 pb-12">
                                    <div className="space-y-2">
                                        <div className="grid grid-cols-12 text-xs font-bold text-muted-foreground uppercase tracking-wider px-4 pb-2 sticky top-0 bg-background/40 backdrop-blur-md z-10 rounded-lg mb-2 py-2">
                                            <div className="col-span-6 md:col-span-6">สมาชิก</div>
                                            <div className="col-span-4 md:col-span-4">บทบาท</div>
                                            <div className="col-span-2 md:col-span-2 text-right">เข้าร่วมเมื่อ</div>
                                        </div>
                                        <AnimatePresence>
                                            {members.map((m, i) => (
                                                <motion.div
                                                    key={m.discord_id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.05 }}
                                                    onClick={() => setSelectedMember(m)}
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
                                                            <div className="font-bold text-foreground group-hover:text-primary transition-colors truncate">
                                                                {m.firstname && m.lastname ? `${m.firstname} ${m.lastname}` : m.discord_name}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground truncate">
                                                                @{m.discord_name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-span-4 md:col-span-4">
                                                        <Badge variant="outline" className={`${m.is_leader ? `${theme.bg}/20 ${theme.text} ${theme.border}` : 'bg-background/30 text-muted-foreground border-white/5'}`}>
                                                            {m.is_leader ? 'หัวหน้า' : 'สมาชิก'}
                                                        </Badge>
                                                    </div>
                                                    <div className="col-span-2 md:col-span-2 text-right text-muted-foreground text-xs font-mono">
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
