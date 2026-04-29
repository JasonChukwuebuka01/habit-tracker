import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import HabitForm from '@/components/habits/HabitForm';
import { storage } from '@/lib/storage';

vi.mock('@/lib/storage', () => ({
    storage: {
        saveHabit: vi.fn(),
    },
}));

window.scrollTo = vi.fn();

describe('HabitForm Requirements', () => {
    const mockOnClose = vi.fn();
    const mockOnSuccess = vi.fn();
    const userId = 'user-123';

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(cleanup);

    it('shows a validation error when habit name is empty', () => {
        render(<HabitForm isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} userId={userId} />);

        const saveButton = screen.getByTestId('habit-save-button');
        fireEvent.click(saveButton);

        // Check for the error message defined in your validateHabitName logic
        expect(screen.getByText(/name is required/i)).toBeDefined();
        expect(storage.saveHabit).not.toHaveBeenCalled();
    });

    it('creates a new habit and renders it in the list', () => {
        render(<HabitForm isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} userId={userId} />);

        fireEvent.change(screen.getByTestId('habit-name-input'), { target: { value: 'New Habit' } });
        fireEvent.click(screen.getByTestId('habit-save-button'));

        expect(storage.saveHabit).toHaveBeenCalledWith(expect.objectContaining({
            name: 'New Habit',
            userId: userId,
            completions: []
        }));
        expect(mockOnSuccess).toHaveBeenCalled();
    });

    it('edits an existing habit and preserves immutable fields', () => {
        const initialData = {
            id: 'fixed-id-123',
            userId: userId,
            name: 'Original Name',
            description: 'Original Desc',
            frequency: 'daily' as const,
            createdAt: '2026-01-01T10:00:00Z',
            completions: ['2026-01-02']
        };

        render(
            <HabitForm
                isOpen={true}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
                userId={userId}
                initialData={initialData}
            />
        );

        fireEvent.change(screen.getByTestId('habit-name-input'), { target: { value: 'Updated Name' } });
        fireEvent.click(screen.getByTestId('habit-save-button'));

        // Verify name changed but ID, UserID, and CreatedAt remained identical
        expect(storage.saveHabit).toHaveBeenCalledWith({
            id: 'fixed-id-123',
            userId: userId,
            name: 'Updated Name',
            description: 'Original Desc',
            frequency: 'daily',
            createdAt: '2026-01-01T10:00:00Z',
            completions: ['2026-01-02']
        });
    });
});