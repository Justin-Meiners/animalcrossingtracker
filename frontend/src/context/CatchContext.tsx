import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { useAuth } from '../auth/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;
const ANON_KEY = 'critter-tracker-catches';

function storageKey(username: string | null): string {
    return username ? `critter-tracker-catches-${username}` : ANON_KEY;
}

function loadFromStorage(username: string | null): Set<string> {
    try {
        const raw = localStorage.getItem(storageKey(username));
        return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
        return new Set();
    }
}

function saveToStorage(username: string | null, catches: Set<string>) {
    localStorage.setItem(storageKey(username), JSON.stringify([...catches]));
}

interface CatchContextValue {
    isCaught: (type: 'fish' | 'bug', id: number) => boolean;
    toggleCaught: (type: 'fish' | 'bug', id: number) => void;
}

const CatchContext = createContext<CatchContextValue | null>(null);

export function CatchProvider({ children }: { children: ReactNode }) {
    const { username } = useAuth();
    const [catches, setCatches] = useState<Set<string>>(() => loadFromStorage(null));

    // When user changes (login/logout), load their catches
    useEffect(() => {
        const userCatches = loadFromStorage(username);

        if (username) {
            // Merge anonymous catches into this user's catches
            const anonCatches = loadFromStorage(null);
            if (anonCatches.size > 0) {
                const merged = new Set([...userCatches, ...anonCatches]);
                saveToStorage(username, merged);
                localStorage.removeItem(ANON_KEY);
                setCatches(merged);

                // Sync the newly merged anon catches up to the API
                if (API_URL) {
                    getToken().then(token => {
                        if (!token) return;
                        anonCatches.forEach(key => {
                            fetch(`${API_URL}/catches/${key}`, {
                                method: 'PUT',
                                headers: { Authorization: token },
                            }).catch(() => {});
                        });
                    });
                }
            } else {
                setCatches(userCatches);
            }

            // Also try to fetch from API and merge
            getToken().then(token => {
                if (!token || !API_URL) return;
                fetch(`${API_URL}/catches`, {
                    headers: { Authorization: token },
                })
                    .then(res => res.ok ? res.json() : [])
                    .then((keys: string[]) => {
                        if (keys.length === 0) return;
                        setCatches(prev => {
                            const merged = new Set([...prev, ...keys]);
                            saveToStorage(username, merged);
                            return merged;
                        });
                    })
                    .catch(() => {});
            });
        } else {
            setCatches(userCatches);
        }
    }, [username]);

    const isCaught = useCallback(
        (type: 'fish' | 'bug', id: number) => catches.has(`${type}-${id}`),
        [catches]
    );

    const toggleCaught = useCallback(
        (type: 'fish' | 'bug', id: number) => {
            const key = `${type}-${id}`;
            const nowCaught = !catches.has(key);

            setCatches(prev => {
                const next = new Set(prev);
                if (nowCaught) next.add(key);
                else next.delete(key);
                saveToStorage(username, next);
                return next;
            });

            // Fire-and-forget API sync
            if (username && API_URL) {
                getToken().then(token => {
                    if (!token) return;
                    fetch(`${API_URL}/catches/${key}`, {
                        method: nowCaught ? 'PUT' : 'DELETE',
                        headers: { Authorization: token },
                    }).catch(() => {});
                });
            }
        },
        [catches, username]
    );

    return (
        <CatchContext.Provider value={{ isCaught, toggleCaught }}>
            {children}
        </CatchContext.Provider>
    );
}

async function getToken(): Promise<string | undefined> {
    try {
        const { fetchAuthSession } = await import('aws-amplify/auth');
        const session = await fetchAuthSession();
        return session.tokens?.idToken?.toString();
    } catch {
        return undefined;
    }
}

export function useCatches() {
    const ctx = useContext(CatchContext);
    if (!ctx) throw new Error('useCatches must be used inside CatchProvider');
    return ctx;
}