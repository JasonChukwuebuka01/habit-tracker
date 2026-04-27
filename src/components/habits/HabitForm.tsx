'use client';

import React, { useState, useEffect, useRef } from 'react';
import { storage } from '@/lib/storage';
import { Habit } from '@/types/habits';

interface HabitFormProps {
    onClose: () => void;
    onSuccess: () => void;
    userId: string;
    initialData?: Habit;
}

export default function HabitForm({ onClose, onSuccess, userId, initialData }: HabitFormProps) {
    const [name, setName] = useState(initialData?.name || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [error, setError] = useState<string | null>(null);

    const panelRef = useRef<HTMLDivElement>(null);


    // Accessibility: Escape Key & Focus Trap
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {

            if (e.key === 'Escape') onClose();

            if (e.key === 'Tab') {
                const focusableElements = panelRef.current?.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                if (!focusableElements) return;

                const firstElement = focusableElements[0] as HTMLElement;
                const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            };      
        };

        document.addEventListener('keydown', handleKeyDown);
        // Focus the first input automatically when opened
        const timer = setTimeout(() => {
            const firstInput = document.getElementById('habit-name');
            firstInput?.focus();
        }, 100);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            clearTimeout(timer);
        };
    }, [onClose]);




    const handleSubmit = (e: React.FormEvent) => {
        
        e.preventDefault();
        setError(null);

        if (!name.trim()) {
            setError('Habit name is required');
            return;
        }

        try {
            const habitData: Habit = {
                id: initialData?.id || crypto.randomUUID(),
                userId: userId,
                name: name.trim(),
                description: description.trim(),
                frequency: 'daily',
                createdAt: initialData?.createdAt || new Date().toISOString(),
                completions: initialData?.completions || [],
            };

            storage.saveHabit(habitData);
            onSuccess();
            onClose();
        } catch (err) {
            setError('Failed to save habit.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Side Panel */}
            <div
                ref={panelRef}
                className="relative w-full max-w-md h-full bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 p-8 flex flex-col animate-in slide-in-from-right duration-300"
                data-testid="habit-form"
                role="dialog"
                aria-modal="true"
                aria-labelledby="form-title"
            >
                <header className="flex justify-between items-center mb-8">
                    <h2 id="form-title" className="text-2xl font-bold text-slate-900 dark:text-white">
                        {initialData ? 'Edit Habit' : 'Create Habit'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        aria-label="Close panel"
                    >
                        ✕
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-6">
                    <div className="space-y-1.5">
                        <label htmlFor="habit-name" className="text-sm font-bold text-slate-700 dark:text-slate-300">
                            Name
                        </label>
                        <input
                            id="habit-name"
                            data-testid="habit-name-input"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Drink 2L Water"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="habit-description" className="text-sm font-bold text-slate-700 dark:text-slate-300">
                            Description
                        </label>
                        <textarea
                            id="habit-description"
                            data-testid="habit-description-input"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Why is this important?"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 focus:ring-2 focus:ring-blue-600 outline-none transition-all min-h-[120px]"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="habit-frequency" className="text-sm font-bold text-slate-700 dark:text-slate-300">
                            Frequency
                        </label>
                        <select
                            id="habit-frequency"
                            data-testid="habit-frequency-select"
                            disabled
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 cursor-not-allowed text-slate-500"
                        >
                            <option value="daily">Daily</option>
                        </select>
                    </div>

                    {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

                    <div className="mt-auto pt-6 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 rounded-xl font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            data-testid="habit-save-button"
                            className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                        >
                            {initialData ? 'Update' : 'Save'} Habit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}