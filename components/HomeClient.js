'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, MessageCircle, PlayCircle, Facebook, Youtube, ChevronDown, Gamepad2, Gift, Shield, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import siteConfig from '@/lib/config';
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PreRegisterButton from '@/components/PreRegisterButton';
import GlobalRegisCounter from '@/components/GlobalRegisCounter';
import RecentRegistrations from '@/components/RecentRegistrations';
import { PREREGISTER_CONFIG } from '@/lib/preregister-config';
import { m, LazyMotion, domAnimation } from 'framer-motion';
import { usePreregisterStatus } from '@/hooks/usePreregisterStatus';

// Lazy load heavy components
const FeatureTabs = dynamic(() => import('@/components/FeatureTabs'), {
    loading: () => <div className="w-full h-[400px] animate-pulse bg-muted/20 rounded-xl" />,
    ssr: true
});

const NewsSection = dynamic(() => import('@/components/news/NewsSection'), {
    loading: () => <div className="w-full h-[300px] animate-pulse bg-muted/20 rounded-xl" />,
    ssr: true
});

const LiveServerHero = dynamic(() => import('@/components/LiveServerHero'), {
    loading: () => <div className="w-full h-[300px] animate-pulse bg-muted/20 rounded-xl" />,
    ssr: false
});

const MaintenancePage = dynamic(() => import('@/components/MaintenancePage'), {
    ssr: false
});

const RoadmapSlide = dynamic(() => import('@/components/slide2-concepts/RoadmapSlide'), { ssr: false });
const PreregisterDesignSwitcher = dynamic(() => import('@/components/PreregisterDesignSwitcher'), { ssr: false });

// Animation Variants
const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.1
        }
    }
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } }
};

export default function HomeClient({ initialFeatures, siteConfig }) {
    const { data: session } = useSession();
    const { isRegistered, isLoading, totalRegistrations, refetch } = usePreregisterStatus();
    const router = useRouter();
    const isServerLive = siteConfig?.serverStatus === 'live';

    // Check user registration status on login
    useEffect(() => {
        const checkUserRegistration = async () => {
            if (session?.user) {
                try {
                    const res = await fetch('/api/user/check');
                    const data = await res.json();
                    if (data.status === 'not_found') {
                        router.push('/register');
                    }
                } catch (error) {
                    console.error("Failed to check registration status:", error);
                }
            }
        };

        checkUserRegistration();
    }, [session, router]);

    // Auto-refresh when server status changes
    useEffect(() => {
        const checkServerStatus = async () => {
            try {
                const res = await fetch('/api/system/config');
                const data = await res.json();

                // If current status in prop is different from server, reload
                if (data.serverStatus && data.serverStatus !== (siteConfig?.serverStatus || 'preregister')) {
                    console.log('Server status changed, refreshing...');
                    window.location.reload();
                }
            } catch (error) {
                console.error("Failed to check server status");
            }
        };

        // Poll every 10 seconds
        const interval = setInterval(checkServerStatus, 10000);
        return () => clearInterval(interval);
    }, [siteConfig]);

    const fetchStatus = async () => {
        // Trigger a re-fetch of the data without reloading the page
        refetch();
    };

    const globalRewards = PREREGISTER_CONFIG.rewards.global;
    const maxCount = globalRewards[globalRewards.length - 1]?.count || 5000;
    const progressPercent = Math.min(100, (totalRegistrations / maxCount) * 100);

    if (siteConfig?.serverStatus === 'maintenance') {
        return <MaintenancePage discordLink={siteConfig?.links?.discord} />;
    }

    return (
        <LazyMotion features={domAnimation}>
            <section className="w-full min-h-screen md:h-dvh md:overflow-y-auto md:snap-y snap-mandatory scroll-smooth scrollbar-hide bg-background text-foreground">
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "VideoGame",
                            "name": "Rank1 City",
                            "description": "The best FiveM Roleplay experience in Thailand",
                            "genre": ["Roleplay", "Simulation"],
                            "playMode": "MultiPlayer",
                            "url": "https://rank1city.com",
                            "applicationCategory": "Game",
                            "operatingSystem": "Windows"
                        })
                    }}
                />

                {/* Slide 1: Hero Section */}
                <div className="w-full h-dvh snap-start flex flex-col relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                        <Image
                            src="/images/hero-bg-fivem.webp"
                            alt="Hero Background"
                            fill
                            className="object-cover object-center"
                            priority
                            quality={75}
                            sizes="100vw"
                        />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />

                    <Navbar />

                    <div className="flex-1 container flex items-center relative z-10">
                        {isServerLive ? (
                            <LiveServerHero siteConfig={siteConfig} />
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center w-full pt-20 md:pt-24 lg:pt-16">

                                {/* Left Content */}
                                <m.div
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={staggerContainer}
                                    style={{ willChange: 'opacity, transform' }}
                                    className="space-y-6 md:space-y-8 text-center lg:text-left"
                                >
                                    <m.div variants={fadeInUp} className="space-y-2 md:space-y-4">
                                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-foreground drop-shadow-2xl">
                                            {siteConfig?.name?.split(' ')[0] || 'Rank1'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">{siteConfig?.name?.split(' ')[1] || 'City'}</span>
                                        </h1>
                                        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto lg:mx-0">
                                            {siteConfig?.description}
                                        </p>
                                    </m.div>

                                    <m.div variants={fadeInUp} className="w-full max-w-md mx-auto lg:mx-0">
                                        {isLoading ? (
                                            <div className="h-16 w-full bg-muted/20 animate-pulse rounded-lg" />
                                        ) : isRegistered ? (
                                            <div className="flex flex-col gap-3">
                                                <Link href="/preregister" className="w-full">
                                                    <Button size="lg" className="w-full text-lg px-8 py-6 shadow-lg shadow-primary/20 bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 border-0 transition-transform hover:scale-105">
                                                        <Gift className="mr-2 h-6 w-6" />
                                                        เข้าสู่หน้ากิจกรรม & กาชาปอง
                                                    </Button>
                                                </Link>
                                                <p className="text-xs text-muted-foreground">คุณลงทะเบียนแล้ว! คลิกเพื่อเช็คชื่อและรับของรางวัล</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start w-full">
                                                <PreRegisterButton onRegisterSuccess={fetchStatus} />
                                                <Button size="lg" variant="outline" className="text-base md:text-lg px-6 md:px-8 py-6 border-blue-600/30 hover:bg-blue-600/10 w-full sm:w-auto backdrop-blur-sm transition-all hover:scale-105" onClick={() => window.open(siteConfig?.links?.discord || 'https://discord.gg/rank1', '_blank')}>
                                                    <MessageCircle className="mr-2 h-5 w-5 md:h-6 md:w-6" />
                                                    Discord Community
                                                </Button>
                                            </div>
                                        )}
                                    </m.div>

                                    <m.div variants={fadeInUp} className="hidden sm:flex items-center justify-center lg:justify-start gap-4 pt-4 md:pt-8 opacity-90">
                                        <GlobalRegisCounter />
                                        <div className="h-4 w-px bg-border" />
                                        <div className="text-sm text-muted-foreground font-medium">
                                            Coming Soon
                                        </div>
                                    </m.div>
                                </m.div>

                                {/* Right Visual */}
                                <m.div
                                    initial={{ opacity: 0, x: 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 1, delay: 0.2 }}
                                    viewport={{ once: true }}
                                    className="hidden lg:flex relative lg:h-[500px] items-center justify-center"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-3xl opacity-30 animate-pulse" />
                                    <RecentRegistrations />
                                </m.div>
                            </div>
                        )}
                    </div>

                    <m.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }}
                        className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2"
                    >
                        <ChevronDown className="h-6 w-6 md:h-8 md:w-8 text-muted-foreground/50" />
                    </m.div>
                </div>

                {/* Slide 2: Roadmap (Live) or Rewards (Pre-reg) */}
                <div className="w-full h-dvh snap-start bg-background flex flex-col items-center justify-center relative overflow-hidden">
                    {isServerLive ? (
                        <RoadmapSlide siteConfig={siteConfig} />
                    ) : (
                        <PreregisterDesignSwitcher
                            totalRegistrations={totalRegistrations}
                            isRegistered={isRegistered}
                        />
                    )}
                </div>

                {/* Slide 3: Features */}
                <div className="w-full h-dvh snap-start bg-muted/10 flex flex-col pt-16 md:pt-20 pb-4 md:pb-8">
                    <m.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.2 }}
                        variants={staggerContainer}
                        className="container h-full flex flex-col"
                    >
                        <m.div variants={fadeInUp} className="text-center mb-4 md:mb-8 px-4">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-3">ฟีเจอร์เด่น</h2>
                            <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
                                สัมผัสประสบการณ์ใหม่ที่ไม่เหมือนใคร ด้วยระบบที่เราพัฒนาขึ้นมาโดยเฉพาะ
                            </p>
                        </m.div>

                        <m.div variants={fadeInUp} className="flex-1 min-h-0">
                            <FeatureTabs features={initialFeatures} />
                        </m.div>
                    </m.div>
                </div>

                {/* Slide 4: News & Updates */}
                <div className="w-full h-dvh snap-start bg-background flex flex-col pt-16 md:pt-20">
                    <m.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.2 }}
                        variants={staggerContainer}
                        className="container flex-1 flex flex-col pb-4 md:pb-6 min-h-0"
                    >
                        <m.div variants={fadeInUp} className="flex-shrink-0 mb-1 md:mb-2 px-2">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">ข่าวสารและกิจกรรม</h2>
                            <p className="text-muted-foreground text-sm md:text-base">ติดตามความเคลื่อนไหวล่าสุดของ Rank1 City</p>
                        </m.div>

                        <m.div variants={scaleIn} className="flex-1 min-h-0 bg-card/30 rounded-xl md:rounded-2xl p-3 md:p-6 backdrop-blur-sm shadow-sm mx-2 md:mx-0 overflow-hidden">
                            <NewsSection />
                        </m.div>
                    </m.div>

                    <Footer />
                </div>
            </section>
        </LazyMotion>
    );
}
