'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, MessageCircle, PlayCircle, Facebook, Youtube, ChevronDown, Gamepad2, Gift, Shield } from 'lucide-react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import siteConfig from '@/lib/config';
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import PreRegisterButton from '@/components/PreRegisterButton';
import GlobalRegisCounter from '@/components/GlobalRegisCounter';
import { PREREGISTER_CONFIG } from '@/lib/preregister-config';
import { motion } from 'framer-motion';

// Lazy load heavy components
const FeatureTabs = dynamic(() => import('@/components/FeatureTabs'), {
  loading: () => <div className="w-full h-[400px] animate-pulse bg-muted/20 rounded-xl" />,
  ssr: true
});

const NewsSection = dynamic(() => import('@/components/news/NewsSection'), {
  loading: () => <div className="w-full h-[300px] animate-pulse bg-muted/20 rounded-xl" />,
  ssr: true
});

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

export default function Home() {
  const { data: session } = useSession();
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [totalRegistrations, setTotalRegistrations] = useState(0);

  const fetchStatus = async () => {
    if (session) {
      try {
        const res = await fetch('/api/preregister');
        const data = await res.json();
        if (data.isRegistered) setIsRegistered(true);
      } catch (error) {
        console.error("Failed to fetch user status", error);
      }
    }

    try {
      const res = await fetch('/api/preregister/stats');
      const data = await res.json();
      if (data.total) setTotalRegistrations(data.total);
    } catch (error) {
      console.error("Failed to fetch global stats", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [session]);

  const globalRewards = PREREGISTER_CONFIG.rewards.global;
  const maxCount = globalRewards[globalRewards.length - 1]?.count || 5000;
  const progressPercent = Math.min(100, (totalRegistrations / maxCount) * 100);

  return (
    <section className="w-full h-dvh overflow-y-auto md:snap-y snap-mandatory scroll-smooth scrollbar-hide bg-background text-foreground">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center w-full pt-20 md:pt-24 lg:pt-16">

            {/* Left Content */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              style={{ willChange: 'opacity, transform' }}
              className="space-y-6 md:space-y-8 text-center lg:text-left"
            >
              <motion.div variants={fadeInUp} className="space-y-2 md:space-y-4">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-foreground drop-shadow-2xl">
                  {siteConfig.name.split(' ')[0]} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">{siteConfig.name.split(' ')[1]}</span>
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto lg:mx-0">
                  {siteConfig.description}
                </p>
              </motion.div>

              <motion.div variants={fadeInUp} className="w-full max-w-md mx-auto lg:mx-0">
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
                    <Button size="lg" variant="outline" className="text-base md:text-lg px-6 md:px-8 py-6 border-blue-600/30 hover:bg-blue-600/10 w-full sm:w-auto backdrop-blur-sm transition-all hover:scale-105" onClick={() => window.open('https://discord.gg/rank1', '_blank')}>
                      <MessageCircle className="mr-2 h-5 w-5 md:h-6 md:w-6" />
                      Discord Community
                    </Button>
                  </div>
                )}
              </motion.div>

              <motion.div variants={fadeInUp} className="hidden sm:flex items-center justify-center lg:justify-start gap-4 pt-4 md:pt-8 opacity-90">
                <GlobalRegisCounter />
                <div className="h-4 w-px bg-border" />
                <div className="text-sm text-muted-foreground font-medium">
                  Coming Soon
                </div>
              </motion.div>
            </motion.div>

            {/* Right Visual */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}
              className="hidden lg:flex relative lg:h-[500px] items-center justify-center"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-3xl opacity-30 animate-pulse" />
              <div className="relative w-full max-w-xs md:max-w-sm lg:max-w-md aspect-square bg-gradient-to-b from-muted/50 to-muted/10 rounded-3xl border border-border/50 flex items-center justify-center shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="text-center p-6">
                  <Gamepad2 className="w-16 h-16 text-primary mx-auto mb-4 opacity-50" />
                  <span className="text-muted-foreground font-medium text-sm md:text-base block mb-6">Character Art / Gameplay Video</span>
                  <Button variant="secondary" className="gap-2 bg-background/80 backdrop-blur hover:bg-background text-sm md:text-base">
                    <PlayCircle className="h-4 w-4 md:h-5 md:w-5 text-primary" /> รับชมตัวอย่าง
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }}
          className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="h-6 w-6 md:h-8 md:w-8 text-muted-foreground/50" />
        </motion.div>
      </div>

      {/* Slide 2: Global Milestone Rewards */}
      <div className="w-full h-dvh snap-start bg-background flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={staggerContainer}
          className="container max-w-6xl relative z-20 flex flex-col h-full justify-center px-4 md:px-6"
        >
          <motion.div variants={fadeInUp} className="flex flex-col items-center text-center mb-8 space-y-4">
            <Badge variant="outline" className="uppercase tracking-wider">Season 1</Badge>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter sm:text-6xl">
              รางวัลเป้าหมายยอดลงทะเบียน
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              ยิ่งมีชาวเมืองลงทะเบียนมาก ยิ่งได้รับของรางวัลยกเซิร์ฟ!
            </p>
          </motion.div>

          <motion.div variants={scaleIn} className="w-full max-w-2xl mx-auto mb-12 px-4">
            <div className="flex justify-between text-sm mb-2 font-medium">
              <span className="text-muted-foreground">ยอดลงทะเบียนปัจจุบัน</span>
              <span className="text-primary font-bold text-lg">{totalRegistrations.toLocaleString()} / {maxCount.toLocaleString()} คน</span>
            </div>
            <div className="h-6 w-full bg-secondary rounded-full overflow-hidden shadow-inner border border-border/50 relative">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${progressPercent}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-400 rounded-full shadow-lg shadow-blue-500/20 relative"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 animate-shimmer" />
              </motion.div>
            </div>
          </motion.div>

          <motion.div variants={staggerContainer} className="w-full relative">
            <div className="relative w-full overflow-x-auto pb-12 pt-4 custom-scrollbar">
              <div className="flex items-start justify-center gap-6 min-w-max px-4 mx-auto">
                <div className="absolute left-10 right-10 top-[28px] h-[2px] bg-border -z-10" />
                {globalRewards.map((reward, index) => {
                  const isUnlocked = totalRegistrations >= reward.count;
                  return (
                    <motion.div
                      key={index}
                      variants={fadeInUp}
                      className={`flex flex-col items-center gap-4 group w-48 ${isUnlocked ? 'opacity-100' : 'opacity-80 grayscale-[0.8] hover:grayscale-0 transition-all'}`}
                    >
                      <div className={`w-14 h-14 rounded-full border-4 flex items-center justify-center z-10 shadow-sm transition-all duration-500 ${isUnlocked ? 'bg-primary text-primary-foreground border-primary scale-110 shadow-primary/30' : 'bg-background border-border group-hover:border-primary group-hover:text-primary'}`}>
                        {isUnlocked ? <Users className="w-6 h-6" /> : <span className="text-sm font-bold">{reward.count >= 1000 ? `${reward.count / 1000}k` : reward.count}</span>}
                      </div>
                      <div className={`w-full rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:border-primary/50 p-4 text-center group/card ${isUnlocked ? 'border-primary/50 shadow-md shadow-primary/10 ring-1 ring-primary/20' : ''}`}>
                        <div className="mb-3 flex justify-center relative w-24 h-24 mx-auto">
                          {reward.image ? (
                            <Image
                              src={reward.image}
                              alt={reward.name}
                              fill
                              className="object-contain drop-shadow-lg group-hover/card:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="p-4 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                              <Gift className="w-8 h-8" />
                            </div>
                          )}
                        </div>
                        <h3 className="font-semibold tracking-tight text-sm mb-1 truncate px-1" title={reward.name}>{reward.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {isUnlocked ? 'ปลดล็อกแล้ว!' : `ขาดอีก ${(reward.count - totalRegistrations).toLocaleString()}`}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <motion.div variants={fadeInUp} className="mt-8 text-center">
              <Link href="/preregister">
                <Button size="lg" className="font-semibold shadow-lg">
                  ลงทะเบียนเลย <ChevronDown className="ml-2 h-4 w-4 -rotate-90" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Slide 3: Features */}
      <div className="w-full h-dvh snap-start bg-muted/10 flex flex-col pt-16 md:pt-20 pb-4 md:pb-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={staggerContainer}
          className="container h-full flex flex-col"
        >
          <motion.div variants={fadeInUp} className="text-center mb-4 md:mb-8 px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-3">ฟีเจอร์เด่น</h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
              สัมผัสประสบการณ์ใหม่ที่ไม่เหมือนใคร ด้วยระบบที่เราพัฒนาขึ้นมาโดยเฉพาะ
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex-1 min-h-0">
            <FeatureTabs />
          </motion.div>
        </motion.div>
      </div>

      {/* Slide 4: News & Updates */}
      <div className="w-full h-dvh snap-start bg-background flex flex-col pt-16 md:pt-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={staggerContainer}
          className="container flex-1 flex flex-col pb-4 md:pb-6 min-h-0"
        >
          <motion.div variants={fadeInUp} className="flex-shrink-0 mb-1 md:mb-2 px-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">ข่าวสารและกิจกรรม</h2>
            <p className="text-muted-foreground text-sm md:text-base">ติดตามความเคลื่อนไหวล่าสุดของ Rank1 City</p>
          </motion.div>

          <motion.div variants={scaleIn} className="flex-1 min-h-0 bg-card/30 rounded-xl md:rounded-2xl p-3 md:p-6 backdrop-blur-sm shadow-sm mx-2 md:mx-0 overflow-hidden">
            <NewsSection />
          </motion.div>
        </motion.div>

        <Footer />
      </div>
    </section>
  );
}
