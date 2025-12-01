'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Wrench, Clock, MessageCircle, AlertTriangle } from 'lucide-react';
import Image from 'next/image';

export default function MaintenancePage({ discordLink }) {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-black text-white">
            {/* Background */}
            <div className="absolute inset-0 z-0 opacity-30">
                <Image
                    src="/images/hero-bg-fivem.webp"
                    alt="Background"
                    fill
                    className="object-cover grayscale blur-sm"
                />
            </div>
            <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

            {/* Content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 container max-w-2xl px-4 text-center space-y-8"
            >
                {/* Icon */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="mx-auto w-24 h-24 bg-yellow-500/10 rounded-full flex items-center justify-center border border-yellow-500/20 text-yellow-500"
                >
                    <Wrench className="w-12 h-12" />
                </motion.div>

                {/* Text */}
                <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2 text-yellow-500 font-mono text-sm tracking-widest uppercase">
                        <AlertTriangle className="w-4 h-4" />
                        <span>System Maintenance</span>
                        <AlertTriangle className="w-4 h-4" />
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">
                        WE'LL BE BACK
                    </h1>

                    <p className="text-lg md:text-xl text-gray-400 max-w-lg mx-auto">
                        เซิร์ฟเวอร์กำลังปิดปรับปรุงชั่วคราวเพื่ออัปเดตระบบให้ดียิ่งขึ้น
                        ขออภัยในความไม่สะดวก
                    </p>
                </div>

                {/* Status Box */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md max-w-md mx-auto">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-gray-400">Estimated Time</span>
                        <span className="text-sm font-mono text-green-400 flex items-center gap-2">
                            <Clock className="w-3 h-3" /> Soon
                        </span>
                    </div>
                    <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-yellow-500"
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-3 text-center">
                        ทีมงานกำลังเร่งดำเนินการแก้ไข กรุณารอสักครู่...
                    </p>
                </div>

                {/* Actions */}
                <div className="pt-4">
                    <Button
                        size="lg"
                        variant="outline"
                        className="border-white/10 hover:bg-white/10 text-white gap-2"
                        onClick={() => window.open(discordLink || 'https://discord.gg/rank1', '_blank')}
                    >
                        <MessageCircle className="w-5 h-5" />
                        ติดตามข่าวสารใน Discord
                    </Button>
                </div>
            </motion.div>

            {/* Footer */}
            <div className="absolute bottom-8 text-xs text-gray-600 font-mono">
                RANK1 CITY &copy; 2024 • SYSTEM MAINTENANCE MODE
            </div>
        </div>
    );
}
