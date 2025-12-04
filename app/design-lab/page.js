'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Shield, Trophy, Hexagon, Settings, LogOut, Search, Filter, ChevronDown, Copy, ArrowUpCircle, Star, MoreHorizontal, UserMinus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_GANG = {
    name: "Peaky Blinders",
    code: "G-8888",
    motd: "ยินดีต้อนรับสมาชิกทุกคน! กรุณาปฏิบัติตามกฎระเบียบอย่างเคร่งครัด\n- ห้ามทะเลาะกันเอง\n- ช่วยเหลือกันเสมอ",
    logo_url: "https://i.pinimg.com/originals/e8/18/69/e81869e5c9429b8290e9d69a68e805ce.jpg",
    member_count: 12,
    max_members: 20,
    level: 5,
    balance: 5000000,
    reputation: 1500
};

// Generate more mock members to demonstrate scrolling
const MOCK_MEMBERS = Array.from({ length: 20 }, (_, i) => ({
    discord_id: `${i + 1}`,
    discord_name: i === 0 ? 'Thomas_Shelby' : `Member_${i + 1}`,
    avatar_url: null,
    is_leader: i === 0,
    joined_at: '2023-01-01',
    role: i === 0 ? 'Boss' : i < 3 ? 'Underboss' : 'Soldier',
    status: i % 3 === 0 ? 'online' : 'offline'
}));

const ACCENTS = {
    blue: { name: 'Royal Blue', from: 'from-blue-600', to: 'to-indigo-600', text: 'text-blue-400', bg: 'bg-blue-500', border: 'border-blue-500/20', ring: 'ring-blue-500' },
    purple: { name: 'Deep Purple', from: 'from-purple-600', to: 'to-pink-600', text: 'text-purple-400', bg: 'bg-purple-500', border: 'border-purple-500/20', ring: 'ring-purple-500' },
    emerald: { name: 'Toxic Green', from: 'from-emerald-600', to: 'to-teal-600', text: 'text-emerald-400', bg: 'bg-emerald-500', border: 'border-emerald-500/20', ring: 'ring-emerald-500' },
    rose: { name: 'Neon Rose', from: 'from-rose-600', to: 'to-red-600', text: 'text-rose-400', bg: 'bg-rose-500', border: 'border-rose-500/20', ring: 'ring-rose-500' },
    gold: { name: 'Luxury Gold', from: 'from-amber-400', to: 'to-yellow-600', text: 'text-amber-400', bg: 'bg-amber-500', border: 'border-amber-500/20', ring: 'ring-amber-500' },
};

export default function ModernGlassStudio() {
    // Hardcoded preferences based on user selection
    const [accent] = useState('blue');
    const [glassLevel] = useState('medium');
    const [layout] = useState('list');
    const [showBackground] = useState(true);

    // View Mode State
    const [viewMode, setViewMode] = useState('leader'); // 'leader' or 'member'

    const theme = ACCENTS[accent];

    const getGlassClass = () => {
        switch (glassLevel) {
            case 'low': return 'bg-zinc-900/90 backdrop-blur-sm border-white/5';
            case 'medium': return 'bg-zinc-900/60 backdrop-blur-md border-white/10';
            case 'high': return 'bg-zinc-900/30 backdrop-blur-xl border-white/20';
            default: return 'bg-zinc-900/60 backdrop-blur-md border-white/10';
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans relative overflow-hidden selection:bg-white/20">

            {/* Dynamic Background */}
            {showBackground && (
                <div className="fixed inset-0 pointer-events-none">
                    <div className={`absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-br ${theme.from} ${theme.to} opacity-20 blur-[120px] animate-pulse`} />
                    <div className={`absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr ${theme.from} ${theme.to} opacity-10 blur-[120px]`} />
                </div>
            )}

            {/* View Mode Toggle (For Demo Purpose) */}
            <div className="fixed top-24 right-6 z-50 bg-zinc-900/80 backdrop-blur-md border border-white/10 p-1 rounded-lg flex gap-1">
                <button
                    onClick={() => setViewMode('leader')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === 'leader' ? 'bg-white text-black shadow-lg' : 'text-zinc-400 hover:text-white'}`}
                >
                    Leader View
                </button>
                <button
                    onClick={() => setViewMode('member')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === 'member' ? 'bg-white text-black shadow-lg' : 'text-zinc-400 hover:text-white'}`}
                >
                    Member View
                </button>
            </div>

            {/* Main Preview Area */}
            <div className="max-w-7xl mx-auto pt-32 pb-12 px-6">
                <div className="grid grid-cols-12 gap-8">

                    {/* Left Sidebar (Profile) */}
                    <div className="col-span-12 lg:col-span-3 space-y-6">
                        <motion.div
                            layout
                            className={`${getGlassClass()} p-8 rounded-[2rem] text-center border shadow-xl relative overflow-hidden group`}
                        >
                            {/* Glow Effect behind avatar */}
                            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-tr ${theme.from} ${theme.to} rounded-full blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />

                            <div className="relative mb-6 inline-block group/avatar">
                                <div className={`w-28 h-28 rounded-2xl p-1 bg-gradient-to-br ${theme.from} ${theme.to}`}>
                                    <Avatar className="w-full h-full rounded-xl border-4 border-black/50">
                                        <AvatarImage src={MOCK_GANG.logo_url} className="object-cover" />
                                        <AvatarFallback>PB</AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className="absolute -bottom-3 -right-3">
                                    <Badge className={`${theme.bg} text-white border-0 shadow-lg px-2 py-1 text-xs`}>
                                        LVL {MOCK_GANG.level}
                                    </Badge>
                                </div>

                                {/* Edit Logo Button (Leader Only) */}
                                {viewMode === 'leader' && (
                                    <div className="absolute -top-2 -right-2 opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                                        <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full shadow-lg bg-white text-black hover:bg-zinc-200">
                                            <Settings className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">{MOCK_GANG.name}</h2>
                            <div className="flex items-center justify-center gap-2 text-zinc-400 text-sm mb-6 bg-black/20 py-1 px-3 rounded-full mx-auto w-fit border border-white/5 cursor-pointer hover:bg-black/40 transition-colors">
                                <span className="font-mono">{MOCK_GANG.code}</span>
                                <Copy className="w-3 h-3" />
                            </div>

                            <div className="grid grid-cols-1 gap-3 mb-6">
                                <div className="bg-black/20 rounded-xl p-3 border border-white/5">
                                    <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Members</div>
                                    <div className="text-lg font-bold">{MOCK_GANG.member_count}</div>
                                </div>
                            </div>


                            {/* Conditional Main Button (Command Center) */}
                            {viewMode === 'leader' ? (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button className={`w-full rounded-xl bg-gradient-to-r ${theme.from} ${theme.to} text-white font-semibold shadow-lg shadow-black/20 hover:opacity-90 transition-opacity mb-6`}>
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
                                                    <Input defaultValue={MOCK_GANG.name} className="bg-black/20 border-white/10" />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label>ประกาศแก๊ง (MOTD)</Label>
                                                    <Textarea placeholder="เขียนข้อความถึงสมาชิกของคุณ..." className="bg-black/20 border-white/10 min-h-[100px]" />
                                                    <p className="text-xs text-zinc-500">ข้อความนี้จะถูกปักหมุดไว้ด้านบนของแชทสมาชิก</p>
                                                </div>
                                            </div>
                                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 space-y-3">
                                                <h4 className="text-red-400 font-bold flex items-center gap-2">
                                                    <Shield className="w-4 h-4" /> เขตอันตราย
                                                </h4>
                                                <p className="text-xs text-zinc-400">การกระทำที่ไม่สามารถย้อนกลับได้</p>
                                                <Button variant="destructive" size="sm" className="w-full">ยุบแก๊ง</Button>
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
                                                <div className="text-lg font-bold text-white">{MOCK_GANG.name}</div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-zinc-400">ประกาศ (MOTD)</Label>
                                                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-zinc-300 min-h-[100px] text-sm leading-relaxed whitespace-pre-wrap">
                                                    {MOCK_GANG.motd}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-3 rounded-lg bg-black/20 border border-white/5">
                                                    <div className="text-xs text-zinc-500 uppercase">สมาชิก</div>
                                                    <div className="text-lg font-bold">{MOCK_GANG.member_count} คน</div>
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
                            {viewMode === 'member' && (
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={`${getGlassClass()} p-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/5 transition-colors group text-red-400 hover:text-red-300`}>
                                    <LogOut className="w-5 h-5" />
                                    <span className="font-medium">Leave Gang</span>
                                </motion.button>
                            )}
                            {viewMode === 'leader' && (
                                <div className="grid grid-cols-2 gap-3">
                                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={`${getGlassClass()} p-4 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-colors group`}>
                                        <div className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors ${theme.text}`}>
                                            <Settings className="w-5 h-5" />
                                        </div>
                                        <span className="text-xs font-medium text-zinc-400">Settings</span>
                                    </motion.button>
                                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={`${getGlassClass()} p-4 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-colors group`}>
                                        <div className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors text-red-400`}>
                                            <LogOut className="w-5 h-5" />
                                        </div>
                                        <span className="text-xs font-medium text-zinc-400">Disband</span>
                                    </motion.button>
                                </div>
                            )}
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
                                        className={`${getGlassClass()} w-full p-4 rounded-2xl border shadow-lg flex items-center justify-between group hover:bg-white/5 transition-all`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500 group-hover:scale-110 transition-transform">
                                                <Trophy className="w-6 h-6" />
                                            </div>
                                            <div className="text-left">
                                                <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors">รางวัลแก๊ง</h3>
                                                <p className="text-zinc-400 text-sm">เลเวล {MOCK_GANG.level} • {MOCK_GANG.member_count}/25 สมาชิก</p>
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
                                            ความคืบหน้ารางวัลแก๊ง
                                        </DialogTitle>
                                        <DialogDescription>
                                            รับสมาชิกเพิ่มเพื่อปลดล็อกสิทธิพิเศษและรางวัลของแก๊ง
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="py-12 px-4">
                                        <div className="flex items-center justify-between mb-12">
                                            <div className="text-center">
                                                <div className="text-3xl font-bold text-white">{MOCK_GANG.member_count}</div>
                                                <div className="text-xs text-zinc-500 uppercase tracking-wider">สมาชิกปัจจุบัน</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-3xl font-bold text-zinc-500">25</div>
                                                <div className="text-xs text-zinc-500 uppercase tracking-wider">เป้าหมายสูงสุด</div>
                                            </div>
                                        </div>

                                        {/* Progress Bar Container */}
                                        <div className="relative h-4 bg-black/40 rounded-full mb-8 mx-4">
                                            {/* Progress Fill */}
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(MOCK_GANG.member_count / 25) * 100}%` }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                                className={`absolute top-0 left-0 h-full rounded-full bg-gradient-to-r ${theme.from} ${theme.to} shadow-[0_0_15px_rgba(59,130,246,0.5)]`}
                                            />

                                            {/* Milestones */}
                                            {[10, 15, 20, 25].map((milestone) => {
                                                const isUnlocked = MOCK_GANG.member_count >= milestone;
                                                const position = (milestone / 25) * 100;

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
                        <motion.div layout className={`${getGlassClass()} rounded-[2rem] overflow-hidden border shadow-xl flex flex-col h-[600px]`}>

                            {/* Toolbar */}
                            <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
                                <div>
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        Team Members
                                        <Badge variant="secondary" className="bg-white/10 text-zinc-300 hover:bg-white/20 border-0">{MOCK_GANG.member_count}</Badge>
                                    </h3>
                                    <p className="text-zinc-500 text-sm mt-1">Manage your gang hierarchy and permissions</p>
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
                                    <div className="p-6">
                                        {layout === 'list' ? (
                                            <div className="space-y-2">
                                                <div className="grid grid-cols-12 text-xs font-bold text-zinc-500 uppercase tracking-wider px-4 pb-2 sticky top-0 bg-black/40 backdrop-blur-md z-10 rounded-lg mb-2 py-2">
                                                    <div className="col-span-6">Member</div>
                                                    <div className="col-span-4">Role</div>
                                                    <div className="col-span-2 text-right">Joined</div>
                                                </div>
                                                <AnimatePresence>
                                                    {MOCK_MEMBERS.map((m, i) => (
                                                        <motion.div
                                                            key={m.discord_id}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: i * 0.02 }}
                                                            className="grid grid-cols-12 items-center p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer border border-transparent hover:border-white/5"
                                                        >
                                                            <div className="col-span-6 flex items-center gap-4">
                                                                <div className="relative">
                                                                    <Avatar className={`h-10 w-10 ring-2 ring-transparent group-hover:${theme.ring} transition-all`}>
                                                                        <AvatarFallback className="bg-zinc-800 text-zinc-400 font-bold">{m.discord_name[0]}</AvatarFallback>
                                                                    </Avatar>
                                                                    {m.status === 'online' && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#18181b] rounded-full" />}
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold text-zinc-200 group-hover:text-white transition-colors">{m.discord_name}</div>
                                                                    <div className="text-xs text-zinc-500 font-mono">ID: {m.discord_id.padStart(4, '0')}</div>
                                                                </div>
                                                            </div>
                                                            <div className="col-span-4">
                                                                <Badge variant="outline" className={`${m.is_leader ? `${theme.bg}/20 ${theme.text} ${theme.border}` : 'bg-zinc-800/50 text-zinc-400 border-zinc-700/50'}`}>
                                                                    {m.role}
                                                                </Badge>
                                                            </div>
                                                            <div className="col-span-2 flex items-center justify-end gap-2">
                                                                {viewMode === 'leader' && !m.is_leader ? (
                                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white" title="Promote">
                                                                            <ArrowUpCircle className="w-4 h-4" />
                                                                        </Button>
                                                                        <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg hover:bg-red-500/20 text-zinc-400 hover:text-red-400" title="Kick">
                                                                            <UserMinus className="w-4 h-4" />
                                                                        </Button>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-zinc-500 text-xs font-mono">{m.joined_at}</span>
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </AnimatePresence>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                                                <AnimatePresence>
                                                    {MOCK_MEMBERS.map((m, i) => (
                                                        <motion.div
                                                            key={m.discord_id}
                                                            initial={{ opacity: 0, scale: 0.9 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{ delay: i * 0.02 }}
                                                            className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all group relative overflow-hidden"
                                                        >
                                                            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${theme.from} ${theme.to} opacity-0 group-hover:opacity-100 transition-opacity`} />

                                                            <div className="flex items-start justify-between mb-4">
                                                                <Avatar className="h-12 w-12">
                                                                    <AvatarFallback className="bg-zinc-800 text-zinc-400 font-bold text-lg">{m.discord_name[0]}</AvatarFallback>
                                                                </Avatar>
                                                                {viewMode === 'leader' && !m.is_leader && (
                                                                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-white/10 text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        <MoreHorizontal className="w-4 h-4" />
                                                                    </Button>
                                                                )}
                                                            </div>

                                                            <div className="mb-3">
                                                                <div className="font-bold text-lg text-white mb-1">{m.discord_name}</div>
                                                                <div className="flex items-center gap-2">
                                                                    <Badge variant="secondary" className="bg-black/30 text-zinc-400 hover:bg-black/50 border-0 text-[10px] h-5">
                                                                        {m.role}
                                                                    </Badge>
                                                                    {m.status === 'online' && <span className="text-[10px] text-green-500 font-medium">● Online</span>}
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs text-zinc-500">
                                                                <span>Joined {m.joined_at}</span>
                                                                <span className="font-mono">#{m.discord_id}</span>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </AnimatePresence>
                                            </div>
                                        )}
                                    </div>
                                </ScrollArea>
                            </div>
                        </motion.div>
                    </div>
                </div >
            </div >
        </div >
    );
}

function StatCard({ icon, label, value, subValue, theme, glassClass, isAlert }) {
    return (
        <motion.div
            whileHover={{ y: -2 }}
            className={`${glassClass} p-5 rounded-2xl border flex items-start gap-4 relative overflow-hidden group`}
        >
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${theme.from} ${theme.to} opacity-10 group-hover:opacity-20 transition-opacity blur-xl`} />

            <div className={`w-12 h-12 rounded-xl ${isAlert ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-zinc-300'} flex items-center justify-center shrink-0`}>
                {icon}
            </div>
            <div>
                <div className="text-zinc-500 text-sm font-medium mb-1">{label}</div>
                <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
                <div className={`text-xs mt-1 ${isAlert ? 'text-red-400' : 'text-green-400'}`}>{subValue}</div>
            </div>
        </motion.div>
    );
}
