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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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

const iconList = [
    { name: 'Users', icon: Users },
    { name: 'Shield', icon: Shield },
    { name: 'Zap', icon: Zap },
    { name: 'Car', icon: Car },
    { name: 'Briefcase', icon: Briefcase },
    { name: 'Home', icon: Home },
    { name: 'Star', icon: Star },
    { name: 'Heart', icon: Heart },
    { name: 'Trophy', Trophy },
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
            title: 'New Feature',
            description: 'Description here...',
            image: 'https://placehold.co/800x600',
            stats: [{ label: 'Stat 1', value: '100' }]
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
            title: 'New Announcement',
            category: 'news',
            date: new Date().toLocaleDateString('en-GB'), // DD/MM/YYYY format
            excerpt: 'Short description...',
            image: 'https://placehold.co/600x400/3b82f6/ffffff?text=News',
            content: '<p>Content goes here...</p>'
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
                        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
                        <p className="text-muted-foreground">Configure global website settings</p>
                    </div>
                    <Button disabled={isSaving} onClick={() => window.location.reload()}>
                        Refresh Data
                    </Button>
                </div>

                <Tabs defaultValue="general" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="game">Game & Activity</TabsTrigger>
                        <TabsTrigger value="features">Features</TabsTrigger>
                        <TabsTrigger value="news">News</TabsTrigger>
                    </TabsList>

                    {/* General Settings */}
                    <TabsContent value="general">
                        <Card>
                            <CardHeader>
                                <CardTitle>General Information</CardTitle>
                                <CardDescription>Basic website information and SEO settings.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label>Website Name</Label>
                                    <Input
                                        value={siteConfig?.name || ''}
                                        onChange={(e) => setSiteConfig({ ...siteConfig, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Description</Label>
                                    <Textarea
                                        value={siteConfig?.description || ''}
                                        onChange={(e) => setSiteConfig({ ...siteConfig, description: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Discord Link</Label>
                                    <Input
                                        value={siteConfig?.links?.discord || ''}
                                        onChange={(e) => setSiteConfig({ ...siteConfig, links: { ...siteConfig.links, discord: e.target.value } })}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={() => handleSave('site', siteConfig)} disabled={isSaving}>
                                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    Save Changes
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    {/* Game Settings */}
                    <TabsContent value="game">
                        <Card>
                            <CardHeader>
                                <CardTitle>Activity Configuration</CardTitle>
                                <CardDescription>Manage preregistration and lucky draw systems.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between space-x-2">
                                    <Label htmlFor="gang-mode" className="flex flex-col space-y-1">
                                        <span>Enable Gang System</span>
                                        <span className="font-normal text-xs text-muted-foreground">Allow users to create and join gangs</span>
                                    </Label>
                                    <Switch
                                        id="gang-mode"
                                        checked={preregisterConfig?.features?.enableGang}
                                        onCheckedChange={(checked) => setPreregisterConfig({
                                            ...preregisterConfig,
                                            features: { ...preregisterConfig.features, enableGang: checked }
                                        })}
                                    />
                                </div>
                                <div className="flex items-center justify-between space-x-2">
                                    <Label htmlFor="lucky-draw" className="flex flex-col space-y-1">
                                        <span>Enable Lucky Draw</span>
                                        <span className="font-normal text-xs text-muted-foreground">Allow users to spin for rewards</span>
                                    </Label>
                                    <Switch
                                        id="lucky-draw"
                                        checked={preregisterConfig?.features?.enableLuckyDraw}
                                        onCheckedChange={(checked) => setPreregisterConfig({
                                            ...preregisterConfig,
                                            features: { ...preregisterConfig.features, enableLuckyDraw: checked }
                                        })}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={() => handleSave('preregister', preregisterConfig)} disabled={isSaving}>
                                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    Save Changes
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    {/* Features Settings */}
                    <TabsContent value="features" className="space-y-4 mt-4">
                        <Card className="h-[800px] flex flex-col">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Featured Features</CardTitle>
                                        <CardDescription>Manage the features displayed on the homepage.</CardDescription>
                                    </div>
                                    <Button onClick={handleSaveFeatures} disabled={isSaving}>
                                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                        Save All Features
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 flex gap-6 overflow-hidden pt-0">
                                {/* Left Sidebar: List of Features */}
                                <div className="w-64 shrink-0 flex flex-col border-r pr-6">
                                    <Button onClick={addFeature} className="w-full mb-4" variant="outline">
                                        <Plus className="mr-2 h-4 w-4" /> Add Feature
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
                                                    <span className="truncate">{feature.title || "Untitled Feature"}</span>
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
                                                <h3 className="text-lg font-semibold">Edit Feature</h3>
                                                <Button variant="destructive" size="sm" onClick={() => removeFeature(selectedFeatureIndex)}>
                                                    <Trash2 className="mr-2 h-4 w-4" /> Remove
                                                </Button>
                                            </div>

                                            <div className="grid gap-4">
                                                <div className="grid gap-2">
                                                    <Label>ID (Unique)</Label>
                                                    <Input
                                                        value={selectedFeature.id}
                                                        onChange={(e) => updateFeature(selectedFeatureIndex, 'id', e.target.value)}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label>Icon</Label>
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
                                                    <Label>Title</Label>
                                                    <Input
                                                        value={selectedFeature.title}
                                                        onChange={(e) => updateFeature(selectedFeatureIndex, 'title', e.target.value)}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label>Description</Label>
                                                    <Textarea
                                                        value={selectedFeature.description}
                                                        onChange={(e) => updateFeature(selectedFeatureIndex, 'description', e.target.value)}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label>Image URL</Label>
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
                                                            <div className="flex items-center justify-center h-full text-muted-foreground">No Image</div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Stats</Label>
                                                    {selectedFeature.stats.map((stat, sIndex) => (
                                                        <div key={sIndex} className="flex gap-2">
                                                            <Input
                                                                placeholder="Label"
                                                                value={stat.label}
                                                                onChange={(e) => updateFeatureStat(selectedFeatureIndex, sIndex, 'label', e.target.value)}
                                                            />
                                                            <Input
                                                                placeholder="Value"
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
                                            Select a feature to edit
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
                                        <CardTitle>News & Announcements</CardTitle>
                                        <CardDescription>Manage news, updates, and promotions.</CardDescription>
                                    </div>
                                    <Button onClick={handleSaveNews} disabled={isSaving}>
                                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                        Save All News
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 flex gap-6 overflow-hidden pt-0">
                                {/* Left Sidebar: List of News */}
                                <div className="w-64 shrink-0 flex flex-col border-r pr-6">
                                    <Button onClick={addNews} className="w-full mb-4" variant="outline">
                                        <Plus className="mr-2 h-4 w-4" /> Add News
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
                                                    <span className="truncate">{item.title || "Untitled News"}</span>
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
                                                <h3 className="text-lg font-semibold">Edit News</h3>
                                                <Button variant="destructive" size="sm" onClick={() => removeNews(selectedNewsIndex)}>
                                                    <Trash2 className="mr-2 h-4 w-4" /> Remove
                                                </Button>
                                            </div>

                                            <div className="grid gap-4">
                                                <div className="grid gap-2">
                                                    <Label>Category</Label>
                                                    <Select
                                                        value={selectedNews.category}
                                                        onValueChange={(value) => updateNews(selectedNewsIndex, 'category', value)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Category" />
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
                                                    <Label>Title</Label>
                                                    <Input
                                                        value={selectedNews.title}
                                                        onChange={(e) => updateNews(selectedNewsIndex, 'title', e.target.value)}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label>Date (DD/MM/YYYY)</Label>
                                                    <Input
                                                        value={selectedNews.date}
                                                        onChange={(e) => updateNews(selectedNewsIndex, 'date', e.target.value)}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label>Excerpt (Short Description)</Label>
                                                    <Textarea
                                                        value={selectedNews.excerpt}
                                                        onChange={(e) => updateNews(selectedNewsIndex, 'excerpt', e.target.value)}
                                                    />
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label>Image URL</Label>
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
                                                            <div className="flex items-center justify-center h-full text-muted-foreground">No Image</div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="grid gap-2">
                                                    <Label>Content (HTML Supported)</Label>
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
                                            Select a news item to edit
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                </Tabs>
            </div>
        </div>
    );
}
