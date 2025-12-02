'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronRight, Users, Shield, Zap, Car, Briefcase, Home, Star, Heart, Trophy, Target, Flag, MapPin, Gift, Activity, Settings, MessageCircle, PlayCircle, Gamepad2, Info, HelpCircle, Search } from 'lucide-react';

// Icon mapping
const iconMap = {
    Users, Shield, Zap, Car, Briefcase, Home, Star, Heart, Trophy, Target, Flag, MapPin, Gift, Activity, Settings, MessageCircle, PlayCircle, Gamepad2, Info, HelpCircle, Search
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
};

export default function FeatureTabs({ features = [] }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [activeTab, setActiveTab] = useState('');
    const [[page, direction], setPage] = useState([0, 0]);

    useEffect(() => {
        if (features.length > 0 && !activeTab) {
            setActiveTab(features[0].id);
        }
    }, [features, activeTab]);

    if (!features || features.length === 0) return null;

    const activeFeature = features[activeIndex] || features[0];
    const activeFeatureByTab = features.find(f => f.id === activeTab) || features[0];
    const ActiveIcon = iconMap[activeFeatureByTab.icon] || Star;
    const MobileIcon = iconMap[activeFeature.icon] || Star;

    const paginate = (newDirection) => {
        const newIndex = (activeIndex + newDirection + features.length) % features.length;
        setActiveIndex(newIndex);
        setPage([page + newDirection, newDirection]);
    };

    return (
        <div className="w-full max-w-7xl mx-auto h-full flex flex-col">
            {/* MOBILE/TABLET VIEW (< lg) */}
            <div className="lg:hidden w-full h-full flex flex-col px-4">
                <div className="flex justify-center gap-1.5 mb-6">
                    {features.map((_, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                "h-1 rounded-full transition-all duration-300",
                                activeIndex === idx ? "w-8 bg-primary" : "w-2 bg-primary/20"
                            )}
                        />
                    ))}
                </div>

                <div className="flex-1 relative overflow-hidden">
                    <AnimatePresence initial={false} custom={direction} mode="wait">
                        <motion.div
                            key={activeIndex}
                            custom={direction}
                            initial={{ x: direction > 0 ? 200 : -200, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: direction > 0 ? -200 : 200, opacity: 0 }}
                            transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={1}
                            onDragEnd={(e, { offset, velocity }) => {
                                const swipe = swipePower(offset.x, velocity.x);
                                if (swipe < -swipeConfidenceThreshold) paginate(1);
                                else if (swipe > swipeConfidenceThreshold) paginate(-1);
                            }}
                            className="absolute inset-0 pb-8"
                        >
                            <div className="h-full overflow-hidden rounded-3xl bg-muted/30">
                                <div className="relative h-[55%] w-full">
                                    <Image
                                        src={activeFeature.image}
                                        alt={activeFeature.title}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                                </div>
                                <div className="p-6 relative -mt-12">
                                    <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-background shadow-sm mb-4">
                                        <MobileIcon className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2 tracking-tight">{activeFeature.title}</h3>
                                    <p className="text-muted-foreground mb-6 text-sm leading-relaxed">{activeFeature.description}</p>

                                    <div className="grid grid-cols-3 gap-3">
                                        {activeFeature.stats.map((stat, idx) => (
                                            <div key={idx} className="text-center p-3 bg-background/50 rounded-2xl">
                                                <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-1">{stat.label}</div>
                                                <div className="font-bold text-sm">{stat.value}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* DESKTOP VIEW (≥ lg) */}
            <div className="hidden lg:flex h-full max-h-[650px] gap-8">
                {/* Sidebar Navigation */}
                <div className="w-[300px] flex flex-col py-4">
                    <div className="mb-6 px-4">
                        <h3 className="font-semibold text-xl tracking-tight">System Features</h3>
                        <p className="text-sm text-muted-foreground mt-1">Explore our unique gameplay systems</p>
                    </div>
                    <ScrollArea className="flex-1 -mr-4 pr-4">
                        <div className="space-y-1" role="tablist" aria-orientation="vertical">
                            {features.map((feature) => {
                                const Icon = iconMap[feature.icon] || Star;
                                const isActive = activeTab === feature.id;
                                return (
                                    <button
                                        key={feature.id}
                                        role="tab"
                                        aria-selected={isActive}
                                        onClick={() => setActiveTab(feature.id)}
                                        className={cn(
                                            "w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-200 group relative overflow-hidden",
                                            isActive
                                                ? "bg-primary/10 text-primary font-medium"
                                                : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTabBg"
                                                className="absolute inset-0 bg-primary/10"
                                                initial={false}
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            />
                                        )}
                                        <div className={cn(
                                            "relative p-2 rounded-xl transition-colors",
                                            isActive ? "bg-background shadow-sm" : "bg-muted group-hover:bg-background"
                                        )}>
                                            <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground")} />
                                        </div>
                                        <span className="relative z-10 text-base">{feature.title}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </ScrollArea>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 relative bg-muted/30 rounded-[2.5rem] overflow-hidden p-2">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="w-full h-full relative rounded-[2rem] overflow-hidden bg-background"
                        >
                            <Image
                                src={activeFeatureByTab.image}
                                alt={activeFeatureByTab.title}
                                fill
                                className="object-cover"
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />

                            {/* Content Overlay */}
                            <div className="absolute inset-0 p-12 flex flex-col justify-end max-w-2xl">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 bg-background/80 backdrop-blur-md rounded-2xl shadow-sm">
                                            <ActiveIcon className="w-8 h-8 text-primary" />
                                        </div>
                                        <Badge variant="secondary" className="bg-background/80 backdrop-blur-md px-3 py-1.5 text-sm font-medium">
                                            {activeFeatureByTab.id}
                                        </Badge>
                                    </div>

                                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
                                        {activeFeatureByTab.title}
                                    </h2>
                                    <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-lg">
                                        {activeFeatureByTab.description}
                                    </p>

                                    <div className="flex gap-4">
                                        {activeFeatureByTab.stats.map((stat, idx) => (
                                            <div key={idx} className="bg-background/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 min-w-[120px]">
                                                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">{stat.label}</div>
                                                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
