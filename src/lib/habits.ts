import { Habit } from '../types/habits';

export function toggleHabitCompletion(habit: Habit, date: string): Habit {
  const isCompleted = habit.completions.includes(date);
  
  const newCompletions = isCompleted
    ? habit.completions.filter((d) => d !== date) // Remove if exists
    : [...habit.completions, date];              // Add if not exists

  return {
    ...habit,
    completions: Array.from(new Set(newCompletions)), // Ensure unique dates
  };
}