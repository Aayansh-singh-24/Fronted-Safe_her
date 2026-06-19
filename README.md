# 🛡️ SafeHer — Women's Personal Safety & Holistic Wellness

**SafeHer** is an elegant, responsive, mobile-first Web Application (SPA) designed to empower women with quick-dial rescue grids, ambient sound recorders, automated SOS triggers, realistic fake call mechanisms, and wellness trackers like Stress and PCOS screeners in a single, beautiful dashboard.

Designed specifically to be safe, offline-capable, and simple, **SafeHer** prioritizes rapid usability with comfortable touch-targets, eye-safe colors, and high visual contrast.

---

## 🎨 Visual Identity & Styling Guide

*   **Typography:** [Poppins](https://fonts.google.com/specimen/Poppins) from Google Fonts for high-end digital styling paired with [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) for mono-spaced digital trackers.
*   **Palette:** 
    *   `Background`: Elegant, ambient ultra-light pinkish-white (`#FAF6F8`)
    *   `Primary Interactive / Accents`: Striking vibrant pink (`#E91E63`)
    *   `Containers / Card Backings`: Pure safe white (`#FFFFFF`)
    *   `Shadowing`: Subtle soft elevation shadow (`0 4px 12px rgba(63, 29, 56, 0.05)`)
    *   `Borders & Radii`: Soft-crafted rounded corners (`16px` to `24px`) for tactile warmth.

---

## 📱 Core Layout & Interactive Modules

SafeHer implements a standard responsive **mobile safe-area viewport wrapper** centered gracefully on desktop monitors (max-width: 450px) and stretches perfectly on native mobile devices.

### 1. Home Dashboard View
*   **Pulsing Location Board:** Live tracking simulation display showing active coordinates on maps.
*   **Emergency Contact Sync:** Quick interface to add, edit, and keep track of virtual trusted contact guardians.
*   **Daily Quick Access Grid:**
    *   **Stress Check:** Guided 5-step stress assessment with micro-breathing prompts.
    *   **Cycle Tracker:** Smart period & fertility timeline calculator with daily wellness tips.
    *   **Sister Circle forum:** A fully anonymous shared bulletin board for local transit alerts and query updates.
    *   **PCOS Support:** Endocrinological symptom checklists and active nutrition guides.

### 2. Emergency Fake Call
*   **Trigger Mechanism:** Custom timing configuration prompts an incoming realistic simulated phone call to help exit hazardous or uncomfortable situations gracefully.
*   **Interactive Call Screen:** Simulates native dialer ringers, mute settings, and speaker toggles alongside realistic parent-contact response voice cues.

### 3. Profile & User Dashboard
*   **Avatar Badging:** Custom profiles and live database indicators.
*   **Personalization:** Quick edit forms to adjust phone numbers and nicknames securely.

### 4. Emergency Help Hub
*   **National Hotline Stack:** Single-click call targets with soft-colored indicators for immediate, panic-safe recognition:
    *   **112:** National Emergency
    *   **108:** Ambulance Service
    *   **102:** Pregnancy Medical Services
    *   **1091:** Women Helpline
    *   **100:** Police dispatch controls
    *   **101:** Fire services

---

## 🛠️ Project Stack & Configuration

The application is built on:
*   **Framework:** React 19 + TypeScript
*   **Compilation:** Vite with Hot Module Replacement (HMR) configuration.
*   **Styling:** Custom CSS Custom Properties designed for performance and vanilla speed.
*   **Icons:** [Lucide-React](https://lucide.dev/) package directory.

### Quick Start & Development

To test and compile the codebase:

```bash
# 1. Install dependencies
npm install

# 2. Spin up local development server
npm run dev

# 3. Code Linter Validation
npm run lint

# 4. Production compiled build outputs
npm run build
```

---

## 💾 Standard Layout Code Exporter
SafeHer features a custom **standalone single-page HTML exporter** built directly inside the dashboard. Click the exporter card on the Home Screen to immediately copy the entire HTML module complete with modern CSS Flexbox parameters, Google Fonts imports, and Vanilla Event handlers into your clipboard for deployment anywhere in a single copy!
