# Online Trivia Quiz

A clean, responsive trivia quiz web app built with Vue 3 and Vite. Test your knowledge across multiple categories, customize question difficulty, challenge yourself with a countdown timer, and track your streaks — completely client-side with no backend needed.

**[Play the Live Quiz →](https://imranpollob.github.io/online-trivia-quiz/)**

---

## Features

- **Customizable Quizzes**: Pick how many questions you want (5 to 25), select a difficulty (Easy, Medium, Hard), choose question format (Multiple Choice or True/False), or focus on a specific category.
- **Timer Challenge Mode**: Play relaxed with no time limit, or turn on a 15-second or 30-second timer per question for extra challenge.
- **Full Keyboard Navigation**: Answer questions using number keys `1`–`4`, and hit `Enter` or `Space` to jump to the next question.
- **Subtle Sound Effects**: Procedural audio for starting a quiz, picking answers, hearing results, and finishing the game. Sounds are synthesized in the browser without downloading audio files and can be muted anytime from the header.
- **Post-Quiz Question Review**: Review all your answers at the end of every round, with quick filters for correct and missed questions.
- **Streaks & Lifetime Stats**: Tracks your total quizzes played, overall accuracy, and personal best streaks in local storage.
- **Offline Question Pack**: If the trivia API is slow, rate-limited, or unavailable, you can switch immediately to a curated offline question pack with one click.
- **Light & Dark Mode**: Adapts to your system theme by default, with a manual toggle in the header.
- **Shareable Scores**: Easily share your results with friends using the native share menu or by copying formatted score text to your clipboard.

---

## Keyboard Shortcuts

| Key | Action |
| --- | --- |
| `1` – `4` | Select answer options |
| `Enter` / `Space` | Advance to the next question |
| `Esc` | Close Lifetime Stats dialog |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- npm

### Installation & Local Run

```bash
# Clone the repository
git clone https://github.com/imranpollob/online-trivia-quiz.git
cd online-trivia-quiz

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

### Build & Scripts

```bash
npm run build    # Build production bundle in ./dist
npm run preview  # Preview the production build locally
npm run lint     # Check code with ESLint
```

---

## Tech Stack

- **Framework**: [Vue 3](https://vuejs.org/) (Composition API, `<script setup>`)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Trivia API**: [Open Trivia Database](https://opentdb.com/)
- **Audio**: Web Audio API (procedural synthesis, no audio assets)
- **Design Tokens**: [Personal Brand Theme](https://github.com/imranpollob/personal-brand-theme)

---

## License

Distributed under the [MIT License](LICENSE). Built by [Imran Pollob](https://github.com/imranpollob).
