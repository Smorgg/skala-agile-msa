<template>
  <div class="page-wrapper">
    <AppHeader />
    <div class="page-layout">
      <aside class="sidebar">
        <div class="sidebar-section">
          <div class="sidebar-label">{{ t('menu') }}</div>

          <router-link to="/courses" class="sidebar-item">
            <span class="si-icon">👨‍💼</span> {{ t('serviceList') }}
          </router-link>

          <router-link
            v-if="!isInstructor"
            to="/enrollments"
            class="sidebar-item active"
          >
            <span class="si-icon">✅</span> {{ t('myServiceList') }}
          </router-link>
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

      <main class="main-content">
        <h1 class="page-title">{{ t('myServiceList') }}</h1>

        <div v-if="loading" class="loading-center">
          <div class="spinner"></div>
        </div>

        <div v-else-if="enrollments.length" class="enrollment-list fade-in">
          <div v-for="item in enrollments" :key="item.id" class="enrollment-card">
            <div class="enroll-thumb" :class="getThumbBg(item.course?.category)">
              <img
                v-if="getThumbSrc(item.course)"
                :src="getThumbSrc(item.course)"
                :alt="item.course?.title"
              />
              <span v-else class="thumb-placeholder">
                {{ getDisplayCategory(item.course?.category).charAt(0) }}
              </span>
            </div>

            <div class="enroll-info">
              <span class="badge" :class="getBadge(item.course?.category)">
                {{ translateCategory(getDisplayCategory(item.course?.category)) }}
              </span>
              <h3 class="enroll-title">{{ item.course?.title }}</h3>
            </div>

            <div class="enroll-status">
              <span
                :class="[
                  'status-badge',
                  item.status === 'ACTIVE' ? 'status-active' : 'status-pending'
                ]"
              >
                {{ item.status === 'ACTIVE' ? t('active') : t('pending') }}
              </span>
              <router-link :to="`/courses/${item.courseId}`" class="btn btn-ghost btn-sm">
                {{ t('viewCourse') }}
              </router-link>
            </div>
          </div>
        </div>

        <div v-else class="empty-state">
          <p class="empty-icon">📭</p>
          <p>{{ t('noActiveServices') }}</p>
          <router-link to="/courses" class="btn btn-primary" style="margin-top:16px;">
            {{ t('browseServices') }}
          </router-link>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import { enrollmentApi } from '@/api/enrollment.js'
import { useAuthStore } from '@/store/auth.js'
import { useCourseStore } from '@/store/course.js'
import { useI18n } from '@/i18n/index.js'

const router = useRouter()
const auth = useAuthStore()
const courseStore = useCourseStore()
const { t } = useI18n()

const enrollments = ref([])
const loading = ref(true)

const isInstructor = computed(() => auth.user?.role === 'INSTRUCTOR')

const categoryConfig = {
  '의료': { bg: 'thumb-teal', badge: 'badge-teal' },
  '금융': { bg: 'thumb-amber', badge: 'badge-amber' },
  '행정': { bg: 'thumb-blue', badge: 'badge-blue' },
  // 신청 목록에서도 법률·안전 서비스의 빨강 계열을 동일하게 유지한다.
  '법률·안전': { bg: 'thumb-red', badge: 'badge-red' },
  '학업': { bg: 'thumb-purple', badge: 'badge-purple' },
  '생활': { bg: 'thumb-pink', badge: 'badge-pink' },
}

const categoryTranslationKeys = {
  '의료': 'healthcare', '금융': 'finance', '행정': 'admin',
  '법률·안전': 'security', SECURITY: 'security', '학업': 'academic', '생활': 'life'
}

function translateCategory(category) {
  return t(categoryTranslationKeys[category] || category || '-')
}

// API enum(HEALTHCARE 등)을 화면용 한글 카테고리로 바꿔 색상과 번역 기준을 통일한다.
function getDisplayCategory(category) {
  return courseStore.normalizeCategory(category)
}

function getThumbBg(cat) {
  return categoryConfig[getDisplayCategory(cat)]?.bg || 'thumb-gray'
}

function getBadge(cat) {
  return categoryConfig[getDisplayCategory(cat)]?.badge || 'badge-gray'
}

function getThumbSrc(course) {
  // 서비스 목록과 같은 중앙 매핑을 사용해 카테고리별 서비스 이미지를 표시한다.
  return courseStore.getThumbnail(course)
}

function handleLogout() {
  auth.logout()
  router.push('/')
}

onMounted(async () => {
  // 강사는 이 페이지 접근 불가 → 마이페이지로 이동
  if (isInstructor.value) {
    console.warn('[EnrollmentView] instructor tried to access /enrollments, redirect to /mypage')
    router.replace('/mypage')
    return
  }

  try {
    const res = await enrollmentApi.getMyEnrollments()
    console.log('[EnrollmentView] my enrollments response:', res.data)

    if (Array.isArray(res.data?.data)) {
      enrollments.value = res.data.data
    } else if (Array.isArray(res.data)) {
      enrollments.value = res.data
    } else {
      enrollments.value = []
    }
  } catch (error) {
    console.error('[EnrollmentView] failed to load enrollments:', error)
    enrollments.value = []
  } finally {
    loading.value = false
  }
})
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

.main-content {
  min-width: 0;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 24px;
}

.enrollment-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.enrollment-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 16px;
  transition: var(--transition);
}

.enrollment-card:hover {
  box-shadow: var(--shadow-sm);
}

.enroll-thumb {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.enroll-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.thumb-teal {
  background: #E1F5EE;
}

.thumb-amber {
  background: #FAEEDA;
}

.thumb-blue {
  background: #E6F1FB;
}

.thumb-red {
  background: #FCEBEB;
}

.thumb-purple {
  background: #EEEDFE;
}

.thumb-pink {
  background: #FBEAF0;
}

.thumb-gray {
  background: #F1EFE8;
}

.enroll-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* 카테고리 뱃지는 텍스트 길이만큼만 차지하는 기존 서비스 카드 크기를 유지한다. */
.enroll-info > .badge {
  align-self: flex-start;
  width: fit-content;
}

.thumb-placeholder {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-muted);
}

.enroll-title {
  font-size: 15px;
  font-weight: 600;
}

.enroll-status {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.status-active {
  background: #E1F5EE;
  color: #0F6E56;
}

.status-pending {
  background: #FAEEDA;
  color: #854F0B;
}

.btn-sm {
  padding: 7px 14px;
  font-size: 13px;
}

.empty-state {
  text-align: center;
  padding: 80px 0;
  color: var(--color-text-muted);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.loading-center {
  display: flex;
  justify-content: center;
  padding: 80px 0;
}

.spinner {
  width: 36px;
  height: 36px;
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
