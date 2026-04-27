'use client';

import React from 'react';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { useRouter } from 'next/navigation';
import { storage } from '@/lib/storage';
import { APP_NAME } from '@/lib/constants';



export default function DashboardLayout({ children }: { children: React.ReactNode }) {

    const router = useRouter();



    const handleLogout = () => {
        storage.clearSession();
        router.replace('/login');
    };



    

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
                {/* Navigation Header - Consistent across the dashboard */}
                <header className="sticky top-0 z-40 w-full border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-slate-200 dark:border-slate-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            {APP_NAME}
                        </h2>

                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
                        >
                            Log out
                        </button>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </main>
            </div>
        </ProtectedRoute>
    );
}