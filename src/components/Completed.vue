<template>
  <section class="summary-card" aria-label="Quiz Results Summary">
    <div class="summary-header">
      <div class="result-badge" :class="performanceLevel">
        {{ performanceEmoji }}
      </div>
      <h2>{{ headlineMessage }}</h2>
      <p class="subtitle">
        You scored <strong>{{ score }}</strong> out of <strong>{{ total }}</strong> questions correctly.
      </p>
    </div>

    <!-- Main Stats Highlights -->
    <div class="stats-overview">
      <div class="overview-box accuracy-box">
        <span class="box-label">Accuracy</span>
        <strong class="box-value">{{ accuracy }}%</strong>
      </div>
      <div class="overview-box streak-box">
        <span class="box-label">Max Streak</span>
        <strong class="box-value">🔥 {{ maxStreak }}</strong>
      </div>
      <div class="overview-box">
        <span class="box-label">Difficulty</span>
        <strong class="box-value text-sm">{{ difficultyLabel }}</strong>
      </div>
      <div class="overview-box">
        <span class="box-label">Category</span>
        <strong class="box-value text-sm truncate" :title="settings?.categoryName || 'Any Category'">
          {{ settings?.categoryName || 'Any Category' }}
        </strong>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="summary-actions">
      <button class="btn-primary" type="button" @click="emit('play-again')">
        <span>Play Again</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="action-icon" aria-hidden="true">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
      </button>

      <button class="btn-share" type="button" @click="shareScore">
        <span>{{ shareCopied ? 'Copied to Clipboard!' : 'Share Results' }}</span>
        <svg v-if="shareCopied" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="action-icon" aria-hidden="true">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="action-icon" aria-hidden="true">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      </button>

      <button class="btn-secondary" type="button" @click="emit('change-settings')">
        Change Settings
      </button>
    </div>

    <!-- Question Review Section -->
    <div v-if="history.length" class="review-section">
      <div class="review-header">
        <h3>Question Review</h3>
        <div class="review-filter-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            class="tab-btn"
            :class="{ active: reviewFilter === 'all' }"
            @click="reviewFilter = 'all'"
          >
            All ({{ history.length }})
          </button>
          <button
            type="button"
            role="tab"
            class="tab-btn"
            :class="{ active: reviewFilter === 'correct' }"
            @click="reviewFilter = 'correct'"
          >
            Correct ({{ correctCount }})
          </button>
          <button
            type="button"
            role="tab"
            class="tab-btn"
            :class="{ active: reviewFilter === 'incorrect' }"
            @click="reviewFilter = 'incorrect'"
          >
            Missed ({{ incorrectCount }})
          </button>
        </div>
      </div>

      <div class="review-list">
        <div
          v-for="(item, i) in filteredHistory"
          :key="i"
          class="review-item"
          :class="{ correct: item.isCorrect, incorrect: !item.isCorrect }"
        >
          <div class="review-item-header">
            <span class="review-number">#{{ i + 1 }}</span>
            <span class="review-status-badge">
              {{ item.isCorrect ? '✓ Correct' : '✗ Missed' }}
            </span>
          </div>

          <p class="review-question">{{ item.questionText }}</p>

          <div class="review-answers">
            <div class="user-answer" :class="{ wrong: !item.isCorrect }">
              <span class="answer-tag">Your answer:</span>
              <span>{{ item.selected }}</span>
            </div>
            <div v-if="!item.isCorrect" class="correct-answer">
              <span class="answer-tag">Correct answer:</span>
              <span>{{ item.correctAnswer }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { soundManager } from '../utils/audio';

const props = defineProps({
  score: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  settings: {
    type: Object,
    default: null
  },
  maxStreak: {
    type: Number,
    default: 0
  },
  history: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['play-again', 'change-settings']);

const shareCopied = ref(false);
const reviewFilter = ref('all');

const accuracy = computed(() => {
  if (!props.total) return 0;
  return Math.round((props.score / props.total) * 100);
});

const difficultyLabel = computed(() => {
  const diff = props.settings?.difficulty;
  if (!diff) return 'Any Difficulty';
  return diff.charAt(0).toUpperCase() + diff.slice(1);
});

const performanceLevel = computed(() => {
  if (accuracy.value >= 80) return 'high';
  if (accuracy.value >= 50) return 'medium';
  return 'low';
});

const performanceEmoji = computed(() => {
  if (accuracy.value === 100) return '🏆';
  if (accuracy.value >= 80) return '🌟';
  if (accuracy.value >= 50) return '👏';
  return '📚';
});

const headlineMessage = computed(() => {
  if (accuracy.value === 100) return 'Flawless Victory!';
  if (accuracy.value >= 80) return 'Outstanding Knowledge!';
  if (accuracy.value >= 50) return 'Great Job!';
  return 'Good Effort!';
});

const correctCount = computed(() => props.history.filter(h => h.isCorrect).length);
const incorrectCount = computed(() => props.history.filter(h => !h.isCorrect).length);

const filteredHistory = computed(() => {
  if (reviewFilter.value === 'correct') {
    return props.history.filter(h => h.isCorrect);
  }
  if (reviewFilter.value === 'incorrect') {
    return props.history.filter(h => !h.isCorrect);
  }
  return props.history;
});

const shareScore = async () => {
  const shareText = `🧠 I scored ${props.score}/${props.total} (${accuracy.value}%) on Online Trivia Quiz by Imran Pollob!\n🔥 Highest streak: ${props.maxStreak}\nCan you beat my score? Play here: https://imranpollob.github.io/online-trivia-quiz/`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: 'My Trivia Score',
        text: shareText,
        url: 'https://imranpollob.github.io/online-trivia-quiz/'
      });
      return;
    } catch {
      // Fallback to clipboard
    }
  }

  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(shareText);
      shareCopied.value = true;
      soundManager.playClick();
      setTimeout(() => {
        shareCopied.value = false;
      }, 3000);
    } catch {
      // Clipboard failed
    }
  }
};

onMounted(() => {
  if (accuracy.value >= 70) {
    soundManager.playVictory();
  }
});
</script>

<style scoped>
.summary-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 36px 32px;
  box-shadow: 0 10px 30px -10px rgba(13, 148, 136, 0.12), 0 4px 6px -2px rgba(15, 23, 42, 0.05);
  max-width: 680px;
  width: 100%;
  margin: 0 auto;
  text-align: center;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.summary-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
}

.result-badge {
  font-size: 40px;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: rgba(13, 148, 136, 0.1);
  margin-bottom: 12px;
}

h2 {
  font-size: var(--font-size-3xl);
  margin: 0 0 6px;
  color: var(--color-text);
}

.subtitle {
  color: var(--color-text-muted);
  font-size: var(--font-size-base);
  margin: 0;
}

.subtitle strong {
  color: var(--color-text);
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 28px;
}

.overview-box {
  background: rgba(13, 148, 136, 0.05);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.box-label {
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
  color: var(--color-text-muted);
  font-weight: var(--font-weight-semibold);
}

.box-value {
  font-size: var(--font-size-xl);
  font-family: var(--font-heading);
  color: var(--color-text);
}

.accuracy-box .box-value {
  color: var(--color-primary);
}

.streak-box .box-value {
  color: var(--color-warning);
}

.text-sm {
  font-size: var(--font-size-sm);
  font-family: var(--font-family);
  font-weight: var(--font-weight-semibold);
}

.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.summary-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 32px;
}

.btn-primary,
.btn-share,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: var(--radius);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-primary {
  background: var(--color-primary);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(13, 148, 136, 0.25);
}

.btn-primary:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
}

.btn-share {
  background: rgba(13, 148, 136, 0.12);
  color: var(--color-primary);
  border: 1px solid rgba(13, 148, 136, 0.3);
}

.btn-share:hover {
  background: rgba(13, 148, 136, 0.2);
}

.btn-secondary {
  background: transparent;
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover {
  color: var(--color-text);
  border-color: var(--color-text-muted);
}

.action-icon {
  width: 16px;
  height: 16px;
}

/* Question Review Section */
.review-section {
  text-align: left;
  border-top: 1px solid var(--color-border);
  padding-top: 24px;
}

.review-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

.review-header h3 {
  font-size: var(--font-size-lg);
  margin: 0;
}

.review-filter-tabs {
  display: flex;
  gap: 6px;
}

.tab-btn {
  background: transparent;
  border: 1px solid var(--color-border);
  padding: 6px 12px;
  border-radius: var(--radius);
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn.active {
  background: var(--color-primary);
  color: #ffffff;
  border-color: var(--color-primary);
}

.review-list {
  display: grid;
  gap: 12px;
  max-height: 380px;
  overflow-y: auto;
  padding-right: 4px;
}

.review-item {
  padding: 14px;
  border-radius: var(--radius);
  border: 1px solid var(--color-border);
  background: var(--color-background);
}

.review-item.correct {
  border-left: 4px solid var(--color-success);
}

.review-item.incorrect {
  border-left: 4px solid var(--color-error);
}

.review-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.review-number {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-muted);
}

.review-status-badge {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
}

.correct .review-status-badge {
  color: var(--color-success);
}

.incorrect .review-status-badge {
  color: var(--color-error);
}

.review-question {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  margin: 0 0 8px;
  color: var(--color-text);
}

.review-answers {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: var(--font-size-xs);
}

.answer-tag {
  color: var(--color-text-muted);
  margin-right: 6px;
  font-weight: var(--font-weight-semibold);
}

.user-answer.wrong {
  color: var(--color-error);
}

.correct-answer {
  color: var(--color-success);
  font-weight: var(--font-weight-medium);
}

@media (max-width: 600px) {
  .summary-card {
    padding: 24px 16px;
  }
  .stats-overview {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
