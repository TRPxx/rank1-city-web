'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Zap, Crown, Star } from 'lucide-react';

const PRIZES = [
    {
        id: "god_sword",
        name: "God Slayer Sword",
        rarity: "LEGENDARY",
        description: "ดาบเทพเจ้าในตำนาน พลังทำลายล้างสูง"
    },
    {
        id: "mansion_key",
        name: "Luxury Mansion Key",
        rarity: "LEGENDARY",
        description: "กุญแจคฤหาสน์หรูริมหาด พร้อมโรงรถ 10 คัน"
    },
    {
        id: "supercar_key",
        name: "Supercar Key (GTR)",
        rarity: "LEGENDARY",
        description: "รถสปอร์ตความเร็วสูง ดีไซน์โฉบเฉี่ยว"
    },
    {
        id: "golden_sword",
        name: "Golden Guardian Sword",
        rarity: "EPIC",
        description: "ดาบทองคำผู้พิทักษ์"
    },
    {
        id: "gang_van",
        name: "Gang Van Key",
        rarity: "EPIC",
        description: "รถตู้แก๊งสำหรับขนสมาชิก"
    },
    {
        id: "house_deed",
        name: "Small House Deed",
        rarity: "EPIC",
        description: "โฉนดบ้านหลังเล็ก"
    },
    {
        id: "iron_sword",
        name: "Iron Sword",
        rarity: "RARE",
        description: "ดาบเหล็กพื้นฐาน"
    },
    {
        id: "starter_food",
        name: "Starter Food Pack",
        rarity: "COMMON",
        description: "ชุดอาหารเริ่มต้น"
    }
];

export default function PrizeInfoButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const getRarityStyle = (rarity) => {
        switch (rarity) {
            case 'LEGENDARY':
                return 'border-yellow-500/30 bg-yellow-500/5 text-yellow-500';
            case 'EPIC':
                return 'border-purple-500/30 bg-purple-500/5 text-purple-500';
            case 'RARE':
                return 'border-blue-500/30 bg-blue-500/5 text-blue-500';
            default:
                return 'border-gray-500/30 bg-gray-500/5 text-gray-500';
        }
    };

    const getRarityBadge = (rarity) => {
        switch (rarity) {
            case 'LEGENDARY':
                return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-500/20 text-yellow-500 border border-yellow-500/30">SSR</span>;
            case 'EPIC':
                return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-500 border border-purple-500/30">SR</span>;
            case 'RARE':
                return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-500 border border-blue-500/30">R</span>;
            default:
                return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-500/20 text-gray-500 border border-gray-500/30">N</span>;
        }
    };

    const getRarityIcon = (rarity) => {
        switch (rarity) {
            case 'LEGENDARY':
                return <Crown className="w-6 h-6" />;
            case 'EPIC':
                return <Sparkles className="w-6 h-6" />;
            case 'RARE':
                return <Star className="w-6 h-6" />;
            default:
                return <Zap className="w-6 h-6" />;
        }
    };

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-lg max-h-[80vh] overflow-hidden pointer-events-auto"
                        >
                            <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
                                {/* Header */}
                                <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/10 to-transparent">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <Crown className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-foreground">รางวัลทั้งหมด</h3>
                                            <p className="text-xs text-muted-foreground">รางวัลที่สามารถสุ่มได้</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Prize List */}
                                <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
                                    {PRIZES.map((prize) => (
                                        <div
                                            key={prize.id}
                                            className={`flex items-center gap-4 p-4 rounded-xl border ${getRarityStyle(prize.rarity)}`}
                                        >
                                            <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${getRarityStyle(prize.rarity)}`}>
                                                {getRarityIcon(prize.rarity)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-bold">{prize.name}</h4>
                                                    {getRarityBadge(prize.rarity)}
                                                </div>
                                                <p className="text-xs text-muted-foreground">{prize.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );

    return (
        <>
            {/* Prize Badge Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium transition-colors border border-primary/20"
            >
                <Crown className="w-4 h-4" />
                ดูรางวัล
            </button>

            {/* Modal - using Portal */}
            {mounted && createPortal(modalContent, document.body)}
        </>
    );
}
