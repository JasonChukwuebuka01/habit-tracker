import { User, Session } from '../types/auth';
import { Habit } from '../types/habits';
import { STORAGE_KEYS } from './constants';


const USERS_KEY = STORAGE_KEYS.USERS;
const SESSION_KEY = STORAGE_KEYS.SESSION;
const HABITS_KEY = STORAGE_KEYS.HABITS;


export const storage = {

    getUsers(): User[] {
        if (typeof window === 'undefined') return [];
        const data = localStorage.getItem(USERS_KEY);
        if (!data) return [];
        return JSON.parse(data);
    },

    saveUser(newUser: User): void {
        const users = this.getUsers();
        users.push(newUser);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    },

    // SESSION DATA
    getSession(): Session | null {
        if (typeof window === 'undefined') return null;
        const data = localStorage.getItem(SESSION_KEY);
        if (!data) return null;
        return JSON.parse(data);
    },

    saveSession(session: Session): void {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    },

    clearSession(): void {
        localStorage.removeItem(SESSION_KEY);
    },

    // --- HABIT DATA ---
    getHabits(userId: string): Habit[] {
        if (typeof window === 'undefined') return [];
        const data = localStorage.getItem(HABITS_KEY);
        if (!data) return [];


        const allHabits: Habit[] = JSON.parse(data);
        // Only return habits that belong to the logged-in user (Requirement 4)
        return allHabits.filter(habit => habit.userId === userId);
    },

    saveHabit(habit: Habit): void {
        const data = localStorage.getItem(HABITS_KEY);
        let allHabits: Habit[] = data ? JSON.parse(data) : [];

        const existingIndex = allHabits.findIndex(h => h.id === habit.id);

        if (existingIndex > -1) {
            // If it exists, we update it.
            allHabits[existingIndex] = habit;
        } else {
            // If not, we add it (Create Habit)
            allHabits.push(habit);
        }

        localStorage.setItem(HABITS_KEY, JSON.stringify(allHabits));
    },

    deleteHabit(habitId: string): void {
        const data = localStorage.getItem(HABITS_KEY);
        if (!data) return;

        const allHabits: Habit[] = JSON.parse(data);
        const updatedHabits = allHabits.filter(h => h.id !== habitId);

        localStorage.setItem(HABITS_KEY, JSON.stringify(updatedHabits));
    }
};