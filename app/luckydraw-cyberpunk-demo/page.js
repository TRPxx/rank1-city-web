'use client';

import { useState } from 'react';
import LuckyDrawCyberpunk from '@/components/LuckyDrawCyberpunk';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CyberpunkDemoPage() {
    const [tickets, setTickets] = useState(100);

    const handleDrawComplete = (result) => {
        setTickets(prev => Math.max(0, prev - 1));
        console.log('Won:', result);
    };

    return (
        <main className="min-h-screen bg-black text-green-500 font-mono flex flex-col">
            <Navbar />

            <div className="flex-1 container py-20 flex flex-col items-center justify-center">
                <div className="w-full mb-8">
                    <Link href="/preregister">
                        <Button variant="ghost" className="gap-2 text-green-500 hover:text-green-400 hover:bg-green-900/20">
                            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                        </Button>
                    </Link>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2 tracking-widest">CYBERPUNK_HACK</h1>
                    <p className="text-green-500/60">Execute the script to decrypt rewards.</p>
                </div>

                <LuckyDrawCyberpunk
                    ticketCount={tickets}
                    onDrawComplete={handleDrawComplete}
                />

                <div className="mt-12 p-4 border border-green-900 bg-black/50 max-w-md text-center">
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-green-500 text-green-500 hover:bg-green-500 hover:text-black"
                        onClick={() => setTickets(100)}
                    >
                        RESET_KEYS
                    </Button>
                </div>
            </div>
        </main>
    );
}
