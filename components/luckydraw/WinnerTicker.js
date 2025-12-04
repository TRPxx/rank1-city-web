'use client';

import { motion } from 'framer-motion';
import { Trophy, Star } from 'lucide-react';

const MOCK_WINNERS = [
    { name: 'User888', item: 'Supercar Key (GTR)', rarity: 'LEGENDARY' },
    { name: 'KillerZ', item: 'God Slayer Sword', rarity: 'LEGENDARY' },
    { name: 'TonyStark', item: 'Luxury Mansion Key', rarity: 'LEGENDARY' },
    { name: 'Somchai', item: 'Gang Van Key', rarity: 'EPIC' },
    { name: 'Lisa_BP', item: 'Golden Guardian Sword', rarity: 'EPIC' },
    { name: 'JohnWick', item: 'Small House Deed', rarity: 'EPIC' },
];

export default function WinnerTicker() {
    return (
        <div className="w-full bg-black/40 backdrop-blur-md border-y border-white/10 overflow-hidden py-2 relative z-20">
            <div className="flex items-center gap-2 absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/60 px-2 py-1 rounded-md">
                <Trophy className="w-4 h-4 text-yellow-500 animate-pulse" />
                <span className="text-xs font-bold text-yellow-500 uppercase tracking-wider">Jackpot Winners</span>
            </div>

            <div className="flex overflow-hidden mask-linear-fade">
                <motion.div
                    className="flex gap-8 pl-40 whitespace-nowrap"
                    animate={{ x: [0, -1000] }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 20
                    }}
                >
                    {[...MOCK_WINNERS, ...MOCK_WINNERS, ...MOCK_WINNERS].map((winner, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                            <span className="font-medium text-white/80">{winner.name}</span>
                            <span className="text-muted-foreground">ได้รับ</span>
                            <span className={`font-bold flex items-center gap-1 ${winner.rarity === 'LEGENDARY' ? 'text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]' :
                                    winner.rarity === 'EPIC' ? 'text-purple-400 drop-shadow-[0_0_5px_rgba(192,132,252,0.5)]' : 'text-blue-400'
                                }`}>
                                {winner.rarity === 'LEGENDARY' && <Star className="w-3 h-3 fill-current" />}
                                {winner.item}
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
