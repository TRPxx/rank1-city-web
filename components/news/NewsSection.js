'use client';

import { useState, useMemo, useEffect } from 'react';
import { categories } from '@/lib/news-data';
import Link from 'next/link';
import { CalendarDays, Tag, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function NewsSection() {
    const [activeTab, setActiveTab] = useState('all');
    const [news, setNews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await fetch('/api/news');
                if (res.ok) {
                    const data = await res.json();
                    setNews(data);
                }
            } catch (error) {
                console.error("Failed to fetch news:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchNews();
    }, []);

    // Filter ข่าวตาม Tab ที่เลือก
    const filteredNews = useMemo(() => {
        if (!news) return [];
        const filtered = activeTab === 'all'
            ? news
            : news.filter(item => item.category === activeTab);

        return filtered;
    }, [activeTab, news]);

    if (isLoading) {
        return <div className="w-full h-64 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;
    }

    // แยกข่าวล่าสุดออกมาเป็น Featured
    const featuredNews = filteredNews[0];
    const otherNews = filteredNews.slice(1);

    return (
        <div className="w-full h-full flex flex-col max-w-7xl mx-auto px-4">

            {/* Header & Tabs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-full overflow-x-auto scrollbar-hide max-w-full">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveTab(cat.id)}
                            className={cn(
                                "px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                                activeTab === cat.id
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            )}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* News Content */}
            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide -mx-4 px-4 pb-8">
                {!featuredNews ? (
                    <div className="text-center py-20 text-muted-foreground">ไม่พบข่าวสารในหมวดหมู่นี้</div>
                ) : (
                    <div className="space-y-8">
                        {/* Featured News (Big Card) */}
                        <Link href={`/news/${featuredNews.id}`} className="group block relative rounded-3xl overflow-hidden bg-muted/30 aspect-[2/1] md:aspect-[2.5/1]">
                            <Image
                                src={featuredNews.image}
                                alt={featuredNews.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                            <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full max-w-3xl">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className={cn("px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground")}>
                                        {categories.find(c => c.id === featuredNews.category)?.label}
                                    </span>
                                    <span className="text-gray-300 text-xs flex items-center gap-1">
                                        <CalendarDays className="w-3 h-3" />
                                        {featuredNews.date}
                                    </span>
                                </div>
                                <h3 className="text-2xl md:text-4xl font-bold text-white mb-2 leading-tight group-hover:text-primary transition-colors">
                                    {featuredNews.title}
                                </h3>
                                <p className="text-gray-300 line-clamp-2 md:text-lg">
                                    {featuredNews.excerpt}
                                </p>
                            </div>
                        </Link>

                        {/* Grid Layout for Other News */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {otherNews.map((item) => (
                                <Link
                                    key={item.id}
                                    href={`/news/${item.id}`}
                                    className="group flex flex-col gap-4 p-4 rounded-3xl hover:bg-muted/40 transition-colors"
                                >
                                    {/* Image */}
                                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        {/* Category Badge */}
                                        <div className="absolute top-3 left-3">
                                            <span className={cn(
                                                "px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md",
                                                "bg-background/80 text-foreground"
                                            )}>
                                                {categories.find(c => c.id === item.category)?.label}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 flex flex-col">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                            <CalendarDays className="w-3 h-3" />
                                            <span>{item.date}</span>
                                        </div>
                                        <h3 className="font-bold text-lg leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {item.excerpt}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
