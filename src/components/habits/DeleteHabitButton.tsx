'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';

interface DeleteHabitButtonProps {
    habitName: string;
    onConfirm: () => void;
}

export default function DeleteHabitButton({ habitName, onConfirm }: DeleteHabitButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const cancelButtonRef = useRef<HTMLButtonElement>(null);

    
    // Trap Focus and Handle Escape
    useEffect(() => {

        if (!isOpen) return;

        // Move focus to the safe option (Cancel) when modal opens
        const timeoutId = setTimeout(() => {
            cancelButtonRef.current?.focus();
        }, 10);

        const handleKeyDown = (e: KeyboardEvent) => {
            // Close on Escape
            if (e.key === 'Escape') {
                setIsOpen(false);
                return;
            }

            // Trap Focus logic
            if (e.key === 'Tab') {
                if (!modalRef.current) return;

                const focusableElements = modalRef.current.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                const firstElement = focusableElements[0] as HTMLElement;
                const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

                if (e.shiftKey) { // Shift + Tab
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else { // Tab
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            clearTimeout(timeoutId);
        };
    }, [isOpen]);

    const handleDelete = () => {
        onConfirm();
        setIsOpen(false);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                aria-label="Delete habit"
            >
                <Trash2 size={18} />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setIsOpen(false)}
                    />

                    <div
                        ref={modalRef}
                        role="alertdialog"
                        aria-modal="true"
                        className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 border border-slate-200 dark:border-slate-800 animate-in zoom-in duration-200"
                    >
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-orange-400 mb-4 mx-auto">
                            <AlertTriangle size={24} />
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 dark:text-white text-center mb-2">
                            Delete Habit?
                        </h3>

                        <p className="text-slate-500 dark:text-slate-400 text-center mb-6">
                            Are you sure you want to delete <span className="font-semibold text-slate-900 dark:text-slate-200">"{habitName}"</span>?
                        </p>

                        <div className="flex gap-3">
                            <button
                                ref={cancelButtonRef}
                                onClick={() => setIsOpen(false)}
                                className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors outline-none focus:ring-2 focus:ring-slate-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                data-testid="confirm-delete-button"
                                className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-all shadow-lg shadow-red-500/20 active:scale-95 outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}