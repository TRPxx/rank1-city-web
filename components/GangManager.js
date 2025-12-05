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
import { Shield, LogOut, Settings, Search, Filter, Trophy, Loader2, Hexagon, ChevronDown, Copy, Users, ArrowRight, Plus, AlertCircle, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GangManager({ userData }) {
    const { data: session } = useSession();
    const [gang, setGang] = useState(null);
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
    const [settingsName, setSettingsName] = useState('');
    const [settingsMotd, setSettingsMotd] = useState('');

    // Join Request States
    const [pendingRequests, setPendingRequests] = useState([]);
    const [myPendingRequests, setMyPendingRequests] = useState([]);
    const [processingRequest, setProcessingRequest] = useState(null);

    useEffect(() => {
        if (gang) {
            setSettingsName(gang.name);
            setSettingsMotd(gang.motd || '');
        }
    }, [gang]);

    // Dynamic Theme based on member count milestones
    const getGangTierTheme = (memberCount) => {
        if (memberCount >= 25) {
            // 🔴 Legendary - Red/Crimson
            return {
                from: 'from-red-500',
                to: 'to-rose-600',
                shadow: 'shadow-red-500/40',
                tierName: 'ตำนาน',
                tierColor: 'text-red-400'
            };
        } else if (memberCount >= 20) {
            // 🟠 Epic - Orange/Gold
            return {
                from: 'from-amber-500',
                to: 'to-orange-600',
                shadow: 'shadow-amber-500/40',
                tierName: 'อิทธิพล',
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
                tierName: 'ก่อร่าง',
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

    const tierTheme = getGangTierTheme(members.length);

    // Theme Configuration (Primary/Blue - Matching InviteEarn)
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
        fetchGangData();
        const interval = setInterval(fetchGangData, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchGangData = async () => {
        try {
            const res = await fetch(`/api/gang?_=${Date.now()}`, { cache: 'no-store' });
            const data = await res.json();

            if (data.gang) {
                setGang(data.gang);
                setInviteCode(data.gang.invite_code);
                setMembers(data.members || []);
                setLogoUrl(data.gang.logo_url || '');
                setPendingRequests(data.pendingRequests || []);
                setMyPendingRequests([]);
            } else {
                setGang(null);
                setMembers([]);
                setPendingRequests([]);
                setMyPendingRequests(data.myPendingRequests || []);
            }
        } catch (error) {
            console.error('Error fetching gang:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateGang = async (e) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            const res = await fetch('/api/gang', {
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
                toast.success('สร้างแก๊งสำเร็จ!');
                // Clear form fields
                setCreateName('');
                setCreateLogo('');
                // Set gang state directly from API response if available
                if (data.gang) {
                    setGang(data.gang);
                    setInviteCode(data.gang.invite_code || '');
                    setMembers(data.members || []);
                    setLogoUrl(data.gang.logo_url || '');
                    setLoading(false);
                } else {
                    // Fallback: fetch gang data
                    setLoading(true);
                    await fetchGangData();
                }
            } else {
                toast.error(data.error || 'Failed to create gang');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setIsCreating(false);
        }
    };

    const handleJoinGang = async (e) => {
        e.preventDefault();
        setIsJoining(true);
        try {
            const res = await fetch('/api/gang', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'join', inviteCode: joinCode }),
            });

            const data = await res.json();
            if (res.ok) {
                if (data.pending) {
                    toast.success(data.message || 'ส่งคำขอเข้าร่วมสำเร็จ! กรุณารอหัวหน้าอนุมัติ');
                } else {
                    toast.success('เข้าร่วมแก๊งสำเร็จ!');
                }
                setJoinCode('');
                fetchGangData();
            } else {
                toast.error(data.error || 'Failed to join gang');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setIsJoining(false);
        }
    };

    const handleApproveRequest = async (requestId) => {
        setProcessingRequest(requestId);
        try {
            const res = await fetch('/api/gang', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'approve_join', requestId }),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success('อนุมัติคำขอเข้าร่วมแล้ว!');
                fetchGangData();
            } else {
                toast.error(data.error || 'ไม่สามารถอนุมัติได้');
            }
        } catch (error) {
            toast.error('เกิดข้อผิดพลาด');
        } finally {
            setProcessingRequest(null);
        }
    };

    const handleRejectRequest = async (requestId) => {
        setProcessingRequest(requestId);
        try {
            const res = await fetch('/api/gang', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'reject_join', requestId }),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success('ปฏิเสธคำขอแล้ว');
                fetchGangData();
            } else {
                toast.error(data.error || 'ไม่สามารถปฏิเสธได้');
            }
        } catch (error) {
            toast.error('เกิดข้อผิดพลาด');
        } finally {
            setProcessingRequest(null);
        }
    };

    const handleCancelRequest = async (gangId) => {
        try {
            const res = await fetch('/api/gang', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'cancel_request', gangId }),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success('ยกเลิกคำขอแล้ว');
                fetchGangData();
            } else {
                toast.error(data.error || 'ไม่สามารถยกเลิกได้');
            }
        } catch (error) {
            toast.error('เกิดข้อผิดพลาด');
        }
    };

    const handleUpdateLogo = async () => {
        setIsEditingLogo(true);
        try {
            const res = await fetch('/api/gang', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'update_logo', logoUrl }),
            });

            if (res.ok) {
                toast.success('อัพเดทโลโก้สำเร็จ!');
                // Update gang state immediately with new logo
                setGang(prev => prev ? { ...prev, logo_url: logoUrl } : prev);
                // Then fetch fresh data
                await fetchGangData();
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

    const handleLeaveGang = async () => {
        setIsLeaving(true);
        try {
            const res = await fetch('/api/gang', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'leave' }),
            });

            const data = await res.json();
            if (res.ok) {
                toast.success('Left gang successfully');
                fetchGangData();
            } else {
                toast.error(data.error || 'Failed to leave gang');
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
            const res = await fetch('/api/gang', {
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
                toast.success('Settings updated successfully');
                fetchGangData();
            } else {
                toast.error(data.error || 'Failed to update settings');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setIsUpdatingSettings(false);
        }
    };

    const handleDissolveGang = async () => {
        setIsDissolving(true);
        try {
            const res = await fetch('/api/gang', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'dissolve' }),
            });

            const data = await res.json();
            if (res.ok) {
                toast.success('Gang dissolved successfully');
                fetchGangData();
            } else {
                toast.error(data.error || 'Failed to dissolve gang');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setIsDissolving(false);
        }
    };

    const copyInviteCode = () => {
        if (gang?.invite_code) {
            navigator.clipboard.writeText(gang.invite_code);
            toast.success('คัดลอกรหัสเชิญแล้ว!');
        }
    };

    const handleKickMember = async (targetDiscordId) => {
        setIsKicking(true);
        try {
            const res = await fetch('/api/gang', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'kick_member', targetDiscordId }),
            });

            const data = await res.json();
            if (res.ok) {
                toast.success('สมาชิกถูกเตะออกจากแก๊งแล้ว');
                setSelectedMember(null); // Close dialog
                setLoading(true);
                await fetchGangData(); // Refresh data
            } else {
                toast.error(data.error || 'Failed to kick member');
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

    if (!gang) {
        return (
            <div className="h-full w-full p-4 lg:p-8 flex items-center justify-center">
                <div className="w-full h-full max-h-[800px] overflow-hidden rounded-[2rem] border border-border/50 bg-background shadow-2xl grid lg:grid-cols-2">

                    {/* Left Side: Hero Section */}
                    <div className="relative hidden lg:flex flex-col justify-between bg-muted/10 p-10 text-foreground dark:border-r">
                        <div className="absolute inset-0 bg-[url('/images/gang-hero.png')] bg-cover bg-center opacity-40" />
                        <div className="relative z-20 flex items-center text-lg font-medium">
                            <Shield className="mr-2 h-6 w-6 text-primary" />
                            Rank1 City Gangs
                        </div>
                        <div className="relative z-20 mt-auto">
                            <blockquote className="space-y-2">
                                <p className="text-lg">
                                    &ldquo;อำนาจไม่ใช่สิ่งที่ใครจะมอบให้ คุณต้องคว้ามันมาเอง สร้างตำนาน รวบรวมพรรคพวก และปกครองถนนแห่ง Rank1 City&rdquo;
                                </p>
                                <footer className="text-sm text-muted-foreground">เดอะ ก็อดฟาเธอร์</footer>
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

                            <Tabs defaultValue={myPendingRequests.length > 0 ? "pending" : "join"} className="w-full">
                                <TabsList className={`grid w-full ${myPendingRequests.length > 0 ? 'grid-cols-3' : 'grid-cols-2'} mb-6`}>
                                    {myPendingRequests.length > 0 && (
                                        <TabsTrigger value="pending" className="relative">
                                            รอการอนุมัติ
                                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full text-[10px] font-bold flex items-center justify-center text-white">
                                                {myPendingRequests.length}
                                            </span>
                                        </TabsTrigger>
                                    )}
                                    <TabsTrigger value="join">เข้าร่วมแก๊ง</TabsTrigger>
                                    <TabsTrigger value="create">สร้างแก๊ง</TabsTrigger>
                                </TabsList>

                                {/* Tab แสดงคำขอที่รอดำเนินการ */}
                                {myPendingRequests.length > 0 && (
                                    <TabsContent value="pending" className="space-y-4">
                                        <div className="text-center mb-4">
                                            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                                                <Loader2 className="w-4 h-4 mr-2 text-amber-500 animate-spin" />
                                                <span className="text-sm text-amber-500">รอหัวหน้าแก๊งอนุมัติ</span>
                                            </div>
                                        </div>

                                        {myPendingRequests.map((request) => (
                                            <div key={request.id} className="p-4 rounded-xl bg-muted/30 border border-amber-500/20">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-medium">{request.gang_name}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            ส่งเมื่อ {new Date(request.created_at).toLocaleString('th-TH')}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="border-red-500/30 text-red-500 hover:bg-red-500/10"
                                                        onClick={() => handleCancelRequest(request.gang_id)}
                                                    >
                                                        ยกเลิก
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </TabsContent>
                                )}

                                <TabsContent value="join" className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            รหัสเชิญ
                                        </label>
                                        <Input
                                            placeholder="GANG-XXXX"
                                            value={joinCode}
                                            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                            className="font-mono uppercase text-center tracking-widest h-11"
                                        />
                                    </div>
                                    <Button
                                        className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                                        onClick={handleJoinGang}
                                        disabled={!joinCode || isJoining}
                                    >
                                        {isJoining ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Users className="mr-2 h-4 w-4" />}
                                        ขอเข้าร่วมแก๊ง
                                    </Button>
                                    <p className="text-xs text-center text-muted-foreground">
                                        หลังกดขอเข้าร่วม หัวหน้าแก๊งจะต้องอนุมัติก่อน
                                    </p>
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
                                        className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                                        onClick={handleCreateGang}
                                        disabled={!createName || isCreating}
                                    >
                                        {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                                        สร้างแก๊ง
                                    </Button>
                                </TabsContent>
                            </Tabs>

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
                                    {gang.logo_url ? (
                                        <img
                                            src={gang.logo_url}
                                            alt={gang.name}
                                            className="w-full h-full object-cover group-hover/avatar:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${theme.from}/20 ${theme.to}/20`}>
                                            <span className="text-3xl font-bold text-white/80">
                                                {gang.name.substring(0, 2).toUpperCase()}
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

                            {/* Leader Crown Badge */}
                            {isLeader && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-yellow-500/50 blur-md rounded-full" />
                                        <div className="relative bg-gradient-to-r from-yellow-400 to-amber-500 text-black p-1.5 rounded-full shadow-lg">
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Edit Button */}
                            {isLeader && (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            size="icon"
                                            variant="secondary"
                                            className="absolute -bottom-2 -right-2 h-9 w-9 rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border-2 border-background opacity-0 group-hover/avatar:opacity-100 transition-all duration-200 hover:scale-110"
                                        >
                                            <Settings className="w-4 h-4" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="bg-zinc-900/95 backdrop-blur-xl border-white/10">
                                        <DialogHeader>
                                            <DialogTitle className="flex items-center gap-2">
                                                <div className="p-2 rounded-lg bg-primary/10">
                                                    <Shield className="w-5 h-5 text-primary" />
                                                </div>
                                                อัพเดทโลโก้แก๊ง
                                            </DialogTitle>
                                            <DialogDescription>ใส่ลิงก์รูปภาพสำหรับโลโก้แก๊งของคุณ</DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            {/* Logo Preview */}
                                            <div className="flex justify-center">
                                                <div className={`w-24 h-24 rounded-xl p-[2px] bg-gradient-to-br ${theme.from} ${theme.to}`}>
                                                    <div className="w-full h-full rounded-[10px] overflow-hidden bg-zinc-800 flex items-center justify-center">
                                                        {logoUrl ? (
                                                            <img src={logoUrl} alt="Preview" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span className="text-zinc-500 text-sm">ตัวอย่าง</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <Input
                                                value={logoUrl}
                                                onChange={(e) => setLogoUrl(e.target.value)}
                                                placeholder="https://example.com/logo.png"
                                                className="bg-black/50 border-white/10 focus:border-primary/50"
                                            />
                                            <p className="text-xs text-zinc-500 text-center">
                                                💡 แนะนำขนาด: 512x512px (สัดส่วน 1:1) เพื่อความสวยงาม
                                            </p>
                                        </div>
                                        <DialogFooter>
                                            <Button onClick={handleUpdateLogo} disabled={isEditingLogo} className={`bg-gradient-to-r ${theme.from} ${theme.to} hover:opacity-90 text-white`}>
                                                {isEditingLogo ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                                {isEditingLogo ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>

                        <h2 className="text-2xl font-bold text-foreground mb-1 tracking-tight">{gang.name}</h2>
                        <div
                            onClick={copyInviteCode}
                            className="relative z-10 flex items-center justify-center gap-2 text-muted-foreground text-sm mb-6 bg-background/30 py-1 px-3 rounded-full mx-auto w-fit border border-white/5 cursor-pointer hover:bg-background/50 transition-colors"
                        >
                            <span className="font-mono">{gang.invite_code}</span>
                            <Copy className="w-3 h-3" />
                        </div>

                        <div className="grid grid-cols-1 gap-3 mb-6">
                            <div className="bg-background/30 rounded-xl p-3 border border-white/5">
                                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Members</div>
                                <div className="text-lg font-bold text-foreground">{members.length}</div>
                            </div>
                        </div>

                        {isLeader ? (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className={`w-full rounded-xl bg-gradient-to-r ${theme.from} ${theme.to} text-white font-semibold shadow-lg shadow-black/20 hover:opacity-90 transition-opacity`}>
                                        จัดการแก๊ง
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-zinc-950/95 backdrop-blur-xl border-white/10 max-w-2xl max-h-[85vh] overflow-hidden flex flex-col p-0">
                                    <div className="p-6 border-b border-white/10">
                                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                                            <Settings className="w-6 h-6 text-zinc-400" />
                                            ศูนย์บัญชาการ
                                        </DialogTitle>
                                        <DialogDescription>
                                            จัดการการตั้งค่าแก๊ง
                                        </DialogDescription>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                        <div className="space-y-4">
                                            <div className="grid gap-2">
                                                <Label>ชื่อแก๊ง</Label>
                                                <Input
                                                    value={settingsName}
                                                    onChange={(e) => setSettingsName(e.target.value)}
                                                    className="bg-black/20 border-white/10"
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>ประกาศแก๊ง (MOTD)</Label>
                                                <Textarea
                                                    value={settingsMotd}
                                                    onChange={(e) => setSettingsMotd(e.target.value)}
                                                    placeholder="เขียนข้อความถึงสมาชิกของคุณ..."
                                                    className="bg-black/20 border-white/10 min-h-[100px]"
                                                />
                                                <p className="text-xs text-zinc-500">ข้อความนี้จะถูกปักหมุดไว้ด้านบนของแชทสมาชิก</p>
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
                                            <p className="text-xs text-zinc-400">การกระทำที่ไม่สามารถย้อนกลับได้</p>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        className="w-full"
                                                        disabled={isDissolving}
                                                    >
                                                        {isDissolving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                                        ยุบแก๊ง
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="bg-zinc-950 border-red-500/20">
                                                    <DialogHeader>
                                                        <DialogTitle className="text-red-500 flex items-center gap-2">
                                                            <AlertCircle className="w-5 h-5" />
                                                            ยืนยันการยุบแก๊ง
                                                        </DialogTitle>
                                                        <DialogDescription className="text-zinc-400">
                                                            การกระทำนี้ไม่สามารถย้อนกลับได้ สมาชิกทั้งหมดจะถูกเตะออกและข้อมูลแก๊งจะถูกลบถาวร
                                                            คุณแน่ใจหรือไม่ที่จะดำเนินการต่อ?
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <DialogFooter className="gap-2 sm:gap-0">
                                                        <DialogTrigger asChild>
                                                            <Button variant="ghost">ยกเลิก</Button>
                                                        </DialogTrigger>
                                                        <Button
                                                            variant="destructive"
                                                            onClick={handleDissolveGang}
                                                            disabled={isDissolving}
                                                        >
                                                            {isDissolving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                                            ยืนยันยุบแก๊ง
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
                                <DialogContent className="bg-zinc-950/95 backdrop-blur-xl border-white/10">
                                    <DialogHeader>
                                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                            <Shield className="w-5 h-5 text-blue-400" />
                                            ข้อมูลแก๊ง
                                        </DialogTitle>
                                        <DialogDescription>
                                            รายละเอียดและประกาศจากหัวหน้าแก๊ง
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-6 py-4">
                                        <div className="space-y-2">
                                            <Label className="text-zinc-400">ชื่อแก๊ง</Label>
                                            <div className="text-lg font-bold text-white">{gang.name}</div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-zinc-400">ประกาศ (MOTD)</Label>
                                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-zinc-300 min-h-[100px] text-sm leading-relaxed whitespace-pre-wrap">
                                                {gang.motd || "ยังไม่มีประกาศจากหัวหน้าแก๊ง"}
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

                    {/* Pending Join Requests - สำหรับหัวหน้าแก๊งเท่านั้น */}
                    {isLeader && pendingRequests.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`${theme.glass} p-6 rounded-[2rem] border shadow-xl`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                                        <Users className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">คำขอเข้าร่วม</h3>
                                        <p className="text-xs text-zinc-400">{pendingRequests.length} คำขอรอดำเนินการ</p>
                                    </div>
                                </div>
                                <span className="w-6 h-6 bg-amber-500 rounded-full text-[12px] font-bold flex items-center justify-center text-white animate-pulse">
                                    {pendingRequests.length}
                                </span>
                            </div>

                            <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                                {pendingRequests.map((request) => (
                                    <div key={request.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 border border-amber-500/20">
                                        <div className="flex items-center gap-3">
                                            {request.avatar_url ? (
                                                <img src={request.avatar_url} alt="" className="w-10 h-10 rounded-full" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-sm font-bold">
                                                    {request.discord_name?.slice(0, 2).toUpperCase() || '??'}
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-medium text-sm">{request.discord_name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(request.created_at).toLocaleDateString('th-TH')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                className="bg-green-600 hover:bg-green-700 text-white h-8 px-3"
                                                onClick={() => handleApproveRequest(request.id)}
                                                disabled={processingRequest === request.id}
                                            >
                                                {processingRequest === request.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    '✓'
                                                )}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="border-red-500/30 text-red-400 hover:bg-red-500/10 h-8 px-3"
                                                onClick={() => handleRejectRequest(request.id)}
                                                disabled={processingRequest === request.id}
                                            >
                                                ✕
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

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
                                    <span className="font-medium">Leave Gang</span>
                                </motion.button>
                            </DialogTrigger>
                            <DialogContent className="bg-zinc-950 border-white/10">
                                <DialogHeader>
                                    <DialogTitle className="text-white flex items-center gap-2">
                                        <LogOut className="w-5 h-5 text-red-400" />
                                        ออกจากแก๊ง
                                    </DialogTitle>
                                    <DialogDescription className="text-zinc-400">
                                        คุณแน่ใจหรือไม่ที่จะออกจากแก๊งนี้? คุณจะต้องได้รับเชิญใหม่หากต้องการกลับเข้ามาอีกครั้ง
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="gap-2 sm:gap-0">
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" className="text-zinc-400 hover:text-white">ยกเลิก</Button>
                                    </DialogTrigger>
                                    <Button
                                        variant="destructive"
                                        onClick={handleLeaveGang}
                                        disabled={isLeaving}
                                    >
                                        {isLeaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                        ยืนยันออกจากแก๊ง
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
                                            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">รางวัลแก๊ง</h3>
                                            <p className="text-muted-foreground text-sm">เลเวล {gang.level || 1} • {members.length}/{gang.max_members || 25} สมาชิก</p>
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
                            <DialogContent className="bg-zinc-950/98 backdrop-blur-xl border-white/10 max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                                        <div className={`p-2 rounded-xl bg-gradient-to-br ${theme.from} ${theme.to}`}>
                                            <Trophy className="w-6 h-6 text-white" />
                                        </div>
                                        ความคืบหน้ารางวัลแก๊ง
                                    </DialogTitle>
                                    <DialogDescription>
                                        ชวนสมาชิกเพิ่มเพื่อปลดล็อกสิทธิพิเศษและรางวัลของแก๊ง
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="py-8 px-4">
                                    {/* Current Stats */}
                                    <div className="flex items-center justify-between mb-12">
                                        <div className="text-center">
                                            <div className={`text-4xl font-bold bg-gradient-to-r ${theme.from} ${theme.to} bg-clip-text text-transparent`}>
                                                {members.length}
                                            </div>
                                            <div className="text-xs text-zinc-500 uppercase tracking-wider mt-1">สมาชิกปัจจุบัน</div>
                                        </div>
                                        <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${theme.from}/20 ${theme.to}/20 border ${theme.border}`}>
                                            <span className={`font-bold ${theme.tierColor}`}>{theme.tierName}</span>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-4xl font-bold text-zinc-600">{gang.max_members || 25}</div>
                                            <div className="text-xs text-zinc-500 uppercase tracking-wider mt-1">เป้าหมายสูงสุด</div>
                                        </div>
                                    </div>

                                    {/* Progress Bar Container */}
                                    <div className="relative h-3 bg-zinc-800/50 rounded-full mb-16 mx-2">
                                        {/* Progress Fill with Glow */}
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(members.length / (gang.max_members || 25)) * 100}%` }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className={`absolute top-0 left-0 h-full rounded-full bg-gradient-to-r ${theme.from} ${theme.to}`}
                                            style={{ boxShadow: `0 0 20px rgba(59,130,246,0.5)` }}
                                        />

                                        {/* Milestones */}
                                        {[
                                            { value: 10, tier: 'ก่อร่าง', color: 'emerald' },
                                            { value: 15, tier: 'เติบโต', color: 'purple' },
                                            { value: 20, tier: 'อิทธิพล', color: 'amber' },
                                            { value: 25, tier: 'ตำนาน', color: 'red' }
                                        ].map(({ value: milestone, tier, color }) => {
                                            const isUnlocked = members.length >= milestone;
                                            const position = (milestone / (gang.max_members || 25)) * 100;

                                            const colorClasses = {
                                                emerald: { bg: 'bg-emerald-500', border: 'border-emerald-400', text: 'text-emerald-400', glow: 'shadow-emerald-500/50' },
                                                purple: { bg: 'bg-purple-500', border: 'border-purple-400', text: 'text-purple-400', glow: 'shadow-purple-500/50' },
                                                amber: { bg: 'bg-amber-500', border: 'border-amber-400', text: 'text-amber-400', glow: 'shadow-amber-500/50' },
                                                red: { bg: 'bg-red-500', border: 'border-red-400', text: 'text-red-400', glow: 'shadow-red-500/50' },
                                            }[color];

                                            return (
                                                <div
                                                    key={milestone}
                                                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center group cursor-pointer"
                                                    style={{ left: `${position}%` }}
                                                >
                                                    {/* Milestone Dot */}
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ delay: 0.5 + milestone * 0.05 }}
                                                        className={`w-5 h-5 rounded-full border-2 transition-all duration-500 z-10 ${isUnlocked
                                                            ? `${colorClasses.bg} ${colorClasses.border} shadow-lg ${colorClasses.glow}`
                                                            : 'bg-zinc-800 border-zinc-600'
                                                            }`}
                                                    />

                                                    {/* Label Below */}
                                                    <div className={`absolute top-8 whitespace-nowrap text-xs font-bold transition-colors duration-300 ${isUnlocked ? colorClasses.text : 'text-zinc-600'
                                                        }`}>
                                                        {milestone}
                                                    </div>

                                                    {/* Tier Name Above */}
                                                    <div className={`absolute -top-8 whitespace-nowrap text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${isUnlocked ? colorClasses.text : 'text-zinc-600'
                                                        }`}>
                                                        {tier}
                                                    </div>

                                                    {/* Hover Tooltip */}
                                                    <div className="absolute top-12 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-zinc-900 border border-white/10 px-3 py-2 rounded-xl text-xs text-white whitespace-nowrap pointer-events-none z-20 shadow-xl">
                                                        <div className="font-bold mb-1">{tier}</div>
                                                        <div className={`${isUnlocked ? 'text-green-400' : 'text-zinc-400'}`}>
                                                            {isUnlocked ? '✓ ปลดล็อกแล้ว' : `ต้องการ ${milestone} สมาชิก`}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Current Progress Info */}
                                    <div className={`p-4 rounded-2xl border ${theme.border} bg-gradient-to-r ${theme.from}/5 ${theme.to}/5`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${theme.from} ${theme.to} flex items-center justify-center`}>
                                                    <Shield className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <div className="text-sm text-zinc-400">ระดับปัจจุบัน</div>
                                                    <div className={`font-bold ${theme.tierColor}`}>{theme.tierName}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm text-zinc-400">ความคืบหน้า</div>
                                                <div className="font-bold text-white">
                                                    {Math.round((members.length / (gang.max_members || 25)) * 100)}%
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Member Detail Dialog */}
                    <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
                        <DialogContent className="bg-zinc-950/95 backdrop-blur-xl border-white/10 max-w-md">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                                    <Users className="w-6 h-6 text-primary" />
                                    ข้อมูลสมาชิก
                                </DialogTitle>
                                <DialogDescription>
                                    รายละเอียดและการจัดการสมาชิกในแก๊ง
                                </DialogDescription>
                            </DialogHeader>

                            {selectedMember && (
                                <div className="space-y-6 py-4">
                                    {/* Member Avatar & Name */}
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-20 w-20 ring-2 ring-primary/20">
                                            <AvatarImage src={selectedMember.avatar_url} />
                                            <AvatarFallback className="bg-zinc-800 text-zinc-400 text-2xl font-bold">
                                                {selectedMember.discord_name[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-white">
                                                {selectedMember.firstname && selectedMember.lastname
                                                    ? `${selectedMember.firstname} ${selectedMember.lastname}`
                                                    : selectedMember.discord_name}
                                            </h3>
                                            <p className="text-sm text-zinc-400">@{selectedMember.discord_name}</p>
                                            <Badge variant="outline" className={`mt-1 ${selectedMember.is_leader ? `${theme.bg}/20 ${theme.text} ${theme.border}` : 'bg-background/30 text-muted-foreground border-white/5'}`}>
                                                {selectedMember.is_leader ? 'Leader' : 'Member'}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Member Info */}
                                    <div className="space-y-3">
                                        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                            <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Discord Username</div>
                                            <div className="text-sm text-zinc-300">@{selectedMember.discord_name}</div>
                                            <div className="text-xs text-zinc-500 font-mono mt-1">ID: {selectedMember.discord_id}</div>
                                        </div>
                                        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                            <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">วันที่เข้าร่วม</div>
                                            <div className="text-sm text-zinc-300">{new Date(selectedMember.joined_at).toLocaleString('th-TH')}</div>
                                        </div>
                                    </div>

                                    {/* Leader Actions */}
                                    {isLeader && !selectedMember.is_leader && (
                                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 space-y-3">
                                            <h4 className="text-red-400 font-bold flex items-center gap-2 text-sm">
                                                <Shield className="w-4 h-4" /> การจัดการสมาชิก
                                            </h4>
                                            <p className="text-xs text-zinc-400">เตะสมาชิกออกจากแก๊ง (ไม่สามารถย้อนกลับได้)</p>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        className="w-full"
                                                        disabled={isKicking}
                                                    >
                                                        {isKicking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
                                                        เตะออกจากแก๊ง
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="bg-zinc-950 border-red-500/20">
                                                    <DialogHeader>
                                                        <DialogTitle className="text-red-500 flex items-center gap-2">
                                                            <AlertCircle className="w-5 h-5" />
                                                            ยืนยันการเตะสมาชิก
                                                        </DialogTitle>
                                                        <DialogDescription className="text-zinc-400">
                                                            คุณแน่ใจหรือไม่ที่จะเตะ <span className="font-bold text-white">{selectedMember.discord_name}</span> ออกจากแก๊ง?
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
                                    Team Members
                                    <Badge variant="secondary" className="bg-background/30 text-muted-foreground hover:bg-background/50 border-0">{members.length}</Badge>
                                </h3>
                                <p className="text-muted-foreground text-sm mt-1">Gang hierarchy and roster</p>
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
                        <div className="flex-1 bg-background/20 overflow-hidden relative">
                            <ScrollArea className="h-full w-full">
                                <div className="p-6 pb-12">
                                    <div className="space-y-2">
                                        <div className="grid grid-cols-12 text-xs font-bold text-muted-foreground uppercase tracking-wider px-4 pb-2 sticky top-0 bg-background/40 backdrop-blur-md z-10 rounded-lg mb-2 py-2">
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
                                                            {m.is_leader ? 'Leader' : 'Member'}
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
