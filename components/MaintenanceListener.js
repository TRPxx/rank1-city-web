'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function MaintenanceListener() {
    const router = useRouter();
    const { data: session } = useSession();
    const isAdmin = session?.user?.isAdmin;

    useEffect(() => {
        // If user is admin, no need to check for maintenance
        if (isAdmin) return;

        const checkStatus = async () => {
            try {
                // Add timestamp to prevent caching
                const res = await fetch(`/api/system/config?t=${Date.now()}`);
                const data = await res.json();

                if (data.serverStatus === 'maintenance') {
                    window.location.reload();
                }
            } catch (error) {
                console.error('Failed to check server status', error);
            }
        };

        // Check every 5 seconds
        const interval = setInterval(checkStatus, 5000);

        return () => clearInterval(interval);
    }, [isAdmin, router]);

    return null; // This component renders nothing
}
