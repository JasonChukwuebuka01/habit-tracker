/**
 * App-wide constants for deterministic behavior.
 * These ensure we meet the technical requirement contracts.
 */

// Requirement 10: Splash screen target duration between 800ms and 2000ms
export const SPLASH_DURATION = 1500; 

// Requirement 10: The app name as it must appear in the Splash Screen
export const APP_NAME = 'Habit Tracker';

// Local Storage Keys from Section 5
export const STORAGE_KEYS = {
  USERS: 'habit-tracker-users',
  SESSION: 'habit-tracker-session',
  HABITS: 'habit-tracker-habits',
} as const;

// Habit Constants
export const MAX_HABIT_NAME_LENGTH = 60;
export const DEFAULT_FREQUENCY = 'daily' as const;