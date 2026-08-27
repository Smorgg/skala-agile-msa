import { computed, ref } from 'vue'

const STORAGE_KEY = 'learnnexus-language'
const supportedLanguages = ['ko', 'en', 'zh', 'ja', 'vi']

// 저장된 언어가 없거나 올바르지 않으면 한국어를 기본값으로 사용한다.
const savedLanguage = localStorage.getItem(STORAGE_KEY)
const language = ref(supportedLanguages.includes(savedLanguage) ? savedLanguage : 'ko')
document.documentElement.lang = language.value === 'zh' ? 'zh-CN' : language.value

const messages = {
  ko: {
    language: '언어',
    service: '서비스',
    myServices: '내 서비스',
    login: '로그인',
    logout: '로그아웃',
    getStarted: '시작하기',
    menu: '메뉴',
    account: '계정',
    serviceList: '서비스 목록',
    myApplications: '내 신청 목록',
    myPage: '마이페이지',
    serviceCreate: '서비스 등록',
    landingBadge: 'MSA 기반 서비스 제공 플랫폼',
    landingTitleLine1: '생활을 더 편리하게,',
    landingTitleLine2: '학습을 더 빠르게',
    browseServices: '서비스 둘러보기',
    studentsAbroad: '유학생',
    users: '이용학생',
    popularServices: '인기 서비스',
    viewAll: '전체 보기 →',
    whyLearnNexus: '왜 K-mate인가요?',
    startNow: '지금 바로 시작하세요',
    ctaDescription: '수백 명의 유학생들이 K-mate와 함께 성장하고 있습니다.',
    startFree: '무료로 시작하기',
    landingServiceHospital: '유학생 병원 업무 보조',
    landingServiceFinance: '유학생 금융 업무 보조',
    landingServiceAdmin: '유학생 행정 업무 보조',
    landingServiceTranslation: '유학생 강의 번역 서비스',
    landingServiceNotes: '강의 노트 정리 보조 서비스',
    landingServiceCampus: '유학생 학교 생활 안내 서비스',
    featureFastTitle: '유학생의 신속한 업무 처리',
    featureFastDesc: '유학생의 생활을 원활하게 도와주는 업무 보조 서비스를 제공합니다.',
    featureRecommendTitle: '맞춤 서비스 추천',
    featureRecommendDesc: 'AI 기반 추천 시스템이 서비스 이용 이력을 분석해 딱 맞는 서비스를 추천합니다.',
    featureEasyTitle: '간편한 서비스 신청',
    featureEasyDesc: '원클릭 신청으로 서비스를 바로 제공받으세요.',
    featureAnywhereTitle: '언제 어디서나',
    featureAnywhereDesc: 'PC, 태블릿, 모바일 어디서든 끊김 없이 이용하세요.',
    healthcare: '의료',
    backend: '백엔드',
    frontend: '프론트엔드',
    data: '데이터',
    finance: '금융',
    admin: '행정',
    security: '법률·안전',
    academic: '학업',
    life: '생활',
    all: '전체',
    enrolledCount: '수강생 {count}명',
    welcomeBackLine1: '다시 만나서',
    welcomeBackLine2: '반갑습니다',
    continueJourney: '로그인하고 나만의 여정을 이어가세요.',
    assistStudents: '유학생 보조 서비스',
    manageServices: '이용중인 서비스 관리',
    backHome: '← 홈으로',
    loginDescription: 'K-mate 계정으로 로그인합니다.',
    noAccount: '계정이 없으신가요?',
    register: '회원가입',
    name: '이름',
    email: '이메일',
    password: '비밀번호',
    role: '역할',
    student: '학생',
    administrator: '관리자',
    registering: '가입 중...',
    haveAccount: '이미 계정이 있으신가요?',
    namePlaceholder: '홍길동',
    passwordPlaceholder: '8자 이상',
    courseListAdminDescription: '학교 관리자 계정으로 등록된 서비스를 확인하고 새 서비스를 추가할 수 있습니다.',
    noServices: '해당 영역의 서비스가 없습니다.',
    createFirstService: '첫 서비스 등록하기',
    serviceCreateDescription: '학교 관리자 계정으로 새로운 서비스를 등록합니다.',
    serviceName: '서비스명',
    serviceNamePlaceholder: '예: 외국인 유학생 계좌 개설 가이드',
    serviceDescription: '서비스 설명',
    serviceDescriptionPlaceholder: '서비스 소개, 신청 대상, 진행 방식 등을 입력해 주세요.',
    category: '카테고리',
    selectCategory: '영역을 선택하세요',
    cancel: '취소',
    creating: '등록 중...',
    department: '담당 부서',
    applicants: '신청자',
    peopleUnit: '{count}명',
    processing: '처리 중...',
    availableImmediately: '✅ 즉시 신청 가능',
    applicationHistory: '✅ 신청 내역 상시 확인',
    departmentGuide: '✅ 담당 부서 안내 제공',
    serviceLoadFailed: '서비스 정보를 불러오지 못했습니다.',
    defaultServiceDescription: '학교 관리자가 직접 준비한 프로그램으로 필요한 지원을 받아보세요.',
    imagePreparing: '이미지 준비중입니다',
    departmentUnknown: '담당 부서 정보 없음',
    operatorCannotApply: '운영자 계정은 신청 불가',
    goToApplications: '내 서비스로 이동',
    applicationPending: '신청 완료 · 처리 중',
    apply: '신청하기',
    operatorHelp: '운영자 계정은 본인이 등록한 프로그램을 신청할 수 없습니다.',
    activeHelp: '이미 신청한 서비스입니다. 내 신청 목록에서 바로 확인할 수 있습니다.',
    pendingHelp: '신청이 접수되었습니다. 처리 상태가 반영되면 내 신청 목록에서 확인할 수 있습니다.',
    applyHelp: '신청을 진행하면 (유료 서비스의 경우 결제와 함께) 접수가 완료됩니다.',
    myServiceList: '내 서비스 목록',
    instructor: '강사',
    active: '이용 중',
    pending: '대기 중',
    viewCourse: '서비스 보기',
    noActiveServices: '이용 중인 서비스가 없습니다.',
    user: '사용자',
    recommendedServices: '추천 서비스',
    noRecommendations: '아직 추천할 서비스가 없습니다.',
    myCreatedServices: '내가 등록한 서비스',
    myCreatedServicesDescription: '등록한 서비스와 서비스별 이용자 수를 확인할 수 있습니다.',
    createdServiceCount: '등록 서비스 수',
    totalUserCount: '총 이용자 수',
    noDescription: '설명이 없습니다.',
    userCount: '이용자 수',
    serviceId: '서비스 ID',
    viewService: '서비스 보기',
    noCreatedServices: '아직 등록한 서비스가 없습니다.',
    adminOnlyCreate: '학교 관리자 계정만 서비스를 등록할 수 있습니다.',
    enterServiceName: '서비스명을 입력해 주세요.',
    enterServiceDescription: '서비스 설명을 입력해 주세요.',
    chooseCategory: '영역을 선택해 주세요.',
    serviceCreateSuccess: '서비스가 성공적으로 등록되었습니다.',
    serviceCreateFailed: '서비스 등록에 실패했습니다.',
    invalidService: '프로그램 정보가 올바르지 않습니다.',
    applicationFailed: '프로그램 신청에 실패했습니다.',
    registerSuccess: '회원가입 완료! 로그인 페이지로 이동합니다.',
    registerFailed: '회원가입에 실패했습니다.',
    preparingRecommendations: '추천 서비스를 준비 중입니다.',
    recommendationLoadFailed: '현재 추천 서비스를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.',
    instructorServicesLoadFailed: '현재 서비스 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.',
    loginProcessing: '로그인 처리 중...',
    loginFailed: '로그인에 실패했습니다. 다시 시도해주세요.',
    invalidLoginRequest: '잘못된 로그인 요청입니다.',
    loginComplete: '로그인 완료! 이동 중입니다...',
    loginProcessFailed: '로그인 처리에 실패했습니다.'
  },
  en: {
    language: 'Language', service: 'Services', myServices: 'My Services', login: 'Log in', logout: 'Log out', getStarted: 'Get Started', menu: 'Menu', account: 'Account', serviceList: 'Service List', myApplications: 'My Applications', myPage: 'My Page', serviceCreate: 'Add Service',
    landingBadge: 'MSA-based service platform', landingTitleLine1: 'Make life easier,', landingTitleLine2: 'and learning faster', browseServices: 'Browse Services', studentsAbroad: 'International Students', users: 'Student Users', popularServices: 'Popular Services', viewAll: 'View All →', whyLearnNexus: 'Why K-mate?', startNow: 'Get started today', ctaDescription: 'Hundreds of international students are growing with K-mate.', startFree: 'Start for Free',
    landingServiceHospital: 'Hospital Assistance for International Students', landingServiceFinance: 'Financial Assistance for International Students', landingServiceAdmin: 'Administrative Assistance for International Students', landingServiceTranslation: 'Lecture Translation for International Students', landingServiceNotes: 'Lecture Note Organization', landingServiceCampus: 'Campus Life Guide for International Students',
    featureFastTitle: 'Fast Student Assistance', featureFastDesc: 'Get practical support that makes international student life easier.', featureRecommendTitle: 'Personalized Recommendations', featureRecommendDesc: 'AI analyzes your service history to recommend the right support.', featureEasyTitle: 'Easy Applications', featureEasyDesc: 'Apply for a service with just one click.', featureAnywhereTitle: 'Anytime, Anywhere', featureAnywhereDesc: 'Use K-mate seamlessly on desktop, tablet, or mobile.',
    healthcare: 'Healthcare', backend: 'Backend', frontend: 'Frontend', data: 'Data', finance: 'Finance', admin: 'Administration', security: 'Legal & Safety', academic: 'Academic', life: 'Life', all: 'All', enrolledCount: '{count} students',
    welcomeBackLine1: 'Welcome', welcomeBackLine2: 'back', continueJourney: 'Log in to continue your journey.', assistStudents: 'International Student Assistance', manageServices: 'Manage Active Services', backHome: '← Back to Home', loginDescription: 'Log in with your K-mate account.', noAccount: "Don't have an account?", register: 'Sign Up', name: 'Name', email: 'Email', password: 'Password', role: 'Role', student: 'Student', administrator: 'Administrator', registering: 'Signing up...', haveAccount: 'Already have an account?', namePlaceholder: 'Your name', passwordPlaceholder: 'At least 8 characters',
    courseListAdminDescription: 'Review registered services and add a new service with an administrator account.', noServices: 'There are no services in this category.', createFirstService: 'Add the First Service', serviceCreateDescription: 'Register a new service with an administrator account.', serviceName: 'Service Name', serviceNamePlaceholder: 'e.g. Bank Account Guide for International Students', serviceDescription: 'Service Description', serviceDescriptionPlaceholder: 'Describe the service, eligibility, and process.', category: 'Category', selectCategory: 'Select a category', cancel: 'Cancel', creating: 'Creating...',
    department: 'Department', applicants: 'Applicants', peopleUnit: '{count}', processing: 'Processing...', availableImmediately: '✅ Apply immediately', applicationHistory: '✅ Check application status anytime', departmentGuide: '✅ Department guidance included', serviceLoadFailed: 'Unable to load service information.', defaultServiceDescription: 'Get the support you need through this administrator-prepared program.', imagePreparing: 'Image coming soon', departmentUnknown: 'Department information unavailable', operatorCannotApply: 'Administrators cannot apply', goToApplications: 'Go to My Applications', applicationPending: 'Application submitted · Pending', apply: 'Apply', operatorHelp: 'Administrators cannot apply for programs they registered.', activeHelp: 'You have already applied. View it in My Applications.', pendingHelp: 'Your application was submitted. Check its status in My Applications.', applyHelp: 'Submitting completes your application and payment when applicable.',
    myServiceList: 'My Services', instructor: 'Instructor', active: 'Active', pending: 'Pending', viewCourse: 'View Service', noActiveServices: 'You have no active services.', user: 'User', recommendedServices: 'Recommended Services', noRecommendations: 'No service recommendations are available yet.', myCreatedServices: 'Services I Added', myCreatedServicesDescription: 'Review your services and the user count for each.', createdServiceCount: 'Services Added', totalUserCount: 'Total Users', noDescription: 'No description provided.', userCount: 'Users', serviceId: 'Service ID', viewService: 'View Service', noCreatedServices: 'You have not added any services yet.', adminOnlyCreate: 'Only administrators can add services.', enterServiceName: 'Enter a service name.', enterServiceDescription: 'Enter a service description.', chooseCategory: 'Select a category.', serviceCreateSuccess: 'The service was added successfully.', serviceCreateFailed: 'Failed to add the service.', invalidService: 'The service information is invalid.', applicationFailed: 'Failed to submit the application.', registerSuccess: 'Sign-up complete! Redirecting to the login page.', registerFailed: 'Sign-up failed.', preparingRecommendations: 'Preparing service recommendations.', recommendationLoadFailed: 'Unable to load recommendations right now. Please try again later.', instructorServicesLoadFailed: 'Unable to load service information right now. Please try again later.', loginProcessing: 'Logging you in...', loginFailed: 'Login failed. Please try again.', invalidLoginRequest: 'Invalid login request.', loginComplete: 'Login complete! Redirecting...', loginProcessFailed: 'Unable to complete login.'
  },
  zh: {
    language: '语言', service: '服务', myServices: '我的服务', login: '登录', logout: '退出登录', getStarted: '开始使用', menu: '菜单', account: '账户', serviceList: '服务列表', myApplications: '我的申请', myPage: '个人中心', serviceCreate: '添加服务',
    landingBadge: '基于 MSA 的服务平台', landingTitleLine1: '让生活更便利，', landingTitleLine2: '让学习更高效', browseServices: '浏览服务', studentsAbroad: '留学生', users: '使用学生', popularServices: '热门服务', viewAll: '查看全部 →', whyLearnNexus: '为什么选择 K-mate？', startNow: '立即开始', ctaDescription: '数百名留学生正在与 K-mate 一起成长。', startFree: '免费开始',
    landingServiceHospital: '留学生医院事务协助', landingServiceFinance: '留学生金融事务协助', landingServiceAdmin: '留学生行政事务协助', landingServiceTranslation: '留学生课程翻译服务', landingServiceNotes: '课程笔记整理服务', landingServiceCampus: '留学生校园生活指南',
    featureFastTitle: '快速办理留学生事务', featureFastDesc: '提供实用协助，让留学生生活更加顺利。', featureRecommendTitle: '个性化服务推荐', featureRecommendDesc: 'AI 分析服务使用记录，为您推荐合适的服务。', featureEasyTitle: '便捷申请服务', featureEasyDesc: '一键即可申请所需服务。', featureAnywhereTitle: '随时随地使用', featureAnywhereDesc: '可在电脑、平板和手机上顺畅使用。',
    healthcare: '医疗', backend: '后端', frontend: '前端', data: '数据', finance: '金融', admin: '行政', security: '法律与安全', academic: '学业', life: '生活', all: '全部', enrolledCount: '{count}名学员',
    welcomeBackLine1: '欢迎', welcomeBackLine2: '回来', continueJourney: '登录并继续您的旅程。', assistStudents: '留学生协助服务', manageServices: '管理使用中的服务', backHome: '← 返回首页', loginDescription: '使用 K-mate 账户登录。', noAccount: '还没有账户？', register: '注册', name: '姓名', email: '电子邮箱', password: '密码', role: '角色', student: '学生', administrator: '管理员', registering: '注册中...', haveAccount: '已有账户？', namePlaceholder: '请输入姓名', passwordPlaceholder: '至少8个字符',
    courseListAdminDescription: '管理员可查看已注册的服务并添加新服务。', noServices: '该分类下暂无服务。', createFirstService: '添加第一个服务', serviceCreateDescription: '使用管理员账户添加新服务。', serviceName: '服务名称', serviceNamePlaceholder: '例如：留学生银行开户指南', serviceDescription: '服务说明', serviceDescriptionPlaceholder: '请输入服务介绍、申请对象和办理方式。', category: '分类', selectCategory: '请选择分类', cancel: '取消', creating: '添加中...',
    department: '负责部门', applicants: '申请人数', peopleUnit: '{count}人', processing: '处理中...', availableImmediately: '✅ 可立即申请', applicationHistory: '✅ 可随时查看申请记录', departmentGuide: '✅ 提供负责部门指南', serviceLoadFailed: '无法加载服务信息。', defaultServiceDescription: '这是由学校管理员准备的项目，您可以获得所需支持。', imagePreparing: '图片准备中', departmentUnknown: '暂无负责部门信息', operatorCannotApply: '管理员不可申请', goToApplications: '前往我的申请', applicationPending: '申请完成 · 处理中', apply: '申请', operatorHelp: '管理员无法申请自己注册的项目。', activeHelp: '您已申请此服务，可在我的申请中查看。', pendingHelp: '申请已提交，可在我的申请中查看处理状态。', applyHelp: '提交后即完成申请，如为付费服务则同时完成付款。',
    myServiceList: '我的服务', instructor: '负责人', active: '使用中', pending: '等待中', viewCourse: '查看服务', noActiveServices: '暂无使用中的服务。', user: '用户', recommendedServices: '推荐服务', noRecommendations: '暂时没有可推荐的服务。', myCreatedServices: '我添加的服务', myCreatedServicesDescription: '查看已添加服务及各服务的用户数量。', createdServiceCount: '已添加服务数', totalUserCount: '总用户数', noDescription: '暂无说明。', userCount: '用户数', serviceId: '服务 ID', viewService: '查看服务', noCreatedServices: '尚未添加任何服务。', adminOnlyCreate: '仅管理员可以添加服务。', enterServiceName: '请输入服务名称。', enterServiceDescription: '请输入服务说明。', chooseCategory: '请选择分类。', serviceCreateSuccess: '服务添加成功。', serviceCreateFailed: '服务添加失败。', invalidService: '服务信息无效。', applicationFailed: '服务申请失败。', registerSuccess: '注册成功！正在返回登录页面。', registerFailed: '注册失败。', preparingRecommendations: '正在准备服务推荐。', recommendationLoadFailed: '目前无法加载推荐服务，请稍后重试。', instructorServicesLoadFailed: '目前无法加载服务信息，请稍后重试。', loginProcessing: '正在登录...', loginFailed: '登录失败，请重试。', invalidLoginRequest: '无效的登录请求。', loginComplete: '登录成功！正在跳转...', loginProcessFailed: '登录处理失败。'
  },
  ja: {
    language: '言語', service: 'サービス', myServices: 'マイサービス', login: 'ログイン', logout: 'ログアウト', getStarted: '始める', menu: 'メニュー', account: 'アカウント', serviceList: 'サービス一覧', myApplications: '申請一覧', myPage: 'マイページ', serviceCreate: 'サービス登録',
    landingBadge: 'MSAベースのサービス提供プラットフォーム', landingTitleLine1: '生活をもっと便利に、', landingTitleLine2: '学びをもっと速く', browseServices: 'サービスを見る', studentsAbroad: '留学生', users: '利用学生', popularServices: '人気サービス', viewAll: 'すべて見る →', whyLearnNexus: 'K-mateを選ぶ理由', startNow: '今すぐ始めましょう', ctaDescription: '多くの留学生がK-mateとともに成長しています。', startFree: '無料で始める',
    landingServiceHospital: '留学生向け病院手続き支援', landingServiceFinance: '留学生向け金融手続き支援', landingServiceAdmin: '留学生向け行政手続き支援', landingServiceTranslation: '留学生向け講義翻訳サービス', landingServiceNotes: '講義ノート整理支援', landingServiceCampus: '留学生向け学校生活案内',
    featureFastTitle: '留学生の迅速な手続き支援', featureFastDesc: '留学生の生活を円滑にする実用的な支援サービスを提供します。', featureRecommendTitle: 'パーソナライズされたおすすめ', featureRecommendDesc: 'AIが利用履歴を分析し、最適なサービスをおすすめします。', featureEasyTitle: '簡単なサービス申請', featureEasyDesc: 'ワンクリックですぐにサービスを申請できます。', featureAnywhereTitle: 'いつでもどこでも', featureAnywhereDesc: 'PC、タブレット、スマートフォンで途切れることなく利用できます。',
    healthcare: '医療', backend: 'バックエンド', frontend: 'フロントエンド', data: 'データ', finance: '金融', admin: '行政', security: '法律・安全', academic: '学業', life: '生活', all: 'すべて', enrolledCount: '受講者 {count}名',
    welcomeBackLine1: 'おかえりなさい', welcomeBackLine2: 'またお会いできました', continueJourney: 'ログインして、あなたの旅を続けましょう。', assistStudents: '留学生支援サービス', manageServices: '利用中サービスの管理', backHome: '← ホームへ', loginDescription: 'K-mateアカウントでログインします。', noAccount: 'アカウントをお持ちでないですか？', register: '会員登録', name: '名前', email: 'メール', password: 'パスワード', role: '役割', student: '学生', administrator: '管理者', registering: '登録中...', haveAccount: 'すでにアカウントをお持ちですか？', namePlaceholder: 'お名前', passwordPlaceholder: '8文字以上',
    courseListAdminDescription: '管理者アカウントで登録済みサービスの確認と新規追加ができます。', noServices: 'このカテゴリーにはサービスがありません。', createFirstService: '最初のサービスを登録', serviceCreateDescription: '管理者アカウントで新しいサービスを登録します。', serviceName: 'サービス名', serviceNamePlaceholder: '例：留学生向け口座開設ガイド', serviceDescription: 'サービス説明', serviceDescriptionPlaceholder: 'サービス内容、対象者、進行方法などを入力してください。', category: 'カテゴリー', selectCategory: 'カテゴリーを選択', cancel: 'キャンセル', creating: '登録中...',
    department: '担当部署', applicants: '申請者', peopleUnit: '{count}名', processing: '処理中...', availableImmediately: '✅ すぐに申請可能', applicationHistory: '✅ 申請履歴をいつでも確認', departmentGuide: '✅ 担当部署の案内を提供', serviceLoadFailed: 'サービス情報を読み込めませんでした。', defaultServiceDescription: '学校管理者が用意したプログラムで、必要な支援を受けられます。', imagePreparing: '画像準備中です', departmentUnknown: '担当部署の情報がありません', operatorCannotApply: '管理者は申請できません', goToApplications: '申請一覧へ移動', applicationPending: '申請完了・処理中', apply: '申請する', operatorHelp: '管理者は自分が登録したプログラムに申請できません。', activeHelp: 'すでに申請済みです。申請一覧から確認できます。', pendingHelp: '申請を受け付けました。処理状況は申請一覧で確認できます。', applyHelp: '申請すると、有料サービスの場合は決済と同時に受付が完了します。',
    myServiceList: 'マイサービス一覧', instructor: '担当者', active: '利用中', pending: '待機中', viewCourse: 'サービスを見る', noActiveServices: '利用中のサービスはありません。', user: 'ユーザー', recommendedServices: 'おすすめサービス', noRecommendations: 'おすすめできるサービスはまだありません。', myCreatedServices: '登録したサービス', myCreatedServicesDescription: '登録したサービスと各サービスの利用者数を確認できます。', createdServiceCount: '登録サービス数', totalUserCount: '総利用者数', noDescription: '説明がありません。', userCount: '利用者数', serviceId: 'サービスID', viewService: 'サービスを見る', noCreatedServices: '登録したサービスはまだありません。', adminOnlyCreate: '管理者アカウントのみサービスを登録できます。', enterServiceName: 'サービス名を入力してください。', enterServiceDescription: 'サービス説明を入力してください。', chooseCategory: 'カテゴリーを選択してください。', serviceCreateSuccess: 'サービスを登録しました。', serviceCreateFailed: 'サービスの登録に失敗しました。', invalidService: 'サービス情報が正しくありません。', applicationFailed: 'サービスの申請に失敗しました。', registerSuccess: '会員登録が完了しました。ログイン画面へ移動します。', registerFailed: '会員登録に失敗しました。', preparingRecommendations: 'おすすめサービスを準備しています。', recommendationLoadFailed: 'おすすめサービスを読み込めませんでした。しばらくしてから再度お試しください。', instructorServicesLoadFailed: 'サービス情報を読み込めませんでした。しばらくしてから再度お試しください。', loginProcessing: 'ログイン処理中...', loginFailed: 'ログインに失敗しました。もう一度お試しください。', invalidLoginRequest: '無効なログインリクエストです。', loginComplete: 'ログイン完了。移動中...', loginProcessFailed: 'ログイン処理に失敗しました。'
  },
  vi: {
    language: 'Ngôn ngữ', service: 'Dịch vụ', myServices: 'Dịch vụ của tôi', login: 'Đăng nhập', logout: 'Đăng xuất', getStarted: 'Bắt đầu', menu: 'Menu', account: 'Tài khoản', serviceList: 'Danh sách dịch vụ', myApplications: 'Đơn đăng ký của tôi', myPage: 'Trang cá nhân', serviceCreate: 'Đăng ký dịch vụ',
    landingBadge: 'Nền tảng cung cấp dịch vụ dựa trên MSA', landingTitleLine1: 'Cuộc sống tiện lợi hơn,', landingTitleLine2: 'học tập nhanh hơn', browseServices: 'Khám phá dịch vụ', studentsAbroad: 'Du học sinh', users: 'Sinh viên sử dụng', popularServices: 'Dịch vụ phổ biến', viewAll: 'Xem tất cả →', whyLearnNexus: 'Tại sao chọn K-mate?', startNow: 'Bắt đầu ngay hôm nay', ctaDescription: 'Hàng trăm du học sinh đang phát triển cùng K-mate.', startFree: 'Bắt đầu miễn phí',
    landingServiceHospital: 'Hỗ trợ thủ tục bệnh viện cho du học sinh', landingServiceFinance: 'Hỗ trợ tài chính cho du học sinh', landingServiceAdmin: 'Hỗ trợ hành chính cho du học sinh', landingServiceTranslation: 'Dịch bài giảng cho du học sinh', landingServiceNotes: 'Hỗ trợ sắp xếp ghi chú bài giảng', landingServiceCampus: 'Hướng dẫn đời sống học đường cho du học sinh',
    featureFastTitle: 'Xử lý nhanh thủ tục cho du học sinh', featureFastDesc: 'Cung cấp dịch vụ hỗ trợ thiết thực giúp cuộc sống du học thuận lợi hơn.', featureRecommendTitle: 'Đề xuất dịch vụ phù hợp', featureRecommendDesc: 'AI phân tích lịch sử sử dụng để đề xuất dịch vụ phù hợp nhất.', featureEasyTitle: 'Đăng ký dịch vụ dễ dàng', featureEasyDesc: 'Đăng ký và nhận dịch vụ chỉ với một lần nhấp.', featureAnywhereTitle: 'Mọi lúc, mọi nơi', featureAnywhereDesc: 'Sử dụng liền mạch trên máy tính, máy tính bảng và điện thoại.',
    healthcare: 'Y tế', backend: 'Backend', frontend: 'Frontend', data: 'Dữ liệu', finance: 'Tài chính', admin: 'Hành chính', security: 'Pháp lý & An toàn', academic: 'Học tập', life: 'Đời sống', all: 'Tất cả', enrolledCount: '{count} học viên',
    welcomeBackLine1: 'Chào mừng', welcomeBackLine2: 'bạn trở lại', continueJourney: 'Đăng nhập để tiếp tục hành trình của bạn.', assistStudents: 'Dịch vụ hỗ trợ du học sinh', manageServices: 'Quản lý dịch vụ đang sử dụng', backHome: '← Về trang chủ', loginDescription: 'Đăng nhập bằng tài khoản K-mate.', noAccount: 'Bạn chưa có tài khoản?', register: 'Đăng ký', name: 'Họ tên', email: 'Email', password: 'Mật khẩu', role: 'Vai trò', student: 'Sinh viên', administrator: 'Quản trị viên', registering: 'Đang đăng ký...', haveAccount: 'Bạn đã có tài khoản?', namePlaceholder: 'Họ tên của bạn', passwordPlaceholder: 'Tối thiểu 8 ký tự',
    courseListAdminDescription: 'Quản trị viên có thể xem các dịch vụ đã đăng ký và thêm dịch vụ mới.', noServices: 'Không có dịch vụ trong danh mục này.', createFirstService: 'Thêm dịch vụ đầu tiên', serviceCreateDescription: 'Đăng ký dịch vụ mới bằng tài khoản quản trị viên.', serviceName: 'Tên dịch vụ', serviceNamePlaceholder: 'Ví dụ: Hướng dẫn mở tài khoản cho du học sinh', serviceDescription: 'Mô tả dịch vụ', serviceDescriptionPlaceholder: 'Nhập giới thiệu, đối tượng và quy trình thực hiện dịch vụ.', category: 'Danh mục', selectCategory: 'Chọn danh mục', cancel: 'Hủy', creating: 'Đang đăng ký...',
    department: 'Bộ phận phụ trách', applicants: 'Người đăng ký', peopleUnit: '{count} người', processing: 'Đang xử lý...', availableImmediately: '✅ Có thể đăng ký ngay', applicationHistory: '✅ Xem trạng thái đăng ký bất cứ lúc nào', departmentGuide: '✅ Có hướng dẫn từ bộ phận phụ trách', serviceLoadFailed: 'Không thể tải thông tin dịch vụ.', defaultServiceDescription: 'Nhận hỗ trợ cần thiết qua chương trình do nhà trường chuẩn bị.', imagePreparing: 'Hình ảnh đang được chuẩn bị', departmentUnknown: 'Chưa có thông tin bộ phận phụ trách', operatorCannotApply: 'Quản trị viên không thể đăng ký', goToApplications: 'Đi đến đơn đăng ký của tôi', applicationPending: 'Đã đăng ký · Đang xử lý', apply: 'Đăng ký', operatorHelp: 'Quản trị viên không thể đăng ký chương trình do mình tạo.', activeHelp: 'Bạn đã đăng ký dịch vụ này. Hãy kiểm tra trong danh sách đơn đăng ký.', pendingHelp: 'Đơn đã được tiếp nhận. Bạn có thể kiểm tra trạng thái trong danh sách đơn đăng ký.', applyHelp: 'Khi gửi đơn, việc đăng ký và thanh toán (nếu có) sẽ được hoàn tất.',
    myServiceList: 'Danh sách dịch vụ của tôi', instructor: 'Người phụ trách', active: 'Đang sử dụng', pending: 'Đang chờ', viewCourse: 'Xem dịch vụ', noActiveServices: 'Bạn chưa có dịch vụ đang sử dụng.', user: 'Người dùng', recommendedServices: 'Dịch vụ đề xuất', noRecommendations: 'Chưa có dịch vụ phù hợp để đề xuất.', myCreatedServices: 'Dịch vụ tôi đã đăng ký', myCreatedServicesDescription: 'Xem dịch vụ đã đăng ký và số người dùng của từng dịch vụ.', createdServiceCount: 'Số dịch vụ đã đăng ký', totalUserCount: 'Tổng số người dùng', noDescription: 'Không có mô tả.', userCount: 'Số người dùng', serviceId: 'ID dịch vụ', viewService: 'Xem dịch vụ', noCreatedServices: 'Bạn chưa đăng ký dịch vụ nào.', adminOnlyCreate: 'Chỉ tài khoản quản trị viên mới có thể đăng ký dịch vụ.', enterServiceName: 'Vui lòng nhập tên dịch vụ.', enterServiceDescription: 'Vui lòng nhập mô tả dịch vụ.', chooseCategory: 'Vui lòng chọn danh mục.', serviceCreateSuccess: 'Đã đăng ký dịch vụ thành công.', serviceCreateFailed: 'Không thể đăng ký dịch vụ.', invalidService: 'Thông tin dịch vụ không hợp lệ.', applicationFailed: 'Không thể gửi đơn đăng ký.', registerSuccess: 'Đăng ký tài khoản thành công! Đang chuyển đến trang đăng nhập.', registerFailed: 'Đăng ký tài khoản thất bại.', preparingRecommendations: 'Đang chuẩn bị dịch vụ đề xuất.', recommendationLoadFailed: 'Hiện không thể tải dịch vụ đề xuất. Vui lòng thử lại sau.', instructorServicesLoadFailed: 'Hiện không thể tải thông tin dịch vụ. Vui lòng thử lại sau.', loginProcessing: 'Đang xử lý đăng nhập...', loginFailed: 'Đăng nhập thất bại. Vui lòng thử lại.', invalidLoginRequest: 'Yêu cầu đăng nhập không hợp lệ.', loginComplete: 'Đăng nhập thành công! Đang chuyển trang...', loginProcessFailed: 'Không thể xử lý đăng nhập.'
  }
}

// DB에 저장된 서비스 ID를 기준으로 제목만 번역합니다. 설명은 한국어 원문을 유지합니다.
const courseTitleTranslations = {
  en: {
    1: 'AI Symptom Analysis and Department Recommendation',
    2: 'Hospital, Health Insurance and Medical Cost Guide',
    3: 'Multilingual Symptom and Medical Terminology Interpretation',
    4: 'Prescription, Medication and Follow-up Guide',
    5: 'Sick Leave, Attendance and Required Documents Guide',
    6: 'Bank Account Opening and Required Documents Guide',
    7: 'Tuition, Virtual Account and International Transfer Guide',
    8: 'Scholarship and Refund Schedule Guide',
    9: 'AI Consultation for School Financial Policies and FAQs',
    10: 'School Financial Program Recommendations',
    11: 'Visa Issuance, Extension and Foreigner Registration Guide',
    12: 'Address Change and Part-time Work Administration Guide',
    13: 'Personalized Required Documents by Visa Status',
    14: 'Visa Expiration and Reporting Deadline Management',
    15: 'School Group Application Program',
    16: 'International Office Connection and Multilingual Administrative Consultation',
    17: 'AI Risk Analysis for Rental Contracts',
    18: 'Standard Contract Comparison Service',
    19: 'Risky Part-time Job and Voice Phishing Alerts',
    20: 'Police, Embassy and Emergency Contact Guide',
    21: 'University Legal Consultation Program Connection',
    22: 'Real-time Lecture Captions and Multilingual Translation',
    23: 'AI Lecture Summary and Key Point Organization',
    24: 'Easy Explanations of Major and Technical Terms',
    25: 'Academic Writing and Citation Guide',
    26: 'AI Writing Review and Academic Integrity Guide',
    27: 'Real-time Team Project Translation and Summary',
    28: 'Tutoring and Academic Support Program Recommendations'
  },
  zh: {
    1: 'AI 症状分析与科室推荐',
    2: '医院、健康保险与诊疗费用指南',
    3: '症状与医疗术语多语种口译支持',
    4: '处方、用药与复诊指南',
    5: '病假、出勤认定与所需材料指南',
    6: '银行开户流程与所需材料指南',
    7: '学费、虚拟账户与海外汇款指南',
    8: '奖学金与退款日程指南',
    9: '学校金融政策与常见问题 AI 咨询',
    10: '学校金融相关项目推荐',
    11: '签证签发、延期与外国人登记指南',
    12: '居住地变更与兼职就业行政指南',
    13: '按居留资格定制所需材料',
    14: '签证到期日与申报期限管理',
    15: '学校集体申请项目',
    16: '国际处对接与多语种行政咨询',
    17: '租赁合同 AI 风险分析',
    18: '标准合同对比服务',
    19: '高风险兼职与电信诈骗警示',
    20: '警察局、大使馆与紧急机构指南',
    21: '大学法律咨询项目对接',
    22: '课堂实时字幕与多语种翻译',
    23: 'AI 课程总结与重点整理',
    24: '专业与技术术语通俗解释',
    25: '学术写作与引用格式指南',
    26: 'AI 语句润色与学术诚信指南',
    27: '团队项目实时翻译与总结',
    28: '辅导与学习支持项目推荐'
  },
  ja: {
    1: 'AI症状分析・診療科案内',
    2: '病院・健康保険・診療費案内',
    3: '症状・医療用語の多言語通訳支援',
    4: '処方・服薬・再受診案内',
    5: '病欠・出席認定と必要書類案内',
    6: '口座開設手続き・必要書類案内',
    7: '授業料・仮想口座・海外送金案内',
    8: '奨学金・返金スケジュール案内',
    9: '学校の金融方針・FAQ AI相談',
    10: '学校の金融関連プログラム推薦',
    11: 'ビザ発給・延長・外国人登録案内',
    12: '居住地変更・アルバイト許可手続き案内',
    13: '在留資格別の必要書類案内',
    14: 'ビザ有効期限・届出期限管理',
    15: '学校の一括申請プログラム',
    16: '国際課連携・多言語行政相談',
    17: '賃貸借契約書のAIリスク分析',
    18: '標準契約書比較サービス',
    19: '危険なアルバイト・特殊詐欺警告',
    20: '警察署・大使館・緊急機関案内',
    21: '大学法律相談プログラム連携',
    22: '講義のリアルタイム字幕・多言語翻訳',
    23: 'AI講義要約・重要ポイント整理',
    24: '専門・技術用語のやさしい解説',
    25: '学術文章・引用形式案内',
    26: 'AI文章添削・研究倫理案内',
    27: 'チームプロジェクトのリアルタイム翻訳・要約',
    28: 'チュータリング・学習支援プログラム推薦'
  },
  vi: {
    1: 'Phân tích triệu chứng bằng AI và gợi ý chuyên khoa',
    2: 'Hướng dẫn bệnh viện, bảo hiểm y tế và chi phí khám',
    3: 'Hỗ trợ phiên dịch đa ngôn ngữ về triệu chứng và thuật ngữ y tế',
    4: 'Hướng dẫn đơn thuốc, dùng thuốc và tái khám',
    5: 'Hướng dẫn nghỉ bệnh, công nhận chuyên cần và giấy tờ cần thiết',
    6: 'Hướng dẫn mở tài khoản và giấy tờ cần thiết',
    7: 'Hướng dẫn học phí, tài khoản ảo và chuyển tiền quốc tế',
    8: 'Hướng dẫn lịch học bổng và hoàn tiền',
    9: 'Tư vấn AI về chính sách tài chính và câu hỏi thường gặp của trường',
    10: 'Đề xuất chương trình tài chính của trường',
    11: 'Hướng dẫn cấp, gia hạn visa và đăng ký người nước ngoài',
    12: 'Hướng dẫn đổi nơi cư trú và thủ tục làm thêm',
    13: 'Hướng dẫn giấy tờ theo tư cách lưu trú',
    14: 'Quản lý ngày hết hạn visa và thời hạn khai báo',
    15: 'Chương trình đăng ký tập thể của trường',
    16: 'Kết nối phòng quốc tế và tư vấn hành chính đa ngôn ngữ',
    17: 'Phân tích rủi ro hợp đồng thuê nhà bằng AI',
    18: 'Dịch vụ so sánh hợp đồng tiêu chuẩn',
    19: 'Cảnh báo việc làm thêm rủi ro và lừa đảo qua điện thoại',
    20: 'Hướng dẫn cảnh sát, đại sứ quán và cơ quan khẩn cấp',
    21: 'Kết nối chương trình tư vấn pháp lý của trường',
    22: 'Phụ đề bài giảng thời gian thực và dịch đa ngôn ngữ',
    23: 'Tóm tắt bài giảng và sắp xếp nội dung chính bằng AI',
    24: 'Giải thích dễ hiểu thuật ngữ chuyên ngành và kỹ thuật',
    25: 'Hướng dẫn viết học thuật và trích dẫn',
    26: 'Chỉnh sửa câu bằng AI và hướng dẫn liêm chính học thuật',
    27: 'Dịch và tóm tắt dự án nhóm theo thời gian thực',
    28: 'Đề xuất chương trình gia sư và hỗ trợ học tập'
  }
}

// DB에 저장된 서비스 ID를 기준으로 설명을 번역합니다.
// courseTitleTranslations와 동일한 구조(언어 -> 서비스 ID -> 번역문)를 사용합니다.
const courseDescriptionTranslations = {
  en: {
    1: 'AI analyzes the symptoms and affected area you enter to recommend the right department to visit. If emergency signs are suspected, it also provides emergency contacts and response steps you can use right away.'
  },
  zh: {
    1: 'AI 会分析您输入的症状和不适部位，为您推荐适合就诊的科室。如疑似出现紧急症状，还会提供可立即使用的紧急联系方式和应对方法。'
  },
  ja: {
    1: '入力した症状と不快な部位をAIが分析し、受診に適した診療科をご案内します。緊急の兆候が疑われる場合は、すぐに利用できる緊急連絡先と対応方法もあわせて提供します。'
  },
  vi: {
    1: 'AI phân tích triệu chứng và vị trí khó chịu bạn nhập vào để hướng dẫn khoa khám phù hợp. Nếu nghi ngờ có dấu hiệu khẩn cấp, hệ thống cũng cung cấp số liên lạc khẩn cấp và cách xử lý có thể sử dụng ngay.'
  }
}

export function useI18n() {
  const locale = computed(() => language.value)

  function setLocale(nextLanguage) {
    if (!supportedLanguages.includes(nextLanguage)) return
    language.value = nextLanguage
    localStorage.setItem(STORAGE_KEY, nextLanguage)
    document.documentElement.lang = nextLanguage === 'zh' ? 'zh-CN' : nextLanguage
  }

  function t(key, params = {}) {
    const template = messages[language.value]?.[key] ?? messages.ko[key] ?? key
    return Object.entries(params).reduce(
      (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
      template
    )
  }

  function translateCourseTitle(courseId, fallbackTitle) {
    return courseTitleTranslations[language.value]?.[Number(courseId)] ?? fallbackTitle
  }

  function translateCourseDescription(courseId, fallbackDescription) {
    return courseDescriptionTranslations[language.value]?.[Number(courseId)] ?? fallbackDescription
  }

  return { locale, setLocale, t, translateCourseTitle, translateCourseDescription }
}