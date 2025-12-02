'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Trophy, Star, ChevronRight, Gift, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Mock Data (Will be replaced by Admin Config later)
const EVENT_DATA = {
    title: "GRAND OPENING FESTIVAL",
    subtitle: "ฉลองเปิดเมือง Rank1 City อย่างเป็นทางการ",
    description: "เตรียมพบกับมหกรรมความสนุกสุดยิ่งใหญ่ ต้อนรับพลเมืองรุ่นแรกสู่ Rank1 City พร้อมกิจกรรมและของรางวัลมูลค่ารวมกว่า 100,000 บาท!",
    startDate: "2025-12-25T18:00:00",
    endDate: "2026-01-01T23:59:59",
    highlights: [
        {
            title: "First Login Reward",
            description: "ล็อกอินเข้าเมืองครั้งแรก รับทันที Starter Pack และแฟชั่นลิมิเต็ด",
            image: "/images/event/login.jpg",
            icon: Gift
        },
        {
            title: "Level Up Challenge",
            description: "เก็บเลเวลให้ถึงเป้าหมาย รับรถสปอร์ตสุดหรูถาวร!",
            image: "/images/event/levelup.jpg",
            icon: Trophy
        },
        {
            title: "Gang War: The Beginning",
            description: "สงครามแก๊งครั้งแรก ชิงเงินรางวัลและพื้นที่ยึดครอง",
            image: "/images/event/war.jpg",
            icon: Star
        }
    ],
    schedule: [
        { time: "18:00", activity: "Server Open / Opening Ceremony" },
        { time: "19:00", activity: "Concert: DJ T-Rex" },
        { time: "20:00", activity: "Lucky Draw แจกทองคำแท่ง" },
        { time: "21:00", activity: "Gang War Exhibition Match" }
    ]
};

const CountdownTimer = ({ targetDate }) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = new Date(targetDate).getTime() - now;

            if (distance < 0) {
                clearInterval(interval);
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    return (
        <div className="flex gap-4 sm:gap-8 justify-center py-10">
            {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="flex flex-col items-center group">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="bg-background/50 backdrop-blur-md rounded-2xl p-4 sm:p-6 min-w-[80px] sm:min-w-[100px] flex items-center justify-center relative z-10">
                            <span className="text-4xl sm:text-6xl font-black text-foreground tracking-tighter tabular-nums">{value}</span>
                        </div>
                    </div>
                    <span className="text-xs sm:text-sm uppercase mt-3 text-muted-foreground font-medium tracking-widest">{unit}</span>
                </div>
            ))}
        </div>
    );
};

export default function SpecialEventPage() {
    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground font-sans transition-colors duration-300">
            <Navbar />

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
                {/* Background Video/Image */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background z-10" />
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=2874&auto=format&fit=crop')] bg-cover bg-center opacity-20 dark:opacity-50" />
                </div>

                <div className="container relative z-20 text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-medium tracking-wider bg-primary/10 text-primary hover:bg-primary/20 transition-colors rounded-full backdrop-blur-sm">
                            ✨ SPECIAL EVENT
                        </Badge>
                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-6 text-foreground drop-shadow-sm">
                            {EVENT_DATA.title}
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 font-light leading-relaxed">
                            {EVENT_DATA.subtitle}
                        </p>

                        <CountdownTimer targetDate={EVENT_DATA.startDate} />

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
                            <Button size="lg" className="text-lg px-10 py-7 rounded-2xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105">
                                เข้าร่วมกิจกรรม
                            </Button>
                            <Button size="lg" variant="outline" className="text-lg px-10 py-7 rounded-2xl border-0 bg-background/50 hover:bg-background/80 backdrop-blur-sm transition-all hover:scale-105">
                                อ่านรายละเอียด
                            </Button>
                        </div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                >
                    <div className="flex flex-col items-center gap-2 text-muted-foreground/50">
                        <span className="text-xs uppercase tracking-widest">Scroll Down</span>
                        <ChevronRight className="rotate-90 w-6 h-6" />
                    </div>
                </motion.div>
            </section>

            {/* Highlights Section */}
            <section className="py-24 bg-muted/30 relative">
                <div className="container px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Event Highlights</h2>
                        <p className="text-muted-foreground text-lg">กิจกรรมไฮไลท์ที่คุณห้ามพลาด</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {EVENT_DATA.highlights.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2 }}
                                viewport={{ once: true }}
                            >
                                <div className="h-full bg-muted/5 rounded-[2.5rem] overflow-hidden hover:bg-muted/10 transition-colors duration-500 group">
                                    <div className="relative h-64 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
                                        {/* Placeholder for Image */}
                                        <div className="w-full h-full bg-muted/20 group-hover:scale-110 transition-transform duration-700 flex items-center justify-center">
                                            <item.icon className="w-24 h-24 text-muted-foreground/20 group-hover:text-primary/20 transition-colors" />
                                        </div>
                                        <div className="absolute bottom-4 left-6 z-20">
                                            <div className="w-14 h-14 rounded-2xl bg-background/80 backdrop-blur-md flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                                                <item.icon className="w-7 h-7 text-primary" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-8 pt-2">
                                        <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{item.title}</h3>
                                        <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Schedule Section */}
            <section className="py-24 bg-background relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                <div className="container px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <Badge variant="outline" className="mb-4 border-primary text-primary">SCHEDULE</Badge>
                            <h2 className="text-4xl md:text-6xl font-bold mb-6">ตารางกิจกรรม<br />วันเปิดเมือง</h2>
                            <p className="text-xl text-muted-foreground mb-8">
                                พบกับตารางเวลาความสนุกที่อัดแน่นตลอดทั้งคืน ห้ามพลาดแม้แต่วินาทีเดียว!
                            </p>

                            <div className="space-y-6">
                                {EVENT_DATA.schedule.map((item, index) => (
                                    <div key={index} className="flex items-center gap-6 group">
                                        <div className="w-24 text-right font-mono text-xl text-primary font-bold group-hover:scale-110 transition-transform">
                                            {item.time}
                                        </div>
                                        <div className="w-px h-12 bg-border group-hover:bg-primary transition-colors" />
                                        <div className="text-lg font-medium group-hover:text-foreground text-muted-foreground transition-colors">
                                            {item.activity}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 blur-3xl rounded-full opacity-30" />
                            <div className="relative bg-muted/5 backdrop-blur-xl p-8 rounded-[2.5rem] overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                                <div className="flex items-start gap-5 mb-8 relative z-10">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                                        <AlertCircle className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold mb-4">ข้อกำหนดและเงื่อนไข</h3>
                                        <ul className="space-y-3 text-muted-foreground">
                                            {[
                                                "ผู้เข้าร่วมกิจกรรมต้องมีเลเวล 1 ขึ้นไป",
                                                "ของรางวัลจะถูกส่งเข้าตัวละครภายใน 24 ชม.",
                                                "การตัดสินของทีมงานถือเป็นที่สิ้นสุด",
                                                "ห้ามใช้โปรแกรมช่วยเล่นทุกชนิด"
                                            ].map((rule, i) => (
                                                <li key={i} className="flex items-center gap-3">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                                                    {rule}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <Button className="w-full h-12 rounded-xl text-base" variant="secondary">
                                    อ่านกติกาฉบับเต็ม
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
