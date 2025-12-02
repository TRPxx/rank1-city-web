'use client';

import { Users, Gift, CheckCircle, ChevronDown, Trophy, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { PREREGISTER_CONFIG } from '@/lib/preregister-config';

// --- Shared Data & Utils ---
const getRewardsData = (totalRegistrations) => {
    const globalRewards = PREREGISTER_CONFIG.rewards.global;
    const maxCount = globalRewards[globalRewards.length - 1]?.count || 5000;
    const progressPercent = Math.min(100, (totalRegistrations / maxCount) * 100);
    return { globalRewards, maxCount, progressPercent };
};

// --- Design 10: Bento Grid (Renamed to PreregisterRewards) ---
const PreregisterRewards = ({ totalRegistrations, isRegistered, data }) => {
    const { globalRewards } = data;
    const finalReward = globalRewards[globalRewards.length - 1];
    const progressPercent = Math.min(100, (totalRegistrations / finalReward.count) * 100);

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-8 md:py-12 flex flex-col justify-center h-full">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-6 md:mb-8 gap-4">
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">รางวัลเป้าหมาย</h2>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-3 h-3 rounded-full bg-primary" /> ปลดล็อคแล้ว
                    <div className="w-3 h-3 rounded-full bg-muted" /> ยังไม่ปลดล็อค
                </div>
            </div>

            {/* --- MOBILE LAYOUT (< md) --- */}
            <div className="flex flex-col gap-8 md:hidden pb-20">
                {/* 1. Progress Bar (Top Priority) */}
                <div className="w-full">
                    <div className="flex justify-between w-full mb-2">
                        <span className="text-sm font-medium text-muted-foreground">ความคืบหน้า</span>
                        <span className="text-xl font-black text-primary">{Math.round(progressPercent)}%</span>
                    </div>
                    <Progress value={progressPercent} className="h-3 w-full" />
                    <div className="flex justify-between w-full mt-2 text-xs text-muted-foreground">
                        <span>0</span>
                        <span>{finalReward.count.toLocaleString()}</span>
                    </div>
                </div>

                {/* 2. Grand Prize (Featured) */}
                <div className="relative overflow-hidden p-6 text-center rounded-3xl bg-muted/20">
                    <div className="relative z-10">
                        <Badge variant="secondary" className="mb-4 bg-background/50 backdrop-blur-sm">รางวัลใหญ่สุด</Badge>
                        <div className="relative w-40 h-40 mx-auto mb-4">
                            {finalReward.image ? (
                                <Image src={finalReward.image} alt="Grand Prize" fill className="object-contain drop-shadow-xl" />
                            ) : (
                                <Trophy className="w-full h-full text-primary" />
                            )}
                        </div>
                        <h3 className="text-2xl font-bold">{finalReward.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">เมื่อครบ {finalReward.count.toLocaleString()} คน</p>
                    </div>
                </div>

                {/* 3. Other Rewards (Horizontal Scroll) */}
                <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-4 px-1">รางวัลอื่นๆ</h3>
                    <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
                        {globalRewards.slice(0, globalRewards.length - 1).map((reward, index) => {
                            const isUnlocked = totalRegistrations >= reward.count;
                            return (
                                <div key={index} className={cn(
                                    "flex-none w-[160px] snap-center relative rounded-2xl p-4 flex flex-col justify-between transition-all",
                                    isUnlocked ? "bg-primary/5" : "bg-muted/10 grayscale opacity-70"
                                )}>
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="font-mono text-[10px] text-muted-foreground">#{index + 1}</span>
                                        {isUnlocked && <CheckCircle className="w-4 h-4 text-primary" />}
                                    </div>
                                    <div className="relative w-20 h-20 mx-auto mb-4">
                                        {reward.image ? (
                                            <Image src={reward.image} alt={reward.name} fill className="object-contain" />
                                        ) : (
                                            <Gift className="w-full h-full text-foreground/20" />
                                        )}
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg font-bold">{reward.count}</div>
                                        <div className="text-xs text-muted-foreground truncate">{reward.name}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* --- DESKTOP LAYOUT (>= md) --- */}
            <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[200px]">
                {/* Large Featured Item (Final Goal) */}
                <div className="col-span-2 row-span-2 relative rounded-[2.5rem] bg-muted/20 overflow-hidden group hover:bg-muted/30 transition-colors">
                    <div className="p-10 h-full flex flex-col justify-between relative z-10">
                        <div className="flex justify-between items-start">
                            <Badge variant="secondary" className="text-lg px-4 py-1.5 bg-background/50 backdrop-blur-sm">เป้าหมาย {finalReward.count / 1000}k</Badge>
                            <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                        </div>
                        <div className="text-center">
                            <div className="relative w-48 h-48 mx-auto mb-6 transition-transform duration-500 group-hover:scale-110">
                                {finalReward.image ? (
                                    <Image src={finalReward.image} alt="Grand Prize" fill className="object-contain drop-shadow-2xl" />
                                ) : (
                                    <Trophy className="w-full h-full text-primary" />
                                )}
                            </div>
                            <h3 className="text-3xl font-bold tracking-tight">{finalReward.name}</h3>
                        </div>
                    </div>
                </div>

                {/* Other Items */}
                {globalRewards.slice(0, globalRewards.length - 1).map((reward, index) => {
                    const isUnlocked = totalRegistrations >= reward.count;
                    return (
                        <div key={index} className={cn(
                            "relative rounded-[2rem] p-6 flex flex-col justify-between transition-all hover:scale-[1.02] group overflow-hidden",
                            isUnlocked ? "bg-primary/5 hover:bg-primary/10" : "bg-muted/10 grayscale opacity-60"
                        )}>
                            <div className="flex justify-between items-start">
                                <span className="font-mono text-xs text-muted-foreground">#{index + 1}</span>
                                {isUnlocked && <CheckCircle className="w-5 h-5 text-primary" />}
                            </div>

                            <div className="absolute right-[-10px] bottom-[-10px] w-36 h-36 opacity-10 group-hover:opacity-30 transition-opacity rotate-12">
                                {reward.image ? (
                                    <Image src={reward.image} alt={reward.name} fill className="object-contain" />
                                ) : (
                                    <Gift className="w-full h-full" />
                                )}
                            </div>

                            <div className="relative z-10">
                                <div className="text-3xl font-bold mb-1 tracking-tight">{reward.count}</div>
                                <div className="text-sm font-medium text-muted-foreground leading-tight line-clamp-2">{reward.name}</div>
                            </div>
                        </div>
                    );
                })}

                {/* Full Width Stats Block - Minimal */}
                <div className="col-span-3 lg:col-span-4 flex flex-col justify-center items-center text-center relative pt-8">
                    <div className="relative z-10 w-full max-w-2xl flex flex-col items-center">
                        <div className="flex justify-between w-full mb-3 px-1">
                            <span className="text-lg font-medium text-muted-foreground">ความคืบหน้า</span>
                            <span className="text-2xl font-black text-primary">{Math.round(progressPercent)}%</span>
                        </div>
                        <Progress value={progressPercent} className="h-4 w-full bg-muted/50" indicatorClassName="bg-primary shadow-[0_0_20px_rgba(var(--primary),0.3)]" />
                        <div className="flex justify-between w-full mt-3 text-sm text-muted-foreground px-1">
                            <span>0 ผู้ลงทะเบียน</span>
                            <span>เป้าหมาย {finalReward.count.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function PreregisterDesignSwitcher({ totalRegistrations, isRegistered }) {
    const data = getRewardsData(totalRegistrations);

    return (
        <div className="w-full h-full relative bg-background text-foreground">
            {/* Background Grid */}
            <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />

            {/* Content Area */}
            <div className="w-full h-full overflow-y-auto custom-scrollbar">
                <PreregisterRewards totalRegistrations={totalRegistrations} isRegistered={isRegistered} data={data} />
            </div>

            {/* CTA Button (Fixed at bottom) */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center z-40 pointer-events-none">
                <div className="pointer-events-auto">
                    {isRegistered ? (
                        <Button variant="secondary" className="shadow-lg" disabled>
                            <CheckCircle className="mr-2 h-4 w-4" /> Registered
                        </Button>
                    ) : (
                        <Link href="/preregister">
                            <Button className="shadow-lg px-8">
                                Register Now <ChevronDown className="ml-2 h-4 w-4 -rotate-90" />
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
