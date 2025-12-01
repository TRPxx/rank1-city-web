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
import { Loader2, Save, AlertCircle, CheckCircle, Plus, Trash2, Users, Shield, Zap, Car, Briefcase, Home, Star, Heart, Trophy, Target, Flag, MapPin, Gift, Activity, Settings, MessageCircle, PlayCircle, Gamepad2, Info, HelpCircle, Search, Newspaper } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
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
            toast.success("Settings saved successfully");
        } catch (error) {
            toast.error("Failed to save settings");
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
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!session?.user?.isAdmin) return null;

    const selectedFeature = featuresConfig[selectedFeatureIndex];
    const SelectedIcon = iconList.find(i => i.name === selectedFeature?.icon)?.icon || Star;

    const selectedNews = newsConfig[selectedNewsIndex];

    return (
        <div className="min-h-screen bg-background pb-20">
            <Navbar />
            <div className="container pt-24">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">ตั้งค่าระบบ</h1>
                        <p className="text-muted-foreground">จัดการการตั้งค่าเว็บไซต์ทั้งหมด</p>
                    </div>
                    <Button disabled={isSaving} onClick={() => window.location.reload()}>
                        รีเฟรชข้อมูล
                    </Button>
                </div>

                <Tabs defaultValue="general" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="general">ทั่วไป</TabsTrigger>
                        <TabsTrigger value="game">เกมและกิจกรรม</TabsTrigger>
                        <TabsTrigger value="features">ฟีเจอร์</TabsTrigger>
                        <TabsTrigger value="news">ข่าวสาร</TabsTrigger>
                        <TabsTrigger value="roadmap">แผนงาน</TabsTrigger>
                    </TabsList>

                    {/* General Settings */}
                    <TabsContent value="general">
                        <Card>
                            <CardHeader>
                                <CardTitle>ข้อมูลทั่วไป</CardTitle>
                                <CardDescription>ข้อมูลพื้นฐานของเว็บไซต์และการตั้งค่า SEO</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label>ชื่อเว็บไซต์</Label>
                                    <Input
                                        value={siteConfig?.name || ''}
                                        onChange={(e) => setSiteConfig({ ...siteConfig, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>คำอธิบาย</Label>
                                    <Textarea
                                        value={siteConfig?.description || ''}
                                        onChange={(e) => setSiteConfig({ ...siteConfig, description: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>ลิงก์ Discord</Label>
                                    <Input
                                        value={siteConfig?.links?.discord || ''}
                                        onChange={(e) => setSiteConfig({ ...siteConfig, links: { ...siteConfig.links, discord: e.target.value } })}
                                    />
                                </div>
                                <div className="grid gap-2 pt-4 border-t">
                                    <Label>สถานะเซิร์ฟเวอร์</Label>
                                    <Select
                                        value={siteConfig?.serverStatus || 'preregister'}
                                        onValueChange={(value) => setSiteConfig({ ...siteConfig, serverStatus: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="เลือกโหมด" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="preregister">ลงทะเบียนล่วงหน้า (เร็วๆ นี้)</SelectItem>
                                            <SelectItem value="live">เปิดให้บริการ (เล่นเลย)</SelectItem>
                                            <SelectItem value="maintenance">ปิดปรับปรุง</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-muted-foreground">
                                        "ลงทะเบียนล่วงหน้า": แสดงเวลานับถอยหลังและปุ่มลงทะเบียน<br />
                                        "เปิดให้บริการ": แสดงปุ่ม "เล่นเลย" และสถานะเซิร์ฟเวอร์
                                    </p>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={() => handleSave('site', siteConfig)} disabled={isSaving}>
                                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    บันทึกการเปลี่ยนแปลง
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    {/* Game Settings */}
                    {/* Game Settings */}
                    <TabsContent value="game">
                        <RewardsEditor
                            config={preregisterConfig}
                            setConfig={setPreregisterConfig}
                            onSave={handleSave}
                        />
                    </TabsContent>

                    {/* Features Settings */}
                    <TabsContent value="features" className="space-y-4 mt-4">
                        <Card className="h-[800px] flex flex-col">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>ฟีเจอร์เด่น</CardTitle>
                                        <CardDescription>จัดการฟีเจอร์ที่จะแสดงบนหน้าแรก</CardDescription>
                                    </div>
                                    <Button onClick={handleSaveFeatures} disabled={isSaving}>
                                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                        บันทึกฟีเจอร์ทั้งหมด
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 flex gap-6 overflow-hidden pt-0">
                                {/* Left Sidebar: List of Features */}
                                <div className="w-64 shrink-0 flex flex-col border-r pr-6">
                                    <Button onClick={addFeature} className="w-full mb-4" variant="outline">
                                        <Plus className="mr-2 h-4 w-4" /> เพิ่มฟีเจอร์
                                    </Button>
                                    <ScrollArea className="flex-1">
                                        <div className="space-y-2">
                                            {featuresConfig.map((feature, index) => (
                                                <Button
                                                    key={index}
                                                    variant={selectedFeatureIndex === index ? "secondary" : "ghost"}
                                                    className="w-full justify-start font-normal"
                                                    onClick={() => setSelectedFeatureIndex(index)}
                                                >
                                                    <span className="truncate">{feature.title || "ฟีเจอร์ไม่มีชื่อ"}</span>
                                                </Button>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </div>

                                {/* Right Content: Editor */}
                                <div className="flex-1 overflow-y-auto pr-2">
                                    {selectedFeature ? (
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-semibold">แก้ไขฟีเจอร์</h3>
                                                <Button variant="destructive" size="sm" onClick={() => removeFeature(selectedFeatureIndex)}>
                                                    <Trash2 className="mr-2 h-4 w-4" /> ลบ
                                                </Button>
                                            </div>

                                            <div className="grid gap-4">
                                                <div className="grid gap-2">
                                                    <Label>ID (ห้ามซ้ำ)</Label>
                                                    <Input
                                                        value={selectedFeature.id}
                                                        onChange={(e) => updateFeature(selectedFeatureIndex, 'id', e.target.value)}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label>ไอคอน</Label>
                                                    <div className="relative">
                                                        <Button
                                                            variant="outline"
                                                            className="w-full justify-start text-left font-normal"
                                                            onClick={() => setShowIconPicker(!showIconPicker)}
                                                        >
                                                            <SelectedIcon className="mr-2 h-4 w-4" />
                                                            {selectedFeature.icon}
                                                        </Button>
                                                        {showIconPicker && (
                                                            <div className="absolute top-full left-0 z-50 mt-2 w-64 p-2 bg-popover border rounded-md shadow-md grid grid-cols-4 gap-2">
                                                                {iconList.map((item) => (
                                                                    <Button
                                                                        key={item.name}
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-10 w-10"
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

                                                <div className="grid gap-2">
                                                    <Label>หัวข้อ</Label>
                                                    <Input
                                                        value={selectedFeature.title}
                                                        onChange={(e) => updateFeature(selectedFeatureIndex, 'title', e.target.value)}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label>คำอธิบาย</Label>
                                                    <Textarea
                                                        value={selectedFeature.description}
                                                        onChange={(e) => updateFeature(selectedFeatureIndex, 'description', e.target.value)}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label>URL รูปภาพ</Label>
                                                    <Input
                                                        value={selectedFeature.image}
                                                        onChange={(e) => updateFeature(selectedFeatureIndex, 'image', e.target.value)}
                                                    />
                                                    {/* Image Preview */}
                                                    <div className="mt-2 relative w-full h-48 rounded-md overflow-hidden border bg-muted">
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

                                                <div className="space-y-2">
                                                    <Label>สถิติ</Label>
                                                    {selectedFeature.stats.map((stat, sIndex) => (
                                                        <div key={sIndex} className="flex gap-2">
                                                            <Input
                                                                placeholder="ชื่อสถิติ"
                                                                value={stat.label}
                                                                onChange={(e) => updateFeatureStat(selectedFeatureIndex, sIndex, 'label', e.target.value)}
                                                            />
                                                            <Input
                                                                placeholder="ค่า"
                                                                value={stat.value}
                                                                onChange={(e) => updateFeatureStat(selectedFeatureIndex, sIndex, 'value', e.target.value)}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-muted-foreground">
                                            เลือกฟีเจอร์เพื่อแก้ไข
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* News Settings */}
                    <TabsContent value="news" className="space-y-4 mt-4">
                        <Card className="h-[800px] flex flex-col">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>ข่าวสารและประกาศ</CardTitle>
                                        <CardDescription>จัดการข่าวสาร อัปเดต และโปรโมชั่น</CardDescription>
                                    </div>
                                    <Button onClick={handleSaveNews} disabled={isSaving}>
                                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                        บันทึกข่าวสารทั้งหมด
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 flex gap-6 overflow-hidden pt-0">
                                {/* Left Sidebar: List of News */}
                                <div className="w-64 shrink-0 flex flex-col border-r pr-6">
                                    <Button onClick={addNews} className="w-full mb-4" variant="outline">
                                        <Plus className="mr-2 h-4 w-4" /> เพิ่มข่าวสาร
                                    </Button>
                                    <ScrollArea className="flex-1">
                                        <div className="space-y-2">
                                            {newsConfig.map((item, index) => (
                                                <Button
                                                    key={index}
                                                    variant={selectedNewsIndex === index ? "secondary" : "ghost"}
                                                    className="w-full justify-start font-normal"
                                                    onClick={() => setSelectedNewsIndex(index)}
                                                >
                                                    <span className="truncate">{item.title || "ข่าวสารไม่มีชื่อ"}</span>
                                                </Button>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </div>

                                {/* Right Content: Editor */}
                                <div className="flex-1 overflow-y-auto pr-2">
                                    {selectedNews ? (
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-semibold">แก้ไขข่าวสาร</h3>
                                                <Button variant="destructive" size="sm" onClick={() => removeNews(selectedNewsIndex)}>
                                                    <Trash2 className="mr-2 h-4 w-4" /> ลบ
                                                </Button>
                                            </div>

                                            <div className="grid gap-4">
                                                <div className="grid gap-2">
                                                    <Label>หมวดหมู่</Label>
                                                    <Select
                                                        value={selectedNews.category}
                                                        onValueChange={(value) => updateNews(selectedNewsIndex, 'category', value)}
                                                    >
                                                        <SelectTrigger>
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

                                                <div className="grid gap-2">
                                                    <Label>หัวข้อ</Label>
                                                    <Input
                                                        value={selectedNews.title}
                                                        onChange={(e) => updateNews(selectedNewsIndex, 'title', e.target.value)}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label>วันที่ (วว/ดด/ปปปป)</Label>
                                                    <Input
                                                        value={selectedNews.date}
                                                        onChange={(e) => updateNews(selectedNewsIndex, 'date', e.target.value)}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label>เนื้อหาย่อ (คำอธิบายสั้นๆ)</Label>
                                                    <Textarea
                                                        value={selectedNews.excerpt}
                                                        onChange={(e) => updateNews(selectedNewsIndex, 'excerpt', e.target.value)}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label>URL รูปภาพ</Label>
                                                    <Input
                                                        value={selectedNews.image}
                                                        onChange={(e) => updateNews(selectedNewsIndex, 'image', e.target.value)}
                                                    />
                                                    {/* Image Preview */}
                                                    <div className="mt-2 relative w-full h-48 rounded-md overflow-hidden border bg-muted">
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

                                                <div className="grid gap-2">
                                                    <Label>เนื้อหา (รองรับ HTML)</Label>
                                                    <Textarea
                                                        className="min-h-[200px] font-mono text-sm"
                                                        value={selectedNews.content}
                                                        onChange={(e) => updateNews(selectedNewsIndex, 'content', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-muted-foreground">
                                            เลือกข่าวสารเพื่อแก้ไข
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Roadmap Settings */}
                    <TabsContent value="roadmap">
                        <RoadmapEditor
                            siteConfig={siteConfig}
                            setSiteConfig={setSiteConfig}
                            onSave={handleSave}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </div >
    );
}
