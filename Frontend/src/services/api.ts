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
    throw new Error(`API error: ${response.status}`)
  }

  return response.json()
}