'use client';

import React from 'react';
import { APP_NAME } from '@/lib/constants';


export default function SplashScreen() {
    
    return (
        <main
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-500"
            data-testid="splash-screen"
        >
            <div className="flex flex-col items-center gap-6">
                {/* Logo/Title Section with a "Float" and "Fade" animation */}
                <div className="relative">
                    <h1 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white animate-bounce-subtle">
                        {APP_NAME}
                    </h1>
                    {/* A small decorative dot to make it look like a branded logo */}
                    <span className="absolute -top-1 -right-4 h-3 w-3 rounded-full bg-blue-600 animate-ping" />
                </div>

                {/* The Progress Bar Container */}
                <div className="w-48 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    {/* The Actual Loading Filler */}
                    <div
                        className="h-full bg-blue-600 rounded-full animate-progress-grow"
                        style={{ width: '0%' }}
                    />
                </div>

                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 tracking-widest uppercase animate-pulse">
                    Loading your streaks...
                </p>
            </div>


            {/* Manual Keyframes for the custom animations */}
            <style jsx>{`
        @keyframes progress-grow {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-progress-grow {
          animation: progress-grow 1.5s ease-in-out forwards;
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }
      `}</style>
        </main>
    );
}