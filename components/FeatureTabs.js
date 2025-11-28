import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { features } from '@/lib/features-data';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ChevronRight } from 'lucide-react';

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

    const paginate = (newDirection) => {
        const newIndex = (activeIndex + newDirection + features.length) % features.length;
        setActiveIndex(newIndex);
        setPage([page + newDirection, newDirection]);
    };

    return (
        <div className="w-full max-w-6xl mx-auto h-full flex flex-col">
            {/* MOBILE/TABLET VIEW (< lg) */}
            <div className="lg:hidden w-full h-full flex flex-col px-4">
                <div className="flex justify-center gap-1.5 mb-4">
                    {features.map((_, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                "h-1.5 rounded-full transition-all duration-300",
                                activeIndex === idx ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30"
                            )}
                        />
                    ))}
                </div>

                <div className="flex-1 relative overflow-hidden">
                    <AnimatePresence initial={false} custom={direction} mode="wait">
                        <motion.div
                            key={activeIndex}
                            custom={direction}
                            initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
                            transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={1}
                            onDragEnd={(e, { offset, velocity }) => {
                                const swipe = swipePower(offset.x, velocity.x);
                                if (swipe < -swipeConfidenceThreshold) paginate(1);
                                else if (swipe > swipeConfidenceThreshold) paginate(-1);
                            }}
                            className="absolute inset-0"
                        >
                            <Card className="h-full overflow-hidden border-border shadow-sm">
                                <div className="relative h-1/2 w-full bg-muted">
                                    <Image
                                        src={activeFeature.image}
                                        alt={activeFeature.title}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                                </div>
                                <CardContent className="pt-6 relative">
                                    <div className="absolute -top-10 left-6 bg-background p-2 rounded-xl border shadow-sm">
                                        <activeFeature.icon className="w-8 h-8 text-primary" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">{activeFeature.title}</h3>
                                    <p className="text-muted-foreground mb-6">{activeFeature.description}</p>

                                    <div className="grid grid-cols-3 gap-4">
                                        {activeFeature.stats.map((stat, idx) => (
                                            <div key={idx} className="text-center p-2 bg-muted/50 rounded-lg">
                                                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{stat.label}</div>
                                                <div className="font-bold text-sm">{stat.value}</div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* DESKTOP VIEW (≥ lg) */}
            <div className="hidden lg:flex h-full max-h-[600px] border rounded-xl overflow-hidden bg-card shadow-sm">
                {/* Sidebar Navigation */}
                <div className="w-[350px] border-r bg-muted/10 flex flex-col">
                    <div className="p-6 border-b">
                        <h3 className="font-semibold text-lg">System Features</h3>
                        <p className="text-sm text-muted-foreground">Explore our unique gameplay systems</p>
                    </div>
                    <ScrollArea className="flex-1">
                        <div className="p-4 space-y-2">
                            {features.map((feature) => (
                                <button
                                    key={feature.id}
                                    onClick={() => setActiveTab(feature.id)}
                                    className={cn(
                                        "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all group",
                                        activeTab === feature.id
                                            ? "bg-primary text-primary-foreground shadow-sm"
                                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <feature.icon className={cn("w-5 h-5", activeTab === feature.id ? "text-primary-foreground" : "text-primary")} />
                                    <span className="font-medium flex-1">{feature.title}</span>
                                    {activeTab === feature.id && <ChevronRight className="w-4 h-4 opacity-50" />}
                                </button>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-col h-full"
                        >
                            {/* Feature Header */}
                            <div className="p-8 pb-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">
                                        {activeFeatureByTab.id}
                                    </Badge>
                                </div>
                                <h2 className="text-3xl font-bold tracking-tight mb-2">{activeFeatureByTab.title}</h2>
                                <p className="text-lg text-muted-foreground max-w-2xl">{activeFeatureByTab.description}</p>
                            </div>

                            {/* Feature Visuals */}
                            <div className="flex-1 px-8 pb-8 flex gap-6 min-h-0">
                                {/* Main Image */}
                                <div className="flex-1 relative rounded-xl overflow-hidden border bg-muted shadow-sm group">
                                    <Image
                                        src={activeFeatureByTab.image}
                                        alt={activeFeatureByTab.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                                    {/* Floating Stats */}
                                    <div className="absolute bottom-6 left-6 right-6 flex gap-4">
                                        {activeFeatureByTab.stats.map((stat, idx) => (
                                            <div key={idx} className="bg-background/10 backdrop-blur-md border border-white/10 rounded-lg p-3 flex-1">
                                                <div className="text-xs text-white/70 uppercase tracking-wider mb-1">{stat.label}</div>
                                                <div className="text-xl font-bold text-white">{stat.value}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Side Details (Optional - can be used for extra info or sub-features) */}
                                <div className="w-64 flex flex-col gap-4">
                                    <Card className="flex-1 bg-muted/30 border-dashed flex items-center justify-center p-6 text-center">
                                        <div>
                                            <activeFeatureByTab.icon className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                                            <p className="text-sm text-muted-foreground">More details coming soon...</p>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
