'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Ticket, Trophy, Search, Settings, Loader2, ShieldAlert, UserCheck, Package, Home, Swords, History, Activity, ScrollText, Gift, ChevronLeft, ChevronRight, User, Calendar, CreditCard, Hash, MapPin, Users2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
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
    const [recentWins, setRecentWins] = useState([]); // Initial top 5
    const [winnersList, setWinnersList] = useState([]); // Paginated list
    const [winnersPage, setWinnersPage] = useState(1);
    const [winnersTotalPages, setWinnersTotalPages] = useState(1);
    const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);

    // Gangs State
    const [gangsList, setGangsList] = useState([]);
    const [gangsPage, setGangsPage] = useState(1);
    const [gangsTotalPages, setGangsTotalPages] = useState(1);
    const [gangSearchQuery, setGangSearchQuery] = useState('');
    const [isLoadingGangs, setIsLoadingGangs] = useState(false);

    // Recent Registrations Search
    const [recentRegSearchQuery, setRecentRegSearchQuery] = useState('');

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

    const fetchWinners = async (page) => {
        setIsLoadingWinners(true);
        try {
            const res = await fetch(`/api/admin?type=winners&page=${page}&limit=24`);
            if (!res.ok) throw new Error('Failed to fetch winners');
            const data = await res.json();
            setWinnersList(data.winners);
            setWinnersTotalPages(data.pagination.totalPages);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingWinners(false);
        }
    };

    const fetchTransactions = async (page, query = '') => {
        setIsLoadingTransactions(true);
        try {
            const res = await fetch(`/api/admin?type=transactions&page=${page}&limit=5&q=${query}`);
            if (!res.ok) throw new Error('Failed to fetch transactions');
            const data = await res.json();
            setTransactionsList(data.transactions);
            setTransactionsTotalPages(data.pagination.totalPages);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingTransactions(false);
        }
    };

    const fetchGangs = async (page, query = '') => {
        setIsLoadingGangs(true);
        try {
            const res = await fetch(`/api/admin?type=gangs&page=${page}&limit=5&q=${query}`);
            if (!res.ok) throw new Error('Failed to fetch gangs');
            const data = await res.json();
            setGangsList(data.gangs);
            setGangsTotalPages(data.pagination.totalPages);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingGangs(false);
        }
    };

    useEffect(() => {
        if (winnersPage > 1) fetchWinners(winnersPage);
    }, [winnersPage]);

    useEffect(() => {
        fetchTransactions(transactionsPage, transactionSearchQuery);
    }, [transactionsPage]);

    useEffect(() => {
        fetchGangs(gangsPage, gangSearchQuery);
    }, [gangsPage]);

    const handleTransactionSearch = (e) => {
        e.preventDefault();
        setTransactionsPage(1);
        fetchTransactions(1, transactionSearchQuery);
    };

    const handleGangSearch = (e) => {
        e.preventDefault();
        setGangsPage(1);
        fetchGangs(1, gangSearchQuery);
    };

    const handleRecentRegSearch = (e) => {
        e.preventDefault();
        // Redirect to Users tab with search query
        const tabsTrigger = document.querySelector('[value="users"]');
        if (tabsTrigger) tabsTrigger.click();
        setSearchQuery(recentRegSearchQuery);
        // Trigger search in Users tab (need to wait for state update or call handleSearch manually if possible, 
        // but setting searchQuery might be enough if we trigger it)
        // For now, let's just set the query and let the user click search or we can auto-search if we add an effect.
        // Better: just call handleSearch logic directly if we were in the same context, but we are switching tabs.
        // We will just set the main search query and let the user press enter or we can simulate it.
        // Actually, let's just switch tab and set query.
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const res = await fetch(`/api/admin?q=${searchQuery}`);
            const data = await res.json();
            const results = data.users || [];
            setSearchResults(results);

            // If exactly one result is found, open the dialog immediately
            if (results.length === 1) {
                setSelectedUser(results[0]);
                setIsUserDialogOpen(true);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSearching(false);
        }
    };

    const openUserDialog = (user) => {
        setSelectedUser(user);
        setIsUserDialogOpen(true);
    };

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/');
        } else if (status === 'authenticated') {
            if (!session?.user?.isAdmin) {
                router.push('/');
            } else {
                fetchData();
                fetchWinners(1);
                fetchTransactions(1);
                fetchGangs(1);
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
                            <TabsTrigger value="activity" className="rounded-full px-6 py-2.5 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                <ScrollText className="h-4 w-4" /> กิจกรรม
                            </TabsTrigger>
                            <TabsTrigger value="winners" className="rounded-full px-6 py-2.5 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                <Gift className="h-4 w-4" /> ผู้โชคดี
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


                    </TabsContent>

                    {/* ==================== TAB: ACTIVITY ==================== */}
                    <TabsContent value="activity" className="space-y-6 mt-0 animate-in fade-in-50 duration-500">
                        <div className="bg-card rounded-[2rem] border shadow-sm overflow-hidden">
                            <div className="p-6 border-b flex flex-col sm:flex-row justify-between items-center gap-4">
                                <h3 className="text-lg font-bold">การลงทะเบียนล่าสุด</h3>
                                <form onSubmit={handleRecentRegSearch} className="relative w-full sm:w-64">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="ค้นหาผู้ใช้..."
                                        className="pl-9 h-9 rounded-full bg-muted/50 border-none focus:ring-1 focus:ring-primary"
                                        value={recentRegSearchQuery}
                                        onChange={(e) => setRecentRegSearchQuery(e.target.value)}
                                    />
                                </form>
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
                    </TabsContent>

                    {/* ==================== TAB: WINNERS ==================== */}
                    <TabsContent value="winners" className="space-y-6 mt-0 animate-in fade-in-50 duration-500">
                        <div className="bg-card rounded-[2rem] border shadow-sm overflow-hidden">
                            <div className="p-6 border-b flex justify-between items-center">
                                <h3 className="text-lg font-bold">ผู้โชคดีล่าสุด</h3>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setWinnersPage(p => Math.max(1, p - 1))}
                                        disabled={winnersPage === 1 || isLoadingWinners}
                                        className="h-8 w-8 rounded-full"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <span className="text-sm font-medium min-w-[3rem] text-center">
                                        {winnersPage} / {winnersTotalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setWinnersPage(p => Math.min(winnersTotalPages, p + 1))}
                                        disabled={winnersPage === winnersTotalPages || isLoadingWinners}
                                        className="h-8 w-8 rounded-full"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="p-6">
                                {isLoadingWinners ? (
                                    <div className="flex justify-center py-12">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    </div>
                                ) : (
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                        {winnersList.map((win, i) => (
                                            <div key={i} className="flex items-center p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors border border-border/50">
                                                <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 shrink-0">
                                                    <Trophy className="h-6 w-6" />
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
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    {/* ==================== TAB: USERS ==================== */}
                    <TabsContent value="users" className="mt-0 animate-in fade-in-50 duration-500">
                        <div className="grid gap-6">
                            {/* Search Section */}
                            <Card className="rounded-[2rem] border-none shadow-lg bg-gradient-to-br from-background to-muted/20 overflow-hidden">
                                <div className="p-12 flex flex-col items-center justify-center text-center space-y-6">
                                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                                        <Search className="h-10 w-10 text-primary" />
                                    </div>
                                    <div className="space-y-2 max-w-lg">
                                        <h2 className="text-3xl font-bold tracking-tight">ค้นหาผู้ใช้งาน</h2>
                                        <p className="text-muted-foreground">
                                            กรอก Discord ID หรือ รหัสแนะนำ เพื่อดูข้อมูลรายละเอียดของผู้ใช้งาน
                                        </p>
                                    </div>
                                    <form onSubmit={handleSearch} className="w-full max-w-xl relative">
                                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            placeholder="ค้นหาด้วย Discord ID หรือ Referral Code..."
                                            className="pl-12 h-14 text-lg rounded-full border-2 border-muted bg-background/50 hover:bg-background focus:border-primary transition-all shadow-sm"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                        <Button
                                            type="submit"
                                            className="absolute right-2 top-2 bottom-2 rounded-full px-6"
                                            disabled={isSearching}
                                        >
                                            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : 'ค้นหา'}
                                        </Button>
                                    </form>
                                </div>
                            </Card>

                            {/* Search Results */}
                            {searchResults.length > 0 && (
                                <Card className="rounded-[2rem] border shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
                                    <div className="p-6 border-b">
                                        <h3 className="text-lg font-bold">ผลการค้นหา ({searchResults.length})</h3>
                                    </div>
                                    <div className="p-0">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="hover:bg-transparent border-border/50">
                                                    <TableHead className="pl-6">Discord ID</TableHead>
                                                    <TableHead>ชื่อ</TableHead>
                                                    <TableHead>แก๊ง</TableHead>
                                                    <TableHead>ตั๋ว</TableHead>
                                                    <TableHead className="text-right pr-6">จัดการ</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {searchResults.map((user, i) => (
                                                    <TableRow key={i} className="hover:bg-muted/30 border-border/50 cursor-pointer" onClick={() => openUserDialog(user)}>
                                                        <TableCell className="font-mono pl-6">{user.discord_id}</TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                {user.avatar_url && <img src={user.avatar_url} alt="" className="h-6 w-6 rounded-full" />}
                                                                <span className="font-medium">{user.discord_name || 'Unknown'}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            {user.gang_name ? (
                                                                <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                                                                    {user.gang_name}
                                                                </Badge>
                                                            ) : (
                                                                <span className="text-muted-foreground text-sm">-</span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-1">
                                                                <Ticket className="h-3 w-3 text-yellow-500" />
                                                                <span>{user.ticket_count}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right pr-6">
                                                            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openUserDialog(user); }}>
                                                                ดูข้อมูล
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </Card>
                            )}
                        </div>

                        {/* User Details Dialog */}
                        <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
                            <DialogContent className="sm:max-w-[600px] rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl">
                                {selectedUser && (
                                    <>
                                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white relative">
                                            <div className="absolute top-4 right-4 opacity-20">
                                                <Users2 className="h-32 w-32" />
                                            </div>
                                            <div className="relative z-10 flex items-center gap-6">
                                                <div className="h-24 w-24 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 overflow-hidden shadow-xl">
                                                    {selectedUser.avatar_url ? (
                                                        <img src={selectedUser.avatar_url} alt={selectedUser.discord_name} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center bg-muted text-muted-foreground">
                                                            <User className="h-10 w-10" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <DialogTitle className="text-3xl font-bold">{selectedUser.discord_name || 'Unknown User'}</DialogTitle>
                                                    <div className="flex items-center gap-2 mt-2 text-white/80 font-mono bg-black/20 px-3 py-1 rounded-full w-fit">
                                                        <Hash className="h-4 w-4" />
                                                        {selectedUser.discord_id}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-8 bg-background">
                                            <div className="grid grid-cols-2 gap-8">
                                                <div className="space-y-6">
                                                    <div>
                                                        <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                                                            <CreditCard className="h-4 w-4" /> ข้อมูลการแนะนำ
                                                        </h4>
                                                        <div className="bg-muted/30 p-4 rounded-xl space-y-3">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-sm">รหัสแนะนำ</span>
                                                                <Badge variant="secondary" className="font-mono text-base">{selectedUser.referral_code}</Badge>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-sm">ผู้แนะนำ</span>
                                                                <span className="font-medium">{selectedUser.referred_by || '-'}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-sm">เชิญเพื่อน</span>
                                                                <span className="font-bold text-green-500">{selectedUser.invite_count} คน</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-6">
                                                    <div>
                                                        <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                                                            <Activity className="h-4 w-4" /> สถานะเกม
                                                        </h4>
                                                        <div className="bg-muted/30 p-4 rounded-xl space-y-3">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-sm">แก๊ง</span>
                                                                {selectedUser.gang_name ? (
                                                                    <Badge className="bg-red-500 hover:bg-red-600">{selectedUser.gang_name}</Badge>
                                                                ) : (
                                                                    <span className="text-muted-foreground">-</span>
                                                                )}
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-sm">ตั๋วคงเหลือ</span>
                                                                <div className="flex items-center gap-1 font-bold text-yellow-500">
                                                                    <Ticket className="h-4 w-4" />
                                                                    {selectedUser.ticket_count}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-8 pt-6 border-t">
                                                <Button
                                                    variant="outline"
                                                    className="w-full h-12 rounded-xl border-dashed border-2 hover:border-primary hover:bg-primary/5 hover:text-primary transition-all group"
                                                    onClick={() => setIsHistoryDialogOpen(true)}
                                                >
                                                    <History className="h-4 w-4 mr-2 group-hover:animate-spin" />
                                                    ดูประวัติการสุ่มกาชา ({selectedUser.lucky_draw_history?.length || 0} รายการล่าสุด)
                                                </Button>
                                            </div>

                                            <div className="mt-8 pt-6 border-t grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4" />
                                                    ลงทะเบียน: {new Date(selectedUser.created_at).toLocaleDateString('th-TH')}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4" />
                                                    IP: {selectedUser.ip_address || 'Unknown'}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </DialogContent>
                        </Dialog>

                        {/* History Dialog */}
                        <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
                            <DialogContent className="sm:max-w-[500px] rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl">
                                {selectedUser && (
                                    <>
                                        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                                <History className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <DialogTitle className="text-xl font-bold">ประวัติการสุ่มกาชา</DialogTitle>
                                                <p className="text-white/80 text-sm">ของ {selectedUser.discord_name}</p>
                                            </div>
                                        </div>
                                        <div className="p-6 bg-background max-h-[60vh] overflow-y-auto">
                                            {selectedUser.lucky_draw_history && selectedUser.lucky_draw_history.length > 0 ? (
                                                <div className="rounded-xl border overflow-hidden">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow className="bg-muted/50">
                                                                <TableHead>ไอเทม</TableHead>
                                                                <TableHead className="text-right">เวลา</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {selectedUser.lucky_draw_history.map((item, i) => (
                                                                <TableRow key={i}>
                                                                    <TableCell className="font-medium">{item.item_name}</TableCell>
                                                                    <TableCell className="text-right text-muted-foreground text-xs">
                                                                        {new Date(item.created_at).toLocaleString('th-TH')}
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            ) : (
                                                <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
                                                    ไม่พบประวัติการสุ่ม
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4 bg-muted/20 border-t flex justify-end">
                                            <Button onClick={() => setIsHistoryDialogOpen(false)}>ปิดหน้าต่าง</Button>
                                        </div>
                                    </>
                                )}
                            </DialogContent>
                        </Dialog>
                    </TabsContent>
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

                        {/* Transaction Logs Table */}
                        <Card className="rounded-[2rem] border shadow-sm overflow-hidden">
                            <div className="p-6 border-b flex flex-col sm:flex-row justify-between items-center gap-4">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <ScrollText className="h-5 w-5 text-primary" /> ประวัติธุรกรรม
                                </h3>
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    <form onSubmit={handleTransactionSearch} className="relative w-full sm:w-64">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="ค้นหาธุรกรรม..."
                                            className="pl-9 h-9 rounded-full bg-muted/50 border-none focus:ring-1 focus:ring-primary"
                                            value={transactionSearchQuery}
                                            onChange={(e) => setTransactionSearchQuery(e.target.value)}
                                        />
                                    </form>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setTransactionsPage(p => Math.max(1, p - 1))}
                                            disabled={transactionsPage === 1 || isLoadingTransactions}
                                            className="h-8 w-8 rounded-full"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <span className="text-sm font-medium min-w-[3rem] text-center">
                                            {transactionsPage} / {transactionsTotalPages}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setTransactionsPage(p => Math.min(transactionsTotalPages, p + 1))}
                                            disabled={transactionsPage === transactionsTotalPages || isLoadingTransactions}
                                            className="h-8 w-8 rounded-full"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent border-border/50">
                                            <TableHead className="pl-6">ID</TableHead>
                                            <TableHead>ผู้ใช้งาน</TableHead>
                                            <TableHead>กิจกรรม</TableHead>
                                            <TableHead>จำนวน</TableHead>
                                            <TableHead>รายละเอียด</TableHead>
                                            <TableHead className="text-right pr-6">เวลา</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {isLoadingTransactions ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="h-24 text-center">
                                                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            transactionsList.map((tx, i) => (
                                                <TableRow key={i} className="hover:bg-muted/30 border-border/50">
                                                    <TableCell className="font-mono text-xs pl-6 text-muted-foreground">#{tx.id}</TableCell>
                                                    <TableCell className="font-mono text-xs">{tx.discord_id}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="font-normal capitalize">
                                                            {tx.action.replace('_', ' ')}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className={tx.amount > 0 ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
                                                            {tx.amount > 0 ? '+' : ''}{tx.amount}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-sm text-muted-foreground">{tx.details}</TableCell>
                                                    <TableCell className="text-right text-muted-foreground pr-6 text-xs">
                                                        {new Date(tx.created_at).toLocaleString('th-TH')}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </Card>
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

                        {/* Gang List Table */}
                        <Card className="rounded-[2rem] border shadow-sm overflow-hidden">
                            <div className="p-6 border-b flex flex-col sm:flex-row justify-between items-center gap-4">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <ShieldAlert className="h-5 w-5 text-primary" /> รายชื่อแก๊ง
                                </h3>
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    <form onSubmit={handleGangSearch} className="relative w-full sm:w-64">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="ค้นหาแก๊ง..."
                                            className="pl-9 h-9 rounded-full bg-muted/50 border-none focus:ring-1 focus:ring-primary"
                                            value={gangSearchQuery}
                                            onChange={(e) => setGangSearchQuery(e.target.value)}
                                        />
                                    </form>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setGangsPage(p => Math.max(1, p - 1))}
                                            disabled={gangsPage === 1 || isLoadingGangs}
                                            className="h-8 w-8 rounded-full"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <span className="text-sm font-medium min-w-[3rem] text-center">
                                            {gangsPage} / {gangsTotalPages}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setGangsPage(p => Math.min(gangsTotalPages, p + 1))}
                                            disabled={gangsPage === gangsTotalPages || isLoadingGangs}
                                            className="h-8 w-8 rounded-full"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent border-border/50">
                                            <TableHead className="pl-6">ชื่อแก๊ง</TableHead>
                                            <TableHead>รหัสแก๊ง</TableHead>
                                            <TableHead>หัวหน้าแก๊ง</TableHead>
                                            <TableHead>สมาชิก</TableHead>
                                            <TableHead className="text-right pr-6">วันที่สร้าง</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {isLoadingGangs ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="h-24 text-center">
                                                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            gangsList.map((gang, i) => (
                                                <TableRow key={i} className="hover:bg-muted/30 border-border/50">
                                                    <TableCell className="font-bold pl-6 text-primary">{gang.name}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="secondary" className="font-mono">{gang.gang_code}</Badge>
                                                    </TableCell>
                                                    <TableCell className="font-mono text-xs text-muted-foreground">{gang.leader_discord_id}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-full bg-muted rounded-full h-2.5 max-w-[100px] overflow-hidden">
                                                                <div
                                                                    className="bg-blue-500 h-2.5 rounded-full"
                                                                    style={{ width: `${(gang.member_count / gang.max_members) * 100}%` }}
                                                                ></div>
                                                            </div>
                                                            <span className="text-xs font-medium">{gang.member_count}/{gang.max_members}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right text-muted-foreground pr-6 text-xs">
                                                        {new Date(gang.created_at).toLocaleDateString('th-TH')}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div >
    );
}
