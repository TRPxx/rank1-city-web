'use client';

import { motion } from 'framer-motion';
import { Sparkles, Zap, Star, Crown } from 'lucide-react';
import Image from 'next/image';

const PRIZES = [
    {
        id: "god_sword",
        name: "God Slayer Sword",
        rarity: "LEGENDARY",
        image: null,
        description: "ดาบเทพเจ้าในตำนาน พลังทำลายล้างสูง"
    },
    {
        id: "mansion_key",
        name: "Luxury Mansion Key",
        rarity: "LEGENDARY",
        image: null,
        description: "กุญแจคฤหาสน์หรูริมหาด พร้อมโรงรถ 10 คัน"
    },
    {
        id: "supercar_key",
        name: "Supercar Key (GTR)",
        rarity: "LEGENDARY",
        image: null,
        description: "รถสปอร์ตความเร็วสูง ดีไซน์โฉบเฉี่ยว"
    },
    {
        id: "golden_sword",
        name: "Golden Guardian",
        rarity: "EPIC",
        image: null,
        description: "ดาบทองคำผู้พิทักษ์"
    },
    {
        id: "gang_van",
        name: "Gang Van Key",
        rarity: "EPIC",
        image: null,
        description: "รถตู้แก๊งสำหรับขนสมาชิก"
    }
];

export default function PrizeShowcase() {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <Crown className="w-5 h-5 text-yellow-500" />
                <h3 className="text-lg font-bold text-white">รางวัลใหญ่ (Jackpot)</h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {PRIZES.map((prize, index) => (
                    <motion.div
                        key={prize.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`relative group overflow-hidden rounded-2xl border p-4 transition-all hover:scale-[1.02] ${prize.rarity === 'LEGENDARY'
                                ? 'bg-gradient-to-br from-yellow-950/40 to-black/60 border-yellow-500/30 hover:border-yellow-500/60 hover:shadow-[0_0_20px_rgba(234,179,8,0.2)]'
                                : 'bg-gradient-to-br from-purple-950/40 to-black/60 border-purple-500/30 hover:border-purple-500/60 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]'
                            }`}
                    >
                        {/* Background Glow Effect */}
                        <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity ${prize.rarity === 'LEGENDARY' ? 'bg-yellow-500' : 'bg-purple-500'
                            }`} />

                        <div className="flex items-center gap-4 relative z-10">
                            <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border-2 shadow-lg ${prize.rarity === 'LEGENDARY'
                                    ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-500'
                                    : 'bg-purple-500/10 border-purple-500/50 text-purple-500'
                                }`}>
                                {prize.image ? (
                                    <Image src={prize.image} alt={prize.name} width={64} height={64} className="object-contain" />
                                ) : (
                                    prize.rarity === 'LEGENDARY' ? <Sparkles className="w-8 h-8" /> : <Zap className="w-8 h-8" />
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className={`font-bold truncate ${prize.rarity === 'LEGENDARY' ? 'text-yellow-400' : 'text-purple-400'
                                        }`}>{prize.name}</h4>
                                    {prize.rarity === 'LEGENDARY' && (
                                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-yellow-500 text-black animate-pulse">
                                            SSR
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                    {prize.description}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
