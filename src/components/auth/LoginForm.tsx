'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/lib/auth';


export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        const result = loginUser(email, password);

        if (result.success) {
            router.push('/dashboard');
        } else {
            setError(result.error || 'Invalid email or password');
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleLogin} className="flex flex-col gap-5 w-full">
            <div className="flex flex-col gap-2">
                <label htmlFor="login-email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Email Address
                </label>
                <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    data-testid="auth-login-email"
                    placeholder="name@example.com"
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                    required
                />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="login-password" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Password
                </label>
                <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    data-testid="auth-login-password"
                    placeholder="••••••••"
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                    required
                />
            </div>

            {
                error && (
                    <div
                        role="alert"
                        className="p-3 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800"
                    >
                        {error}
                    </div>
                )
            }

            <button
                type="submit"
                disabled={isSubmitting}
                data-testid="auth-login-submit"
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isSubmitting ? 'Logging in...' : 'Sign In'}
            </button>
        </form>
    );
}