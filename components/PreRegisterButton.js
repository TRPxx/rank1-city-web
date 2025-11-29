'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSession, signIn } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle, Gift } from 'lucide-react';

export default function PreRegisterButton({ onRegisterSuccess }) {
    const { data: session, status } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [referralCode, setReferralCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRegister = async () => {
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('/api/preregister', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ referralCode }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            // Success
            setIsOpen(false);
            if (onRegisterSuccess) onRegisterSuccess();

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (status === 'loading') return null;

    if (!session) {
        return (
            <Button
                size="lg"
                className="relative z-50 text-lg px-8 py-6 shadow-lg shadow-primary/20 animate-pulse cursor-pointer"
                disabled={isLoading}
                onClick={async (e) => {
                    e.preventDefault();
                    setIsLoading(true);
                    console.log('Attempting to sign in with Discord...');
                    try {
                        await signIn('discord', { callbackUrl: '/', redirect: true });
                    } catch (error) {
                        console.error('SignIn error:', error);
                        setIsLoading(false);
                    }
                }}
            >
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'ลงทะเบียนล่วงหน้า (Login Discord)'}
            </Button>
        );
    }

    return (
        <>
            <Button
                size="lg"
                className="relative z-50 text-lg px-8 py-6 shadow-lg shadow-primary/20"
                onClick={() => {
                    console.log('Register modal button clicked');
                    setIsOpen(true);
                }}
            >
                ลงทะเบียนรับของรางวัล
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-card border border-border p-6 rounded-xl w-full max-w-md shadow-2xl relative"
                        >
                            <h2 className="text-2xl font-bold mb-4 text-center flex items-center justify-center gap-2">
                                <Gift className="text-primary" /> ยืนยันการลงทะเบียน
                            </h2>

                            <div className="space-y-4">
                                <div className="text-center">
                                    <p className="text-muted-foreground">สวัสดี, <span className="text-foreground font-semibold">{session.user.name}</span></p>
                                    <p className="text-sm text-muted-foreground">คุณกำลังจะลงทะเบียน ID นี้เข้าสู่ระบบ</p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-1 block">รหัสแนะนำเพื่อน (ถ้ามี)</label>
                                    <Input
                                        placeholder="เช่น R1-A8B2"
                                        value={referralCode}
                                        onChange={(e) => setReferralCode(e.target.value)}
                                        className="text-center uppercase tracking-widest"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1 text-center">ใส่รหัสเพื่อนเพื่อรับ Starter Pack เพิ่มเติม!</p>
                                </div>

                                {error && (
                                    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md text-center border border-destructive/20">
                                        {error}
                                    </div>
                                )}

                                <div className="flex gap-3 pt-2">
                                    <Button variant="outline" className="flex-1" onClick={() => setIsOpen(false)} disabled={isLoading}>
                                        ยกเลิก
                                    </Button>
                                    <Button className="flex-1" onClick={handleRegister} disabled={isLoading}>
                                        {isLoading ? <Loader2 className="animate-spin" /> : 'ยืนยันลงทะเบียน'}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
