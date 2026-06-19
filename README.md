# SafeHer - Women's Safety App

A simple college-level React single-page web application (SPA) focused on women's safety features.

## Tech Stack
*   **Frontend Library:** React (v19)
*   **Language:** TypeScript
*   **Build Tool & Dev Server:** Vite
*   **Styling:** CSS3 (Flexbox & Grid, with Poppins Google Font)
*   **Icons:** Lucide React

## Features Developed
*   **Home Screen:** Live location sharing simulation, emergency contacts list, and quick cards for Stress Check, Cycle Tracker, Anonymous Forum, and PCOS support details.
*   **Emergency Fake Call:** Trigger simulated phone calls with customizable caller name and countdown timer.
*   **Emergency Help List:** Direct calling launcher for important helplines (112, 108, 102, 1091, 100, 101).
*   **Recording Module:** Simulated ambient audio recorder.
*   **Standalone Code Exporter:** Copy setup's raw HTML, inline CSS, and JavaScript with one click.

## How to Build and Run the Application

Follow these steps to run the project locally on your machine.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your computer.

### Setup Instructions

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run Developer Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` (or the port specified in terminal output) in your web browser to view the application.

3. **Run Code Linter:**
   ```bash
   npm run lint
   ```

4. **Build for Production:**
   ```bash
   npm run build
   ```
   This compiles and builds assets into the `dist/` directory.
