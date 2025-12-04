'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import LuckyDraw from '@/components/LuckyDraw';
import { Loader2 } from 'lucide-react';

export default function LuckyDrawPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

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
        <main className="min-h-screen w-full flex flex-col bg-background font-sans">
            <Navbar />

            <div className="flex-1 container max-w-7xl mx-auto py-8 pt-24 px-4">
                <div className="flex flex-col space-y-2 mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">สุ่มรางวัล</h1>
                    <p className="text-muted-foreground">
                        ใช้ตั๋วของคุณเพื่อสุ่มรับรางวัลพิเศษจาก Rank1 City
                    </p>
                </div>

                <div className="w-full max-w-4xl mx-auto">
                    <LuckyDraw
                        ticketCount={userData.ticketCount}
                        onDrawComplete={handleDrawComplete}
                    />
                </div>
            </div>
        </main>
    );
}
