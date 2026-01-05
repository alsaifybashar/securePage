# SECUREPENT - Offensive Security Platform

**SecurePent** is a modern, high-performance landing page for a next-generation offensive security company. Built with **React 19** and **Vite**, it features a sophisticated "Anonymous/Cyber" aesthetic, utilizing deep slate blues, electric accents, and glassmorphism to convey security, stealth, and advanced technology.

## 🚀 Features

*   **⚡ Blazing Fast Performance**: Powered by Vite and React 19.
*   **🎨 Premium Dark Blue Theme**: professionally curated palette using `Slate 900/950` backgrounds and `Electric Blue` / `Cyan` accents.
*   **✨ Advanced UI Effects**:
    *   Smooth CSS-only gradients and glowing vignettes.
    *   Glassmorphism panels (backdrop-blur).
    *   Micro-interactions (hover states, pulsing status badges).
*   **📱 Fully Responsive**: Adaptive layouts for mobile, tablet, and desktop.
*   **📍 Smooth Navigation**: Single-page architecture with smooth scrolling to sections (Hero, Company, Product, Team, Contact).
*   **🔒 Secure Aesthetic**: Design elements that invoke trust and technical prowess.

## 🛠️ Tech Stack

*   **Framework**: [React](https://react.dev/) (v19)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Styling**: Pure CSS3 (Variables, Flexbox, Grid) - *No external heavy UI libraries*.
*   **Linting**: ESLint

## 🏁 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

*   Node.js (v18 or higher recommended)
*   npm (or yarn/pnpm)

### Installation

1.  **Clone the repository** (if applicable) or navigate to the project folder:
    ```bash
    cd securePage
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Start the development server**:
    ```bash
    npm run dev
    ```

4.  **Open your browser**:
    Navigate to `http://localhost:5173` to view the application.

## 📂 Project Structure

```text
src/
├── assets/              # Static assets (images, icons)
├── components/          # Reusable UI components & Sections
│   ├── Hero.jsx         # Main landing area with animated mesh
│   ├── Navigation.jsx   # Fixed top navbar with smooth scroll
│   ├── CompanySection.jsx # Mission & stats
│   ├── ProductSection.jsx # Features grid with glass cards
│   ├── MindsSection.jsx   # Team members (grayscale to color hover)
│   ├── ContactSection.jsx # Secure contact form
│   └── ...
├── App.jsx              # Main application component / entry point
├── index.css            # Global styles, variables, and typography
└── main.jsx             # React DOM root render
```

## 🎨 Theming & Customization

The project uses a mapped CSS variable system in `src/index.css` for easy theming.

**Key Variables:**

```css
:root {
  /* Backgrounds */
  --bg-dark: #0f172a;    /* Slate 900 */
  --bg-darker: #020617;  /* Slate 950 (Main Body) */
  
  /* Accents */
  --accent-primary: #38bdf8; /* Sky 400 */
  --accent-cyan: #06b6d4;    /* Cyan 500 */
  --accent-green: #10b981;   /* System Status Clean Green */
  
  /* Glass Effects */
  --card-surface: rgba(30, 41, 59, 0.4); 
  --glass-stroke: rgba(255, 255, 255, 0.08);
}
```

To change the primary brand color, simply update `--accent-primary` and `--accent-cyan`.

## 📜 Scripts

*   `npm run dev`: Starts the local development server.
*   `npm run build`: Builds the production-ready bundle.
*   `npm run preview`: Preview the production build locally.
*   `npm run lint`: Runs ESLint to check for code quality issues.
