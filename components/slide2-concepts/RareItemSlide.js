'use client';

import { motion } from 'framer-motion';
import { Star, Sparkles, Car, Shirt, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const items = [
    { id: 1, name: "Lamborghini Aventador SVJ", type: "Vehicle", rarity: "SSR", image: "/images/cars/svj.png", color: "text-yellow-400" },
    { id: 2, name: "Supreme x LV Hoodie", type: "Fashion", rarity: "SR", image: "/images/clothes/supreme.png", color: "text-red-500" },
    { id: 3, name: "Katana 'Dragon Soul'", type: "Weapon", rarity: "UR", image: "/images/weapons/katana.png", color: "text-purple-400" },
];

export default function RareItemSlide() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-white relative overflow-hidden">
            {/* Spotlight Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="container max-w-7xl z-10 px-4">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-medium text-yellow-100">Limited Edition • Season 1 Only</span>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">
                        EXCLUSIVE <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">DROPS</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    {items.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.2 }}
                            className={`relative group ${index === 1 ? 'md:-mt-12' : ''}`} // Stagger layout
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-3xl -z-10 group-hover:from-white/10 transition-colors" />

                            <div className="p-6 flex flex-col items-center text-center">
                                {/* Rarity Badge */}
                                <div className={`absolute top-4 right-4 text-4xl font-black italic opacity-20 group-hover:opacity-100 transition-opacity ${item.color}`}>
                                    {item.rarity}
                                </div>

                                {/* Image Placeholder */}
                                <div className="w-full aspect-square relative mb-8 flex items-center justify-center">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                    {/* Replace with actual Image component */}
                                    <div className="relative z-10 w-48 h-48 bg-black/20 rounded-2xl border border-white/5 flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform duration-500">
                                        {item.type === 'Vehicle' && <Car className="w-16 h-16 text-white/50" />}
                                        {item.type === 'Fashion' && <Shirt className="w-16 h-16 text-white/50" />}
                                        {item.type === 'Weapon' && <Star className="w-16 h-16 text-white/50" />}
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold mb-2">{item.name}</h3>
                                <p className="text-white/40 text-sm mb-6 uppercase tracking-widest">{item.type}</p>

                                <Button variant="outline" className="w-full border-white/10 hover:bg-white text-white hover:text-black transition-colors">
                                    View Details
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
