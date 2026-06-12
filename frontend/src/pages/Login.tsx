import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import '../styles/Login.css';

type Mode = 'login' | 'signup' | 'confirm';

function Login() {
    const { login, register, confirm } = useAuth();
    const navigate = useNavigate();
    const [mode, setMode] = useState<Mode>('login');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            if (mode === 'login') {
                await login(username, password);
                navigate('/');
            } else if (mode === 'signup') {
                await register(username, email, password);
                setMode('confirm');
            } else {
                await confirm(username, code);
                await login(username, password);
                navigate('/');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        }
    };

    return (
        <div className="login-wrap">
            <form className="login-card" onSubmit={handleSubmit}>
                <h1 className="login-title">
                    {mode === 'login' ? 'Welcome back!' : mode === 'signup' ? 'Join the island' : 'Check your email'}
                </h1>

                {mode !== 'confirm' && (
                    <>
                        <label className="login-label">Username</label>
                        <input className="login-input" value={username}
                            onChange={e => setUsername(e.target.value)} required />
                        {mode === 'signup' && (
                            <>
                                <label className="login-label">Email</label>
                                <input className="login-input" type="email" value={email}
                                    onChange={e => setEmail(e.target.value)} required />
                            </>
                        )}
                        <label className="login-label">Password</label>
                        <input className="login-input" type="password" value={password}
                            onChange={e => setPassword(e.target.value)} required />
                    </>
                )}

                {mode === 'confirm' && (
                    <>
                        <p className="login-hint">We sent a confirmation code to your email.</p>
                        <label className="login-label">Confirmation code</label>
                        <input className="login-input" value={code}
                            onChange={e => setCode(e.target.value)} required />
                    </>
                )}

                {error && <p className="login-error">{error}</p>}

                <button type="submit" className="login-submit">
                    {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Sign Up' : 'Confirm'}
                </button>

                {mode !== 'confirm' && (
                    <button type="button" className="login-switch"
                        onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
                        {mode === 'login' ? "New here? Create an account" : 'Already have an account? Sign in'}
                    </button>
                )}
            </form>
        </div>
    );
}

export default Login;