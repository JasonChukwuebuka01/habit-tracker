'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/lib/auth';

export default function SignupForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        // Basic validation before calling the lib
        if (!email || !password) {
            setError('Email and password are required');
            setLoading(false);
            return;
        }

        const result = registerUser(email, password);

        if (result.success) {
            router.push('/dashboard');
        } else {
            setError(result.error || 'Something went wrong');
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
            <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    data-testid="auth-signup-email"
                    className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                />
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    data-testid="auth-signup-password"
                    className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                />
            </div>

            {
                error && (
                    <p className="text-red-500 text-sm font-medium" role="alert">
                        {error}
                    </p>
                )
            }

            <button
                type="submit"
                disabled={loading}
                data-testid="auth-signup-submit"
                className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
            >
                {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
        </form>
    );
}