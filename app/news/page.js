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
                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : news.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                                {news.map((item) => (
                                    <NewsCard key={item.id} item={item} />
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex justify-center gap-2">
                                    <Button
                                        variant="outline"
                                        disabled={currentPage <= 1}
                                        onClick={() => handlePageChange(currentPage - 1)}
                                    >
                                        Previous
                                    </Button>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                        <Button
                                            key={p}
                                            variant={currentPage === p ? "default" : "outline"}
                                            onClick={() => handlePageChange(p)}
                                            className="w-10 h-10 p-0"
                                        >
                                            {p}
                                        </Button>
                                    ))}

                                    <Button
                                        variant="outline"
                                        disabled={currentPage >= totalPages}
                                        onClick={() => handlePageChange(currentPage + 1)}
                                    >
                                        Next
                                    </Button>
                                </div>
                            )}
                        </>
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
