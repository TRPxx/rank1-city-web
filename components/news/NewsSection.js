'use client';

import { useState, useMemo } from 'react';
import { newsData, categories } from '@/lib/news-data';
import Link from 'next/link';
import { CalendarDays, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function NewsSection() {
    const [activeTab, setActiveTab] = useState('all');

    // Filter ข่าวตาม Tab ที่เลือก
    const filteredNews = useMemo(() => {
        const filtered = activeTab === 'all'
            ? newsData
            : newsData.filter(item => item.category === activeTab);

        return filtered;
    }, [activeTab]);

    return (
        <div className="w-full h-full flex flex-col">

            {/* Tabs Header - Clean Design without any lines */}
            <div className="flex items-center gap-6 md:gap-8 mb-6 md:mb-8 px-2 overflow-x-auto scrollbar-hide" role="tablist" aria-label="News Categories">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        role="tab"
                        aria-selected={activeTab === cat.id}
                        aria-controls={`news-panel-${cat.id}`}
                        id={`news-tab-${cat.id}`}
                        onClick={() => setActiveTab(cat.id)}
                        className={cn(
                            "text-base md:text-lg font-bold transition-all relative whitespace-nowrap px-3 py-1 rounded-full",
                            activeTab === cat.id
                                ? `${cat.color} ${cat.textColor}`
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* News List - Scrollable with Hidden Scrollbar */}
            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-x-6 md:gap-y-4 content-start pb-4">
                    {filteredNews.map((item, index) => (
                        <Link
                            key={item.id}
                            href={`/news/${item.id}`}
                            className={cn(
                                "flex gap-3 md:gap-4 p-2 md:p-3 rounded-xl hover:bg-accent/50 transition-all group border border-transparent hover:border-border/50",
                                // Show all items, let container handle overflow
                            )}
                        >
                            {/* Thumbnail Image - Responsive Sizes */}
                            <div className="relative w-28 h-20 sm:w-32 sm:h-20 md:w-40 md:h-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted shadow-sm">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    sizes="(max-width: 768px) 100px, 160px"
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                {/* NEW Badge - Dynamic */}
                                {(new Date() - new Date(item.date.split('/').reverse().join('-'))) / (1000 * 60 * 60 * 24) <= 7 && (
                                    <div className="absolute top-0 left-0 bg-red-600 text-white text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 md:px-2 md:py-0.5 shadow-md">
                                        NEW
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                <div>
                                    <h3 className="font-bold text-sm md:text-base leading-tight mb-1 line-clamp-2 group-hover:text-red-500 transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs text-muted-foreground line-clamp-2 hidden sm:block">
                                        {item.excerpt}
                                    </p>
                                </div>

                                {/* Meta Footer */}
                                <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs text-muted-foreground mt-1">
                                    <div className="flex items-center gap-1 text-primary/80">
                                        <Tag className="w-3 h-3" />
                                        <span>{categories.find(c => c.id === item.category)?.label}</span>
                                    </div>
                                    <div className="w-px h-3 bg-border" />
                                    <div className="flex items-center gap-1">
                                        <CalendarDays className="w-3 h-3" />
                                        <span>{item.date}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
