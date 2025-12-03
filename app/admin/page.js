'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Ticket, Trophy, Search, Settings, Loader2, ShieldAlert, UserCheck, Package, Home, Swords, History, Activity } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [stats, setStats] = useState(null);
    const [recentUsers, setRecentUsers] = useState([]);
    const [recentWins, setRecentWins] = useState([]);
    const [graphs, setGraphs] = useState({ registrations: [], spins: [] });
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/admin');
            if (!res.ok) throw new Error('Failed to fetch data');
            const data = await res.json();
            setStats(data.stats);
            setRecentUsers(data.recentUsers);
            setRecentWins(data.recentWins);
            setGraphs(data.graphs || { registrations: [], spins: [] });
        } catch (error) {
            console.error(error);
        } finally {
            setIsInitialLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const res = await fetch(`/api/admin?q=${searchQuery}`);
            const data = await res.json();
            setSearchResults(data.users || []);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSearching(false);
        }
    };

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/');
        } else if (status === 'authenticated') {
            if (!session?.user?.isAdmin) {
                router.push('/');
            } else {
                fetchData();
            }
        }
    }, [status, session, router]);

    if (status === 'loading' || isInitialLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!session?.user?.isAdmin) {
        return null; // Prevent flash of content before redirect
    }

    return (
        <div className="min-h-screen bg-background font-sans">
            <Navbar />
            <div className="container max-w-7xl pt-24 pb-12 px-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2">แดชบอร์ดผู้ดูแลระบบ</h1>
                        <p className="text-muted-foreground">ภาพรวมและจัดการระบบ Rank1 City</p>
                    </div>
                    <Link href="/admin/settings">
                        <Button variant="outline" className="rounded-full px-6 border-muted-foreground/20 hover:bg-muted">
                            <Settings className="mr-2 h-4 w-4" /> ตั้งค่าระบบ
                        </Button>
                    </Link>
                </div>

                <Tabs defaultValue="overview" className="space-y-8">
                    <div className="flex overflow-x-auto pb-2 scrollbar-hide">
                        <TabsList className="bg-muted/50 p-1 rounded-full h-auto inline-flex w-full md:w-auto justify-start">
                            <TabsTrigger value="overview" className="rounded-full px-6 py-2.5 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                <Activity className="h-4 w-4" /> ภาพรวม
                            </TabsTrigger>
                            <TabsTrigger value="users" className="rounded-full px-6 py-2.5 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                <Users className="h-4 w-4" /> ผู้ใช้งาน
                            </TabsTrigger>
                            <TabsTrigger value="economy" className="rounded-full px-6 py-2.5 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                <Trophy className="h-4 w-4" /> เศรษฐกิจ
                            </TabsTrigger>
                            <TabsTrigger value="social" className="rounded-full px-6 py-2.5 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                <ShieldAlert className="h-4 w-4" /> สังคม
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* ==================== TAB: OVERVIEW ==================== */}
                    <TabsContent value="overview" className="space-y-6 mt-0 animate-in fade-in-50 duration-500">
                        {/* Key Metrics */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <div className="bg-card rounded-2xl p-5 border shadow-sm flex items-center gap-4">
                                <div className="p-3 bg-blue-500/10 rounded-xl">
                                    <Users className="h-6 w-6 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">ผู้ใช้ทั้งหมด</p>
                                    <h3 className="text-2xl font-bold">{stats?.total_users?.toLocaleString() || 0}</h3>
                                </div>
                            </div>
                            <div className="bg-card rounded-2xl p-5 border shadow-sm flex items-center gap-4">
                                <div className="p-3 bg-green-500/10 rounded-xl">
                                    <Activity className="h-6 w-6 text-green-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">ใหม่วันนี้</p>
                                    <h3 className="text-2xl font-bold">{stats?.users_today?.toLocaleString() || 0}</h3>
                                </div>
                            </div>
                            <div className="bg-card rounded-2xl p-5 border shadow-sm flex items-center gap-4">
                                <div className="p-3 bg-emerald-500/10 rounded-xl">
                                    <Trophy className="h-6 w-6 text-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">ยอดหมุนกาชา</p>
                                    <h3 className="text-2xl font-bold">{stats?.total_spins?.toLocaleString() || 0}</h3>
                                </div>
                            </div>
                            <div className="bg-card rounded-2xl p-5 border shadow-sm flex items-center gap-4">
                                <div className="p-3 bg-cyan-500/10 rounded-xl">
                                    <Package className="h-6 w-6 text-cyan-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">รอรับรางวัล</p>
                                    <h3 className="text-2xl font-bold">{stats?.pending_claims?.toLocaleString() || 0}</h3>
                                </div>
                            </div>
                        </div>

                        {/* Graphs */}
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="bg-card rounded-[2rem] p-6 border shadow-sm">
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold flex items-center gap-2">
                                        <Users className="h-4 w-4 text-primary" /> ผู้ลงทะเบียนใหม่ (7 วัน)
                                    </h3>
                                </div>
                                <div className="h-[250px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={graphs.registrations}>
                                            <defs>
                                                <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                                            <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={(val) => val.split('-').slice(1).join('/')} stroke="rgba(255,255,255,0.5)" />
                                            <YAxis tick={{ fontSize: 12 }} stroke="rgba(255,255,255,0.5)" />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                                                itemStyle={{ color: '#fff' }}
                                            />
                                            <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorReg)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="bg-card rounded-[2rem] p-6 border shadow-sm">
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold flex items-center gap-2">
                                        <Trophy className="h-4 w-4 text-primary" /> ยอดสุ่มกาชา (7 วัน)
                                    </h3>
                                </div>
                                <div className="h-[250px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={graphs.spins}>
                                            <defs>
                                                <linearGradient id="colorSpin" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                                            <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={(val) => val.split('-').slice(1).join('/')} stroke="rgba(255,255,255,0.5)" />
                                            <YAxis tick={{ fontSize: 12 }} stroke="rgba(255,255,255,0.5)" />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                                                itemStyle={{ color: '#fff' }}
                                            />
                                            <Area type="monotone" dataKey="count" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSpin)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                            <div className="col-span-4 bg-card rounded-[2rem] border shadow-sm overflow-hidden">
                                <div className="p-6 border-b">
                                    <h3 className="text-lg font-bold">การลงทะเบียนล่าสุด</h3>
                                </div>
                                <div className="p-0">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="hover:bg-transparent border-border/50">
                                                <TableHead className="pl-6">Discord ID</TableHead>
                                                <TableHead>รหัสแนะนำ</TableHead>
                                                <TableHead className="text-right pr-6">วันที่</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {recentUsers.map((user, i) => (
                                                <TableRow key={i} className="hover:bg-muted/30 border-border/50">
                                                    <TableCell className="font-mono text-xs pl-6">{user.discord_id}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="secondary" className="rounded-lg font-mono">{user.referral_code}</Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right text-muted-foreground pr-6">
                                                        {new Date(user.created_at).toLocaleDateString('th-TH')}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                            <div className="col-span-3 bg-card rounded-[2rem] border shadow-sm overflow-hidden">
                                <div className="p-6 border-b">
                                    <h3 className="text-lg font-bold">ผู้โชคดีล่าสุด</h3>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {recentWins.map((win, i) => (
                                            <div key={i} className="flex items-center p-3 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
                                                <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 shrink-0">
                                                    <Trophy className="h-5 w-5" />
                                                </div>
                                                <div className="ml-4 space-y-1 overflow-hidden min-w-0">
                                                    <p className="text-sm font-bold leading-none truncate">{win.item_name}</p>
                                                    <p className="text-xs text-muted-foreground truncate">
                                                        {win.discord_id}
                                                    </p>
                                                </div>
                                                <div className="ml-auto font-medium text-xs text-muted-foreground whitespace-nowrap pl-2">
                                                    {new Date(win.created_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* ==================== TAB: USERS ==================== */}
                    <TabsContent value="users" className="space-y-6 mt-0 animate-in fade-in-50 duration-500">
                        {/* User Stats Grid */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <div className="bg-card rounded-2xl p-5 border shadow-sm flex items-center gap-4">
                                <div className="p-3 bg-blue-500/10 rounded-xl">
                                    <Users className="h-6 w-6 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">ผู้ใช้ทั้งหมด</p>
                                    <h3 className="text-2xl font-bold">{stats?.total_users?.toLocaleString() || 0}</h3>
                                </div>
                            </div>
                            <div className="bg-card rounded-2xl p-5 border shadow-sm flex items-center gap-4">
                                <div className="p-3 bg-purple-500/10 rounded-xl">
                                    <UserCheck className="h-6 w-6 text-purple-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">ตัวละครในเกม</p>
                                    <h3 className="text-2xl font-bold">{stats?.total_characters?.toLocaleString() || 0}</h3>
                                </div>
                            </div>
                            <div className="bg-card rounded-2xl p-5 border shadow-sm flex items-center gap-4">
                                <div className="p-3 bg-orange-500/10 rounded-xl">
                                    <History className="h-6 w-6 text-orange-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">ผู้เล่น Solo</p>
                                    <h3 className="text-2xl font-bold">{stats?.solo_players?.toLocaleString() || 0}</h3>
                                </div>
                            </div>
                            <div className="bg-card rounded-2xl p-5 border shadow-sm flex items-center gap-4">
                                <div className="p-3 bg-rose-500/10 rounded-xl">
                                    <Swords className="h-6 w-6 text-rose-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">มีสังกัดแก๊ง</p>
                                    <h3 className="text-2xl font-bold">{stats?.gang_members?.toLocaleString() || 0}</h3>
                                </div>
                            </div>
                        </div>

                        {/* Search & Table */}
                        <div className="bg-card rounded-[2.5rem] border shadow-sm overflow-hidden">
                            <div className="p-6 border-b flex flex-col md:flex-row justify-between items-center gap-4">
                                <h3 className="text-xl font-bold">ค้นหาผู้ใช้งาน</h3>
                                <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
                                    <div className="relative flex-1 md:w-80">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="ค้นหาด้วย Discord ID หรือ รหัสแนะนำ..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-9 rounded-xl bg-muted/30 border-transparent focus:bg-background"
                                        />
                                    </div>
                                    <Button type="submit" disabled={isSearching} className="rounded-xl px-6">
                                        {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : 'ค้นหา'}
                                    </Button>
                                </form>
                            </div>
                            <div className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent border-border/50">
                                            <TableHead className="pl-6">Discord ID</TableHead>
                                            <TableHead>แก๊ง</TableHead>
                                            <TableHead>ตั๋ว</TableHead>
                                            <TableHead>แต้ม</TableHead>
                                            <TableHead>รหัสแนะนำ</TableHead>
                                            <TableHead className="pr-6">ผู้แนะนำ</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {searchResults.map((user) => (
                                            <TableRow key={user.id} className="hover:bg-muted/30 border-border/50">
                                                <TableCell className="font-mono pl-6">{user.discord_id}</TableCell>
                                                <TableCell>
                                                    {user.gang_name ? (
                                                        <Badge variant="outline" className="rounded-lg">{user.gang_name}</Badge>
                                                    ) : '-'}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <Ticket className="w-3 h-3 text-amber-500" />
                                                        {user.ticket_count}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-bold text-primary">{user.points}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className="rounded-lg font-mono">{user.referral_code}</Badge>
                                                </TableCell>
                                                <TableCell className="pr-6 text-muted-foreground">{user.invited_by || '-'}</TableCell>
                                            </TableRow>
                                        ))}
                                        {searchResults.length === 0 && searchQuery && !isSearching && (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <Search className="h-10 w-10 mb-4 opacity-20" />
                                                        <p>ไม่พบข้อมูลผู้ใช้งาน</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        {searchResults.length === 0 && !searchQuery && (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <Search className="h-10 w-10 mb-4 opacity-20" />
                                                        <p>พิมพ์คำค้นหาเพื่อเริ่มค้นหาข้อมูล</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </TabsContent>

                    {/* ==================== TAB: ECONOMY ==================== */}
                    <TabsContent value="economy" className="space-y-6 mt-0 animate-in fade-in-50 duration-500">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            <div className="bg-card rounded-2xl p-5 border shadow-sm flex items-center gap-4">
                                <div className="p-3 bg-emerald-500/10 rounded-xl">
                                    <Trophy className="h-6 w-6 text-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">ยอดหมุนกาชา</p>
                                    <h3 className="text-2xl font-bold">{stats?.total_spins?.toLocaleString() || 0}</h3>
                                </div>
                            </div>
                            <div className="bg-card rounded-2xl p-5 border shadow-sm flex items-center gap-4">
                                <div className="p-3 bg-amber-500/10 rounded-xl">
                                    <Ticket className="h-6 w-6 text-amber-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">ตั๋วคงเหลือ</p>
                                    <h3 className="text-2xl font-bold">{stats?.tickets_holding?.toLocaleString() || 0}</h3>
                                </div>
                            </div>
                            <div className="bg-card rounded-2xl p-5 border shadow-sm flex items-center gap-4">
                                <div className="p-3 bg-cyan-500/10 rounded-xl">
                                    <Package className="h-6 w-6 text-cyan-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">รอรับรางวัล</p>
                                    <h3 className="text-2xl font-bold">{stats?.pending_claims?.toLocaleString() || 0}</h3>
                                </div>
                            </div>
                            <div className="bg-card rounded-2xl p-5 border shadow-sm flex items-center gap-4">
                                <div className="p-3 bg-teal-500/10 rounded-xl">
                                    <Package className="h-6 w-6 text-teal-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">รับรางวัลแล้ว</p>
                                    <h3 className="text-2xl font-bold">{stats?.claimed_items?.toLocaleString() || 0}</h3>
                                </div>
                            </div>
                        </div>

                        {/* Future: Transaction Logs or Item Distribution Charts could go here */}
                        <div className="bg-muted/20 border-2 border-dashed border-muted rounded-3xl p-12 text-center">
                            <Trophy className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                            <h3 className="text-lg font-medium text-muted-foreground">ประวัติธุรกรรม (Coming Soon)</h3>
                            <p className="text-sm text-muted-foreground/70">ระบบตรวจสอบ Log การเงินและไอเทมอย่างละเอียด</p>
                        </div>
                    </TabsContent>

                    {/* ==================== TAB: SOCIAL ==================== */}
                    <TabsContent value="social" className="space-y-6 mt-0 animate-in fade-in-50 duration-500">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            <div className="bg-card rounded-2xl p-5 border shadow-sm flex items-center gap-4">
                                <div className="p-3 bg-red-500/10 rounded-xl">
                                    <ShieldAlert className="h-6 w-6 text-red-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">แก๊งทั้งหมด</p>
                                    <h3 className="text-2xl font-bold">{stats?.total_gangs?.toLocaleString() || 0}</h3>
                                </div>
                            </div>
                            <div className="bg-card rounded-2xl p-5 border shadow-sm flex items-center gap-4">
                                <div className="p-3 bg-rose-500/10 rounded-xl">
                                    <Swords className="h-6 w-6 text-rose-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">สมาชิกแก๊ง</p>
                                    <h3 className="text-2xl font-bold">{stats?.gang_members?.toLocaleString() || 0}</h3>
                                </div>
                            </div>
                            <div className="bg-card rounded-2xl p-5 border shadow-sm flex items-center gap-4 opacity-60">
                                <div className="p-3 bg-indigo-500/10 rounded-xl">
                                    <Home className="h-6 w-6 text-indigo-500" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium text-muted-foreground">ครอบครัว</p>
                                        <Badge variant="outline" className="text-[10px] h-4 px-1">Soon</Badge>
                                    </div>
                                    <h3 className="text-2xl font-bold">{stats?.total_families?.toLocaleString() || 0}</h3>
                                </div>
                            </div>
                            <div className="bg-card rounded-2xl p-5 border shadow-sm flex items-center gap-4 opacity-60">
                                <div className="p-3 bg-pink-500/10 rounded-xl">
                                    <Users className="h-6 w-6 text-pink-500" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium text-muted-foreground">สมาชิกครอบครัว</p>
                                        <Badge variant="outline" className="text-[10px] h-4 px-1">Soon</Badge>
                                    </div>
                                    <h3 className="text-2xl font-bold">{stats?.family_members?.toLocaleString() || 0}</h3>
                                </div>
                            </div>
                        </div>

                        {/* Future: Gang List */}
                        <div className="bg-muted/20 border-2 border-dashed border-muted rounded-3xl p-12 text-center">
                            <ShieldAlert className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                            <h3 className="text-lg font-medium text-muted-foreground">จัดการแก๊งและครอบครัว (Coming Soon)</h3>
                            <p className="text-sm text-muted-foreground/70">ระบบอนุมัติแก๊ง ตรวจสอบสมาชิก และจัดการพื้นที่</p>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
