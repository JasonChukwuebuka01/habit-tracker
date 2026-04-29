'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { storage } from '@/lib/storage';
import { Habit } from '@/types/habits';
import HabitForm from '@/components/habits/HabitForm';
import HabitList from '@/components/habits/HabitList'; // Imported HabitList

export default function DashboardPage() {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedHabit, setSelectedHabit] = useState<Habit | undefined>(undefined);
    const [userId, setUserId] = useState<string | null>(null);
    const listRef = useRef<HTMLDivElement>(null);



    // Load data from storage
    const loadHabits = useCallback(() => {
        const session = storage.getSession();
        if (session) {
            setUserId(session.userId);
            const savedHabits = storage.getHabits(session.userId);
            setHabits(savedHabits);
        }
        setIsLoading(false);
    }, []);



    useEffect(() => {
        loadHabits();
    }, [loadHabits]);

    // 2. Handle Completion Toggle (The Handshake)
    const handleToggleComplete = (updatedHabit: Habit) => {
        storage.saveHabit(updatedHabit); // Save the new version to LocalStorage
        loadHabits(); // Refresh the UI
    };




    const handleDelete = (id: string) => {
        storage.deleteHabit(id);
        loadHabits();
    };



    const handleEdit = (habit: Habit) => {
        setSelectedHabit(habit);
        setIsFormOpen(true);
    };



    const handleCloseForm = () => {
        setIsFormOpen(false);
        setSelectedHabit(undefined);
    };



    const handleOpenForm = () => {
        setSelectedHabit(undefined);
        setIsFormOpen(true);
    };


    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div
            data-testid="dashboard-page"
            className="relative min-h-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700"
        >
            {/* Header Section */}
            <header className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            My Habits
                        </h1>
                        {/* Total Habits Badge */}
                        {habits.length > 0 && (
                            <span className="flex items-center justify-center px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-bold border border-slate-200 dark:border-slate-700 animate-in zoom-in duration-300">
                                {habits.length}
                            </span>
                        )}
                    </div>
                    <p className="text-slate-500 dark:text-slate-400">
                        {habits.length === 0
                            ? "Ready to start a new journey?"
                            : "Small steps lead to big changes."
                        }
                    </p>
                </div>

                {habits.length > 0 && (
                    <button
                        onClick={handleOpenForm}
                        data-testid="open-habit-form"
                        className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95"
                    >
                        <span className="text-xl">+</span> New Habit
                    </button>
                )}
            </header>

            {/* Main Content */}
            {habits.length === 0 ? (
                <section data-testid="empty-state" className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900/50">
                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl">🌱</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">No habits yet</h2>
                    <button
                        onClick={handleOpenForm}
                        data-testid="open-habit-form"
                        className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95"
                    >
                        Create Your First Habit
                    </button>
                </section>
            ) : (
                <HabitList
                    ref={listRef}
                    habits={habits}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onUpdate={handleToggleComplete}
                />
            )}

            {/* Mobile Floating Action Button */}
            {habits.length > 0 && (
                <button
                    onClick={handleOpenForm}
                    className="md:hidden fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full flex items-center justify-center text-3xl font-light
                          z-40 transition-all duration-300 shadow-[0_8px_30px_rgb(37,99,235,0.4)] 
        hover:shadow-[0_8px_40px_rgb(37,99,235,0.6)] active:scale-90 hover:-translate-y-1 animate-in zoom-in slide-in-from-bottom-10 duration-500"
                    aria-label="Add Habit"
                >
                    {/* Pulsing ring effect */}
                    <span className="absolute inset-0  rounded-full bg-blue-400 animate-ping opacity-20" />

                    <span className="relative">+</span>
                </button>
            )}

            {/* Habit Form Slide-over */}
            {userId && (
                <HabitForm
                    listRef={listRef}
                    isOpen={isFormOpen}
                    userId={userId}
                    initialData={selectedHabit}
                    onClose={handleCloseForm}
                    onSuccess={loadHabits}
                />
            )}
        </div>
    );
}