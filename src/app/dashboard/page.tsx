'use client';

import React, { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import { Habit } from '@/types/habits';

export default function DashboardPage() {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        const session = storage.getSession();

        if (session) {
            const savedHabits = storage.getHabits(session.userId);
            setHabits(savedHabits);
        }

        setIsLoading(false);
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                    My Habits
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                    Small steps lead to big changes.
                </p>
            </div>

            {
                habits.length === 0 ? (
                    <section
                        className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900/50"
                        data-testid="empty-state"
                    >
                        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                            <span className="text-2xl">🌱</span>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">No habits yet</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-center max-w-sm mt-2 mb-6">
                            You haven&apos;t started any streaks. Create your first habit to begin your journey.
                        </p>
                        <button
                            data-testid="add-habit-button"
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95"
                        >
                            Create Your First Habit
                        </button>
                    </section>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {habits.map((habit) => (
                            <div key={habit.id} className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                                <h3 className="font-bold">{habit.name}</h3>
                            </div>
                        ))}
                    </div>
                )
            }
        </div>
    );
}