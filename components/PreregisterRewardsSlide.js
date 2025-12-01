'use client';

import { motion } from 'framer-motion';
import { Users, Gift, CheckCircle, ChevronDown, Lock, Unlock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { PREREGISTER_CONFIG } from '@/lib/preregister-config';

// Animation Variants
const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
};

export default function PreregisterRewardsSlide({ totalRegistrations, isRegistered }) {
    const globalRewards = PREREGISTER_CONFIG.rewards.global;
    const maxCount = globalRewards[globalRewards.length - 1]?.count || 5000;
    const progressPercent = Math.min(100, (totalRegistrations / maxCount) * 100);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-background text-foreground relative overflow-hidden py-12 md:py-20 border-t">
            {/* Shadcn-like Grid Background */}
            <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
                variants={staggerContainer}
                className="container max-w-6xl relative z-20 flex flex-col h-full justify-center px-4 md:px-6"
            >
                {/* Header Section */}
                <motion.div variants={fadeInUp} className="flex flex-col items-center text-center mb-10 space-y-4">
                    <Badge variant="outline" className="px-3 py-1 text-sm uppercase tracking-widest border-primary/20 bg-primary/5 text-primary">
                        Season 1 Rewards
                    </Badge>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight sm:text-6xl">
                        Milestone Rewards
                    </h2>
                    <p className="max-w-[700px] text-muted-foreground md:text-lg">
                        รวมพลังชาวเมือง! ยิ่งลงทะเบียนมาก ยิ่งปลดล็อกของรางวัลระดับพรีเมียมยกเซิร์ฟเวอร์
                    </p>
                </motion.div>

                {/* Progress Section */}
                <motion.div variants={fadeInUp} className="w-full max-w-3xl mx-auto mb-16 px-4">
                    <div className="flex justify-between items-end mb-4">
                        <div className="space-y-1">
                            <span className="text-sm font-medium text-muted-foreground">Current Registrations</span>
                            <div className="text-3xl font-bold tabular-nums tracking-tight">
                                {totalRegistrations.toLocaleString()}
                                <span className="text-lg text-muted-foreground font-normal ml-2">/ {maxCount.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-sm font-medium text-primary">{progressPercent.toFixed(1)}% Unlocked</span>
                        </div>
                    </div>

                    <div className="relative h-4 w-full bg-secondary rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${progressPercent}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="h-full bg-primary rounded-full relative"
                        >
                            <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite] skew-x-12" />
                        </motion.div>
                    </div>
                </motion.div>

                {/* Rewards Grid */}
                <motion.div variants={staggerContainer} className="w-full relative">
                    <div className="relative w-full overflow-x-auto pb-12 pt-4 custom-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
                        <div className="flex items-stretch justify-center gap-6 min-w-max px-4 mx-auto">
                            {/* Connecting Line */}
                            <div className="absolute left-0 right-0 top-[24px] h-[2px] bg-border -z-10 hidden md:block" />

                            {globalRewards.map((reward, index) => {
                                const isUnlocked = totalRegistrations >= reward.count;
                                const isNext = !isUnlocked && (index === 0 || totalRegistrations >= globalRewards[index - 1].count);

                                return (
                                    <motion.div
                                        key={index}
                                        variants={fadeInUp}
                                        className={cn(
                                            "flex flex-col items-center gap-4 group w-[200px] relative transition-all duration-300",
                                            !isUnlocked && !isNext && "opacity-60 grayscale"
                                        )}
                                    >
                                        {/* Status Icon */}
                                        <div className={cn(
                                            "w-12 h-12 rounded-full border-4 flex items-center justify-center z-10 transition-all duration-500 bg-background",
                                            isUnlocked ? "border-primary text-primary shadow-lg shadow-primary/20 scale-110" :
                                                isNext ? "border-blue-500 text-blue-500 animate-pulse" :
                                                    "border-muted text-muted-foreground"
                                        )}>
                                            {isUnlocked ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                                        </div>

                                        {/* Count Badge */}
                                        <div className={cn(
                                            "absolute top-[38px] text-[10px] font-bold px-2 py-0.5 rounded-full border bg-background z-20",
                                            isUnlocked ? "border-primary text-primary" : "border-muted text-muted-foreground"
                                        )}>
                                            {reward.count >= 1000 ? `${reward.count / 1000}k` : reward.count}
                                        </div>

                                        {/* Card */}
                                        <Card className={cn(
                                            "w-full h-full mt-4 transition-all duration-300 hover:shadow-md border-muted",
                                            isUnlocked ? "border-primary/50 shadow-sm shadow-primary/5" :
                                                isNext ? "border-blue-500/50 ring-1 ring-blue-500/20" : ""
                                        )}>
                                            <CardContent className="p-4 flex flex-col items-center text-center h-full">
                                                <div className="relative w-24 h-24 mb-4 transition-transform duration-300 group-hover:scale-105">
                                                    {reward.image ? (
                                                        <Image
                                                            src={reward.image}
                                                            alt={reward.name}
                                                            fill
                                                            className="object-contain drop-shadow-md"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-muted/30 rounded-full">
                                                            <Gift className="w-10 h-10 text-muted-foreground/50" />
                                                        </div>
                                                    )}
                                                </div>

                                                <h3 className="font-semibold text-sm mb-1 line-clamp-2 min-h-[2.5rem] flex items-center justify-center">
                                                    {reward.name}
                                                </h3>

                                                <p className="text-xs text-muted-foreground mt-auto pt-2">
                                                    {isUnlocked ? (
                                                        <span className="text-green-500 font-medium flex items-center justify-center gap-1">
                                                            <CheckCircle className="w-3 h-3" /> Unlocked
                                                        </span>
                                                    ) : (
                                                        <span>ขาดอีก {(reward.count - totalRegistrations).toLocaleString()}</span>
                                                    )}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* CTA Button */}
                    <motion.div variants={fadeInUp} className="mt-8 text-center">
                        {isRegistered ? (
                            <Button size="lg" variant="secondary" className="font-semibold shadow-sm cursor-default" disabled>
                                <CheckCircle className="mr-2 h-4 w-4" /> คุณได้ทำการลงทะเบียนแล้ว
                            </Button>
                        ) : (
                            <Link href="/preregister">
                                <Button size="lg" className="font-semibold shadow-lg px-8">
                                    ลงทะเบียนเลย <ChevronDown className="ml-2 h-4 w-4 -rotate-90" />
                                </Button>
                            </Link>
                        )}
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
}
