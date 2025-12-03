'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Users, Shield, Copy, LogOut, Crown, Plus, ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FamilyManager() {
    const [FamilyData, setFamilyData] = useState(null);
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
            const res = await fetch('/api/Family');
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

    const fetchMembers = async (FamilyCode) => {
        setIsMembersLoading(true);
        try {
            const res = await fetch(`/api/Family/members?FamilyCode=${FamilyCode}`);
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
        if (FamilyData?.Family_code) {
            fetchMembers(FamilyData.Family_code);
        }
    }, [FamilyData]);

    const handleAction = async (action) => {
        setError('');
        setIsActionLoading(true);
        try {
            const res = await fetch('/api/Family', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action,
                    name: createName,
                    FamilyCode: joinCode
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
        if (FamilyData?.Family_code) {
            navigator.clipboard.writeText(FamilyData.Family_code);
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

    // View: Already in Family
    if (FamilyData) {
        return (
            <div className="max-w-6xl mx-auto h-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full"
                >

                    {/* Left Column: Family Info (Premium Card) */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-2xl">
                            {/* Decorative Background */}
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                            <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-rose-500/10 to-transparent"></div>

                            <div className="relative p-8 flex flex-col items-center text-center">
                                <div className="mb-6 relative">
                                    <div className="absolute inset-0 bg-rose-500 blur-3xl opacity-20 rounded-full"></div>
                                    <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-br from-rose-400 to-pink-600 p-[2px] shadow-2xl shadow-rose-500/20">
                                        <div className="w-full h-full rounded-[22px] bg-slate-950 flex items-center justify-center">
                                            <span className="text-5xl">👨‍👩‍👧‍👦</span>
                                        </div>
                                    </div>
                                    <Badge className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-rose-500 text-white hover:bg-rose-400 border-0 px-3 py-1 shadow-lg font-bold">
                                        LVL. 1
                                    </Badge>
                                </div>

                                <h2 className="text-3xl font-bold tracking-tight text-white mb-2">{FamilyData.name}</h2>
                                <div className="flex items-center gap-2 text-slate-400 text-sm mb-8">
                                    <Shield className="w-4 h-4" />
                                    <span>ครอบครัวอย่างเป็นทางการ</span>
                                </div>

                                <div className="grid grid-cols-2 gap-3 w-full">
                                    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-800">
                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">สมาชิก</div>
                                        <div className="text-2xl font-bold text-white flex items-baseline justify-center gap-1">
                                            {FamilyData.member_count}
                                            <span className="text-sm font-normal text-slate-500">/{FamilyData.max_members}</span>
                                        </div>
                                    </div>
                                    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-800">
                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">สถานะ</div>
                                        <div className="text-lg font-bold text-emerald-400 flex items-center justify-center gap-1">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                            Active
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Family Code Card */}
                        <div className="rounded-[2rem] bg-slate-900/50 border border-slate-800 p-6 backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500">
                                        <Copy className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">รหัสเชิญเข้าครอบครัว</h3>
                                        <p className="text-xs text-slate-400">ส่งรหัสนี้ให้เพื่อนของคุณ</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-950 rounded-xl p-2 pl-4 border border-slate-800 group hover:border-rose-500/50 transition-colors">
                                <code className="flex-1 font-mono text-lg font-bold text-rose-500 tracking-wider text-center">
                                    {FamilyData.Family_code}
                                </code>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-10 w-10 rounded-lg hover:bg-rose-500 hover:text-white transition-all"
                                    onClick={copyFamilyCode}
                                >
                                    {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Member List */}
                    <div className="lg:col-span-8 flex flex-col rounded-[2.5rem] bg-slate-900/30 border border-slate-800/50 backdrop-blur-md overflow-hidden min-h-[600px]">
                        <div className="p-6 border-b border-slate-800/50 bg-slate-900/20 flex items-center justify-between backdrop-blur-xl sticky top-0 z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400">
                                    <Users className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-white">สมาชิกครอบครัว</h3>
                                    <p className="text-xs text-slate-400">จัดการและดูข้อมูลสมาชิกในครอบครัว</p>
                                </div>
                            </div>
                            <Badge variant="outline" className="bg-slate-950/50 border-slate-800 text-slate-400">
                                {members.length} คน
                            </Badge>
                        </div>

                        <div className="flex-1 p-4 space-y-2">
                            {isMembersLoading ? (
                                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-rose-500 blur-xl opacity-20 rounded-full"></div>
                                        <Loader2 className="w-10 h-10 animate-spin text-rose-500 relative z-10" />
                                    </div>
                                    <p className="text-sm text-slate-400 animate-pulse">กำลังโหลดข้อมูลสมาชิก...</p>
                                </div>
                            ) : members.length > 0 ? (
                                <AnimatePresence>
                                    {members.map((member, idx) => (
                                        <motion.div
                                            key={member.discord_id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-800/50 border border-transparent hover:border-slate-700 transition-all duration-200"
                                        >
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${idx === 0 ? 'bg-rose-500/20 text-rose-500' :
                                                idx === 1 ? 'bg-slate-300/20 text-slate-300' :
                                                    idx === 2 ? 'bg-orange-700/20 text-orange-700' :
                                                        'bg-slate-800 text-slate-500'
                                                }`}>
                                                #{idx + 1}
                                            </div>

                                            <div className="relative">
                                                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 ring-2 ring-slate-800 group-hover:ring-rose-500/50 transition-all">
                                                    {member.avatar_url ? (
                                                        <img src={member.avatar_url} alt={member.discord_name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-slate-800">
                                                            <Users className="w-5 h-5 text-slate-500" />
                                                        </div>
                                                    )}
                                                </div>
                                                {member.is_leader && (
                                                    <div className="absolute -top-1 -right-1 bg-rose-500 text-white p-1 rounded-full shadow-lg ring-2 ring-slate-900">
                                                        <Crown className="w-3 h-3" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <h4 className="font-bold text-slate-200 truncate group-hover:text-rose-400 transition-colors">
                                                        {member.discord_name || 'Unknown'}
                                                    </h4>
                                                    {member.is_leader && (
                                                        <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20 text-[10px] px-1.5 py-0 h-5">
                                                            HEAD
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-xs text-slate-500 font-mono truncate">{member.discord_id}</p>
                                            </div>

                                            <div className="text-right px-2">
                                                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">เข้าร่วมเมื่อ</p>
                                                <p className="text-xs font-medium text-slate-300">
                                                    {new Date(member.joined_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
                                    <div className="w-16 h-16 rounded-3xl bg-slate-800 flex items-center justify-center">
                                        <Users className="w-8 h-8 text-slate-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-slate-400">ยังไม่มีสมาชิก</h3>
                                        <p className="text-sm text-slate-600">แชร์รหัสครอบครัวเพื่อเชิญเพื่อนของคุณ</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </motion.div>
            </div>
        );
    }

    // View: Create or Join
    return (
        <div className="max-w-4xl mx-auto py-12">
            <div className="text-center mb-12 space-y-4">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-20 h-20 mx-auto bg-gradient-to-br from-rose-400 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-rose-500/20 mb-6"
                >
                    <Users className="w-10 h-10 text-white" />
                </motion.div>
                <h2 className="text-4xl font-bold tracking-tight text-white">ระบบครอบครัว</h2>
                <p className="text-lg text-slate-400 max-w-lg mx-auto">
                    สร้างครอบครัวที่อบอุ่น หรือเข้าร่วมกับครอบครัวอื่นเพื่อมิตรภาพที่ยั่งยืน
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Join Card */}
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="group relative overflow-hidden rounded-[2.5rem] bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-all duration-300"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="p-8 relative">
                        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center mb-6 text-rose-500 group-hover:scale-110 transition-transform">
                            <Users className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">เข้าร่วมครอบครัว</h3>
                        <p className="text-slate-400 text-sm mb-8">
                            หากคุณมีรหัสเชิญจากหัวหน้าครอบครัว สามารถกรอกเพื่อเข้าร่วมได้ทันที
                        </p>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">รหัสครอบครัว</label>
                                <Input
                                    placeholder="FAM-XXXXXX"
                                    value={joinCode}
                                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                    className="h-14 rounded-2xl bg-slate-950/50 border-slate-800 focus:border-rose-500/50 focus:ring-rose-500/20 text-lg font-mono text-center uppercase tracking-widest"
                                />
                            </div>
                            <Button
                                className="w-full h-14 rounded-2xl text-base font-bold bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/20"
                                onClick={() => handleAction('join')}
                                disabled={!joinCode || isActionLoading}
                            >
                                {isActionLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <ArrowRight className="mr-2 h-5 w-5" />}
                                เข้าร่วมครอบครัว
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* Create Card */}
                <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="group relative overflow-hidden rounded-[2.5rem] bg-slate-900/40 border border-slate-800 hover:border-rose-500/30 transition-all duration-300"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="p-8 relative">
                        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center mb-6 text-rose-500 group-hover:scale-110 transition-transform">
                            <Plus className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">สร้างครอบครัวใหม่</h3>
                        <p className="text-slate-400 text-sm mb-8">
                            ก่อตั้งครอบครัวของคุณเอง รับสมัครสมาชิก และสร้างความทรงจำดีๆ
                        </p>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">ชื่อครอบครัว</label>
                                <Input
                                    placeholder="ตั้งชื่อครอบครัวของคุณ"
                                    value={createName}
                                    onChange={(e) => setCreateName(e.target.value)}
                                    maxLength={20}
                                    className="h-14 rounded-2xl bg-slate-950/50 border-slate-800 focus:border-rose-500/50 focus:ring-rose-500/20 text-lg text-center"
                                />
                                <div className="text-right text-[10px] text-slate-600 font-mono">
                                    {createName.length}/20
                                </div>
                            </div>
                            <Button
                                className="w-full h-14 rounded-2xl text-base font-bold bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white shadow-lg shadow-rose-500/20 border-0"
                                onClick={() => handleAction('create')}
                                disabled={!createName || isActionLoading}
                            >
                                {isActionLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Crown className="mr-2 h-5 w-5" />}
                                สร้างครอบครัว
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center gap-2 text-red-400"
                >
                    <AlertCircle className="w-5 h-5" />
                    {error}
                </motion.div>
            )}
        </div>
    );
}
