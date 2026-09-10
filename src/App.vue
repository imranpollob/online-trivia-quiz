<template>
  <div class="app-shell">
    <Header
      :status="status"
      :score="score"
      :total="questionCount"
      :question-number="currentIndex"
      :streak="streak"
      :theme="theme"
      :muted="isMuted"
      @restart="restart"
      @toggle-theme="toggleTheme"
      @toggle-sound="toggleSound"
      @open-stats="showStatsModal = true"
    />

    <main class="content" role="main">
      <!-- Setup Screen -->
      <QuizSetup
        v-if="status === 'idle'"
        @start="startQuiz"
        @start-offline="startOfflineQuiz"
      />

      <!-- Loading Screen -->
      <div v-else-if="status === 'loading'" class="state-card" role="status" aria-live="polite">
        <div class="spinner-ring" aria-label="Loading fresh trivia"></div>
        <h2>Fetching Trivia</h2>
        <p>Preparing questions for your challenge…</p>
      </div>

      <!-- Error / Rate-limit Screen -->
      <div v-else-if="status === 'error'" class="state-card" role="alert">
        <div class="error-badge">⚠️</div>
        <h2>Trivia Request Notice</h2>
        <p>{{ errorMessage }}</p>
        <div class="state-actions">
          <button class="btn-primary" type="button" @click="retryFetch">
            Try Again
          </button>
          <button class="btn-offline" type="button" @click="startOfflineQuiz(lastSettings)">
            Play Offline Pack
          </button>
          <button class="btn-ghost" type="button" @click="restart">
            Change Setup
          </button>
        </div>
      </div>

      <!-- Active Question Screen -->
      <QuestionBox
        v-else-if="status === 'active' && currentQuestion"
        :question="currentQuestion"
        :index="currentIndex"
        :total="questionCount"
        :timer-duration="timerDuration"
        @answer="handleAnswer"
        @next="goToNextQuestion"
      />

      <!-- Completed Summary Screen -->
      <Completed
        v-else-if="status === 'complete'"
        :score="score"
        :total="questionCount"
        :settings="lastSettings"
        :max-streak="maxStreak"
        :history="questionHistory"
        @play-again="playAgain"
        @change-settings="restart"
      />
    </main>

    <!-- Lifetime Statistics Modal -->
    <StatsModal
      v-if="showStatsModal"
      :stats="userStats"
      @close="showStatsModal = false"
      @reset="resetLifetimeStats"
    />

    <!-- Brand Footer -->
    <footer class="app-footer">
      <p>
        Crafted by
        <a href="https://github.com/imranpollob" target="_blank" rel="noopener noreferrer">Imran Pollob</a>
        ·
        <a href="https://github.com/imranpollob/online-trivia-quiz" target="_blank" rel="noopener noreferrer">GitHub Repository</a>
      </p>
    </footer>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import axios from 'axios';

import Header from './components/Header.vue';
import QuestionBox from './components/QuestionBox.vue';
import Completed from './components/Completed.vue';
import QuizSetup from './components/QuizSetup.vue';
import StatsModal from './components/StatsModal.vue';

import { soundManager } from './utils/audio';
import { storage } from './utils/storage';
import { getFallbackQuestions } from './utils/fallbackQuestions';

const status = ref('idle');
const questions = ref([]);
const currentIndex = ref(0);
const score = ref(0);
const streak = ref(0);
const maxStreak = ref(0);
const errorMessage = ref('');
const lastSettings = ref(null);
const timerDuration = ref(0);
const questionHistory = ref([]);

const theme = ref('light');
const isMuted = ref(false);
const showStatsModal = ref(false);
const userStats = ref(storage.getStats());

const questionCount = computed(() => questions.value.length);
const currentQuestion = computed(() => questions.value[currentIndex.value]);

const shuffleAnswers = options =>
  [...options]
    .map(option => ({ option, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ option }) => option);

// Theme handling
const applyTheme = newTheme => {
  theme.value = newTheme;
  if (newTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  storage.setTheme(newTheme);
};

const toggleTheme = () => {
  const next = theme.value === 'dark' ? 'light' : 'dark';
  applyTheme(next);
};

// Sound handling
const toggleSound = () => {
  isMuted.value = !isMuted.value;
  soundManager.setMuted(isMuted.value);
  storage.setSoundMuted(isMuted.value);
  if (!isMuted.value) {
    soundManager.playClick();
  }
};

onMounted(() => {
  // Initialize theme
  const savedTheme = storage.getTheme();
  if (savedTheme === 'dark' || (savedTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    applyTheme('dark');
  } else {
    applyTheme('light');
  }

  // Initialize sound
  const muted = storage.getSoundMuted();
  isMuted.value = muted;
  soundManager.init(muted);
});

const startQuiz = async settings => {
  status.value = 'loading';
  errorMessage.value = '';
  lastSettings.value = { ...settings };
  timerDuration.value = settings.timer || 0;

  try {
    const params = new URLSearchParams();
    params.append('amount', settings.amount);
    if (settings.difficulty) params.append('difficulty', settings.difficulty);
    if (settings.category) params.append('category', settings.category);
    if (settings.type) params.append('type', settings.type);

    const { data } = await axios.get('https://opentdb.com/api.php', {
      params,
      timeout: 6000
    });

    if (data.response_code === 5) {
      throw new Error('OpenTDB rate limit reached (requests must be spaced out). You can play the instant offline pack right now!');
    }

    if (!data.results || !data.results.length) {
      throw new Error('No questions match this combination of category and difficulty. Try adjusting filters or play the offline pack.');
    }

    const timestamp = Date.now();
    questions.value = data.results.map((q, idx) => ({
      id: `${timestamp}-${idx}`,
      ...q,
      answers: q.type === 'boolean'
        ? ['True', 'False']
        : shuffleAnswers([...(q.incorrect_answers || []), q.correct_answer])
    }));

    initializeQuizState();
  } catch (err) {
    errorMessage.value = err.message || 'Unable to load questions from OpenTDB right now.';
    status.value = 'error';
  }
};

const startOfflineQuiz = (settings = {}) => {
  const mergedSettings = {
    amount: 10,
    difficulty: '',
    category: '',
    type: '',
    timer: 0,
    categoryName: 'Curated Offline Pack',
    ...settings
  };

  lastSettings.value = mergedSettings;
  timerDuration.value = mergedSettings.timer || 0;

  const rawQuestions = getFallbackQuestions(mergedSettings);
  const timestamp = Date.now();

  questions.value = rawQuestions.map((q, idx) => ({
    id: `offline-${timestamp}-${idx}`,
    ...q,
    answers: q.type === 'boolean'
      ? ['True', 'False']
      : shuffleAnswers([...(q.incorrect_answers || []), q.correct_answer])
  }));

  initializeQuizState();
};

const initializeQuizState = () => {
  currentIndex.value = 0;
  score.value = 0;
  streak.value = 0;
  maxStreak.value = 0;
  questionHistory.value = [];
  status.value = 'active';
};

const handleAnswer = answerPayload => {
  questionHistory.value.push(answerPayload);

  if (answerPayload.isCorrect) {
    score.value += 1;
    streak.value += 1;
    if (streak.value > maxStreak.value) {
      maxStreak.value = streak.value;
    }
  } else {
    streak.value = 0;
  }
};

const goToNextQuestion = () => {
  if (currentIndex.value + 1 >= questionCount.value) {
    status.value = 'complete';
    // Record stats to localStorage
    userStats.value = storage.recordQuiz(score.value, questionCount.value, maxStreak.value);
  } else {
    currentIndex.value += 1;
  }
};

const restart = () => {
  status.value = 'idle';
  questions.value = [];
  currentIndex.value = 0;
  score.value = 0;
  streak.value = 0;
  maxStreak.value = 0;
  errorMessage.value = '';
  questionHistory.value = [];
};

const playAgain = () => {
  if (lastSettings.value) {
    if (lastSettings.value.useOffline) {
      startOfflineQuiz(lastSettings.value);
    } else {
      startQuiz(lastSettings.value);
    }
  } else {
    restart();
  }
};

const retryFetch = () => {
  if (lastSettings.value) {
    startQuiz(lastSettings.value);
  } else {
    status.value = 'idle';
  }
};

const resetLifetimeStats = () => {
  userStats.value = storage.resetStats();
};
</script>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  flex: 1;
  display: grid;
  place-items: center;
  padding: 32px 24px;
}

.state-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 40px 32px;
  box-shadow: 0 10px 30px -10px rgba(13, 148, 136, 0.12);
  max-width: 480px;
  width: 100%;
  text-align: center;
  display: grid;
  gap: 16px;
  justify-items: center;
}

.error-badge {
  font-size: 36px;
}

.state-card h2 {
  margin: 0;
  font-size: var(--font-size-2xl);
}

.state-card p {
  margin: 0;
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-normal);
}

.spinner-ring {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 4px solid rgba(13, 148, 136, 0.15);
  border-top-color: var(--color-primary);
  animation: spin 0.9s linear infinite;
}

.state-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 8px;
}

.btn-primary,
.btn-offline,
.btn-ghost {
  padding: 10px 18px;
  border-radius: var(--radius);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
}

.btn-primary {
  background: var(--color-primary);
  color: #ffffff;
}

.btn-primary:hover {
  background: var(--color-primary-hover);
}

.btn-offline {
  background: rgba(13, 148, 136, 0.12);
  color: var(--color-primary);
  border: 1px solid rgba(13, 148, 136, 0.3);
}

.btn-offline:hover {
  background: rgba(13, 148, 136, 0.2);
}

.btn-ghost {
  background: transparent;
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
}

.btn-ghost:hover {
  color: var(--color-text);
}

.app-footer {
  padding: 20px 24px;
  text-align: center;
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  border-top: 1px solid var(--color-border);
  background: var(--color-surface);
}

.app-footer p {
  margin: 0;
}

.app-footer a {
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 640px) {
  .content {
    padding: 16px 12px;
  }
  .state-card {
    padding: 28px 18px;
  }
}
</style>
