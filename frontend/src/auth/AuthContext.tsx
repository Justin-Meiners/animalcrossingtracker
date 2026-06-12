import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Amplify } from 'aws-amplify';
import { signIn, signUp, confirmSignUp, signOut, getCurrentUser } from 'aws-amplify/auth';

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: import.meta.env.VITE_USER_POOL_ID,
            userPoolClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID,
        },
    },
});

interface AuthState {
    username: string | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    confirm: (username: string, code: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [username, setUsername] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCurrentUser()
            .then(u => setUsername(u.username))
            .catch(() => setUsername(null))
            .finally(() => setLoading(false));
    }, []);

    const login = async (user: string, password: string) => {
        await signIn({ username: user, password });
        const u = await getCurrentUser();
        setUsername(u.username);
    };

    const register = async (user: string, email: string, password: string) => {
        await signUp({ username: user, password, options: { userAttributes: { email } } });
    };

    const confirm = async (user: string, code: string) => {
        await confirmSignUp({ username: user, confirmationCode: code });
    };

    const logout = async () => {
        await signOut();
        setUsername(null);
    };

    return (
        <AuthContext.Provider value={{ username, loading, login, register, confirm, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
}