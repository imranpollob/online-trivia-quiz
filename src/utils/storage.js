/**
 * LocalStorage manager for theme, sound, and lifetime stats.
 */

const THEME_KEY = 'trivia_quiz_theme';
const SOUND_KEY = 'trivia_quiz_sound';
const STATS_KEY = 'trivia_quiz_stats_v1';

const defaultStats = {
  quizzesPlayed: 0,
  totalQuestions: 0,
  correctAnswers: 0,
  bestStreak: 0,
  bestAccuracy: 0
};

export const storage = {
  getTheme() {
    try {
      return localStorage.getItem(THEME_KEY) || 'system';
    } catch {
      return 'system';
    }
  },

  setTheme(theme) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // Ignore
    }
  },

  getSoundMuted() {
    try {
      const val = localStorage.getItem(SOUND_KEY);
      return val === 'true';
    } catch {
      return false;
    }
  },

  setSoundMuted(isMuted) {
    try {
      localStorage.setItem(SOUND_KEY, isMuted ? 'true' : 'false');
    } catch {
      // Ignore
    }
  },

  getStats() {
    try {
      const raw = localStorage.getItem(STATS_KEY);
      if (!raw) return { ...defaultStats };
      return { ...defaultStats, ...JSON.parse(raw) };
    } catch {
      return { ...defaultStats };
    }
  },

  recordQuiz(score, total, maxStreak) {
    try {
      const current = this.getStats();
      const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;

      const updated = {
        quizzesPlayed: current.quizzesPlayed + 1,
        totalQuestions: current.totalQuestions + total,
        correctAnswers: current.correctAnswers + score,
        bestStreak: Math.max(current.bestStreak, maxStreak || 0),
        bestAccuracy: Math.max(current.bestAccuracy, accuracy)
      };

      localStorage.setItem(STATS_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      return { ...defaultStats };
    }
  },

  resetStats() {
    try {
      localStorage.removeItem(STATS_KEY);
      return { ...defaultStats };
    } catch {
      return { ...defaultStats };
    }
  }
};
