'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NewsCard from '@/components/news/NewsCard';
import { Button } from '@/components/ui/button';
import { categories, newsData } from '@/lib/news-data';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

function NewsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Get category from URL or default to 'all'
    const currentCategory = searchParams.get('category') || 'all';
    const [searchQuery, setSearchQuery] = useState('');

    // Filter Logic
    const filteredNews = newsData.filter(item => {
        const matchesCategory = currentCategory === 'all' || item.category === currentCategory;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Handle Category Click
    const handleCategoryChange = (catId) => {
        const params = new URLSearchParams(searchParams);
        if (catId === 'all') {
            params.delete('category');
        } else {
            params.set('category', catId);
        }
        router.push(`/news?${params.toString()}`);
    };

    return (
        <div className="min-h-screen flex flex-col bg-background font-sans">
            <Navbar />

            <main className="flex-1 pt-24 pb-16">
                <div className="container max-w-6xl">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">ข่าวสารและอัปเดต</h1>
                            <p className="text-muted-foreground">ติดตามความเคลื่อนไหวล่าสุดของ Rank1 City ได้ที่นี่</p>
                        </div>

                        {/* Search Bar */}
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="ค้นหาข่าวสาร..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex flex-wrap gap-2 mb-8 border-b pb-4">
                        {categories.map((cat) => (
                            <Button
                                key={cat.id}
                                variant={currentCategory === cat.id ? "default" : "ghost"}
                                onClick={() => handleCategoryChange(cat.id)}
                                className={cn(
                                    "rounded-full px-6",
                                    currentCategory === cat.id && cat.id !== 'all' ? `${cat.color} ${cat.textColor} hover:${cat.color}/90` : ""
                                )}
                            >
                                {cat.label}
                            </Button>
                        ))}
                    </div>

                    {/* News Grid */}
                    {filteredNews.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredNews.map((item) => (
                                <NewsCard key={item.id} item={item} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-muted/30 rounded-xl border border-dashed">
                            <p className="text-muted-foreground text-lg">ไม่พบข้อมูลข่าวสารที่คุณค้นหา</p>
                            <Button
                                variant="link"
                                onClick={() => { setSearchQuery(''); handleCategoryChange('all'); }}
                                className="mt-2"
                            >
                                ล้างคำค้นหา
                            </Button>
                        </div>
                    )}

                </div>
            </main>

            <Footer />
        </div>
    );
}

export default function NewsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <NewsContent />
        </Suspense>
    );
}
