import config from '@/config'

const BASE_URL = config.API_BASE_URL

export async function apiFetch(endpoint: string, options?: RequestInit) {
  const token = localStorage.getItem('token')
  
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  })

  if (!response.ok) {
  const text = await response.text()
  if (response.status !== 404) {
    console.error('API error status:', response.status)
    console.error('API error body:', text)
  }
  throw new Error(text || `HTTP ${response.status}`)
}

  const text = await response.text()
  if (!text) return {}
  return JSON.parse(text)
}