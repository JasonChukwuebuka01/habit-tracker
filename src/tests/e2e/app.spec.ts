import { test, expect } from '@playwright/test';

test.describe('Habit Tracker app', () => {

    test('shows the splash screen and redirects unauthenticated users to /login', async ({ page }) => {
        // Go to root
        await page.goto('/');

        //  Clear localStorage manually to FORCE a "no-session" state
        await page.evaluate(() => {
            localStorage.clear();
        });

        //  Verify Splash
        await expect(page.getByTestId('splash-screen')).toBeVisible();

        //  Hard Reload to trigger the useEffect
        await page.reload({ waitUntil: 'networkidle' });

        //  Wait for the redirect 
        // Using a string '**/login' is sometimes more reliable than regex
        await page.waitForURL('**/login', { timeout: 15000 });

        //  Final verification
        await expect(page).toHaveURL(/.*login/);
        await expect(page.getByTestId('auth-login-submit')).toBeVisible();
    });



    test('redirects authenticated users from / to /dashboard', async ({ page }) => {
        //  Establish domain context
        await page.goto('/');

        //  Inject fake session
        await page.evaluate(() => {
            localStorage.setItem('habit-tracker-session', JSON.stringify({
                id: 'user_123',
                email: 'test@example.com',
                name: 'Test User'
            }));
        });

        //  Reload to trigger your logic
        await page.reload({ waitUntil: 'networkidle' });

        // Wait for the redirect to Dashboard
        await page.waitForURL('**/dashboard', { timeout: 15000 });

        // Meaningful Verification (Requirement 16.4)
        // Confirm the URL is correct and the private logout button is visible
        await expect(page).toHaveURL(/.*dashboard/);
        const logoutBtn = page.getByTestId('auth-logout-button');
        await expect(logoutBtn).toBeVisible();
    });




    test('prevents unauthenticated access to /dashboard', async ({ page }) => {
        //  Try to "sneak" into the dashboard directly
        await page.goto('/dashboard');

        //  Wait for the app to realize there is no session and redirect
        // This tests your AuthGuard/Middleware logic
        await page.waitForURL('**/login', { timeout: 15000 });

        // Verify the URL is now the login page
        await expect(page).toHaveURL(/.*login/);

        //  Meaningful Verification (Requirement 16.4)
        // Confirm the login form is shown instead of dashboard content
        const loginButton = page.getByTestId('auth-login-submit');
        await expect(loginButton).toBeVisible();

        // Also confirm the dashboard's private button is NOT there
        const logoutBtn = page.getByTestId('auth-logout-button');
        await expect(logoutBtn).not.toBeVisible();
    });



    test('signs up a new user and lands on the dashboard', async ({ page }) => {
        //  Go directly to the signup page to avoid "toggle" button errors
        // If your route is different (e.g., /auth/signup), adjust this URL
        await page.goto('/signup');

        //  Fill the form using the test IDs from your component
        const email = `test-${Date.now()}@gmail.com`;

        // We use fill() directly on the IDs you provided
        await page.getByTestId('auth-signup-email').fill(email);
        await page.getByTestId('auth-signup-password').fill('password123');

        //  Submit the form
        await page.getByTestId('auth-signup-submit').click();

        //  Wait for the logic to process and redirect to /dashboard
        await page.waitForURL('**/dashboard', { timeout: 15000 });

        //  Final validation
        await expect(page).toHaveURL(/.*dashboard/);
        await expect(page.getByTestId('auth-logout-button')).toBeVisible();
    });


    test("logs in an existing user and loads only that user's habits", async ({ page }) => {
        const email = `existing-${Date.now()}@example.com`;
        const password = 'password123';
        const habitName = "Morning Meditation";

        // Setup: Register
        await page.goto('/signup');
        await page.getByTestId('auth-signup-email').fill(email);
        await page.getByTestId('auth-signup-password').fill(password);
        await page.getByTestId('auth-signup-submit').click();
        await page.waitForURL('**/dashboard');

        //  Open Form using the new test ID
        await page.getByTestId('open-habit-form').click();

        //  Fill the form using the tags we found earlier
        await page.getByTestId('habit-name-input').fill(habitName);
        await page.getByTestId('habit-description-input').fill('Daily zen session');
        await page.getByTestId('habit-save-button').click();

        //  Verify and Log Out
        await expect(page.getByText(habitName)).toBeVisible();
        await page.getByTestId('auth-logout-button').click();
        await page.waitForURL('**/login');

        //  THE TEST: Log back in
        await page.getByTestId('auth-login-email').fill(email);
        await page.getByTestId('auth-login-password').fill(password);
        await page.getByTestId('auth-login-submit').click();

        //  Final Verification
        await page.waitForURL('**/dashboard');
        await expect(page.getByText(habitName)).toBeVisible();
    });


    test('creates a habit from the dashboard', async ({ page }) => {
        const habitName = `Exercise ${Date.now()}`;
        const habitDesc = "30 minutes of cardio";

        //  Start by signing up to get a fresh dashboard
        await page.goto('/signup');
        await page.getByTestId('auth-signup-email').fill(`creator-${Date.now()}@example.com`);
        await page.getByTestId('auth-signup-password').fill('password123');
        await page.getByTestId('auth-signup-submit').click();

        await page.waitForURL('**/dashboard');

        //  Open the Habit Form
        // This ID is on both the "First Habit" and "New Habit" buttons
        await page.getByTestId('open-habit-form').click();

        //  Fill out the habit details
        await page.getByTestId('habit-name-input').fill(habitName);
        await page.getByTestId('habit-description-input').fill(habitDesc);

        //  Submit the form
        await page.getByTestId('habit-save-button').click();

        //  Verification (Requirement 16.4)
        // We wait for the modal to disappear to ensure the dashboard is updated
        await expect(page.getByTestId('habit-form')).not.toBeVisible();

        // Check that the habit name appears
        await expect(page.getByText(habitName)).toBeVisible();

        // Fix: use .first() to avoid conflict with the description remaining in the modal's DOM
        const descriptionElement = page.getByText(habitDesc).first();
        await expect(descriptionElement).toBeVisible();

        // Verify the "Complete" button for this new habit is also visible
        // This proves the habit card fully rendered
        await expect(page.getByRole('button', { name: /complete/i }).first()).toBeVisible();
    });



    test('completes a habit for today and updates the streak', async ({ page }) => {
        const habitName = `Streak-Test-${Date.now()}`;

        //  Setup: Sign up and create a fresh habit
        await page.goto('/signup');
        await page.getByTestId('auth-signup-email').fill(`streak-${Date.now()}@example.com`);
        await page.getByTestId('auth-signup-password').fill('password123');
        await page.getByTestId('auth-signup-submit').click();
        await page.waitForURL('**/dashboard');

        await page.getByTestId('open-habit-form').click();
        await page.getByTestId('habit-name-input').fill(habitName);
        await page.getByTestId('habit-save-button').click();

        //  Locate and Click the "Complete" button
        const completeButton = page.getByRole('button', { name: /complete habit/i }).first();
        await completeButton.click();

        //  Verification (Requirement 16.4)
        // FIX: Scope the check to the streak container to avoid strict mode errors
        // We look for a test-id that starts with 'habit-streak'
        const streakCounter = page.locator('[data-testid^="habit-streak"]').first();

        await expect(streakCounter).toBeVisible();
        await expect(streakCounter).toContainText('1');

        // Optional: Verify the button text changed to "Unmark" (as seen in your snapshot)
        await expect(page.getByRole('button', { name: /unmark habit/i })).toBeVisible();
    });

    test('persists session and habits after page reload', async ({ page }) => {
        const email = `persist-${Date.now()}@example.com`;
        const habitName = "Persistence Task";

        //  Setup: Sign up and create a habit
        await page.goto('/signup');
        await page.getByTestId('auth-signup-email').fill(email);
        await page.getByTestId('auth-signup-password').fill('password123');
        await page.getByTestId('auth-signup-submit').click();
        await page.waitForURL('**/dashboard');

        await page.getByTestId('open-habit-form').click();
        await page.getByTestId('habit-name-input').fill(habitName);
        await page.getByTestId('habit-save-button').click();

        // Ensure it's saved before we reload
        await expect(page.getByText(habitName)).toBeVisible();

        // The Action: Reload the page
        await page.reload({ waitUntil: 'networkidle' });

        //  Verification (Requirement 16.4)
        // Check that we are STILL on the dashboard (session persisted)
        await expect(page).toHaveURL(/.*dashboard/);

        // Check that the habit is STILL there (data persisted)
        await expect(page.getByText(habitName)).toBeVisible();

        // Check that the logout button is still visible
        await expect(page.getByTestId('auth-logout-button')).toBeVisible();
    });

    test('logs out and redirects to /login', async ({ page }) => {
        //  Setup: Direct login/signup to reach the dashboard
        const email = `logout-test-${Date.now()}@example.com`;
        await page.goto('/signup');
        await page.getByTestId('auth-signup-email').fill(email);
        await page.getByTestId('auth-signup-password').fill('password123');
        await page.getByTestId('auth-signup-submit').click();
        await page.waitForURL('**/dashboard');

        // The Action: Click the logout button
        const logoutBtn = page.getByTestId('auth-logout-button');
        await expect(logoutBtn).toBeVisible();
        await logoutBtn.click();

        //  Verification (Requirement 16.4)
        // Check for the redirect to login
        await page.waitForURL('**/login');
        await expect(page).toHaveURL(/.*login/);

        // Verify the login form is visible again
        await expect(page.getByTestId('auth-login-submit')).toBeVisible();

        //  Persistence Check: Ensure the user cannot go back to /dashboard
        await page.goto('/dashboard');
        await page.waitForURL('**/login');
        await expect(page).toHaveURL(/.*login/);
    });



    test('loads the cached app shell when offline', async ({ page, context }) => {
        //  Load the app online
        await page.goto('/login');
        await expect(page.getByTestId('auth-login-submit')).toBeVisible();

        //  WAIT FOR SERVICE WORKER ACTIVATION
        // We check if a service worker is controlling the page
        const isControlled = await page.evaluate(async () => {
            const registration = await navigator.serviceWorker.getRegistration();
            if (!registration) return false;
            return !!registration.active;
        });

        // If your config blocks SWs, this will be false
        if (!isControlled) {
            console.warn('Service Worker not active. Offline test may fail.');
        }

        //  Go offline
        await context.setOffline(true);

        //  Reload - the Service Worker should now serve the cached shell
        await page.reload().catch(() => {
            // We catch the error because some browsers throw before the SW intercepts
        });

        // Final check
        await expect(page.getByTestId('auth-login-submit')).toBeVisible();
        await context.setOffline(false);
    });
});