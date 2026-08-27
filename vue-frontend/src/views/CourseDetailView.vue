<template>
  <div class="page-wrapper">
    <AppHeader />

    <div class="detail-layout" v-if="course">
      <div class="detail-hero">
        <div class="detail-hero-inner">
          <!-- 좌측 상세 정보 -->
          <div class="detail-info fade-in-up">
            <h1 class="detail-title">{{ course.title }}</h1>
            <span class="badge" :class="badgeClass">{{ displayCategory }}</span>
            <p class="detail-desc">
              {{ course.description || t('defaultServiceDescription') }}
            </p>

            <div class="detail-meta">
              <span>{{ t('department') }}: {{ displayInstructorName }}</span>
              <span>{{ t('applicants') }}: {{ t('peopleUnit', { count: displayEnrollmentCount }) }}</span>
            </div>
          </div>

          <!-- 우측 결제/신청 카드 -->
          <div class="enroll-card fade-in">
            <div class="enroll-thumb" :class="thumbBg">
              <!-- 카테고리별 서비스 썸네일을 표시하고 이미지가 없을 때만 아이콘을 사용한다. -->
              <img v-if="thumbSrc" :src="thumbSrc" :alt="course.title" class="thumb-img" />
              <span v-else class="thumb-emoji">{{ thumbIcon }}</span>
            </div>

            <div class="enroll-body">
              <button
                class="btn btn-primary btn-full"
                @click="handlePrimaryAction"
                :disabled="buttonDisabled"
                :class="{ 'btn-disabled': buttonDisabled }"
              >
                <span v-if="enrolling">{{ t('processing') }}</span>
                <span v-else>{{ buttonLabel }}</span>
              </button>

              <div v-if="enrollError" class="error-msg">{{ enrollError }}</div>

              <p class="helper-text" v-if="helperText">
                {{ helperText }}
              </p>

              <ul class="enroll-info-list">
                <li>{{ t('availableImmediately') }}</li>
                <li>{{ t('applicationHistory') }}</li>
                <li>{{ t('departmentGuide') }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="loading" class="loading-center">
      <div class="spinner"></div>
    </div>

    <div v-else class="loading-center">
      <p class="empty-text">{{ t('serviceLoadFailed') }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import { useCourseStore } from '@/store/course.js'
import { enrollmentApi } from '@/api/enrollment.js'
import { useAuthStore } from '@/store/auth.js'
import { useI18n } from '@/i18n/index.js'

const route = useRoute()
const router = useRouter()
const courseStore = useCourseStore()
const auth = useAuthStore()
const { t } = useI18n()

const enrolling = ref(false)
const enrollError = ref('')
const enrollmentStatus = ref('NONE') // NONE | PENDING | ACTIVE

const course = computed(() => courseStore.selectedCourse)
const loading = computed(() => courseStore.loading)
const isInstructor = computed(() => auth.user?.role === 'INSTRUCTOR')

const categoryConfig = {
  // 서비스 목록 카드와 동일한 카테고리 색상 체계를 사용한다.
  '의료': { badge: 'badge-teal', bg: 'thumb-teal', icon: '🏥' },
  '금융': { badge: 'badge-amber', bg: 'thumb-amber', icon: '💰' },
  '행정': { badge: 'badge-blue', bg: 'thumb-blue', icon: '📋' },
  // 법률·안전 카테고리는 경고 의미가 분명한 빨강 계열과 저울 아이콘을 사용한다.
  '법률·안전': { badge: 'badge-red', bg: 'thumb-red', icon: '⚖️' },
  SECURITY: { badge: 'badge-red', bg: 'thumb-red', icon: '⚖️' },
  '학업': { badge: 'badge-purple', bg: 'thumb-purple', icon: '📖' },
  '생활': { badge: 'badge-pink', bg: 'thumb-pink', icon: '🏠' },
}

const config = computed(() => categoryConfig[course.value?.category] || {})
const badgeClass = computed(() => config.value.badge || 'badge-gray')
const thumbBg = computed(() => config.value.bg || 'thumb-gray')
const thumbSrc = computed(() => courseStore.getThumbnail(course.value))

const categoryTranslationKeys = {
  '의료': 'healthcare', '금융': 'finance', '행정': 'admin',
  '법률·안전': 'security', SECURITY: 'security', '학업': 'academic', '생활': 'life'
}

const displayCategory = computed(() => {
  const category = course.value?.category
  return category ? t(categoryTranslationKeys[category] || category) : '-'
})

const displayInstructorName = computed(() => {
  return (
    course.value?.instructorName ||
    course.value?.teacherName ||
    course.value?.instructor?.name ||
    course.value?.instructor_name ||
    course.value?.ownerName ||
    t('departmentUnknown')
  )
})

const displayEnrollmentCount = computed(() => {
  const value = Number(
    course.value?.enrollmentCount ??
    course.value?.enrollment_count ??
    0
  )
  return Number.isNaN(value) ? 0 : value.toLocaleString()
})

const thumbIcon = computed(() => config.value.icon || '📌')

const buttonLabel = computed(() => {
  if (isInstructor.value) return t('operatorCannotApply')
  if (enrollmentStatus.value === 'ACTIVE') return t('goToApplications')
  if (enrollmentStatus.value === 'PENDING') return t('applicationPending')
  return t('apply')
})

const buttonDisabled = computed(() => {
  if (enrolling.value) return true
  if (isInstructor.value) return true
  if (enrollmentStatus.value === 'PENDING') return true
  return false
})

const helperText = computed(() => {
  if (isInstructor.value) {
    return t('operatorHelp')
  }

  if (enrollmentStatus.value === 'ACTIVE') {
    return t('activeHelp')
  }

  if (enrollmentStatus.value === 'PENDING') {
    return t('pendingHelp')
  }

  return t('applyHelp')
})

async function loadEnrollmentStatus() {
  if (!auth.user?.id || !course.value?.id || isInstructor.value) {
    enrollmentStatus.value = 'NONE'
    return
  }

  try {
    const res = await enrollmentApi.getMyEnrollments()
    console.log('[CourseDetail] my enrollments response =', res.data)

    const enrollments = Array.isArray(res.data?.data)
      ? res.data.data
      : Array.isArray(res.data)
        ? res.data
        : []

    const matched = enrollments.find(item => Number(item.courseId) === Number(course.value.id))

    if (!matched) {
      enrollmentStatus.value = 'NONE'
      return
    }

    enrollmentStatus.value = matched.status === 'ACTIVE' ? 'ACTIVE' : 'PENDING'
  } catch (e) {
    console.error('[CourseDetail] failed to load enrollment status:', e)
    enrollmentStatus.value = 'NONE'
  }
}

async function handlePrimaryAction() {
  enrollError.value = ''

  if (!course.value?.id) {
    enrollError.value = t('invalidService')
    return
  }

  if (isInstructor.value) {
    enrollError.value = t('operatorHelp')
    return
  }

  if (enrollmentStatus.value === 'ACTIVE') {
    router.push('/enrollments')
    return
  }

  if (enrollmentStatus.value === 'PENDING') {
    return
  }

  enrolling.value = true

  try {
    await enrollmentApi.enroll(course.value.id)
    enrollmentStatus.value = 'PENDING'
  } catch (e) {
    console.error('[CourseDetail] enroll failed:', e)
    enrollError.value = e.response?.data?.message || t('applicationFailed')
  } finally {
    enrolling.value = false
  }
}

onMounted(async () => {
  await courseStore.fetchCourse(route.params.id)
  console.log('[CourseDetail] selectedCourse =', courseStore.selectedCourse)
  await loadEnrollmentStatus()
})

watch(
  () => courseStore.selectedCourse,
  async (value) => {
    console.log('[CourseDetail] selectedCourse changed =', value)
    if (value?.id) {
      await loadEnrollmentStatus()
    }
  },
  { deep: true }
)
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  background: var(--color-bg-secondary);
}

.detail-hero {
  background: linear-gradient(135deg, #f0f7ff 0%, #e8f4fd 100%);
  border-bottom: 1px solid var(--color-border);
  padding: 48px 0;
}

.detail-hero-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px;
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 48px;
  align-items: start;
}

.detail-info {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.detail-title {
  font-size: 30px;
  font-weight: 700;
  line-height: 1.3;
}

/* 제목 아래의 카테고리 뱃지는 텍스트 너비만 차지하도록 한다. */
.detail-info > .badge {
  align-self: flex-start;
  width: fit-content;
}

.detail-desc {
  font-size: 15px;
  color: var(--color-text-secondary);
  line-height: 1.7;
}

.detail-meta {
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: var(--color-text-secondary);
  flex-wrap: wrap;
}

.enroll-card {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.enroll-thumb {
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.thumb-emoji {
  font-size: 56px;
}

.thumb-teal { background: #E1F5EE; }
.thumb-blue { background: #E6F1FB; }
.thumb-amber { background: #FAEEDA; }
.thumb-red { background: #FCEBEB; }
.thumb-purple { background: #EEEDFE; }
.thumb-pink { background: #FBEAF0; }
.thumb-gray { background: #F1EFE8; }

.enroll-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.btn-full {
  width: 100%;
  padding: 13px;
  font-size: 15px;
  justify-content: center;
}

.btn-disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.enroll-info-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.enroll-info-list li {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.error-msg {
  font-size: 13px;
  color: #dc2626;
  padding: 8px 12px;
  background: #fef2f2;
  border-radius: var(--radius-sm);
}

.helper-text {
  font-size: 12px;
  color: var(--color-text-muted);
  line-height: 1.5;
}

.empty-text {
  font-size: 14px;
  color: var(--color-text-muted);
}

.loading-center {
  display: flex;
  justify-content: center;
  padding: 100px 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.badge-gray {
  background: #f3f4f6;
  color: #6b7280;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 900px) {
  .detail-hero-inner {
    grid-template-columns: 1fr;
  }
}
</style>
