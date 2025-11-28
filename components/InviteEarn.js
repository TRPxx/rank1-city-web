'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, CheckCircle2, Share2, Users, Gift, ArrowRight, Link as LinkIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { PREREGISTER_CONFIG } from '@/lib/preregister-config';

export default function InviteEarn({ referralCode, inviteCount }) {
    const [copiedCode, setCopiedCode] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);

    const copyCode = () => {
        if (referralCode) {
            navigator.clipboard.writeText(referralCode);
            setCopiedCode(true);
            setTimeout(() => setCopiedCode(false), 2000);
        }
    };

    const copyLink = () => {
        if (referralCode) {
            navigator.clipboard.writeText(`https://rank1city.com/preregister?ref=${referralCode}`);
            setCopiedLink(true);
            setTimeout(() => setCopiedLink(false), 2000);
        }
    };

    // Calculate progress for next reward
    const rewards = PREREGISTER_CONFIG.rewards.individual;
    const nextReward = rewards.find(r => r.count > inviteCount) || rewards[rewards.length - 1];
    const progress = Math.min(100, (inviteCount / nextReward.count) * 100);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Left Column: Stats & Link */}
            <div className="space-y-6 lg:col-span-2">
                {/* Referral Code Card */}
                <Card className="border-primary/20 bg-primary/5 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Share2 className="w-5 h-5 text-primary" />
                            รหัสแนะนำเพื่อน
                        </CardTitle>
                        <CardDescription>
                            ส่งรหัสนี้ให้เพื่อน หรือแชร์ลิงก์เพื่อรับรางวัลทั้งคู่!
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Code Display */}
                        <div className="flex flex-col items-center justify-center p-8 bg-background rounded-xl border-2 border-dashed border-primary/30 relative overflow-hidden group hover:border-primary/50 transition-colors">
                            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                            <p className="text-sm text-muted-foreground mb-2 font-medium">รหัสของคุณ</p>
                            <code className="text-5xl font-mono font-bold text-primary tracking-wider relative z-10 drop-shadow-sm">
                                {referralCode || '.......'}
                            </code>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Button
                                size="lg"
                                className="w-full"
                                onClick={copyCode}
                            >
                                {copiedCode ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}
                                {copiedCode ? 'คัดลอกรหัสแล้ว' : 'คัดลอกรหัส'}
                            </Button>

                            <Button
                                size="lg"
                                variant="outline"
                                className="w-full"
                                onClick={copyLink}
                            >
                                {copiedLink ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <LinkIcon className="w-5 h-5 mr-2" />}
                                {copiedLink ? 'คัดลอกลิงก์แล้ว' : 'คัดลอกลิงก์'}
                            </Button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="bg-background/50 p-4 rounded-lg border text-center">
                                <div className="text-3xl font-bold text-primary">{inviteCount}</div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">เพื่อนที่เชิญ</div>
                            </div>
                            <div className="bg-background/50 p-4 rounded-lg border text-center">
                                <div className="text-3xl font-bold text-primary">{Math.floor(inviteCount * 1)}</div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">ตั๋วที่ได้รับ</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Progress Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Gift className="w-5 h-5 text-primary" />
                            รางวัลถัดไป
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <div>
                                    <h4 className="font-semibold">{nextReward.name}</h4>
                                    <p className="text-sm text-muted-foreground">เชิญเพื่อนอีก {Math.max(0, nextReward.count - inviteCount)} คนเพื่อปลดล็อก</p>
                                </div>
                                <Badge variant="secondary">{inviteCount} / {nextReward.count}</Badge>
                            </div>
                            <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-primary"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Column: Rewards List */}
            <Card className="h-full flex flex-col">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Gift className="w-5 h-5" />
                        ระดับรางวัล
                    </CardTitle>
                    <CardDescription>ปลดล็อกไอเทมพิเศษโดยการเชิญเพื่อนเพิ่ม</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto pr-2">
                    <div className="space-y-4">
                        {rewards.map((reward, index) => {
                            const isUnlocked = inviteCount >= reward.count;
                            return (
                                <div
                                    key={index}
                                    className={`relative p-4 rounded-lg border transition-all ${isUnlocked
                                            ? 'bg-primary/5 border-primary/50'
                                            : 'bg-muted/30 border-border hover:border-primary/30'
                                        }`}
                                >
                                    {isUnlocked && (
                                        <div className="absolute top-2 right-2">
                                            <CheckCircle2 className="w-4 h-4 text-primary" />
                                        </div>
                                    )}
                                    <div className="flex items-start gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isUnlocked ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                                            }`}>
                                            <Users className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-muted-foreground uppercase mb-1">
                                                เชิญ {reward.count} คน
                                            </div>
                                            <h4 className={`font-semibold ${isUnlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                {reward.name}
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
