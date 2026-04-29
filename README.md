# Habit Tracker PWA

A high-fidelity Habit Tracking application built with **Next.js**, **TypeScript**, and **Tailwind CSS**. This project focuses on professional UI/UX, offline-first capabilities, and reliable local data persistence.

---

## ## Project Overview
The Habit Tracker is designed to help users build and maintain long-term consistency. It features a secure authentication system, a dynamic dashboard, and automated streak calculations to visualize progress.

**Key Features:**
* **Authentication:** Secure user signup and login with session management.
* **Habit Management:** Create, Edit, Delete, and Complete habits via an intuitive UI.
* **Streak Tracking:** Real-time calculation of completion streaks.
* **PWA Support:** Installable on desktop and mobile with offline access to the app shell.
* **Data Isolation:** Ensures users can only access and manage their own habit data.

---

## ## Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd habit-tracker
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    The application is designed to run out-of-the-box using local storage for persistence. Ensure you are using Node.js v18 or higher.

---

## ## Run Instructions

### **Development Mode**
To run the application with hot-reloading:
```bash
npm run dev


**Production Mode (Recommended for PWA Testing)Service Workers and offline features are best tested in a production-like environment:bash**
 ```
npm run build
npm run start
  ```

The application will be available at http://localhost:3000.

## ##  Test Instructions

This project uses Playwright for comprehensive End-to-End (E2E) testing.

1. Install Playwright Browsers:
bash
npx playwright install

2. Run All Tests (Headless):
npx playwright test

3. Run Tests with UI (Interactive):

npx playwright test --ui

## ##  Local Persistence Structure

The application employs a custom Storage Utility that interfaces with the browser's localStorage API.

Data Schema:

. habits_auth_user: Stores the current session token and user ID.

. habits_data: An array of objects keyed by userId. Each habit contains metadata (name, description, frequency) and an array of completions (ISO date strings).

Sync Logic:

On initial mount, the app hydrates the global state by filtering the local storage array for the logged-in user's specific ID, ensuring privacy and data isolation.

## ##  PWA Support Implementation

Progressive Web App (PWA) capabilities are integrated to provide a native "app-like" experience:

. Service Worker: Implemented via next-pwa using a Stale-While-Revalidate strategy for the App Shell.

. Manifest: Configured with high-resolution icons and theme colors for installability on iOS, Android, and Desktop.

. Offline Access: Essential files are cached, allowing users to view the login and dashboard even without an internet connection.

Trade-offs & Limitations

. LocalStorage Limitations: Data is stored only in the current browser. Switching browsers or devices will not sync habits without a backend.

. Client-Side Auth: Authentication is simulated on the client. It prevents unauthorized UI access but does not offer the security of server-side JWT verification.

. Testing Constraints: Some E2E tests (especially offline mode) are configured to run sequentially to avoid interference.

## ## Test Coverage (Key Behaviors Verified)

The file src/tests/e2e/app.spec.ts covers the following critical functionalities:

. Navigation Guards — Redirects unauthenticated users and protects authenticated routes.

. Data Isolation — Users cannot view or modify another account’s habits.

. Habit CRUD — Full create, read, update, and delete operations.

. Streak Update — Correctly increments streak counter on habit completion.

. Persistence — Data and sessions survive page reloads.

. Logout Logic — Clears localStorage and redirects properly.

. Offline App Shell — Login and dashboard render correctly when offline.













