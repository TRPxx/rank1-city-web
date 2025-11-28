'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, MessageCircle, PlayCircle, Facebook, Youtube, ChevronDown, Gamepad2 } from 'lucide-react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import siteConfig from '@/lib/config';

// Lazy load heavy components below the fold
const FeatureTabs = dynamic(() => import('@/components/FeatureTabs'), {
  loading: () => <div className="w-full h-[400px] animate-pulse bg-muted/20 rounded-xl" />,
  ssr: true // Keep SSR for SEO
});

const NewsSection = dynamic(() => import('@/components/news/NewsSection'), {
  loading: () => <div className="w-full h-[300px] animate-pulse bg-muted/20 rounded-xl" />,
  ssr: true
});

export default function Home() {
  return (
    <section className="w-full h-dvh overflow-y-auto snap-y snap-mandatory scroll-smooth scrollbar-hide">

      {/* Slide 1: Hero Section (LCP Candidate - Keep Static Import or Priority) */}
      <div className="w-full h-dvh snap-start flex flex-col relative overflow-hidden">
        {/* ... Hero Content ... */}
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/images/hero-bg-fivem.png"
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
            <div className="space-y-6 md:space-y-8 text-center lg:text-left animate-in slide-in-from-left duration-700 fade-in">
              <div className="space-y-2 md:space-y-4">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-foreground drop-shadow-2xl">
                  {siteConfig.name.split(' ')[0]} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">{siteConfig.name.split(' ')[1]}</span>
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto lg:mx-0">
                  {siteConfig.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start w-full sm:w-auto">
                <Button size="lg" className="text-base md:text-lg px-6 md:px-8 py-6 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/20 w-full sm:w-auto transition-all hover:scale-105">
                  <Gamepad2 className="mr-2 h-5 w-5 md:h-6 md:w-6" />
                  ลงทะเบียนล่วงหน้า
                </Button>
                <Button size="lg" variant="outline" className="text-base md:text-lg px-6 md:px-8 py-6 border-blue-600/30 hover:bg-blue-600/10 w-full sm:w-auto backdrop-blur-sm transition-all hover:scale-105">
                  <MessageCircle className="mr-2 h-5 w-5 md:h-6 md:w-6" />
                  Discord Community
                </Button>
              </div>

              {/* Event Strip - Hidden on small mobile */}
              <div className="hidden sm:flex items-center justify-center lg:justify-start gap-4 pt-4 md:pt-8 opacity-80">
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full border border-border/50">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Online Players: 1,240
                </div>
                <div className="h-4 w-px bg-border" />
                <div className="text-sm text-muted-foreground">
                  Season 2 Coming Soon
                </div>
              </div>
            </div>

            {/* Right Visual - Only visible on large desktop screens */}
            <div className="hidden lg:flex relative lg:h-[500px] items-center justify-center animate-in slide-in-from-right duration-700 delay-200">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-3xl opacity-30 animate-pulse" />
              <div className="relative w-full max-w-xs md:max-w-sm lg:max-w-md aspect-square bg-gradient-to-b from-muted/50 to-muted/10 rounded-3xl border border-border/50 flex items-center justify-center shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                <span className="text-muted-foreground font-medium text-sm md:text-base">Character Art / Gameplay Video</span>
                <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8">
                  <Button variant="secondary" className="w-full gap-2 bg-background/80 backdrop-blur hover:bg-background text-sm md:text-base">
                    <PlayCircle className="h-4 w-4 md:h-5 md:w-5 text-primary" /> รับชมตัวอย่าง
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-6 w-6 md:h-8 md:w-8 text-muted-foreground/50" />
        </div>
      </div>

      {/* Slide 2: Features (Lazy Loaded) */}
      <div className="w-full h-dvh snap-start bg-muted/10 flex flex-col pt-16 md:pt-20 pb-4 md:pb-8">
        <div className="container h-full flex flex-col">
          <div className="text-center mb-4 md:mb-8 px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-3">ฟีเจอร์เด่น</h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
              สัมผัสประสบการณ์ใหม่ที่ไม่เหมือนใคร ด้วยระบบที่เราพัฒนาขึ้นมาโดยเฉพาะ
            </p>
          </div>

          <div className="flex-1 min-h-0">
            <FeatureTabs />
          </div>
        </div>
      </div>

      {/* Slide 3: News & Updates (Lazy Loaded) */}
      <div className="w-full h-dvh snap-start bg-background flex flex-col pt-16 md:pt-20">
        <div className="container flex-1 flex flex-col pb-4 md:pb-6 min-h-0">

          {/* Header */}
          <div className="flex-shrink-0 mb-1 md:mb-2 px-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">ข่าวสารและกิจกรรม</h2>
            <p className="text-muted-foreground text-sm md:text-base">ติดตามความเคลื่อนไหวล่าสุดของ Rank1 City</p>
          </div>

          {/* News Section (Compact List) */}
          <div className="flex-1 min-h-0 bg-card/30 rounded-xl md:rounded-2xl p-3 md:p-6 backdrop-blur-sm shadow-sm mx-2 md:mx-0 overflow-hidden">
            <NewsSection />
          </div>

        </div>

        {/* Minimal Footer */}
        <Footer />
      </div>
    </section>
  );
}
