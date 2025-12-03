import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { newsData, categories } from '@/lib/news-data';
import { CalendarDays, ArrowLeft, Share2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
    return newsData.map((post) => ({
        id: post.id,
    }));
}

export default async function NewsDetailPage({ params }) {
    const { id } = await params;
    const newsItem = newsData.find(item => item.id === id);

    if (!newsItem) {
        notFound();
    }

    const categoryInfo = categories.find(c => c.id === newsItem.category) || categories[0];

    return (
        <div className="min-h-screen flex flex-col bg-background font-sans">
            <Navbar />

            <main className="flex-1 pt-24 pb-16">
                <article className="container max-w-4xl">

                    {/* Back Button */}
                    <Link href="/news" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> กลับไปหน้าข่าวสาร
                    </Link>

                    {/* Header */}
                    <header className="mb-8 space-y-4">
                        <div className="flex items-center gap-3">
                            <Badge className={`${categoryInfo.color} ${categoryInfo.textColor} border-none`}>
                                {categoryInfo.label}
                            </Badge>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <CalendarDays className="w-4 h-4" />
                                {new Date(newsItem.date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                            {newsItem.title}
                        </h1>
                    </header>

                    {/* Cover Image */}
                    <div className="rounded-2xl overflow-hidden aspect-video mb-10 shadow-lg border relative">
                        <Image
                            src={newsItem.image}
                            alt={newsItem.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    {/* Content */}
                    {/* Security Note: newsItem.content comes from a static file (lib/news-data.js) and is trusted. */}
                    <div
                        className="prose prose-lg dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: newsItem.content }}
                    />

                    {/* Footer Actions */}
                    <div className="mt-12 pt-8 border-t flex justify-between items-center">
                        <div className="text-muted-foreground text-sm">
                            เขียนโดย: Rank1 Team
                        </div>
                        <Button variant="outline" size="sm" className="gap-2">
                            <Share2 className="w-4 h-4" /> แชร์บทความ
                        </Button>
                    </div>

                </article>
            </main>

            <Footer />
        </div>
    );
}
