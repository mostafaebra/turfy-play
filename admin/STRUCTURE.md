Here is a clean, professional guide you can share with your team. I recommend saving this as a file named **`STRUCTURE.md`** or adding it to your `README.md`.

It explains exactly **what** goes where and **why**, using "Turfy Play" examples.

-----

# 📂 Turfy Play: Project Structure & Guidelines

This document serves as the "Rule Book" for where code lives in our application. Following this structure ensures we don't step on each other's toes and makes the code easy to debug.

-----

## 1\. `src/pages/`

**What goes here?**
The main "views" associated with a specific Route URL (e.g., `/login`, `/home`, `/venue/:id`).

**How to use it:**

  * Create a **Folder** for each page (e.g., `src/pages/Home/`).
  * Inside, create the component file (`Home.jsx`) and its specific styles (`Home.module.css`).

**⚠️ Rules:**

  * **No heavy logic.** Pages should just "assemble" components. They shouldn't contain complex calculations.
  * **Naming:** PascalCase. (e.g., `VenueDetails`, not `venue_details`).

-----

## 2\. `src/features/` (The Brains 🧠)

**What goes here?**
All business logic specific to a "domain" of the app. This separates our concerns. If you are working on the **Booking System**, you work here.

**Structure Example:**

```text
src/features/
├── auth/           # Login, Signup, Forgot Password logic
├── booking/        # Calendar, Slot Selection, Payment logic
└── venues/         # Filtering venues, displaying venue cards
```

**What is inside a Feature folder?**

  * `components/`: UI specific *only* to this feature (e.g., `BookingCalendar.jsx`).
  * `hooks/`: Logic specific to this feature (e.g., `useVenueSearch.js`).
  * `services/`: specific API calls (e.g., `bookingService.js`).

**💡 Hint:** If a component is *only* used for Booking (like a "Seat Selector"), it goes in `features/booking/components`. If it's a generic Button used everywhere, it goes in `src/components`.

-----

## 3\. `src/components/` (The Lego Blocks 🧱)

**What goes here?**
Reusable, "dumb" UI elements that work anywhere in the app. They don't know about "Turfy Play" logic; they just look good.

**Examples:**

  * `Button.jsx` (Standard green/white buttons).
  * `Input.jsx` (Standard text fields).
  * `Modal.jsx` (Popup containers).
  * `Spinner.jsx` (Loading state).

**⚠️ Rule:**

  * These components should **never** make API calls. They only receive data via `props`.

-----

## 4\. `src/layouts/`

**What goes here?**
Wrappers that define the structure of a page. This is where we handle the permanent UI parts.

**Examples:**

  * `MainLayout.jsx` (Includes the Top Navbar + Footer).
  * `DashboardLayout.jsx` (Includes the Side Drawer/Sidebar for user profiles).

**💡 Hint:** Use these in your Router setup to wrap your Pages.

-----

## 5\. `src/services/`

**What goes here?**
The bridge between our Front-End and the Back-End (API).

**How to use it:**

  * `api.js`: Sets up Axios (base URL, timeouts, interceptors).
  * `endpoints.js`: A single file listing all URL strings (e.g., `/api/v1/venues`).

**⚠️ Rule:**

  * Never write `fetch('http://localhost:3000/...')` inside a component. Always import a function from `services/`.

-----

## 6\. `src/utils/`

**What goes here?**
Helper functions that format data. Pure JavaScript functions (no React).

**Examples:**

  * `formatDate.js`: Turns `2025-12-01` into `1st Dec, 2025`.
  * `currency.js`: Adds "EGP" to prices and handles commas.
  * `validators.js`: Checks if an email is valid.

-----

## 7\. `src/assets/`

**What goes here?**
Static files.

  * `images/`: Logos, banners, dummy venue photos.
  * `icons/`: SVGs or icon files.

-----

## 🚀 General Team Hints

1.  **The "150 Line" Rule:** If your component file gets larger than 150 lines, try to break it into smaller sub-components.
2.  **Delete Console Logs:** Before pushing your code, remove `console.log`.
3.  **Imports:** Use absolute paths if configured, otherwise use clear relative paths.
      * ✅ `import Button from '../../components/Button'`
4.  **Style Conflicts:** We use CSS Modules (`filename.module.css`) or standard class names. Avoid writing inline styles like `style={{ marginTop: '20px' }}` unless dynamic.