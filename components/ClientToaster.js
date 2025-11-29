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
            duration={10000}
            toastOptions={{
                style: {
                    marginTop: '50px',
                },
                className: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg font-sans",
                descriptionClassName: "group-[.toast]:text-muted-foreground",
            }}
        />
    );
}
