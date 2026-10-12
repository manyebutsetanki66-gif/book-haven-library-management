# Book Haven — React Library Management System

A React single-page application for a community library, built with Vite, React Router, React hooks, CSS, and browser Local Storage.

## Requirements covered
- **Dashboard:** totals for titles and stock, low-stock warning for quantities below 2, and current availability table.
- **Book management:** add, update, and delete books with title, author, genre, ISBN, and quantity; required-field checks and duplicate ISBN prevention.
- **Availability/transactions:** add incoming stock or record borrowed copies, block deductions greater than available stock, and keep a timestamped transaction history.
- **User management:** first-run administrator account setup, account-based login, and forms to add, update, and delete accounts (name, membership ID, username, password, role), with duplicate ID/username checks.
- **React:** functional components, `useState`, `useEffect` through a reusable Local Storage hook, reusable components, controlled forms, and React Router navigation.
- **Persistence:** books, users, transaction history, and login state are stored in browser Local Storage.
- **Search:** navigation search filters books by title, author, genre, or ISBN.

## Run locally
1. Install Node.js (LTS).
2. Open this project folder in a terminal.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open the local URL Vite prints in the terminal.

To check a production build, run `npm run build`.

## First-time setup and login
- On a fresh install, the login page asks you to create the first administrator account. Choose your own name, staff/membership ID, username, and password. There are no built-in demo credentials.
- After setup, sign in with the username and password you created. An administrator or librarian can add accounts from User Management.
- The old hard-coded `manager` / `manager123` demo account/session is removed when the updated app is opened.
- **Security limitation:** this coursework app stores credentials in browser Local Storage to meet the assignment’s Local Storage requirement. This is not secure production authentication; a real deployment needs a backend and properly hashed passwords.

## Before submission
- Test every feature using the checklist in `TESTING.md`.
- Add your own screenshots and a short explanation of how the React hooks and Local Storage are used.
- Create a GitHub repository and push the project source. Do not upload `node_modules`; GitHub and the marker can recreate dependencies with `npm install`.
- Review the assignment brief and make sure you can explain the code yourself. No grade can be guaranteed by a code change alone.
