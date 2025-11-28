'use client';

import { useState } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { Gamepad2, ChevronDown, Globe, Menu, X, User } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import siteConfig from '@/lib/config';
import { useSession, signIn } from "next-auth/react";
import Image from 'next/image';

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { data: session, status } = useSession();

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <header className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">

                {/* Logo */}
                <div className="flex items-center gap-2 mr-4 md:mr-8">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="bg-primary/10 p-2 rounded-lg">
                            <Gamepad2 className="h-6 w-6 text-primary" />
                        </div>
                        <span className="hidden font-bold sm:inline-block text-xl">{siteConfig.name}</span>
                    </Link>
                </div>

                {/* Desktop Menu */}
                <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                    {siteConfig.navItems.map((item, index) => (
                        <Link key={index} href={item.href} className="transition-colors hover:text-primary">
                            {item.label}
                        </Link>
                    ))}

                    {/* Community Dropdown */}
                    <div className="relative group cursor-pointer flex items-center gap-1 hover:text-primary transition-colors">
                        คอมมูนิตี้ <ChevronDown className="h-4 w-4" />
                        <div className="absolute top-full left-0 mt-2 w-48 bg-card border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2">
                            <Link href={siteConfig.links.discord} target="_blank" rel="noopener noreferrer" className="block px-4 py-2 hover:bg-accent rounded-sm">Discord</Link>
                            <Link href={siteConfig.links.facebook} target="_blank" rel="noopener noreferrer" className="block px-4 py-2 hover:bg-accent rounded-sm">Facebook</Link>
                            <Link href={siteConfig.links.youtube} target="_blank" rel="noopener noreferrer" className="block px-4 py-2 hover:bg-accent rounded-sm">YouTube</Link>
                            <Link href={siteConfig.links.tiktok} target="_blank" rel="noopener noreferrer" className="block px-4 py-2 hover:bg-accent rounded-sm">TikTok</Link>
                        </div>
                    </div>
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-2 md:gap-4">
                    {/* Language Switcher */}
                    <div className="hidden sm:flex items-center gap-1 text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground">
                        <Globe className="h-4 w-4" />
                        <span>TH</span>
                    </div>

                    <ThemeToggle />

                    {status === 'loading' ? (
                        <div className="hidden sm:flex items-center gap-2 pl-2 pr-4">
                            <div className="w-6 h-6 rounded-full bg-muted animate-pulse" />
                            <div className="w-20 h-4 bg-muted rounded animate-pulse" />
                        </div>
                    ) : session ? (
                        <Link href="/profile">
                            <Button variant="ghost" className="hidden sm:flex items-center gap-2 pl-2 pr-4">
                                <div className="relative w-6 h-6 rounded-full overflow-hidden">
                                    <Image
                                        src={session.user.image || "https://placehold.co/100x100"}
                                        alt="Profile"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <span>{session.user.name}</span>
                            </Button>
                        </Link>
                    ) : (
                        <Button className="hidden sm:flex" onClick={() => signIn('discord')}>เข้าสู่ระบบ</Button>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-muted-foreground hover:text-foreground"
                        onClick={toggleMobileMenu}
                        aria-label="Toggle menu"
                        aria-expanded={isMobileMenuOpen}
                        aria-controls="mobile-menu"
                    >
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-b bg-background"
                        id="mobile-menu"
                        role="region"
                        aria-label="Mobile Navigation"
                    >
                        <div className="container py-4 flex flex-col gap-4">
                            {siteConfig.navItems.map((item, index) => (
                                <Link key={index} href={item.href} className="text-sm font-medium hover:text-primary px-2 py-1" onClick={toggleMobileMenu}>
                                    {item.label}
                                </Link>
                            ))}

                            <div className="border-t pt-4 mt-2">
                                <p className="text-xs text-muted-foreground mb-2 px-2">คอมมูนิตี้</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <Link href={siteConfig.links.discord} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-primary px-2 py-1" onClick={toggleMobileMenu}>Discord</Link>
                                    <Link href={siteConfig.links.facebook} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-primary px-2 py-1" onClick={toggleMobileMenu}>Facebook</Link>
                                    <Link href={siteConfig.links.youtube} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-primary px-2 py-1" onClick={toggleMobileMenu}>YouTube</Link>
                                    <Link href={siteConfig.links.tiktok} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-primary px-2 py-1" onClick={toggleMobileMenu}>TikTok</Link>
                                </div>
                            </div>

                            <div className="border-t pt-4 flex flex-col gap-3">
                                {session ? (
                                    <Link href="/profile" onClick={toggleMobileMenu}>
                                        <Button className="w-full flex items-center gap-2">
                                            <User className="w-4 h-4" /> ข้อมูลส่วนตัว
                                        </Button>
                                    </Link>
                                ) : (
                                    <Button className="w-full" onClick={() => { toggleMobileMenu(); signIn('discord'); }}>เข้าสู่ระบบ</Button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
