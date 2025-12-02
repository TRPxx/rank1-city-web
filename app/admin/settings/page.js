'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Loader2, Save, AlertCircle, CheckCircle, Plus, Trash2, Users, Shield, Zap, Car, Briefcase, Home, Star, Heart, Trophy, Target, Flag, MapPin, Gift, Activity, Settings, MessageCircle, PlayCircle, Gamepad2, Info, HelpCircle, Search, Newspaper, Ticket } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { cn } from "@/lib/utils";
import { categories as newsCategories } from '@/lib/news-data';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import RoadmapEditor from '@/components/admin/RoadmapEditor';
import RewardsEditor from '@/components/admin/RewardsEditor';
import LuckyDrawEditor from '@/components/admin/LuckyDrawEditor';

const iconList = [
    { name: 'Users', icon: Users },
    { name: 'Shield', icon: Shield },
    { name: 'Zap', icon: Zap },
    { name: 'Car', icon: Car },
    { name: 'Briefcase', icon: Briefcase },
    { name: 'Home', icon: Home },
    { name: 'Star', icon: Star },
    { name: 'Heart', icon: Heart },
    { name: 'Trophy', icon: Trophy },
    { name: 'Target', icon: Target },
    { name: 'Flag', icon: Flag },
    { name: 'MapPin', icon: MapPin },
    { name: 'Gift', icon: Gift },
    { name: 'Activity', icon: Activity },
    { name: 'Settings', icon: Settings },
    { name: 'MessageCircle', icon: MessageCircle },
    { name: 'PlayCircle', icon: PlayCircle },
    { name: 'Gamepad2', icon: Gamepad2 },
    { name: 'Info', icon: Info },
    { name: 'HelpCircle', icon: HelpCircle },
    { name: 'Search', icon: Search },
];

export default function AdminSettingsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Config States
    const [siteConfig, setSiteConfig] = useState(null);
    const [preregisterConfig, setPreregisterConfig] = useState(null);
    const [featuresConfig, setFeaturesConfig] = useState([]);
    const [newsConfig, setNewsConfig] = useState([]);

    // Features Editor State
    const [selectedFeatureIndex, setSelectedFeatureIndex] = useState(0);
    const [showIconPicker, setShowIconPicker] = useState(false);

    // News Editor State
    const [selectedNewsIndex, setSelectedNewsIndex] = useState(0);

    const fetchSettings = async () => {
        try {
            const [siteRes, preRes] = await Promise.all([
                fetch('/api/admin/settings?type=site'),
                fetch('/api/admin/settings?type=preregister')
            ]);

            if (siteRes.ok) setSiteConfig(await siteRes.json());
            if (preRes.ok) setPreregisterConfig(await preRes.json());
        } catch (error) {
            toast.error("Failed to load settings");
        }
    };

    const fetchFeatures = async () => {
        try {
            const res = await fetch('/api/features');
            if (res.ok) {
                setFeaturesConfig(await res.json());
            }
        } catch (error) {
            toast.error("Failed to load features");
        }
    };

    const fetchNews = async () => {
        try {
            const res = await fetch('/api/news');
            if (res.ok) {
                setNewsConfig(await res.json());
            }
        } catch (error) {
            toast.error("Failed to load news");
        }
    };

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/');
        } else if (status === 'authenticated') {
            if (!session?.user?.isAdmin) {
                router.push('/');
            } else {
                fetchSettings();
                fetchFeatures();
                fetchNews();
                setIsLoading(false);
            }
        }
    }, [status, session, router]);

    const handleSave = async (type, data) => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, data })
            });

            if (!res.ok) throw new Error('Failed to save');

            // Update local state if needed
            if (type === 'site') setSiteConfig(data);
            if (type === 'preregister') setPreregisterConfig(data);

            toast.success("Settings saved successfully");
        } catch (error) {
            toast.error("Failed to save settings");
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveLuckyDraw = async (newLuckyDrawConfig) => {
        setIsSaving(true);
        try {
            // Merge with existing preregister config
            const updatedConfig = {
                ...preregisterConfig,
                luckyDraw: newLuckyDrawConfig
            };

            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'preregister',
                    data: updatedConfig
                })
            });

            if (!res.ok) throw new Error('Failed to save');

            setPreregisterConfig(updatedConfig);
            toast.success("Lucky Draw settings saved successfully");
        } catch (error) {
            toast.error("Failed to save Lucky Draw settings");
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveFeatures = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/features', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(featuresConfig)
            });

            if (!res.ok) throw new Error('Failed to save');
            toast.success("Features saved successfully");
        } catch (error) {
            toast.error("Failed to save features");
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveNews = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/news', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newsConfig)
            });

            if (!res.ok) throw new Error('Failed to save');
            toast.success("News saved successfully");
        } catch (error) {
            toast.error("Failed to save news");
        } finally {
            setIsSaving(false);
        }
    };

    // Feature Editor Handlers
    const addFeature = () => {
        const newFeature = {
            id: `feature-${Date.now()}`,
            icon: 'Star',
            title: 'ฟีเจอร์ใหม่',
            description: 'คำอธิบาย...',
            image: 'https://placehold.co/800x600',
            stats: [{ label: 'สถิติ 1', value: '100' }]
        };
        setFeaturesConfig([...featuresConfig, newFeature]);
        setSelectedFeatureIndex(featuresConfig.length); // Select the new feature
    };

    const removeFeature = (index) => {
        const newFeatures = featuresConfig.filter((_, i) => i !== index);
        setFeaturesConfig(newFeatures);
        if (selectedFeatureIndex >= newFeatures.length) {
            setSelectedFeatureIndex(Math.max(0, newFeatures.length - 1));
        }
    };

    const updateFeature = (index, field, value) => {
        const newFeatures = [...featuresConfig];
        newFeatures[index] = { ...newFeatures[index], [field]: value };
        setFeaturesConfig(newFeatures);
    };

    const updateFeatureStat = (featureIndex, statIndex, field, value) => {
        const newFeatures = [...featuresConfig];
        const newStats = [...newFeatures[featureIndex].stats];
        newStats[statIndex] = { ...newStats[statIndex], [field]: value };
        newFeatures[featureIndex].stats = newStats;
        setFeaturesConfig(newFeatures);
    };

    // News Editor Handlers
    const addNews = () => {
        const newNewsItem = {
            id: `${Date.now()}`,
            title: 'ประกาศใหม่',
            category: 'news',
            date: new Date().toLocaleDateString('en-GB'), // DD/MM/YYYY format
            excerpt: 'คำอธิบายสั้นๆ...',
            image: 'https://placehold.co/600x400/3b82f6/ffffff?text=News',
            content: '<p>เนื้อหาข่าว...</p>'
        };
        setNewsConfig([newNewsItem, ...newsConfig]); // Add to top
        setSelectedNewsIndex(0);
    };

    const removeNews = (index) => {
        const newNews = newsConfig.filter((_, i) => i !== index);
        setNewsConfig(newNews);
        if (selectedNewsIndex >= newNews.length) {
            setSelectedNewsIndex(Math.max(0, newNews.length - 1));
        }
    };

    const updateNews = (index, field, value) => {
        const newNews = [...newsConfig];
        newNews[index] = { ...newNews[index], [field]: value };
        setNewsConfig(newNews);
    };

    if (status === 'loading' || isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!session?.user?.isAdmin) return null;

    const selectedFeature = featuresConfig[selectedFeatureIndex];
    const SelectedIcon = iconList.find(i => i.name === selectedFeature?.icon)?.icon || Star;

    const selectedNews = newsConfig[selectedNewsIndex];

    return (
        <div className="min-h-screen bg-background pb-20 font-sans">
            <Navbar />
            <div className="container max-w-7xl pt-20 px-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-1">ตั้งค่าระบบ</h1>
                        <p className="text-base text-muted-foreground">จัดการการตั้งค่าเว็บไซต์ทั้งหมด</p>
                    </div>
                    <Button disabled={isSaving} onClick={() => window.location.reload()} variant="outline" size="sm" className="rounded-full px-4 border-muted-foreground/20 hover:bg-muted">
                        รีเฟรชข้อมูล
                    </Button>
                </div>

                <Tabs defaultValue="general" className="flex flex-col md:flex-row gap-8">
                    <aside className="w-full md:w-64 shrink-0">
                        <TabsList className="flex flex-col h-auto w-full bg-transparent p-0 gap-2">
                            <TabsTrigger
                                value="general"
                                className="w-full justify-start px-4 py-3 rounded-xl data-[state=active]:bg-muted data-[state=active]:text-foreground hover:bg-muted/50 transition-all text-muted-foreground"
                            >
                                <Settings className="mr-2 h-4 w-4" />
                                ทั่วไป
                            </TabsTrigger>
                            <TabsTrigger
                                value="game"
                                className="w-full justify-start px-4 py-3 rounded-xl data-[state=active]:bg-muted data-[state=active]:text-foreground hover:bg-muted/50 transition-all text-muted-foreground"
                            >
                                <Gamepad2 className="mr-2 h-4 w-4" />
                                เกมและกิจกรรม
                            </TabsTrigger>
                            <TabsTrigger
                                value="features"
                                className="w-full justify-start px-4 py-3 rounded-xl data-[state=active]:bg-muted data-[state=active]:text-foreground hover:bg-muted/50 transition-all text-muted-foreground"
                            >
                                <Star className="mr-2 h-4 w-4" />
                                ฟีเจอร์
                            </TabsTrigger>
                            <TabsTrigger
                                value="luckydraw"
                                className="w-full justify-start px-4 py-3 rounded-xl data-[state=active]:bg-muted data-[state=active]:text-foreground hover:bg-muted/50 transition-all text-muted-foreground"
                            >
                                <Ticket className="mr-2 h-4 w-4" />
                                Lucky Draw
                            </TabsTrigger>
                            <TabsTrigger
                                value="news"
                                className="w-full justify-start px-4 py-3 rounded-xl data-[state=active]:bg-muted data-[state=active]:text-foreground hover:bg-muted/50 transition-all text-muted-foreground"
                            >
                                <Newspaper className="mr-2 h-4 w-4" />
                                ข่าวสาร
                            </TabsTrigger>
                            <TabsTrigger
                                value="roadmap"
                                className="w-full justify-start px-4 py-3 rounded-xl data-[state=active]:bg-muted data-[state=active]:text-foreground hover:bg-muted/50 transition-all text-muted-foreground"
                            >
                                <MapPin className="mr-2 h-4 w-4" />
                                แผนงาน
                            </TabsTrigger>
                        </TabsList>
                    </aside>

                    <div className="flex-1 min-w-0">

                        {/* General Settings */}
                        <TabsContent value="general" className="mt-0">
                            <div className="bg-card rounded-[2rem] border border-border/50 shadow-sm overflow-hidden p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-xl font-bold mb-1">ข้อมูลทั่วไป</h3>
                                        <p className="text-sm text-muted-foreground">ข้อมูลพื้นฐานของเว็บไซต์และการตั้งค่า SEO</p>
                                    </div>
                                    <Button onClick={() => handleSave('site', siteConfig)} disabled={isSaving} size="sm" className="rounded-full px-4">
                                        {isSaving ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <Save className="mr-2 h-3 w-3" />}
                                        บันทึกการเปลี่ยนแปลง
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Left Column: Site Info */}
                                    <div className="space-y-4">
                                        <div className="grid gap-2">
                                            <Label className="text-sm">ชื่อเว็บไซต์</Label>
                                            <Input
                                                value={siteConfig?.name || ''}
                                                onChange={(e) => setSiteConfig({ ...siteConfig, name: e.target.value })}
                                                className="h-10 rounded-lg bg-muted/30 border-transparent focus:bg-background text-sm"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label className="text-sm">คำอธิบาย</Label>
                                            <Textarea
                                                value={siteConfig?.description || ''}
                                                onChange={(e) => setSiteConfig({ ...siteConfig, description: e.target.value })}
                                                className="min-h-[120px] rounded-lg bg-muted/30 border-transparent focus:bg-background resize-none text-sm"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label className="text-sm">ลิงก์ Discord</Label>
                                            <Input
                                                value={siteConfig?.links?.discord || ''}
                                                onChange={(e) => setSiteConfig({ ...siteConfig, links: { ...siteConfig.links, discord: e.target.value } })}
                                                className="h-10 rounded-lg bg-muted/30 border-transparent focus:bg-background text-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* Right Column: Server Status */}
                                    <div className="space-y-6">
                                        <div className="grid gap-3">
                                            <Label className="text-base">สถานะเซิร์ฟเวอร์</Label>
                                            <Select
                                                value={siteConfig?.serverStatus || 'preregister'}
                                                onValueChange={(value) => setSiteConfig({ ...siteConfig, serverStatus: value })}
                                            >
                                                <SelectTrigger className="h-12 rounded-xl bg-muted/30 border-transparent focus:bg-background">
                                                    <SelectValue placeholder="เลือกโหมด" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="preregister">ลงทะเบียนล่วงหน้า (เร็วๆ นี้)</SelectItem>
                                                    <SelectItem value="live">เปิดให้บริการ (เล่นเลย)</SelectItem>
                                                    <SelectItem value="maintenance">ปิดปรับปรุง</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <div className="bg-muted/30 p-4 rounded-xl text-sm text-muted-foreground">
                                                <p className="font-medium mb-1 text-foreground">คำอธิบายโหมด:</p>
                                                <ul className="list-disc list-inside space-y-1 ml-1">
                                                    <li><b>ลงทะเบียนล่วงหน้า</b>: แสดงหน้า Landing Page สำหรับลงทะเบียน</li>
                                                    <li><b>เปิดให้บริการ</b>: แสดงหน้าหลักพร้อมข้อมูลเซิร์ฟเวอร์</li>
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="grid gap-3">
                                            <Label className="text-base">สถานะเซิร์ฟเวอร์ (Badge)</Label>
                                            <Select
                                                value={siteConfig?.serverStatusBadge || 'online'}
                                                onValueChange={(value) => setSiteConfig({ ...siteConfig, serverStatusBadge: value })}
                                            >
                                                <SelectTrigger className="h-12 rounded-xl bg-muted/30 border-transparent focus:bg-background">
                                                    <SelectValue placeholder="เลือกสถานะ" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="online">🟢 ONLINE (เปิดให้บริการ)</SelectItem>
                                                    <SelectItem value="offline">🔴 OFFLINE (ปิดให้บริการ)</SelectItem>
                                                    <SelectItem value="maintenance">🟠 MAINTENANCE (ปิดปรับปรุง)</SelectItem>
                                                    <SelectItem value="beta">🔵 BETA (เปิดทดสอบ)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Game Settings */}
                        <TabsContent value="game" className="mt-0">
                            <div className="bg-card rounded-[2rem] border border-border/50 shadow-sm overflow-hidden h-[600px] flex flex-col">
                                <RewardsEditor
                                    config={preregisterConfig}
                                    setConfig={setPreregisterConfig}
                                    onSave={handleSave}
                                />
                            </div>
                        </TabsContent>

                        {/* Features Settings */}
                        <TabsContent value="features" className="mt-0">
                            <div className="bg-card rounded-[2rem] border border-border/50 shadow-sm overflow-hidden h-[600px] flex flex-col">
                                <div className="p-8 border-b border-border/50 flex items-center justify-between shrink-0">
                                    <div>
                                        <h3 className="text-2xl font-bold mb-1">ฟีเจอร์เด่น</h3>
                                        <p className="text-muted-foreground">จัดการฟีเจอร์ที่จะแสดงบนหน้าแรก</p>
                                    </div>
                                    <Button onClick={handleSaveFeatures} disabled={isSaving} className="rounded-full px-6">
                                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                        บันทึกฟีเจอร์ทั้งหมด
                                    </Button>
                                </div>

                                <div className="flex-1 flex overflow-hidden">
                                    {/* Left Sidebar: List of Features */}
                                    <div className="w-72 shrink-0 flex flex-col border-r border-border/50 bg-muted/10">
                                        <div className="p-4">
                                            <Button onClick={addFeature} className="w-full rounded-xl" variant="outline">
                                                <Plus className="mr-2 h-4 w-4" /> เพิ่มฟีเจอร์
                                            </Button>
                                        </div>
                                        <ScrollArea className="flex-1 px-4 pb-4">
                                            <div className="space-y-2">
                                                {featuresConfig.map((feature, index) => (
                                                    <div
                                                        key={index}
                                                        onClick={() => setSelectedFeatureIndex(index)}
                                                        className={cn(
                                                            "w-full p-3 rounded-xl text-left cursor-pointer transition-all border border-transparent",
                                                            selectedFeatureIndex === index
                                                                ? "bg-background shadow-sm border-border/50 font-medium text-primary"
                                                                : "hover:bg-muted/50 text-muted-foreground"
                                                        )}
                                                    >
                                                        <div className="truncate">{feature.title || "ฟีเจอร์ไม่มีชื่อ"}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    </div>

                                    {/* Right Content: Editor */}
                                    <div className="flex-1 overflow-y-auto p-8">
                                        {selectedFeature ? (
                                            <div className="space-y-8 max-w-3xl mx-auto">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-lg font-bold flex items-center gap-2">
                                                        <div className="p-2 bg-primary/10 rounded-lg">
                                                            <SelectedIcon className="h-5 w-5 text-primary" />
                                                        </div>
                                                        แก้ไขฟีเจอร์
                                                    </h3>
                                                    <Button variant="destructive" size="sm" onClick={() => removeFeature(selectedFeatureIndex)} className="rounded-full px-4">
                                                        <Trash2 className="mr-2 h-4 w-4" /> ลบ
                                                    </Button>
                                                </div>

                                                <div className="grid gap-6">
                                                    <div className="grid gap-3">
                                                        <Label>ID (ห้ามซ้ำ)</Label>
                                                        <Input
                                                            value={selectedFeature.id}
                                                            onChange={(e) => updateFeature(selectedFeatureIndex, 'id', e.target.value)}
                                                            className="h-11 rounded-xl bg-muted/30 border-transparent focus:bg-background"
                                                        />
                                                    </div>

                                                    <div className="grid gap-3">
                                                        <Label>ไอคอน</Label>
                                                        <div className="relative">
                                                            <Button
                                                                variant="outline"
                                                                className="w-full justify-start text-left font-normal h-11 rounded-xl bg-muted/30 border-transparent hover:bg-muted/50"
                                                                onClick={() => setShowIconPicker(!showIconPicker)}
                                                            >
                                                                <SelectedIcon className="mr-2 h-4 w-4" />
                                                                {selectedFeature.icon}
                                                            </Button>
                                                            {showIconPicker && (
                                                                <div className="absolute top-full left-0 z-50 mt-2 w-80 p-4 bg-popover border rounded-2xl shadow-xl grid grid-cols-5 gap-2">
                                                                    {iconList.map((item) => (
                                                                        <Button
                                                                            key={item.name}
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="h-10 w-10 rounded-lg hover:bg-muted"
                                                                            onClick={() => {
                                                                                updateFeature(selectedFeatureIndex, 'icon', item.name);
                                                                                setShowIconPicker(false);
                                                                            }}
                                                                        >
                                                                            <item.icon className="h-5 w-5" />
                                                                        </Button>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="grid gap-3">
                                                        <Label>หัวข้อ</Label>
                                                        <Input
                                                            value={selectedFeature.title}
                                                            onChange={(e) => updateFeature(selectedFeatureIndex, 'title', e.target.value)}
                                                            className="h-11 rounded-xl bg-muted/30 border-transparent focus:bg-background"
                                                        />
                                                    </div>

                                                    <div className="grid gap-3">
                                                        <Label>คำอธิบาย</Label>
                                                        <Textarea
                                                            value={selectedFeature.description}
                                                            onChange={(e) => updateFeature(selectedFeatureIndex, 'description', e.target.value)}
                                                            className="min-h-[100px] rounded-xl bg-muted/30 border-transparent focus:bg-background resize-none"
                                                        />
                                                    </div>

                                                    <div className="grid gap-3">
                                                        <Label>URL รูปภาพ</Label>
                                                        <Input
                                                            value={selectedFeature.image}
                                                            onChange={(e) => updateFeature(selectedFeatureIndex, 'image', e.target.value)}
                                                            className="h-11 rounded-xl bg-muted/30 border-transparent focus:bg-background"
                                                        />
                                                        {/* Image Preview */}
                                                        <div className="mt-2 relative w-full h-64 rounded-2xl overflow-hidden border bg-muted/30">
                                                            {selectedFeature.image ? (
                                                                <Image
                                                                    src={selectedFeature.image}
                                                                    alt="Preview"
                                                                    fill
                                                                    className="object-cover"
                                                                    onError={(e) => { e.target.style.display = 'none'; }}
                                                                />
                                                            ) : (
                                                                <div className="flex items-center justify-center h-full text-muted-foreground">ไม่มีรูปภาพ</div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4 pt-4 border-t border-border/50">
                                                        <Label className="text-base">สถิติ</Label>
                                                        {selectedFeature.stats.map((stat, sIndex) => (
                                                            <div key={sIndex} className="flex gap-3">
                                                                <Input
                                                                    placeholder="ชื่อสถิติ"
                                                                    value={stat.label}
                                                                    onChange={(e) => updateFeatureStat(selectedFeatureIndex, sIndex, 'label', e.target.value)}
                                                                    className="h-11 rounded-xl bg-muted/30 border-transparent focus:bg-background"
                                                                />
                                                                <Input
                                                                    placeholder="ค่า"
                                                                    value={stat.value}
                                                                    onChange={(e) => updateFeatureStat(selectedFeatureIndex, sIndex, 'value', e.target.value)}
                                                                    className="h-11 rounded-xl bg-muted/30 border-transparent focus:bg-background"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                                                <div className="p-4 bg-muted/30 rounded-full mb-4">
                                                    <Star className="h-8 w-8 opacity-50" />
                                                </div>
                                                <p>เลือกฟีเจอร์ทางซ้ายเพื่อเริ่มแก้ไข</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Lucky Draw Settings */}
                        <TabsContent value="luckydraw" className="mt-0">
                            <div className="bg-card rounded-[2rem] border border-border/50 shadow-sm overflow-hidden h-[600px] flex flex-col">
                                <LuckyDrawEditor
                                    initialData={preregisterConfig?.luckyDraw}
                                    onSave={handleSaveLuckyDraw}
                                />
                            </div>
                        </TabsContent>

                        {/* News Settings */}
                        <TabsContent value="news" className="mt-0">
                            <div className="bg-card rounded-[2rem] border border-border/50 shadow-sm overflow-hidden h-[600px] flex flex-col">
                                <div className="p-8 border-b border-border/50 flex items-center justify-between shrink-0">
                                    <div>
                                        <h3 className="text-2xl font-bold mb-1">ข่าวสารและประกาศ</h3>
                                        <p className="text-muted-foreground">จัดการข่าวสาร อัปเดต และโปรโมชั่น</p>
                                    </div>
                                    <Button onClick={handleSaveNews} disabled={isSaving} className="rounded-full px-6">
                                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                        บันทึกข่าวสารทั้งหมด
                                    </Button>
                                </div>

                                <div className="flex-1 flex overflow-hidden">
                                    {/* Left Sidebar: List of News */}
                                    <div className="w-72 shrink-0 flex flex-col border-r border-border/50 bg-muted/10">
                                        <div className="p-4">
                                            <Button onClick={addNews} className="w-full rounded-xl" variant="outline">
                                                <Plus className="mr-2 h-4 w-4" /> เพิ่มข่าวสาร
                                            </Button>
                                        </div>
                                        <ScrollArea className="flex-1 px-4 pb-4">
                                            <div className="space-y-2">
                                                {newsConfig.map((item, index) => (
                                                    <div
                                                        key={index}
                                                        onClick={() => setSelectedNewsIndex(index)}
                                                        className={cn(
                                                            "w-full p-3 rounded-xl text-left cursor-pointer transition-all border border-transparent",
                                                            selectedNewsIndex === index
                                                                ? "bg-background shadow-sm border-border/50 font-medium text-primary"
                                                                : "hover:bg-muted/50 text-muted-foreground"
                                                        )}
                                                    >
                                                        <div className="truncate font-medium">{item.title || "ข่าวสารไม่มีชื่อ"}</div>
                                                        <div className="text-xs text-muted-foreground mt-1">{item.date}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    </div>

                                    {/* Right Content: Editor */}
                                    <div className="flex-1 overflow-y-auto p-8">
                                        {selectedNews ? (
                                            <div className="space-y-8 max-w-3xl mx-auto">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-lg font-bold flex items-center gap-2">
                                                        <div className="p-2 bg-primary/10 rounded-lg">
                                                            <Newspaper className="h-5 w-5 text-primary" />
                                                        </div>
                                                        แก้ไขข่าวสาร
                                                    </h3>
                                                    <Button variant="destructive" size="sm" onClick={() => removeNews(selectedNewsIndex)} className="rounded-full px-4">
                                                        <Trash2 className="mr-2 h-4 w-4" /> ลบ
                                                    </Button>
                                                </div>

                                                <div className="grid gap-6">
                                                    <div className="grid gap-3">
                                                        <Label>หมวดหมู่</Label>
                                                        <Select
                                                            value={selectedNews.category}
                                                            onValueChange={(value) => updateNews(selectedNewsIndex, 'category', value)}
                                                        >
                                                            <SelectTrigger className="h-11 rounded-xl bg-muted/30 border-transparent focus:bg-background">
                                                                <SelectValue placeholder="เลือกหมวดหมู่" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {newsCategories.filter(c => c.id !== 'all').map((cat) => (
                                                                    <SelectItem key={cat.id} value={cat.id}>
                                                                        {cat.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div className="grid gap-3">
                                                        <Label>หัวข้อ</Label>
                                                        <Input
                                                            value={selectedNews.title}
                                                            onChange={(e) => updateNews(selectedNewsIndex, 'title', e.target.value)}
                                                            className="h-11 rounded-xl bg-muted/30 border-transparent focus:bg-background"
                                                        />
                                                    </div>

                                                    <div className="grid gap-3">
                                                        <Label>วันที่ (วว/ดด/ปปปป)</Label>
                                                        <Input
                                                            value={selectedNews.date}
                                                            onChange={(e) => updateNews(selectedNewsIndex, 'date', e.target.value)}
                                                            className="h-11 rounded-xl bg-muted/30 border-transparent focus:bg-background"
                                                        />
                                                    </div>

                                                    <div className="grid gap-3">
                                                        <Label>เนื้อหาย่อ (คำอธิบายสั้นๆ)</Label>
                                                        <Textarea
                                                            value={selectedNews.excerpt}
                                                            onChange={(e) => updateNews(selectedNewsIndex, 'excerpt', e.target.value)}
                                                            className="min-h-[100px] rounded-xl bg-muted/30 border-transparent focus:bg-background resize-none"
                                                        />
                                                    </div>

                                                    <div className="grid gap-3">
                                                        <Label>URL รูปภาพ</Label>
                                                        <Input
                                                            value={selectedNews.image}
                                                            onChange={(e) => updateNews(selectedNewsIndex, 'image', e.target.value)}
                                                            className="h-11 rounded-xl bg-muted/30 border-transparent focus:bg-background"
                                                        />
                                                        {/* Image Preview */}
                                                        <div className="mt-2 relative w-full h-64 rounded-2xl overflow-hidden border bg-muted/30">
                                                            {selectedNews.image ? (
                                                                <Image
                                                                    src={selectedNews.image}
                                                                    alt="Preview"
                                                                    fill
                                                                    className="object-cover"
                                                                    onError={(e) => { e.target.style.display = 'none'; }}
                                                                />
                                                            ) : (
                                                                <div className="flex items-center justify-center h-full text-muted-foreground">ไม่มีรูปภาพ</div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="grid gap-3">
                                                        <Label>เนื้อหา (รองรับ HTML)</Label>
                                                        <Textarea
                                                            className="min-h-[300px] font-mono text-sm rounded-xl bg-muted/30 border-transparent focus:bg-background"
                                                            value={selectedNews.content}
                                                            onChange={(e) => updateNews(selectedNewsIndex, 'content', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                                                <div className="p-4 bg-muted/30 rounded-full mb-4">
                                                    <Newspaper className="h-8 w-8 opacity-50" />
                                                </div>
                                                <p>เลือกข่าวสารทางซ้ายเพื่อเริ่มแก้ไข</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Roadmap Settings */}
                        <TabsContent value="roadmap" className="mt-0">
                            <div className="bg-card rounded-[2rem] border border-border/50 shadow-sm overflow-hidden h-[600px] flex flex-col">
                                <RoadmapEditor
                                    siteConfig={siteConfig}
                                    setSiteConfig={setSiteConfig}
                                    onSave={handleSave}
                                />
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div >
    );
}
