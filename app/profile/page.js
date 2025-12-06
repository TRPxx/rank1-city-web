'use client';

import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    User, Wallet, CreditCard, Phone, Calendar, LogOut, Search,
    Backpack, Swords, Shield, Vault, Loader2, Briefcase, MapPin,
    Stethoscope, Wrench, Car, Gavel, Package, Menu, X, LayoutGrid
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import GiftInventory from "@/components/GiftInventory";

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const [gameData, setGameData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("inventory");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (session?.user) {
            fetchGameData();
        }
    }, [session]);

    const fetchGameData = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/user/profile');
            const data = await res.json();

            if (res.ok) {
                setGameData(data);
            } else {
                setError(data.error || "ไม่พบข้อมูลตัวละคร");
            }
        } catch (err) {
            setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
        } finally {
            setLoading(false);
        }
    };

    const filterItems = (items) => {
        if (!items) return [];
        const itemList = Array.isArray(items) ? items : Object.entries(items).map(([name, val]) =>
            typeof val === 'object' ? { name, ...val } : { name, count: val }
        );
        return itemList.filter(item => {
            const count = item.count || item.ammo || 0;
            const name = item.label || item.name || "";
            return count > 0 && name.toLowerCase().includes(searchTerm.toLowerCase());
        });
    };

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const handleMobileTabChange = (tab) => {
        setActiveTab(tab);
        setIsMobileMenuOpen(false);
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!session) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Navbar />
                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-muted/30 p-8 rounded-[2.5rem] text-center">
                        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                            <User className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">เข้าสู่ระบบ</h2>
                        <p className="text-muted-foreground mb-8">กรุณาเข้าสู่ระบบด้วย Discord เพื่อดูข้อมูลตัวละคร</p>
                        <Button onClick={() => signIn('discord')} className="w-full h-12 rounded-xl text-lg" size="lg">
                            เข้าสู่ระบบด้วย Discord
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            <Navbar />

            <main className="flex-1 container max-w-7xl py-8 pt-24 space-y-6 md:space-y-8 px-4">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h2 className="text-4xl font-bold tracking-tight">โปรไฟล์</h2>
                        <p className="text-lg text-muted-foreground">
                            จัดการข้อมูลตัวละครและทรัพย์สินของคุณ
                        </p>
                    </div>
                    <Button variant="outline" onClick={() => signOut({ callbackUrl: '/' })} className="rounded-full px-6 border-muted-foreground/20 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20">
                        <LogOut className="mr-2 h-4 w-4" /> ออกจากระบบ
                    </Button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-4 space-y-6">
                            <Skeleton className="h-[500px] w-full rounded-[2.5rem]" />
                        </div>
                        <div className="lg:col-span-8 space-y-6">
                            <Skeleton className="h-12 w-full rounded-full" />
                            <Skeleton className="h-[400px] w-full rounded-[2.5rem]" />
                        </div>
                    </div>
                ) : error ? (
                    <div className="bg-destructive/5 border border-destructive/20 rounded-[2rem] p-12 text-center">
                        <Shield className="h-16 w-16 text-destructive mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-bold text-destructive mb-2">ไม่พบข้อมูล</h3>
                        <p className="text-muted-foreground">{error}</p>
                    </div>
                ) : gameData ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Sidebar / Profile Card */}
                        <div className="lg:col-span-4">
                            <div className="bg-muted/30 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 relative overflow-hidden h-full">
                                <div className="absolute top-0 left-0 w-full h-24 md:h-32 bg-gradient-to-b from-primary/10 to-transparent" />

                                <div className="relative flex flex-col items-center text-center">
                                    {/* Avatar Section */}
                                    <div className="relative mb-4 md:mb-6">
                                        <Avatar className="h-24 w-24 md:h-32 md:w-32 ring-4 ring-border/50 shadow-xl">
                                            <AvatarImage src={session?.user?.image} alt={gameData.firstname} />
                                            <AvatarFallback className="text-3xl md:text-4xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-bold">
                                                {gameData.firstname?.[0]}{gameData.lastname?.[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>

                                    <h3 className="text-2xl md:text-3xl font-bold mb-2 md:mb-3 tracking-tight">{gameData.firstname} {gameData.lastname}</h3>

                                    {/* Job & Gender Badges */}
                                    <div className="flex items-center gap-2 mb-6 md:mb-8 flex-wrap justify-center">
                                        <div className="inline-flex items-center px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-background/50 backdrop-blur-sm border border-border/50 text-xs md:text-sm font-medium text-foreground/80">
                                            {(() => {
                                                const job = gameData.job?.toLowerCase() || '';
                                                if (job.includes('police') || job.includes('sheriff')) return <Shield className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2 text-blue-500" />;
                                                if (job.includes('ambulance') || job.includes('medic') || job.includes('doctor')) return <Stethoscope className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2 text-red-500" />;
                                                if (job.includes('mechanic') || job.includes('fix')) return <Wrench className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2 text-orange-500" />;
                                                if (job.includes('taxi') || job.includes('driver')) return <Car className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2 text-yellow-500" />;
                                                if (job.includes('judge') || job.includes('lawyer')) return <Gavel className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2 text-purple-500" />;
                                                return <Briefcase className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2 text-gray-500" />;
                                            })()}
                                            {gameData.job_label}
                                        </div>

                                        {/* Gender Badge */}
                                        <div className={cn(
                                            "px-2.5 py-1 md:px-3 md:py-1.5 rounded-full text-[10px] md:text-xs font-semibold",
                                            gameData.sex === 'ชาย' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                                                gameData.sex === 'หญิง' ? 'bg-pink-500/10 text-pink-500 border border-pink-500/20' :
                                                    'bg-purple-500/10 text-purple-500 border border-purple-500/20'
                                        )}>
                                            {gameData.sex}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 md:gap-4 w-full mb-6 md:mb-8">
                                        <div className="flex flex-col items-center p-3 md:p-4 bg-background/60 rounded-2xl md:rounded-3xl shadow-sm">
                                            <div className="p-1.5 md:p-2 bg-emerald-500/10 rounded-xl mb-1.5 md:mb-2">
                                                <Wallet className="w-5 h-5 md:w-6 md:h-6 text-emerald-500" />
                                            </div>
                                            <span className="text-[10px] md:text-xs text-muted-foreground font-medium uppercase tracking-wider mb-0.5 md:mb-1">เงินสด</span>
                                            <span className="font-bold text-lg md:text-xl">${gameData.money.toLocaleString()}</span>
                                        </div>
                                        <div className="flex flex-col items-center p-3 md:p-4 bg-background/60 rounded-2xl md:rounded-3xl shadow-sm">
                                            <div className="p-1.5 md:p-2 bg-blue-500/10 rounded-xl mb-1.5 md:mb-2">
                                                <CreditCard className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
                                            </div>
                                            <span className="text-[10px] md:text-xs text-muted-foreground font-medium uppercase tracking-wider mb-0.5 md:mb-1">ธนาคาร</span>
                                            <span className="font-bold text-lg md:text-xl">${gameData.bank.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="w-full space-y-3 md:space-y-4 bg-background/40 p-5 md:p-6 rounded-2xl md:rounded-3xl">
                                        <div className="flex justify-between items-center text-xs md:text-sm">
                                            <span className="text-muted-foreground flex items-center gap-2 md:gap-3">
                                                <div className="p-1.5 bg-background rounded-lg"><Phone className="w-3 h-3 md:w-3.5 md:h-3.5" /></div>
                                                เบอร์โทรศัพท์
                                            </span>
                                            <span className="font-medium">{gameData.phone}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs md:text-sm">
                                            <span className="text-muted-foreground flex items-center gap-2 md:gap-3">
                                                <div className="p-1.5 bg-background rounded-lg"><Calendar className="w-3 h-3 md:w-3.5 md:h-3.5" /></div>
                                                วันเกิด
                                            </span>
                                            <span className="font-medium">{gameData.dob}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs md:text-sm">
                                            <span className="text-muted-foreground flex items-center gap-2 md:gap-3">
                                                <div className="p-1.5 bg-background rounded-lg"><MapPin className="w-3 h-3 md:w-3.5 md:h-3.5" /></div>
                                                Citizen ID
                                            </span>
                                            <span className="font-mono font-medium bg-background px-2 py-0.5 rounded-md text-[10px] md:text-xs">{gameData.citizenid}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content / Inventory */}
                        <div className="lg:col-span-8 flex flex-col">
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col h-full">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 flex-none">
                                    <TabsList className="hidden lg:inline-flex bg-muted/50 p-1 rounded-full h-auto">
                                        <TabsTrigger value="inventory" className="rounded-full px-6 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                            <Backpack className="w-4 h-4 mr-2" /> กระเป๋า
                                        </TabsTrigger>
                                        <TabsTrigger value="weapons" className="rounded-full px-6 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                            <Swords className="w-4 h-4 mr-2" /> อาวุธ
                                        </TabsTrigger>
                                        <TabsTrigger value="safe" className="rounded-full px-6 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                            <Vault className="w-4 h-4 mr-2" /> ตู้เซฟ
                                        </TabsTrigger>
                                        <TabsTrigger value="gift" className="rounded-full px-6 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                            <Package className="w-4 h-4 mr-2" /> ของขวัญ
                                        </TabsTrigger>
                                    </TabsList>

                                    <div className="relative w-full sm:w-72">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="ค้นหาไอเทม..."
                                            className="pl-10 h-11 rounded-2xl bg-muted/30 border-transparent focus:bg-background transition-all"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="bg-muted/30 rounded-[2.5rem] p-8 relative overflow-hidden flex-1 pb-24 md:pb-8">
                                    <TabsContent value="inventory" className="mt-0 focus-visible:ring-0 h-full overflow-y-auto custom-scrollbar pr-2">
                                        <div className="mb-6 px-2">
                                            <h3 className="text-xl font-bold">รายการไอเทม</h3>
                                            <p className="text-muted-foreground">ไอเทมทั้งหมดในกระเป๋าของคุณ</p>
                                        </div>
                                        <InventoryGrid items={filterItems(gameData.inventory)} type="item" />
                                    </TabsContent>

                                    <TabsContent value="weapons" className="mt-0 focus-visible:ring-0 h-full overflow-y-auto custom-scrollbar pr-2">
                                        <div className="mb-6 px-2">
                                            <h3 className="text-xl font-bold">อาวุธยุทโธปกรณ์</h3>
                                            <p className="text-muted-foreground">อาวุธที่พกพาอยู่</p>
                                        </div>
                                        <InventoryGrid items={filterItems(gameData.loadout)} type="weapon" />
                                    </TabsContent>

                                    <TabsContent value="safe" className="mt-0 focus-visible:ring-0 h-full overflow-y-auto custom-scrollbar pr-2">
                                        <div className="mb-6 px-2">
                                            <h3 className="text-xl font-bold">ตู้เซฟส่วนตัว</h3>
                                            <p className="text-muted-foreground">ไอเทมที่เก็บไว้ในตู้เซฟ</p>
                                        </div>
                                        <InventoryGrid items={filterItems(gameData.safe)} type="item" />
                                    </TabsContent>

                                    <TabsContent value="gift" className="mt-0 focus-visible:ring-0 h-full overflow-y-auto custom-scrollbar pr-2">
                                        <div className="mb-6 px-2">
                                            <h3 className="text-xl font-bold">กล่องของขวัญ</h3>
                                            <p className="text-muted-foreground">ไอเทมรางวัลที่รอรับเข้าเกม</p>
                                        </div>
                                        <GiftInventory />
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </div>
                    </div>
                ) : null}

                {/* Mobile Floating Action Button (FAB) Menu */}
                <div className="lg:hidden fixed bottom-24 right-6 z-[9999]" style={{ bottom: 'calc(6rem + env(safe-area-inset-bottom))' }}>
                    <div className="relative">
                        <AnimatePresence>
                            {isMobileMenuOpen && (
                                <div className="absolute bottom-16 right-0 flex flex-col gap-3 min-w-[140px]">
                                    {['inventory', 'weapons', 'safe', 'gift'].map((tab, idx) => {
                                        const icons = { inventory: Backpack, weapons: Swords, safe: Vault, gift: Package };
                                        const labels = { inventory: 'กระเป๋า', weapons: 'อาวุธ', safe: 'ตู้เซฟ', gift: 'ของขวัญ' };
                                        const Icon = icons[tab];
                                        return (
                                            <motion.button
                                                key={tab}
                                                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                                exit={{ opacity: 0, scale: 0.8, x: 20 }}
                                                transition={{ delay: 0.05 * (4 - idx) }}
                                                onClick={() => handleMobileTabChange(tab)}
                                                className={`flex items-center justify-end gap-3 p-2 rounded-full shadow-lg backdrop-blur-sm transition-all
                                                    ${activeTab === tab
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-white/90 dark:bg-slate-800/90 text-foreground hover:bg-white dark:hover:bg-slate-700'
                                                    }`}
                                            >
                                                <span className="text-sm font-bold pr-2">{labels[tab]}</span>
                                                <div className={`p-2 rounded-full ${activeTab === tab ? 'bg-white/20' : 'bg-muted'}`}>
                                                    <Icon className="w-4 h-4" />
                                                </div>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            )}
                        </AnimatePresence>

                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleMobileMenu}
                            className={`h-14 w-14 rounded-full shadow-xl flex items-center justify-center transition-colors duration-300 transform
                            ${isMobileMenuOpen ? 'bg-destructive text-destructive-foreground rotate-90' : 'bg-primary text-primary-foreground'}`}
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <LayoutGrid className="h-6 w-6" />
                            )}
                        </motion.button>
                    </div>

                    {/* Overlay backdrop when menu is open */}
                    {isMobileMenuOpen && (
                        <div
                            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[-1]"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                    )}
                </div>

            </main>
        </div>
    );
}

function InventoryGrid({ items, type }) {
    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground/50">
                <div className="p-6 bg-muted/30 rounded-full mb-4">
                    <Backpack className="h-10 w-10 opacity-50" />
                </div>
                <p className="text-lg font-medium">ไม่พบไอเทม</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 p-1">
            {items.map((item, index) => (
                <div
                    key={index}
                    className="group relative flex flex-col items-center p-2 md:p-4 rounded-2xl md:rounded-3xl bg-background hover:shadow-md transition-all duration-300 cursor-pointer border border-transparent hover:border-border/50"
                >
                    <div className="absolute top-2 right-2 md:top-3 md:right-3 z-10">
                        <Badge variant="secondary" className="text-[9px] md:text-[10px] h-5 md:h-6 px-1.5 md:px-2 rounded-md md:rounded-lg bg-muted font-bold">
                            {type === 'weapon' ? item.ammo : `x${item.count}`}
                        </Badge>
                    </div>

                    <div className="relative w-14 h-14 md:w-20 md:h-20 my-2 md:my-4 transition-transform duration-500 group-hover:scale-110 drop-shadow-sm">
                        <Image
                            src={`/items/${item.name}.png`}
                            alt={item.label || item.name}
                            fill
                            className="object-contain"
                            onError={(e) => {
                                e.target.src = "/items/placeholder.png"
                            }}
                        />
                    </div>

                    <div className="mt-auto text-center w-full px-0.5 md:px-1">
                        <p className="text-xs md:text-sm font-bold truncate text-foreground/90 group-hover:text-primary transition-colors" title={item.label || item.name}>
                            {item.label || item.name}
                        </p>
                        <p className="text-[8px] md:text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{type === 'weapon' ? 'WEAPON' : 'ITEM'}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
