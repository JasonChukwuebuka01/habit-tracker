'use client';

import React, { useState, useEffect, useRef } from 'react';
import { storage } from '@/lib/storage';
import { Habit } from '@/types/habits';
import { validateHabitName } from '@/lib/validators';

interface HabitFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    userId: string;
    initialData?: Habit;
    listRef?: React.RefObject<HTMLDivElement | null>;
}

export default function HabitForm({ isOpen, onClose, onSuccess, userId, initialData, listRef }: HabitFormProps) {
    const [name, setName] = useState(initialData?.name || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [error, setError] = useState<string | null>(null);

    const panelRef = useRef<HTMLDivElement>(null);

    // Accessibility & Focus Management
    useEffect(() => {
        if (!isOpen) return;

        setName(initialData?.name || '');
        setDescription(initialData?.description || '');

        if(name.length > 0 && name.length < 60) {
            setError(null);
            document.getElementById('habit-name')?.style.setProperty('border', 'none');
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'Tab') {
                const focusableElements = panelRef.current?.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                if (!focusableElements) return;

                const firstElement = focusableElements[0] as HTMLElement;
                const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

                if (e.shiftKey && document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        const timer = setTimeout(() => document.getElementById('habit-name')?.focus(), 300);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            clearTimeout(timer);
        };
    }, [isOpen, onClose, initialData]);



    

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const validation = validateHabitName(name);

        if (!validation.valid) {
            setError(validation.error);
            document.getElementById('habit-name')?.focus();
            document.getElementById('habit-name')?.style.setProperty('border', '2px solid #ef4444');
            return;
        }

        try {
            const habitData: Habit = {
                id: initialData?.id || crypto.randomUUID(),
                userId: userId,
                name: validation.value,
                description: description.trim(),
                frequency: 'daily',
                createdAt: initialData?.createdAt || new Date().toISOString(),
                completions: initialData?.completions || [],
            };

            storage.saveHabit(habitData);
            onSuccess();
            onClose();

            if (!initialData) {
                // Scroll the HabitList container (Desktop)
                if (listRef?.current) {
                    listRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                }
                // Scroll the window (Mobile)
                setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 100);
            }
        } catch (err) {
            setError('Failed to save habit.');
        }
    };

    const handleNameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
        setError(null);
    };

    return (
        <div
            className={`fixed inset-0 z-50 flex justify-start transition-all duration-500 ${isOpen ? 'visible' : 'invisible pointer-events-none'
                }`}
        >
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'
                    }`}
                onClick={onClose}
            />

            {/* Side Panel */}
            <div
                ref={panelRef}
                className={`relative w-full max-w-md h-full bg-white dark:bg-slate-900 shadow-2xl border-r border-slate-200 dark:border-slate-800 p-8 flex flex-col transform transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                data-testid="habit-form"
                role="dialog"
                aria-modal="true"
            >
                <header className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                        {initialData ? 'Edit Habit' : 'New Habit'}
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
                    <div className="space-y-2">
                        <label htmlFor="habit-name" className="text-sm font-bold text-slate-700 dark:text-slate-300">Name</label>
                        <input
                            id="habit-name"
                            data-testid="habit-name-input"
                            type="text"
                            value={name}
                            onChange={handleNameInputChange}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="habit-description" className="text-sm font-bold text-slate-700 dark:text-slate-300">Description</label>
                        <textarea
                            id="habit-description"
                            data-testid="habit-description-input"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 focus:ring-2 focus:ring-blue-600 outline-none transition-all min-h-[140px] resize-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="habit-frequency" className="text-sm font-bold text-slate-700 dark:text-slate-300">Frequency</label>
                        <select
                            id="habit-frequency"
                            data-testid="habit-frequency-select"
                            disabled
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 text-slate-500"
                        >
                            <option value="daily">Daily</option>
                        </select>
                    </div>

                    {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

                    <div className="mt-auto pt-6 flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 py-4 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-all">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            data-testid="habit-save-button"
                            className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-all"
                        >
                            {initialData ? 'Update' : 'Save'} Habit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}