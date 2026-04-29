/** @vitest-environment jsdom */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import HabitCard from '../../components/habits/HabitCard';
import { Habit } from '../../types/habits';
import { getHabitSlug } from '../../lib/slug';


describe('HabitCard Component Requirements', () => {
    const mockHabit: Habit = {
        id: 'habit-123',
        userId: 'user-999',
        name: 'Morning Meditation',
        description: '10 minutes of mindfulness',
        frequency: 'daily',
        createdAt: new Date().toISOString(),
        completions: [],
    };

    const mockOnDelete = vi.fn();
    const mockOnEdit = vi.fn();
    const mockOnUpdate = vi.fn();
    const slug = getHabitSlug(mockHabit.name);

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(cleanup);

    /**
     * REQUIREMENT: deletes a habit only after explicit confirmation
     */
    it('deletes a habit only after explicit confirmation', async () => {
        render(
            <HabitCard
                habit={mockHabit}
                onDelete={mockOnDelete}
                onEdit={mockOnEdit}
                onUpdate={mockOnUpdate}
            />
        );

        // 1. Click the trash icon trigger (found inside DeleteHabitButton)
        const deleteTrigger = screen.getByLabelText(/delete habit/i);
        fireEvent.click(deleteTrigger);

        // 2. Verify onDelete HAS NOT been called yet (just the modal opened)
        expect(mockOnDelete).not.toHaveBeenCalled();

        // 3. Find the confirmation button in the modal
        const confirmButton = screen.getByTestId('confirm-delete-button');
        fireEvent.click(confirmButton);

        // 4. Verify the deletion is now triggered
        expect(mockOnDelete).toHaveBeenCalledWith('habit-123');
    });

    /**
     * REQUIREMENT: toggles completion and updates the streak display
     */
    it('toggles completion and updates the streak display', () => {
        render(
            <HabitCard
                habit={mockHabit}
                onDelete={mockOnDelete}
                onEdit={mockOnEdit}
                onUpdate={mockOnUpdate}
            />
        );

        // FIX: The component uses a button with a test-id, not a role="checkbox"
        const completeButton = screen.getByTestId(`habit-complete-${slug}`);

        // Simulate checking the habit
        fireEvent.click(completeButton);

        // Verify onUpdate was called
        expect(mockOnUpdate).toHaveBeenCalledTimes(1);

        // Check that the update includes the new completion
        const updatedHabit = mockOnUpdate.mock.calls[0][0];
        expect(updatedHabit.completions.length).toBe(1);

        // Check that the date added matches today's date format (YYYY-MM-DD)
        const today = new Date().toISOString().split('T')[0];
        expect(updatedHabit.completions).toContain(today);
    });
});