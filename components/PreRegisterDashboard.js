'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    Ticket,
    Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Components
import InviteEarn from './InviteEarn';
import LuckyDraw from './LuckyDraw';
import GangManager from './GangManager';

import { PREREGISTER_CONFIG } from '@/lib/preregister-config';

export default function PreRegisterDashboard({ userData }) {
    const [activeTab, setActiveTab] = useState('invite');
    const [mounted, setMounted] = useState(false);
    const [localUserData, setLocalUserData] = useState(userData);

    useEffect(() => {
        setLocalUserData(userData);
    }, [userData]);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLuckyDrawComplete = async () => {
        try {
            const res = await fetch('/api/preregister');
            const data = await res.json();
            if (data.isRegistered) {
                setLocalUserData(data);
            }
        } catch (error) {
            console.error("Failed to refresh user data", error);
        }
    };

    if (!mounted) return null;

    return (
        <div className="h-full flex flex-col gap-6">
            {/* Header / Tabs Section */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">แดชบอร์ด</h1>
                    <p className="text-muted-foreground">ยินดีต้อนรับกลับ, {localUserData?.name}</p>
                </div>

                <div className="bg-muted/30 p-1.5 rounded-2xl backdrop-blur-sm">
                    <div className="flex items-center gap-1">
                        <Button
                            variant={activeTab === 'invite' ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setActiveTab('invite')}
                            className={`gap-2 rounded-xl transition-all ${activeTab === 'invite' ? 'bg-background shadow-sm' : 'hover:bg-background/50'}`}
                        >
                            <Users className="w-4 h-4" />
                            ชวนเพื่อน
                        </Button>

                        {PREREGISTER_CONFIG.features.enableLuckyDraw && (
                            <Button
                                variant={activeTab === 'luckydraw' ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={() => setActiveTab('luckydraw')}
                                className={`gap-2 rounded-xl transition-all ${activeTab === 'luckydraw' ? 'bg-background shadow-sm' : 'hover:bg-background/50'}`}
                            >
                                <Ticket className="w-4 h-4" />
                                สุ่มรางวัล
                            </Button>
                        )}

                        {PREREGISTER_CONFIG.features.enableGang && (
                            <Button
                                variant={activeTab === 'gang' ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={() => setActiveTab('gang')}
                                className={`gap-2 rounded-xl transition-all ${activeTab === 'gang' ? 'bg-background shadow-sm' : 'hover:bg-background/50'}`}
                            >
                                <Shield className="w-4 h-4" />
                                ระบบแก๊ง
                            </Button>
                        )}


                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 min-h-0 overflow-y-auto pr-2 -mr-2">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="h-full"
                    >
                        {activeTab === 'invite' && (
                            <InviteEarn
                                referralCode={localUserData?.myCode}
                                inviteCount={localUserData?.inviteCount}
                            />
                        )}
                        {activeTab === 'luckydraw' && (
                            <LuckyDraw
                                ticketCount={localUserData?.ticketCount}
                                onDrawComplete={handleLuckyDrawComplete}
                            />
                        )}
                        {activeTab === 'gang' && (
                            <GangManager />
                        )}

                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
