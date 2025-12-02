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

    const copyCode = async () => {
        if (!referralCode) return;

        try {
            // Try modern API first
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(referralCode);
            } else {
                // Fallback for HTTP
                const textArea = document.createElement("textarea");
                textArea.value = referralCode;
                textArea.style.position = "fixed";
                textArea.style.left = "-9999px";
                textArea.style.top = "0";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();

                try {
                    document.execCommand('copy');
                } catch (err) {
                    console.error('Fallback: Oops, unable to copy', err);
                }

                document.body.removeChild(textArea);
            }

            setCopiedCode(true);
            setTimeout(() => setCopiedCode(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
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
                <div className="relative overflow-hidden rounded-3xl bg-muted/10 p-8">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                    <div className="relative z-10">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold flex items-center gap-2 mb-1">
                                <Share2 className="w-5 h-5 text-primary" />
                                รหัสแนะนำเพื่อน
                            </h3>
                            <p className="text-muted-foreground text-sm">
                                ส่งรหัสนี้ให้เพื่อน หรือแชร์ลิงก์เพื่อรับรางวัลทั้งคู่!
                            </p>
                        </div>

                        {/* Code Display */}
                        <div className="flex flex-col items-center justify-center p-8 bg-background/50 backdrop-blur-sm rounded-2xl mb-6 relative overflow-hidden group">
                            <p className="text-sm text-muted-foreground mb-2 font-medium">รหัสของคุณ</p>
                            <code className="text-5xl font-mono font-bold text-primary tracking-wider relative z-10 drop-shadow-sm">
                                {referralCode || '.......'}
                            </code>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-1 gap-3">
                            <Button
                                size="lg"
                                className="w-full shadow-lg shadow-primary/20"
                                onClick={copyCode}
                            >
                                {copiedCode ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}
                                {copiedCode ? 'คัดลอกรหัสแล้ว' : 'คัดลอกรหัส'}
                            </Button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="bg-background/30 p-4 rounded-2xl text-center">
                                <div className="text-3xl font-bold text-primary">{inviteCount}</div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">เพื่อนที่เชิญ</div>
                            </div>
                            <div className="bg-background/30 p-4 rounded-2xl text-center">
                                <div className="text-3xl font-bold text-primary">{Math.floor(inviteCount * 1)}</div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">ตั๋วที่ได้รับ</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Card */}
                <div className="rounded-3xl bg-muted/10 p-8">
                    <div className="mb-4">
                        <h3 className="text-lg font-bold flex items-center gap-2 mb-1">
                            <Gift className="w-5 h-5 text-primary" />
                            รางวัลถัดไป
                        </h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <div>
                                <h4 className="font-semibold text-lg">{nextReward.name}</h4>
                                <p className="text-sm text-muted-foreground">เชิญเพื่อนอีก {Math.max(0, nextReward.count - inviteCount)} คนเพื่อปลดล็อก</p>
                            </div>
                            <Badge variant="secondary" className="text-base px-3 py-1 bg-background/50">{inviteCount} / {nextReward.count}</Badge>
                        </div>
                        <div className="h-4 w-full bg-background/50 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Rewards List */}
            <div className="h-full flex flex-col rounded-3xl bg-muted/10 p-8">
                <div className="mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2 mb-1">
                        <Gift className="w-5 h-5 text-primary" />
                        ระดับรางวัล
                    </h3>
                    <p className="text-muted-foreground text-sm">ปลดล็อกไอเทมพิเศษโดยการเชิญเพื่อนเพิ่ม</p>
                </div>
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="space-y-4">
                        {rewards.map((reward, index) => {
                            const isUnlocked = inviteCount >= reward.count;
                            return (
                                <div
                                    key={index}
                                    className={`relative p-5 rounded-2xl transition-all ${isUnlocked
                                        ? 'bg-primary/10'
                                        : 'bg-background/30 opacity-60'
                                        }`}
                                >
                                    {isUnlocked && (
                                        <div className="absolute top-4 right-4">
                                            <CheckCircle2 className="w-5 h-5 text-primary" />
                                        </div>
                                    )}
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isUnlocked ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-muted text-muted-foreground'
                                            }`}>
                                            <Users className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-muted-foreground uppercase mb-1 tracking-wider">
                                                เชิญ {reward.count} คน
                                            </div>
                                            <h4 className={`font-bold text-lg ${isUnlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                {reward.name}
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
