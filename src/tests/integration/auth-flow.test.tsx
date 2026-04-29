/** @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '../../components/auth/LoginForm';
import SignupForm from '../../components/auth/SignupForm';
import { loginUser, registerUser } from '../../lib/auth';

// 1. FIX: Use the SAME relative path for the mock as the import
vi.mock('../../lib/auth', () => ({
    loginUser: vi.fn(),
    registerUser: vi.fn(),
}));

// 2. Mock Next.js Router
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

describe('Authentication Flow Requirements', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    /**
     * REQUIREMENT: submits the signup form and creates a session
     */
    it('submits the signup form and creates a session', async () => {
        // Use mockResolvedValue since auth functions are usually async/Promises
        vi.mocked(registerUser).mockResolvedValue({ success: true });

        render(<SignupForm />);

        fireEvent.change(screen.getByTestId('auth-signup-email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByTestId('auth-signup-password'), { target: { value: 'password123' } });
        fireEvent.click(screen.getByTestId('auth-signup-submit'));

        await waitFor(() => {
            expect(registerUser).toHaveBeenCalledWith('test@example.com', 'password123');
            expect(mockPush).toHaveBeenCalledWith('/dashboard');
        });
    });

    /**
     * REQUIREMENT: shows an error for duplicate signup email
     */
    it('shows an error for duplicate signup email', async () => {
        vi.mocked(registerUser).mockResolvedValue({
            success: false,
            error: 'Email already in use'
        });

        render(<SignupForm />);

        fireEvent.change(screen.getByTestId('auth-signup-email'), { target: { value: 'exists@example.com' } });
        fireEvent.change(screen.getByTestId('auth-signup-password'), { target: { value: 'password123' } });
        fireEvent.click(screen.getByTestId('auth-signup-submit'));

        const errorAlert = await screen.findByRole('alert');
        expect(errorAlert.textContent).toBe('Email already in use');
        expect(mockPush).not.toHaveBeenCalled();
    });

    /**
     * REQUIREMENT: submits the login form and stores the active session
     */
    it('submits the login form and stores the active session', async () => {
        vi.mocked(loginUser).mockResolvedValue({ success: true });

        render(<LoginForm />);

        fireEvent.change(screen.getByTestId('auth-login-email'), { target: { value: 'user@example.com' } });
        fireEvent.change(screen.getByTestId('auth-login-password'), { target: { value: 'password123' } });
        fireEvent.click(screen.getByTestId('auth-login-submit'));

        await waitFor(() => {
            expect(loginUser).toHaveBeenCalledWith('user@example.com', 'password123');
            expect(mockPush).toHaveBeenCalledWith('/dashboard');
        });
    });

    /**
     * REQUIREMENT: shows an error for invalid login credentials
     */
    it('shows an error for invalid login credentials', async () => {
        vi.mocked(loginUser).mockResolvedValue({
            success: false,
            error: 'Invalid email or password'
        });

        render(<LoginForm />);

        fireEvent.change(screen.getByTestId('auth-login-email'), { target: { value: 'wrong@example.com' } });
        fireEvent.change(screen.getByTestId('auth-login-password'), { target: { value: 'wrongpass' } });
        fireEvent.click(screen.getByTestId('auth-login-submit'));

        const errorAlert = await screen.findByRole('alert');
        expect(errorAlert.textContent).toBe('Invalid email or password');
        expect(mockPush).not.toHaveBeenCalled();
    });
});