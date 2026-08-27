import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { courseApi } from '@/api/course.js'
import { useI18n } from '@/i18n/index.js'

export const useCourseStore = defineStore('course', () => {
  const { locale, translateCourseTitle } = useI18n()
  const courses = ref([])
  const selectedCourse = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const selectedCategory = ref('전체')

  const categories = ['전체', '의료', '금융', '행정', '법률·안전', '학업', '생활']

  // 백엔드 카테고리 → 프론트 표시용 카테고리
  const categoryLabelMap = {
    HEALTHCARE: '의료',
    FINANCE: '금융',
    ADMIN: '행정',
    SECURITY: '법률·안전',
    ACADEMIC: '학업',
    LIFE: '생활'
  }

  // 썸네일 이미지 매핑
  const thumbnailMap = {
    SPRING: new URL('../assets/images/services/international-student-hospital-assistance.png', import.meta.url).href,
    VUE: new URL('../assets/images/services/international-student-financial-assistance.png', import.meta.url).href,
    DOCKER: new URL('../assets/images/services/international-student-lecture-translation.png', import.meta.url).href,
    KUBERNETES: new URL('../assets/images/services/international-student-administrative-assistance.png', import.meta.url).href,
    SECURITY: new URL('../assets/images/services/international-student-legal-safety-assistance.png', import.meta.url).href,
    PYTHON: new URL('../assets/images/services/lecture-note-organization-assistance.png', import.meta.url).href,
    AI: new URL('../assets/images/services/international-student-campus-life-guide.png', import.meta.url).href,
  }

  const categoryThumbnailMap = {
    '의료': thumbnailMap.SPRING,
    '금융': thumbnailMap.VUE,
    '행정': thumbnailMap.KUBERNETES,
    // 법률·안전 서비스는 전용 계약 상담 이미지를 공통 썸네일로 사용한다.
    '법률·안전': thumbnailMap.SECURITY,
    '학업': thumbnailMap.PYTHON,
    '생활': thumbnailMap.AI
  }

  function normalizeCategory(category) {
    if (!category) return ''
    return categoryLabelMap[category] || category
  }

  function normalizeCourse(course) {
    if (!course || typeof course !== 'object') return course

    // 언어를 여러 번 전환해도 항상 API에서 받은 한국어 제목을 기준으로 번역합니다.
    const sourceTitle = course._sourceTitle || course.title

    return {
      ...course,
      _sourceTitle: sourceTitle,
      title: translateCourseTitle(course.id, sourceTitle),
      category: normalizeCategory(course.category)
    }
  }

  function getThumbnail(course) {
    const thumbKey = course?.thumbnail?.toUpperCase?.() || ''
    if (thumbKey && thumbnailMap[thumbKey]) {
      return thumbnailMap[thumbKey]
    }

    return categoryThumbnailMap[normalizeCategory(course?.category)] || null
  }

  async function fetchCourses() {
    loading.value = true
    error.value = null

    try {
      const res = await courseApi.getAll()
      console.log('[CourseStore] fetchCourses response =', res.data)

      const rawCourses = Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
          ? res.data
          : []

      courses.value = rawCourses.map(normalizeCourse)

      console.log('[CourseStore] normalized courses =', courses.value)
    } catch (e) {
      console.error('[CourseStore] fetchCourses failed:', e)
      error.value = e.message || '서비스 목록을 불러오지 못했습니다.'
      courses.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchCourse(id) {
    loading.value = true
    error.value = null

    try {
      const res = await courseApi.getById(id)
      console.log('[CourseStore] fetchCourse response =', res.data)

      const rawCourse =
        res.data?.data && typeof res.data.data === 'object'
          ? res.data.data
          : res.data

      selectedCourse.value = normalizeCourse(rawCourse)

      console.log('[CourseStore] normalized selectedCourse =', selectedCourse.value)
    } catch (e) {
      console.error('[CourseStore] fetchCourse failed:', e)
      error.value = e.message || '서비스 정보를 불러오지 못했습니다.'
      selectedCourse.value = null
    } finally {
      loading.value = false
    }
  }

  function setCategory(cat) {
    selectedCategory.value = cat
  }

  // 언어 버튼을 누르면 API를 다시 호출하지 않고 현재 서비스 제목만 즉시 교체합니다.
  watch(locale, () => {
    courses.value = courses.value.map(normalizeCourse)

    if (selectedCourse.value) {
      selectedCourse.value = normalizeCourse(selectedCourse.value)
    }
  })

  return {
    courses,
    selectedCourse,
    loading,
    error,
    categories,
    selectedCategory,
    thumbnailMap,
    categoryLabelMap,
    normalizeCategory,
    normalizeCourse,
    getThumbnail,
    fetchCourses,
    fetchCourse,
    setCategory
  }
})
