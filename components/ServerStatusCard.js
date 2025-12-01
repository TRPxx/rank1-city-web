'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Copy, Check, Signal, Play } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ServerStatusCard({ siteConfig }) {
    const [copied, setCopied] = useState(false);
    const [playerCount, setPlayerCount] = useState(0);
    const [maxPlayers, setMaxPlayers] = useState(300);
    const [ping, setPing] = useState(0);

    // Mock Data Simulation
    useEffect(() => {
        const fetchServerStatus = async () => {
            try {
                const res = await fetch('/api/server/players');
                const data = await res.json();

                if (Array.isArray(data)) {
                    setPlayerCount(data.length);
                }

                // Randomize ping slightly for realism even if data is static
                setPing(Math.floor(Math.random() * 20) + 15);
            } catch (error) {
                console.error("Failed to fetch server status");
                // Fallback to 0 or keep previous state
            }
        };

        // Initial fetch
        fetchServerStatus();

        // Poll every 10 seconds
        const interval = setInterval(fetchServerStatus, 10000);

        return () => clearInterval(interval);
    }, []);

    const handleCopyIp = () => {
        navigator.clipboard.writeText('connect.rank1city.com');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const progressPercent = (playerCount / maxPlayers) * 100;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-sm"
        >
            <div className="flex flex-col items-center justify-center text-center space-y-8">

                {/* Status Indicator */}
                <div className="flex items-center gap-3 bg-zinc-100 dark:bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full border border-zinc-200 dark:border-white/5">
                    <div className="relative flex h-3 w-3">
                        {siteConfig?.serverStatusBadge === 'online' && (
                            <>
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.8)]"></span>
                            </>
                        )}
                        {siteConfig?.serverStatusBadge === 'offline' && (
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]"></span>
                        )}
                        {siteConfig?.serverStatusBadge === 'maintenance' && (
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.8)]"></span>
                        )}
                        {siteConfig?.serverStatusBadge === 'beta' && (
                            <>
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]"></span>
                            </>
                        )}
                    </div>
                    <span className={`text-sm font-medium tracking-wide ${siteConfig?.serverStatusBadge === 'online' ? 'text-green-600 dark:text-green-400' :
                        siteConfig?.serverStatusBadge === 'offline' ? 'text-red-600 dark:text-red-400' :
                            siteConfig?.serverStatusBadge === 'maintenance' ? 'text-orange-600 dark:text-orange-400' :
                                'text-blue-600 dark:text-blue-400'
                        }`}>
                        {siteConfig?.serverStatusBadge === 'online' ? 'SERVER ONLINE' :
                            siteConfig?.serverStatusBadge === 'offline' ? 'SERVER OFFLINE' :
                                siteConfig?.serverStatusBadge === 'maintenance' ? 'MAINTENANCE' :
                                    'BETA TESTING'}
                    </span>
                    <div className="w-px h-4 bg-zinc-300 dark:bg-white/10 mx-1"></div>
                    <span className="text-xs font-mono text-zinc-500 dark:text-gray-400 flex items-center gap-1">
                        <Signal className="w-3 h-3" /> {ping}ms
                    </span>
                </div>

                {/* Big Player Count */}
                <div className="relative">
                    <div className="absolute -inset-10 bg-green-500/10 blur-[60px] rounded-full pointer-events-none"></div>
                    <div className="relative flex flex-col items-center">
                        <span className="text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-zinc-900 to-zinc-500 dark:from-white dark:to-white/50 tracking-tight leading-none drop-shadow-2xl px-4 pb-2">
                            {playerCount}
                        </span>
                        <div className="flex items-center gap-2 mt-2 text-lg font-medium text-zinc-500 dark:text-gray-400">
                            <span className="text-zinc-600 dark:text-gray-600">/</span>
                            <span>{maxPlayers}</span>
                            <span className="text-sm bg-zinc-100 dark:bg-white/5 px-2 py-0.5 rounded text-zinc-500 dark:text-gray-500 ml-2">PLAYERS</span>
                        </div>
                    </div>
                </div>

                {/* Progress Line */}
                <div className="w-full max-w-[200px] space-y-2">
                    <div className="h-1 w-full bg-zinc-200 dark:bg-gray-800/50 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-400 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 1 }}
                        />
                    </div>
                </div>

                {/* Connect Actions */}
                <div className="flex flex-col items-center gap-3 w-full max-w-[280px]">
                    <Button
                        className="w-full h-14 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 rounded-full font-bold text-lg shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all transform hover:-translate-y-1"
                        onClick={() => window.location.href = 'fivem://connect/connect.rank1city.com'}
                    >
                        <Play className="w-5 h-5 mr-2 fill-white dark:fill-black" />
                        JOIN SERVER
                    </Button>

                    <div
                        className="flex items-center gap-2 text-sm text-zinc-500 dark:text-gray-500 hover:text-zinc-900 dark:hover:text-white cursor-pointer transition-colors group"
                        onClick={handleCopyIp}
                    >
                        <span className="font-mono group-hover:underline decoration-zinc-400 dark:decoration-gray-600 underline-offset-4">connect.rank1city.com</span>
                        {copied ? <Check className="w-3 h-3 text-green-600 dark:text-green-400" /> : <Copy className="w-3 h-3" />}
                    </div>
                </div>

            </div>
        </motion.div>
    );
}
