import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { features } from '@/lib/features-data';
import { Badge } from '@/components/ui/badge';

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
};

export default function FeatureTabs() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [activeTab, setActiveTab] = useState(features[0].id);
    const [[page, direction], setPage] = useState([0, 0]);

    const activeFeature = features[activeIndex];
    const activeFeatureByTab = features.find(f => f.id === activeTab) || features[0];
    const IconComponent = activeFeature.icon;

    const paginate = (newDirection) => {
        const newIndex = (activeIndex + newDirection + features.length) % features.length;
        setActiveIndex(newIndex);
        setPage([page + newDirection, newDirection]);
    };

    return (
        <div className="w-full max-w-6xl mx-auto flex flex-col h-full">
            {/* MOBILE/TABLET VIEW (< lg) - Swipeable Carousel */}
            <div className="lg:hidden w-full h-full flex flex-col px-4">
                {/* Feature Indicator Dots */}
                <div className="flex items-center justify-center gap-2 mb-4 md:mb-6">
                    {features.map((feature, idx) => (
                        <button
                            key={feature.id}
                            onClick={() => setActiveIndex(idx)}
                            className={cn(
                                "transition-all duration-300",
                                activeIndex === idx
                                    ? "w-8 h-2 bg-primary rounded-full"
                                    : "w-2 h-2 bg-muted-foreground/30 rounded-full hover:bg-muted-foreground/50"
                            )}
                            aria-label={`Go to ${feature.title}`}
                        />
                    ))}
                </div>

                {/* Swipeable Container */}
                <div className="flex-1 min-h-0 relative overflow-hidden">
                    <AnimatePresence initial={false} custom={direction} mode="wait">
                        <motion.div
                            key={activeIndex}
                            custom={direction}
                            initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 }
                            }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={1}
                            onDragEnd={(e, { offset, velocity }) => {
                                const swipe = swipePower(offset.x, velocity.x);

                                if (swipe < -swipeConfidenceThreshold) {
                                    paginate(1);
                                } else if (swipe > swipeConfidenceThreshold) {
                                    paginate(-1);
                                }
                            }}
                            className="absolute inset-0 flex flex-col cursor-grab active:cursor-grabbing"
                        >
                            {/* Feature Card */}
                            <div className="flex-1 min-h-0 bg-card border rounded-2xl overflow-hidden shadow-lg flex flex-col">
                                {/* Header with Icon and Title */}
                                <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-4 md:p-6 border-b">
                                    <div className="flex items-start gap-3 md:gap-4">
                                        <div className="bg-primary/10 p-3 md:p-4 rounded-xl">
                                            <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Badge variant="outline" className="text-xs border-primary/50 text-primary bg-primary/5">
                                                    Feature {activeIndex + 1}/{features.length}
                                                </Badge>
                                            </div>
                                            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-2">
                                                {activeFeature.title}
                                            </h3>
                                            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                                                {activeFeature.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Image / Stats Display */}
                                <div className="flex-1 min-h-0 bg-muted/30 p-3 md:p-4 overflow-y-auto custom-scrollbar relative">
                                    <div className="relative w-full h-full rounded-xl overflow-hidden">
                                        <Image
                                            src={activeFeature.image}
                                            alt={activeFeature.title}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                        />
                                        {/* Stats Overlay */}
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-4 flex justify-around">
                                            {activeFeature.stats.map((stat, idx) => (
                                                <div key={idx} className="text-center">
                                                    <div className="text-xs text-gray-300 uppercase tracking-wider">{stat.label}</div>
                                                    <div className="text-lg font-bold text-white">{stat.value}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* DESKTOP VIEW (≥ lg) - Tab Navigation Design */}
            <div className="hidden lg:flex flex-col h-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="flex-1 min-h-0 flex bg-card border rounded-2xl overflow-hidden shadow-sm"
                    >
                        {/* Left: Tabs Navigation */}
                        <div className="w-2/5 flex flex-col border-r bg-muted/30">
                            <div className="p-6 border-b bg-background/50 backdrop-blur-sm">
                                <h3 className="font-bold text-xl flex items-center gap-2">
                                    <span className="bg-primary/10 p-1.5 rounded-lg text-primary">
                                        <activeFeatureByTab.icon className="w-5 h-5" />
                                    </span>
                                    เลือกฟีเจอร์
                                </h3>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar" role="tablist" aria-label="Features">
                                <div className="flex flex-col p-2 gap-2">
                                    {features.map((feature) => (
                                        <button
                                            key={feature.id}
                                            role="tab"
                                            aria-selected={activeTab === feature.id}
                                            aria-controls={`feature-panel-${feature.id}`}
                                            id={`feature-tab-${feature.id}`}
                                            onClick={() => setActiveTab(feature.id)}
                                            className={cn(
                                                "flex items-center gap-3 p-4 rounded-xl text-left transition-all",
                                                activeTab === feature.id
                                                    ? "bg-primary text-primary-foreground shadow-md scale-[1.02]"
                                                    : "hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                                            )}
                                        >
                                            <div className={cn(
                                                "p-2 rounded-lg transition-colors",
                                                activeTab === feature.id ? "bg-white/20" : "bg-muted"
                                            )}>
                                                <feature.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="font-bold">{feature.title}</div>
                                                <div className={cn(
                                                    "text-xs mt-0.5 line-clamp-1",
                                                    activeTab === feature.id ? "text-primary-foreground/80" : "text-muted-foreground"
                                                )}>
                                                    {feature.description}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right: Content Display */}
                        <div className="w-3/5 flex flex-col bg-background relative">
                            {/* Text Content */}
                            <div className="p-8 border-b bg-gradient-to-br from-card to-muted/30">
                                <div className="flex items-center gap-3 mb-4">
                                    <Badge variant="outline" className="px-3 py-1 border-primary/50 text-primary bg-primary/5">
                                        Feature Preview
                                    </Badge>
                                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">
                                        {activeFeatureByTab.id}
                                    </span>
                                </div>

                                <h3 className="text-3xl font-bold mb-3 text-foreground">
                                    {activeFeatureByTab.title}
                                </h3>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    {activeFeatureByTab.description}
                                </p>
                            </div>

                            {/* Image Display */}
                            <div className="flex-1 bg-muted/50 p-4 overflow-hidden relative">
                                <div className="relative w-full h-full rounded-xl overflow-hidden shadow-inner border">
                                    <Image
                                        src={activeFeatureByTab.image}
                                        alt={activeFeatureByTab.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 1200px) 50vw, 33vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                                    {/* Stats Overlay Desktop */}
                                    <div className="absolute bottom-6 left-6 right-6 flex gap-6">
                                        {activeFeatureByTab.stats.map((stat, idx) => (
                                            <div key={idx} className="bg-black/40 backdrop-blur-md rounded-lg p-3 border border-white/10">
                                                <div className="text-xs text-gray-300 uppercase tracking-wider mb-1">{stat.label}</div>
                                                <div className="text-xl font-bold text-white">{stat.value}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
