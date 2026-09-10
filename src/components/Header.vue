<template>
  <header class="app-header" :class="status">
    <div class="brand-container">
      <a href="#" class="brand-link" @click.prevent="handleBrandClick">
        <img src="../assets/logo.png" alt="Imran Pollob Brand Logo" class="brand-logo" />
        <div class="brand-text">
          <span class="brand-title">Online Trivia</span>
          <span class="brand-by">by Imran Pollob</span>
        </div>
      </a>
    </div>

    <div class="controls-container">
      <!-- In-Quiz Progress Bar -->
      <div v-if="showProgress" class="quiz-progress-section">
        <div class="progress-track" role="progressbar" :aria-valuenow="questionNumber + 1" :aria-valuemin="1" :aria-valuemax="total">
          <div class="progress-bar" :style="{ width: progressWidth }"></div>
        </div>
        <span class="progress-text">{{ questionNumber + 1 }} / {{ total }}</span>
      </div>

      <!-- Streak Pill -->
      <div v-if="streak > 1 && status === 'active'" class="streak-pill" title="Consecutive correct answers">
        <span>🔥 {{ streak }}</span>
      </div>

      <!-- Score Pill -->
      <div v-if="showScore" class="score-pill">
        <span class="score-label">Score</span>
        <strong class="score-value">{{ score }}<span v-if="total">/{{ total }}</span></strong>
      </div>

      <!-- Header Icon Controls -->
      <div class="icon-actions">
        <!-- Stats Modal Trigger -->
        <button
          type="button"
          class="icon-btn"
          aria-label="View lifetime statistics"
          title="Lifetime Stats"
          @click="emit('open-stats')"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
          </svg>
        </button>

        <!-- Sound Toggle -->
        <button
          type="button"
          class="icon-btn"
          :aria-label="muted ? 'Unmute sounds' : 'Mute sounds'"
          :title="muted ? 'Sound Muted' : 'Sound Enabled'"
          @click="emit('toggle-sound')"
        >
          <svg v-if="muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        </button>

        <!-- Dark / Light Theme Toggle -->
        <button
          type="button"
          class="icon-btn"
          :aria-label="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
          :title="theme === 'dark' ? 'Light Mode' : 'Dark Mode'"
          @click="emit('toggle-theme')"
        >
          <svg v-if="theme === 'dark'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        </button>

        <!-- Active Quiz Action: End Quiz Early -->
        <button
          v-if="status === 'active'"
          type="button"
          class="btn-end-quiz"
          title="End quiz now and see your results"
          @click="emit('end-quiz')"
        >
          End Quiz
        </button>

        <!-- Finished / Error Action: New Quiz -->
        <button
          v-else-if="status === 'complete' || status === 'error'"
          type="button"
          class="btn-restart"
          @click="emit('restart')"
        >
          New Quiz
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  status: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    default: 0
  },
  questionNumber: {
    type: Number,
    default: 0
  },
  streak: {
    type: Number,
    default: 0
  },
  theme: {
    type: String,
    default: 'light'
  },
  muted: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['restart', 'toggle-theme', 'toggle-sound', 'open-stats', 'end-quiz', 'brand-click']);

const handleBrandClick = () => {
  if (props.status === 'active') {
    emit('brand-click');
  } else {
    emit('restart');
  }
};

const showProgress = computed(() => props.status === 'active' && props.total > 0);
const showScore = computed(() => ['active', 'complete'].includes(props.status));

const progressWidth = computed(() => {
  if (!showProgress.value) return '0%';
  const progress = ((props.questionNumber + 1) / props.total) * 100;
  return `${Math.min(progress, 100)}%`;
});
</script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.brand-container {
  display: flex;
  align-items: center;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: inherit;
}

.brand-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
  border-radius: var(--radius);
  transition: transform 0.2s ease;
}

.brand-link:hover .brand-logo {
  transform: scale(1.05);
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-title {
  font-family: var(--font-heading);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  line-height: 1.1;
}

.brand-by {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  letter-spacing: var(--letter-spacing-wide);
}

.controls-container {
  display: flex;
  align-items: center;
  gap: 16px;
}

.quiz-progress-section {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 140px;
}

.progress-track {
  position: relative;
  flex: 1;
  height: 8px;
  background: rgba(13, 148, 136, 0.15);
  border-radius: var(--radius);
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--brand-500), var(--color-primary));
  border-radius: inherit;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.progress-text {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-muted);
  min-width: 44px;
}

.streak-pill {
  background: rgba(245, 158, 11, 0.15);
  color: var(--color-warning);
  border: 1px solid rgba(245, 158, 11, 0.3);
  padding: 4px 10px;
  border-radius: var(--radius);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  display: flex;
  align-items: center;
  animation: pulse 2s infinite;
}

.score-pill {
  display: flex;
  align-items: baseline;
  gap: 6px;
  padding: 4px 10px;
  border-radius: var(--radius);
  background: rgba(13, 148, 136, 0.1);
  border: 1px solid rgba(13, 148, 136, 0.2);
}

.score-label {
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
  color: var(--color-text-muted);
  font-weight: var(--font-weight-semibold);
}

.score-value {
  font-size: var(--font-size-base);
  color: var(--color-primary);
}

.icon-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-btn {
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  width: 36px;
  height: 36px;
  border-radius: var(--radius);
  display: grid;
  place-items: center;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
}

.icon-btn svg {
  width: 18px;
  height: 18px;
}

.icon-btn:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
  background-color: rgba(13, 148, 136, 0.08);
}

.btn-restart {
  padding: 8px 14px;
  border-radius: var(--radius);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-restart:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #ffffff;
}

.btn-end-quiz {
  padding: 8px 14px;
  border-radius: var(--radius);
  border: 1px solid rgba(220, 38, 38, 0.35);
  background: rgba(220, 38, 38, 0.08);
  color: var(--color-error);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-end-quiz:hover {
  background: var(--color-error);
  border-color: var(--color-error);
  color: #ffffff;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@media (max-width: 640px) {
  .app-header {
    padding: 12px 16px;
  }
  .brand-by {
    display: none;
  }
  .quiz-progress-section {
    min-width: 80px;
  }
}
</style>
