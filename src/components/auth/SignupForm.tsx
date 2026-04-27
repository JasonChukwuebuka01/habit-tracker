'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/lib/auth';

export default function SignupForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        const result = registerUser(email, password);

        if (result.success) {
            router.push('/dashboard');
        } else {
            setError(result.error || 'Failed to create account');
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSignup} className="flex flex-col gap-5 w-full">
            <div className="flex flex-col gap-2">
                <label htmlFor="signup-email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Email Address
                </label>
                <input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    data-testid="auth-signup-email"
                    placeholder="name@example.com"
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                    required
                />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="signup-password" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Create Password
                </label>
                <input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    data-testid="auth-signup-password"
                    placeholder="••••••••"
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                    required
                />
            </div>

            {error && (
                <div
                    role="alert"
                    className="p-3 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800"
                >
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                data-testid="auth-signup-submit"
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
        </form>
    );
}