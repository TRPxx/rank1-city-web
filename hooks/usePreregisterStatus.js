import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export function usePreregisterStatus() {
    const { data: session } = useSession();
    const [isRegistered, setIsRegistered] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [totalRegistrations, setTotalRegistrations] = useState(0);

    const [trigger, setTrigger] = useState(0);

    const refetch = () => setTrigger(prev => prev + 1);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchStatus = async () => {
            if (session) {
                try {
                    const res = await fetch('/api/preregister', { signal });
                    const data = await res.json();
                    if (data.isRegistered) setIsRegistered(true);
                } catch (error) {
                    if (error.name !== 'AbortError') {
                        console.error("Failed to fetch user status", error);
                    }
                }
            }

            try {
                const res = await fetch('/api/preregister/stats', { signal });
                const data = await res.json();
                if (data.total) setTotalRegistrations(data.total);
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error("Failed to fetch global stats", error);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchStatus();

        return () => controller.abort();
    }, [session, trigger]);

    return { isRegistered, isLoading, totalRegistrations, refetch };
}
