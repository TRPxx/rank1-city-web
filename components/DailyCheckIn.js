'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function DailyCheckIn({ onCheckInSuccess }) {
    const [canCheckIn, setCanCheckIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isCheckingIn, setIsCheckingIn] = useState(false);

    useEffect(() => {
        fetchStatus();
    }, []);

    const fetchStatus = async () => {
        try {
            const res = await fetch('/api/checkin');
            const data = await res.json();
            setCanCheckIn(data.canCheckIn);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCheckIn = async () => {
        setIsCheckingIn(true);
        try {
            const res = await fetch('/api/checkin', { method: 'POST' });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            // Success
            setCanCheckIn(false);
            if (onCheckInSuccess) onCheckInSuccess();
            toast.success('เช็คชื่อสำเร็จ! คุณได้รับตั๋วสุ่มรางวัล 1 ใบ');

        } catch (error) {
            toast.error(error.message || 'เกิดข้อผิดพลาดในการเช็คชื่อ');
        } finally {
            setIsCheckingIn(false);
        }
    };

    if (isLoading) return <div className="h-10 w-32 bg-muted animate-pulse rounded-md" />;

    return (
        <Button
            onClick={handleCheckIn}
            disabled={!canCheckIn || isCheckingIn}
            variant={canCheckIn ? "default" : "secondary"}
            className={canCheckIn ? "bg-green-600 hover:bg-green-700 animate-bounce" : ""}
        >
            {isCheckingIn ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <CalendarCheck className="mr-2 h-4 w-4" />
            )}
            {canCheckIn ? 'Daily Check-in (+1 Ticket)' : 'Checked In Today'}
        </Button>
    );
}
