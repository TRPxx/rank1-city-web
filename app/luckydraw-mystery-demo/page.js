'use client';

import { useState } from 'react';
import LuckyDrawMysteryBox from '@/components/LuckyDrawMysteryBox';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function MysteryBoxDemoPage() {
    const [tickets, setTickets] = useState(100);

    const handleDrawComplete = (result) => {
        setTickets(prev => Math.max(0, prev - 1));
        console.log('Won:', result);
    };

    return (
        <main className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <div className="flex-1 container py-20 flex flex-col items-center justify-center">
                <div className="w-full mb-8">
                    <Link href="/preregister">
                        <Button variant="ghost" className="gap-2">
                            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                        </Button>
                    </Link>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Mystery Box Style</h1>
                    <p className="text-muted-foreground">Click the box to open!</p>
                </div>

                <LuckyDrawMysteryBox
                    ticketCount={tickets}
                    onDrawComplete={handleDrawComplete}
                />

                <div className="mt-12 p-4 border rounded-lg bg-muted/20 max-w-md text-center">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setTickets(100)}
                    >
                        Reset Tickets
                    </Button>
                </div>
            </div>
        </main>
    );
}
