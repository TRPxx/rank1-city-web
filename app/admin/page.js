'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ShieldAlert, Users, Ticket, Search, Loader2 } from 'lucide-react';

export default function AdminPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState(null);

    useEffect(() => {
        if (status === 'unauthenticated') {
            signIn('discord', { callbackUrl: '/admin' });
        }
    }, [status]);

    useEffect(() => {
        if (session) fetchStats();
    }, [session]);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/admin');
            if (res.status === 403) {
                alert('Access Denied: You are not an admin.');
                router.push('/');
                return;
            }
            const data = await res.json();
            setStats(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery) return;
        setIsLoading(true);
        try {
            const res = await fetch(`/api/admin?q=${searchQuery}`);
            const data = await res.json();
            setSearchResults(data.users);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    if (status === 'loading' || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-10 w-10 animate-spin text-destructive" />
            </div>
        );
    }

    if (!session || !stats) return null;

    return (
        <main className="min-h-screen bg-background p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold flex items-center gap-2 text-destructive">
                        <ShieldAlert /> Admin Dashboard
                    </h1>
                    <Button variant="outline" onClick={() => router.push('/')}>Back to Home</Button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard title="Total Users" value={stats.stats.total_users} icon={<Users />} />
                    <StatCard title="Total Gangs" value={stats.stats.total_gangs} icon={<ShieldAlert />} />
                    <StatCard title="Tickets Held" value={stats.stats.total_tickets_held} icon={<Ticket />} />
                    <StatCard title="Total Spins" value={stats.stats.total_spins} icon={<Ticket />} />
                </div>

                {/* Search Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>User Management</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Search by Discord ID or Referral Code..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <Button onClick={handleSearch}><Search className="mr-2 h-4 w-4" /> Search</Button>
                        </div>

                        {searchResults && (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Discord ID</TableHead>
                                        <TableHead>Code</TableHead>
                                        <TableHead>Gang</TableHead>
                                        <TableHead>Tickets</TableHead>
                                        <TableHead>Invites</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {searchResults.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-mono">{user.discord_id}</TableCell>
                                            <TableCell>{user.referral_code}</TableCell>
                                            <TableCell>{user.gang_name || '-'}</TableCell>
                                            <TableCell>{user.ticket_count}</TableCell>
                                            <TableCell>{user.invite_count}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader><CardTitle>Recent Registrations</CardTitle></CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm">
                                {stats.recentUsers.map((u, i) => (
                                    <li key={i} className="flex justify-between border-b pb-1">
                                        <span>{u.discord_id}</span>
                                        <span className="text-muted-foreground">{new Date(u.created_at).toLocaleString()}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Recent Lucky Draws</CardTitle></CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm">
                                {stats.recentWins.map((w, i) => (
                                    <li key={i} className="flex justify-between border-b pb-1">
                                        <span>{w.item_name}</span>
                                        <span className="text-muted-foreground">{new Date(w.created_at).toLocaleString()}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}

function StatCard({ title, value, icon }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <div className="text-muted-foreground">{icon}</div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    );
}
