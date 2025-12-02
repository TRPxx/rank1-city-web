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
    Stethoscope, Wrench, Car, Gavel
} from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const [gameData, setGameData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

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

            <main className="flex-1 container max-w-7xl py-8 pt-24 space-y-8 px-4">
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
                            <div className="bg-muted/30 rounded-[2.5rem] p-8 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/10 to-transparent" />

                                <div className="relative flex flex-col items-center text-center">
                                    <div className="relative mb-6">
                                        <Avatar className="h-40 w-40 border-4 border-background shadow-2xl">
                                            <AvatarImage src={`https://nui-img/${gameData.citizenid}`} alt={gameData.firstname} />
                                            <AvatarFallback className="text-5xl bg-muted">
                                                {gameData.firstname?.[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <Badge className={cn(
                                            "absolute bottom-2 right-2 px-3 py-1 text-sm shadow-lg border-2 border-background",
                                            gameData.sex === 'm' ? 'bg-blue-500' : 'bg-pink-500'
                                        )}>
                                            {gameData.sex === 'm' ? 'ชาย' : 'หญิง'}
                                        </Badge>
                                    </div>

                                    <h3 className="text-3xl font-bold mb-2 tracking-tight">{gameData.firstname} {gameData.lastname}</h3>

                                    <div className="mb-8">
                                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-background/50 backdrop-blur-sm border border-border/50 text-sm font-medium text-foreground/80">
                                            {(() => {
                                                const job = gameData.job?.toLowerCase() || '';
                                                if (job.includes('police') || job.includes('sheriff')) return <Shield className="w-4 h-4 mr-2 text-blue-500" />;
                                                if (job.includes('ambulance') || job.includes('medic') || job.includes('doctor')) return <Stethoscope className="w-4 h-4 mr-2 text-red-500" />;
                                                if (job.includes('mechanic') || job.includes('fix')) return <Wrench className="w-4 h-4 mr-2 text-orange-500" />;
                                                if (job.includes('taxi') || job.includes('driver')) return <Car className="w-4 h-4 mr-2 text-yellow-500" />;
                                                if (job.includes('judge') || job.includes('lawyer')) return <Gavel className="w-4 h-4 mr-2 text-purple-500" />;
                                                return <Briefcase className="w-4 h-4 mr-2 text-gray-500" />;
                                            })()}
                                            {gameData.job_label}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 w-full mb-8">
                                        <div className="flex flex-col items-center p-4 bg-background/60 rounded-3xl shadow-sm">
                                            <div className="p-2 bg-emerald-500/10 rounded-xl mb-2">
                                                <Wallet className="w-6 h-6 text-emerald-500" />
                                            </div>
                                            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">เงินสด</span>
                                            <span className="font-bold text-xl">${gameData.money.toLocaleString()}</span>
                                        </div>
                                        <div className="flex flex-col items-center p-4 bg-background/60 rounded-3xl shadow-sm">
                                            <div className="p-2 bg-blue-500/10 rounded-xl mb-2">
                                                <CreditCard className="w-6 h-6 text-blue-500" />
                                            </div>
                                            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">ธนาคาร</span>
                                            <span className="font-bold text-xl">${gameData.bank.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="w-full space-y-4 bg-background/40 p-6 rounded-3xl">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground flex items-center gap-3">
                                                <div className="p-1.5 bg-background rounded-lg"><Phone className="w-3.5 h-3.5" /></div>
                                                เบอร์โทรศัพท์
                                            </span>
                                            <span className="font-medium">{gameData.phone}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground flex items-center gap-3">
                                                <div className="p-1.5 bg-background rounded-lg"><Calendar className="w-3.5 h-3.5" /></div>
                                                วันเกิด
                                            </span>
                                            <span className="font-medium">{gameData.dob}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground flex items-center gap-3">
                                                <div className="p-1.5 bg-background rounded-lg"><MapPin className="w-3.5 h-3.5" /></div>
                                                Citizen ID
                                            </span>
                                            <span className="font-mono font-medium bg-background px-2 py-0.5 rounded-md text-xs">{gameData.citizenid}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content / Inventory */}
                        <div className="lg:col-span-8">
                            <Tabs defaultValue="inventory" className="w-full">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                                    <TabsList className="bg-muted/50 p-1 rounded-full h-auto">
                                        <TabsTrigger value="inventory" className="rounded-full px-6 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                            <Backpack className="w-4 h-4 mr-2" /> กระเป๋า
                                        </TabsTrigger>
                                        <TabsTrigger value="weapons" className="rounded-full px-6 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                            <Swords className="w-4 h-4 mr-2" /> อาวุธ
                                        </TabsTrigger>
                                        <TabsTrigger value="safe" className="rounded-full px-6 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                            <Vault className="w-4 h-4 mr-2" /> ตู้เซฟ
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

                                <div className="bg-muted/20 rounded-[2.5rem] p-6 min-h-[500px]">
                                    <TabsContent value="inventory" className="mt-0 focus-visible:ring-0">
                                        <div className="mb-6 px-2">
                                            <h3 className="text-xl font-bold">รายการไอเทม</h3>
                                            <p className="text-muted-foreground">ไอเทมทั้งหมดในกระเป๋าของคุณ</p>
                                        </div>
                                        <InventoryGrid items={filterItems(gameData.inventory)} type="item" />
                                    </TabsContent>

                                    <TabsContent value="weapons" className="mt-0 focus-visible:ring-0">
                                        <div className="mb-6 px-2">
                                            <h3 className="text-xl font-bold">อาวุธยุทโธปกรณ์</h3>
                                            <p className="text-muted-foreground">อาวุธที่พกพาอยู่</p>
                                        </div>
                                        <InventoryGrid items={filterItems(gameData.loadout)} type="weapon" />
                                    </TabsContent>

                                    <TabsContent value="safe" className="mt-0 focus-visible:ring-0">
                                        <div className="mb-6 px-2">
                                            <h3 className="text-xl font-bold">ตู้เซฟส่วนตัว</h3>
                                            <p className="text-muted-foreground">ไอเทมที่เก็บไว้ในตู้เซฟ</p>
                                        </div>
                                        <InventoryGrid items={filterItems(gameData.safe)} type="item" />
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </div>
                    </div>
                ) : null}
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {items.map((item, index) => (
                <div
                    key={index}
                    className="group relative flex flex-col items-center p-4 rounded-3xl bg-background hover:shadow-md transition-all duration-300 cursor-pointer border border-transparent hover:border-border/50"
                >
                    <div className="absolute top-3 right-3 z-10">
                        <Badge variant="secondary" className="text-[10px] h-6 px-2 rounded-lg bg-muted font-bold">
                            {type === 'weapon' ? item.ammo : `x${item.count}`}
                        </Badge>
                    </div>

                    <div className="relative w-20 h-20 my-4 transition-transform duration-500 group-hover:scale-110 drop-shadow-sm">
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

                    <div className="mt-auto text-center w-full px-1">
                        <p className="text-sm font-bold truncate text-foreground/90 group-hover:text-primary transition-colors" title={item.label || item.name}>
                            {item.label || item.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{type === 'weapon' ? 'WEAPON' : 'ITEM'}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
