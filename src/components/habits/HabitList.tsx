'use client';

import React, { forwardRef } from 'react';
import { Habit } from '@/types/habits';
import HabitCard from './HabitCard';

interface HabitListProps {
    habits: Habit[];
    onEdit: (habit: Habit) => void;
    onDelete: (id: string) => void;
    onUpdate: (updatedHabit: Habit) => void;
};

const HabitList = forwardRef<HTMLDivElement, HabitListProps>(
    ({ habits, onEdit, onDelete, onUpdate }, ref) => {
        return (
            <div
                ref={ref}
                data-testid="habit-list"
                className="
                    /* Grid Layout */
                    grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 
                    animate-in fade-in duration-500 
                    
                    /* Mobile: Clean, natural flow */
                    max-h-none overflow-visible w-full px-1
                    
                    /* Desktop: Fixed scroll area */
                    md:max-h-[calc(100vh-260px)] md:overflow-y-auto 
                    md:pr-4 md:-mr-2
                    
                    /* Bottom Spacing to clear the Mobile Add Button */
                    pb-32 md:pb-12
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

HabitList.displayName = 'HabitList';

export default HabitList;