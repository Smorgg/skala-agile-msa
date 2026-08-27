<template>
  <div class="language-switcher" role="group" :aria-label="t('language')">
    <button
      v-for="option in languageOptions"
      :key="option.value"
      type="button"
      class="language-button"
      :class="{ active: locale === option.value }"
      :aria-pressed="locale === option.value"
      @click="setLocale(option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script setup>
import { useI18n } from '@/i18n/index.js'

const { locale, setLocale, t } = useI18n()

// 짧은 언어명을 사용해 작은 화면에서도 다섯 버튼이 한 줄에 유지되게 한다.
const languageOptions = [
  { value: 'ko', label: '한국어' },
  { value: 'en', label: 'EN' },
  { value: 'zh', label: '中文' },
  { value: 'ja', label: '日本語' },
  { value: 'vi', label: 'VI' }
]
</script>

<style scoped>
.language-switcher {
  display: inline-flex;
  align-items: center;
  padding: 2px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-secondary);
}

.language-button {
  padding: 5px 8px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--color-text-secondary);
  font-family: inherit;
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
  cursor: pointer;
  transition: var(--transition);
}

.language-button:hover {
  color: var(--color-primary);
}

.language-button.active {
  background: var(--color-bg-primary);
  color: var(--color-primary);
  box-shadow: var(--shadow-sm);
}

@media (max-width: 480px) {
  .language-button { padding: 5px 5px; font-size: 10px; }
}
</style>
