const API_BASE_URL = 'http://localhost:8080/api'
const TOKEN_KEY = 'access_token'

const categoryLabels = {
  BACKEND: '백엔드',
  FRONTEND: '프론트엔드',
  DEVOPS: 'DevOps',
  DATA_SCIENCE: '데이터',
  MOBILE: '모바일',
  SECURITY: '보안',
  DATABASE: '데이터베이스',
  OTHER: '기타'
}

const elements = {
  tokenInput: document.querySelector('#token-input'),
  tokenStatus: document.querySelector('#token-status'),
  responseLog: document.querySelector('#response-log'),
  serviceList: document.querySelector('#service-list'),
  serviceDetailResult: document.querySelector('#service-detail-result'),
  enrollmentListResult: document.querySelector('#enrollment-list-result'),
  recommendationResult: document.querySelector('#recommendation-result')
}

/**
 * API Gateway 호출을 한 함수로 모아 토큰, JSON 변환, 오류 처리를 동일하게 적용한다.
 * 서버가 JSON이 아닌 오류 본문을 반환해도 내용을 잃지 않도록 문자열 응답도 처리한다.
 */
async function apiFetch(path, options = {}) {
  const token = sessionStorage.getItem(TOKEN_KEY)
  const headers = new Headers(options.headers || {})

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  })

  const contentType = response.headers.get('content-type') || ''
  const data = response.status === 204
    ? null
    : contentType.includes('application/json')
      ? await response.json()
      : await response.text()

  writeResponseLog(options.method || 'GET', path, response.status, data)

  if (!response.ok) {
    const message = data?.message || data || `요청에 실패했습니다. (${response.status})`
    throw new Error(message)
  }

  return data
}

function unwrap(payload) {
  return payload && Object.prototype.hasOwnProperty.call(payload, 'data')
    ? payload.data
    : payload
}

function writeResponseLog(method, path, status, data) {
  elements.responseLog.textContent = JSON.stringify({
    method,
    url: `${API_BASE_URL}${path}`,
    status,
    data
  }, null, 2)
}

function setMessage(elementId, message, type) {
  const element = document.querySelector(`#${elementId}`)
  element.textContent = message
  element.className = `message show ${type}`
}

async function withLoading(button, label, task) {
  const originalLabel = button.textContent
  button.disabled = true
  button.textContent = label

  try {
    return await task()
  } finally {
    button.disabled = false
    button.textContent = originalLabel
  }
}

function formatPrice(value) {
  const price = Number(value ?? 0)
  return Number.isNaN(price) ? '-' : `${price.toLocaleString()}원`
}

function normalizeCategory(category) {
  return categoryLabels[category] || category || '기타'
}

function createEmpty(message) {
  const element = document.createElement('div')
  element.className = 'empty'
  element.textContent = message
  return element
}

/** 동적 API 데이터는 innerHTML 대신 textContent로 넣어 스크립트 삽입을 방지한다. */
function createServiceCard(service, showDetailButton = true) {
  const article = document.createElement('article')
  article.className = 'service-item'

  const badge = document.createElement('span')
  badge.className = 'badge'
  badge.textContent = normalizeCategory(service.category)

  const title = document.createElement('h3')
  title.textContent = service.title || `서비스 #${service.id}`

  const description = document.createElement('p')
  description.textContent = service.description || '등록된 설명이 없습니다.'

  const meta = document.createElement('div')
  meta.className = 'service-meta'

  const provider = document.createElement('span')
  provider.textContent = `제공자 #${service.instructorId ?? '-'}`

  const price = document.createElement('strong')
  price.textContent = formatPrice(service.price)

  meta.append(provider, price)
  article.append(badge, title, description, meta)

  if (showDetailButton) {
    const button = document.createElement('button')
    button.className = 'button secondary'
    button.type = 'button'
    button.textContent = '상세 보기'
    button.addEventListener('click', () => {
      document.querySelector('#service-detail-id').value = service.id
      document.querySelector('#enrollment-course-id').value = service.id
      loadServiceDetail(service.id)
    })
    article.append(button)
  }

  return article
}

function renderServices(container, services, emptyMessage) {
  container.replaceChildren()

  if (!Array.isArray(services) || services.length === 0) {
    container.append(createEmpty(emptyMessage))
    return
  }

  services.forEach(service => container.append(createServiceCard(service)))
}

function renderKeyValueResult(container, data) {
  container.replaceChildren()

  if (!data || typeof data !== 'object') {
    container.append(createEmpty('표시할 데이터가 없습니다.'))
    return
  }

  const table = document.createElement('table')
  table.className = 'result-table'
  const body = document.createElement('tbody')

  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null) return

    const row = document.createElement('tr')
    const keyCell = document.createElement('th')
    const valueCell = document.createElement('td')
    keyCell.textContent = key
    valueCell.textContent = value ?? '-'
    row.append(keyCell, valueCell)
    body.append(row)
  })

  table.append(body)
  container.append(table)
}

function updateTokenStatus() {
  const hasToken = Boolean(sessionStorage.getItem(TOKEN_KEY))
  elements.tokenStatus.textContent = hasToken
    ? '토큰이 sessionStorage에 저장되어 있습니다.'
    : '저장된 토큰이 없습니다.'
  elements.tokenStatus.classList.toggle('saved', hasToken)
}

document.querySelector('#save-token-button').addEventListener('click', () => {
  const token = elements.tokenInput.value.trim().replace(/^Bearer\s+/i, '')

  if (!token) {
    elements.tokenStatus.textContent = '저장할 토큰을 입력해 주세요.'
    elements.tokenStatus.classList.remove('saved')
    return
  }

  sessionStorage.setItem(TOKEN_KEY, token)
  elements.tokenInput.value = ''
  updateTokenStatus()
})

document.querySelector('#clear-token-button').addEventListener('click', () => {
  sessionStorage.removeItem(TOKEN_KEY)
  elements.tokenInput.value = ''
  updateTokenStatus()
})

document.querySelector('#register-form').addEventListener('submit', async event => {
  event.preventDefault()
  const button = event.currentTarget.querySelector('button[type="submit"]')

  await withLoading(button, '가입 중...', async () => {
    try {
      const payload = {
        name: document.querySelector('#register-name').value.trim(),
        email: document.querySelector('#register-email').value.trim(),
        password: document.querySelector('#register-password').value,
        role: document.querySelector('#register-role').value
      }
      const response = await apiFetch('/users/register', {
        method: 'POST',
        body: JSON.stringify(payload)
      })
      const user = unwrap(response)
      setMessage('register-message', `회원가입이 완료되었습니다. 회원 ID: ${user?.id ?? '-'}`, 'success')
      document.querySelector('#user-id').value = user?.id ?? ''
      event.currentTarget.reset()
    } catch (error) {
      setMessage('register-message', error.message, 'error')
    }
  })
})

document.querySelector('#user-form').addEventListener('submit', async event => {
  event.preventDefault()
  const button = event.currentTarget.querySelector('button[type="submit"]')
  const userId = document.querySelector('#user-id').value

  await withLoading(button, '조회 중...', async () => {
    try {
      const response = await apiFetch(`/users/${userId}`)
      renderKeyValueResult(document.querySelector('#user-result'), unwrap(response))
    } catch (error) {
      document.querySelector('#user-result').replaceChildren(createEmpty(error.message))
    }
  })
})

async function loadServices() {
  const category = document.querySelector('#category-filter').value
  const path = category ? `/courses/category/${encodeURIComponent(category)}` : '/courses'

  try {
    const response = await apiFetch(path)
    renderServices(elements.serviceList, unwrap(response), '등록된 서비스가 없습니다.')
  } catch (error) {
    elements.serviceList.replaceChildren(createEmpty(error.message))
  }
}

document.querySelector('#load-services-button').addEventListener('click', event => {
  withLoading(event.currentTarget, '조회 중...', loadServices)
})

async function loadServiceDetail(serviceId) {
  try {
    const response = await apiFetch(`/courses/${serviceId}`)
    const service = unwrap(response)
    elements.serviceDetailResult.replaceChildren(createServiceCard(service, false))
  } catch (error) {
    elements.serviceDetailResult.replaceChildren(createEmpty(error.message))
  }
}

document.querySelector('#service-detail-form').addEventListener('submit', async event => {
  event.preventDefault()
  const button = event.currentTarget.querySelector('button[type="submit"]')
  const serviceId = document.querySelector('#service-detail-id').value
  await withLoading(button, '조회 중...', () => loadServiceDetail(serviceId))
})

document.querySelector('#service-create-form').addEventListener('submit', async event => {
  event.preventDefault()
  const button = event.currentTarget.querySelector('button[type="submit"]')

  await withLoading(button, '등록 중...', async () => {
    try {
      const payload = {
        title: document.querySelector('#service-title').value.trim(),
        description: document.querySelector('#service-description').value.trim(),
        category: document.querySelector('#service-category').value,
        price: Number(document.querySelector('#service-price').value)
      }
      const response = await apiFetch('/courses', {
        method: 'POST',
        body: JSON.stringify(payload)
      })
      const service = unwrap(response)
      setMessage('service-create-message', `서비스가 등록되었습니다. 서비스 ID: ${service?.id ?? '-'}`, 'success')
      document.querySelector('#service-detail-id').value = service?.id ?? ''
      event.currentTarget.reset()
      await loadServices()
    } catch (error) {
      setMessage('service-create-message', error.message, 'error')
    }
  })
})

document.querySelector('#enrollment-form').addEventListener('submit', async event => {
  event.preventDefault()
  const button = event.currentTarget.querySelector('button[type="submit"]')
  const courseId = Number(document.querySelector('#enrollment-course-id').value)

  await withLoading(button, '신청 중...', async () => {
    try {
      const response = await apiFetch('/enrollments', {
        method: 'POST',
        body: JSON.stringify({ courseId })
      })
      const enrollment = unwrap(response)
      setMessage(
        'enrollment-message',
        `신청이 접수되었습니다. 신청 ID: ${enrollment?.id ?? '-'}, 상태: ${enrollment?.status ?? '-'}`,
        'success'
      )
    } catch (error) {
      setMessage('enrollment-message', error.message, 'error')
    }
  })
})

function renderEnrollmentTable(enrollments) {
  elements.enrollmentListResult.replaceChildren()

  if (!Array.isArray(enrollments) || enrollments.length === 0) {
    elements.enrollmentListResult.append(createEmpty('이용 중인 서비스가 없습니다.'))
    return
  }

  const table = document.createElement('table')
  table.className = 'result-table'
  const head = document.createElement('thead')
  const headerRow = document.createElement('tr')

  ;['신청 ID', '서비스', '상태', '신청일'].forEach(label => {
    const cell = document.createElement('th')
    cell.textContent = label
    headerRow.append(cell)
  })
  head.append(headerRow)

  const body = document.createElement('tbody')
  enrollments.forEach(item => {
    const row = document.createElement('tr')
    const values = [
      item.id,
      item.course?.title || `서비스 #${item.courseId}`,
      item.status,
      item.createdAt ? new Date(item.createdAt).toLocaleString('ko-KR') : '-'
    ]

    values.forEach(value => {
      const cell = document.createElement('td')
      cell.textContent = value ?? '-'
      row.append(cell)
    })
    body.append(row)
  })

  table.append(head, body)
  elements.enrollmentListResult.append(table)
}

document.querySelector('#enrollment-list-form').addEventListener('submit', async event => {
  event.preventDefault()
  const button = event.currentTarget.querySelector('button[type="submit"]')
  const userId = document.querySelector('#enrollment-user-id').value

  await withLoading(button, '조회 중...', async () => {
    try {
      const response = await apiFetch(`/enrollments/user/${userId}`)
      renderEnrollmentTable(unwrap(response))
    } catch (error) {
      elements.enrollmentListResult.replaceChildren(createEmpty(error.message))
    }
  })
})

document.querySelector('#recommendation-form').addEventListener('submit', async event => {
  event.preventDefault()
  const button = event.currentTarget.querySelector('button[type="submit"]')
  const userId = document.querySelector('#recommendation-user-id').value

  await withLoading(button, '추천 중...', async () => {
    try {
      const response = await apiFetch(`/recommend/${userId}`)
      const payload = unwrap(response)
      const recommendations = payload?.recommendedCourses || payload || []
      renderServices(elements.recommendationResult, recommendations, '추천할 서비스가 없습니다.')
    } catch (error) {
      elements.recommendationResult.replaceChildren(createEmpty(error.message))
    }
  })
})

updateTokenStatus()
loadServices()
