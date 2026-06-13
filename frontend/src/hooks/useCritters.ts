import { useEffect, useState } from 'react';
import type { Critter } from '../types/Critter';
import { fetchCritters } from '../api/Critters';

export function useCritters(type: 'fish' | 'bug' | 'sea') {
    const [critters, setCritters] = useState<Critter[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);

        fetchCritters(type)
            .then(data => {
                if (cancelled) return;
                data.sort((a, b) => a.name.localeCompare(b.name));
                setCritters(data);
            })
            .catch(err => {
                if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => { cancelled = true; };
    }, [type]);

    return { critters, loading, error };
}