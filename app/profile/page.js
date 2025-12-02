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
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!session) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Navbar />
                <div className="flex-1 flex items-center justify-center p-4">
                    <Card className="w-full max-w-md">
                        <CardHeader className="text-center">
                            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <User className="w-6 h-6 text-primary" />
                            </div>
                            <CardTitle>เข้าสู่ระบบ</CardTitle>
                            <CardDescription>กรุณาเข้าสู่ระบบด้วย Discord เพื่อดูข้อมูลตัวละคร</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button onClick={() => signIn('discord')} className="w-full" size="lg">
                                เข้าสู่ระบบด้วย Discord
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <main className="flex-1 container py-8 pt-24 space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-bold tracking-tight">โปรไฟล์</h2>
                        <p className="text-muted-foreground">
                            จัดการข้อมูลตัวละครและทรัพย์สินของคุณ
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={() => signOut({ callbackUrl: '/' })}>
                            <LogOut className="mr-2 h-4 w-4" /> ออกจากระบบ
                        </Button>
                    </div>
                </div>

                <Separator />

                {loading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Skeleton Sidebar */}
                        <div className="lg:col-span-4 space-y-6">
                            <Card>
                                <CardHeader className="pb-0">
                                    <Skeleton className="h-6 w-16 absolute top-4 right-4 rounded-full" />
                                </CardHeader>
                                <CardContent className="flex flex-col items-center pt-6">
                                    <Skeleton className="h-32 w-32 rounded-full mb-4" />
                                    <Skeleton className="h-8 w-48 mb-2" />
                                    <Skeleton className="h-4 w-32 mb-8" />

                                    <div className="grid grid-cols-2 gap-4 w-full">
                                        <Skeleton className="h-20 w-full rounded-lg" />
                                        <Skeleton className="h-20 w-full rounded-lg" />
                                    </div>

                                    <div className="w-full space-y-4 mt-8">
                                        <Skeleton className="h-8 w-full" />
                                        <Skeleton className="h-8 w-full" />
                                        <Skeleton className="h-8 w-full" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Skeleton Content */}
                        <div className="lg:col-span-8">
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <div className="flex gap-2">
                                        <Skeleton className="h-10 w-24" />
                                        <Skeleton className="h-10 w-24" />
                                        <Skeleton className="h-10 w-24" />
                                    </div>
                                    <Skeleton className="h-10 w-64 hidden sm:block" />
                                </div>
                                <Card>
                                    <CardHeader>
                                        <Skeleton className="h-6 w-32 mb-2" />
                                        <Skeleton className="h-4 w-48" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                            {[...Array(10)].map((_, i) => (
                                                <Skeleton key={i} className="h-32 w-full rounded-lg" />
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                ) : error ? (
                    <Card className="border-destructive/50 bg-destructive/5">
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <Shield className="h-12 w-12 text-destructive mb-4 opacity-50" />
                            <h3 className="text-lg font-semibold text-destructive">ไม่พบข้อมูล</h3>
                            <p className="text-muted-foreground">{error}</p>
                        </CardContent>
                    </Card>
                ) : gameData ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Sidebar / Profile Card */}
                        <div className="lg:col-span-4 space-y-6">
                            <Card>
                                <CardHeader className="relative pb-0">
                                    <div className="absolute top-4 right-4">
                                        <Badge variant={gameData.sex === 'm' ? 'default' : 'secondary'}>
                                            {gameData.sex === 'm' ? 'ชาย' : 'หญิง'}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center text-center pt-6">
                                    <Avatar className="h-32 w-32 border-4 border-background shadow-xl mb-4">
                                        <AvatarImage src={`https://nui-img/${gameData.citizenid}`} alt={gameData.firstname} />
                                        <AvatarFallback className="text-4xl bg-muted">
                                            {gameData.firstname?.[0]}
                                        </AvatarFallback>
                                    </Avatar>

                                    <h3 className="text-2xl font-bold">{gameData.firstname} {gameData.lastname}</h3>
                                    <div className="mt-2">
                                        <Badge variant="secondary" className="px-3 py-1 text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 transition-colors">
                                            {(() => {
                                                const job = gameData.job?.toLowerCase() || '';
                                                if (job.includes('police') || job.includes('sheriff')) return <Shield className="w-4 h-4 mr-2" />;
                                                if (job.includes('ambulance') || job.includes('medic') || job.includes('doctor')) return <Stethoscope className="w-4 h-4 mr-2" />;
                                                if (job.includes('mechanic') || job.includes('fix')) return <Wrench className="w-4 h-4 mr-2" />;
                                                if (job.includes('taxi') || job.includes('driver')) return <Car className="w-4 h-4 mr-2" />;
                                                if (job.includes('judge') || job.includes('lawyer')) return <Gavel className="w-4 h-4 mr-2" />;
                                                return <Briefcase className="w-4 h-4 mr-2" />;
                                            })()}
                                            {gameData.job_label}
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 w-full mt-8">
                                        <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                                            <Wallet className="w-5 h-5 text-emerald-500 mb-1" />
                                            <span className="text-xs text-muted-foreground">เงินสด</span>
                                            <span className="font-bold text-lg">${gameData.money.toLocaleString()}</span>
                                        </div>
                                        <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                                            <CreditCard className="w-5 h-5 text-blue-500 mb-1" />
                                            <span className="text-xs text-muted-foreground">ธนาคาร</span>
                                            <span className="font-bold text-lg">${gameData.bank.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="w-full space-y-3 mt-6 text-left">
                                        <div className="flex justify-between py-2 border-b text-sm">
                                            <span className="text-muted-foreground flex items-center gap-2">
                                                <Phone className="w-4 h-4" /> เบอร์โทรศัพท์
                                            </span>
                                            <span className="font-medium">{gameData.phone}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b text-sm">
                                            <span className="text-muted-foreground flex items-center gap-2">
                                                <Calendar className="w-4 h-4" /> วันเกิด
                                            </span>
                                            <span className="font-medium">{gameData.dob}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b text-sm">
                                            <span className="text-muted-foreground flex items-center gap-2">
                                                <MapPin className="w-4 h-4" /> Citizen ID
                                            </span>
                                            <span className="font-mono font-medium">{gameData.citizenid}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Main Content / Inventory */}
                        <div className="lg:col-span-8">
                            <Tabs defaultValue="inventory" className="w-full">
                                <div className="flex items-center justify-between mb-4">
                                    <TabsList>
                                        <TabsTrigger value="inventory" className="gap-2">
                                            <Backpack className="w-4 h-4" /> กระเป๋า
                                        </TabsTrigger>
                                        <TabsTrigger value="weapons" className="gap-2">
                                            <Swords className="w-4 h-4" /> อาวุธ
                                        </TabsTrigger>
                                        <TabsTrigger value="safe" className="gap-2">
                                            <Vault className="w-4 h-4" /> ตู้เซฟ
                                        </TabsTrigger>
                                    </TabsList>

                                    <div className="relative w-full max-w-xs hidden sm:block">
                                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="ค้นหาไอเทม..."
                                            className="pl-8"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <TabsContent value="inventory" className="mt-0">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>รายการไอเทม</CardTitle>
                                            <CardDescription>ไอเทมทั้งหมดในกระเป๋าของคุณ</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <InventoryGrid items={filterItems(gameData.inventory)} type="item" />
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="weapons" className="mt-0">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>อาวุธยุทโธปกรณ์</CardTitle>
                                            <CardDescription>อาวุธที่พกพาอยู่</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <InventoryGrid items={filterItems(gameData.loadout)} type="weapon" />
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="safe" className="mt-0">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>ตู้เซฟส่วนตัว</CardTitle>
                                            <CardDescription>ไอเทมที่เก็บไว้ในตู้เซฟ</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <InventoryGrid items={filterItems(gameData.safe)} type="item" />
                                        </CardContent>
                                    </Card>
                                </TabsContent>
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
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Backpack className="h-12 w-12 mb-4 opacity-20" />
                <p>ไม่พบไอเทม</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {items.map((item, index) => (
                <div
                    key={index}
                    className="group relative flex flex-col items-center p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                >
                    <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                            {type === 'weapon' ? item.ammo : `x${item.count}`}
                        </Badge>
                    </div>

                    <div className="relative w-16 h-16 my-2 transition-transform group-hover:scale-110">
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

                    <div className="mt-2 text-center w-full">
                        <p className="text-sm font-medium truncate" title={item.label || item.name}>
                            {item.label || item.name}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
