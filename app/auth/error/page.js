'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, ArrowLeft, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import siteConfig from '@/lib/config';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function AuthErrorContent() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    let errorMessage = "เกิดข้อผิดพลาด";
    let errorDescription = "ไม่สามารถเข้าสู่ระบบได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง";
    let icon = <AlertCircle className="w-12 h-12 text-destructive" />;

    if (error === 'AccessDenied') {
        errorMessage = "Access Denied";
        errorDescription = `คุณจำเป็นต้องเข้าร่วม Discord Server ของ "${siteConfig.name}" ก่อน จึงจะสามารถใช้งานระบบนี้ได้`;
        icon = (
            <div className="relative">
                <div className="absolute inset-0 bg-destructive/20 blur-xl rounded-full animate-pulse" />
                <ShieldAlert className="w-16 h-16 text-destructive relative z-10" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md"
        >
            <Card className="border-destructive/30 shadow-2xl bg-card/90 backdrop-blur-md overflow-hidden">
                <div className="h-2 w-full bg-destructive" /> {/* Top Border Line */}

                <CardContent className="pt-10 pb-8 px-8 text-center space-y-6">

                    {/* Icon Wrapper */}
                    <div className="flex justify-center mb-4">
                        <div className="bg-destructive/10 p-4 rounded-full ring-1 ring-destructive/20">
                            {icon}
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="space-y-2">
                        <h1 className="text-3xl font-black tracking-tight text-foreground">
                            {errorMessage}
                        </h1>
                        <p className="text-muted-foreground text-base leading-relaxed">
                            {errorDescription}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3 pt-4">
                        {error === 'AccessDenied' && (
                            <Link href={siteConfig.links.discord} target="_blank" className="block transform transition-transform hover:scale-105 active:scale-95">
                                <Button className="w-full h-12 text-lg font-bold bg-[#5865F2] hover:bg-[#4752C4] shadow-lg shadow-[#5865F2]/20">
                                    <svg className="w-6 h-6 mr-2 fill-current" viewBox="0 0 127.14 96.36">
                                        <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.11,77.11,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.89,105.89,0,0,0,126.6,80.22c1.24-23.25-5.83-47.5-22.11-71.89ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
                                    </svg>
                                    เข้าร่วม Discord เดี๋ยวนี้
                                </Button>
                            </Link>
                        )}

                        <Link href="/" className="block">
                            <Button variant="outline" className="w-full border-muted-foreground/20 hover:bg-muted/50">
                                <ArrowLeft className="w-4 h-4 mr-2" /> กลับหน้าหลัก
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            <p className="text-center text-xs text-muted-foreground/50 mt-4">
                Protected by Rank1 Security System
            </p>
        </motion.div>
    );
}

export default function AuthErrorPage() {
    return (
        <div className="min-h-screen flex flex-col bg-[url('/images/hero-bg-fivem.png')] bg-cover bg-center bg-no-repeat bg-fixed">
            {/* Overlay */}
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-0" />

            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar />

                <main className="flex-1 flex items-center justify-center p-4">
                    <Suspense fallback={<div className="animate-pulse w-full max-w-md h-64 bg-card/50 rounded-xl" />}>
                        <AuthErrorContent />
                    </Suspense>
                </main>

                <Footer />
            </div>
        </div>
    );
}
