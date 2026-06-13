import type { Critter } from '../types/Critter';

const API_URL = import.meta.env.VITE_API_URL;

export async function fetchCritters(type: 'fish' | 'bug' | 'sea'): Promise<Critter[]> {
    const cacheKey = `critters-${type}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached) as Critter[];

    const res = await fetch(`${API_URL}/critters/${type}`);
    if (!res.ok) {
        throw new Error(`Failed to load ${type} (${res.status})`);
    }
    const data: Critter[] = await res.json();
    sessionStorage.setItem(cacheKey, JSON.stringify(data));
    return data;
}