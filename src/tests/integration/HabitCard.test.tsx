import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import HabitCard from '../../components/habits/HabitCard';
import { Habit } from '../../types/habits';

describe('HabitCard Component Requirements', () => {
    // 1. Setup Mock Data
    const mockHabit: Habit = {
        id: 'habit-123',
        userId: 'user-999',
        name: 'Morning Meditation',
        description: '10 minutes of mindfulness',
        frequency: 'daily',
        createdAt: new Date().toISOString(),
        completions: [], // Start with no completions
    };

    const mockOnDelete = vi.fn();
    const mockOnEdit = vi.fn();
    const mockOnUpdate = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        cleanup();
    });

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

        // Click the initial delete (trash icon) trigger
        const deleteTrigger = screen.getByLabelText(/delete habit/i);
        fireEvent.click(deleteTrigger);

        // Verify the onDelete function HAS NOT been called yet
        expect(mockOnDelete).not.toHaveBeenCalled();

        // Verify the modal is visible by finding the required test-id button
        const confirmButton = screen.getByTestId('confirm-delete-button');
        expect(confirmButton).toBeDefined();

        // Click the explicit confirmation button
        fireEvent.click(confirmButton);

        // Verify the deletion is now triggered with the correct ID
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

        // Target the checkbox (which handles completion toggling)
        const checkbox = screen.getByRole('checkbox');

        // Simulate checking the habit as complete
        fireEvent.click(checkbox);

        // Verify the update function is called to persist the state change
        // This is what ultimately updates the streak display in the UI
        expect(mockOnUpdate).toHaveBeenCalledTimes(1);

        // Check that the update includes a completion for today
        const callArgs = mockOnUpdate.mock.calls[0][0];
        expect(callArgs.completions.length).toBe(1);
    });
});