'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SignupForm from '@/components/auth/SignupForm';
import SplashScreen from '@/components/shared/SplashScreen';
import { APP_NAME } from '@/lib/constants';
import { storage } from '@/lib/storage';

export default function SignupPage() {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Determine if the user is already authenticated
        const session = storage.getSession();

        if (session) {
            // Direct redirect to dashboard; 'replace' removes signup from history
            router.replace('/dashboard');
        } else {
            // No session, allow the user to see the signup form
            setIsChecking(false);
        }
    }, [router]);

    // Prevent "Flash of Unstyled Form" by showing the splash during the check
    if (isChecking) {
        return <SplashScreen />;
    }

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
            <div className="w-full max-w-[400px] bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-800">
                <header className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
                        Join {APP_NAME}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        Start building your streaks today.
                    </p>
                </header>

                <SignupForm />

                <footer className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
                    Already have an account?{' '}
                    <Link
                        href="/login"
                        className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors"
                    >
                        Log in here
                    </Link>
                </footer>
            </div>
        </main>
    );
}