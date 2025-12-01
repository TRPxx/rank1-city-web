'use client';

import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { Clock, ChevronRight, Circle, CheckCircle2, Timer } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function RoadmapSlide({ siteConfig }) {
    const milestones = siteConfig?.roadmap || [];
    const containerRef = useRef(null);

    // Drag to scroll state
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - containerRef.current.offsetLeft);
        setScrollLeft(containerRef.current.scrollLeft);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - containerRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        containerRef.current.scrollLeft = scrollLeft - walk;
    };

    return (
        <div className="w-full h-full flex flex-col bg-background text-foreground relative overflow-hidden py-12 md:py-20 border-t">
            {/* Shadcn-like Grid Background */}
            <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />

            <div className="container max-w-7xl z-20 px-4 flex flex-col h-full">
                {/* Header */}
                <div className="flex flex-col items-start justify-between md:flex-row md:items-end mb-12 gap-4">
                    <div className="space-y-2">
                        <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                            Rank1 Timeline
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">Server Roadmap</h2>
                        <p className="text-muted-foreground max-w-lg text-lg">
                            ติดตามการอัปเดตและทิศทางของเซิร์ฟเวอร์ในแต่ละ Phase
                        </p>
                    </div>

                    <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-green-500" /> Completed</span>
                        <span className="flex items-center gap-1"><Timer className="w-4 h-4 text-blue-500" /> In Progress</span>
                        <span className="flex items-center gap-1"><Circle className="w-4 h-4" /> Planned</span>
                    </div>
                </div>

                {/* Horizontal Scroll Container */}
                <div
                    ref={containerRef}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    className={`flex-1 w-full overflow-x-auto overflow-y-hidden custom-scrollbar flex items-center pb-8 -mx-4 px-4 md:mx-0 md:px-0 ${isDragging ? 'cursor-grabbing snap-none' : 'cursor-grab snap-x snap-mandatory'}`}
                >
                    <div className="flex gap-6 min-w-max mx-auto py-4">
                        {milestones.map((item, index) => {
                            const isCompleted = item.status === 'completed';
                            const isCurrent = item.status === 'current';

                            return (
                                <motion.div
                                    key={item.id || index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.4 }}
                                    viewport={{ once: true, root: containerRef }}
                                    className="snap-center group"
                                >
                                    <div className="relative flex flex-col w-[320px] md:w-[380px]">
                                        {/* Timeline Connector */}
                                        <div className="flex items-center mb-4 gap-4">
                                            <div className={cn(
                                                "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold z-10 bg-background transition-colors",
                                                isCompleted ? "border-primary bg-primary text-primary-foreground" :
                                                    isCurrent ? "border-blue-500 text-blue-500" :
                                                        "border-muted-foreground/30 text-muted-foreground"
                                            )}>
                                                {index + 1}
                                            </div>
                                            <div className={cn(
                                                "h-[2px] flex-1 transition-colors",
                                                isCompleted ? "bg-primary" : "bg-muted-foreground/20"
                                            )} />
                                            <div className="text-xs font-mono text-muted-foreground">
                                                {item.date}
                                            </div>
                                        </div>

                                        {/* Card */}
                                        <Card className={cn(
                                            "overflow-hidden transition-all duration-300 hover:shadow-lg border-muted",
                                            isCurrent ? "border-blue-500/50 shadow-md shadow-blue-500/10 ring-1 ring-blue-500/20" : "hover:border-foreground/20"
                                        )}>
                                            <div className="aspect-[16/9] relative bg-muted/50 overflow-hidden">
                                                {item.image ? (
                                                    <Image
                                                        src={item.image}
                                                        alt={item.title}
                                                        fill
                                                        className={cn(
                                                            "object-cover transition-transform duration-500 group-hover:scale-105",
                                                            !isCurrent && !isCompleted && "grayscale opacity-70"
                                                        )}
                                                        draggable={false}
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-muted-foreground/20">
                                                        <Clock className="w-12 h-12" />
                                                    </div>
                                                )}

                                                {/* Phase Badge */}
                                                <div className="absolute top-3 left-3">
                                                    <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm shadow-sm">
                                                        {item.phase}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <CardHeader className="space-y-1 pb-2">
                                                <CardTitle className={cn("text-xl", isCurrent && "text-blue-500")}>
                                                    {item.title}
                                                </CardTitle>
                                            </CardHeader>

                                            <CardContent>
                                                <CardDescription className="line-clamp-3 text-sm leading-relaxed">
                                                    {item.desc}
                                                </CardDescription>
                                            </CardContent>

                                            <CardFooter className="pt-0">
                                                <div className={cn(
                                                    "text-xs font-medium flex items-center gap-2",
                                                    isCompleted ? "text-green-500" :
                                                        isCurrent ? "text-blue-500" :
                                                            "text-muted-foreground"
                                                )}>
                                                    {isCompleted ? (
                                                        <>
                                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                                            Completed
                                                        </>
                                                    ) : isCurrent ? (
                                                        <>
                                                            <Timer className="w-3.5 h-3.5 animate-pulse" />
                                                            In Progress
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Circle className="w-3.5 h-3.5" />
                                                            Upcoming
                                                        </>
                                                    )}
                                                </div>
                                            </CardFooter>
                                        </Card>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Scroll Hint */}
                <div className="hidden md:flex justify-center items-center gap-2 text-muted-foreground text-sm mt-4">
                    <span>Drag to explore</span>
                    <ChevronRight className="w-4 h-4 animate-bounce-x" />
                </div>
            </div>
        </div>
    );
}
