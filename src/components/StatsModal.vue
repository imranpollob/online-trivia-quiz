<template>
  <div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="stats-modal-title" @click.self="emit('close')">
    <div class="modal-card">
      <header class="modal-header">
        <div class="modal-title-group">
          <svg class="trophy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
          </svg>
          <h2 id="stats-modal-title">Lifetime Performance</h2>
        </div>
        <button class="icon-close" type="button" aria-label="Close modal" @click="emit('close')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </header>

      <div class="stats-grid">
        <div class="stat-box">
          <span class="stat-label">Quizzes Played</span>
          <strong class="stat-value">{{ stats.quizzesPlayed }}</strong>
        </div>

        <div class="stat-box">
          <span class="stat-label">Total Answered</span>
          <strong class="stat-value">{{ stats.totalQuestions }}</strong>
        </div>

        <div class="stat-box">
          <span class="stat-label">Overall Accuracy</span>
          <strong class="stat-value">{{ overallAccuracy }}%</strong>
        </div>

        <div class="stat-box">
          <span class="stat-label">Best Streak</span>
          <strong class="stat-value streak">🔥 {{ stats.bestStreak }}</strong>
        </div>

        <div class="stat-box">
          <span class="stat-label">Best Quiz Accuracy</span>
          <strong class="stat-value">{{ stats.bestAccuracy }}%</strong>
        </div>

        <div class="stat-box">
          <span class="stat-label">Total Correct</span>
          <strong class="stat-value correct">{{ stats.correctAnswers }}</strong>
        </div>
      </div>

      <footer class="modal-footer">
        <button
          v-if="stats.quizzesPlayed > 0"
          type="button"
          class="btn-reset"
          @click="handleReset"
        >
          {{ confirmingReset ? 'Are you sure? Click to confirm' : 'Reset statistics' }}
        </button>
        <button type="button" class="btn-primary" @click="emit('close')">
          Done
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';

const props = defineProps({
  stats: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'reset']);

const confirmingReset = ref(false);

const overallAccuracy = computed(() => {
  if (!props.stats.totalQuestions) return 0;
  return Math.round((props.stats.correctAnswers / props.stats.totalQuestions) * 100);
});

const handleReset = () => {
  if (!confirmingReset.value) {
    confirmingReset.value = true;
    setTimeout(() => {
      confirmingReset.value = false;
    }, 4000);
  } else {
    emit('reset');
    confirmingReset.value = false;
  }
};

const handleKeyDown = e => {
  if (e.key === 'Escape') {
    emit('close');
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(7, 19, 17, 0.65);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

.modal-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  max-width: 480px;
  width: 100%;
  padding: 24px;
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.25s ease;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-border);
}

.modal-title-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.trophy-icon {
  width: 24px;
  height: 24px;
  color: var(--color-primary);
}

h2 {
  font-size: var(--font-size-xl);
  margin: 0;
  color: var(--color-text);
}

.icon-close {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: var(--radius);
  color: var(--color-text-muted);
  display: grid;
  place-items: center;
  transition: color 0.2s ease, background-color 0.2s ease;
}

.icon-close svg {
  width: 20px;
  height: 20px;
}

.icon-close:hover {
  color: var(--color-text);
  background: rgba(13, 148, 136, 0.1);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.stat-box {
  background: rgba(13, 148, 136, 0.05);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
  color: var(--color-text-muted);
  font-weight: var(--font-weight-semibold);
}

.stat-value {
  font-size: var(--font-size-2xl);
  font-family: var(--font-heading);
  color: var(--color-text);
  line-height: 1.1;
}

.stat-value.streak {
  color: var(--color-warning);
}

.stat-value.correct {
  color: var(--color-success);
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.btn-reset {
  background: transparent;
  border: none;
  color: var(--color-error);
  font-size: var(--font-size-xs);
  cursor: pointer;
  padding: 8px 12px;
  border-radius: var(--radius);
  transition: background-color 0.2s ease;
}

.btn-reset:hover {
  background: rgba(220, 38, 38, 0.1);
}

.btn-primary {
  margin-left: auto;
  background: var(--color-primary);
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  border-radius: var(--radius);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-primary:hover {
  background: var(--color-primary-hover);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
