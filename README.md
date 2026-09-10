<div align="center">
  <img src="public/logo.png" alt="Imran Pollob Logo" width="80" height="80" />
  <h1>Online Trivia Quiz</h1>
  <p><strong>Personal Brand Edition · Built with Vue 3 & Vite</strong></p>

  <p>
    <a href="https://imranpollob.github.io/online-trivia-quiz/"><strong>Play Live Demo →</strong></a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Vue-3.4-0d9488?logo=vuedotjs" alt="Vue 3" />
    <img src="https://img.shields.io/badge/Vite-5.1-0d9488?logo=vite" alt="Vite" />
    <img src="https://img.shields.io/badge/License-MIT-0d9488" alt="License" />
    <img src="https://img.shields.io/badge/Backend-100%25%20Serverless%20%2F%20Client--Side-0d9488" alt="Serverless" />
    <img src="https://img.shields.io/badge/Deploy-GitHub%20Pages-0d9488?logo=github" alt="GitHub Pages" />
  </p>
</div>

---

A high-performance, accessible, and beautifully styled trivia quiz game built strictly following the **Imran Pollob Personal Brand Style** (teal palette `#0d9488`, Playfair Display serif headings, Plus Jakarta Sans body typography, 8px curvature, and 4px rhythm).

The game is **100% client-side** and requires no backend server. Questions can be dynamically pulled from the Open Trivia Database API or played instantly with the built-in offline question pack.

---

## 🌟 Highlights & Features

- **Personal Brand Design System**:
  - Signature teal palette (`#0d9488` light / `#14b8a6` dark)
  - Editorial font pairing (*Playfair Display* & *Plus Jakarta Sans*)
  - Dark Mode & Light Mode with seamless transition and persistent memory
  - Official "iP" brand monogram logo

- **Usability & Accessibility (a11y)**:
  - **Keyboard Navigation**: Press keys `1`–`4` to answer; press `Enter` or `Space` to advance to the next question.
  - **Web Audio Sound Effects**: Zero external audio downloads; uses procedural Web Audio API synthesizers for clicks, correct chimes, incorrect tones, and victory fanfares.
  - **Mute / Unmute Control**: Easy sound toggle with memory saved in `localStorage`.
  - **Timer Challenge Mode**: Choose untimed (relaxed), 15 seconds (fast-paced), or 30 seconds per question with animated countdown bars and urgency indicators.

- **Offline & Rate-Limit Resilience**:
  - Automatically handles OpenTDB API rate-limiting (HTTP 429) or offline network states.
  - Built-in curated offline question bank covering Science, History, Geography, and General Knowledge.

- **Results & Deep Review**:
  - Post-quiz review mode letting you inspect every answered question.
  - Filter by *All*, *Correct*, or *Missed* answers.
  - One-click score sharing via the Web Share API or Clipboard copy with streak highlights.

- **Lifetime Statistics & Tracking**:
  - Tracks quizzes completed, lifetime questions answered, overall accuracy %, best streak, and best score in `localStorage`.

- **SEO & Social Optimization**:
  - Full Open Graph and Twitter Card tags.
  - JSON-LD Structured Data for `WebApplication` & `Quiz`.
  - PWA Web App Manifest (`manifest.webmanifest`), `robots.txt`, and `sitemap.xml`.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
| --- | --- |
| `1` – `4` | Select answer choice 1 through 4 |
| `Enter` / `Space` | Move to next question / Submit |
| `Esc` | Close Lifetime Stats modal |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm 9+

### Installation

```bash
git clone https://github.com/imranpollob/online-trivia-quiz.git
cd online-trivia-quiz
npm install
```

### Development Server

```bash
npm run dev
```

Open the printed URL (default `http://localhost:5173`) in your browser.

### Production Build

```bash
npm run build
```

Generates optimized, static assets in `./dist`.

### Local Preview

```bash
npm run preview
```

---

## 🌐 GitHub Pages Deployment

This repository includes an automated GitHub Actions deployment workflow located at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

To deploy:
1. Push your changes to the `master` branch on GitHub:
   ```bash
   git push origin master
   ```
2. In your GitHub repository settings, navigate to **Settings** → **Pages**:
   - Under **Build and deployment** → **Source**, select **GitHub Actions**.
3. Once the workflow finishes, your site is live at:
   `https://imranpollob.github.io/online-trivia-quiz/`

---

## 🎨 Brand Design Tokens

This project implements tokens from the [Personal Brand Theme](https://imranpollob.github.io/personal-brand-theme/):

```css
--color-primary: #0d9488;
--color-primary-hover: #0f766e;
--color-background: #ecfdfb;
--color-surface: #f8fafc;
--color-text: #0f172a;
--radius: 8px;
--spacing-unit: 4px;
```

---

## 📄 License

Distributed under the MIT License. Built with ❤️ by [Imran Pollob](https://github.com/imranpollob).
