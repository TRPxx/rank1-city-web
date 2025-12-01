'use client';

import { Button } from '@/components/ui/button';
import { PlayCircle, Download, MonitorPlay, Users, Zap, Globe, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import ServerStatusCard from '@/components/ServerStatusCard';

export default function LiveServerHero({ siteConfig }) {
    return (
        <div className="relative w-full h-full flex items-center">
            {/* Content Container */}
            <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-20">

                {/* Left Column: Action & Text */}
                <div className="lg:col-span-7 flex flex-col gap-8 text-center lg:text-left z-10">

                    {/* Status Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center lg:justify-start gap-3"
                    >
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium backdrop-blur-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            LIVE SERVER
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium backdrop-blur-sm">
                            <Globe className="w-3 h-3" />
                            Season 1
                        </div>
                    </motion.div>

                    {/* Main Title */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-[0.9] drop-shadow-2xl">
                            ENTER THE <br />
                            <span className="text-white">
                                METAVERSE
                            </span>
                        </h1>
                        <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed drop-shadow-md">
                            สัมผัสประสบการณ์ Roleplay ระดับ Next-Gen ที่สมจริงที่สุด
                            ระบบเศรษฐกิจเสถียร สังคมคุณภาพ และกิจกรรมตลอด 24 ชม.
                        </p>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                    >
                        <Button
                            size="lg"
                            className="h-16 px-8 text-xl bg-white text-black hover:bg-gray-200 border-0 rounded-full font-bold transition-all transform hover:scale-105"
                            onClick={() => window.location.href = 'fivem://connect/connect.rank1city.com'}
                        >
                            <PlayCircle className="mr-2 w-6 h-6 fill-black" />
                            PLAY NOW
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="h-16 px-8 text-xl border-white/20 hover:bg-white/10 text-white rounded-full backdrop-blur-sm transition-all hover:scale-105"
                            onClick={() => window.open(siteConfig?.links?.download || '#', '_blank')}
                        >
                            <Download className="mr-2 w-6 h-6" />
                            LAUNCHER
                        </Button>
                    </motion.div>

                    {/* Stats / Trust Indicators */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 text-sm text-gray-400 font-medium"
                    >
                        <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/5">
                            <Users className="w-4 h-4 text-primary" />
                            <span>10,000+ Registered</span>
                        </div>
                        <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/5">
                            <Zap className="w-4 h-4 text-yellow-500" />
                            <span>High Performance</span>
                        </div>
                        <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/5">
                            <ShieldCheck className="w-4 h-4 text-green-500" />
                            <span>Anti-Cheat Protected</span>
                        </div>
                    </motion.div>
                </div>

                {/* Right Column: Server Card & Visuals */}
                <div className="lg:col-span-5 relative hidden lg:flex justify-center items-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, x: 50 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
                        className="relative z-10 w-full max-w-md"
                    >
                        <ServerStatusCard />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
