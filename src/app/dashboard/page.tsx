'use client';

import React, { useState, useEffect, useCallback } from 'react';
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

    // 1. Load data from storage
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

    // Handle Deletion
    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this habit?')) {
            storage.deleteHabit(id);
            loadHabits();
        }
    };

    // 4. Handle Edit (Open form with existing data)
    const handleEdit = (habit: Habit) => {
        setSelectedHabit(habit);
        setIsFormOpen(true);
    };

    // 5. Handle Close Form (Reset selection)
    const handleCloseForm = () => {
        setIsFormOpen(false);
        setSelectedHabit(undefined);
    };

    const handleOpenForm = () => {
        setSelectedHabit(undefined); // Ensure no habit is selected for a fresh form
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
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">My Habits</h1>
                    <p className="text-slate-500 dark:text-slate-400">Small steps lead to big changes.</p>
                </div>

                {habits.length > 0 && (
                    <button
                        onClick={handleOpenForm}
                        className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95"
                    >
                        <span>+</span> New Habit
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
                        className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95"
                    >
                        Create Your First Habit
                    </button>
                </section>
            ) : (
                /* Updated to use HabitList */
                <HabitList
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
                    className="md:hidden fixed bottom-6 right-8 w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center text-2xl font-bold active:scale-90 transition-transform z-40"
                    aria-label="Add Habit"
                >
                    +
                </button>
            )}

            {/* Habit Form Slide-over */}
            {userId && (
                <HabitForm
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