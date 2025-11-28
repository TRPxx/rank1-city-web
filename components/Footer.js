import Link from 'next/link';
import Image from 'next/image';
import { Gamepad2 } from 'lucide-react';
import siteConfig from '@/lib/config';

export default function Footer() {
    return (
        <footer className="w-full bg-background border-t border-border py-3 md:py-4 mt-auto transition-colors duration-300">
            <div className="container flex flex-col items-center justify-center gap-2 md:gap-4">

                {/* Logos Section - Responsive Layout */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 opacity-90">
                    {/* Rank1 Production Logo */}
                    <div className="flex items-center relative h-10 md:h-14 w-32 md:w-40">
                        <Image
                            src="/images/footer/rank1_production_logo.png"
                            alt={siteConfig.footer.developer.name}
                            fill
                            className="object-contain invert hue-rotate-180 dark:invert-0 dark:hue-rotate-0 transition-all duration-300"
                            sizes="(max-width: 768px) 128px, 160px"
                        />
                    </div>

                    {/* Divider - Horizontal on mobile, Vertical on desktop */}
                    <div className="h-px w-full md:h-10 md:w-px bg-border mx-0 md:mx-4" />

                    {/* RANK1 Development */}
                    <div className="flex items-center gap-2">
                        <Gamepad2 className="h-6 w-6 md:h-8 md:w-8 text-blue-500" />
                        <div className="flex flex-col justify-center h-full">
                            <span className="text-foreground font-black text-base md:text-lg tracking-wide leading-none">{siteConfig.footer.developer.name}</span>
                            <span className="text-muted-foreground text-[8px] md:text-[9px] font-bold uppercase tracking-[0.2em] leading-none mt-0.5">{siteConfig.footer.developer.sub}</span>
                        </div>
                    </div>
                </div>

                {/* Red Gradient Separator */}
                <div className="w-full max-w-2xl h-px bg-gradient-to-r from-transparent via-red-900/30 to-transparent" />

                {/* Copyright & Links - Responsive Layout */}
                <div className="flex flex-col md:flex-row items-center gap-1.5 md:gap-3 text-[9px] md:text-[10px] text-muted-foreground text-center md:text-left">
                    <p>{siteConfig.footer.copyright}</p>
                    <div className="hidden md:block w-px h-2.5 bg-border" />
                    <div className="flex gap-3">
                        <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
                        <span className="text-muted-foreground">|</span>
                        <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
                    </div>
                </div>

            </div>
        </footer>
    );
}
