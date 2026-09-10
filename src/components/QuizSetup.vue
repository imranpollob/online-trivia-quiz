<template>
  <div class="setup-card">
    <div class="setup-header">
      <h2>Configure Your Quiz</h2>
      <p>Customize your questions, select your difficulty, and set a challenge timer.</p>
    </div>

    <form class="setup-form" @submit.prevent="submit">
      <div class="form-row">
        <label for="quiz-amount">
          Questions
          <div class="select-wrapper">
            <select id="quiz-amount" v-model.number="form.amount">
              <option v-for="option in amountOptions" :key="option" :value="option">
                {{ option }} Questions
              </option>
            </select>
          </div>
        </label>

        <label for="quiz-difficulty">
          Difficulty
          <div class="select-wrapper">
            <select id="quiz-difficulty" v-model="form.difficulty">
              <option value="">Any Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </label>
      </div>

      <div class="form-row">
        <label for="quiz-type">
          Question Type
          <div class="select-wrapper">
            <select id="quiz-type" v-model="form.type">
              <option value="">Any Type</option>
              <option value="multiple">Multiple Choice</option>
              <option value="boolean">True / False</option>
            </select>
          </div>
        </label>

        <label for="quiz-timer">
          Timer Mode
          <div class="select-wrapper">
            <select id="quiz-timer" v-model.number="form.timer">
              <option :value="0">Untimed (Relaxed)</option>
              <option :value="15">15 Seconds (Fast-paced)</option>
              <option :value="30">30 Seconds (Standard)</option>
            </select>
          </div>
        </label>
      </div>

      <label for="quiz-category">
        Category
        <div class="select-wrapper">
          <select id="quiz-category" v-model="form.category">
            <option value="">Any Category (Mixed Trivia)</option>
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
        </div>
      </label>

      <div v-if="categoryError" class="category-notice">
        <span>{{ categoryError }}</span>
      </div>

      <div class="form-actions">
        <button
          type="submit"
          class="btn-primary"
          :disabled="loadingCategories && !categories.length"
        >
          <span>Start Quiz</span>
          <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>

        <button
          type="button"
          class="btn-offline"
          @click="startOfflineQuiz"
        >
          ⚡ Play Instant Offline Pack
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import axios from 'axios';
import { soundManager } from '../utils/audio';

const emit = defineEmits(['start', 'start-offline']);

const amountOptions = [5, 10, 15, 20, 25];
const categories = ref([]);
const categoryError = ref('');
const loadingCategories = ref(false);

const form = reactive({
  amount: 10,
  difficulty: '',
  category: '',
  type: '',
  timer: 0
});

onMounted(async () => {
  loadingCategories.value = true;
  categoryError.value = '';

  try {
    const { data } = await axios.get('https://opentdb.com/api_category.php', { timeout: 4000 });
    categories.value = data.trivia_categories || [];
  } catch {
    categoryError.value = 'OpenTDB categories currently unavailable. You can still play or use the instant offline pack.';
  } finally {
    loadingCategories.value = false;
  }
});

const resolveCategoryName = id => {
  if (!id) return 'Any Category';
  const match = categories.value.find(category => String(category.id) === String(id));
  return match ? match.name : 'Selected Category';
};

const submit = () => {
  soundManager.playClick();
  emit('start', {
    amount: form.amount,
    difficulty: form.difficulty,
    category: form.category,
    type: form.type,
    timer: form.timer,
    categoryName: resolveCategoryName(form.category),
    useOffline: false
  });
};

const startOfflineQuiz = () => {
  soundManager.playClick();
  emit('start-offline', {
    amount: form.amount,
    difficulty: form.difficulty,
    category: form.category,
    type: form.type,
    timer: form.timer,
    categoryName: 'Curated Offline Pack',
    useOffline: true
  });
};
</script>

<style scoped>
.setup-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 36px 32px;
  box-shadow: 0 10px 30px -10px rgba(13, 148, 136, 0.12), 0 4px 6px -2px rgba(15, 23, 42, 0.05);
  max-width: 580px;
  width: 100%;
  margin: 0 auto;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.setup-header {
  margin-bottom: 24px;
}

h2 {
  font-size: var(--font-size-2xl);
  margin-bottom: 8px;
}

p {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  margin: 0;
}

.setup-form {
  display: grid;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

label {
  display: grid;
  gap: 6px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
}

.select-wrapper {
  position: relative;
}

.select-wrapper::after {
  content: '';
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  border-right: 2px solid var(--color-text-muted);
  border-bottom: 2px solid var(--color-text-muted);
  transform: translateY(-70%) rotate(45deg);
  pointer-events: none;
}

select {
  width: 100%;
  appearance: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 12px 36px 12px 14px;
  font-size: var(--font-size-base);
  font-family: var(--font-family);
  background: var(--color-background);
  color: var(--color-text);
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.3s ease;
  cursor: pointer;
}

select:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.15);
  outline: none;
}

.category-notice {
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.25);
  border-radius: var(--radius);
  padding: 10px 14px;
  color: var(--color-warning);
  font-size: var(--font-size-xs);
}

.form-actions {
  display: grid;
  gap: 12px;
  margin-top: 8px;
}

.btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 20px;
  border-radius: var(--radius);
  background: var(--color-primary);
  color: #ffffff;
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-base);
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 12px rgba(13, 148, 136, 0.25);
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(13, 148, 136, 0.35);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-arrow {
  width: 18px;
  height: 18px;
  transition: transform 0.2s ease;
}

.btn-primary:hover:not(:disabled) .btn-arrow {
  transform: translateX(3px);
}

.btn-offline {
  padding: 11px 16px;
  border-radius: var(--radius);
  background: transparent;
  color: var(--color-primary);
  border: 1px dashed var(--color-primary);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-offline:hover {
  background: rgba(13, 148, 136, 0.08);
}

@media (max-width: 540px) {
  .setup-card {
    padding: 24px 18px;
  }
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
