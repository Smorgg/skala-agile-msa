<template>
  <div class="page-wrapper">
    <AppHeader />

    <div class="page-layout">
      <!-- 사이드바 -->
      <aside class="sidebar">
        <div class="sidebar-section">
          <div class="sidebar-label">{{ t('menu') }}</div>

          <router-link
            to="/courses"
            class="sidebar-item"
            :class="{ active: $route.path === '/courses' }"
          >
            <span class="si-icon">📚</span> {{ t('serviceList') }}
          </router-link>

          <router-link
            to="/courses/new"
            class="sidebar-item"
            :class="{ active: $route.path === '/courses/new' }"
          >
            <span class="si-icon">✍️</span> {{ t('serviceCreate') }}
          </router-link>

          <!-- <router-link to="/mypage" class="sidebar-item">
            <span class="si-icon">⭐</span> 마이페이지
          </router-link> -->
        </div>

        <div class="sidebar-section">
          <div class="sidebar-label">{{ t('account') }}</div>
          <router-link to="/mypage" class="sidebar-item">
            <span class="si-icon">👤</span> {{ t('myPage') }}
          </router-link>
          <button class="sidebar-item sidebar-btn" @click="handleLogout">
            <span class="si-icon">🚪</span> {{ t('logout') }}
          </button>
        </div>
      </aside>

      <!-- 메인 -->
      <main class="main-content">
        <div class="content-header">
          <div>
            <h1 class="page-title">{{ t('serviceCreate') }}</h1>
            <p class="page-subtitle">{{ t('serviceCreateDescription') }}</p>
          </div>
        </div>

        <div class="form-card">
          <form class="course-form" @submit.prevent="handleSubmit">
            <div class="form-group">
              <label class="form-label" for="title">{{ t('serviceName') }}</label>
              <input
                id="title"
                v-model.trim="form.title"
                type="text"
                class="form-input"
                :placeholder="t('serviceNamePlaceholder')"
                maxlength="100"
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="description">{{ t('serviceDescription') }}</label>
              <textarea
                id="description"
                v-model.trim="form.description"
                class="form-textarea"
                rows="6"
                :placeholder="t('serviceDescriptionPlaceholder')"
              ></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="category">{{ t('category') }}</label>
                <select id="category" v-model="form.category" class="form-select">
                  <option disabled value="">{{ t('selectCategory') }}</option>
                  <option
                    v-for="option in categoryOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
              </div>

              <!-- <div class="form-group">
                <label class="form-label" for="price">가격</label>
                <input
                  id="price"
                  v-model.number="form.price"
                  type="number"
                  min="0"
                  step="1000"
                  class="form-input"
                  placeholder="예: 50000"
                />
              </div> -->
            </div>

            <div v-if="validationError" class="error-box">
              {{ validationError }}
            </div>

            <div v-if="submitError" class="error-box">
              {{ submitError }}
            </div>

            <div v-if="submitSuccess" class="success-box">
              {{ submitSuccess }}
            </div>

            <div class="form-actions">
              <router-link to="/courses" class="btn btn-ghost">
                {{ t('cancel') }}
              </router-link>

              <button type="submit" class="btn btn-primary" :disabled="submitting">
                <span v-if="submitting">{{ t('creating') }}</span>
                <span v-else>{{ t('serviceCreate') }}</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import { courseApi } from '@/api/course.js'
import { useAuthStore } from '@/store/auth.js'
import { useI18n } from '@/i18n/index.js'

const router = useRouter()
const auth = useAuthStore()
const { t } = useI18n()

const form = reactive({
  title: '',
  description: '',
  category: '',
  price: null
})

const submitting = ref(false)
const validationError = ref('')
const submitError = ref('')
const submitSuccess = ref('')

const categoryOptions = computed(() => [
  { label: t('healthcare'), value: 'HEALTHCARE' },
  { label: t('finance'), value: 'FINANCE' },
  { label: t('academic'), value: 'ACADEMIC' },
  { label: t('life'), value: 'LIFE' },
  { label: t('admin'), value: 'ADMIN' },
  { label: t('security'), value: 'SECURITY' }
])

function handleLogout() {
  auth.logout()
  router.push('/')
}

function validateForm() {
  validationError.value = ''

  if (!auth.user || auth.user.role !== 'INSTRUCTOR') {
    validationError.value = t('adminOnlyCreate')
    return false
  }

  if (!form.title) {
    validationError.value = t('enterServiceName')
    return false
  }

  if (!form.description) {
    validationError.value = t('enterServiceDescription')
    return false
  }

  if (!form.category) {
    validationError.value = t('chooseCategory')
    return false
  }

  // if (form.price === null || form.price === undefined || form.price === '') {
  //   validationError.value = '가격을 입력해 주세요.'
  //   return false
  // }

  // const price = Number(form.price)
  // if (Number.isNaN(price) || price < 0) {
  //   validationError.value = '가격은 0 이상의 숫자로 입력해 주세요.'
  //   return false
  // }

  return true
}

async function handleSubmit() {
  submitError.value = ''
  submitSuccess.value = ''

  if (!validateForm()) return

  submitting.value = true

  try {
    const payload = {
      title: form.title,
      description: form.description,
      category: form.category,
      price: Number(form.price)
    }

    const res = await courseApi.create(payload)
    console.log('[CourseCreate] create response =', res.data)

    submitSuccess.value = t('serviceCreateSuccess')

    const createdCourseId =
      res.data?.data?.id ??
      res.data?.id

    if (createdCourseId) {
      setTimeout(() => {
        router.push(`/courses/${createdCourseId}`)
      }, 500)
    } else {
      setTimeout(() => {
        router.push('/courses')
      }, 500)
    }
  } catch (error) {
    console.error('[CourseCreate] create failed:', error)
    submitError.value =
      error.response?.data?.message ||
      t('serviceCreateFailed')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  background: var(--color-bg-secondary);
}

.page-layout {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 28px;
}

/* 사이드바 */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sidebar-section {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 8px;
}

.sidebar-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
  padding: 8px 12px 4px;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: var(--radius-md);
  font-size: 14px;
  color: var(--color-text-secondary);
  transition: var(--transition);
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  font-family: var(--font-sans);
  text-decoration: none;
}

.sidebar-item:hover {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.sidebar-item.active {
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-weight: 500;
}

.si-icon {
  font-size: 15px;
}

.sidebar-btn {
  color: var(--color-text-secondary);
}

/* 메인 */
.main-content {
  min-width: 0;
}

.content-header {
  margin-bottom: 20px;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.page-subtitle {
  margin-top: 6px;
  font-size: 13px;
  color: var(--color-text-muted);
}

.form-card {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--shadow-sm);
}

.course-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-primary);
  padding: 12px 14px;
  font-size: 14px;
  font-family: inherit;
  color: var(--color-text-primary);
  outline: none;
  transition: var(--transition);
  box-sizing: border-box;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
}

.form-textarea {
  resize: vertical;
  min-height: 140px;
  line-height: 1.5;
}

.error-box {
  background: #fef2f2;
  color: #dc2626;
  border-radius: var(--radius-md);
  padding: 12px 14px;
  font-size: 13px;
}

.success-box {
  background: #ecfdf3;
  color: #15803d;
  border-radius: var(--radius-md);
  padding: 12px 14px;
  font-size: 13px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 6px;
}

@media (max-width: 992px) {
  .page-layout {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
