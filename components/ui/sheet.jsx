"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const SheetContext = React.createContext({})

const Sheet = ({ children }) => {
    const [open, setOpen] = React.useState(false)
    return (
        <SheetContext.Provider value={{ open, setOpen }}>
            {children}
        </SheetContext.Provider>
    )
}

const SheetTrigger = ({ asChild, children, ...props }) => {
    const { setOpen } = React.useContext(SheetContext)
    const Comp = asChild ? React.Slot : "button" // Simplified: React.Slot needs separate install, fallback to div logic if needed

    // Quick fix for asChild without Slot: just clone element
    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children, {
            onClick: (e) => {
                children.props.onClick?.(e)
                setOpen(true)
            }
        })
    }

    return (
        <button onClick={() => setOpen(true)} {...props}>
            {children}
        </button>
    )
}

const SheetContent = ({ side = "right", className, children, ...props }) => {
    const { open, setOpen } = React.useContext(SheetContext)

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex">
            <div
                className="fixed inset-0 bg-black/80"
                onClick={() => setOpen(false)}
            />
            <div
                className={cn(
                    "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out duration-300",
                    side === "left" && "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
                    side === "right" && "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
                    className
                )}
                {...props}
            >
                <button
                    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-secondary"
                    onClick={() => setOpen(false)}
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </button>
                {children}
            </div>
        </div>
    )
}

const SheetHeader = ({ className, ...props }) => (
    <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
)

const SheetFooter = ({ className, ...props }) => (
    <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
)

const SheetTitle = ({ className, ...props }) => (
    <h3 className={cn("text-lg font-semibold text-foreground", className)} {...props} />
)

const SheetDescription = ({ className, ...props }) => (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
)

export {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetFooter,
    SheetTitle,
    SheetDescription,
}
