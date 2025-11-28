'use client';

import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Wallet, CreditCard, Phone, Calendar, LogOut, Search, Backpack, Swords, Briefcase, Shield, Vault, Menu } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const [gameData, setGameData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("inventory");
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

    const filteredInventory = gameData?.inventory
        ? (Array.isArray(gameData.inventory) ? gameData.inventory : Object.entries(gameData.inventory).map(([name, count]) => ({ name, count })))
            .filter(item => item.count > 0 && (item.label || item.name).toLowerCase().includes(searchTerm.toLowerCase()))
        : [];

    const filteredWeapons = gameData?.loadout
        ? (Array.isArray(gameData.loadout) ? gameData.loadout : Object.entries(gameData.loadout).map(([name, weapon]) => ({ name, ...weapon })))
            .filter(weapon => (weapon.label || weapon.name).toLowerCase().includes(searchTerm.toLowerCase()))
        : [];

    const filteredSafe = gameData?.safe
        ? (Array.isArray(gameData.safe) ? gameData.safe : Object.entries(gameData.safe).map(([name, count]) => ({ name, count })))
            .filter(item => item.count > 0 && (item.label || item.name).toLowerCase().includes(searchTerm.toLowerCase()))
        : [];

    if (status === "loading") return <div className="min-h-screen flex items-center justify-center bg-background text-foreground">Loading...</div>;

    if (!session) {
        return (
            <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/30">
                <Navbar />
                <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
                    <div className="absolute inset-0">
                        <Image
                            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop"
                            alt="Login Background"
                            fill
                            className="object-cover opacity-10 dark:opacity-20 blur-sm"
                            priority
                            quality={75}
                        />
                    </div>
                    <div className="relative z-10 w-full max-w-md p-6 md:p-8 bg-card/80 backdrop-blur-xl border border-border rounded-xl shadow-2xl text-center space-y-6">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto ring-4 ring-primary/10">
                            <User className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Welcome Citizen</h1>
                        <p className="text-muted-foreground text-sm md:text-base">กรุณาเข้าสู่ระบบเพื่อยืนยันตัวตนและเข้าถึงข้อมูล</p>
                        <Button onClick={() => signIn('discord')} className="w-full h-10 md:h-12 text-base md:text-lg bg-[#5865F2] hover:bg-[#4752C4] text-white transition-all hover:scale-105 shadow-lg shadow-[#5865F2]/20 rounded-lg">
                            Login with Discord
                        </Button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/30 font-sans transition-colors duration-300">
            <Navbar />

            <main className="flex-1 container px-4 md:px-6 pt-24 pb-8 md:py-20 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute top-0 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-primary/20 rounded-full blur-[80px] md:blur-[128px] pointer-events-none opacity-50 dark:opacity-100" />
                <div className="absolute bottom-0 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-purple-500/10 rounded-full blur-[80px] md:blur-[128px] pointer-events-none opacity-50 dark:opacity-100" />

                <div className="max-w-7xl mx-auto relative z-10">

                    {/* Header: User Welcome */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6 mb-8 md:mb-12">
                        <div className="w-full md:w-auto overflow-hidden">
                            <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground truncate py-1">
                                Dashboard
                            </h1>
                            <p className="text-muted-foreground mt-1 md:mt-2 flex items-center gap-2 text-sm md:text-base">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e] flex-shrink-0" />
                                <span className="truncate">Online as {session.user.name}</span>
                            </p>
                        </div>
                        <Button variant="outline" className="w-full md:w-auto border-border bg-card/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-all rounded-lg flex-shrink-0 mt-2 md:mt-0" onClick={() => signOut()}>
                            <LogOut className="w-4 h-4 mr-2" /> Disconnect
                        </Button>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 animate-pulse">
                            <div className="lg:col-span-4 h-[400px] md:h-[500px] bg-muted rounded-xl" />
                            <div className="lg:col-span-8 h-[400px] md:h-[500px] bg-muted rounded-xl" />
                        </div>
                    ) : error ? (
                        <div className="p-8 md:p-12 bg-destructive/5 border border-destructive/20 rounded-xl text-center">
                            <Shield className="w-12 h-12 md:w-16 md:h-16 text-destructive mx-auto mb-4 opacity-50" />
                            <h3 className="text-xl md:text-2xl font-bold text-destructive mb-2">Data Not Found</h3>
                            <p className="text-muted-foreground">{error}</p>
                        </div>
                    ) : gameData ? (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">

                            {/* Left Column: Citizen ID Card */}
                            <div className="lg:col-span-4 space-y-6">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-card/80 backdrop-blur-xl border border-border rounded-xl p-6 md:p-8 relative overflow-hidden group shadow-xl"
                                >
                                    {/* Holographic Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                    <div className="relative z-10 flex flex-col items-center text-center">
                                        <div className="relative w-24 h-24 md:w-32 md:h-32 mb-4 md:mb-6">
                                            <div className="absolute inset-0 bg-gradient-to-tr from-primary to-purple-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                                            <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-background bg-muted">
                                                <User className="w-full h-full p-4 md:p-6 text-muted-foreground" />
                                            </div>
                                            <div className="absolute bottom-0 right-0 bg-background rounded-full p-1 md:p-1.5 border border-border">
                                                <div className="w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded-full border-2 border-background" />
                                            </div>
                                        </div>

                                        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-1">{gameData.firstname}</h2>
                                        <h3 className="text-lg md:text-xl font-medium text-primary mb-4">{gameData.lastname}</h3>

                                        <div className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-muted/50 rounded-lg border border-border mb-6 md:mb-8">
                                            <Briefcase className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground" />
                                            <span className="text-xs md:text-sm text-foreground">{gameData.job} — {gameData.job_grade}</span>
                                        </div>

                                        <div className="w-full space-y-3 md:space-y-4 text-left">
                                            <div className="flex items-center justify-between p-3 md:p-4 bg-muted/30 rounded-lg border border-border">
                                                <div className="flex items-center gap-2 md:gap-3 text-muted-foreground">
                                                    <Phone className="w-3 h-3 md:w-4 md:h-4" />
                                                    <span className="text-xs md:text-sm">Phone</span>
                                                </div>
                                                <span className="text-sm md:text-base font-medium text-foreground">{gameData.phone}</span>
                                            </div>
                                            <div className="flex items-center justify-between p-3 md:p-4 bg-muted/30 rounded-lg border border-border">
                                                <div className="flex items-center gap-2 md:gap-3 text-muted-foreground">
                                                    <User className="w-3 h-3 md:w-4 md:h-4" />
                                                    <span className="text-xs md:text-sm">Gender</span>
                                                </div>
                                                <span className="text-sm md:text-base font-medium text-foreground">{gameData.sex}</span>
                                            </div>
                                            <div className="flex items-center justify-between p-3 md:p-4 bg-muted/30 rounded-lg border border-border">
                                                <div className="flex items-center gap-2 md:gap-3 text-muted-foreground">
                                                    <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                                                    <span className="text-xs md:text-sm">Birth</span>
                                                </div>
                                                <span className="text-sm md:text-base font-medium text-foreground">{gameData.dob}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Right Column: Stats & Inventory */}
                            <div className="lg:col-span-8 space-y-6">

                                {/* Financial Stats */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 dark:from-emerald-900/50 dark:to-emerald-950/50 border border-emerald-500/20 rounded-xl p-5 md:p-6 relative overflow-hidden shadow-sm"
                                    >
                                        <div className="absolute top-0 right-0 p-4 md:p-6 opacity-10">
                                            <Wallet className="w-16 h-16 md:w-24 md:h-24 text-emerald-500" />
                                        </div>
                                        <div className="relative z-10">
                                            <p className="text-emerald-600 dark:text-emerald-400 font-medium mb-1 flex items-center gap-2 text-sm md:text-base">
                                                <Wallet className="w-4 h-4" /> Cash Balance
                                            </p>
                                            <h3 className="text-2xl md:text-4xl font-bold text-foreground tracking-tight">
                                                ${gameData.money.toLocaleString()}
                                            </h3>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 dark:from-blue-900/50 dark:to-blue-950/50 border border-blue-500/20 rounded-xl p-5 md:p-6 relative overflow-hidden shadow-sm"
                                    >
                                        <div className="absolute top-0 right-0 p-4 md:p-6 opacity-10">
                                            <CreditCard className="w-16 h-16 md:w-24 md:h-24 text-blue-500" />
                                        </div>
                                        <div className="relative z-10">
                                            <p className="text-blue-600 dark:text-blue-400 font-medium mb-1 flex items-center gap-2 text-sm md:text-base">
                                                <CreditCard className="w-4 h-4" /> Bank Account
                                            </p>
                                            <h3 className="text-2xl md:text-4xl font-bold text-foreground tracking-tight">
                                                ${gameData.bank.toLocaleString()}
                                            </h3>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Inventory System */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-card/50 backdrop-blur-xl border border-border rounded-xl p-4 md:p-8 min-h-[400px] md:min-h-[500px] flex flex-col shadow-sm"
                                >
                                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6 mb-6 md:mb-8">
                                        <div className="w-full md:w-auto flex items-center gap-2 bg-muted/50 p-1.5 rounded-lg border border-border overflow-x-auto no-scrollbar">
                                            <button
                                                onClick={() => setActiveTab("inventory")}
                                                className={`flex-1 md:flex-none px-4 md:px-6 py-2 md:py-2.5 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === "inventory" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground"}`}
                                            >
                                                <Backpack className="w-4 h-4" /> <span className="hidden sm:inline">Inventory</span>
                                            </button>
                                            <button
                                                onClick={() => setActiveTab("weapons")}
                                                className={`flex-1 md:flex-none px-4 md:px-6 py-2 md:py-2.5 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === "weapons" ? "bg-red-500 text-white shadow-lg shadow-red-500/20" : "text-muted-foreground hover:text-foreground"}`}
                                            >
                                                <Swords className="w-4 h-4" /> <span className="hidden sm:inline">Loadout</span>
                                            </button>
                                            <button
                                                onClick={() => setActiveTab("safe")}
                                                className={`flex-1 md:flex-none px-4 md:px-6 py-2 md:py-2.5 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === "safe" ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" : "text-muted-foreground hover:text-foreground"}`}
                                            >
                                                <Vault className="w-4 h-4" /> <span className="hidden sm:inline">Safe</span>
                                            </button>
                                        </div>

                                        <div className="relative w-full md:w-64">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Search..."
                                                className="pl-10 h-10 md:h-11 bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-primary/50 rounded-lg"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto pr-1 md:pr-2 custom-scrollbar">
                                        <AnimatePresence mode="wait">
                                            {activeTab === "inventory" ? (
                                                <motion.div
                                                    key="inventory"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4"
                                                >
                                                    {filteredInventory.length > 0 ? filteredInventory.map((item, index) => (
                                                        <div key={index} className="group relative bg-card border border-border rounded-lg p-3 md:p-4 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)] transition-all duration-300 flex flex-col items-center gap-2 md:gap-3 cursor-pointer">
                                                            <div className="absolute top-2 right-2 text-[10px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">
                                                                x{item.count}
                                                            </div>
                                                            <div className="relative w-12 h-12 md:w-16 md:h-16 my-2 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                                                                <Image
                                                                    src={`https://raw.githubusercontent.com/overextended/ox_inventory/web/web/images/${item.name}.png`}
                                                                    alt={item.label || item.name}
                                                                    fill
                                                                    className="object-contain drop-shadow-2xl"
                                                                    onError={(e) => {
                                                                        e.target.srcset = "https://placehold.co/80x80?text=ITEM"
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="text-center w-full mt-auto">
                                                                <div className="font-medium text-xs md:text-sm text-foreground truncate group-hover:text-primary transition-colors" title={item.label || item.name}>
                                                                    {item.label || item.name}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )) : (
                                                        <div className="col-span-full flex flex-col items-center justify-center py-12 md:py-20 text-muted-foreground">
                                                            <Backpack className="w-12 h-12 md:w-16 md:h-16 mb-4 opacity-20" />
                                                            <p>No items found</p>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            ) : activeTab === "weapons" ? (
                                                <motion.div
                                                    key="weapons"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4"
                                                >
                                                    {filteredWeapons.length > 0 ? filteredWeapons.map((weapon, index) => (
                                                        <div key={index} className="group relative bg-card border border-border rounded-lg p-3 md:p-4 hover:border-red-500/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.1)] transition-all duration-300 flex flex-col items-center gap-2 md:gap-3 cursor-pointer">
                                                            <div className="absolute top-2 right-2 text-[10px] font-bold text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">
                                                                {weapon.ammo}
                                                            </div>
                                                            <div className="relative w-20 h-12 md:w-24 md:h-16 my-2 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                                                                <Image
                                                                    src={`https://raw.githubusercontent.com/overextended/ox_inventory/web/web/images/${weapon.name}.png`}
                                                                    alt={weapon.label || weapon.name}
                                                                    fill
                                                                    className="object-contain drop-shadow-2xl"
                                                                    onError={(e) => {
                                                                        e.target.srcset = "https://placehold.co/100x80?text=WEAPON"
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="text-center w-full mt-auto">
                                                                <div className="font-medium text-xs md:text-sm text-foreground truncate group-hover:text-red-500 transition-colors" title={weapon.label || weapon.name}>
                                                                    {weapon.label || weapon.name}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )) : (
                                                        <div className="col-span-full flex flex-col items-center justify-center py-12 md:py-20 text-muted-foreground">
                                                            <Swords className="w-12 h-12 md:w-16 md:h-16 mb-4 opacity-20" />
                                                            <p>No weapons found</p>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="safe"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4"
                                                >
                                                    {filteredSafe.length > 0 ? filteredSafe.map((item, index) => (
                                                        <div key={index} className="group relative bg-card border border-border rounded-lg p-3 md:p-4 hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)] transition-all duration-300 flex flex-col items-center gap-2 md:gap-3 cursor-pointer">
                                                            <div className="absolute top-2 right-2 text-[10px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">
                                                                x{item.count}
                                                            </div>
                                                            <div className="relative w-12 h-12 md:w-16 md:h-16 my-2 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                                                                <Image
                                                                    src={`https://raw.githubusercontent.com/overextended/ox_inventory/web/web/images/${item.name}.png`}
                                                                    alt={item.label || item.name}
                                                                    fill
                                                                    className="object-contain drop-shadow-2xl"
                                                                    onError={(e) => {
                                                                        e.target.srcset = "https://placehold.co/80x80?text=ITEM"
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="text-center w-full mt-auto">
                                                                <div className="font-medium text-xs md:text-sm text-foreground truncate group-hover:text-amber-500 transition-colors" title={item.label || item.name}>
                                                                    {item.label || item.name}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )) : (
                                                        <div className="col-span-full flex flex-col items-center justify-center py-12 md:py-20 text-muted-foreground">
                                                            <Vault className="w-12 h-12 md:w-16 md:h-16 mb-4 opacity-20" />
                                                            <p>Safe is empty or not connected</p>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </main>

            <Footer />
        </div>
    );
}
