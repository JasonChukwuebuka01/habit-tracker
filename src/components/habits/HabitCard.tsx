'use client';

import React from 'react';
import { Habit } from '@/types/habits';
import { toggleHabitCompletion } from '@/lib/habits';
import { calculateCurrentStreak } from '@/lib/streaks';
import { getHabitSlug } from '@/lib/slug';
import { Check, Edit2, Trash2, Flame } from 'lucide-react';

interface HabitCardProps {
    habit: Habit;
    onEdit: (habit: Habit) => void;
    onDelete: (id: string) => void;
    onUpdate: (updatedHabit: Habit) => void;
};

export default function HabitCard({ habit, onEdit, onDelete, onUpdate }: HabitCardProps) {
    const today = new Date().toISOString().split('T')[0];
    const slug = getHabitSlug(habit.name);
    const isCompletedToday = habit.completions.includes(today);
    const streakCount = calculateCurrentStreak(habit.completions, today);

    const handleToggle = () => {
        const updatedHabit = toggleHabitCompletion(habit, today);
        onUpdate(updatedHabit);
    };

    return (
        <div
            data-testid={`habit-card-${slug}`}
            className={`group relative p-5 md:p-6 rounded-2xl border transition-all duration-500 ease-in-out ${
                isCompletedToday
                    ? 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 shadow-sm'
            }`}
        >
            <div className="flex justify-between items-start gap-3 md:gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3
                            className="font-bold text-base md:text-lg text-slate-900 dark:text-white leading-tight truncate"
                            title={habit.name} 
                        >
                            {habit.name}
                        </h3>

                        {streakCount > 0 && (
                            <div
                                data-testid={`habit-streak-${slug}`}
                                className="flex-shrink-0 flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-[10px] md:text-xs font-bold animate-in zoom-in duration-300"
                            >
                                <Flame size={10} fill="currentColor" className="animate-bounce md:w-3 md:h-3" />
                                {streakCount}
                            </div>
                        )}
                    </div>
                    <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 line-clamp-2 break-words">
                        {habit.description}
                    </p>
                </div>

                <button
                    onClick={handleToggle}
                    data-testid={`habit-complete-${slug}`}
                    className={`flex-shrink-0 w-11 h-11 md:w-12 md:h-12 rounded-xl border-2 flex items-center justify-center transition-all active:scale-90 ${
                        isCompletedToday
                            ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30'
                            : 'border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-600 hover:border-blue-400'
                    }`}
                    aria-label={isCompletedToday ? "Unmark habit" : "Complete habit"}
                >
                    <Check size={20} strokeWidth={3} className={`md:w-6 md:h-6 transition-transform duration-300 ${isCompletedToday ? 'scale-110' : 'scale-75'}`} />
                </button>
            </div>

            {/* ADJUSTED: Always visible on mobile, hover only on desktop */}
            <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {habit.frequency}
                </span>

                <div className="flex gap-1 md:gap-2">
                    <button
                        onClick={() => onEdit(habit)}
                        data-testid={`habit-edit-${slug}`}
                        className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                        aria-label="Edit habit"
                    >
                        <Edit2 size={16} className="md:w-[18px] md:h-[18px]" />
                    </button>
                    <button
                        onClick={() => onDelete(habit.id)}
                        data-testid={`habit-delete-${slug}`}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                        aria-label="Delete habit"
                    >
                        <Trash2 size={16} className="md:w-[18px] md:h-[18px]" />
                    </button>
                </div>
            </div>
        </div>
    );
}