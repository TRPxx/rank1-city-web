'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NewsCard from '@/components/news/NewsCard';
import { Button } from '@/components/ui/button';
import { categories } from '@/lib/news-data';
import { cn } from '@/lib/utils';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { CalendarDays } from 'lucide-react';
import Image from 'next/image';

function NewsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Get params from URL
    const currentCategory = searchParams.get('category') || 'all';
    const currentPage = parseInt(searchParams.get('page')) || 1;
    const [searchQuery, setSearchQuery] = useState('');

    // Data State
    const [news, setNews] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    const fetchNews = async () => {
        setIsLoading(true);
        try {
            // Build Query Params
            const params = new URLSearchParams();
            if (currentCategory !== 'all') params.set('category', currentCategory);
            if (searchQuery) params.set('search', searchQuery);
            params.set('page', currentPage.toString());
            params.set('limit', '9'); // 9 items per page

            const res = await fetch(`/api/news?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                // Handle both paginated and non-paginated (just in case)
                if (data.items) {
                    setNews(data.items);
                    setTotalPages(data.metadata.totalPages);
                } else {
                    setNews(data); // Fallback
                }
            }
        } catch (error) {
            console.error("Failed to fetch news:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Debounce Search ONLY
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchNews();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Immediate update for Category and Page
    useEffect(() => {
        fetchNews();
    }, [currentCategory, currentPage]);

    // Handle Category Click
    const handleCategoryChange = (catId) => {
        const params = new URLSearchParams(searchParams);
        if (catId === 'all') params.delete('category');
        else params.set('category', catId);

        params.delete('page'); // Reset to page 1
        router.push(`/news?${params.toString()}`);
    };

    // Handle Page Change
    const handlePageChange = (newPage) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', newPage.toString());
        router.push(`/news?${params.toString()}`);
    };

    return (
        <div className="min-h-screen flex flex-col bg-background font-sans">
            <Navbar />

            <main className="flex-1 pt-24 pb-16">
                <div className="container max-w-7xl px-4">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-10">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">ข่าวสารและอัปเดต</h1>
                            <p className="text-lg text-muted-foreground">ติดตามความเคลื่อนไหวล่าสุดของ Rank1 City ได้ที่นี่</p>
                        </div>

                        {/* Search Bar */}
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="ค้นหาข่าวสาร..."
                                className="pl-10 h-12 rounded-2xl bg-muted/50 border-transparent focus:bg-background transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex items-center gap-2 mb-10 overflow-x-auto scrollbar-hide pb-2">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryChange(cat.id)}
                                className={cn(
                                    "px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                                    currentCategory === cat.id
                                        ? "bg-primary text-primary-foreground shadow-md"
                                        : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* News Grid */}
                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        </div>
                    ) : news.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                                {news.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={`/news/${item.id}`}
                                        className="group flex flex-col gap-4 p-4 rounded-[2rem] hover:bg-muted/30 transition-all duration-300"
                                    >
                                        {/* Image */}
                                        <div className="relative aspect-video rounded-3xl overflow-hidden bg-muted shadow-sm">
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            {/* Category Badge */}
                                            <div className="absolute top-4 left-4">
                                                <span className={cn(
                                                    "px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm",
                                                    "bg-background/90 text-foreground"
                                                )}>
                                                    {categories.find(c => c.id === item.category)?.label}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 flex flex-col px-2">
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3 font-medium">
                                                <CalendarDays className="w-3.5 h-3.5" />
                                                <span>{item.date}</span>
                                            </div>
                                            <h3 className="font-bold text-xl leading-tight mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                                {item.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                                {item.excerpt}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex justify-center gap-2">
                                    <Button
                                        variant="outline"
                                        disabled={currentPage <= 1}
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        className="rounded-xl"
                                    >
                                        Previous
                                    </Button>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                        <Button
                                            key={p}
                                            variant={currentPage === p ? "default" : "outline"}
                                            onClick={() => handlePageChange(p)}
                                            className={cn("w-10 h-10 p-0 rounded-xl", currentPage === p && "shadow-md")}
                                        >
                                            {p}
                                        </Button>
                                    ))}

                                    <Button
                                        variant="outline"
                                        disabled={currentPage >= totalPages}
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        className="rounded-xl"
                                    >
                                        Next
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-32 bg-muted/20 rounded-[3rem] border border-dashed border-muted-foreground/20">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                                <Search className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">ไม่พบข้อมูลข่าวสาร</h3>
                            <p className="text-muted-foreground mb-6">ลองเปลี่ยนคำค้นหาหรือหมวดหมู่ดูนะครับ</p>
                            <Button
                                variant="outline"
                                onClick={() => { setSearchQuery(''); handleCategoryChange('all'); }}
                                className="rounded-full px-6"
                            >
                                ล้างตัวกรองทั้งหมด
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
