<template>
  <router-link :to="`/courses/${course.id}`" class="course-card">
    <!-- 썸네일 -->
    <div class="card-thumb" :class="thumbBg">
      <img v-if="thumbSrc" :src="thumbSrc" :alt="course.title" class="thumb-img" />
      <div v-else class="thumb-placeholder">{{ course.category?.charAt(0) }}</div>
    </div>

    <!-- 내용 -->
    <div class="card-body">
      <span class="badge" :class="badgeClass">{{ translateCategory(course.category) }}</span>
      <h3 class="card-title">{{ course.title }}</h3>
      <div class="card-meta">
        <span class="instructor">{{ course.instructorName }}</span>
      </div>
      <div class="card-footer">
        <span class="enrolled">{{ t('enrolledCount', { count: course.enrollmentCount?.toLocaleString() ?? 0 }) }}</span>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from '@/i18n/index.js'
import { useCourseStore } from '@/store/course.js'

const props = defineProps({
  course: { type: Object, required: true }
})

const { t } = useI18n()
const courseStore = useCourseStore()

const categoryTranslationKeys = {
  '백엔드': 'backend',
  '프론트엔드': 'frontend',
  '데이터': 'data',
  '의료': 'healthcare',
  '금융': 'finance',
  '행정': 'admin',
  '법률·안전': 'security',
  SECURITY: 'security',
  '학업': 'academic',
  '생활': 'life'
}

function translateCategory(category) {
  const key = categoryTranslationKeys[category]
  return key ? t(key) : category
}

const categoryConfig = {
  '의료': { bg: 'thumb-teal', badge: 'badge-teal' },
  '금융': { bg: 'thumb-teal', badge: 'badge-amber' },
  '행정': { bg: 'thumb-blue', badge: 'badge-blue' },
  // 법률·안전 서비스는 주의가 필요한 영역임을 드러내는 빨강 계열을 사용한다.
  '법률·안전': { bg: 'thumb-red', badge: 'badge-red' },
  SECURITY: { bg: 'thumb-red', badge: 'badge-red' },
  '학업': { bg: 'thumb-purple', badge: 'badge-purple' },
  '생활': { bg: 'thumb-pink', badge: 'badge-pink' }
}

const config = computed(() => categoryConfig[props.course.category] || { bg: 'thumb-gray', badge: 'badge-gray' })
const thumbBg = computed(() => config.value.bg)
const badgeClass = computed(() => config.value.badge)

// 스토어의 서비스별 매핑을 사용해 목록과 상세 데이터의 썸네일 기준을 통일한다.
const thumbSrc = computed(() => courseStore.getThumbnail(props.course))
</script>

<style scoped>
.course-card {
  display: flex;
  flex-direction: column;
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: var(--transition);
  cursor: pointer;
}
.course-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-border-hover);
}
.card-thumb {
  width: 100%;
  aspect-ratio: 16 / 9;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  border-bottom: 1px solid var(--color-border);
}
.thumb-teal   { background: #E1F5EE; }
.thumb-blue   { background: #E6F1FB; }
.thumb-amber  { background: #FAEEDA; }
.thumb-red    { background: #FCEBEB; }
.thumb-purple { background: #EEEDFE; }
.thumb-pink   { background: #FBEAF0; }
.thumb-gray   { background: #F1EFE8; }
.thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  /* 썸네일 하단은 둥글게 자르지 않고 본문과 일자로 연결한다. */
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}
.thumb-placeholder {
  font-size: 36px;
  font-weight: 700;
  color: var(--color-text-muted);
}
.card-body {
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}
/* 카테고리 뱃지가 카드 너비로 늘어나지 않고 텍스트 크기에 맞게 한다. */
.card-body > .badge {
  align-self: flex-start;
  width: fit-content;
}
.card-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1.4;
}
.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.instructor {
  font-size: 12px;
  color: var(--color-text-secondary);
}
.price {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-primary);
}
.card-footer {
  margin-top: 2px;
}
.enrolled {
  font-size: 11px;
  color: var(--color-text-muted);
}
</style>
