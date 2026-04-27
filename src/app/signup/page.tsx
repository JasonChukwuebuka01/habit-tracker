import Link from 'next/link';
import SignupForm from '@/components/auth/SignupForm';
import { APP_NAME } from '@/lib/constants';

export default function SignupPage() {
    
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6">
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