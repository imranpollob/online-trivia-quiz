<template>
  <article class="question-card" :aria-label="`Question ${index + 1} of ${total}`">
    <!-- Timer Countdown Bar -->
    <div v-if="timerDuration > 0" class="timer-section" :class="{ 'timer-warning': timeLeft <= 5 }">
      <div class="timer-meta">
        <span class="timer-label">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="timer-icon" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          Time Remaining
        </span>
        <strong class="timer-digits">{{ timeLeft }}s</strong>
      </div>
      <div class="timer-track">
        <div class="timer-bar" :style="{ width: `${timerPercentage}%` }"></div>
      </div>
    </div>

    <header class="question-header">
      <div class="badge-group">
        <span class="badge difficulty" :class="question.difficulty">
          {{ difficultyLabel }}
        </span>
        <span v-if="question.category" class="badge category">
          {{ decodedCategory }}
        </span>
      </div>
      <span class="badge type-badge">{{ question.type === 'boolean' ? 'True / False' : 'Multiple Choice' }}</span>
    </header>

    <h2 class="question-text">{{ decodedQuestion }}</h2>

    <div class="answers-grid" role="group" aria-label="Answer options">
      <button
        v-for="(answer, answerIndex) in answers"
        :key="`${answerIndex}-${answer}`"
        type="button"
        class="answer-btn"
        :class="answerClass(answer)"
        :disabled="answered"
        :aria-pressed="selectedAnswer === answer"
        @click="selectAnswer(answer)"
      >
        <span class="shortcut-key" aria-hidden="true">{{ answerIndex + 1 }}</span>
        <span class="answer-label">{{ decodeHtml(answer) }}</span>
        <span v-if="answered && answer === question.correct_answer" class="feedback-icon correct" aria-label="Correct answer">✓</span>
        <span v-else-if="answered && answer === selectedAnswer && answer !== question.correct_answer" class="feedback-icon wrong" aria-label="Incorrect answer">✗</span>
      </button>
    </div>

    <footer class="question-footer">
      <div class="status-tip">
        <span v-if="!answered" class="key-hint">Press <strong>1 - {{ answers.length }}</strong> on keyboard to answer</span>
        <span v-else-if="answered && isCorrect" class="feedback-msg success">🎉 Spot on!</span>
        <span v-else-if="answered && timedOut" class="feedback-msg timeout">⏰ Time's up! The correct answer is highlighted.</span>
        <span v-else-if="answered" class="feedback-msg error">Keep going! The right answer is highlighted.</span>
      </div>

      <button
        type="button"
        class="btn-next"
        :disabled="!answered"
        @click="goToNext"
      >
        <span>{{ index + 1 === total ? 'See Results' : 'Next Question' }}</span>
        <span class="key-chip" aria-hidden="true">↵ Enter</span>
      </button>
    </footer>
  </article>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { decodeHtml } from '../utils/htmlDecode';
import { soundManager } from '../utils/audio';

const props = defineProps({
  question: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  timerDuration: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['answer', 'next']);

const selectedAnswer = ref('');
const answered = ref(false);
const answers = ref([]);
const isCorrect = ref(false);
const timedOut = ref(false);

const timeLeft = ref(props.timerDuration);
let timerInterval = null;

const decodedQuestion = computed(() => decodeHtml(props.question?.question));
const decodedCategory = computed(() => decodeHtml(props.question?.category));

const difficultyLabel = computed(() => {
  const raw = props.question?.difficulty;
  if (!raw) return 'Mixed';
  return raw.charAt(0).toUpperCase() + raw.slice(1);
});

const timerPercentage = computed(() => {
  if (!props.timerDuration) return 100;
  return Math.max(0, Math.min(100, (timeLeft.value / props.timerDuration) * 100));
});

const shuffleAnswers = options =>
  [...options]
    .map(option => ({ option, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ option }) => option);

const resetQuestion = () => {
  if (!props.question) return;

  if (props.question.type === 'boolean') {
    answers.value = ['True', 'False'];
  } else if (Array.isArray(props.question.answers) && props.question.answers.length) {
    answers.value = props.question.answers;
  } else {
    answers.value = shuffleAnswers([
      ...(props.question.incorrect_answers || []),
      props.question.correct_answer
    ]);
  }

  selectedAnswer.value = '';
  answered.value = false;
  isCorrect.value = false;
  timedOut.value = false;

  clearInterval(timerInterval);
  if (props.timerDuration > 0) {
    timeLeft.value = props.timerDuration;
    timerInterval = setInterval(() => {
      if (answered.value) {
        clearInterval(timerInterval);
        return;
      }
      timeLeft.value -= 1;
      if (timeLeft.value <= 3 && timeLeft.value > 0) {
        soundManager.playTick();
      }
      if (timeLeft.value <= 0) {
        clearInterval(timerInterval);
        handleTimeout();
      }
    }, 1000);
  }
};

watch(() => props.question, resetQuestion, { immediate: true });

const handleTimeout = () => {
  if (answered.value) return;
  timedOut.value = true;
  answered.value = true;
  isCorrect.value = false;
  soundManager.playIncorrect();
  emit('answer', {
    isCorrect: false,
    selected: 'Timeout (No Answer)',
    correctAnswer: props.question.correct_answer,
    questionText: decodedQuestion.value,
    category: decodedCategory.value,
    difficulty: props.question.difficulty
  });
};

const selectAnswer = answer => {
  if (answered.value) return;
  clearInterval(timerInterval);

  selectedAnswer.value = answer;
  answered.value = true;
  const correct = answer === props.question.correct_answer;
  isCorrect.value = correct;

  if (correct) {
    soundManager.playCorrect();
  } else {
    soundManager.playIncorrect();
  }

  emit('answer', {
    isCorrect: correct,
    selected: answer,
    correctAnswer: props.question.correct_answer,
    questionText: decodedQuestion.value,
    category: decodedCategory.value,
    difficulty: props.question.difficulty
  });
};

const goToNext = () => {
  if (!answered.value) return;
  soundManager.playClick();
  emit('next');
};

const answerClass = answer => {
  if (!answered.value) return '';
  if (answer === props.question.correct_answer) return 'correct';
  if (answer === selectedAnswer.value) return 'incorrect';
  return 'muted';
};

const handleKeyDown = e => {
  if (!answered.value) {
    const num = parseInt(e.key, 10);
    if (num >= 1 && num <= answers.value.length) {
      e.preventDefault();
      selectAnswer(answers.value[num - 1]);
    }
  } else if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    goToNext();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  clearInterval(timerInterval);
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<style scoped>
.question-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 32px;
  box-shadow: 0 10px 30px -10px rgba(13, 148, 136, 0.12), 0 4px 6px -2px rgba(15, 23, 42, 0.05);
  max-width: 720px;
  width: 100%;
  margin: 0 auto;
  display: grid;
  gap: 24px;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.timer-section {
  display: grid;
  gap: 8px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-border);
}

.timer-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timer-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
  color: var(--color-text-muted);
  font-weight: var(--font-weight-semibold);
}

.timer-icon {
  width: 14px;
  height: 14px;
}

.timer-digits {
  font-size: var(--font-size-sm);
  color: var(--color-primary);
}

.timer-track {
  height: 6px;
  background: rgba(13, 148, 136, 0.15);
  border-radius: var(--radius);
  overflow: hidden;
}

.timer-bar {
  height: 100%;
  background: var(--color-primary);
  border-radius: inherit;
  transition: width 1s linear, background-color 0.3s ease;
}

.timer-warning .timer-bar {
  background: var(--color-error);
}

.timer-warning .timer-digits {
  color: var(--color-error);
  animation: pulse 1s infinite;
}

.question-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}

.badge-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.badge {
  font-size: var(--font-size-xs);
  padding: 4px 10px;
  border-radius: var(--radius);
  font-weight: var(--font-weight-semibold);
  letter-spacing: var(--letter-spacing-wide);
  text-transform: uppercase;
}

.difficulty.easy {
  background: rgba(22, 163, 74, 0.12);
  color: var(--color-success);
  border: 1px solid rgba(22, 163, 74, 0.3);
}

.difficulty.medium {
  background: rgba(245, 158, 11, 0.12);
  color: var(--color-warning);
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.difficulty.hard {
  background: rgba(220, 38, 38, 0.12);
  color: var(--color-error);
  border: 1px solid rgba(220, 38, 38, 0.3);
}

.category {
  background: rgba(13, 148, 136, 0.12);
  color: var(--color-primary);
  border: 1px solid rgba(13, 148, 136, 0.25);
}

.type-badge {
  color: var(--color-text-muted);
  background: rgba(100, 116, 139, 0.1);
}

.question-text {
  font-family: var(--font-heading);
  font-size: var(--font-size-2xl);
  line-height: var(--line-height-snug);
  margin: 0;
  color: var(--color-text);
}

.answers-grid {
  display: grid;
  gap: 12px;
}

.answer-btn {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  border-radius: var(--radius);
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text);
  font-size: var(--font-size-base);
  text-align: left;
  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
}

.answer-btn:hover:not(:disabled) {
  border-color: var(--color-primary);
  background: var(--color-surface);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(13, 148, 136, 0.15);
}

.shortcut-key {
  width: 26px;
  height: 26px;
  display: grid;
  place-items: center;
  border-radius: var(--radius);
  background: rgba(13, 148, 136, 0.1);
  color: var(--color-primary);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  font-family: var(--font-mono);
  flex-shrink: 0;
}

.answer-label {
  flex: 1;
}

.feedback-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-weight: bold;
  font-size: 14px;
}

.feedback-icon.correct {
  background: var(--color-success);
  color: #ffffff;
}

.feedback-icon.wrong {
  background: var(--color-error);
  color: #ffffff;
}

.answer-btn.correct {
  background: rgba(22, 163, 74, 0.12);
  border-color: var(--color-success);
  color: var(--color-text);
  font-weight: var(--font-weight-semibold);
}

.answer-btn.correct .shortcut-key {
  background: var(--color-success);
  color: #ffffff;
}

.answer-btn.incorrect {
  background: rgba(220, 38, 38, 0.12);
  border-color: var(--color-error);
  color: var(--color-text);
}

.answer-btn.incorrect .shortcut-key {
  background: var(--color-error);
  color: #ffffff;
}

.answer-btn.muted {
  opacity: 0.55;
}

.answer-btn:disabled {
  cursor: default;
  transform: none;
}

.question-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 8px;
  padding-top: 16px;
  border-top: 1px solid var(--color-border);
}

.status-tip {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.key-hint strong {
  color: var(--color-primary);
}

.feedback-msg {
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
}

.feedback-msg.success {
  color: var(--color-success);
}

.feedback-msg.error,
.feedback-msg.timeout {
  color: var(--color-error);
}

.btn-next {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 22px;
  border-radius: var(--radius);
  background: var(--color-primary);
  color: #ffffff;
  border: none;
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(13, 148, 136, 0.2);
}

.btn-next:hover:not(:disabled) {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(13, 148, 136, 0.3);
}

.btn-next:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.key-chip {
  background: rgba(255, 255, 255, 0.25);
  font-size: var(--font-size-xs);
  padding: 2px 6px;
  border-radius: var(--radius);
  font-family: var(--font-mono);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@media (max-width: 640px) {
  .question-card {
    padding: 20px;
  }
  .question-text {
    font-size: var(--font-size-xl);
  }
  .question-footer {
    flex-direction: column;
    align-items: stretch;
  }
  .btn-next {
    justify-content: center;
  }
}
</style>
