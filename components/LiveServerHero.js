'use client';

import { Button } from '@/components/ui/button';
import { Play, Download, Users, Zap, Shield, Globe, Facebook } from 'lucide-react';
import { motion } from 'framer-motion';
import ServerStatusCard from '@/components/ServerStatusCard';

export default function LiveServerHero({ siteConfig }) {
    return (
        <div className="relative w-full min-h-[70vh] md:min-h-[80vh] flex items-center justify-center py-12 md:py-20 transition-colors duration-300">
            {/* Grid Background for Small Screens */}
            <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] lg:hidden" />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background lg:hidden" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-center">

                    {/* Left Content */}
                    <div className="flex flex-col gap-5 md:gap-8 text-center lg:text-left">

                        {/* Badges */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-wrap items-center justify-center lg:justify-start gap-2 md:gap-3"
                        >
                            <div className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1 md:py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 text-xs md:text-sm font-bold tracking-wide backdrop-blur-md">
                                <span className="relative flex h-2 w-2 md:h-2.5 md:w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 md:h-2.5 md:w-2.5 bg-green-500"></span>
                                </span>
                                ONLINE NOW
                            </div>
                            <div className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1 md:py-1.5 rounded-full bg-zinc-900/5 dark:bg-white/5 border border-zinc-900/10 dark:border-white/10 text-zinc-900 dark:text-white text-xs md:text-sm font-medium backdrop-blur-md">
                                <Globe className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                Season 1: The Beginning
                            </div>
                        </motion.div>

                        {/* Heading */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="space-y-3 md:space-y-4"
                        >
                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter text-zinc-900 dark:text-white leading-[0.9]">
                                RANK1 <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 via-zinc-600 to-zinc-400 dark:from-white dark:via-gray-200 dark:to-gray-400">
                                    CITY
                                </span>
                            </h1>
                            <p className="text-sm md:text-lg lg:text-xl text-zinc-600 dark:text-gray-400 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed px-2 md:px-0">
                                เปิดประสบการณ์ใหม่แห่งการ Roleplay ที่สมจริงที่สุด
                                พร้อมระบบสังคมคุณภาพและกิจกรรมสุดมันส์ตลอด 24 ชม.
                            </p>
                        </motion.div>

                        {/* Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start pt-2 md:pt-4"
                        >
                            <Button
                                size="lg"
                                className="h-12 md:h-14 px-6 md:px-8 text-base md:text-lg bg-[#5865F2] hover:bg-[#4752C4] text-white border-0 rounded-full font-bold shadow-[0_0_20px_rgba(88,101,242,0.3)] hover:shadow-[0_0_30px_rgba(88,101,242,0.5)] transition-all duration-300 hover:-translate-y-1"
                                onClick={() => window.open(siteConfig?.links?.discord || 'https://discord.gg/rank1', '_blank')}
                            >
                                <svg className="mr-2 w-5 h-5 md:w-6 md:h-6 fill-current" viewBox="0 0 127.14 96.36">
                                    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.11,77.11,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.89,105.89,0,0,0,126.6,80.22c1.24-23.28-5.8-49.75-18.9-72.15ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
                                </svg>
                                <span className="hidden xs:inline">DISCORD</span>
                                <span className="xs:hidden">JOIN</span>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="h-12 md:h-14 px-6 md:px-8 text-base md:text-lg border-zinc-200 dark:border-white/20 hover:bg-[#1877F2] hover:border-[#1877F2] text-zinc-900 dark:text-white hover:text-white rounded-full backdrop-blur-sm transition-all duration-300 hover:-translate-y-1"
                                onClick={() => window.open(siteConfig?.links?.facebook || '#', '_blank')}
                            >
                                <Facebook className="mr-2 w-5 h-5 md:w-6 md:h-6" />
                                <span className="hidden sm:inline">FACEBOOK PAGE</span>
                                <span className="sm:hidden">FACEBOOK</span>
                            </Button>
                        </motion.div>

                        {/* Features/Stats */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="grid grid-cols-3 gap-3 md:gap-4 pt-6 md:pt-8 border-t border-zinc-200 dark:border-white/5 mt-4 md:mt-8"
                        >
                            <div className="text-center lg:text-left">
                                <div className="flex items-center justify-center lg:justify-start gap-1.5 md:gap-2 text-zinc-900 dark:text-white font-bold text-base md:text-xl">
                                    <Users className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                                    10K+
                                </div>
                                <div className="text-xs md:text-sm text-zinc-500 dark:text-gray-500">Active Players</div>
                            </div>
                            <div className="text-center lg:text-left">
                                <div className="flex items-center justify-center lg:justify-start gap-1.5 md:gap-2 text-zinc-900 dark:text-white font-bold text-base md:text-xl">
                                    <Zap className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" />
                                    60FPS
                                </div>
                                <div className="text-xs md:text-sm text-zinc-500 dark:text-gray-500">Optimized</div>
                            </div>
                            <div className="text-center lg:text-left">
                                <div className="flex items-center justify-center lg:justify-start gap-1.5 md:gap-2 text-zinc-900 dark:text-white font-bold text-base md:text-xl">
                                    <Shield className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                                    Secure
                                </div>
                                <div className="text-xs md:text-sm text-zinc-500 dark:text-gray-500">Anti-Cheat</div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Content - Server Card (Hidden on Mobile) */}
                    <div className="relative hidden lg:flex justify-end">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-500/20 dark:from-primary/20 dark:to-purple-500/20 blur-[100px] rounded-full opacity-50" />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, x: 50 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="relative z-10 w-full max-w-md"
                        >
                            <ServerStatusCard siteConfig={siteConfig} />
                        </motion.div>
                    </div>

                </div>
            </div>
        </div>
    );
}
