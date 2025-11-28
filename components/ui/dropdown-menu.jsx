"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Check, ChevronRight, Circle } from "lucide-react"

const DropdownMenuContext = React.createContext({})

const DropdownMenu = ({ children }) => {
    const [open, setOpen] = React.useState(false)
    const containerRef = React.useRef(null)

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <DropdownMenuContext.Provider value={{ open, setOpen }}>
            <div className="relative inline-block text-left" ref={containerRef}>
                {children}
            </div>
        </DropdownMenuContext.Provider>
    )
}

const DropdownMenuTrigger = ({ asChild, children, ...props }) => {
    const { open, setOpen } = React.useContext(DropdownMenuContext)

    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children, {
            onClick: (e) => {
                children.props.onClick?.(e)
                setOpen(!open)
            }
        })
    }

    return (
        <button onClick={() => setOpen(!open)} {...props}>
            {children}
        </button>
    )
}

const DropdownMenuContent = ({ className, align = "center", children, ...props }) => {
    const { open } = React.useContext(DropdownMenuContext)

    if (!open) return null

    return (
        <div
            className={cn(
                "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80 zoom-in-95",
                align === "end" ? "right-0" : "left-0",
                "mt-2",
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}

const DropdownMenuItem = ({ className, inset, children, onClick, ...props }) => {
    const { setOpen } = React.useContext(DropdownMenuContext)

    return (
        <div
            className={cn(
                "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer",
                inset && "pl-8",
                className
            )}
            onClick={(e) => {
                onClick?.(e)
                setOpen(false)
            }}
            {...props}
        >
            {children}
        </div>
    )
}

const DropdownMenuLabel = ({ className, inset, ...props }) => (
    <div
        className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
        {...props}
    />
)

const DropdownMenuSeparator = ({ className, ...props }) => (
    <div className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
)

// Simplified exports for unused components to prevent import errors
const DropdownMenuGroup = ({ children }) => <>{children}</>
const DropdownMenuPortal = ({ children }) => <>{children}</>
const DropdownMenuSub = ({ children }) => <>{children}</>
const DropdownMenuRadioGroup = ({ children }) => <>{children}</>
const DropdownMenuSubTrigger = ({ children }) => <div>{children}</div>
const DropdownMenuSubContent = ({ children }) => <div>{children}</div>
const DropdownMenuCheckboxItem = ({ children }) => <div>{children}</div>
const DropdownMenuRadioItem = ({ children }) => <div>{children}</div>
const DropdownMenuShortcut = ({ className, ...props }) => (
    <span className={cn("ml-auto text-xs tracking-widest opacity-60", className)} {...props} />
)

export {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuGroup,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuRadioGroup,
}
