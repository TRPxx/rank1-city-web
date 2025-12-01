import { Skeleton } from "@/components/ui/skeleton";

export default function HeroSkeleton() {
    return (
        <div className="relative w-full min-h-[80vh] flex items-center justify-center py-20">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Left Content Skeleton */}
                    <div className="flex flex-col gap-8 text-center lg:text-left items-center lg:items-start">
                        {/* Badges */}
                        <div className="flex gap-3">
                            <Skeleton className="h-8 w-32 rounded-full" />
                            <Skeleton className="h-8 w-40 rounded-full" />
                        </div>

                        {/* Heading */}
                        <div className="space-y-4 w-full flex flex-col items-center lg:items-start">
                            <Skeleton className="h-20 w-3/4 lg:w-full max-w-lg" />
                            <Skeleton className="h-20 w-1/2 lg:w-3/4 max-w-md" />
                            <Skeleton className="h-6 w-full max-w-xl mt-4" />
                            <Skeleton className="h-6 w-2/3 max-w-lg" />
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Skeleton className="h-14 w-40 rounded-full" />
                            <Skeleton className="h-14 w-40 rounded-full" />
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 pt-8 w-full max-w-md border-t border-muted mt-8">
                            <div className="flex flex-col gap-2 items-center lg:items-start">
                                <Skeleton className="h-6 w-16" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                            <div className="flex flex-col gap-2 items-center lg:items-start">
                                <Skeleton className="h-6 w-16" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                            <div className="flex flex-col gap-2 items-center lg:items-start">
                                <Skeleton className="h-6 w-16" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </div>
                    </div>

                    {/* Right Content Skeleton (Server Card) */}
                    <div className="flex justify-center lg:justify-end">
                        <Skeleton className="w-full max-w-md h-[400px] rounded-3xl" />
                    </div>

                </div>
            </div>
        </div>
    );
}
