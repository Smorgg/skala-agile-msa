<template>
  <div class="callback-page">
    <div class="callback-box">
      <div class="spinner"></div>
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/store/auth.js'
import { useI18n } from '@/i18n/index.js'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const { t } = useI18n()

const message = ref(t('loginProcessing'))
const processing = ref(false)

onMounted(async () => {
  if (processing.value) return
  processing.value = true

  const code = route.query.code
  const error = route.query.error
  const errorDescription = route.query.error_description

  if (error) {
    console.error('OAuth callback error:', {
      error,
      errorDescription
    })
    message.value = t('loginFailed')
    router.replace('/login')
    return
  }

  if (!code) {
    console.error('OAuth callback error: code 파라미터가 없습니다.')
    message.value = t('invalidLoginRequest')
    router.replace('/login')
    return
  }

  try {
    await auth.handleCallback(code)
    message.value = t('loginComplete')
    router.replace('/courses')
  } catch (err) {
    console.error('OAuth callback 처리 실패:', err)
    message.value = t('loginProcessFailed')
    router.replace('/login')
  }
})
</script>

<style scoped>
.callback-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-secondary);
}

.callback-box {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: var(--color-text-secondary);
  font-size: 15px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
