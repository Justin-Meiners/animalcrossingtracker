import { createContext, useContext, useState, type ReactNode } from 'react';

type Hemisphere = 'northern' | 'southern';

const STORAGE_KEY = 'critter-tracker-hemisphere';

function loadHemisphere(): Hemisphere {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'northern' || saved === 'southern') return saved;
    return 'northern';
}

interface HemisphereContextValue {
    hemisphere: Hemisphere;
    toggleHemisphere: () => void;
}

const HemisphereContext = createContext<HemisphereContextValue | null>(null);

export function HemisphereProvider({ children }: { children: ReactNode }) {
    const [hemisphere, setHemisphere] = useState<Hemisphere>(loadHemisphere);

    const toggleHemisphere = () => {
        setHemisphere(prev => {
            const next = prev === 'northern' ? 'southern' : 'northern';
            localStorage.setItem(STORAGE_KEY, next);
            return next;
        });
    };

    return (
        <HemisphereContext.Provider value={{ hemisphere, toggleHemisphere }}>
            {children}
        </HemisphereContext.Provider>
    );
}

export function useHemisphere() {
    const ctx = useContext(HemisphereContext);
    if (!ctx) throw new Error('useHemisphere must be used inside HemisphereProvider');
    return ctx;
}
