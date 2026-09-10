<template>
  <div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title" @click.self="emit('cancel')">
    <div class="modal-card">
      <div class="modal-header">
        <div class="modal-icon" :class="variant">
          <svg v-if="variant === 'warning'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        </div>
        <div>
          <h2 id="confirm-modal-title">{{ title }}</h2>
          <p class="modal-message">{{ message }}</p>
        </div>
      </div>

      <div class="modal-actions">
        <button type="button" class="btn-cancel" @click="emit('cancel')">
          {{ cancelText }}
        </button>
        <button type="button" class="btn-confirm" :class="variant" @click="emit('confirm')">
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';

defineProps({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  variant: {
    type: String,
    default: 'primary' // 'primary' | 'warning'
  }
});

const emit = defineEmits(['confirm', 'cancel']);

const handleKeyDown = e => {
  if (e.key === 'Escape') {
    emit('cancel');
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
  z-index: 1050;
  animation: fadeIn 0.2s ease;
}

.modal-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  max-width: 440px;
  width: 100%;
  padding: 24px;
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.25s ease;
}

.modal-header {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 20px;
}

.modal-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.modal-icon.primary {
  background: rgba(13, 148, 136, 0.12);
  color: var(--color-primary);
}

.modal-icon.warning {
  background: rgba(245, 158, 11, 0.12);
  color: var(--color-warning);
}

.modal-icon svg {
  width: 22px;
  height: 22px;
}

h2 {
  font-size: var(--font-size-xl);
  margin: 0 0 6px;
  color: var(--color-text);
  line-height: 1.2;
}

.modal-message {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin: 0;
  line-height: var(--line-height-normal);
}

.modal-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}

.btn-cancel,
.btn-confirm {
  padding: 10px 18px;
  border-radius: var(--radius);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel {
  background: transparent;
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
}

.btn-cancel:hover {
  color: var(--color-text);
  border-color: var(--color-text-muted);
}

.btn-confirm {
  border: none;
  color: #ffffff;
}

.btn-confirm.primary {
  background: var(--color-primary);
}

.btn-confirm.primary:hover {
  background: var(--color-primary-hover);
}

.btn-confirm.warning {
  background: var(--color-warning);
  color: #0f172a;
}

.btn-confirm.warning:hover {
  opacity: 0.9;
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
