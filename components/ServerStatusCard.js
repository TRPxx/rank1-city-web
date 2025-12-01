'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Copy, Check, Signal, Wifi } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ServerStatusCard() {
    const [copied, setCopied] = useState(false);
    const [playerCount, setPlayerCount] = useState(0);
    const [maxPlayers, setMaxPlayers] = useState(300);
    const [ping, setPing] = useState(0);

    // Mock Data Simulation
    useEffect(() => {
        // Randomize player count slightly to make it look alive
        const baseCount = 120;
        setPlayerCount(baseCount + Math.floor(Math.random() * 20));
        setPing(Math.floor(Math.random() * 20) + 15);

        const interval = setInterval(() => {
            setPlayerCount(prev => {
                const change = Math.floor(Math.random() * 5) - 2;
                return Math.min(maxPlayers, Math.max(0, prev + change));
            });
            setPing(Math.floor(Math.random() * 20) + 15);
        }, 5000);

        return () => clearInterval(interval);
    }, [maxPlayers]);

    const handleCopyIp = () => {
        navigator.clipboard.writeText('connect.rank1city.com'); // Replace with real IP
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const progressPercent = (playerCount / maxPlayers) * 100;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
        >
            <Card className="bg-black/40 backdrop-blur-md border-white/10 text-white overflow-hidden shadow-2xl">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <div className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </div>
                            Server Online
                        </CardTitle>
                        <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20 flex gap-1 items-center">
                            <Wifi className="w-3 h-3" /> {ping}ms
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Player Count */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm font-medium text-gray-300">
                            <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Players Online</span>
                            <span>{playerCount} / {maxPlayers}</span>
                        </div>
                        <div className="h-3 w-full bg-gray-700/50 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-green-500 to-emerald-400"
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercent}%` }}
                                transition={{ duration: 1 }}
                            />
                        </div>
                    </div>

                    {/* Connection Info */}
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">Server IP</span>
                            <span className="text-xs text-emerald-400 font-mono">FiveM Legacy</span>
                        </div>
                        <div className="flex gap-2">
                            <div className="flex-1 bg-black/50 rounded px-3 py-2 text-sm font-mono text-gray-300 border border-white/5 truncate">
                                connect.rank1city.com
                            </div>
                            <Button
                                size="icon"
                                variant="secondary"
                                className="shrink-0 hover:bg-white/20"
                                onClick={handleCopyIp}
                            >
                                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                            </Button>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-3">
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 border-0 shadow-lg shadow-blue-500/20">
                            Download Launcher
                        </Button>
                        <Button variant="outline" className="w-full border-white/10 hover:bg-white/10 hover:text-white">
                            Status Page
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
