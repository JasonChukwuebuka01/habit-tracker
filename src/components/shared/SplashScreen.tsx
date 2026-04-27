'use client';

import React from 'react';
import { APP_NAME } from '@/lib/constants';

export default function SplashScreen() {
    return (
        <main
            className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-slate-950"
            data-testid="splash-screen"
        >
            <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-700">
                {/* Semantic Heading for Accessibility */}
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {APP_NAME}
                </h1>

                {/* Subtle decorative element to make it feel "designed" */}
                <div className="h-1 w-12 rounded-full bg-blue-600 animate-pulse" />
            </div>
        </main>
    );
}