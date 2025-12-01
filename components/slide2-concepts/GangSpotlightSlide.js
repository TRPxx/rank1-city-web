'use client';

import { motion } from 'framer-motion';
import { Trophy, Swords, Crown, Users } from 'lucide-react';
import Image from 'next/image';

const gangs = [
    { id: 1, name: "YAKUZA", motto: "Honor Above All", members: 45, color: "from-red-600 to-red-900", logo: "/images/gangs/yakuza.png" },
    { id: 2, name: "CARTEL", motto: "Plata o Plomo", members: 38, color: "from-yellow-600 to-yellow-900", logo: "/images/gangs/cartel.png" },
    { id: 3, name: "MAFIA", motto: "Family First", members: 32, color: "from-purple-600 to-purple-900", logo: "/images/gangs/mafia.png" },
];

export default function GangSpotlightSlide() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 text-white relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

            <div className="container max-w-6xl z-10 px-4">
                <div className="flex flex-col md:flex-row items-end justify-between mb-12 border-b border-white/10 pb-6">
                    <div>
                        <div className="flex items-center gap-3 text-yellow-500 mb-2">
                            <Crown className="w-6 h-6" />
                            <span className="font-mono tracking-widest uppercase">Hall of Fame</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase">
                            Top <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Gangs</span>
                        </h2>
                    </div>
                    <p className="text-gray-400 max-w-sm text-right mt-4 md:mt-0">
                        ทำเนียบผู้มีอิทธิพลสูงสุดประจำ Season 1 <br />
                        ยึดครองพื้นที่และสร้างตำนานของคุณ
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {gangs.map((gang, index) => (
                        <motion.div
                            key={gang.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 }}
                            className="group relative h-[400px] rounded-3xl overflow-hidden cursor-pointer"
                        >
                            {/* Background Image/Gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-b ${gang.color} opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                            {/* Content */}
                            <div className="absolute inset-0 flex flex-col items-center justify-end p-8 text-center">
                                {/* Logo Placeholder */}
                                <div className="w-32 h-32 rounded-full bg-black/50 border-2 border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                                    <Swords className="w-12 h-12 text-white/50" />
                                </div>

                                <h3 className="text-4xl font-black tracking-tighter mb-2">{gang.name}</h3>
                                <p className="text-white/60 font-medium italic mb-6">"{gang.motto}"</p>

                                <div className="flex items-center gap-4 text-sm font-mono border-t border-white/10 pt-4 w-full justify-center">
                                    <div className="flex items-center gap-2">
                                        <Trophy className="w-4 h-4 text-yellow-500" />
                                        <span>Rank #{index + 1}</span>
                                    </div>
                                    <div className="w-1 h-1 bg-white/20 rounded-full" />
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-blue-500" />
                                        <span>{gang.members} Members</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
