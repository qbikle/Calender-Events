
# Dynamic Event Calendar Application

[![Vercel Deployment](https://img.shields.io/badge/Deployed%20on-Vercel-brightgreen)](https://calender-events-two.vercel.app/)

This project is a **Dynamic Event Calendar Application** built with React.js, TypeScript, and Vite, showcasing advanced logic, clean UI design, and seamless deployment.

## Features

### Core Functionality
- **Calendar View**:
  - Displays a dynamic monthly calendar grid.
  - Navigate between months using "Previous" and "Next" buttons.
- **Event Management**:
  - Add events to specific days by clicking on a date.
  - Edit or delete existing events.
  - Each event includes:
    - Name
    - Start and end time
    - Optional description
- **Event List**:
  - View all events for the selected day in a modal.

### Advanced Logic
- Ensures no overlapping events (e.g., two events at the same time).
- Automatically handles month transitions and edge cases like leap years.
- Highlights the current day and selected date for better UX.

### Data Persistence
- Stores all events using **localStorage**, ensuring data is preserved across page refreshes.

### Exportable Events
- Export event lists for a specific month as **JSON** or **CSV**.

### UI Design
- Built with **ShadCN components** for a modern and intuitive design.
- Distinguishes weekends, weekdays, and highlights current/selected days.

## Bonus Features
- **Drag-and-Drop Rescheduling**: Move events between days effortlessly.
- **Event Categorization**: Apply color codes for event types (Work, Personal, Others).

## Installation

### Prerequisites
- **Node.js** or **Bun**
- A package manager like `npm`, `yarn`, or `bun`.

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/qbikle/Calender-Events.git
   cd Calender-Events
   ```

2. Install dependencies:
   ```bash
   bun install
   ```
   OR
    ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   bun run dev
   ```
   OR
   ```bash
   npm run dev
   ```

4. Open in the browser:
   ```plaintext
   http://localhost:5173
   ```

## Deployment
The project is live at [https://calender-events-two.vercel.app/](https://calender-events-two.vercel.app/).

## Project Structure
- **src/components**: Reusable UI components.
- **src/pages**: Main application pages.
- **src/utils**: Helper functions for calendar and event logic.
- **public**: Static assets like images.

## Technologies
- **React.js** with TypeScript
- **Vite** for development
- **ShadCN components** for UI
- **LocalStorage** for persistent data storage
- **Bun** for runtime efficiency

## Documentation
### Calendar Logic
- Dynamically calculates month grids.
- Handles leap years and transitions like Jan 31 → Feb 1.

### Event Management
- Validates event time ranges to prevent overlaps.
- Enables event filtering and management.

### Export Events
- Provides **CSV** export options for all events in a selected month.

## Future Enhancements
- Integration with external calendars (Google, Outlook).
- User authentication for personalized event management.
- Collaborative event sharing.

## License
This project is licensed under the **MIT License**.