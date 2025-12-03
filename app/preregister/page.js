'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import PreRegisterDashboard from '@/components/PreRegisterDashboard';
import { Loader2 } from 'lucide-react';

export default function PreRegisterPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            signIn('discord', { callbackUrl: '/preregister' });
        }
    }, [status]);

    useEffect(() => {
        const fetchStatus = async () => {
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

        if (session) {
            fetchStatus();
        }
    }, [session, router]);

    if (status === 'loading' || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!session || !userData) return null;

    return (
        <main className="min-h-screen w-full flex flex-col bg-background pt-16">
            {/* Global Navbar */}
            <Navbar />

            {/* Dashboard Container - Fills remaining space, natural scroll */}
            <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
                <PreRegisterDashboard userData={userData} />
            </div>
        </main>
    );
}
