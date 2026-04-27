import { storage } from './storage';
import { User, Session } from '../types/auth';

/**
 * Handles creating a new user account.
 * Rejects if the email is already taken.
 */
export function registerUser(email: string, password: string): { success: boolean; error?: string } {
  const users = storage.getUsers();

  // Check if a user with this email already exists (Requirement 11)
  const existingUser = users.find((user: User) => user.email === email);
  if (existingUser) {
    return { success: false, error: 'User already exists' };
  }

  // Create the new user object
  const newUser: User = {
    id: crypto.randomUUID(),
    email,
    password,
    createdAt: new Date().toISOString(),
  };

  storage.saveUser(newUser);

  // Auto-login: Create a session for the new user
  const session: Session = {
    userId: newUser.id,
    email: newUser.email,
  };
  storage.saveSession(session);

  return { success: true };
}

/**
 * Validates credentials and creates a session.
 */
export function loginUser(email: string, password: string): { success: boolean; error?: string } {
  const users = storage.getUsers();

  // Find the user and check the password
  const user = users.find((u: User) => u.email === email && u.password === password);

  if (!user) {
    return { success: false, error: 'Invalid email or password' };
  }



  // Create the session
  const session: Session = {
    userId: user.id,
    email: user.email,
  };
  storage.saveSession(session);

  return { success: true };
}




/**
 * Clears the session and logs the user out.
 */
export function logoutUser(): void {
  storage.clearSession();
}