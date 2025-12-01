'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Wrench, Clock, MessageCircle, AlertTriangle } from 'lucide-react';
import Image from 'next/image';

export default function MaintenancePage({ discordLink }) {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-zinc-950 text-white">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/hero-bg-fivem.webp"
                    alt="Background"
                    fill
                    className="object-cover opacity-20 blur-sm grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-900/20 via-zinc-950/0 to-zinc-950/0" />
            </div>

            {/* Content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 container max-w-4xl px-4 text-center space-y-12"
            >
                {/* Icon & Badge */}
                <div className="space-y-6">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="mx-auto w-32 h-32 rounded-full bg-orange-500/5 flex items-center justify-center border border-orange-500/20 shadow-[0_0_30px_rgba(249,115,22,0.1)]"
                    >
                        <Wrench className="w-16 h-16 text-orange-500" />
                    </motion.div>

                    <div className="flex justify-center">
                        <Badge variant="outline" className="border-orange-500/50 text-orange-500 bg-orange-500/5 px-4 py-1 text-sm gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            SYSTEM MAINTENANCE
                        </Badge>
                    </div>
                </div>

                {/* Main Text */}
                <div className="space-y-4">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500">
                        WE'LL BE BACK
                    </h1>
                    <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto font-light">
                        เซิร์ฟเวอร์กำลังปิดปรับปรุงชั่วคราวเพื่ออัปเดตระบบให้ดียิ่งขึ้น
                        <br className="hidden md:block" />
                        ขออภัยในความไม่สะดวก
                    </p>
                </div>

                {/* Progress & Status */}
                <div className="max-w-md mx-auto space-y-4">
                    <div className="flex items-center justify-between text-sm text-zinc-500 px-1">
                        <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-orange-500" />
                            ESTIMATED TIME
                        </span>
                        <span className="text-orange-400 font-mono">SOON</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-orange-600 to-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </div>
                </div>

                {/* Action Button */}
                <div className="pt-8">
                    <Button
                        size="lg"
                        className="h-14 px-8 text-lg bg-orange-600 hover:bg-orange-700 text-white border-none rounded-full shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] transition-all duration-300"
                        onClick={() => window.open(discordLink || 'https://discord.gg/rank1', '_blank')}
                    >
                        <MessageCircle className="w-6 h-6 mr-2" />
                        ติดตามข่าวสารใน Discord
                    </Button>
                </div>
            </motion.div>

            {/* Footer */}
            <div className="absolute bottom-8 text-xs text-zinc-600 font-mono tracking-widest">
                RANK1 CITY &copy; {new Date().getFullYear()} • MAINTENANCE MODE
            </div>
        </div>
    );
}
