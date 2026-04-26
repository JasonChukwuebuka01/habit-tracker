import { describe, it, expect } from 'vitest';
import { toggleHabitCompletion } from '../../lib/habits';
import { Habit } from '../../types/habits';

describe('toggleHabitCompletion', () => {
  const mockHabit: Habit = {
    id: '1',
    userId: 'u1',
    name: 'Test',
    description: '',
    frequency: 'daily',
    createdAt: new Date().toISOString(),
    completions: ['2026-04-25']
  };

  it('adds a completion date when the date is not present', () => {
    const result = toggleHabitCompletion(mockHabit, '2026-04-26');
    expect(result.completions).toContain('2026-04-26');
  });

  it('removes a completion date when the date already exists', () => {
    const result = toggleHabitCompletion(mockHabit, '2026-04-25');
    expect(result.completions).not.toContain('2026-04-25');
  });

  it('does not mutate the original habit object', () => {
    const originalCount = mockHabit.completions.length;
    toggleHabitCompletion(mockHabit, '2026-04-26');
    expect(mockHabit.completions.length).toBe(originalCount);
  });

  it('does not return duplicate completion dates', () => {
    const result = toggleHabitCompletion(mockHabit, '2026-04-26');
    const finalResult = toggleHabitCompletion(result, '2026-04-26');
    // Result removed it, let's manually check unique logic
    expect(new Set(finalResult.completions).size).toBe(finalResult.completions.length);
  });
});