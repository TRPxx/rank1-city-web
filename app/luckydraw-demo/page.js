'use client';

import { useState } from 'react';
import LuckyDrawCSGO from '@/components/LuckyDrawCSGO';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function LuckyDrawDemoPage() {
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

                <LuckyDrawCSGO
                    ticketCount={tickets}
                    onDrawComplete={handleDrawComplete}
                />

                <div className="mt-12 p-4 border rounded-lg bg-muted/20 max-w-md text-center">
                    <p className="text-sm text-muted-foreground">
                        หน้านี้เป็นหน้า Demo สำหรับทดสอบระบบสุ่มรางวัลแบบใหม่ <br />
                        ข้อมูลในหน้านี้จะไม่ถูกบันทึกลงฐานข้อมูลจริง
                    </p>
                    <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={() => setTickets(100)}
                    >
                        Reset Tickets
                    </Button>
                </div>
            </div>
        </main>
    );
}
