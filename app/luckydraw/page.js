'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import LuckyDraw from '@/components/LuckyDraw';
import WinnerTicker from '@/components/luckydraw/WinnerTicker';
import PrizeShowcase from '@/components/luckydraw/PrizeShowcase';
import DrawHistory from '@/components/luckydraw/DrawHistory';
import { Loader2, Ticket, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function LuckyDrawPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshHistory, setRefreshHistory] = useState(0);

    useEffect(() => {
        if (status === 'unauthenticated') {
            signIn('discord', { callbackUrl: '/luckydraw' });
        }
    }, [status]);

    const fetchUserData = async () => {
        if (!session) return;
        try {
            const res = await fetch('/api/preregister');
            const data = await res.json();
            if (data.isRegistered) {
                setUserData(data);
            } else {
                router.push('/');
            }
        } catch (error) {
            console.error("Failed to fetch status", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (session) {
            fetchUserData();
        }
    }, [session, router]);

    const handleDrawComplete = async () => {
        await fetchUserData();
        setRefreshHistory(prev => prev + 1);
    };

    if (status === 'loading' || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!session || !userData) return null;

    return (
        <main className="min-h-screen w-full flex flex-col font-sans relative overflow-x-hidden bg-zinc-950">
            {/* Background Image */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-[url('/images/lucky-draw-bg.png')] bg-cover bg-center opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/60 to-zinc-950/90" />
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar />

                {/* Winner Ticker */}
                <div className="pt-16">
                    <WinnerTicker />
                </div>

                <div className="flex-1 container max-w-7xl mx-auto py-8 px-4">
                    {/* Header */}
                    <div className="relative text-center mb-10 space-y-2">
                        <div className="absolute right-0 top-0 hidden md:block">
                            <DrawHistory refreshTrigger={refreshHistory} />
                        </div>
                        <div className="md:hidden absolute right-0 top-0">
                            <DrawHistory refreshTrigger={refreshHistory} />
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-lg">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">
                                LUCKY DRAW
                            </span>
                        </h1>
                        <p className="text-lg text-zinc-300 max-w-2xl mx-auto">
                            เสี่ยงดวงลุ้นรับรางวัลระดับตำนาน! ยิ่งหมุนมาก ยิ่งมีสิทธิ์มาก
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left Column: Lucky Draw Machine (8 cols) */}
                        <div className="lg:col-span-8 space-y-8">
                            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-1 shadow-2xl overflow-hidden relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                <LuckyDraw
                                    ticketCount={userData.ticketCount}
                                    onDrawComplete={handleDrawComplete}
                                    showHistory={false} // Hide internal history
                                />
                            </div>

                            {/* Get More Tickets CTA */}
                            <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-indigo-500/20 rounded-xl">
                                        <Ticket className="w-8 h-8 text-indigo-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">ต้องการตั๋วเพิ่ม?</h3>
                                        <p className="text-indigo-200">ชวนเพื่อนมาร่วมสนุกเพื่อรับตั๋วสุ่มฟรี!</p>
                                    </div>
                                </div>
                                <Link href="/preregister">
                                    <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white border-0 shadow-lg shadow-indigo-500/20">
                                        <Users className="mr-2 h-5 w-5" />
                                        ชวนเพื่อนเลย
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Right Column: Showcase (4 cols) */}
                        <div className="lg:col-span-4 space-y-6">
                            {/* Prize Showcase */}
                            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl sticky top-24">
                                <PrizeShowcase />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
