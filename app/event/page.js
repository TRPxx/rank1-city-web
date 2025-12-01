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
        <div className="flex gap-4 justify-center py-8">
            {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="flex flex-col items-center">
                    <div className="bg-background/80 backdrop-blur-md border border-primary/30 rounded-lg p-4 w-20 h-24 flex items-center justify-center shadow-[0_0_15px_rgba(var(--primary),0.3)]">
                        <span className="text-4xl font-black text-primary">{value}</span>
                    </div>
                    <span className="text-xs uppercase mt-2 text-muted-foreground font-medium">{unit}</span>
                </div>
            ))}
        </div>
    );
};

export default function SpecialEventPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-primary-foreground font-sans">
            <Navbar />

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
                {/* Background Video/Image */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black z-10" />
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=2874&auto=format&fit=crop')] bg-cover bg-center opacity-50" />
                </div>

                <div className="container relative z-20 text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Badge variant="outline" className="mb-4 px-4 py-1 text-lg border-primary text-primary bg-primary/10 backdrop-blur">
                            SPECIAL EVENT
                        </Badge>
                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 drop-shadow-2xl">
                            {EVENT_DATA.title}
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8 font-light">
                            {EVENT_DATA.subtitle}
                        </p>

                        <CountdownTimer targetDate={EVENT_DATA.startDate} />

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                            <Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_30px_rgba(var(--primary),0.5)] transition-all hover:scale-105">
                                เข้าร่วมกิจกรรม
                            </Button>
                            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-white/20 hover:bg-white/10 backdrop-blur transition-all hover:scale-105">
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
                    <div className="flex flex-col items-center gap-2 text-white/50">
                        <span className="text-xs uppercase tracking-widest">Scroll Down</span>
                        <ChevronRight className="rotate-90 w-6 h-6" />
                    </div>
                </motion.div>
            </section>

            {/* Highlights Section */}
            <section className="py-24 bg-zinc-950 relative">
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
                                <Card className="bg-zinc-900/50 border-zinc-800 overflow-hidden hover:border-primary/50 transition-colors group h-full">
                                    <div className="relative h-48 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent z-10" />
                                        {/* Placeholder for Image */}
                                        <div className="w-full h-full bg-zinc-800 group-hover:scale-110 transition-transform duration-500 flex items-center justify-center">
                                            <item.icon className="w-16 h-16 text-zinc-700 group-hover:text-primary/50 transition-colors" />
                                        </div>
                                    </div>
                                    <CardContent className="p-6 relative z-20 -mt-12">
                                        <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                                            <item.icon className="w-6 h-6 text-primary-foreground" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                                        <p className="text-muted-foreground">{item.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Schedule Section */}
            <section className="py-24 bg-black relative overflow-hidden">
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
                                        <div className="w-px h-12 bg-zinc-800 group-hover:bg-primary transition-colors" />
                                        <div className="text-lg font-medium group-hover:text-white text-zinc-400 transition-colors">
                                            {item.activity}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 blur-3xl rounded-full opacity-30" />
                            <Card className="relative bg-zinc-900/80 border-zinc-800 backdrop-blur-xl p-8">
                                <div className="flex items-start gap-4 mb-6">
                                    <AlertCircle className="w-6 h-6 text-primary shrink-0 mt-1" />
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">ข้อกำหนดและเงื่อนไข</h3>
                                        <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm">
                                            <li>ผู้เข้าร่วมกิจกรรมต้องมีเลเวล 1 ขึ้นไป</li>
                                            <li>ของรางวัลจะถูกส่งเข้าตัวละครภายใน 24 ชม.</li>
                                            <li>การตัดสินของทีมงานถือเป็นที่สิ้นสุด</li>
                                            <li>ห้ามใช้โปรแกรมช่วยเล่นทุกชนิด</li>
                                        </ul>
                                    </div>
                                </div>
                                <Button className="w-full" variant="secondary">
                                    อ่านกติกาฉบับเต็ม
                                </Button>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
