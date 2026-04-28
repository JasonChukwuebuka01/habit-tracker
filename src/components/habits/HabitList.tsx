'use client';

import React from 'react';
import { Habit } from '@/types/habits';
import HabitCard from './HabitCard';

interface HabitListProps {
    habits: Habit[];
    onEdit: (habit: Habit) => void;
    onDelete: (id: string) => void;
    onUpdate: (updatedHabit: Habit) => void;
}

export default function HabitList({ habits, onEdit, onDelete, onUpdate }: HabitListProps) {
    return (
        <div
            data-testid="habit-list"
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
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