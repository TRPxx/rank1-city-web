'use client';

import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { motion, useSpring, useTransform } from 'framer-motion';

export default function GlobalRegisCounter() {
    const [count, setCount] = useState(0);

    // Spring animation for smooth counting
    const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
    const display = useTransform(spring, (current) => Math.round(current).toLocaleString());

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/preregister/stats');
                const data = await res.json();
                if (data.total) {
                    setCount(data.total);
                    spring.set(data.total);
                }
            } catch (error) {
                console.error("Failed to fetch stats");
            }
        };

        fetchStats();
        // Poll every 30 seconds
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, [spring]);

    return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-background/60 backdrop-blur-md px-4 py-2 rounded-full border border-primary/30 shadow-lg shadow-primary/10">
            <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="font-medium">ชาวเมืองที่ลงทะเบียนแล้ว:</span>
            <motion.span className="font-bold text-primary text-lg font-mono">
                {display}
            </motion.span>
        </div>
    );
}
