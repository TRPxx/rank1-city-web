"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("relative overflow-hidden", className)}
        {...props}
    >
        <div className="h-full w-full overflow-y-auto overflow-x-hidden">
            {children}
        </div>
    </div>
))
ScrollArea.displayName = "ScrollArea"

const ScrollBar = React.forwardRef(({ className, orientation = "vertical", ...props }, ref) => (
    // Simplified: Native scrollbar styling is usually sufficient or handled by global CSS
    // This component is kept for API compatibility with Shadcn UI usage
    <div className="hidden" />
))
ScrollBar.displayName = "ScrollBar"

export { ScrollArea, ScrollBar }
