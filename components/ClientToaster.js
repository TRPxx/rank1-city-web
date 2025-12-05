'use client';

import { useTheme } from "next-themes";
import { Toaster } from "sonner";

export default function ClientToaster() {
    const { theme = "system" } = useTheme();

    return (
        <Toaster
            theme={theme}
            position="top-right"
            richColors
            closeButton
            duration={3000}
            toastOptions={{
                style: {
                    marginTop: '50px',
                },
                classNames: {
                    toast: "group toast group-[.toaster]:bg-background/90 group-[.toaster]:backdrop-blur-xl group-[.toaster]:text-foreground group-[.toaster]:border-border/40 group-[.toaster]:shadow-2xl group-[.toaster]:rounded-[1.5rem] font-sans",
                    description: "group-[.toast]:text-muted-foreground",
                    actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
                    cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
                },
            }}
        />
    );
}
