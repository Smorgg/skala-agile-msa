<template>
  <div class="login-page">
    <div class="login-language"><LanguageSwitcher /></div>
    <div class="login-layout">
      <!-- 좌측 브랜딩 -->
      <div class="login-left">
        <div class="brand">
          <img src="@/assets/images/logo/main_logo.png" alt="LearnNexus" class="brand-logo" />
          <span class="brand-name">LearnNexus</span>
        </div>
        <div class="brand-content">
          <h2>{{ t('welcomeBackLine1') }}<br>{{ t('welcomeBackLine2') }}</h2>
          <p>{{ t('continueJourney') }}</p>
          <ul class="feature-list">
            <li v-for="f in features" :key="f">
              <span class="dot"></span>{{ f }}
            </li>
          </ul>
        </div>
      </div>

      <!-- 우측 -->
      <div class="login-right">
        <div class="login-box fade-in-up">
          <router-link to="/" class="back-link">{{ t('backHome') }}</router-link>

          <!-- 로그인 영역 -->
          <div v-if="!showRegister" class="section">
            <h3 class="section-title">{{ t('login') }}</h3>
            <p class="section-desc">{{ t('loginDescription') }}</p>
            <button class="btn btn-primary btn-full" @click="handleOAuth">{{ t('login') }}</button>
            <div class="switch-link">
              {{ t('noAccount') }}
              <button class="text-btn" @click="showRegister = true">{{ t('register') }}</button>
            </div>
          </div>

          <!-- 회원가입 영역 -->
          <div v-else class="section">
            <h3 class="section-title">{{ t('register') }}</h3>
            <form @submit.prevent="handleRegister" class="form">
              <div class="form-group">
                <label class="form-label">{{ t('name') }}</label>
                <input v-model="registerForm.name" type="text" class="form-input" :placeholder="t('namePlaceholder')" required />
              </div>
              <div class="form-group">
                <label class="form-label">{{ t('email') }}</label>
                <input v-model="registerForm.email" type="email" class="form-input" placeholder="user@example.com" required />
              </div>
              <div class="form-group">
                <label class="form-label">{{ t('password') }}</label>
                <input v-model="registerForm.password" type="password" class="form-input" :placeholder="t('passwordPlaceholder')" required />
              </div>
              <div class="form-group">
                <label class="form-label">{{ t('role') }}</label>
                <select v-model="registerForm.role" class="form-input">
                  <option value="STUDENT">{{ t('student') }}</option>
                  <option value="INSTRUCTOR">{{ t('administrator') }}</option>
                </select>
              </div>
              <div v-if="error" class="error-msg">{{ error }}</div>
              <div v-if="success" class="success-msg">{{ success }}</div>
              <button type="submit" class="btn btn-primary btn-full" :disabled="loading">
                <span v-if="loading">{{ t('registering') }}</span>
                <span v-else>{{ t('register') }}</span>
              </button>
            </form>
            <div class="switch-link">
              {{ t('haveAccount') }}
              <button class="text-btn" @click="showRegister = false">{{ t('login') }}</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAuthStore } from '@/store/auth.js'
import { authApi } from '@/api/auth.js'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import { useI18n } from '@/i18n/index.js'

const auth = useAuthStore()
const { t } = useI18n()

const showRegister = ref(false)
const loading = ref(false)
const error = ref('')
const success = ref('')

const registerForm = ref({ name: '', email: '', password: '', role: 'STUDENT' })

const features = computed(() => [t('assistStudents'), t('featureRecommendTitle'), t('manageServices')])

function handleOAuth() {
  auth.redirectToLogin()
}

async function handleRegister() {
  error.value = ''
  success.value = ''
  loading.value = true
  try {
    await authApi.register(registerForm.value)
    success.value = t('registerSuccess')
    registerForm.value = { name: '', email: '', password: '', role: 'STUDENT' }
    setTimeout(() => {
      showRegister.value = false
      success.value = ''
    }, 2000)
  } catch (e) {
    error.value = e.response?.data?.message || t('registerFailed')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: stretch;
}
.login-language {
  position: fixed;
  top: 20px;
  right: 24px;
  z-index: 10;
}
.login-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  min-height: 100vh;
}
.login-left {
  background: linear-gradient(160deg, #1a4f8a 0%, #185FA5 50%, #1e7bc4 100%);
  padding: 48px;
  display: flex;
  flex-direction: column;
  gap: 48px;
}
.brand { display: flex; align-items: center; gap: 10px; }
.brand-logo { width: 40px; height: 40px; border-radius: 10px; object-fit: contain; }
.brand-name { font-size: 18px; font-weight: 700; color: #fff; }
.brand-content h2 {
  font-size: 32px; font-weight: 700; color: #fff;
  line-height: 1.35; margin-bottom: 14px;
}
.brand-content p { font-size: 15px; color: rgba(255,255,255,0.75); margin-bottom: 28px; }
.feature-list { list-style: none; display: flex; flex-direction: column; gap: 12px; }
.feature-list li { display: flex; align-items: center; gap: 10px; font-size: 14px; color: rgba(255,255,255,0.85); }
.dot { width: 7px; height: 7px; border-radius: 50%; background: rgba(255,255,255,0.6); flex-shrink: 0; }

.login-right {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
  background: var(--color-bg-primary);
}
.login-box { width: 100%; max-width: 400px; }
.back-link {
  display: inline-block;
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: 32px;
  transition: var(--transition);
}
.back-link:hover { color: var(--color-primary); }

.section { display: flex; flex-direction: column; gap: 16px; }
.section-title { font-size: 22px; font-weight: 700; color: var(--color-text-primary); margin-bottom: 4px; }
.section-desc { font-size: 14px; color: var(--color-text-secondary); margin-bottom: 4px; }

.form { display: flex; flex-direction: column; gap: 14px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-label { font-size: 13px; font-weight: 500; color: var(--color-text-secondary); }
.form-input {
  padding: 10px 14px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 14px;
  font-family: var(--font-sans);
  color: var(--color-text-primary);
  background: var(--color-bg-primary);
  transition: var(--transition);
  outline: none;
}
.form-input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px var(--color-primary-light); }
.btn-full { width: 100%; padding: 12px; font-size: 15px; justify-content: center; margin-top: 4px; }

.switch-link {
  text-align: center;
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-top: 4px;
}
.text-btn {
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  padding: 0 2px;
  text-decoration: underline;
}
.error-msg {
  padding: 10px 14px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: var(--radius-md);
  font-size: 13px;
  color: #dc2626;
}
.success-msg {
  padding: 10px 14px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: var(--radius-md);
  font-size: 13px;
  color: #16a34a;
}
</style>
