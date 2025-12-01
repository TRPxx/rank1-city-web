'use client';

import { useState } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Gamepad2, ChevronDown, Globe, Menu, X, User, Gift, Newspaper, LogOut, LayoutDashboard, Shield, Star } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import staticConfig from '@/lib/config';
import { useSession, signIn, signOut } from "next-auth/react";
import Image from 'next/image';

export default function Navbar({ siteConfig: propConfig }) {
    const siteConfig = propConfig || staticConfig;
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
                    {/* Activity & Gachapon Link (Simple Style) */}
                    <Link href="/preregister" className="flex items-center gap-2 transition-colors hover:text-primary">
                        <Gift className="w-4 h-4" />
                        หน้ากิจกรรม & กาชาปอง
                    </Link>

                    {/* News Link */}
                    <Link href="/news" className="flex items-center gap-2 transition-colors hover:text-primary">
                        <Newspaper className="w-4 h-4" />
                        ข่าวสาร
                    </Link>

                    {/* Special Event Link */}
                    <Link href="/event" className="flex items-center gap-2 transition-colors hover:text-primary relative group">
                        <Star className="w-4 h-4 text-yellow-500 group-hover:text-yellow-400 animate-pulse" />
                        <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent font-bold group-hover:from-yellow-400 group-hover:to-orange-400">
                            SPECIAL EVENT
                        </span>
                        <Badge variant="destructive" className="absolute -top-3 -right-6 text-[10px] px-1 h-4">NEW</Badge>
                    </Link>

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
                            <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
                            <div className="w-20 h-4 bg-muted rounded animate-pulse" />
                        </div>
                    ) : session ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={session.user.image} alt={session.user.name} />
                                        <AvatarFallback>{session.user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 mt-4" align="end">
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{session.user.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {session.user.isAdmin ? 'ผู้ดูแลระบบ' : 'สมาชิก'}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem asChild>
                                        <Link href="/profile" className="cursor-pointer w-full flex items-center">
                                            <User className="mr-2 h-4 w-4" />
                                            <span>ข้อมูลส่วนตัว</span>
                                            {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
                                        </Link>
                                    </DropdownMenuItem>
                                    {session.user.isAdmin && (
                                        <DropdownMenuItem asChild>
                                            <Link href="/admin" className="cursor-pointer w-full flex items-center text-primary focus:text-primary">
                                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                                <span>จัดการระบบ (Admin)</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })} className="cursor-pointer text-destructive focus:text-destructive">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>ออกจากระบบ</span>
                                    {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
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
                            {/* Mobile Custom Menu */}
                            <Link href="/preregister" className="flex items-center gap-2 text-sm font-medium hover:text-primary px-2 py-1" onClick={toggleMobileMenu}>
                                <Gift className="w-4 h-4" />
                                หน้ากิจกรรม & กาชาปอง
                            </Link>

                            <Link href="/news" className="flex items-center gap-2 text-sm font-medium hover:text-primary px-2 py-1" onClick={toggleMobileMenu}>
                                <Newspaper className="w-4 h-4" />
                                ข่าวสาร
                            </Link>

                            <Link href="/event" className="flex items-center gap-2 text-sm font-medium hover:text-primary px-2 py-1" onClick={toggleMobileMenu}>
                                <Star className="w-4 h-4 text-yellow-500" />
                                <span className="text-yellow-500 font-bold">SPECIAL EVENT</span>
                            </Link>

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
                                    <>
                                        <div className="flex items-center gap-3 px-2 mb-2">
                                            <div className="relative w-10 h-10 rounded-full overflow-hidden border">
                                                <Image
                                                    src={session.user.image || "https://placehold.co/100x100"}
                                                    alt="Profile"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{session.user.name}</span>
                                                {session.user.isAdmin && (
                                                    <span className="text-xs text-primary flex items-center gap-1">
                                                        <Shield className="w-3 h-3" /> ผู้ดูแลระบบ
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <Link href="/profile" onClick={toggleMobileMenu}>
                                            <Button variant="outline" className="w-full flex items-center gap-2 justify-start">
                                                <User className="w-4 h-4" /> ข้อมูลส่วนตัว
                                            </Button>
                                        </Link>
                                        {session.user.isAdmin && (
                                            <Link href="/admin" onClick={toggleMobileMenu}>
                                                <Button variant="outline" className="w-full flex items-center gap-2 justify-start text-primary border-primary/20 hover:bg-primary/10">
                                                    <LayoutDashboard className="w-4 h-4" /> จัดการระบบ (Admin)
                                                </Button>
                                            </Link>
                                        )}
                                        <Button variant="destructive" className="w-full flex items-center gap-2" onClick={() => signOut({ callbackUrl: '/' })}>
                                            <LogOut className="w-4 h-4" /> ออกจากระบบ
                                        </Button>
                                    </>
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
