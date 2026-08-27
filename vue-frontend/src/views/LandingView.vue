<template>
  <div class="landing">
    <AppHeader />

    <!-- 히어로 섹션 -->
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-content fade-in-up">
          <span class="hero-badge">{{ t('landingBadge') }}</span>
          <h1 class="hero-title">{{ t('landingTitleLine1') }}<br>{{ t('landingTitleLine2') }}</h1>
          <p class="hero-desc"></p>
          <div class="hero-actions">
            <router-link to="/login" class="btn btn-primary btn-lg">{{ t('getStarted') }}</router-link>
            <router-link to="/courses" class="btn btn-outline btn-lg">{{ t('browseServices') }}</router-link>
          </div>
          <div class="hero-stats">
            <div class="stat"><span class="stat-num">120+</span><span class="stat-label">{{ t('service') }}</span></div>
            <div class="stat"><span class="stat-num">140+</span><span class="stat-label">{{ t('studentsAbroad') }}</span></div>
            <div class="stat"><span class="stat-num">580+</span><span class="stat-label">{{ t('users') }}</span></div>
          </div>
        </div>
        <div class="hero-visual fade-in">
          <img src="@/assets/images/logo/main_logo.png" alt="LearnNexus" class="hero-logo" />
        </div>
      </div>
    </section>

    <!-- 인기 강의 -->
    <section class="popular-section">
      <div class="section-inner">
        <div class="section-header">
          <h2 class="section-title">{{ t('popularServices') }}</h2>
          <router-link to="/login" class="section-link">{{ t('viewAll') }}</router-link>
        </div>
        <div class="course-grid">
          <div v-for="course in featuredCourses" :key="course.id" class="course-card-landing">
            <div class="card-thumb" :class="course.thumbBg">
              <img :src="course.thumbSrc" :alt="course.title" class="thumb-img" />
            </div>
            <div class="card-body">
              <span class="badge" :class="course.badgeClass">{{ course.category }}</span>
              <h3 class="card-title">{{ course.title }}</h3>
              <div class="card-meta">
                <span class="instructor">{{ course.instructor }}</span>
                <span class="price">{{ course.price }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 특징 섹션 -->
    <section class="features-section">
      <div class="section-inner">
        <h2 class="section-title center">{{ t('whyLearnNexus') }}</h2>
        <div class="features-grid">
          <div v-for="f in features" :key="f.title" class="feature-card">
            <div class="feature-icon">{{ f.icon }}</div>
            <h3 class="feature-title">{{ f.title }}</h3>
            <p class="feature-desc">{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section">
      <div class="cta-inner">
        <h2>{{ t('startNow') }}</h2>
        <p>{{ t('ctaDescription') }}</p>
        <router-link to="/login" class="btn btn-primary btn-lg">{{ t('startFree') }}</router-link>
      </div>
    </section>

    <!-- 푸터 -->
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-logo">
          <img src="@/assets/images/logo/main_logo.png" alt="LearnNexus" />
          <span>K-mate</span>
        </div>
        <p class="footer-copy">© 2026 K-mate. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import { useI18n } from '@/i18n/index.js'
import { useCourseStore } from '@/store/course.js'

const { t } = useI18n()
const courseStore = useCourseStore()

// 서비스 목록(CourseListView)과 동일하게, 썸네일 매핑은 번역되지 않은
// 원본 카테고리 키(categoryKey)를 기준으로 조회하고, 화면 표시용 category만 번역한다.
// (getThumbnail에 번역된 문자열을 넘기면 매핑 테이블에서 키를 찾지 못해 썸네일이 깨진다.)
const categoryTranslationKeys = {
  '의료': 'healthcare', '금융': 'finance', '행정': 'admin',
  '법률·안전': 'security', '학업': 'academic', '생활': 'life'
}

const featuredCourses = computed(() => [
  { id:1, title:t('landingServiceHospital'), categoryKey:'의료', instructor:'', price:'', thumbBg:'thumb-teal', badgeClass:'badge-teal' },
  { id:2, title:t('landingServiceFinance'), categoryKey:'금융', instructor:'', price:'', thumbBg:'thumb-teal', badgeClass:'badge-amber' },
  { id:3, title:t('landingServiceAdmin'), categoryKey:'행정', instructor:'', price:'', thumbBg:'thumb-blue', badgeClass:'badge-blue' },
  { id:4, title:t('landingServiceTranslation'), categoryKey:'학업', instructor:'', price:'', thumbBg:'thumb-blue', badgeClass:'badge-purple' },
  { id:5, title:t('landingServiceNotes'), categoryKey:'학업', instructor:'', price:'', thumbBg:'thumb-purple', badgeClass:'badge-purple' },
  { id:6, title:t('landingServiceCampus'), categoryKey:'생활', instructor:'', price:'', thumbBg:'thumb-pink', badgeClass:'badge-pink' }
].map(course => ({
  ...course,
  category: t(categoryTranslationKeys[course.categoryKey] || course.categoryKey),
  thumbSrc: courseStore.getThumbnail({ ...course, category: course.categoryKey })
})))

const features = computed(() => [
  { icon:'🚀', title:t('featureFastTitle'), desc:t('featureFastDesc') },
  { icon:'🎯', title:t('featureRecommendTitle'), desc:t('featureRecommendDesc') },
  { icon:'🍔', title:t('featureEasyTitle'), desc:t('featureEasyDesc') },
  { icon:'📱', title:t('featureAnywhereTitle'), desc:t('featureAnywhereDesc') }
])
</script>

<style scoped>
.landing { background: var(--color-bg-secondary); }

/* 히어로 */
.hero {
  background: linear-gradient(135deg, #f0f7ff 0%, #e8f4fd 50%, #f0f9ff 100%);
  border-bottom: 1px solid var(--color-border);
  padding: 80px 0 64px;
}
.hero-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 48px;
  align-items: center;
}
.hero-badge {
  display: inline-block;
  padding: 5px 14px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 16px;
}
.hero-title {
  font-size: 42px;
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.5px;
  color: var(--color-text-primary);
  margin-bottom: 16px;
}
.hero-desc {
  font-size: 16px;
  color: var(--color-text-secondary);
  line-height: 1.7;
  max-width: 460px;
  margin-bottom: 28px;
}
.hero-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 40px;
}
.btn-lg { padding: 12px 28px; font-size: 15px; }
.hero-stats {
  display: flex;
  gap: 36px;
}
.stat { display: flex; flex-direction: column; gap: 2px; }
.stat-num { font-size: 22px; font-weight: 700; color: var(--color-primary); }
.stat-label { font-size: 12px; color: var(--color-text-secondary); }
.hero-visual {
  display: flex;
  align-items: center;
  justify-content: center;
}
.hero-logo {
  width: 200px;
  height: 200px;
  object-fit: contain;
  border-radius: 24px;
  box-shadow: var(--shadow-lg);
}

/* 강의 섹션 */
.popular-section { padding: 64px 0; }
.section-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.section-title { font-size: 22px; font-weight: 700; color: var(--color-text-primary); }
.section-title.center { text-align: center; margin-bottom: 40px; }
.section-link { font-size: 14px; color: var(--color-primary); font-weight: 500; }
.section-link:hover { text-decoration: underline; }

.course-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.course-card-landing {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: var(--transition);
}
.course-card-landing:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}
.card-thumb {
  width: 100%;
  aspect-ratio: 19 / 10;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}
.thumb-teal   { background: #E1F5EE; }
.thumb-blue   { background: #E6F1FB; }
.thumb-purple { background: #EEEDFE; }
.thumb-pink   { background: #FBEAF0; }
/* 첨부 이미지처럼 위쪽만 둥글고 아래쪽은 일자로 표시한다. */
.thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  display: block;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}
.card-body { padding: 14px 16px; display: flex; flex-direction: column; gap: 6px; }
/* 카테고리 뱃지는 텍스트 길이만큼만 표시한다. */
.card-body > .badge { align-self: flex-start; width: fit-content; }
.card-title { font-size: 14px; font-weight: 600; color: var(--color-text-primary); line-height: 1.4; }
.card-meta { display: flex; justify-content: space-between; align-items: center; }
.instructor { font-size: 12px; color: var(--color-text-secondary); }
.price { font-size: 14px; font-weight: 600; color: var(--color-primary); }

/* 특징 */
.features-section { padding: 64px 0; background: var(--color-bg-primary); }
.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
.feature-card {
  padding: 28px 24px;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  text-align: center;
  transition: var(--transition);
}
.feature-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
.feature-icon { font-size: 32px; margin-bottom: 12px; }
.feature-title { font-size: 15px; font-weight: 600; margin-bottom: 8px; }
.feature-desc { font-size: 13px; color: var(--color-text-secondary); line-height: 1.6; }

/* CTA */
.cta-section {
  padding: 80px 0;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  text-align: center;
}
.cta-inner { max-width: 600px; margin: 0 auto; padding: 0 24px; }
.cta-inner h2 { font-size: 32px; font-weight: 700; color: #fff; margin-bottom: 12px; }
.cta-inner p { font-size: 16px; color: rgba(255,255,255,0.8); margin-bottom: 32px; }
.cta-inner .btn-primary {
  background: #fff;
  color: var(--color-primary);
  border-color: #fff;
  font-weight: 600;
}
.cta-inner .btn-primary:hover { background: #f0f7ff; }

/* 푸터 */
.footer {
  background: var(--color-bg-primary);
  border-top: 1px solid var(--color-border);
  padding: 32px 0;
}
.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.footer-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-text-primary);
  font-size: 15px;
  font-weight: 600;
}
.footer-logo img { width: 28px; height: 28px; border-radius: 6px; }
.footer-copy { font-size: 13px; color: var(--color-text-secondary); }
</style>