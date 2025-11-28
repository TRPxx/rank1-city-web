import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { CalendarDays, ArrowRight } from 'lucide-react';
import { categories } from '@/lib/news-data';

export default function NewsCard({ item }) {
    // หาข้อมูล Category เพื่อดึงสี
    const categoryInfo = categories.find(c => c.id === item.category) || categories[0];

    return (
        <Link href={`/news/${item.id}`} className="group block h-full">
            <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur-sm">

                {/* Cover Image */}
                <div className="relative aspect-video overflow-hidden">
                    <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute top-3 left-3">
                        <Badge className={`${categoryInfo.color} ${categoryInfo.textColor} border-none shadow-sm`}>
                            {categoryInfo.label}
                        </Badge>
                    </div>
                </div>

                {/* Content */}
                <CardContent className="p-5 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CalendarDays className="w-3.5 h-3.5" />
                        <span>{new Date(item.date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>

                    <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {item.title}
                    </h3>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.excerpt}
                    </p>
                </CardContent>

                {/* Footer */}
                <CardFooter className="p-5 pt-0 mt-auto">
                    <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                        อ่านเพิ่มเติม <ArrowRight className="w-4 h-4" />
                    </span>
                </CardFooter>
            </Card>
        </Link>
    );
}
