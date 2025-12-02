'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Ticket, Trophy, Search, Settings, Loader2, ShieldAlert } from 'lucide-react';
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

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [stats, setStats] = useState(null);
    const [recentUsers, setRecentUsers] = useState([]);
    const [recentWins, setRecentWins] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/admin');
            if (!res.ok) throw new Error('Failed to fetch data');
            const data = await res.json();
            setStats(data.stats);
            setRecentUsers(data.recentUsers);
            setRecentWins(data.recentWins);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsLoading(true);
        try {
            const res = await fetch(`/api/admin?q=${searchQuery}`);
            const data = await res.json();
            setSearchResults(data.users || []);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
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

    if (status === 'loading' || isLoading) {
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
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight mb-2">แดชบอร์ดผู้ดูแลระบบ</h1>
                        <p className="text-lg text-muted-foreground">จัดการกิจกรรมเซิร์ฟเวอร์และผู้ใช้งาน</p>
                    </div>
                    <Link href="/admin/settings">
                        <Button variant="outline" className="rounded-full px-6 border-muted-foreground/20 hover:bg-muted">
                            <Settings className="mr-2 h-4 w-4" /> ตั้งค่าระบบ
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
                    <div className="bg-muted/30 rounded-[2rem] p-6 relative overflow-hidden group hover:bg-muted/40 transition-colors">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Users className="h-24 w-24" />
                        </div>
                        <div className="relative">
                            <div className="p-3 bg-blue-500/10 w-fit rounded-2xl mb-4">
                                <Users className="h-6 w-6 text-blue-500" />
                            </div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">ผู้ใช้งานทั้งหมด</p>
                            <div className="text-3xl font-bold">{stats?.total_users?.toLocaleString() || 0}</div>
                        </div>
                    </div>

                    <div className="bg-muted/30 rounded-[2rem] p-6 relative overflow-hidden group hover:bg-muted/40 transition-colors">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                            <ShieldAlert className="h-24 w-24" />
                        </div>
                        <div className="relative">
                            <div className="p-3 bg-red-500/10 w-fit rounded-2xl mb-4">
                                <ShieldAlert className="h-6 w-6 text-red-500" />
                            </div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">แก๊งทั้งหมด</p>
                            <div className="text-3xl font-bold">{stats?.total_gangs?.toLocaleString() || 0}</div>
                        </div>
                    </div>

                    <div className="bg-muted/30 rounded-[2rem] p-6 relative overflow-hidden group hover:bg-muted/40 transition-colors">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Ticket className="h-24 w-24" />
                        </div>
                        <div className="relative">
                            <div className="p-3 bg-amber-500/10 w-fit rounded-2xl mb-4">
                                <Ticket className="h-6 w-6 text-amber-500" />
                            </div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">ตั๋วที่มีในระบบ</p>
                            <div className="text-3xl font-bold">{stats?.total_tickets_held?.toLocaleString() || 0}</div>
                        </div>
                    </div>

                    <div className="bg-muted/30 rounded-[2rem] p-6 relative overflow-hidden group hover:bg-muted/40 transition-colors">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Trophy className="h-24 w-24" />
                        </div>
                        <div className="relative">
                            <div className="p-3 bg-emerald-500/10 w-fit rounded-2xl mb-4">
                                <Trophy className="h-6 w-6 text-emerald-500" />
                            </div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">ยอดการหมุนวงล้อ</p>
                            <div className="text-3xl font-bold">{stats?.total_spins?.toLocaleString() || 0}</div>
                        </div>
                    </div>
                </div>

                <Tabs defaultValue="overview" className="space-y-8">
                    <TabsList className="bg-muted/50 p-1 rounded-full h-auto inline-flex">
                        <TabsTrigger value="overview" className="rounded-full px-6 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">ภาพรวม</TabsTrigger>
                        <TabsTrigger value="users" className="rounded-full px-6 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">จัดการผู้ใช้</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6 mt-0">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                            <div className="col-span-4 bg-card rounded-[2.5rem] border border-border/50 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-border/50">
                                    <h3 className="text-xl font-bold">การลงทะเบียนล่าสุด</h3>
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

                            <div className="col-span-3 bg-card rounded-[2.5rem] border border-border/50 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-border/50">
                                    <h3 className="text-xl font-bold">ผู้โชคดีล่าสุด</h3>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-6">
                                        {recentWins.map((win, i) => (
                                            <div key={i} className="flex items-center p-3 rounded-2xl hover:bg-muted/30 transition-colors">
                                                <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                                                    <Trophy className="h-5 w-5" />
                                                </div>
                                                <div className="ml-4 space-y-1 overflow-hidden">
                                                    <p className="text-sm font-bold leading-none truncate">{win.item_name}</p>
                                                    <p className="text-xs text-muted-foreground truncate">
                                                        ผู้ชนะ: {win.discord_id}
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

                    <TabsContent value="users" className="mt-0">
                        <div className="bg-card rounded-[2.5rem] border border-border/50 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
                                <h3 className="text-xl font-bold">ค้นหาผู้ใช้งาน</h3>
                                <div className="flex gap-2 w-full md:w-auto">
                                    <div className="relative flex-1 md:w-80">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="ค้นหาด้วย Discord ID หรือ รหัสแนะนำ..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-9 rounded-xl bg-muted/30 border-transparent focus:bg-background"
                                        />
                                    </div>
                                    <Button onClick={handleSearch} className="rounded-xl px-6">
                                        ค้นหา
                                    </Button>
                                </div>
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
                                        {searchResults.length === 0 && searchQuery && (
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
                </Tabs>
            </div>
        </div>
    );
}
