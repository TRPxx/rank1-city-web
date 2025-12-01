"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef(({ className, checked, onCheckedChange, ...props }, ref) => {
    return (
        <button
            type="button"
            role="checkbox"
            aria-checked={checked}
            ref={ref}
            onClick={() => onCheckedChange?.(!checked)}
            className={cn(
                "peer h-5 w-5 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground transition-all",
                checked ? "bg-primary text-primary-foreground" : "bg-transparent",
                className
            )}
            {...props}
        >
            <div className={cn("flex items-center justify-center text-current", checked ? "opacity-100" : "opacity-0")}>
                <Check className="h-3.5 w-3.5 stroke-[3]" />
            </div>
        </button>
    )
})
Checkbox.displayName = "Checkbox"

export { Checkbox }
