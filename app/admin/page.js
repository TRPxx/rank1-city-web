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
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!session?.user?.isAdmin) {
        return null; // Prevent flash of content before redirect
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container pt-24 pb-12">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                        <p className="text-muted-foreground">Manage your server events and users</p>
                    </div>
                    <Link href="/admin/settings">
                        <Button variant="outline">
                            <Settings className="mr-2 h-4 w-4" /> Settings
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.total_users || 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Gangs</CardTitle>
                            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.total_gangs || 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tickets Held</CardTitle>
                            <Ticket className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.total_tickets_held || 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Spins</CardTitle>
                            <Trophy className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.total_spins || 0}</div>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="users">User Management</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                            <Card className="col-span-4">
                                <CardHeader>
                                    <CardTitle>Recent Registrations</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Discord ID</TableHead>
                                                <TableHead>Referral Code</TableHead>
                                                <TableHead className="text-right">Date</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {recentUsers.map((user, i) => (
                                                <TableRow key={i}>
                                                    <TableCell className="font-mono text-xs">{user.discord_id}</TableCell>
                                                    <TableCell>{user.referral_code}</TableCell>
                                                    <TableCell className="text-right text-muted-foreground">
                                                        {new Date(user.created_at).toLocaleDateString()}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                            <Card className="col-span-3">
                                <CardHeader>
                                    <CardTitle>Recent Lucky Draw Wins</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-8">
                                        {recentWins.map((win, i) => (
                                            <div key={i} className="flex items-center">
                                                <div className="ml-4 space-y-1">
                                                    <p className="text-sm font-medium leading-none">{win.item_name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Winner: {win.discord_id.substring(0, 8)}...
                                                    </p>
                                                </div>
                                                <div className="ml-auto font-medium text-xs text-muted-foreground">
                                                    {new Date(win.created_at).toLocaleTimeString()}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="users">
                        <Card>
                            <CardHeader>
                                <CardTitle>Search Users</CardTitle>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Search by Discord ID or Referral Code..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <Button onClick={handleSearch}>
                                        <Search className="mr-2 h-4 w-4" /> Search
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Discord ID</TableHead>
                                            <TableHead>Gang</TableHead>
                                            <TableHead>Tickets</TableHead>
                                            <TableHead>Points</TableHead>
                                            <TableHead>Ref Code</TableHead>
                                            <TableHead>Invited By</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {searchResults.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-mono">{user.discord_id}</TableCell>
                                                <TableCell>
                                                    {user.gang_name ? (
                                                        <Badge variant="outline">{user.gang_name}</Badge>
                                                    ) : '-'}
                                                </TableCell>
                                                <TableCell>{user.ticket_count}</TableCell>
                                                <TableCell>{user.points}</TableCell>
                                                <TableCell>{user.referral_code}</TableCell>
                                                <TableCell>{user.invited_by || '-'}</TableCell>
                                            </TableRow>
                                        ))}
                                        {searchResults.length === 0 && searchQuery && (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                                    No users found
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
