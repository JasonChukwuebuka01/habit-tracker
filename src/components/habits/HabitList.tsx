'use client';

import React, { forwardRef } from 'react';
import { Habit } from '@/types/habits';
import HabitCard from './HabitCard';

interface HabitListProps {
    habits: Habit[];
    onEdit: (habit: Habit) => void;
    onDelete: (id: string) => void;
    onUpdate: (updatedHabit: Habit) => void;
}

// We wrap the component in forwardRef to allow the parent to scroll this specific div
const HabitList = forwardRef<HTMLDivElement, HabitListProps>(
    ({ habits, onEdit, onDelete, onUpdate }, ref) => {
        return (
            <div
                ref={ref}
                data-testid="habit-list"
                className="
                    grid gap-6 md:grid-cols-2 lg:grid-cols-3 
                    animate-in fade-in duration-500 
                    /* Mobile: Normal scrolling */
                    max-h-none overflow-visible pr-0 
                    /* Desktop: Internal scrolling area */
                    md:max-h-[calc(100vh-250px)] md:overflow-y-auto 
                    md:pr-4 md:-mr-4 
                    /* Bottom spacing for FAB and layout breathing room */
                    pb-20 md:pb-12
                "
            >
                {habits.map((habit) => (
                    <HabitCard
                        key={habit.id}
                        habit={habit}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onUpdate={onUpdate}
                    />
                ))}
            </div>
        );
    }
);

// Setting display name for better debugging in React DevTools
HabitList.displayName = 'HabitList';

export default HabitList;