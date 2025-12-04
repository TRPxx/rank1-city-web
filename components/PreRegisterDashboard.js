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

import GangManager from './GangManager';
import FamilyManager from './FamilyManager';

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



    if (!mounted) return null;

    return (
        <div className="h-full flex flex-col gap-6">
            {/* Header / Tabs Section */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">แดชบอร์ด</h1>
                    <p className="text-muted-foreground">ยินดีต้อนรับกลับ, {localUserData?.name}</p>
                </div>

                <div className="hidden md:block bg-muted/30 p-1.5 rounded-2xl backdrop-blur-sm">
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



                        {PREREGISTER_CONFIG.features.enableGang && (
                            <>
                                <Button
                                    variant={activeTab === 'gang' ? 'secondary' : 'ghost'}
                                    size="sm"
                                    onClick={() => setActiveTab('gang')}
                                    className={`gap-2 rounded-xl transition-all ${activeTab === 'gang' ? 'bg-background shadow-sm' : 'hover:bg-background/50'}`}
                                >
                                    <Shield className="w-4 h-4" />
                                    ระบบแก๊ง
                                </Button>
                                <Button
                                    variant={activeTab === 'family' ? 'secondary' : 'ghost'}
                                    size="sm"
                                    onClick={() => setActiveTab('family')}
                                    className={`gap-2 rounded-xl transition-all ${activeTab === 'family' ? 'bg-background shadow-sm' : 'hover:bg-background/50'}`}
                                >
                                    <Users className="w-4 h-4" />
                                    ครอบครัว
                                </Button>
                            </>
                        )}


                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 min-h-0 overflow-hidden pb-24 md:pb-0">
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

                        {activeTab === 'gang' && (
                            <GangManager />
                        )}
                        {activeTab === 'family' && (
                            <FamilyManager />
                        )}

                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Mobile Bottom Navigation (Floating) */}
            <div className="md:hidden fixed bottom-6 left-4 right-4 z-50">
                <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl flex items-center justify-around">
                    <button
                        onClick={() => setActiveTab('invite')}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl w-full transition-all ${activeTab === 'invite' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        <Users className="w-5 h-5 mb-1" />
                        <span className="text-[10px] font-medium">เพื่อน</span>
                    </button>



                    {PREREGISTER_CONFIG.features.enableGang && (
                        <>
                            <button
                                onClick={() => setActiveTab('gang')}
                                className={`flex flex-col items-center justify-center p-2 rounded-xl w-full transition-all ${activeTab === 'gang' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}
                            >
                                <Shield className="w-5 h-5 mb-1" />
                                <span className="text-[10px] font-medium">แก๊ง</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('family')}
                                className={`flex flex-col items-center justify-center p-2 rounded-xl w-full transition-all ${activeTab === 'family' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}
                            >
                                <Users className="w-5 h-5 mb-1" />
                                <span className="text-[10px] font-medium">ครอบครัว</span>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div >
    );
}
