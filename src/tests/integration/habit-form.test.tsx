/** @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import HabitForm from '../../components/habits/HabitForm';
import { storage } from '../../lib/storage';

// CRITICAL: The mock path MUST match the relative import path used above
vi.mock('../../lib/storage', () => ({
    storage: {
        saveHabit: vi.fn(),
    },
}));

// Mock scrollTo to avoid errors in JSDOM
window.scrollTo = vi.fn();

// Polyfill crypto for Vitest environment
if (!global.crypto) {
    Object.defineProperty(global, 'crypto', {
        value: { randomUUID: () => 'test-uuid-123' },
    });
}

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

        // Verify the error message appears
        expect(screen.getByText(/name is required/i)).toBeDefined();

        // storage.saveHabit is now correctly recognized as a spy
        expect(storage.saveHabit).not.toHaveBeenCalled();
    });

    it('creates a new habit and renders it in the list', () => {
        render(<HabitForm isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} userId={userId} />);

        fireEvent.change(screen.getByTestId('habit-name-input'), { target: { value: 'New Habit' } });
        fireEvent.click(screen.getByTestId('habit-save-button'));

        // Use objectContaining to handle the random UUID and ISO date
        expect(storage.saveHabit).toHaveBeenCalledWith(expect.objectContaining({
            name: 'New Habit',
            userId: userId,
            description: '',
            completions: []
        }));

        expect(mockOnSuccess).toHaveBeenCalled();
        expect(mockOnClose).toHaveBeenCalled();
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

        // Check that name changed while ID and CreatedAt stayed the same
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